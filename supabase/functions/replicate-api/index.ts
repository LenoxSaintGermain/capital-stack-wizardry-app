import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReplicateRequest {
  modelVersion: string;
  input: Record<string, any>;
  webhook?: string;
  webhook_events_filter?: string[];
}

interface BusinessAnalysisRequest {
  business_data: any;
  analysis_type: 'financial' | 'strategic' | 'market' | 'risk' | 'comprehensive';
  model_preference?: 'llama' | 'mistral' | 'codellama' | 'custom';
}

// Updated models for business analysis using current Replicate model names
const BUSINESS_ANALYSIS_MODELS = {
  financial_analysis: {
    llama: "meta/meta-llama-3-70b-instruct", // Updated to Llama 3 70B
    mistral: "mistralai/mixtral-8x7b-instruct-v0.1",
    deepseek: "deepseek-ai/deepseek-r1" // Added DeepSeek for reasoning
  },
  market_research: {
    llama: "meta/meta-llama-3-70b-instruct",
    flan: "replicate/flan-t5-xl"
  },
  document_analysis: {
    vision: "yorickvp/llava-13b",
    gpt4o: "openai/gpt-4o" // Added GPT-4o for multi-modal
  }
};

// Enhanced prompts for business analysis
const BUSINESS_ANALYSIS_PROMPTS = {
  financial: (business: any) => `You are a senior financial analyst with 15+ years in business acquisitions. Analyze this business opportunity and provide a detailed financial assessment in JSON format:

Business: ${business.business_name}
Asking Price: $${business.asking_price?.toLocaleString()}
Annual Revenue: $${business.annual_revenue?.toLocaleString()}
Annual Profit: $${business.annual_net_profit?.toLocaleString()}
Sector: ${business.sector}
Location: ${business.location}

Provide analysis in this exact JSON structure:
{
  "financial_health_score": 0.0-1.0,
  "automation_score": 0.0-1.0,
  "revenue_quality": "recurring|project_based|seasonal|mixed",
  "profit_margins": "percentage string",
  "cash_flow_predictability": 0.0-1.0,
  "growth_trajectory": "declining|stable|growing|rapidly_growing",
  "valuation_assessment": {
    "price_to_revenue": number,
    "price_to_profit": number,
    "industry_comparison": "below|at|above market"
  },
  "automation_opportunities": ["specific opportunities"],
  "financial_red_flags": ["specific concerns"],
  "working_capital_requirements": "low|medium|high",
  "seasonality_impact": 0.0-1.0
}`,

  strategic: (business: any) => `You are a strategic business consultant specializing in acquisition strategy. Analyze this business for strategic value and operational optimization:

Business: ${business.business_name}
Sector: ${business.sector}
Revenue: $${business.annual_revenue?.toLocaleString()}
Location: ${business.location}

Provide strategic analysis in JSON format:
{
  "strategic_value_score": 0.0-1.0,
  "competitive_moat": "weak|moderate|strong",
  "market_position": "leader|challenger|follower|niche",
  "scalability_potential": 0.0-1.0,
  "recommended_ownership_model": "absentee|semi_absentee|owner_operator",
  "strategic_flags": ["growth_potential", "automation_ready", "consolidation_target"],
  "growth_strategies": ["specific strategies"],
  "integration_complexity": "low|medium|high",
  "synergy_opportunities": ["revenue_enhancement", "cost_optimization"],
  "technology_modernization_needs": 0.0-1.0,
  "management_team_quality": "poor|fair|good|excellent"
}`,

  market: (business: any) => `You are a market research analyst. Analyze the market conditions and competitive landscape for this business:

Business: ${business.business_name}
Sector: ${business.sector}
Location: ${business.location}

Provide market analysis in JSON format:
{
  "market_size": "small|medium|large|very_large",
  "market_growth_rate": "declining|stable|growing|rapidly_growing",
  "competitive_intensity": 0.0-1.0,
  "market_trends": ["trend1", "trend2"],
  "target_demographics": ["demographic segments"],
  "seasonal_patterns": "minimal|moderate|high_seasonality",
  "regulatory_environment": "restrictive|neutral|favorable",
  "economic_sensitivity": 0.0-1.0,
  "digital_transformation_opportunity": 0.0-1.0,
  "barriers_to_entry": "low|medium|high"
}`,

  risk: (business: any) => `You are a risk assessment specialist. Analyze the business risks and mitigation strategies:

Business: ${business.business_name}
Sector: ${business.sector}
Financial Profile: Revenue $${business.annual_revenue?.toLocaleString()}, Profit $${business.annual_net_profit?.toLocaleString()}

Provide risk analysis in JSON format:
{
  "overall_risk_score": 0.0-1.0,
  "key_risks": ["specific risk factors"],
  "resilience_factors": ["competitive advantages"],
  "regulatory_risks": ["compliance requirements"],
  "market_risks": ["market-specific risks"],
  "operational_risks": ["operational vulnerabilities"],
  "financial_risks": ["financial concerns"],
  "mitigation_strategies": ["risk mitigation approaches"],
  "insurance_requirements": ["coverage types needed"],
  "contingency_planning": ["backup strategies"]
}`
};

async function callReplicateModel(modelVersion: string, input: any): Promise<any> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  if (!replicateToken) {
    throw new Error('REPLICATE_API_TOKEN environment variable is required');
  }

  console.log(`Calling Replicate model: ${modelVersion}`);

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${replicateToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: modelVersion,
      input: input
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate API error: ${response.status} ${errorText}`);
  }

  const prediction = await response.json();
  
  // Poll for completion if needed
  if (prediction.status === 'starting' || prediction.status === 'processing') {
    return await pollPrediction(prediction.id);
  }
  
  return prediction;
}

async function pollPrediction(predictionId: string, maxAttempts: number = 30): Promise<any> {
  const replicateToken = Deno.env.get('REPLICATE_API_TOKEN');
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${replicateToken}`,
      },
    });

    const prediction = await response.json();
    
    if (prediction.status === 'succeeded') {
      return prediction;
    } else if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }
    
    // Wait 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  throw new Error('Prediction timed out');
}

async function analyzeBusinessWithReplicate(request: BusinessAnalysisRequest): Promise<any> {
  const { business_data, analysis_type, model_preference = 'llama' } = request;
  
  let modelVersion: string;
  let prompt: string;
  
  switch (analysis_type) {
    case 'financial':
      modelVersion = BUSINESS_ANALYSIS_MODELS.financial_analysis[model_preference] || 
                    BUSINESS_ANALYSIS_MODELS.financial_analysis.llama;
      prompt = BUSINESS_ANALYSIS_PROMPTS.financial(business_data);
      break;
      
    case 'strategic':
      modelVersion = BUSINESS_ANALYSIS_MODELS.financial_analysis[model_preference] || 
                    BUSINESS_ANALYSIS_MODELS.financial_analysis.llama;
      prompt = BUSINESS_ANALYSIS_PROMPTS.strategic(business_data);
      break;
      
    case 'market':
      modelVersion = BUSINESS_ANALYSIS_MODELS.market_research.llama;
      prompt = BUSINESS_ANALYSIS_PROMPTS.market(business_data);
      break;
      
    case 'risk':
      modelVersion = BUSINESS_ANALYSIS_MODELS.financial_analysis[model_preference] || 
                    BUSINESS_ANALYSIS_MODELS.financial_analysis.llama;
      prompt = BUSINESS_ANALYSIS_PROMPTS.risk(business_data);
      break;
      
    default:
      throw new Error(`Unsupported analysis type: ${analysis_type}`);
  }
  
  const input = {
    prompt: prompt,
    max_new_tokens: 2000,
    temperature: 0.2,
    top_p: 0.9,
    repetition_penalty: 1.1
  };
  
  console.log(`Running ${analysis_type} analysis for ${business_data.business_name}`);
  
  const prediction = await callReplicateModel(modelVersion, input);
  
  if (prediction.status === 'succeeded' && prediction.output) {
    // Join output array if it's an array of strings
    const outputText = Array.isArray(prediction.output) ? 
                      prediction.output.join('') : 
                      prediction.output;
    
    // Try to extract JSON from the response
    try {
      const jsonMatch = outputText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.log('Raw output:', outputText);
      throw new Error(`Failed to parse JSON response: ${parseError.message}`);
    }
  } else {
    throw new Error(`Prediction failed with status: ${prediction.status}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    console.log('Received request:', { ...requestBody, input: '[REDACTED]' });

    // Check if this is a business analysis request
    if (requestBody.business_data && requestBody.analysis_type) {
      const result = await analyzeBusinessWithReplicate(requestBody as BusinessAnalysisRequest);
      
      return new Response(JSON.stringify({
        success: true,
        data: result,
        analysis_type: requestBody.analysis_type,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Standard Replicate API call
    const { modelVersion, input, webhook, webhook_events_filter } = requestBody as ReplicateRequest;

    if (!modelVersion || !input) {
      return new Response(JSON.stringify({
        success: false,
        error: 'modelVersion and input are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prediction = await callReplicateModel(modelVersion, input);

    // Optional: Store prediction data in Supabase
    /*
    const { error } = await supabase
      .from('replicate_predictions')
      .insert({
        prediction_id: prediction.id,
        model_version: modelVersion,
        input: input,
        status: prediction.status,
        output: prediction.output,
        created_at: prediction.created_at
      });

    if (error) {
      console.error('Error storing prediction:', error);
    }
    */

    return new Response(JSON.stringify({
      success: true,
      prediction: prediction
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in replicate-api function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
import { supabase } from '@/integrations/supabase/client';

// Interface for Replicate-powered business analysis
interface ReplicateAnalysisRequest {
  business_data: any;
  analysis_type: 'financial' | 'strategic' | 'market' | 'risk' | 'comprehensive';
  model_preference?: 'llama' | 'mistral' | 'codellama' | 'custom';
}

interface ReplicateAnalysisResponse {
  success: boolean;
  data?: any;
  analysis_type?: string;
  timestamp?: string;
  error?: string;
}

export class ReplicateBusinessAnalyzer {
  
  /**
   * Perform financial analysis using Replicate's LLM models
   */
  static async analyzeFinancials(businessData: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          business_data: businessData,
          analysis_type: 'financial',
          model_preference: 'llama' // Use Llama 2 70B for financial analysis
        } as ReplicateAnalysisRequest
      });

      if (error) throw error;

      const response = data as ReplicateAnalysisResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Financial analysis failed');
      }

      return {
        ...response.data,
        analysis_source: 'replicate_llama',
        confidence_score: 0.85,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error('Replicate financial analysis failed:', error);
      return this.generateFallbackFinancialAnalysis(businessData);
    }
  }

  /**
   * Perform strategic analysis using Replicate's LLM models
   */
  static async analyzeStrategy(businessData: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          business_data: businessData,
          analysis_type: 'strategic',
          model_preference: 'mistral' // Use Mixtral for strategic thinking
        } as ReplicateAnalysisRequest
      });

      if (error) throw error;

      const response = data as ReplicateAnalysisResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Strategic analysis failed');
      }

      return {
        ...response.data,
        analysis_source: 'replicate_mixtral',
        confidence_score: 0.88,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error('Replicate strategic analysis failed:', error);
      return this.generateFallbackStrategicAnalysis(businessData);
    }
  }

  /**
   * Perform market analysis using Replicate's specialized models
   */
  static async analyzeMarket(businessData: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          business_data: businessData,
          analysis_type: 'market',
          model_preference: 'llama'
        } as ReplicateAnalysisRequest
      });

      if (error) throw error;

      const response = data as ReplicateAnalysisResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Market analysis failed');
      }

      return {
        ...response.data,
        analysis_source: 'replicate_market',
        confidence_score: 0.82,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error('Replicate market analysis failed:', error);
      return this.generateFallbackMarketAnalysis(businessData);
    }
  }

  /**
   * Perform risk analysis using Replicate's models
   */
  static async analyzeRisks(businessData: any): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          business_data: businessData,
          analysis_type: 'risk',
          model_preference: 'llama'
        } as ReplicateAnalysisRequest
      });

      if (error) throw error;

      const response = data as ReplicateAnalysisResponse;
      
      if (!response.success) {
        throw new Error(response.error || 'Risk analysis failed');
      }

      return {
        ...response.data,
        analysis_source: 'replicate_risk',
        confidence_score: 0.87,
        timestamp: response.timestamp
      };
    } catch (error) {
      console.error('Replicate risk analysis failed:', error);
      return this.generateFallbackRiskAnalysis(businessData);
    }
  }

  /**
   * Run comprehensive analysis using multiple Replicate models in parallel
   */
  static async runComprehensiveAnalysis(businessData: any): Promise<any> {
    console.log(`Starting comprehensive Replicate analysis for: ${businessData.business_name}`);
    
    try {
      // Run all analyses in parallel for speed
      const [financialAnalysis, strategicAnalysis, marketAnalysis, riskAnalysis] = await Promise.all([
        this.analyzeFinancials(businessData),
        this.analyzeStrategy(businessData),
        this.analyzeMarket(businessData),
        this.analyzeRisks(businessData)
      ]);

      // Generate composite scores
      const cap_rate = (businessData.annual_net_profit / businessData.asking_price) * 100;
      const payback_years = businessData.asking_price / businessData.annual_net_profit;
      
      return {
        automation_opportunity_score: this.clampToDbPrecision(financialAnalysis.automation_score || 0.7),
        composite_score: this.clampToDbPrecision(this.calculateCompositeScore(
          financialAnalysis, strategicAnalysis, marketAnalysis, riskAnalysis
        )),
        ownership_model: strategicAnalysis.recommended_ownership_model || 'semi-absentee',
        resilience_factors: riskAnalysis.resilience_factors || ['essential-service'],
        strategic_flags: strategicAnalysis.strategic_flags || ['platform_potential'],
        cap_rate: Number(cap_rate.toFixed(1)),
        payback_years: Number(payback_years.toFixed(1)),
        seller_financing: strategicAnalysis.seller_financing_likely || false,
        government_contracts: strategicAnalysis.government_contracts || false,
        financial_analysis: financialAnalysis,
        market_analysis: marketAnalysis,
        strategic_assessment: strategicAnalysis,
        risk_evaluation: riskAnalysis,
        investment_thesis: await this.generateInvestmentThesis(businessData, {
          financialAnalysis, strategicAnalysis, marketAnalysis, riskAnalysis
        }),
        executive_summary: await this.generateExecutiveSummary(businessData, {
          financialAnalysis, strategicAnalysis, marketAnalysis, riskAnalysis
        }),
        analysis_metadata: {
          models_used: ['llama-2-70b', 'mixtral-8x7b'],
          analysis_timestamp: new Date().toISOString(),
          total_analysis_time: Date.now(),
          confidence_scores: {
            financial: financialAnalysis.confidence_score,
            strategic: strategicAnalysis.confidence_score,
            market: marketAnalysis.confidence_score,
            risk: riskAnalysis.confidence_score
          }
        }
      };
    } catch (error) {
      console.error('Comprehensive Replicate analysis failed:', error);
      throw error;
    }
  }

  /**
   * Generate investment thesis using Replicate's models
   */
  static async generateInvestmentThesis(businessData: any, analyses: any): Promise<string> {
    try {
      const prompt = `Based on the comprehensive analysis below, write a compelling investment thesis for this acquisition opportunity:

Business: ${businessData.business_name}
Sector: ${businessData.sector}
Asking Price: $${businessData.asking_price?.toLocaleString()}

Financial Assessment: ${JSON.stringify(analyses.financialAnalysis, null, 2)}
Strategic Assessment: ${JSON.stringify(analyses.strategicAnalysis, null, 2)}
Market Analysis: ${JSON.stringify(analyses.marketAnalysis, null, 2)}
Risk Evaluation: ${JSON.stringify(analyses.riskAnalysis, null, 2)}

Write a professional investment thesis (3-4 paragraphs) focusing on value creation opportunities, competitive advantages, and ROI potential.`;

      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          modelVersion: "meta/meta-llama-3-70b-instruct",
          input: {
            prompt: prompt,
            max_new_tokens: 1000,
            temperature: 0.3,
            top_p: 0.9
          }
        }
      });

      if (error) throw error;

      if (data.success && data.prediction?.output) {
        const output = Array.isArray(data.prediction.output) ? 
                      data.prediction.output.join('') : 
                      data.prediction.output;
        return output.trim();
      } else {
        throw new Error('Failed to generate investment thesis');
      }
    } catch (error) {
      console.error('Investment thesis generation failed:', error);
      return `Investment Thesis: ${businessData.business_name} represents a compelling acquisition opportunity in the ${businessData.sector} sector with strong financial performance and significant potential for AI-driven operational optimization.`;
    }
  }

  /**
   * Generate executive summary using Replicate's models
   */
  static async generateExecutiveSummary(businessData: any, analyses: any): Promise<string> {
    try {
      const prompt = `Create an executive summary for this business acquisition opportunity:

${businessData.business_name} - ${businessData.sector}
Price: $${businessData.asking_price?.toLocaleString()}
Revenue: $${businessData.annual_revenue?.toLocaleString()}
Profit: $${businessData.annual_net_profit?.toLocaleString()}

Key findings from analysis:
- Financial Health Score: ${analyses.financialAnalysis.financial_health_score}
- Strategic Value Score: ${analyses.strategicAnalysis.strategic_value_score}
- Market Growth: ${analyses.marketAnalysis.market_growth_rate}
- Risk Level: ${analyses.riskAnalysis.overall_risk_score}

Write a concise executive summary (2-3 paragraphs) highlighting the key investment merits and recommendation.`;

      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          modelVersion: "meta/meta-llama-3-70b-instruct",
          input: {
            prompt: prompt,
            max_new_tokens: 800,
            temperature: 0.2,
            top_p: 0.9
          }
        }
      });

      if (error) throw error;

      if (data.success && data.prediction?.output) {
        const output = Array.isArray(data.prediction.output) ? 
                      data.prediction.output.join('') : 
                      data.prediction.output;
        return output.trim();
      } else {
        throw new Error('Failed to generate executive summary');
      }
    } catch (error) {
      console.error('Executive summary generation failed:', error);
      return `Executive Summary: ${businessData.business_name} represents a compelling acquisition opportunity in the ${businessData.sector} sector with strong financial performance and growth potential.`;
    }
  }

  // Helper methods
  private static clampToDbPrecision(value: number, maxValue: number = 9.9999): number {
    return Math.min(Math.max(0, value), maxValue);
  }

  private static calculateCompositeScore(financial: any, strategic: any, market: any, risk: any): number {
    const financialScore = financial.financial_health_score || 0.7;
    const strategicScore = strategic.strategic_value_score || 0.7;
    const marketScore = (market.market_growth_rate === 'rapidly_growing' ? 0.9 : 
                        market.market_growth_rate === 'growing' ? 0.7 : 
                        market.market_growth_rate === 'stable' ? 0.5 : 0.3);
    const riskScore = 1 - (risk.overall_risk_score || 0.3);
    
    return Number(((financialScore * 0.3 + strategicScore * 0.3 + marketScore * 0.2 + riskScore * 0.2)).toFixed(2));
  }

  // Fallback methods (same as original)
  private static generateFallbackFinancialAnalysis(business: any) {
    return {
      financial_health_score: 0.7,
      automation_score: 0.6,
      revenue_quality: "recurring",
      profit_margins: ((business.annual_net_profit / business.annual_revenue) * 100).toFixed(1) + "%",
      cash_flow_predictability: 0.7,
      growth_trajectory: "stable",
      analysis_source: 'fallback',
      confidence_score: 0.6
    };
  }

  private static generateFallbackStrategicAnalysis(business: any) {
    return {
      strategic_value_score: 0.7,
      competitive_moat: "moderate",
      market_position: "challenger",
      scalability_potential: 0.6,
      recommended_ownership_model: "semi-absentee",
      strategic_flags: ["platform_potential", "operational_optimization"],
      analysis_source: 'fallback',
      confidence_score: 0.6
    };
  }

  private static generateFallbackMarketAnalysis(business: any) {
    return {
      market_size: "medium",
      market_growth_rate: "stable",
      competitive_intensity: 0.6,
      market_trends: ["digital_transformation", "consolidation"],
      analysis_source: 'fallback',
      confidence_score: 0.6
    };
  }

  private static generateFallbackRiskAnalysis(business: any) {
    return {
      overall_risk_score: 0.4,
      key_risks: ["market_competition", "economic_downturn"],
      resilience_factors: ["essential_service", "recurring_revenue"],
      mitigation_strategies: ["diversification", "operational_improvements"],
      analysis_source: 'fallback',
      confidence_score: 0.6
    };
  }
}
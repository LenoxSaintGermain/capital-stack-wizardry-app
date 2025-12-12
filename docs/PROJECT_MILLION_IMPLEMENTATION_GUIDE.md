# Project Million Implementation Guide
## Complete Feature Documentation for AI Agent Rebuild

---

## 📋 EXECUTIVE SUMMARY

This document provides comprehensive specifications to rebuild an enhanced **Business Acquisition Intelligence Platform**. The application combines multi-model AI analysis, real-time data pipelines, and sophisticated financial modeling to help users identify, analyze, and acquire small-to-medium businesses.

**Target Outcome**: A platform that helps users achieve $1M+ annual passive income through strategic business acquisitions.

---

## 🏗️ TECH STACK & ARCHITECTURE

### Core Technologies
```
Framework: React 18 + Vite + TypeScript
Styling: Tailwind CSS + shadcn/ui components
State: React hooks + React Query
Routing: React Router v6
Backend: Supabase (PostgreSQL + Edge Functions)
Charts: Recharts
```

### AI Model Integration (Multi-Model Pipeline)
```
Financial Analysis: OpenAI GPT-4o
Strategic Analysis: Claude 3 Sonnet
Market Analysis: Google Gemini Pro
Risk Analysis: Perplexity (llama-3.1-sonar with real-time web data)
Business Discovery: Perplexity Deep Research
Thesis/Summary: Claude + GPT-4 for synthesis
```

### Required API Keys
```
OPENAI_API_KEY - GPT-4o for financial analysis
ANTHROPIC_API_KEY - Claude for strategic analysis
GEMINI_API_KEY - Gemini Pro for market analysis
PERPLEXITY_API_KEY - Real-time web research and risk analysis
```

---

## 📊 DATABASE SCHEMA

### Table: `businesses`
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  sector TEXT NOT NULL,
  location TEXT NOT NULL,
  asking_price NUMERIC NOT NULL,
  annual_revenue NUMERIC NOT NULL,
  annual_net_profit NUMERIC NOT NULL,
  automation_opportunity_score NUMERIC(5,3),
  composite_score NUMERIC(5,3),
  ownership_model TEXT, -- 'passive', 'semi-absentee', 'owner_operated'
  resilience_factors JSONB DEFAULT '[]',
  strategic_flags JSONB DEFAULT '[]',
  cap_rate NUMERIC,
  payback_years NUMERIC,
  seller_financing BOOLEAN DEFAULT false,
  government_contracts BOOLEAN DEFAULT false,
  description TEXT,
  url TEXT,
  source TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_analyzed_at TIMESTAMPTZ
);

-- RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "Users can insert businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their businesses" ON businesses FOR UPDATE USING (auth.uid() = created_by);
```

### Table: `enrichment_data`
```sql
CREATE TABLE enrichment_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  market_analysis JSONB,
  competitor_analysis JSONB,
  financial_projections JSONB,
  automation_assessment JSONB,
  risk_factors JSONB,
  growth_opportunities JSONB,
  confidence_score NUMERIC(4,3),
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `analysis_runs`
```sql
CREATE TABLE analysis_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  businesses_processed INTEGER DEFAULT 0,
  businesses_added INTEGER DEFAULT 0,
  businesses_updated INTEGER DEFAULT 0,
  execution_time_seconds INTEGER,
  error_message TEXT,
  run_config JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id)
);
```

### Table: `business_sources`
```sql
CREATE TABLE business_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'bizbuysell', 'loopnet', 'sunbelt', 'broker_network'
  base_url TEXT,
  api_endpoint TEXT,
  rate_limit_per_hour INTEGER DEFAULT 100,
  last_scraped_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  scraping_config JSONB DEFAULT '{}'
);
```

### Table: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  organization TEXT,
  role TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Table: `user_preferences`
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  preferred_sectors JSONB DEFAULT '[]',
  max_asking_price NUMERIC,
  min_annual_profit NUMERIC,
  min_automation_score NUMERIC,
  alert_threshold_score NUMERIC,
  notification_enabled BOOLEAN DEFAULT true,
  notification_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 🔧 CORE FEATURES & IMPLEMENTATION

### 1. PORTFOLIO OVERVIEW

**Purpose**: Dashboard showing aggregated portfolio metrics, sector breakdowns, and progress toward financial goals.

**Key Features**:
- Summary cards: Total opportunities, portfolio value, total cash flow, avg ROI
- Progress bar toward $1M annual cash flow goal with gap analysis
- Pie chart: Opportunities by sector
- Bar chart: Value distribution across sectors
- Geographic focus visualization
- Performance metrics and pipeline health

**Implementation Pattern**:
```typescript
// Load data from database with JSON fallback
const loadPortfolioData = async () => {
  let portfolioStats = await getPortfolioStatsFromDatabase();
  if (!portfolioStats) {
    const jsonData = await loadManusConsolidatedData();
    portfolioStats = ManusDataAdapter.generatePortfolioSummary(jsonData);
  }
  setStats(portfolioStats);
};

// Key metrics to display
interface PortfolioStats {
  totalOpportunities: number;
  totalPortfolioValue: number;
  totalCashFlow: number;
  averageROI: number;
  progressToGoal: number; // percentage toward $1M
  gapToGoal: number; // dollars remaining
  sectorBreakdown: { sector: string; count: number; value: number }[];
  geographicFocus: string[];
}
```

**UI Components**:
- Use `Card` components with gradient backgrounds for key metrics
- `Progress` component for goal tracking
- `PieChart` and `BarChart` from Recharts for visualizations
- Color-code metrics: green for positive trends, amber for caution

---

### 2. MULTI-MODEL AI ANALYSIS ENGINE (Edge Function)

**Purpose**: Edge function that orchestrates multiple AI models for comprehensive business analysis.

**File**: `supabase/functions/project-million-scanner/index.ts`

**Architecture**:
```typescript
// Main analysis orchestration
async function performComprehensiveAnalysis(business: BusinessData) {
  // Parallel analysis - each model specialized for different domain
  const [financial, strategic, market, risk] = await Promise.all([
    analyzeFinancials(business),  // OpenAI GPT-4o
    analyzeStrategy(business),     // Claude 3 Sonnet
    analyzeMarket(business),       // Google Gemini
    analyzeRisks(business)         // Perplexity (real-time data)
  ]);
  
  // Synthesis using Claude for investment thesis
  const thesis = await generateInvestmentThesis(business, analyses);
  
  // Executive summary using GPT-4
  const summary = await generateExecutiveSummary(business, analyses);
  
  return combineAnalyses(financial, strategic, market, risk, thesis, summary);
}
```

**Model Specialization Table**:
| Model | Task | Endpoint | Why |
|-------|------|----------|-----|
| GPT-4o | Financial analysis, executive summaries | `api.openai.com/v1/chat/completions` | Strong number analysis |
| Claude 3 | Strategic analysis, investment thesis | `api.anthropic.com/v1/messages` | Nuanced reasoning |
| Gemini Pro | Market analysis, trends | `generativelanguage.googleapis.com` | Good for market research |
| Perplexity | Risk analysis, business discovery | `api.perplexity.ai/chat/completions` | Real-time web data access |

**Critical Implementation Details**:
```typescript
// Always include JSON cleanup helper - AI models wrap JSON in markdown
function cleanAndParseJSON(responseText: string) {
  let cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  cleaned = cleaned.trim();
  
  // Handle potential trailing commas
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  
  return JSON.parse(cleaned);
}

// Clamp numeric values for database precision - CRITICAL for NUMERIC(5,3) columns
function clampToDbPrecision(value: number, maxValue: number = 9.999): number {
  if (typeof value !== 'number' || isNaN(value)) return 0;
  return Number(Math.min(Math.max(0, value), maxValue).toFixed(3));
}

// Always include fallback generators for when API calls fail
function generateFallbackFinancialAnalysis(business: BusinessData) {
  const capRate = business.annual_net_profit / business.asking_price;
  const paybackYears = business.asking_price / business.annual_net_profit;
  
  return {
    financial_health_score: clampToDbPrecision(capRate * 10),
    automation_score: 0.65,
    cap_rate: clampToDbPrecision(capRate),
    payback_years: Math.min(paybackYears, 99),
    projected_growth: 0.05,
    risk_adjusted_return: clampToDbPrecision(capRate * 0.8),
  };
}
```

**Prompt Templates**:
```typescript
// Financial Analysis Prompt (GPT-4o)
const financialPrompt = `Analyze this business acquisition opportunity:
Business: ${business.business_name}
Sector: ${business.sector}
Asking Price: $${business.asking_price.toLocaleString()}
Annual Revenue: $${business.annual_revenue.toLocaleString()}
Annual Profit: $${business.annual_net_profit.toLocaleString()}
Location: ${business.location}

Provide analysis as JSON:
{
  "financial_health_score": 0.0-1.0,
  "automation_opportunity_score": 0.0-1.0,
  "cap_rate": decimal,
  "payback_years": number,
  "key_financial_strengths": ["..."],
  "financial_risks": ["..."],
  "valuation_assessment": "undervalued|fair|overvalued",
  "recommended_offer_range": { "low": number, "high": number }
}`;

// Strategic Analysis Prompt (Claude)
const strategicPrompt = `As a business acquisition strategist, evaluate:
[business details]

Provide strategic analysis as JSON:
{
  "strategic_fit_score": 0.0-1.0,
  "ownership_model_recommendation": "passive|semi-absentee|owner_operated",
  "integration_complexity": "low|medium|high",
  "synergy_opportunities": ["..."],
  "competitive_moat": "none|weak|moderate|strong",
  "growth_levers": [{ "lever": "...", "potential_impact": "..." }],
  "investment_thesis": "2-3 sentence thesis"
}`;

// Risk Analysis Prompt (Perplexity - uses real-time web data)
const riskPrompt = `Research current market conditions and risks for acquiring a ${business.sector} business in ${business.location}.

Search for:
- Recent industry trends and challenges
- Local market conditions
- Regulatory changes
- Competition landscape
- Economic factors

Provide risk analysis as JSON:
{
  "overall_risk_score": 0.0-1.0,
  "market_risks": [{ "risk": "...", "severity": "low|medium|high", "mitigation": "..." }],
  "operational_risks": [...],
  "regulatory_risks": [...],
  "economic_risks": [...],
  "risk_adjusted_recommendation": "proceed|proceed_with_caution|avoid"
}`;
```

---

### 3. AI-POWERED BUSINESS DISCOVERY

**Purpose**: Use Perplexity Deep Research to find real business listings instead of mock data.

**Implementation**:
```typescript
async function discoverBusinesses(sources: BusinessSource[]): Promise<DiscoveredBusiness[]> {
  const discoveries: DiscoveredBusiness[] = [];
  
  for (const source of sources) {
    if (!source.is_active) continue;
    
    // Rate limiting check
    const hoursSinceLastScrape = source.last_scraped_at 
      ? (Date.now() - new Date(source.last_scraped_at).getTime()) / 3600000 
      : 999;
    
    if (hoursSinceLastScrape < 1) {
      console.log(`Skipping ${source.name} - rate limited`);
      continue;
    }
    
    try {
      const searchQuery = buildSearchQuery(source);
      const results = await searchWithPerplexity(searchQuery);
      const parsed = await extractBusinessData(results);
      
      discoveries.push(...parsed);
      
      // Update last_scraped_at
      await updateSourceTimestamp(source.id);
    } catch (error) {
      console.error(`Discovery failed for ${source.name}:`, error);
    }
  }
  
  return deduplicateBusinesses(discoveries);
}

function buildSearchQuery(source: BusinessSource): string {
  const config = source.scraping_config as any;
  return `Find businesses for sale on ${source.name} 
    with asking price under $${config?.max_price || 5000000}
    in sectors: ${config?.sectors?.join(', ') || 'any'}
    locations: ${config?.locations?.join(', ') || 'United States'}
    Include: business name, asking price, annual revenue, cash flow, location, description, listing URL`;
}

async function searchWithPerplexity(query: string) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online', // Real-time web access
      messages: [
        {
          role: 'system',
          content: 'You are a business listing researcher. Find real business for sale listings and return structured data as JSON array.'
        },
        { role: 'user', content: query }
      ],
      temperature: 0.1,
    }),
  });
  
  return response.json();
}
```

---

### 4. DYNAMIC CAPITAL STACK

**Purpose**: Interactive capital structure modeling with toggleable financing levers.

**Key Features**:
- 6 toggleable financing strategies
- Real-time recalculation of Sources & Uses
- Dynamic DSCR (Debt Service Coverage Ratio) calculation
- Visual feedback with color-coded lever states

**Implementation Pattern**:
```typescript
interface CapitalLever {
  id: string;
  title: string;
  description: string;
  impact: string;
  adjustment: (stack: CapitalStack) => CapitalStack;
}

const leversData: CapitalLever[] = [
  { 
    id: 'sellerEarnOut', 
    title: 'Seller "Performance-Earn-Out"', 
    impact: 'Reduces day-one cash by 20% of purchase price',
    adjustment: (stack) => ({
      ...stack,
      sellerNote: stack.purchasePrice * 0.20,
      sba7a: stack.sba7a - stack.purchasePrice * 0.20,
    })
  },
  { 
    id: 'revenueNote', 
    title: 'Certification-Backed Revenue Note', 
    impact: 'Substitutes $500k of SBA debt',
    adjustment: (stack) => ({
      ...stack,
      revenueNote: 500000,
      sba7a: stack.sba7a - 500000,
    })
  },
  { 
    id: 'impactFund', 
    title: 'Veteran/Minority Impact Fund', 
    impact: 'Replaces home equity requirement',
    adjustment: (stack) => ({
      ...stack,
      impactFund: stack.buyerEquity * 0.5,
      buyerEquity: stack.buyerEquity * 0.5,
    })
  },
  { 
    id: 'greenStack', 
    title: 'Energy-Efficiency "Green Stack"', 
    impact: 'Removes ~$250k capital expenditure',
    adjustment: (stack) => ({
      ...stack,
      greenFinancing: 250000,
      workingCapital: stack.workingCapital - 250000,
    })
  },
  { 
    id: 'employeePool', 
    title: 'Employee Co-Invest Pool', 
    impact: 'Converts $100k wage to equity',
    adjustment: (stack) => ({
      ...stack,
      employeePool: 100000,
      buyerEquity: stack.buyerEquity - 100000,
    })
  },
  { 
    id: 'grantLayer', 
    title: 'Local Grant Layer', 
    impact: 'Adds $25k grant capital',
    adjustment: (stack) => ({
      ...stack,
      grants: 25000,
      buyerEquity: stack.buyerEquity - 25000,
    })
  },
];

// Calculate DSCR
const calculateDSCR = (stack: CapitalStack, annualCashFlow: number): number => {
  const annualDebtService = (stack.sba7a * 0.08) + (stack.revenueNote * 0.06);
  return annualCashFlow / annualDebtService;
};

// Dynamic recalculation with useMemo
const capitalStack = useMemo(() => {
  let stack: CapitalStack = {
    purchasePrice: selectedBusiness.asking_price,
    sba7a: selectedBusiness.asking_price * 0.75,
    buyerEquity: selectedBusiness.asking_price * 0.15,
    workingCapital: selectedBusiness.asking_price * 0.10,
    sellerNote: 0,
    revenueNote: 0,
    impactFund: 0,
    greenFinancing: 0,
    employeePool: 0,
    grants: 0,
  };
  
  // Apply each active lever
  activeLevers.forEach(leverId => {
    const lever = leversData.find(l => l.id === leverId);
    if (lever) stack = lever.adjustment(stack);
  });
  
  return stack;
}, [selectedBusiness, activeLevers]);
```

**UI Implementation**:
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
  {leversData.map((lever) => (
    <Card 
      key={lever.id}
      className={cn(
        "cursor-pointer transition-all",
        activeLevers.includes(lever.id) 
          ? "border-primary bg-primary/10" 
          : "border-border hover:border-primary/50"
      )}
      onClick={() => toggleLever(lever.id)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{lever.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{lever.impact}</p>
      </CardContent>
    </Card>
  ))}
</div>

{/* DSCR Display */}
<div className={cn(
  "text-center p-4 rounded-lg",
  dscr >= 1.25 ? "bg-green-500/20" : dscr >= 1.0 ? "bg-yellow-500/20" : "bg-red-500/20"
)}>
  <p className="text-2xl font-bold">{dscr.toFixed(2)}x</p>
  <p className="text-sm text-muted-foreground">Debt Service Coverage Ratio</p>
  <p className="text-xs">{dscr >= 1.25 ? "Healthy" : dscr >= 1.0 ? "Acceptable" : "At Risk"}</p>
</div>
```

---

### 5. PERFORMANCE SIMULATOR

**Purpose**: Scenario modeling for business performance projections.

**Key Features**:
- Three scenario presets: Conservative, Base, Aggressive
- Custom input overrides for key variables
- Multi-year projection charts (5-year)
- ROI metrics calculation

**Scenario Configuration**:
```typescript
interface ScenarioConfig {
  revenueGrowth: number;      // Annual revenue growth rate
  marginImprovement: number;   // Annual margin improvement
  customerRetention: number;   // Customer retention rate
  automationSavings: number;   // Annual cost savings from automation
}

const scenarioPresets: Record<string, ScenarioConfig> = {
  conservative: { 
    revenueGrowth: 0.05, 
    marginImprovement: 0.02, 
    customerRetention: 0.85,
    automationSavings: 0.05,
  },
  base: { 
    revenueGrowth: 0.10, 
    marginImprovement: 0.05, 
    customerRetention: 0.90,
    automationSavings: 0.10,
  },
  aggressive: { 
    revenueGrowth: 0.20, 
    marginImprovement: 0.08, 
    customerRetention: 0.95,
    automationSavings: 0.15,
  },
};

// Generate 5-year projections
function generateProjections(
  business: Business, 
  config: ScenarioConfig
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let revenue = business.annual_revenue;
  let margin = business.annual_net_profit / business.annual_revenue;
  
  for (let year = 1; year <= 5; year++) {
    revenue *= (1 + config.revenueGrowth);
    margin += config.marginImprovement;
    margin = Math.min(margin, 0.40); // Cap at 40% margin
    
    const netProfit = revenue * margin;
    const automationSavings = revenue * config.automationSavings * (year / 5);
    const adjustedProfit = netProfit + automationSavings;
    
    projections.push({
      year,
      revenue,
      netProfit,
      adjustedProfit,
      cumulativeCashFlow: projections.reduce((sum, p) => sum + p.adjustedProfit, adjustedProfit),
      roi: (adjustedProfit / business.asking_price) * 100,
    });
  }
  
  return projections;
}
```

---

### 6. FINANCIAL FREEDOM ROADMAP

**Purpose**: Personalized path to financial independence through business ownership.

**Key Features**:
- Personal profile customization
- Dynamic milestone calculation based on profile
- Three view modes: Lifestyle, Portfolio, Wealth
- Preset profiles for quick selection

**Personal Profile Interface**:
```typescript
interface PersonalProfile {
  currentIncome: number;
  investmentAmount: number;
  targetMonthlyIncome: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeline: number; // years to financial freedom
  location: string;
  situation: 'single' | 'married' | 'family';
  age: number;
}

const profilePresets: Record<string, Partial<PersonalProfile>> = {
  'young-professional': {
    age: 28,
    currentIncome: 85000,
    investmentAmount: 50000,
    riskTolerance: 'aggressive',
    timeline: 5,
    situation: 'single',
  },
  'mid-career': {
    age: 40,
    currentIncome: 150000,
    investmentAmount: 200000,
    riskTolerance: 'moderate',
    timeline: 7,
    situation: 'married',
  },
  'pre-retirement': {
    age: 55,
    currentIncome: 200000,
    investmentAmount: 500000,
    riskTolerance: 'conservative',
    timeline: 10,
    situation: 'family',
  },
};
```

**Dynamic Milestone Calculation**:
```typescript
const calculateMilestones = (profile: PersonalProfile): Milestone[] => {
  const baseIncome = profile.currentIncome / 12;
  const situationMultiplier = 
    profile.situation === 'family' ? 1.5 : 
    profile.situation === 'married' ? 1.2 : 1.0;
  
  const timelineMultiplier = 3 / profile.timeline; // Normalize to 3-year base
  
  return [
    { 
      month: Math.round(3 * timelineMultiplier), 
      title: "Side Income Security", 
      monthlyIncome: baseIncome * 0.3 * situationMultiplier,
      description: "First acquisition generating passive income"
    },
    { 
      month: Math.round(8 * timelineMultiplier), 
      title: "Housing Freedom", 
      monthlyIncome: baseIncome * 0.6 * situationMultiplier,
      description: "Portfolio covers housing expenses"
    },
    { 
      month: Math.round(14 * timelineMultiplier), 
      title: "Lifestyle Lock-In", 
      monthlyIncome: baseIncome * 1.0 * situationMultiplier,
      description: "Match current income from business portfolio"
    },
    { 
      month: Math.round(24 * timelineMultiplier), 
      title: "Financial Freedom", 
      monthlyIncome: profile.targetMonthlyIncome,
      description: "Target passive income achieved"
    },
  ];
};
```

---

### 7. CRM PIPELINE

**Purpose**: Contact and opportunity management for deal flow.

**Key Features**:
- Contact cards with type filtering (broker/seller)
- Priority and status badges
- Follow-up date tracking with overdue highlighting
- Opportunity pipeline with stage tracking
- Search and filter capabilities

**Data Structures**:
```typescript
interface Contact {
  id: string;
  type: 'broker' | 'seller' | 'advisor' | 'investor';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'qualified' | 'active' | 'inactive';
  specialization?: string;
  notes?: string;
  last_contact?: string;
  next_follow_up?: string;
  created_at: string;
}

interface Opportunity {
  id: string;
  business_name: string;
  asking_price: number;
  cash_flow: number;
  revenue: number;
  location: string;
  sector: string;
  source: string;
  stage: 'identified' | 'contacted' | 'nda_signed' | 'analyzing' | 'loi_submitted' | 'due_diligence' | 'closing' | 'closed' | 'passed';
  probability: number; // 0-100
  status: 'active' | 'on_hold' | 'closed_won' | 'closed_lost';
  score: number;
  notes?: string;
  next_action?: string;
  next_action_date?: string;
  contacts: string[]; // Contact IDs
  created_at: string;
  updated_at: string;
}
```

**Pipeline Stages with Probability**:
```typescript
const pipelineStages = [
  { id: 'identified', label: 'Identified', probability: 10 },
  { id: 'contacted', label: 'Contacted', probability: 20 },
  { id: 'nda_signed', label: 'NDA Signed', probability: 35 },
  { id: 'analyzing', label: 'Analyzing', probability: 50 },
  { id: 'loi_submitted', label: 'LOI Submitted', probability: 70 },
  { id: 'due_diligence', label: 'Due Diligence', probability: 85 },
  { id: 'closing', label: 'Closing', probability: 95 },
];

// Weighted pipeline value
const weightedPipelineValue = opportunities.reduce((total, opp) => {
  const stage = pipelineStages.find(s => s.id === opp.stage);
  return total + (opp.cash_flow * (stage?.probability || 0) / 100);
}, 0);
```

---

### 8. BUSINESS ANALYSIS PANEL

**Purpose**: Detailed analysis view for selected business opportunities.

**Key Features**:
- AI-generated summary with confidence score
- Tabbed interface: Summary, Financials, Growth Plan, Risks
- Financial projections by year
- Growth strategy pillars with timeline and revenue impact
- Risk assessment with severity levels and mitigation strategies

**Enrichment Data Structure**:
```typescript
interface EnrichmentData {
  ai_summary: string;
  confidence_score: number; // 0.0 - 1.0
  
  market_analysis: {
    market_size: string;
    growth_rate: number;
    competitive_intensity: 'low' | 'medium' | 'high';
    location_advantages: string[];
    market_trends: string[];
  };
  
  financial_projections: {
    year_1: { revenue: number; ebitda: number; margin_pct: number };
    year_2: { revenue: number; ebitda: number; margin_pct: number };
    year_3: { revenue: number; ebitda: number; margin_pct: number };
    assumptions: string[];
  };
  
  growth_opportunities: {
    [pillar: string]: { 
      strategy: string; 
      timeline: string; 
      investment_required: number;
      projected_revenue_impact: number;
      difficulty: 'easy' | 'medium' | 'hard';
    };
  };
  
  automation_assessment: {
    current_automation_level: number; // 0-100
    automation_potential: number; // 0-100
    priority_areas: string[];
    estimated_savings: number;
    implementation_timeline: string;
  };
  
  risk_factors: {
    [risk: string]: { 
      severity: 'low' | 'medium' | 'high';
      probability: 'low' | 'medium' | 'high';
      mitigation: string;
      residual_risk: 'low' | 'medium' | 'high';
    };
  };
}
```

---

### 9. AI AGENT CONTROL PANEL

**Purpose**: Interface for triggering and monitoring AI analysis runs.

**Key Features**:
- Start/stop analysis scans
- Real-time progress tracking via Supabase subscriptions
- Historical run history
- Processing metrics (processed, added, updated counts)
- Configuration options for scan parameters

**Real-time Subscription Pattern**:
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('analysis-runs')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'analysis_runs'
    }, (payload) => {
      if (payload.eventType === 'UPDATE' && currentRun?.id === payload.new.id) {
        setCurrentRun(payload.new as AnalysisRun);
      }
      if (payload.eventType === 'INSERT') {
        fetchRecentRuns();
      }
    })
    .subscribe();
    
  return () => {
    subscription.unsubscribe();
  };
}, [currentRun?.id]);

// Start analysis run
const startAnalysis = async () => {
  setIsRunning(true);
  
  try {
    const response = await supabase.functions.invoke('project-million-scanner', {
      body: { 
        action: 'start',
        config: scanConfig,
      }
    });
    
    if (response.error) throw response.error;
    
    setCurrentRun(response.data.run);
    toast.success('Analysis started');
  } catch (error) {
    toast.error('Failed to start analysis');
    console.error(error);
  }
};
```

---

### 10. INVESTMENT MEMO VIEWER

**Purpose**: Professional investment memo generation and viewing.

**Key Features**:
- Memo list sidebar with selection
- Executive summary with key highlights
- Financial analysis breakdown
- AI optimization potential
- Market analysis and competitive advantages
- Recommendation with next steps

**Investment Memo Structure**:
```typescript
interface InvestmentMemo {
  id: string;
  title: string;
  business_id: string;
  business_name: string;
  asking_price: number;
  cash_flow?: number;
  score?: number;
  recommendation: 'STRONG BUY' | 'BUY' | 'CONSIDER' | 'PASS';
  date_generated: string;
  
  content: {
    executive_summary: string;
    investment_thesis: string;
    
    key_highlights: string[];
    key_risks: string[];
    
    financial_analysis: {
      revenue: number;
      ebitda: number;
      margin: number;
      cap_rate: number;
      payback_years: number;
      valuation_assessment: string;
    };
    
    ai_optimization: {
      efficiency_gains: string;
      revenue_improvement: string;
      cost_reduction: string;
      estimated_value_add: number;
    };
    
    market_analysis: {
      sector: string;
      geographic_focus: string;
      competitive_advantages: string[];
      market_position: string;
    };
    
    recommendation_details: {
      rating: string;
      reasoning: string;
      next_steps: string[];
      timeline: string;
    };
  };
}
```

---

### 11. 100-DAY PLAN

**Purpose**: Post-acquisition implementation roadmap.

**Key Features**:
- Three-phase structure (Days 1-30, 31-60, 61-100)
- Phase-specific action items with owners
- Progress tracking per phase
- Key metrics targets per phase
- Dependencies and milestones

**Phase Structure**:
```typescript
interface ActionItem {
  id: string;
  title: string;
  description: string;
  owner: 'buyer' | 'seller' | 'manager' | 'team';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  due_date: string;
  dependencies?: string[]; // Other action item IDs
}

interface Phase {
  id: string;
  name: string;
  days: string; // e.g., "1-30"
  theme: string;
  objectives: string[];
  actions: ActionItem[];
  keyMetrics: { metric: string; target: string }[];
  risks: string[];
}

const hundredDayPlan: Phase[] = [
  {
    id: 'phase1',
    name: 'Stabilization',
    days: '1-30',
    theme: 'Learn, Listen, Stabilize',
    objectives: [
      'Complete ownership transition',
      'Meet all key employees and customers',
      'Understand current operations deeply',
      'Identify quick wins',
    ],
    actions: [
      {
        id: 'a1',
        title: 'Employee 1:1 Meetings',
        description: 'Meet with each employee individually to understand roles and concerns',
        owner: 'buyer',
        priority: 'critical',
        status: 'not_started',
        due_date: 'Day 7',
      },
      // ... more actions
    ],
    keyMetrics: [
      { metric: 'Employee Retention', target: '100%' },
      { metric: 'Customer Retention', target: '100%' },
      { metric: 'Cash Position', target: 'Stable' },
    ],
    risks: ['Key employee departure', 'Customer concerns about transition'],
  },
  // Phase 2 & 3...
];
```

---

### 12. INVESTOR PARTNERSHIP

**Purpose**: Investment structure and partnership tier visualization.

**Key Features**:
- Three partnership tiers: Strategic, Growth, Investment
- Investment structure breakdown (debt vs equity)
- Risk assessment matrix
- Expected returns calculator
- Dynamic calculations based on selected business

**Partnership Tiers**:
```typescript
interface PartnershipTier {
  id: string;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  equityRange: string; // e.g., "5-15%"
  expectedReturns: string; // e.g., "15-25% IRR"
  involvement: 'passive' | 'semi-active' | 'active';
  benefits: string[];
  requirements: string[];
}

const partnershipTiers: PartnershipTier[] = [
  {
    id: 'strategic',
    name: 'Strategic Partner',
    minInvestment: 250000,
    maxInvestment: 1000000,
    equityRange: '15-40%',
    expectedReturns: '20-30% IRR',
    involvement: 'semi-active',
    benefits: [
      'Board seat',
      'Quarterly reporting',
      'Strategic input on major decisions',
      'Pro-rata follow-on rights',
    ],
    requirements: [
      'Accredited investor status',
      'Industry expertise preferred',
      '3-5 year commitment',
    ],
  },
  // Growth and Investment tiers...
];
```

---

## 🔑 KEY IMPLEMENTATION PATTERNS

### 1. Safe Calculation Helpers (CRITICAL)
```typescript
// Always use these for any numeric display
const safeCalculate = (value: number, fallback: number = 0): number => {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return fallback;
  }
  return value;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeCalculate(value));
};

const formatPercent = (value: number, decimals: number = 1): string => {
  return `${safeCalculate(value * 100, 0).toFixed(decimals)}%`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(safeCalculate(value));
};
```

### 2. Data Import/Export Pattern
```typescript
// Always implement fallback chain: Database → JSON → Defaults
async function loadData<T>(
  fetchFromDb: () => Promise<T | null>,
  fallbackJsonPath: string,
  defaultValue: T
): Promise<T> {
  try {
    // Try database first
    const dbData = await fetchFromDb();
    if (dbData) return dbData;
    
    console.log('Database empty, loading from JSON fallback');
    
    // Try JSON fallback
    const response = await fetch(fallbackJsonPath);
    if (response.ok) {
      const jsonData = await response.json();
      return transformToAppFormat(jsonData);
    }
    
    console.log('JSON fallback failed, using defaults');
    return defaultValue;
  } catch (error) {
    console.error('All data sources failed:', error);
    return defaultValue;
  }
}
```

### 3. Edge Function Error Handling
```typescript
async function callAIModel(prompt: string, model: string): Promise<any> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(getEndpoint(model), {
        method: 'POST',
        headers: getHeaders(model),
        body: JSON.stringify(buildPayload(model, prompt)),
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      const content = extractContent(data, model);
      
      if (!content) {
        throw new Error('Empty response from API');
      }
      
      return cleanAndParseJSON(content);
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
      }
    }
  }
  
  console.error('All retries failed, using fallback');
  return null; // Caller should handle null and use fallback
}
```

### 4. Supabase Real-time Pattern
```typescript
function useRealtimeSubscription<T>(
  table: string,
  filter?: { column: string; value: string },
  onUpdate: (data: T) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter && { filter: `${filter.column}=eq.${filter.value}` }),
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            onUpdate(payload.new as T);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter?.value]);
}
```

---

## 📁 RECOMMENDED FILE STRUCTURE

```
src/
├── components/
│   ├── ui/                        # shadcn/ui components (don't modify)
│   ├── analysis/
│   │   ├── BusinessAnalysisPanel.tsx
│   │   ├── RiskAssessment.tsx
│   │   └── GrowthOpportunities.tsx
│   ├── capital/
│   │   ├── DynamicCapitalStack.tsx
│   │   └── CapitalLeverCard.tsx
│   ├── crm/
│   │   ├── CRMPipeline.tsx
│   │   ├── ContactCard.tsx
│   │   └── OpportunityCard.tsx
│   ├── dashboard/
│   │   ├── PortfolioOverview.tsx
│   │   ├── MetricCard.tsx
│   │   └── ChartSection.tsx
│   ├── investment/
│   │   ├── InvestmentMemoViewer.tsx
│   │   └── InvestorPartnership.tsx
│   ├── planning/
│   │   ├── HundredDayPlan.tsx
│   │   ├── FinancialFreedomRoadmap.tsx
│   │   └── PerformanceSimulator.tsx
│   ├── scanner/
│   │   ├── AgentControlPanel.tsx
│   │   └── AgentDebugPanel.tsx
│   └── shared/
│       ├── DealSelector.tsx
│       ├── UserProfile.tsx
│       └── Navigation.tsx
├── hooks/
│   ├── useBusinessData.ts
│   ├── useAnalysisRuns.ts
│   ├── useRealtimeSubscription.ts
│   └── usePortfolioStats.ts
├── lib/
│   ├── utils.ts
│   ├── formatters.ts
│   └── calculations.ts
├── pages/
│   ├── Index.tsx                  # Main dashboard
│   ├── Auth.tsx                   # Authentication
│   └── NotFound.tsx
├── types/
│   ├── business.ts
│   ├── analysis.ts
│   ├── crm.ts
│   └── investment.ts
├── utils/
│   ├── dataImporter.ts
│   ├── manusDataAdapter.ts
│   └── aiHelpers.ts
└── integrations/
    └── supabase/
        ├── client.ts
        └── types.ts               # Auto-generated

supabase/
└── functions/
    ├── project-million-scanner/   # Main AI analysis engine
    │   └── index.ts
    ├── business-discovery/        # Perplexity-powered discovery
    │   └── index.ts
    └── memo-generator/            # Investment memo generation
        └── index.ts

public/
├── consolidated_data.json         # Fallback data
└── robots.txt

docs/
├── PROJECT_MILLION_IMPLEMENTATION_GUIDE.md  # This file
├── API_INTEGRATION.md
└── DATABASE_SCHEMA.md
```

---

## ⚠️ LESSONS LEARNED & PITFALLS TO AVOID

### 1. Numeric Precision (CRITICAL)
```typescript
// ❌ BAD - Will fail for NUMERIC(5,3) columns if value > 9.999
await supabase.from('businesses').update({ automation_score: 15.234 });

// ✅ GOOD - Always clamp before insert
const clampedScore = clampToDbPrecision(rawScore, 9.999);
await supabase.from('businesses').update({ automation_score: clampedScore });
```

### 2. AI Response Parsing (CRITICAL)
```typescript
// ❌ BAD - AI often wraps JSON in markdown
const data = JSON.parse(aiResponse);

// ✅ GOOD - Strip markdown and handle edge cases
function cleanAndParseJSON(text: string) {
  let cleaned = text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/,\s*}/g, '}')  // Trailing commas
    .replace(/,\s*]/g, ']')
    .trim();
  
  // Find JSON boundaries
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.slice(start, end + 1);
  }
  
  return JSON.parse(cleaned);
}
```

### 3. Fallback Data (CRITICAL)
```typescript
// ❌ BAD - Crashes when API fails
const analysis = await performAIAnalysis(business);
setAnalysis(analysis);

// ✅ GOOD - Always have fallback
const analysis = await performAIAnalysis(business) 
  ?? generateFallbackAnalysis(business);
setAnalysis(analysis);
```

### 4. Real-time Cleanup
```typescript
// ❌ BAD - Memory leak
useEffect(() => {
  supabase.channel('updates').on('*', handler).subscribe();
}, []);

// ✅ GOOD - Proper cleanup
useEffect(() => {
  const channel = supabase.channel('updates').on('*', handler).subscribe();
  return () => { supabase.removeChannel(channel); };
}, []);
```

### 5. NaN Protection in UI
```typescript
// ❌ BAD - Shows "NaN%" or "$NaN"
<p>{(profit / revenue * 100).toFixed(1)}%</p>

// ✅ GOOD - Safe calculation
<p>{formatPercent(safeCalculate(profit / revenue, 0))}</p>
```

### 6. Rate Limiting
```typescript
// ❌ BAD - Will get rate limited
const results = await Promise.all(
  businesses.map(b => callAI(b)) // 100+ parallel calls
);

// ✅ GOOD - Batch with delays
async function processWithRateLimit(items, processor, batchSize = 5, delayMs = 1000) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    if (i + batchSize < items.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return results;
}
```

### 7. Component Error Boundaries
```tsx
// Wrap major sections to prevent full app crashes
<ErrorBoundary fallback={<div>Analysis unavailable</div>}>
  <BusinessAnalysisPanel business={selected} />
</ErrorBoundary>
```

---

## 🚀 RECOMMENDED V2 ENHANCEMENTS

1. **Streaming Analysis Updates**: Implement SSE for real-time AI analysis progress
2. **PDF Export**: Generate downloadable investment memos and reports
3. **Email Integration**: Connect CRM to email providers for automated outreach
4. **Due Diligence Workflow**: Document upload, checklist management, task assignment
5. **Valuation Calculator**: Interactive DCF, comparable analysis, asset-based valuation
6. **Deal Comparisons**: Side-by-side analysis of multiple opportunities
7. **Mobile App**: React Native companion for on-the-go deal review
8. **Webhook Integrations**: Connect to external CRMs (HubSpot, Salesforce)
9. **AI Chat Interface**: Natural language queries about portfolio and opportunities
10. **Automated Alerts**: Email/SMS notifications for high-scoring new opportunities

---

## 📝 AGENT PROMPTS FOR IMPLEMENTATION

### Initial Setup Prompt
```
Create a React + Vite + TypeScript application for business acquisition intelligence.
Use Tailwind CSS with shadcn/ui components. Set up Supabase integration with the 
schema defined in PROJECT_MILLION_IMPLEMENTATION_GUIDE.md. Implement the Portfolio 
Overview dashboard as the main landing page with metrics cards and charts.
```

### AI Analysis Engine Prompt
```
Create a Supabase Edge Function that performs multi-model AI analysis on business
acquisition opportunities. Use GPT-4o for financial analysis, Claude for strategic 
analysis, Gemini for market analysis, and Perplexity for real-time risk assessment.
Implement proper error handling, JSON parsing, and fallback generation as specified
in the implementation guide.
```

### Feature-Specific Prompts
```
Implement the Dynamic Capital Stack component with 6 toggleable financing levers.
Follow the implementation pattern in PROJECT_MILLION_IMPLEMENTATION_GUIDE.md.
Include real-time DSCR calculation and visual feedback for active levers.
```

---

*Last Updated: December 2024*
*Version: 1.0*

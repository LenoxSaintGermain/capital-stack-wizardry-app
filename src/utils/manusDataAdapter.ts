import type { Database } from '../integrations/supabase/types';

type Business = Database['public']['Tables']['businesses']['Insert'];

// Interface for your consolidated Manus data
interface ManusOpportunity {
  id: string;
  title: string;
  location?: string;
  asking_price: number;
  cash_flow?: number;
  revenue?: number;
  score?: number;
  recommendation?: string;
  sector: string;
  description?: string;
  source?: string;
  services?: string[];
  ai_optimization?: {
    optimized_revenue?: number;
    optimized_ebitda?: number;
    roi_on_asking_price?: number;
    payback_period_years?: number;
  };
}

interface ManusContact {
  id: string;
  type: 'broker' | 'seller';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: string;
  source?: string;
  status?: string;
  priority?: string;
  specialization?: string;
  last_contact?: string;
  next_follow_up?: string;
  notes?: string;
}

interface ManusConsolidatedData {
  business_opportunities: {
    scored_businesses: ManusOpportunity[];
    opportunities_pipeline: ManusOpportunity[];
  };
  crm_data: {
    contacts: ManusContact[];
  };
  financial_models: Record<string, any>;
  market_intelligence: {
    sectors_analyzed: string[];
    geographic_focus: string[];
  };
}

export class ManusDataAdapter {
  static transformOpportunityToBusiness(opportunity: ManusOpportunity): Partial<Business> {
    return {
      business_name: opportunity.title,
      sector: opportunity.sector,
      location: opportunity.location || '',
      asking_price: opportunity.asking_price,
      annual_revenue: opportunity.revenue || 0,
      annual_net_profit: opportunity.cash_flow || 0,
      composite_score: opportunity.score || 0,
      automation_opportunity_score: opportunity.ai_optimization?.roi_on_asking_price || 0,
      strategic_flags: [opportunity.recommendation || 'Under Review'],
      resilience_factors: opportunity.services || [],
      data_source: opportunity.source || 'manus_ai',
      last_updated: new Date().toISOString(),
      // Map additional fields
      business_description: opportunity.description || '',
      financial_health_score: this.calculateFinancialHealth(opportunity),
      market_position_score: this.calculateMarketPosition(opportunity),
      growth_potential_score: this.calculateGrowthPotential(opportunity),
    };
  }

  static calculateFinancialHealth(opportunity: ManusOpportunity): number {
    if (!opportunity.revenue || !opportunity.cash_flow) return 50;
    
    const margin = (opportunity.cash_flow / opportunity.revenue) * 100;
    if (margin > 20) return 90;
    if (margin > 15) return 80;
    if (margin > 10) return 70;
    if (margin > 5) return 60;
    return 40;
  }

  static calculateMarketPosition(opportunity: ManusOpportunity): number {
    let score = 50;
    
    // Bonus for high-growth sectors
    const highGrowthSectors = ['electrical_contracting', 'healthcare', 'hvac'];
    if (highGrowthSectors.includes(opportunity.sector)) score += 20;
    
    // Bonus for strong recommendation
    if (opportunity.recommendation?.includes('STRONG BUY')) score += 30;
    else if (opportunity.recommendation?.includes('BUY')) score += 20;
    
    // Bonus for diversified services
    if (opportunity.services && opportunity.services.length > 3) score += 10;
    
    return Math.min(100, score);
  }

  static calculateGrowthPotential(opportunity: ManusOpportunity): number {
    let score = 50;
    
    // AI optimization potential
    if (opportunity.ai_optimization?.roi_on_asking_price) {
      const roi = opportunity.ai_optimization.roi_on_asking_price;
      if (roi > 25) score += 30;
      else if (roi > 15) score += 20;
      else if (roi > 10) score += 10;
    }
    
    // Revenue size (larger businesses often have more growth potential)
    if (opportunity.revenue) {
      if (opportunity.revenue > 10000000) score += 20;
      else if (opportunity.revenue > 5000000) score += 15;
      else if (opportunity.revenue > 1000000) score += 10;
    }
    
    return Math.min(100, score);
  }

  static async importManusData(data: ManusConsolidatedData, supabaseClient: any) {
    const businesses: Partial<Business>[] = [];
    
    // Transform scored businesses
    data.business_opportunities.scored_businesses.forEach(opportunity => {
      businesses.push(this.transformOpportunityToBusiness(opportunity));
    });
    
    // Transform pipeline opportunities
    data.business_opportunities.opportunities_pipeline.forEach(opportunity => {
      businesses.push(this.transformOpportunityToBusiness(opportunity));
    });
    
    // Insert into Supabase
    try {
      const { data: insertedData, error } = await supabaseClient
        .from('businesses')
        .upsert(businesses, { onConflict: 'business_name' });
      
      if (error) throw error;
      
      console.log(`Successfully imported ${businesses.length} businesses from Manus data`);
      return insertedData;
    } catch (error) {
      console.error('Error importing Manus data:', error);
      throw error;
    }
  }

  // Create summary statistics for dashboard
  static generatePortfolioSummary(data: ManusConsolidatedData) {
    const allOpportunities = [
      ...data.business_opportunities.scored_businesses,
      ...data.business_opportunities.opportunities_pipeline
    ];

    const totalValue = allOpportunities.reduce((sum, opp) => sum + opp.asking_price, 0);
    const totalRevenue = allOpportunities.reduce((sum, opp) => sum + (opp.revenue || 0), 0);
    const totalCashFlow = allOpportunities.reduce((sum, opp) => sum + (opp.cash_flow || 0), 0);
    
    const strongBuys = allOpportunities.filter(opp => 
      opp.recommendation?.includes('STRONG BUY') || (opp.score && opp.score > 80)
    );
    
    const sectorBreakdown = allOpportunities.reduce((acc, opp) => {
      acc[opp.sector] = (acc[opp.sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgROI = allOpportunities
      .filter(opp => opp.ai_optimization?.roi_on_asking_price)
      .reduce((sum, opp) => sum + (opp.ai_optimization!.roi_on_asking_price!), 0) / 
      allOpportunities.filter(opp => opp.ai_optimization?.roi_on_asking_price).length;

    return {
      totalOpportunities: allOpportunities.length,
      totalValue: totalValue,
      totalRevenue: totalRevenue,
      totalCashFlow: totalCashFlow,
      strongBuyCount: strongBuys.length,
      avgROI: avgROI || 0,
      sectorBreakdown,
      geographicFocus: data.market_intelligence.geographic_focus,
      contactsCount: data.crm_data.contacts.length
    };
  }
}

// Utility function to load and parse your consolidated data
export async function loadManusConsolidatedData(): Promise<ManusConsolidatedData> {
  try {
    // This would typically load from your JSON file
    // For now, returning a mock structure - you can replace with actual file loading
    const response = await fetch('/consolidated_manus_data.json');
    if (!response.ok) {
      throw new Error('Failed to load consolidated data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading Manus consolidated data:', error);
    // Return empty structure as fallback
    return {
      business_opportunities: {
        scored_businesses: [],
        opportunities_pipeline: []
      },
      crm_data: {
        contacts: []
      },
      financial_models: {},
      market_intelligence: {
        sectors_analyzed: [],
        geographic_focus: []
      }
    };
  }
}
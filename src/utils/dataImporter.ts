import { supabase } from '@/integrations/supabase/client';
import { ManusDataAdapter, loadManusConsolidatedData } from './manusDataAdapter';

export async function importJsonToDatabase() {
  try {
    console.log('Starting JSON data import...');
    
    // Load the JSON data
    const manusData = await loadManusConsolidatedData();
    
    // Import to database
    await ManusDataAdapter.importManusData(manusData, supabase);
    
    console.log('Successfully imported JSON data to database');
    return { success: true };
  } catch (error) {
    console.error('Failed to import JSON data:', error);
    throw error;
  }
}

export async function getPortfolioStatsFromDatabase() {
  try {
    console.log('Fetching portfolio stats from database...');
    
    // Fetch businesses from database
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    if (!businesses || businesses.length === 0) {
      console.log('No businesses found in database');
      return null;
    }
    
    // Calculate portfolio statistics
    const totalOpportunities = businesses.length;
    const totalValue = businesses.reduce((sum, b) => sum + (b.asking_price || 0), 0);
    const totalRevenue = businesses.reduce((sum, b) => sum + (b.annual_revenue || 0), 0);
    const totalCashFlow = businesses.reduce((sum, b) => sum + (b.annual_net_profit || 0), 0);
    
    const strongBuyCount = businesses.filter(b => 
      (b.composite_score && b.composite_score > 80) ||
      (b.strategic_flags && Array.isArray(b.strategic_flags) && 
       b.strategic_flags.some((flag: any) => 
         typeof flag === 'string' && flag.includes('STRONG BUY')))
    ).length;
    
    const businessesWithROI = businesses.filter(b => b.automation_opportunity_score && b.automation_opportunity_score > 0);
    const avgROI = businessesWithROI.length > 0 
      ? businessesWithROI.reduce((sum, b) => sum + (b.automation_opportunity_score || 0), 0) / businessesWithROI.length
      : 0;
    
    // Calculate sector breakdown
    const sectorBreakdown = businesses.reduce((acc, b) => {
      const sector = b.sector || 'unknown';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Get unique locations for geographic focus
    const geographicFocus = [...new Set(businesses.map(b => b.location).filter(Boolean))];
    
    const stats = {
      totalOpportunities,
      totalValue,
      totalRevenue,
      totalCashFlow,
      strongBuyCount,
      avgROI,
      sectorBreakdown,
      geographicFocus,
      contactsCount: 0 // TODO: Add contacts table and query
    };
    
    console.log('Portfolio stats calculated:', stats);
    return stats;
  } catch (error) {
    console.error('Error fetching portfolio stats from database:', error);
    throw error;
  }
}
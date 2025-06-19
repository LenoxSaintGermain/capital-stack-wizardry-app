import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, Users, Shield, CheckCircle, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';

interface Business {
  id: string;
  business_name: string;
  sector: string;
  location: string;
  asking_price: number;
  annual_revenue: number;
  annual_net_profit: number;
  composite_score: number;
  automation_opportunity_score: number;
  last_analyzed_at: string;
  description?: string;
  strategic_flags?: any;
  resilience_factors?: any;
}

interface EnrichmentData {
  ai_summary: string;
  market_analysis: any;
  automation_assessment: any;
  financial_projections: any;
  growth_opportunities: any;
  risk_factors: any;
  competitor_analysis: any;
  confidence_score: number;
}

interface BusinessAnalysisPanelProps {
  selectedBusiness: Business | null;
}

const BusinessAnalysisPanel: React.FC<BusinessAnalysisPanelProps> = ({ selectedBusiness }) => {
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBusiness) {
      fetchEnrichmentData(selectedBusiness.id);
    }
  }, [selectedBusiness]);

  const fetchEnrichmentData = async (businessId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrichment_data')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error) throw error;
      setEnrichmentData(data);
    } catch (error) {
      console.error('Error fetching enrichment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (!selectedBusiness) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 text-center">
          <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Business Selected</h3>
          <p className="text-gray-500">Select a business from the dropdown to view detailed analysis</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading business analysis...</p>
        </CardContent>
      </Card>
    );
  }

  const isPremierMultiTrade = selectedBusiness.business_name === 'Premier Multi-Trade Services';

  return (
    <div className="space-y-6">
      {/* Business Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-blue-600" />
              {selectedBusiness.business_name}
            </CardTitle>
            {isPremierMultiTrade && (
              <Badge className="bg-green-100 text-green-800 font-semibold">Featured Deal</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(selectedBusiness.asking_price)}
              </div>
              <p className="text-sm text-gray-600">Asking Price</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(selectedBusiness.annual_revenue)}
              </div>
              <p className="text-sm text-gray-600">Annual Revenue</p>
            </div>
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {formatPercent(selectedBusiness.composite_score)}
              </div>
              <p className="text-sm text-gray-600">Composite Score</p>
            </div>
          </div>
          
          {selectedBusiness.description && (
            <div className="mt-6">
              <p className="text-gray-700 leading-relaxed">{selectedBusiness.description}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {selectedBusiness.sector}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200">
              {selectedBusiness.location}
            </Badge>
            {selectedBusiness.strategic_flags?.map((flag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-purple-600 border-purple-200">
                {flag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      {enrichmentData && (
        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">AI Summary</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="growth">Growth Plan</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">AI Analysis Summary</h3>
                    <Badge className="bg-green-100 text-green-800">
                      Confidence: {formatPercent(enrichmentData.confidence_score)}
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{enrichmentData.ai_summary}</p>
                  
                  {enrichmentData.market_analysis && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3">Market Analysis</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <ul className="space-y-2">
                          {enrichmentData.market_analysis.location_advantages?.map((advantage: string, index: number) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {advantage}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="financials" className="p-6">
                {enrichmentData.financial_projections && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Financial Projections</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Year 1 Projections</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Revenue:</span>
                              <span className="font-semibold">
                                {formatCurrency(enrichmentData.financial_projections.year_1?.revenue || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Adjusted EBITDA:</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(enrichmentData.financial_projections.year_1?.adjusted_ebitda || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>EBITDA Margin:</span>
                              <span className="font-semibold">
                                {enrichmentData.financial_projections.year_1?.ebitda_margin_pct || 0}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Year 2 Projections</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Revenue:</span>
                              <span className="font-semibold">
                                {formatCurrency(enrichmentData.financial_projections.year_2?.revenue || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Adjusted EBITDA:</span>
                              <span className="font-semibold text-green-600">
                                {formatCurrency(enrichmentData.financial_projections.year_2?.adjusted_ebitda || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>EBITDA Margin:</span>
                              <span className="font-semibold">
                                {enrichmentData.financial_projections.year_2?.ebitda_margin_pct || 0}%
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="growth" className="p-6">
                {enrichmentData.growth_opportunities && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Growth Strategy Pillars</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(enrichmentData.growth_opportunities).map(([key, pillar]: [string, any]) => (
                        <Card key={key} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-semibold mb-2 capitalize">
                              {key.replace(/_/g, ' ').replace('pillar ', 'Pillar ')}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">{pillar.strategy || pillar.impact}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Timeline: {pillar.timeline}</span>
                              {pillar.projected_revenue && (
                                <span className="font-semibold text-green-600">
                                  Revenue Impact: {formatCurrency(pillar.projected_revenue)}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="risks" className="p-6">
                {enrichmentData.risk_factors && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Risk Assessment & Mitigation</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(enrichmentData.risk_factors).map(([key, risk]: [string, any]) => (
                        <Card key={key} className={`border-l-4 ${
                          risk.risk_level === 'low' ? 'border-l-green-500' : 
                          risk.risk_level === 'medium' ? 'border-l-yellow-500' : 'border-l-red-500'
                        }`}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold capitalize">{key.replace(/_/g, ' ')}</h4>
                              <Badge className={
                                risk.risk_level === 'low' ? 'bg-green-100 text-green-800' : 
                                risk.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                              }>
                                {risk.risk_level} Risk
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              <strong>Mitigation:</strong> {risk.mitigation}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessAnalysisPanel;

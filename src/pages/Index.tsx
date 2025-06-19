
import React, { useState, useEffect } from 'react';
import { DollarSign, BarChart, HardHat, Target, Building, Clipboard, ScrollText, GitBranch, Home, Users, Layers, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import PerformanceSimulator from '@/components/PerformanceSimulator';
import FinancialFreedomRoadmap from '@/components/FinancialFreedomRoadmap';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';
import DealSelector from '@/components/DealSelector';
import AgentControlPanel from '@/components/AgentControlPanel';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Custom components
import Section from '@/components/Section';
import DynamicCapitalStack from '@/components/DynamicCapitalStack';
import AppSidebar from '@/components/AppSidebar';

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
  cap_rate?: number;
  payback_years?: number;
  strategic_flags?: string[];
  resilience_factors?: string[];
}

interface EnrichmentData {
  ai_summary?: string;
  market_analysis?: any;
  automation_assessment?: any;
  financial_projections?: any;
  risk_factors?: any;
}

const Index = () => {
  const { user } = useAuth();
  const [selectedDeal, setSelectedDeal] = useState<Business | null>(null);
  const [enrichmentData, setEnrichmentData] = useState<EnrichmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string>('viewer');

  // Check user role for admin access
  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
      } else {
        setUserRole(data?.role || 'viewer');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  // Fetch enrichment data when deal changes
  useEffect(() => {
    if (selectedDeal) {
      fetchEnrichmentData(selectedDeal.id);
    }
  }, [selectedDeal]);

  const fetchEnrichmentData = async (businessId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrichment_data')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching enrichment data:', error);
      } else {
        setEnrichmentData(data);
      }
    } catch (error) {
      console.error('Error fetching enrichment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDealSelect = (deal: Business) => {
    setSelectedDeal(deal);
  };

  const isAdmin = userRole === 'admin';

  // Show auth prompt for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <Badge variant="outline" className="mb-6 text-lg px-4 py-2">
            Investment Platform
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Inefficiency Dividend
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            AI-powered deal discovery, analysis, and investment opportunities through our secure platform.
          </p>
          <div className="space-y-4">
            <Button size="lg" asChild>
              <a href="/auth">Sign In / Create Account</a>
            </Button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Secure access required to view investment materials
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Navigation sections array with admin flags
  const sections = [
    { id: 'deal-selector', title: 'Deal Selection', icon: Building, iconColor: 'text-blue-500', adminOnly: true },
    { id: 'agent-control', title: 'AI Agent Control', icon: Target, iconColor: 'text-purple-500', adminOnly: true },
    { id: 'executive-summary', title: 'I. Executive Summary', icon: BarChart },
    { id: 'acquisition-target', title: 'II. The Acquisition Target', icon: Target },
    { id: 'strategic-rationale', title: 'III. Strategic Rationale', icon: HardHat },
    { id: '100-day-plan', title: 'IV. The 100-Day Plan', icon: Clipboard },
    { id: 'capital-strategy', title: 'V. Dynamic Capital Strategy', icon: Layers, iconColor: 'text-purple-500' },
    { id: 'performance-simulator', title: 'VI. Post-Acquisition Performance Simulator', icon: DollarSign, iconColor: 'text-green-500' },
    { id: 'freedom-roadmap', title: 'VII. Your Path to Financial Freedom', icon: Plane, iconColor: 'text-blue-500' },
    { id: 'financial-projections', title: 'VIII. Financial Projections', icon: DollarSign },
    { id: 'investor-opportunity', title: 'IX. Investor Partnership', icon: Users, iconColor: 'text-green-500' },
    { id: 'risk-analysis', title: 'X. Risk Analysis & Mitigation', icon: GitBranch },
    { id: 'appendix', title: 'XI. Appendix: Supporting Data', icon: ScrollText },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <AppSidebar sections={sections} isAdmin={isAdmin} />
          
          <SidebarInset>
            <div className="flex-1 overflow-auto">
              {/* Header with Sidebar Toggle and User Profile */}
              <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <SidebarTrigger />
                    <div className="text-center flex-1">
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Investment Platform
                      </Badge>
                    </div>
                  </div>
                  <UserProfile />
                </div>
              </header>

              {/* Main Content */}
              <main className="p-6 lg:p-10">
                <div className="text-center mb-12">
                  <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    The Inefficiency Dividend
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                    AI-Powered Deal Discovery & Analysis Platform
                  </p>
                  <p className="text-lg text-gray-500 dark:text-gray-500">
                    Date: {new Date().toLocaleDateString()}
                  </p>
                </div>

                {/* Admin Only Sections */}
                {isAdmin && (
                  <>
                    {/* Deal Selector */}
                    <Section id="deal-selector" title="Deal Selection" icon={Building} iconColor="text-blue-500">
                      <DealSelector selectedDeal={selectedDeal} onDealSelect={handleDealSelect} />
                    </Section>

                    {/* Agent Control Panel */}
                    <Section id="agent-control" title="AI Agent Control" icon={Target} iconColor="text-purple-500">
                      <AgentControlPanel />
                    </Section>
                  </>
                )}

                {selectedDeal ? (
                  <>
                    {/* Executive Summary */}
                    <Section id="executive-summary" title="I. Executive Summary" icon={BarChart}>
                      <div className="prose prose-lg max-w-none dark:prose-invert">
                        {enrichmentData?.ai_summary ? (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500 mb-6">
                            <p className="text-lg leading-relaxed">{enrichmentData.ai_summary}</p>
                          </div>
                        ) : (
                          <p className="text-lg leading-relaxed mb-6">
                            <strong>{selectedDeal.business_name}</strong> represents a compelling acquisition opportunity in the {selectedDeal.sector} sector. 
                            This {selectedDeal.location}-based business demonstrates strong fundamentals with {formatCurrency(selectedDeal.annual_revenue)} in annual revenue 
                            and a composite score of {(selectedDeal.composite_score * 100).toFixed(0)}%.
                          </p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                          <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <Target className="w-5 h-5 mr-2 text-blue-500" />
                                Acquire
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Target: {selectedDeal.business_name} at {formatCurrency(selectedDeal.asking_price)}</p>
                            </CardContent>
                          </Card>
                          <Card className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <HardHat className="w-5 h-5 mr-2 text-green-500" />
                                Optimize
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">AI Score: {(selectedDeal.automation_opportunity_score * 100).toFixed(0)}% automation potential</p>
                            </CardContent>
                          </Card>
                          <Card className="border-l-4 border-l-purple-500">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <Layers className="w-5 h-5 mr-2 text-purple-500" />
                                Leverage
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Strategic capital structure with optimized returns</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </Section>

                    {/* Acquisition Target */}
                    <Section id="acquisition-target" title="II. The Acquisition Target" icon={Target}>
                      <div className="mb-6">
                        <p className="text-lg leading-relaxed mb-6">
                          <strong>{selectedDeal.business_name}</strong> is a well-established business in the {selectedDeal.sector} sector, 
                          based in {selectedDeal.location}.
                        </p>
                        {selectedDeal.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {selectedDeal.description}
                          </p>
                        )}
                      </div>
                      <Card>
                        <CardHeader>
                          <CardTitle>Key Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-3 px-4 text-left font-semibold">Metric</th>
                                  <th className="py-3 px-4 text-left font-semibold">Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                <tr><td className="py-3 px-4">Asking Price</td><td className="py-3 px-4 font-mono">{formatCurrency(selectedDeal.asking_price)}</td></tr>
                                <tr><td className="py-3 px-4">Gross Revenue</td><td className="py-3 px-4 font-mono">{formatCurrency(selectedDeal.annual_revenue)}</td></tr>
                                <tr><td className="py-3 px-4">Net Profit</td><td className="py-3 px-4 font-mono">{formatCurrency(selectedDeal.annual_net_profit)}</td></tr>
                                {selectedDeal.cap_rate && <tr><td className="py-3 px-4">Cap Rate</td><td className="py-3 px-4 font-mono">{selectedDeal.cap_rate}%</td></tr>}
                                {selectedDeal.payback_years && <tr><td className="py-3 px-4">Payback Period</td><td className="py-3 px-4 font-mono">{selectedDeal.payback_years} years</td></tr>}
                                <tr><td className="py-3 px-4">Composite Score</td><td className="py-3 px-4 font-mono">{(selectedDeal.composite_score * 100).toFixed(0)}%</td></tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </Section>

                    {/* Keep existing sections with dynamic data */}
                    <Section id="strategic-rationale" title="III. Strategic Rationale" icon={HardHat}>
                      <p className="text-lg leading-relaxed mb-6">
                        The core investment thesis for <strong>{selectedDeal.business_name}</strong> is amplified by strategic rationale 
                        combining operational optimization, inherent growth levers, and competitive advantages in the {selectedDeal.sector} sector.
                      </p>
                      
                      {selectedDeal.strategic_flags && selectedDeal.strategic_flags.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold mb-3">Strategic Flags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDeal.strategic_flags.map((flag, index) => (
                              <Badge key={index} variant="outline" className="capitalize">
                                {flag.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDeal.resilience_factors && selectedDeal.resilience_factors.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3">Resilience Factors:</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDeal.resilience_factors.map((factor, index) => (
                              <Badge key={index} variant="secondary" className="capitalize">
                                {factor.replace(/_/g, ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Section>

                    <Section id="100-day-plan" title="IV. The 100-Day Plan" icon={Clipboard}>
                      <p className="text-lg mb-8">Our post-acquisition plan for {selectedDeal.business_name} is designed for rapid value creation and risk mitigation.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-t-4 border-t-blue-500">
                          <CardHeader>
                            <CardTitle className="text-blue-700 dark:text-blue-300">
                              Phase 1: Stabilize & Assess
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Days 1-30</p>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">Foundation setting and team assessment</p>
                          </CardContent>
                        </Card>
                        <Card className="border-t-4 border-t-green-500">
                          <CardHeader>
                            <CardTitle className="text-green-700 dark:text-green-300">
                              Phase 2: Implement & Optimize
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Days 31-60</p>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">AI integration and process optimization</p>
                          </CardContent>
                        </Card>
                        <Card className="border-t-4 border-t-purple-500">
                          <CardHeader>
                            <CardTitle className="text-purple-700 dark:text-purple-300">
                              Phase 3: Scale & Grow
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Days 61-100</p>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">Market expansion and revenue acceleration</p>
                          </CardContent>
                        </Card>
                      </div>
                    </Section>
                    
                    <Section id="capital-strategy" title="V. Dynamic Capital Strategy" icon={Layers} iconColor="text-purple-500">
                      <div className="mb-8">
                        <p className="text-lg leading-relaxed mb-6">
                          To de-risk the acquisition of <strong>{selectedDeal.business_name}</strong> and achieve a near-zero equity structure, 
                          we will deploy a sophisticated, multi-tranche capital stack based on the deal's {formatCurrency(selectedDeal.asking_price)} asking price.
                        </p>
                      </div>
                      <DynamicCapitalStack />
                    </Section>

                    <Section id="performance-simulator" title="VI. Post-Acquisition Performance Simulator" icon={DollarSign} iconColor="text-green-500">
                      <div className="mb-8">
                        <p className="text-lg leading-relaxed mb-6">
                          This interactive simulator models the financial performance of <strong>{selectedDeal.business_name}</strong> post-acquisition. 
                          Based on current metrics of {formatCurrency(selectedDeal.annual_revenue)} revenue and {formatCurrency(selectedDeal.annual_net_profit)} profit,
                          adjust scenarios to see investor returns and owner distributions.
                        </p>
                      </div>
                      <PerformanceSimulator />
                    </Section>

                    <Section id="freedom-roadmap" title="VII. Your Path to Financial Freedom" icon={Plane} iconColor="text-blue-500">
                      <div className="mb-8">
                        <p className="text-lg leading-relaxed mb-6">
                          The acquisition of <strong>{selectedDeal.business_name}</strong> creates a clear roadmap to financial independence. 
                          See how the projected monthly distributions enable you to replace W2 income and build a portfolio of cash-flowing businesses.
                        </p>
                      </div>
                      <FinancialFreedomRoadmap />
                    </Section>

                    <Section id="financial-projections" title="VIII. Financial Projections" icon={DollarSign}>
                      <p className="text-lg mb-6">
                        The following pro-forma demonstrates the powerful EBITDA growth that fuels the entire capital structure, ensuring all tranches of capital are well-covered.
                      </p>
                      <Card>
                        <CardHeader>
                          <CardTitle>Financial Projections</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-3 px-4 text-left font-semibold">Line Item</th>
                                  <th className="py-3 px-4 text-left font-semibold">Baseline</th>
                                  <th className="py-3 px-4 text-left font-semibold">Year 1</th>
                                  <th className="py-3 px-4 text-left font-semibold">Year 2</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="bg-blue-50 dark:bg-blue-900/20 font-semibold text-blue-700 dark:text-blue-300">
                                  <td className="py-3 px-4">Adjusted EBITDA</td>
                                  <td className="py-3 px-4 font-mono">$500,000</td>
                                  <td className="py-3 px-4 font-mono">$675,000</td>
                                  <td className="py-3 px-4 font-mono">$1,042,500</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </Section>
                    
                    <Section id="investor-opportunity" title="IX. Investor Partnership" icon={Users} iconColor="text-green-500">
                      <div className="mb-8">
                        <p className="text-lg leading-relaxed mb-6">
                          With the deal structure de-risked through the layered capital strategy, we are syndicating a preferred equity tranche to mission-aligned impact funds (Veteran, Minority, ESG). This is an opportunity to secure a preferred return on a high-cashflow asset with strong downside protection.
                        </p>
                      </div>
                      
                      <Card className="border-l-4 border-l-green-500">
                        <CardHeader>
                          <CardTitle className="text-green-700 dark:text-green-300">
                            The Offering: $250k Preferred Equity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <span className="font-semibold mr-2">Target Investors:</span>
                              <span>Funds like Second Service Foundation, Bunker Labs vehicles.</span>
                            </li>
                            <li className="flex items-start">
                              <span className="font-semibold mr-2">Structure:</span>
                              <span>8% preferred return (PIK or cash) + 1.25x exit cap.</span>
                            </li>
                            <li className="flex items-start">
                              <span className="font-semibold mr-2">Impact:</span>
                              <span>This tranche provides bragging rights on vet-led wealth creation while you retain {'>'}80% of common equity and upside.</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </Section>
                    
                    <Section id="risk-analysis" title="X. Risk Analysis & Mitigation" icon={GitBranch}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="py-3 px-4 text-left font-semibold">Risk</th>
                                  <th className="py-3 px-4 text-left font-semibold">Mitigation Strategy</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                <tr>
                                  <td className="py-4 px-4 font-semibold">Execution & Integration</td>
                                  <td className="py-4 px-4">The 100-day plan is ambitious. We will mitigate this with (a) a performance-based seller earn-out to ensure knowledge transfer, and (b) an employee co-investment pool to drive team buy-in and retention.</td>
                                </tr>
                                <tr>
                                  <td className="py-4 px-4 font-semibold">Capital Sourcing</td>
                                  <td className="py-4 px-4">The multi-tranche approach diversifies funding risk. Each "lever" targets a different capital pool (impact, green, government, etc.), increasing the probability of a full subscription.</td>
                                </tr>
                                <tr>
                                  <td className="py-4 px-4 font-semibold">Market Downturn</td>
                                  <td className="py-4 px-4">The business provides essential, recession-resistant services. The addition of long-term government contracts via SDVOSB certification provides a further buffer.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </Section>
                    
                    <Section id="appendix" title="XI. Appendix: Supporting Data" icon={ScrollText}>
                      <p className="text-lg">Supporting documentation, market analysis, and detailed financial models are available in the full data room.</p>
                    </Section>

                    {/* Footer */}
                    <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
                      <p>© 2025 The Inefficiency Dividend. Confidential and Proprietary.</p>
                    </footer>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {isAdmin ? 'No Deal Selected' : 'Investment Analysis'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {isAdmin ? 
                        'Select a deal from the Deal Selector above or run the AI Agent to discover new opportunities.' :
                        'Contact your investment advisor to access specific deal analysis.'
                      }
                    </p>
                  </div>
                )}
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
};

export default Index;

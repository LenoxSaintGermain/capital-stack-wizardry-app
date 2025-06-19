import React, { useState, useEffect, useMemo } from 'react';
import { DollarSign, BarChart, HardHat, Target, Building, Clipboard, ScrollText, GitBranch, Home, ChevronDown, ChevronUp, Users, Layers, CheckSquare, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PerformanceSimulator from '@/components/PerformanceSimulator';
import FinancialFreedomRoadmap from '@/components/FinancialFreedomRoadmap';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';

// Custom components
import Section from '@/components/Section';
import CollapsibleSection from '@/components/CollapsibleSection';
import DynamicCapitalStack from '@/components/DynamicCapitalStack';
import Navigation from '@/components/Navigation';

const Index = () => {
  const { user } = useAuth();

  // Show auth prompt for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <Badge variant="outline" className="mb-6 text-lg px-4 py-2">
            Investment Memorandum
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Inefficiency Dividend
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Access exclusive deal analysis, financial projections, and investment opportunities through our secure platform.
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

  // Navigation sections array
  const sections = [
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans text-gray-900 dark:text-gray-50 flex flex-col lg:flex-row">
        {/* Navigation */}
        <Navigation sections={sections} />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {/* Header with User Profile */}
          <header className="mb-12">
            <div className="flex justify-between items-start mb-6">
              <div className="text-center flex-1">
                <Badge variant="outline" className="mb-4 text-lg px-4 py-2">
                  Investment Memorandum
                </Badge>
              </div>
              <UserProfile />
            </div>
            <div className="text-center">
              <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                The Inefficiency Dividend
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                Project: "Raleigh Keystone"
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-500">
                Date: June 17, 2025
              </p>
            </div>
          </header>

          {/* Sections */}
          <Section id="executive-summary" title="I. Executive Summary" icon={BarChart}>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed mb-6">
                The Inefficiency Dividend is an acquisition lab that buys dull, defensible businesses and unlocks hidden profit with AI-driven process surgery—paying investors predictable cash from others' operational neglect. Our model is a clear, repeatable formula:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-500" />
                      Acquire
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Target essential service businesses at a disciplined 3-5x EBITDA.</p>
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
                    <p className="text-sm">Inject generative AI and workflow automation to drastically cut operational drag.</p>
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
                    <p className="text-sm">Utilize a stacked, multi-tranche capital structure with near-zero personal equity.</p>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-l-4 border-blue-500">
                <p className="font-semibold text-blue-700 dark:text-blue-300 text-lg">
                  The "Raleigh Keystone" target is the ideal first execution of this advanced strategy.
                </p>
              </div>
            </div>
          </Section>

          <Section id="acquisition-target" title="II. The Acquisition Target" icon={Target}>
            <div className="mb-6">
              <p className="text-lg leading-relaxed mb-6">
                This target is a well-established and highly-regarded residential and commercial services company based in Raleigh, North Carolina.
              </p>
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
                      <tr><td className="py-3 px-4">Asking Price</td><td className="py-3 px-4 font-mono">$2,800,000</td></tr>
                      <tr><td className="py-3 px-4">Gross Revenue</td><td className="py-3 px-4 font-mono">$3,600,000</td></tr>
                      <tr><td className="py-3 px-4">EBITDA</td><td className="py-3 px-4 font-mono">$500,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Section>

          <Section id="strategic-rationale" title="III. Strategic Rationale" icon={HardHat}>
            <p className="text-lg leading-relaxed">
              The core investment thesis is amplified by a multi-layered strategic rationale that combines operational optimization, inherent growth levers, and an unfair competitive advantage through certification arbitrage.
            </p>
          </Section>
          
          <Section id="100-day-plan" title="IV. The 100-Day Plan" icon={Clipboard}>
            <p className="text-lg mb-8">Our post-acquisition plan is designed for rapid value creation and risk mitigation.</p>
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
                To de-risk the acquisition and achieve a near-zero equity structure, we will deploy a sophisticated, multi-tranche capital stack. This transforms the deal into a self-funding engine powered by its own future efficiencies and strategic assets.
              </p>
            </div>
            <DynamicCapitalStack />
          </Section>

          <Section id="performance-simulator" title="VI. Post-Acquisition Performance Simulator" icon={DollarSign} iconColor="text-green-500">
            <div className="mb-8">
              <p className="text-lg leading-relaxed mb-6">
                This interactive simulator models the financial performance and cash flow distributions post-acquisition. 
                Adjust growth assumptions and scenarios to see how different outcomes affect investor returns, debt coverage, 
                and owner distributions over time.
              </p>
            </div>
            <PerformanceSimulator />
          </Section>

          <Section id="freedom-roadmap" title="VII. Your Path to Financial Freedom" icon={Plane} iconColor="text-blue-500">
            <div className="mb-8">
              <p className="text-lg leading-relaxed mb-6">
                This acquisition isn't just about financial returns—it's about transforming your life. See how the monthly distributions 
                from Raleigh Keystone create a clear roadmap to financial independence, enabling you to replace your W2 income, 
                fund additional acquisitions, and build a portfolio of cash-flowing businesses that work while you sleep.
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
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;

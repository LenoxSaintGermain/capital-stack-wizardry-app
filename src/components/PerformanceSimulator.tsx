
import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign, BarChart, Target, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface ScenarioInputs {
  revenueGrowthY1: number;
  revenueGrowthY2: number;
  marginExpansion: number;
  aiCostSavings: number;
  marketDownturn: number;
}

interface CapitalStructure {
  sba7a: number;
  sellerNote: number;
  revenueNote: number;
  impactEquity: number;
  greenFinancing: number;
  employeeCoInvest: number;
  grant: number;
  buyerEquity: number;
}

const PerformanceSimulator: React.FC = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');
  const [scenario, setScenario] = useState<'conservative' | 'base' | 'aggressive'>('base');
  const [customInputs, setCustomInputs] = useState<ScenarioInputs>({
    revenueGrowthY1: 15,
    revenueGrowthY2: 25,
    marginExpansion: 5,
    aiCostSavings: 12,
    marketDownturn: 0,
  });

  // Base case assumptions from the memo
  const baselineMetrics = {
    revenue: 3600000,
    ebitda: 500000,
    debtService: 456000, // Approximate from SBA loan
  };

  const capitalStructure: CapitalStructure = {
    sba7a: 1815000,
    sellerNote: 560000,
    revenueNote: 500000,
    impactEquity: 250000,
    greenFinancing: 250000,
    employeeCoInvest: 100000,
    grant: 25000,
    buyerEquity: 0,
  };

  const scenarioPresets = {
    conservative: { revenueGrowthY1: 8, revenueGrowthY2: 15, marginExpansion: 3, aiCostSavings: 8, marketDownturn: 10 },
    base: { revenueGrowthY1: 15, revenueGrowthY2: 25, marginExpansion: 5, aiCostSavings: 12, marketDownturn: 0 },
    aggressive: { revenueGrowthY1: 22, revenueGrowthY2: 35, marginExpansion: 8, aiCostSavings: 18, marketDownturn: 0 },
  };

  const performanceData = useMemo(() => {
    const inputs = scenario === 'base' ? customInputs : scenarioPresets[scenario];
    const periods = viewMode === 'monthly' ? 36 : viewMode === 'quarterly' ? 12 : 3;
    const periodLabel = viewMode === 'monthly' ? 'Month' : viewMode === 'quarterly' ? 'Q' : 'Year';
    
    const data = [];
    
    for (let i = 0; i <= periods; i++) {
      const yearFraction = viewMode === 'monthly' ? i / 12 : viewMode === 'quarterly' ? i / 4 : i;
      
      // Revenue growth model
      let revenueMultiplier = 1;
      if (yearFraction <= 1) {
        revenueMultiplier = 1 + (inputs.revenueGrowthY1 / 100) * yearFraction;
      } else if (yearFraction <= 2) {
        revenueMultiplier = 1 + (inputs.revenueGrowthY1 / 100) + 
          (inputs.revenueGrowthY2 / 100) * (yearFraction - 1);
      } else {
        revenueMultiplier = 1 + (inputs.revenueGrowthY1 / 100) + (inputs.revenueGrowthY2 / 100) + 
          (inputs.revenueGrowthY2 / 100) * 0.5 * (yearFraction - 2);
      }
      
      // Apply market downturn if applicable
      if (inputs.marketDownturn > 0 && yearFraction >= 1) {
        revenueMultiplier *= (1 - inputs.marketDownturn / 100);
      }
      
      const revenue = baselineMetrics.revenue * revenueMultiplier;
      
      // EBITDA expansion from AI optimization and margin improvement
      const baseMargin = baselineMetrics.ebitda / baselineMetrics.revenue;
      const improvedMargin = baseMargin + (inputs.marginExpansion / 100) + 
        (inputs.aiCostSavings / 100) * Math.min(yearFraction / 2, 1);
      const ebitda = revenue * improvedMargin;
      
      // Debt service remains constant
      const debtService = baselineMetrics.debtService;
      const freeCashFlow = ebitda - debtService;
      
      // Cash waterfall calculations
      const revenueNotePayment = Math.min(freeCashFlow * 0.08, capitalStructure.revenueNote * 0.08); // 8% on outstanding
      const impactEquityReturn = capitalStructure.impactEquity * 0.08; // 8% preferred
      const remainingCash = Math.max(0, freeCashFlow - revenueNotePayment - impactEquityReturn);
      
      data.push({
        period: i === 0 ? 'Baseline' : `${periodLabel}${i}`,
        revenue: revenue / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
        ebitda: ebitda / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
        freeCashFlow: freeCashFlow / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
        revenueNotePayment: revenueNotePayment / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
        impactEquityReturn: impactEquityReturn / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
        ownerDistribution: remainingCash / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
        dscr: ebitda / debtService,
        cumulativeOwnerReturns: i === 0 ? 0 : (data[i-1]?.cumulativeOwnerReturns || 0) + remainingCash / (viewMode === 'annual' ? 1 : viewMode === 'quarterly' ? 4 : 12),
      });
    }
    
    return data;
  }, [viewMode, scenario, customInputs]);

  const chartConfig = {
    revenue: { label: "Revenue", color: "#3b82f6" },
    ebitda: { label: "EBITDA", color: "#10b981" },
    freeCashFlow: { label: "Free Cash Flow", color: "#8b5cf6" },
  };

  const roiMetrics = useMemo(() => {
    const totalData = performanceData.slice(1); // Exclude baseline
    const totalImpactReturns = totalData.reduce((sum, period) => sum + period.impactEquityReturn, 0);
    const totalOwnerReturns = totalData.reduce((sum, period) => sum + period.ownerDistribution, 0);
    
    const impactEquityROI = ((totalImpactReturns / capitalStructure.impactEquity) - 1) * 100;
    const ownerROI = capitalStructure.buyerEquity > 0 ? 
      ((totalOwnerReturns / capitalStructure.buyerEquity) - 1) * 100 : Infinity;
    
    return {
      impactEquityROI,
      ownerROI,
      totalImpactReturns,
      totalOwnerReturns,
      paybackPeriod: capitalStructure.buyerEquity > 0 ? 
        capitalStructure.buyerEquity / (totalOwnerReturns / totalData.length) : 0,
    };
  }, [performanceData]);

  const handleScenarioChange = (newScenario: 'conservative' | 'base' | 'aggressive') => {
    setScenario(newScenario);
    if (newScenario !== 'base') {
      setCustomInputs(scenarioPresets[newScenario]);
    }
  };

  const handleInputChange = (key: keyof ScenarioInputs, value: number) => {
    setCustomInputs(prev => ({ ...prev, [key]: value }));
    setScenario('base'); // Switch to custom when user modifies inputs
  };

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-purple-500" />
            Performance Simulator Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* View Mode */}
            <div>
              <label className="block text-sm font-semibold mb-2">Time Period</label>
              <div className="flex gap-2">
                {(['monthly', 'quarterly', 'annual'] as const).map((mode) => (
                  <Button
                    key={mode}
                    variant={viewMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode(mode)}
                    className="capitalize"
                  >
                    {mode}
                  </Button>
                ))}
              </div>
            </div>

            {/* Scenario Presets */}
            <div>
              <label className="block text-sm font-semibold mb-2">Scenario</label>
              <div className="flex gap-2">
                {(['conservative', 'base', 'aggressive'] as const).map((scenarioType) => (
                  <Button
                    key={scenarioType}
                    variant={scenario === scenarioType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleScenarioChange(scenarioType)}
                    className="capitalize"
                  >
                    {scenarioType}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Inputs */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold mb-2">Growth Assumptions (%)</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Y1 Revenue Growth</label>
                  <input
                    type="number"
                    value={customInputs.revenueGrowthY1}
                    onChange={(e) => handleInputChange('revenueGrowthY1', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">AI Cost Savings</label>
                  <input
                    type="number"
                    value={customInputs.aiCostSavings}
                    onChange={(e) => handleInputChange('aiCostSavings', Number(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                    min="0"
                    max="25"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Impact Fund ROI</p>
                <p className="text-2xl font-bold text-green-600">
                  {roiMetrics.impactEquityROI.toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Owner Cash-on-Cash</p>
                <p className="text-2xl font-bold text-purple-600">
                  {isFinite(roiMetrics.ownerROI) ? `${roiMetrics.ownerROI.toFixed(0)}%` : '∞'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg DSCR</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(performanceData.slice(1).reduce((sum, p) => sum + p.dscr, 0) / (performanceData.length - 1)).toFixed(2)}x
                </p>
              </div>
              <BarChart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Owner Returns</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(roiMetrics.totalOwnerReturns)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue & EBITDA Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & EBITDA Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <LineChart data={performanceData.slice(1)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} />
                <Line type="monotone" dataKey="ebitda" stroke="var(--color-ebitda)" strokeWidth={3} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cash Flow Waterfall */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              ownerDistribution: { label: "Owner", color: "#8b5cf6" },
              impactEquityReturn: { label: "Impact Fund", color: "#10b981" },
              revenueNotePayment: { label: "Revenue Note", color: "#f59e0b" },
            }} className="h-80">
              <RechartsBarChart data={performanceData.slice(1)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenueNotePayment" stackId="a" fill="#f59e0b" />
                <Bar dataKey="impactEquityReturn" stackId="a" fill="#10b981" />
                <Bar dataKey="ownerDistribution" stackId="a" fill="#8b5cf6" />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="w-6 h-6 mr-3" />
            Scenario Analysis & Risk Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Best Case</h4>
              <p className="text-sm">AI optimizations deliver 18% cost savings, revenue grows 35% in Y2</p>
              <p className="font-mono text-sm mt-1">Owner IRR: {'>'}45%</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Base Case</h4>
              <p className="text-sm">Moderate growth with 12% AI savings, steady market conditions</p>
              <p className="font-mono text-sm mt-1">Owner IRR: ≈32%</p>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Stress Case</h4>
              <p className="text-sm">10% market downturn, slower AI adoption, conservative growth</p>
              <p className="font-mono text-sm mt-1">Impact Fund: Still covered</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Board Reporting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Export Performance Summary
            </Button>
            <Button variant="outline" className="flex items-center">
              <BarChart className="w-4 h-4 mr-2" />
              Generate Investor Report
            </Button>
            <Button variant="outline" className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Download Cash Flow Model
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceSimulator;

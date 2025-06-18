
import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign, Home, Plane, Trophy, Building2, MapPin, Target, Clock, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface LifestyleMilestone {
  month: number;
  title: string;
  description: string;
  monthlyIncome: number;
  icon: React.ComponentType<any>;
  color: string;
  achieved?: boolean;
}

const FinancialFreedomRoadmap: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'conservative' | 'base' | 'aggressive'>('base');
  const [viewMode, setViewMode] = useState<'lifestyle' | 'portfolio' | 'wealth'>('lifestyle');

  // Base case monthly distributions from Raleigh Keystone
  const monthlyDistributions = useMemo(() => {
    const scenarios = {
      conservative: { y1: 18000, y2: 25000, y3: 32000 },
      base: { y1: 25000, y2: 35000, y3: 48000 },
      aggressive: { y1: 32000, y2: 45000, y3: 65000 },
    };
    
    const scenario = scenarios[selectedScenario];
    const data = [];
    
    for (let month = 1; month <= 36; month++) {
      let monthlyIncome;
      if (month <= 12) {
        monthlyIncome = scenario.y1 * (month / 12);
      } else if (month <= 24) {
        monthlyIncome = scenario.y1 + (scenario.y2 - scenario.y1) * ((month - 12) / 12);
      } else {
        monthlyIncome = scenario.y2 + (scenario.y3 - scenario.y2) * ((month - 24) / 12);
      }
      
      data.push({
        month,
        monthlyIncome: Math.round(monthlyIncome),
        cumulativeIncome: data.length > 0 ? data[data.length - 1].cumulativeIncome + Math.round(monthlyIncome) : Math.round(monthlyIncome),
        portfolioValue: Math.round(monthlyIncome * 12 * 5), // 5x multiple for portfolio valuation
      });
    }
    
    return data;
  }, [selectedScenario]);

  const lifestyleMilestones: LifestyleMilestone[] = [
    {
      month: 3,
      title: "Side Income Security",
      description: "Monthly distributions cover car payments & dining out",
      monthlyIncome: 8000,
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      month: 8,
      title: "Mortgage Freedom",
      description: "Business cash flow covers full housing costs",
      monthlyIncome: 15000,
      icon: Home,
      color: "text-green-500",
    },
    {
      month: 14,
      title: "Career Optionality",
      description: "Replace W2 salary - work becomes a choice",
      monthlyIncome: 25000,
      icon: Trophy,
      color: "text-purple-500",
    },
    {
      month: 18,
      title: "Investment Runway",
      description: "Accumulate capital for next acquisition",
      monthlyIncome: 35000,
      icon: Rocket,
      color: "text-orange-500",
    },
    {
      month: 24,
      title: "Portfolio Expansion",
      description: "Acquire Business #2 with proven playbook",
      monthlyIncome: 45000,
      icon: Building2,
      color: "text-indigo-500",
    },
    {
      month: 36,
      title: "Financial Independence",
      description: "Multi-business portfolio generating $50K+/month",
      monthlyIncome: 65000,
      icon: Plane,
      color: "text-pink-500",
    },
  ];

  const portfolioGrowthData = useMemo(() => {
    const data = [];
    let businesses = 1;
    let totalMonthlyIncome = monthlyDistributions[11]?.monthlyIncome || 25000;
    
    for (let year = 1; year <= 5; year++) {
      if (year > 1) {
        // Add new business every 18 months
        if (year === 2 || year === 4) {
          businesses += 1;
          totalMonthlyIncome += totalMonthlyIncome * 0.8; // New business at 80% of previous
        }
      }
      
      data.push({
        year,
        businesses,
        monthlyIncome: Math.round(totalMonthlyIncome),
        portfolioValue: Math.round(totalMonthlyIncome * 12 * 5),
        acquisitionCapacity: Math.round(totalMonthlyIncome * 6), // 6 months of income for next deal
      });
      
      totalMonthlyIncome *= 1.15; // 15% annual growth
    }
    
    return data;
  }, [monthlyDistributions]);

  const wealthBuildingMetrics = useMemo(() => {
    const currentData = monthlyDistributions[monthlyDistributions.length - 1];
    const annualIncome = currentData.monthlyIncome * 12;
    const portfolioValue = currentData.portfolioValue;
    
    return {
      timeToFreedom: Math.round(250000 / currentData.monthlyIncome), // Months to replace $100K salary
      nextAcquisitionFunding: Math.round(currentData.monthlyIncome * 6),
      wealthMultiplier: Math.round(portfolioValue / 50000), // Assuming $50K initial investment
      passiveIncomeRatio: Math.round((annualIncome / 75000) * 100), // vs median household income
    };
  }, [monthlyDistributions]);

  const chartConfig = {
    monthlyIncome: { label: "Monthly Income", color: "#10b981" },
    cumulativeIncome: { label: "Cumulative", color: "#3b82f6" },
    portfolioValue: { label: "Portfolio Value", color: "#8b5cf6" },
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-6 h-6 mr-3 text-green-500" />
            Your Path to Financial Freedom
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">Growth Scenario</label>
              <div className="flex gap-2">
                {(['conservative', 'base', 'aggressive'] as const).map((scenario) => (
                  <Button
                    key={scenario}
                    variant={selectedScenario === scenario ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedScenario(scenario)}
                    className="capitalize"
                  >
                    {scenario}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-sm font-semibold mb-2">View Mode</label>
              <div className="flex gap-2">
                {(['lifestyle', 'portfolio', 'wealth'] as const).map((mode) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Freedom Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time to Freedom</p>
                <p className="text-2xl font-bold text-green-600">
                  {wealthBuildingMetrics.timeToFreedom} months
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Next Deal Funding</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(wealthBuildingMetrics.nextAcquisitionFunding)}
                </p>
              </div>
              <Rocket className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Wealth Multiplier</p>
                <p className="text-2xl font-bold text-purple-600">
                  {wealthBuildingMetrics.wealthMultiplier}x
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">vs Median Income</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {wealthBuildingMetrics.passiveIncomeRatio}%
                </p>
              </div>
              <Trophy className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lifestyle Milestones Timeline */}
      {viewMode === 'lifestyle' && (
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle Transformation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {lifestyleMilestones.map((milestone, index) => {
                const currentMonthData = monthlyDistributions[milestone.month - 1];
                const achieved = currentMonthData?.monthlyIncome >= milestone.monthlyIncome;
                const IconComponent = milestone.icon;
                
                return (
                  <div key={index} className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 ${
                    achieved ? 'border-l-green-500 bg-green-50 dark:bg-green-900/20' : 'border-l-gray-300 bg-gray-50 dark:bg-gray-800/50'
                  }`}>
                    <div className={`p-2 rounded-full ${achieved ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{milestone.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={achieved ? "default" : "secondary"}>
                            Month {milestone.month}
                          </Badge>
                          <Badge variant="outline">
                            {formatCurrency(milestone.monthlyIncome)}/mo
                          </Badge>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      {achieved && (
                        <p className="text-green-600 dark:text-green-400 text-sm mt-1 font-medium">
                          ✓ Milestone achieved with {formatCurrency(currentMonthData.monthlyIncome)}/month
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Growth View */}
      {viewMode === 'portfolio' && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Expansion Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <ChartContainer config={{
                  businesses: { label: "Businesses", color: "#10b981" },
                  monthlyIncome: { label: "Monthly Income", color: "#3b82f6" },
                }} className="h-80">
                  <RechartsBarChart data={portfolioGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `${value}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="businesses" fill="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="monthlyIncome" stroke="#3b82f6" strokeWidth={3} />
                  </RechartsBarChart>
                </ChartContainer>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-4">The Snowball Effect</h3>
                {portfolioGrowthData.map((year, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Year {year.year}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {year.businesses} business{year.businesses > 1 ? 'es' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(year.monthlyIncome)}/mo</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Portfolio: {formatCurrency(year.portfolioValue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wealth Building Chart */}
      {viewMode === 'wealth' && (
        <Card>
          <CardHeader>
            <CardTitle>Cumulative Wealth Building</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <AreaChart data={monthlyDistributions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="cumulativeIncome" stackId="1" stroke="var(--color-cumulativeIncome)" fill="var(--color-cumulativeIncome)" fillOpacity={0.6} />
                <Area type="monotone" dataKey="monthlyIncome" stackId="2" stroke="var(--color-monthlyIncome)" fill="var(--color-monthlyIncome)" fillOpacity={0.8} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Freedom Declaration */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
            <Plane className="w-6 h-6 mr-3" />
            Your Freedom Declaration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed">
              This isn't just an investment—it's your roadmap to financial independence. In {wealthBuildingMetrics.timeToFreedom} months, 
              you'll replace your W2 income. By month 24, you'll have the capital and proven playbook to acquire your second business. 
              By year 3, you'll be generating over <strong>{formatCurrency(monthlyDistributions[35]?.monthlyIncome || 65000)} per month</strong> in 
              passive income from a diversified portfolio of essential service businesses.
            </p>
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Work becomes optional. Travel becomes frequent. Security becomes permanent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialFreedomRoadmap;

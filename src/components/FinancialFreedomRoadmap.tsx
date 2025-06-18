import React, { useState, useMemo } from 'react';
import { TrendingUp, Calendar, DollarSign, Home, Plane, Trophy, Building2, MapPin, Target, Clock, Rocket, Settings, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import PersonalProfileForm, { PersonalProfile } from './PersonalProfileForm';

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
  const [showPersonalForm, setShowPersonalForm] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);

  // Default profile (your scenario)
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>({
    currentIncome: 75000,
    investmentAmount: 50000,
    targetMonthlyIncome: 6250,
    riskTolerance: 'moderate',
    timeline: 3,
    location: 'Raleigh, NC',
    situation: 'single',
    age: 32
  });

  // Dynamic scenario mapping based on profile
  const getScenarioFromProfile = (profile: PersonalProfile) => {
    if (profile.riskTolerance === 'aggressive') return 'aggressive';
    if (profile.riskTolerance === 'conservative') return 'conservative';
    return 'base';
  };

  // Base case monthly distributions adapted to personal profile
  const monthlyDistributions = useMemo(() => {
    const scenarios = {
      conservative: { y1: 15000, y2: 22000, y3: 30000 },
      base: { y1: 20000, y2: 30000, y3: 42000 },
      aggressive: { y1: 28000, y2: 40000, y3: 58000 },
    };
    
    const currentScenario = isPersonalized ? getScenarioFromProfile(personalProfile) : selectedScenario;
    const scenario = scenarios[currentScenario];
    
    // Scale based on investment amount (base is $50k)
    const investmentMultiplier = personalProfile.investmentAmount / 50000;
    const timelineMultiplier = 3 / personalProfile.timeline; // Compress/extend timeline
    
    const data = [];
    const totalMonths = personalProfile.timeline * 12;
    
    for (let month = 1; month <= Math.min(totalMonths, 36); month++) {
      let monthlyIncome;
      const adjustedMonth = month * timelineMultiplier;
      
      if (adjustedMonth <= 12) {
        monthlyIncome = scenario.y1 * (adjustedMonth / 12) * investmentMultiplier;
      } else if (adjustedMonth <= 24) {
        monthlyIncome = (scenario.y1 + (scenario.y2 - scenario.y1) * ((adjustedMonth - 12) / 12)) * investmentMultiplier;
      } else {
        monthlyIncome = (scenario.y2 + (scenario.y3 - scenario.y2) * ((adjustedMonth - 24) / 12)) * investmentMultiplier;
      }
      
      data.push({
        month,
        monthlyIncome: Math.round(monthlyIncome),
        cumulativeIncome: data.length > 0 ? data[data.length - 1].cumulativeIncome + Math.round(monthlyIncome) : Math.round(monthlyIncome),
        portfolioValue: Math.round(monthlyIncome * 12 * 5),
      });
    }
    
    return data;
  }, [selectedScenario, personalProfile, isPersonalized]);

  // Dynamic lifestyle milestones based on personal profile
  const lifestyleMilestones: LifestyleMilestone[] = useMemo(() => {
    const baseIncome = personalProfile.currentIncome / 12;
    const targetIncome = personalProfile.targetMonthlyIncome;
    const situationMultiplier = personalProfile.situation === 'family' ? 1.5 : personalProfile.situation === 'married' ? 1.2 : 1;
    
    return [
      {
        month: Math.round(3 * (3 / personalProfile.timeline)),
        title: "Side Income Security",
        description: `Monthly distributions cover ${personalProfile.situation === 'family' ? 'family expenses' : 'personal expenses'} & dining`,
        monthlyIncome: Math.round((baseIncome * 0.3) * situationMultiplier),
        icon: DollarSign,
        color: "text-blue-500",
      },
      {
        month: Math.round(8 * (3 / personalProfile.timeline)),
        title: "Housing Freedom",
        description: `Business cash flow covers ${personalProfile.location} housing costs`,
        monthlyIncome: Math.round((baseIncome * 0.6) * situationMultiplier),
        icon: Home,
        color: "text-green-500",
      },
      {
        month: Math.round(14 * (3 / personalProfile.timeline)),
        title: "Career Optionality",
        description: `Replace ${formatCurrency(personalProfile.currentIncome)} salary - work becomes a choice`,
        monthlyIncome: Math.round(baseIncome * situationMultiplier),
        icon: Trophy,
        color: "text-purple-500",
      },
      {
        month: Math.round(18 * (3 / personalProfile.timeline)),
        title: "Investment Runway",
        description: "Accumulate capital for next acquisition",
        monthlyIncome: Math.round((targetIncome * 1.2) * situationMultiplier),
        icon: Rocket,
        color: "text-orange-500",
      },
      {
        month: Math.round(24 * (3 / personalProfile.timeline)),
        title: "Portfolio Expansion",
        description: "Acquire Business #2 with proven playbook",
        monthlyIncome: Math.round((targetIncome * 1.5) * situationMultiplier),
        icon: Building2,
        color: "text-indigo-500",
      },
      {
        month: Math.round(36 * (3 / personalProfile.timeline)),
        title: "Financial Independence",
        description: `Multi-business portfolio generating ${formatCurrency(targetIncome * 2 * situationMultiplier)}/month`,
        monthlyIncome: Math.round((targetIncome * 2) * situationMultiplier),
        icon: Plane,
        color: "text-pink-500",
      },
    ];
  }, [personalProfile]);

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

  const portfolioGrowthData = useMemo(() => {
    const data = [];
    let businesses = 1;
    let totalMonthlyIncome = monthlyDistributions[11]?.monthlyIncome || personalProfile.targetMonthlyIncome;
    
    for (let year = 1; year <= 5; year++) {
      if (year > 1) {
        if (year === 2 || year === 4) {
          businesses += 1;
          totalMonthlyIncome += totalMonthlyIncome * 0.8;
        }
      }
      
      data.push({
        year,
        businesses,
        monthlyIncome: Math.round(totalMonthlyIncome),
        portfolioValue: Math.round(totalMonthlyIncome * 12 * 5),
        acquisitionCapacity: Math.round(totalMonthlyIncome * 6),
      });
      
      totalMonthlyIncome *= 1.15;
    }
    
    return data;
  }, [monthlyDistributions, personalProfile.targetMonthlyIncome]);

  const wealthBuildingMetrics = useMemo(() => {
    const currentData = monthlyDistributions[monthlyDistributions.length - 1];
    const annualIncome = currentData?.monthlyIncome * 12 || 0;
    const portfolioValue = currentData?.portfolioValue || 0;
    
    return {
      timeToFreedom: Math.round(personalProfile.targetMonthlyIncome * 12 / (currentData?.monthlyIncome || 1)),
      nextAcquisitionFunding: Math.round((currentData?.monthlyIncome || 0) * 6),
      wealthMultiplier: Math.round(portfolioValue / personalProfile.investmentAmount),
      passiveIncomeRatio: Math.round((annualIncome / personalProfile.currentIncome) * 100),
    };
  }, [monthlyDistributions, personalProfile]);

  const chartConfig = {
    monthlyIncome: { label: "Monthly Income", color: "#10b981" },
    cumulativeIncome: { label: "Cumulative", color: "#3b82f6" },
    portfolioValue: { label: "Portfolio Value", color: "#8b5cf6" },
  };

  const handleProfileChange = (newProfile: PersonalProfile) => {
    setPersonalProfile(newProfile);
    setIsPersonalized(true);
  };

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-6 h-6 mr-3 text-green-500" />
            {isPersonalized ? "Your Path to Financial Freedom" : "A Path to Financial Freedom"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Scenario Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">Growth Scenario</label>
              <div className="flex gap-2">
                {(['conservative', 'base', 'aggressive'] as const).map((scenario) => (
                  <Button
                    key={scenario}
                    variant={selectedScenario === scenario ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setIsPersonalized(false);
                    }}
                    className="capitalize"
                    disabled={isPersonalized}
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

            {/* Personalization Toggle */}
            <div>
              <label className="block text-sm font-semibold mb-2">Personalization</label>
              <div className="flex gap-2">
                <Button
                  variant={!isPersonalized ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIsPersonalized(false)}
                >
                  Default
                </Button>
                <Button
                  variant={showPersonalForm ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowPersonalForm(!showPersonalForm)}
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {isPersonalized ? 'Edit Profile' : 'Customize'}
                </Button>
              </div>
            </div>
          </div>

          {isPersonalized && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-blue-700 dark:text-blue-300">
                    Showing personalized scenario for {personalProfile.situation === 'single' ? 'individual' : personalProfile.situation} in {personalProfile.location}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {formatCurrency(personalProfile.investmentAmount)} investment • {formatCurrency(personalProfile.targetMonthlyIncome)}/month target • {personalProfile.timeline} year timeline
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPersonalForm(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Adjust
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Profile Form */}
      {showPersonalForm && (
        <PersonalProfileForm
          profile={personalProfile}
          onProfileChange={handleProfileChange}
          onClose={() => setShowPersonalForm(false)}
        />
      )}

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
                <p className="text-sm text-gray-600 dark:text-gray-400">vs Current Income</p>
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
            <CardTitle>
              {isPersonalized ? "Your Lifestyle Transformation Timeline" : "Lifestyle Transformation Timeline"}
            </CardTitle>
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
            {isPersonalized ? "Your Freedom Declaration" : "The Freedom Declaration"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed">
              This isn't just an investment—it's {isPersonalized ? "your" : "a"} roadmap to financial independence. 
              In {wealthBuildingMetrics.timeToFreedom} months, {isPersonalized ? "you'll" : "one could"} replace 
              {isPersonalized ? " your" : " a"} W2 income. By month 24, {isPersonalized ? "you'll" : "the acquirer will"} have 
              the capital and proven playbook to acquire {isPersonalized ? "your" : "a"} second business. 
              By year 3, {isPersonalized ? "you'll" : "they'll"} be generating over <strong>{formatCurrency(monthlyDistributions[35]?.monthlyIncome || personalProfile.targetMonthlyIncome * 2)} per month</strong> in 
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

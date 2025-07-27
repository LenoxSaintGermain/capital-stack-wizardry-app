import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Building, 
  MapPin, 
  Users, 
  BarChart3,
  PieChart,
  Activity,
  Star,
  ArrowUpRight,
  Download,
  Filter
} from 'lucide-react';
import { 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { ManusDataAdapter, loadManusConsolidatedData } from '@/utils/manusDataAdapter';
import { importJsonToDatabase, getPortfolioStatsFromDatabase } from '@/utils/dataImporter';
import { toast } from 'sonner';

interface PortfolioStats {
  totalOpportunities: number;
  totalValue: number;
  totalRevenue: number;
  totalCashFlow: number;
  strongBuyCount: number;
  avgROI: number;
  sectorBreakdown: Record<string, number>;
  geographicFocus: string[];
  contactsCount: number;
}

const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  muted: '#6B7280'
};

const SECTOR_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'
];

export default function PortfolioOverview() {
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      
      // First try to load from database
      let portfolioStats = await getPortfolioStatsFromDatabase();
      
      // If no data in database, fall back to JSON
      if (!portfolioStats) {
        console.log('No database data found, using JSON fallback');
        const manusData = await loadManusConsolidatedData();
        portfolioStats = ManusDataAdapter.generatePortfolioSummary(manusData);
      }
      
      setStats(portfolioStats);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async () => {
    try {
      setImporting(true);
      await importJsonToDatabase();
      toast.success('Successfully imported JSON data to database');
      await loadPortfolioData(); // Refresh with database data
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import data to database');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Failed to load portfolio data</p>
        <Button onClick={loadPortfolioData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare chart data
  const sectorChartData = Object.entries(stats.sectorBreakdown).map(([sector, count], index) => ({
    name: sector.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length]
  }));

  const valueDistributionData = Object.entries(stats.sectorBreakdown).map(([sector, count], index) => ({
    sector: sector.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    opportunities: count,
    avgValue: stats.totalValue / stats.totalOpportunities,
    color: SECTOR_COLORS[index % SECTOR_COLORS.length]
  }));

  // Progress toward $1M goal (assuming that's still the target)
  const goalProgress = Math.min((stats.totalCashFlow / 1000000) * 100, 100);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Million Portfolio
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-Powered Business Acquisition Intelligence Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleImportData}
            disabled={importing}
          >
            <Download className="h-4 w-4 mr-2" />
            {importing ? 'Importing...' : 'Import JSON Data'}
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Activity className="h-4 w-4 mr-2" />
            Live Update
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Total Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
            <p className="text-xs text-blue-100 mt-1">
              {stats.strongBuyCount} Strong Buy recommendations
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-purple-100 mt-1">
              Avg: {formatCurrency(stats.totalValue / stats.totalOpportunities)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalCashFlow)}</div>
            <p className="text-xs text-green-100 mt-1">
              {formatPercentage((stats.totalCashFlow / stats.totalRevenue) * 100)} margin
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Avg ROI Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(stats.avgROI)}</div>
            <p className="text-xs text-orange-100 mt-1">
              AI-optimized projections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Progress Toward $1M Annual Cash Flow Goal
          </CardTitle>
          <CardDescription>
            Current portfolio positioned to generate {formatCurrency(stats.totalCashFlow)} annually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current: {formatCurrency(stats.totalCashFlow)}</span>
              <span>Goal: $1,000,000</span>
            </div>
            <Progress value={goalProgress} className="h-3" />
            <div className="text-right text-sm text-muted-foreground">
              {formatPercentage(goalProgress)} complete
            </div>
          </div>
          {goalProgress < 100 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Gap Analysis:</strong> Need {formatCurrency(1000000 - stats.totalCashFlow)} more in annual cash flow.
                Consider {Math.ceil((1000000 - stats.totalCashFlow) / (stats.totalCashFlow / stats.totalOpportunities))} similar opportunities.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Opportunities by Sector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sectorChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {sectorChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Value Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sector" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [formatCurrency(value as number), name]} />
                    <Bar dataKey="avgValue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorChartData.map((sector, index) => (
              <Card key={sector.name} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{sector.name}</span>
                    <Badge variant="secondary" style={{ backgroundColor: sector.color, color: 'white' }}>
                      {sector.value}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Share</span>
                      <span>{formatPercentage((sector.value / stats.totalOpportunities) * 100)}</span>
                    </div>
                    <Progress 
                      value={(sector.value / stats.totalOpportunities) * 100} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Geographic Focus Areas
              </CardTitle>
              <CardDescription>
                Market presence across {stats.geographicFocus.length} key regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.geographicFocus.map((region, index) => (
                  <div key={region} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{region}</span>
                      <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium">Strong Buy Opportunities</p>
                      <p className="text-sm text-muted-foreground">High-priority deals</p>
                    </div>
                    <Badge className="bg-green-600">{stats.strongBuyCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium">Total Active Contacts</p>
                      <p className="text-sm text-muted-foreground">CRM pipeline</p>
                    </div>
                    <Badge className="bg-blue-600">{stats.contactsCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div>
                      <p className="font-medium">Avg ROI Potential</p>
                      <p className="text-sm text-muted-foreground">AI-optimized</p>
                    </div>
                    <Badge className="bg-purple-600">{formatPercentage(stats.avgROI)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Pipeline Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Deal Conversion Rate</span>
                      <span>{formatPercentage((stats.strongBuyCount / stats.totalOpportunities) * 100)}</span>
                    </div>
                    <Progress value={(stats.strongBuyCount / stats.totalOpportunities) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Deal Size</span>
                      <span>{formatCurrency(stats.totalValue / stats.totalOpportunities)}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cash Flow Efficiency</span>
                      <span>{formatPercentage((stats.totalCashFlow / stats.totalRevenue) * 100)}</span>
                    </div>
                    <Progress value={(stats.totalCashFlow / stats.totalRevenue) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


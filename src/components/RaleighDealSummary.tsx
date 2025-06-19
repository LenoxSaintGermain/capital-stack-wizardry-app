
import React from 'react';
import { MapPin, Building, Target, Zap, CheckCircle, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const RaleighDealSummary: React.FC = () => {
  const keyMetrics = [
    { label: 'Purchase Price', value: '$2.8M', icon: DollarSign, color: 'text-green-600' },
    { label: 'Annual Revenue', value: '$3.6M', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Year 2 EBITDA', value: '$1.04M', icon: Target, color: 'text-purple-600' },
    { label: 'Deal Score', value: '92%', icon: Shield, color: 'text-orange-600' },
  ];

  const growthPillars = [
    {
      title: 'AI/FSM Optimization',
      impact: '+21% Revenue',
      timeline: '12-18 months',
      investment: '$20K',
      description: 'ServiceTitan/Jobber implementation for 47% productivity boost'
    },
    {
      title: 'Cross-Selling Program',
      impact: '+$350K Revenue',
      timeline: '24 months',
      investment: 'Minimal',
      description: 'Bundle HVAC, electrical, plumbing services'
    },
    {
      title: 'Government Contracts',
      impact: '+$100K Margin',
      timeline: '12-18 months',
      investment: 'Certification',
      description: 'SDVOSB, MBE, HUBZone certifications for $31.9B market'
    }
  ];

  const executionChecklist = [
    { task: 'Grant Calendar Setup', deadline: 'Jun 26, 2025', status: 'pending' },
    { task: 'Term Sheet Sprint', deadline: 'Jun 24, 2025', status: 'pending' },
    { task: 'Seller Note Re-trade', deadline: 'TBD', status: 'pending' },
    { task: 'PACE/504 Feasibility', deadline: 'Jul 1, 2025', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <Building className="w-8 h-8 mr-3" />
                Premier Multi-Trade Services
              </CardTitle>
              <div className="flex items-center mt-2 text-blue-100">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Raleigh, NC - Strategic Priority Deal</span>
              </div>
            </div>
            <Badge className="bg-white text-blue-600 font-bold text-lg px-4 py-2">
              Featured Deal
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-blue-100 leading-relaxed">
            Well-established multi-trade services company with 15+ years of operation. 
            Strong automation opportunities and government contract potential in the thriving Raleigh market.
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Growth Strategy Pillars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-6 h-6 mr-3 text-yellow-500" />
            Three-Pillar Growth Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {growthPillars.map((pillar, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                <h4 className="font-semibold text-lg mb-2">{pillar.title}</h4>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 mr-2">
                    {pillar.impact}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    <p><strong>Timeline:</strong> {pillar.timeline}</p>
                    <p><strong>Investment:</strong> {pillar.investment}</p>
                    <p className="mt-2">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Projections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Year 1 Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Revenue Growth:</span>
                <span className="font-semibold text-blue-600">$3.8M (+5.6%)</span>
              </div>
              <div className="flex justify-between">
                <span>Base EBITDA:</span>
                <span className="font-semibold">$520K</span>
              </div>
              <div className="flex justify-between">
                <span>FSM Efficiency Gains:</span>
                <span className="font-semibold text-green-600">+$75K</span>
              </div>
              <div className="flex justify-between">
                <span>Cross-Selling Impact:</span>
                <span className="font-semibold text-green-600">+$80K</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Adjusted EBITDA:</span>
                <span className="font-bold text-green-600">$675K (17.8%)</span>
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
                <span>Revenue Growth:</span>
                <span className="font-semibold text-blue-600">$4.25M (+18.1%)</span>
              </div>
              <div className="flex justify-between">
                <span>Base EBITDA:</span>
                <span className="font-semibold">$767.5K</span>
              </div>
              <div className="flex justify-between">
                <span>Cross-Selling Maturity:</span>
                <span className="font-semibold text-green-600">+$150K</span>
              </div>
              <div className="flex justify-between">
                <span>GovCon Arbitrage:</span>
                <span className="font-semibold text-green-600">+$100K</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Adjusted EBITDA:</span>
                <span className="font-bold text-green-600">$1.04M (24.5%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Execution Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
            Immediate Action Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {executionChecklist.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded mr-3"></div>
                  <span className="font-medium">{item.task}</span>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {item.deadline}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Next Steps Priority</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Submit Raleigh Up-fit LOI before June 26, 2025</li>
              <li>Draft royalty-note and pref-equity term sheets</li>
              <li>Present earn-out restructure to seller (20% note vs 10%)</li>
              <li>Engage NC GreenBank for PACE preliminary underwriting</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaleighDealSummary;

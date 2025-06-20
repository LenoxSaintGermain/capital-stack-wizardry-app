
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, TrendingUp, Shield, Award, FileText } from 'lucide-react';

interface Business {
  id: string;
  business_name: string;
  sector: string;
  location: string;
  asking_price: number;
  composite_score: number;
  automation_opportunity_score: number;
  annual_revenue: number;
  annual_net_profit: number;
  last_analyzed_at: string;
  description?: string;
  strategic_flags?: any;
  resilience_factors?: any;
}

interface InvestorPartnershipProps {
  selectedBusiness: Business | null;
}

const InvestorPartnership: React.FC<InvestorPartnershipProps> = ({ selectedBusiness }) => {
  if (!selectedBusiness) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Business</h3>
          <p className="text-gray-500">Choose a business to view investor partnership opportunities</p>
        </CardContent>
      </Card>
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

  const investmentStructure = {
    totalRequired: selectedBusiness.asking_price,
    equityStake: 0.75, // 75% equity
    debtFinancing: selectedBusiness.asking_price * 0.6, // 60% debt
    equityInvestment: selectedBusiness.asking_price * 0.4, // 40% equity
    projectedROI: 0.25, // 25% annual ROI
    exitMultiple: 3.5 // 3.5x exit multiple
  };

  const partnershipTiers = [
    {
      name: "Strategic Partner",
      minInvestment: 250000,
      equityRange: "15-25%",
      benefits: [
        "Board seat and voting rights",
        "Monthly financial reports",
        "Quarterly strategy meetings",
        "Priority on future deals",
        "Direct involvement in key decisions"
      ],
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      name: "Growth Partner",
      minInvestment: 100000,
      equityRange: "5-15%",
      benefits: [
        "Quarterly financial reports",
        "Annual strategy sessions",
        "Access to deal pipeline",
        "Networking opportunities",
        "Performance dashboard access"
      ],
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      name: "Investment Partner",
      minInvestment: 50000,
      equityRange: "2-8%",
      benefits: [
        "Quarterly updates",
        "Annual investor meetings",
        "Deal flow notifications",
        "Educational resources",
        "Community access"
      ],
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  const riskFactors = [
    {
      category: "Market Risk",
      level: "Medium",
      description: "Sector-specific market conditions and competition",
      mitigation: "Diversified revenue streams and strong market position"
    },
    {
      category: "Operational Risk",
      level: "Low",
      description: "Key person dependency and operational scalability",
      mitigation: "Proven management team and automation initiatives"
    },
    {
      category: "Financial Risk",
      level: "Low",
      description: "Cash flow volatility and debt service requirements",
      mitigation: "Strong financial history and conservative leverage"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Investor Partnership Opportunity
          </CardTitle>
          <p className="text-gray-600">
            Strategic investment in {selectedBusiness.business_name}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(investmentStructure.totalRequired)}
              </div>
              <p className="text-sm text-gray-600">Total Investment</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {(investmentStructure.projectedROI * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Projected Annual ROI</p>
            </div>
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">
                {investmentStructure.exitMultiple}x
              </div>
              <p className="text-sm text-gray-600">Target Exit Multiple</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">
                {(investmentStructure.equityStake * 100).toFixed(0)}%
              </div>
              <p className="text-sm text-gray-600">Majority Control</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {partnershipTiers.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <Card key={index} className={`${tier.borderColor} border-2`}>
              <CardHeader className={`${tier.bgColor} rounded-t-lg`}>
                <CardTitle className={`flex items-center ${tier.color}`}>
                  <Icon className="w-6 h-6 mr-2" />
                  <div>
                    <div className="font-bold">{tier.name}</div>
                    <div className="text-sm font-normal">
                      Min: {formatCurrency(tier.minInvestment)}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="mb-4">
                  <Badge className={`${tier.bgColor} ${tier.color} border-0`}>
                    {tier.equityRange} Equity
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Investment Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Total Capital Required</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(investmentStructure.totalRequired)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Debt Financing (60%)</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(investmentStructure.debtFinancing)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Equity Investment (40%)</span>
                <span className="font-bold text-purple-600">
                  {formatCurrency(investmentStructure.equityInvestment)}
                </span>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">Capital Allocation:</div>
                <ul className="text-sm space-y-1">
                  <li>• Acquisition: 85%</li>
                  <li>• Working Capital: 10%</li>
                  <li>• Transaction Costs: 5%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-6 h-6 mr-2 text-orange-600" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{risk.category}</span>
                    <Badge 
                      className={
                        risk.level === 'Low' ? 'bg-green-100 text-green-800' :
                        risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {risk.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                  <p className="text-sm text-blue-600">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorPartnership;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clipboard, Calendar, Target, Users, TrendingUp, CheckCircle } from 'lucide-react';

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

interface HundredDayPlanProps {
  selectedBusiness: Business | null;
}

const HundredDayPlan: React.FC<HundredDayPlanProps> = ({ selectedBusiness }) => {
  const phases = [
    {
      name: "Days 1-30: Foundation & Assessment",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      items: [
        "Complete comprehensive business audit",
        "Meet with all key personnel and stakeholders",
        "Review all financial records and contracts",
        "Assess current systems and processes",
        "Identify immediate operational improvements",
        "Establish communication channels and reporting"
      ]
    },
    {
      name: "Days 31-60: Strategic Implementation",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      items: [
        "Implement quick-win operational improvements",
        "Begin automation pilot programs",
        "Optimize financial management and reporting",
        "Strengthen customer relationships and retention",
        "Develop marketing and growth strategies",
        "Address any critical operational issues"
      ]
    },
    {
      name: "Days 61-100: Growth & Optimization",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      items: [
        "Scale successful automation initiatives",
        "Launch growth and expansion programs",
        "Optimize team structure and performance",
        "Implement advanced analytics and KPIs",
        "Develop long-term strategic partnerships",
        "Prepare for next phase of business development"
      ]
    }
  ];

  const keyMetrics = [
    { label: "Revenue Growth Target", value: "15-25%", icon: TrendingUp },
    { label: "Cost Reduction Target", value: "10-15%", icon: Target },
    { label: "Automation Implementation", value: "3-5 Processes", icon: Users },
    { label: "ROI Timeline", value: "6-12 Months", icon: Calendar }
  ];

  if (!selectedBusiness) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clipboard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Business</h3>
          <p className="text-gray-500">Choose a business to view the detailed 100-day implementation plan</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Clipboard className="w-8 h-8 mr-3 text-blue-600" />
            100-Day Implementation Plan
          </CardTitle>
          <p className="text-gray-600">
            Strategic roadmap for {selectedBusiness.business_name} transformation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold text-blue-600">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {phases.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <Card key={index} className={`${phase.borderColor} border-2`}>
              <CardHeader className={`${phase.bgColor} rounded-t-lg`}>
                <CardTitle className={`flex items-center ${phase.color}`}>
                  <Icon className="w-6 h-6 mr-2" />
                  <div>
                    <div className="font-bold">Phase {index + 1}</div>
                    <div className="text-sm font-normal">{phase.name}</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-3">
                  {phase.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Implementation Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-600">
                  Days {index === 0 ? '1-30' : index === 1 ? '31-60' : '61-100'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{phase.name.split(': ')[1]}</span>
                    <span className="text-sm text-gray-500">
                      {index === 0 ? '33%' : index === 1 ? '67%' : '100%'} Complete
                    </span>
                  </div>
                  <Progress 
                    value={index === 0 ? 33 : index === 1 ? 67 : 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HundredDayPlan;

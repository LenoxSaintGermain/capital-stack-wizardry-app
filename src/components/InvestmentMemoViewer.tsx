import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Download, 
  Share2, 
  Eye, 
  DollarSign,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Calendar
} from 'lucide-react';

interface InvestmentMemo {
  id: string;
  title: string;
  business_name: string;
  asking_price: number;
  cash_flow?: number;
  score?: number;
  recommendation?: string;
  date_generated: string;
  content: {
    executive_summary: string;
    investment_thesis: string;
    financial_analysis: {
      asking_price: number;
      revenue?: number;
      ebitda?: number;
      cash_flow?: number;
      roi_potential?: number;
      payback_period?: number;
    };
    key_highlights: string[];
    risks: string[];
    ai_optimization: {
      efficiency_gains?: string;
      revenue_improvement?: number;
      cost_reduction?: number;
      total_value_creation?: number;
    };
    market_analysis: {
      sector: string;
      geographic_focus: string;
      market_position: string;
      competitive_advantages: string[];
    };
    recommendation_details: {
      rating: string;
      reasoning: string;
      next_steps: string[];
    };
  };
}

const SAMPLE_MEMOS: InvestmentMemo[] = [
  {
    id: "zwh5sy",
    title: "Mid-Atlantic Electrical Contractor",
    business_name: "Commercial & Residential Electrical Contractor",
    asking_price: 10357476,
    cash_flow: 1048300,
    score: 87,
    recommendation: "STRONG BUY - High Priority",
    date_generated: "2025-06-29",
    content: {
      executive_summary: "This comprehensive investment analysis examines a high-growth electrical contracting business. The target company represents a compelling acquisition opportunity in the rapidly expanding electrical services sector, demonstrating exceptional growth metrics and strong market positioning across the Mid-Atlantic and Southeast United States regions.",
      investment_thesis: "The business has achieved remarkable financial performance with revenue of $8,631,230 and EBITDA of $1,048,300, representing a healthy 12.1% margin. Most notably, the company has sustained an extraordinary compound annual growth rate of 35.7% from 2021 through 2024.",
      financial_analysis: {
        asking_price: 10357476,
        revenue: 8631230,
        ebitda: 1048300,
        cash_flow: 1048300,
        roi_potential: 26.0,
        payback_period: 3.9
      },
      key_highlights: [
        "Exceptional 35.7% revenue CAGR (2021-2024)",
        "Diversified services: New construction, fire alarm, EV stations",
        "Cross-trained workforce, minimal client concentration (max 4.8%)",
        "Recent acquisition of 14,000 customers (2023)",
        "Professional broker representation through Benchmark International"
      ],
      risks: [
        "High asking price requires significant capital investment",
        "Dependence on construction market cycles",
        "Need for continued investment in EV infrastructure capabilities",
        "Integration complexity with existing operations"
      ],
      ai_optimization: {
        efficiency_gains: "256% EBITDA improvement potential",
        revenue_improvement: 1299000,
        cost_reduction: 954614,
        total_value_creation: 2688628
      },
      market_analysis: {
        sector: "Electrical Contracting",
        geographic_focus: "Mid-Atlantic & Southeast U.S.",
        market_position: "Strong regional presence with growth potential",
        competitive_advantages: [
          "Cross-trained workforce providing operational flexibility",
          "Diversified service portfolio including emerging EV infrastructure",
          "Strong client relationships with minimal concentration risk",
          "Established facilities with expansion capacity"
        ]
      },
      recommendation_details: {
        rating: "STRONG BUY - High Priority",
        reasoning: "Exceptional growth trajectory, strong market position, and significant AI optimization potential make this a compelling acquisition target.",
        next_steps: [
          "Initiate detailed due diligence process",
          "Contact broker William Sullivan at Benchmark International",
          "Schedule management presentations",
          "Conduct site visits and operational assessment",
          "Develop detailed integration plan"
        ]
      }
    }
  },
  {
    id: "2340475",
    title: "Behavioral Health Company",
    business_name: "Virginia Behavioral Health Provider",
    asking_price: 7400000,
    cash_flow: 1640000,
    score: 75,
    recommendation: "CONSIDER - Conditional",
    date_generated: "2025-07-14",
    content: {
      executive_summary: "Fast-growing Virginia-based behavioral health company providing premier outpatient substance abuse treatment. Strong cash flow generation with recurring revenue characteristics, though requires careful evaluation of regulatory environment.",
      investment_thesis: "This acquisition represents an opportunity to acquire a cash-flowing business with significant potential for AI-driven operational optimization in the growing behavioral health sector.",
      financial_analysis: {
        asking_price: 7400000,
        revenue: 11100000,
        cash_flow: 1640000,
        roi_potential: 24.8,
        payback_period: 4.5
      },
      key_highlights: [
        "Fast-growing behavioral health market",
        "Recurring revenue model with stable patient base",
        "High barriers to entry (licensing, certifications)",
        "Strong cash flow generation",
        "AI optimization potential with 15-30% efficiency gains"
      ],
      risks: [
        "Heavy regulatory oversight and compliance requirements",
        "Dependence on insurance reimbursements",
        "Staff retention challenges in healthcare sector",
        "Potential changes in healthcare policy"
      ],
      ai_optimization: {
        efficiency_gains: "15-30% potential efficiency improvements",
        revenue_improvement: 0,
        cost_reduction: 0,
        total_value_creation: 0
      },
      market_analysis: {
        sector: "Healthcare/Behavioral Health",
        geographic_focus: "Virginia",
        market_position: "Premier outpatient treatment provider",
        competitive_advantages: [
          "Established patient base and referral networks",
          "Licensed facilities and certified staff",
          "Proven treatment protocols and outcomes",
          "Insurance network participation"
        ]
      },
      recommendation_details: {
        rating: "CONSIDER - Conditional",
        reasoning: "Strong fundamentals but requires deeper due diligence on regulatory compliance and operational scalability.",
        next_steps: [
          "Conduct regulatory compliance audit",
          "Evaluate licensing and certification requirements",
          "Assess staff retention and recruitment challenges",
          "Review insurance reimbursement stability",
          "Analyze patient acquisition and retention metrics"
        ]
      }
    }
  }
];

export default function InvestmentMemoViewer() {
  const [selectedMemo, setSelectedMemo] = useState<InvestmentMemo | null>(null);
  const [memos] = useState<InvestmentMemo[]>(SAMPLE_MEMOS);

  useEffect(() => {
    if (memos.length > 0 && !selectedMemo) {
      setSelectedMemo(memos[0]);
    }
  }, [memos, selectedMemo]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRecommendationColor = (recommendation?: string) => {
    if (!recommendation) return 'bg-gray-100 text-gray-800';
    if (recommendation.includes('STRONG BUY')) return 'bg-green-100 text-green-800 border-green-200';
    if (recommendation.includes('BUY')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (recommendation.includes('CONSIDER')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (recommendation.includes('PASS')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800';
  };

  if (!selectedMemo) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No investment memos available</h3>
        <p className="text-muted-foreground">Investment memos will appear here as they're generated.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Investment Memos
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-generated investment analysis and recommendations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Memo List Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Available Memos</CardTitle>
              <CardDescription>{memos.length} investment analyses</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2 p-4">
                  {memos.map((memo) => (
                    <div
                      key={memo.id}
                      onClick={() => setSelectedMemo(memo)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMemo?.id === memo.id
                          ? 'bg-blue-50 border-blue-200 border'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="font-medium text-sm">{memo.title}</div>
                        <div className="text-xs text-muted-foreground">{memo.business_name}</div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getRecommendationColor(memo.recommendation)}>
                            Score: {memo.score}/100
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(memo.date_generated).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Memo Content */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedMemo.title}</CardTitle>
                  <CardDescription className="text-lg mt-1">{selectedMemo.business_name}</CardDescription>
                </div>
                <Badge className={getRecommendationColor(selectedMemo.recommendation)} variant="outline">
                  {selectedMemo.recommendation}
                </Badge>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Asking Price</div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedMemo.asking_price)}
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Cash Flow</div>
                  <div className="text-lg font-bold text-green-600">
                    {selectedMemo.cash_flow ? formatCurrency(selectedMemo.cash_flow) : 'N/A'}
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="text-lg font-bold text-purple-600">
                    {selectedMemo.score}/100
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">ROI Potential</div>
                  <div className="text-lg font-bold text-orange-600">
                    {selectedMemo.content.financial_analysis.roi_potential}%
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="summary" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="risks">Risks</TabsTrigger>
                  <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      Executive Summary
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMemo.content.executive_summary}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Investment Thesis
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedMemo.content.investment_thesis}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Key Highlights
                    </h3>
                    <ul className="space-y-2">
                      {selectedMemo.content.key_highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Financial Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800 font-medium">Revenue</div>
                        <div className="text-xl font-bold text-blue-900">
                          {selectedMemo.content.financial_analysis.revenue 
                            ? formatCurrency(selectedMemo.content.financial_analysis.revenue)
                            : 'Not disclosed'
                          }
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-sm text-green-800 font-medium">EBITDA</div>
                        <div className="text-xl font-bold text-green-900">
                          {selectedMemo.content.financial_analysis.ebitda 
                            ? formatCurrency(selectedMemo.content.financial_analysis.ebitda)
                            : 'Not disclosed'
                          }
                        </div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-sm text-purple-800 font-medium">Payback Period</div>
                        <div className="text-xl font-bold text-purple-900">
                          {selectedMemo.content.financial_analysis.payback_period} years
                        </div>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-sm text-orange-800 font-medium">ROI Potential</div>
                        <div className="text-xl font-bold text-orange-900">
                          {selectedMemo.content.financial_analysis.roi_potential}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedMemo.content.ai_optimization.total_value_creation && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        AI Optimization Potential
                      </h3>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Revenue Improvement</div>
                            <div className="text-lg font-bold">
                              {selectedMemo.content.ai_optimization.revenue_improvement 
                                ? formatCurrency(selectedMemo.content.ai_optimization.revenue_improvement)
                                : 'TBD'
                              }
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Cost Reduction</div>
                            <div className="text-lg font-bold">
                              {selectedMemo.content.ai_optimization.cost_reduction 
                                ? formatCurrency(selectedMemo.content.ai_optimization.cost_reduction)
                                : 'TBD'
                              }
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Total Value Creation</div>
                            <div className="text-lg font-bold">
                              {selectedMemo.content.ai_optimization.total_value_creation 
                                ? formatCurrency(selectedMemo.content.ai_optimization.total_value_creation)
                                : 'TBD'
                              }
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                          {selectedMemo.content.ai_optimization.efficiency_gains}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Market Analysis
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Market Position</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          {selectedMemo.content.market_analysis.market_position}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Sector:</span>
                            <Badge variant="secondary">{selectedMemo.content.market_analysis.sector}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Geography:</span>
                            <span className="text-sm text-muted-foreground">
                              {selectedMemo.content.market_analysis.geographic_focus}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Competitive Advantages</h4>
                        <ul className="space-y-1">
                          {selectedMemo.content.market_analysis.competitive_advantages.map((advantage, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-muted-foreground">{advantage}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="risks" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Risk Assessment
                    </h3>
                    <div className="space-y-3">
                      {selectedMemo.content.risks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-orange-800">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="next-steps" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      Recommended Next Steps
                    </h3>
                    <div className="space-y-3">
                      {selectedMemo.content.recommendation_details.next_steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm text-blue-800">{step}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Investment Recommendation</h4>
                      <p className="text-sm text-green-700">
                        {selectedMemo.content.recommendation_details.reasoning}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
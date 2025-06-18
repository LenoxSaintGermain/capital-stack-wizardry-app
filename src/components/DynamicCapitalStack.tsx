
import React, { useState, useMemo } from 'react';
import { CheckSquare, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface Levers {
  revenueNote: boolean;
  greenStack: boolean;
  grantLayer: boolean;
  sellerEarnOut: boolean;
  employeePool: boolean;
  impactFund: boolean;
  sba504: boolean;
}

interface LeverData {
  id: keyof Levers;
  title: string;
  color: string;
  impact: string;
}

const DynamicCapitalStack: React.FC = () => {
  const initialLevers: Levers = {
    revenueNote: true,
    greenStack: true,
    grantLayer: true,
    sellerEarnOut: true,
    employeePool: true,
    impactFund: true,
    sba504: true,
  };

  const [activeLevers, setActiveLevers] = useState<Levers>(initialLevers);

  const toggleLever = (lever: keyof Levers) => {
    setActiveLevers(prev => ({ ...prev, [lever]: !prev[lever] }));
  };

  const capitalStack = useMemo(() => {
    let sources: Record<string, number> = {
      sba7a: 2800000 + 135000 + 20000 + 15000, // Base loan covers all uses
    };
    
    let uses = {
      purchasePrice: 2800000,
      dueDiligenceClosing: 135000,
      fsmImplementation: 20000,
      workingCapital: 15000,
    };

    let sbaLoan = uses.purchasePrice + uses.dueDiligenceClosing + uses.fsmImplementation + uses.workingCapital;
    let sellerNote = 0;
    let buyerEquity = 0;

    // Apply levers
    if (activeLevers.sellerEarnOut) {
      sellerNote = 2800000 * 0.20; // 20% seller note
      sbaLoan -= sellerNote;
      sources.sellerNote = sellerNote;
    } else {
      sellerNote = 2800000 * 0.10; // Original 10%
      sbaLoan -= sellerNote;
      sources.sellerNote = sellerNote;
    }

    if (activeLevers.revenueNote) {
      const revenueNoteAmount = 500000;
      sbaLoan -= revenueNoteAmount;
      sources.revenueNote = revenueNoteAmount;
    }

    if (activeLevers.greenStack) {
      const greenCapEx = 250000;
      sbaLoan -= greenCapEx; 
      sources.greenFinancing = greenCapEx;
    }
    
    if (activeLevers.grantLayer) {
      const grantAmount = 25000;
      sbaLoan -= grantAmount;
      sources.grant = grantAmount;
    }
    
    if (activeLevers.impactFund) {
      const impactEquity = 250000;
      sbaLoan -= impactEquity;
      sources.impactEquity = impactEquity;
    }
    
    if (activeLevers.employeePool) {
      const payrollDeferral = 100000;
      sbaLoan -= payrollDeferral;
      sources.employeeCoInvest = payrollDeferral;
    }
    
    // Final SBA loan calculation
    sources.sba7a = sbaLoan > 0 ? sbaLoan : 0;
    
    // Calculate Buyer Equity as the plug
    const totalSources = Object.values(sources).reduce((acc, val) => acc + val, 0);
    const totalUses = Object.values(uses).reduce((acc, val) => acc + val, 0);
    if (totalSources < totalUses) {
      buyerEquity = totalUses - totalSources;
      sources.buyerEquity = buyerEquity;
    }

    // Recalculate totals
    const finalSourcesTotal = Object.values(sources).reduce((acc, val) => acc + (val || 0), 0);
    const finalUsesTotal = Object.values(uses).reduce((acc, val) => acc + (val || 0), 0);
    
    // DSCR Calculation
    const annualDebtService = (sources.sba7a || 0) * 0.163; // Simplified rate from memo
    const adjustedEBITDA_Y1 = 675000;
    const dscr = annualDebtService > 0 ? adjustedEBITDA_Y1 / annualDebtService : Infinity;

    return { sources, uses, finalSourcesTotal, finalUsesTotal, dscr };
  }, [activeLevers]);
  
  const leversData: LeverData[] = [
    { id: 'sellerEarnOut', title: '1. Seller "Performance-Earn-Out"', color: 'blue', impact: 'Reduces day-one cash by $280k; aligns seller.' },
    { id: 'revenueNote', title: '2. Certification-Backed Revenue Note', color: 'indigo', impact: 'Substitutes $500k of debt with non-dilutive capital.' },
    { id: 'impactFund', title: '3. Veteran/Minority Impact Fund Slice', color: 'purple', impact: 'Replaces home-equity with strategic pref equity.' },
    { id: 'greenStack', title: '4. Energy-Efficiency "Green Stack"', color: 'green', impact: 'Removes ≈$250k of cap-ex from uses table.' },
    { id: 'employeePool', title: '5. Employee Co-Invest Pool', color: 'yellow', impact: 'Converts $100k wage cash into equity-like capital.' },
    { id: 'grantLayer', title: '6. Local Grant Layer', color: 'red', impact: 'Adds $25k grant as "equity-like" capital.' },
  ];

  const getDSCRStatus = (dscr: number) => {
    if (dscr >= 1.5) return { color: 'text-green-600', bg: 'bg-green-50', status: 'Excellent' };
    if (dscr >= 1.25) return { color: 'text-yellow-600', bg: 'bg-yellow-50', status: 'Good' };
    return { color: 'text-red-600', bg: 'bg-red-50', status: 'Risk' };
  };

  const dscrStatus = getDSCRStatus(capitalStack.dscr);

  return (
    <div className="space-y-8">
      {/* Levers Section */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-purple-500" />
          Capital Structure Levers
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leversData.map(lever => (
            <Card 
              key={lever.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-l-4 ${
                activeLevers[lever.id] 
                  ? `border-l-${lever.color}-500 bg-${lever.color}-50/50 dark:bg-${lever.color}-900/20` 
                  : 'border-l-gray-300 hover:border-l-gray-400'
              }`}
              onClick={() => toggleLever(lever.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-gray-800 dark:text-gray-100">
                    {lever.title}
                  </CardTitle>
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    activeLevers[lever.id] 
                      ? `bg-${lever.color}-500 border-${lever.color}-500` 
                      : 'border-gray-400 hover:border-gray-500'
                  }`}>
                    {activeLevers[lever.id] && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 dark:text-gray-400">{lever.impact}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Capital Stack Display */}
      <div>
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Dynamic Sources & Uses Waterfall
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sources of Capital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {capitalStack.sources.sba7a > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>SBA 7(a) Loan</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.sba7a)}</span>
                  </div>
                )}
                {activeLevers.sellerEarnOut && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Seller Note (Earn-Out)</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.sellerNote)}</span>
                  </div>
                )}
                {activeLevers.revenueNote && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Revenue Note</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.revenueNote)}</span>
                  </div>
                )}
                {activeLevers.impactFund && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-purple-600 dark:text-purple-400">
                    <span className="font-semibold">Impact Fund Pref Equity</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.impactEquity)}</span>
                  </div>
                )}
                {activeLevers.greenStack && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Green Financing (REAP/PACE)</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.greenFinancing)}</span>
                  </div>
                )}
                {activeLevers.employeePool && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Employee Co-Invest</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.employeeCoInvest)}</span>
                  </div>
                )}
                {activeLevers.grantLayer && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span>Raleigh Up-fit Grant</span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.grant)}</span>
                  </div>
                )}
                {(capitalStack.sources.buyerEquity || 0) > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-red-600 dark:text-red-400">
                    <span className="font-semibold flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Buyer Equity (Gap)
                    </span>
                    <span className="font-mono font-semibold">{formatCurrency(capitalStack.sources.buyerEquity)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                  <span>Total Sources</span>
                  <span className="font-mono">{formatCurrency(capitalStack.finalSourcesTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uses & Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Uses & Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Purchase Price</span>
                  <span className="font-mono font-semibold">{formatCurrency(capitalStack.uses.purchasePrice)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Due Diligence & Closing</span>
                  <span className="font-mono font-semibold">{formatCurrency(capitalStack.uses.dueDiligenceClosing)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>FSM Implementation</span>
                  <span className="font-mono font-semibold">{formatCurrency(capitalStack.uses.fsmImplementation)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Working Capital</span>
                  <span className="font-mono font-semibold">{formatCurrency(capitalStack.uses.workingCapital)}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg">
                  <span>Total Uses</span>
                  <span className="font-mono">{formatCurrency(capitalStack.finalUsesTotal)}</span>
                </div>
                
                {/* DSCR Metric */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className={`flex justify-between py-3 px-4 rounded-lg ${dscrStatus.bg} border-l-4 border-l-current`}>
                    <div>
                      <span className={`font-bold ${dscrStatus.color}`}>Year 1 DSCR</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {dscrStatus.status}
                      </Badge>
                    </div>
                    <span className={`font-mono font-bold text-lg ${dscrStatus.color}`}>
                      {isFinite(capitalStack.dscr) ? `${capitalStack.dscr.toFixed(2)}x` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Next Steps */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">
            Next Steps: Executable Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckSquare className="w-5 h-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
              <div>
                <span className="font-bold">Grant Calendar:</span> Submit Raleigh Up-fit LOI before 26 Jun 2025; prep REAP pre-application by 1 Jul 2025.
              </div>
            </li>
            <li className="flex items-start">
              <CheckSquare className="w-5 h-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
              <div>
                <span className="font-bold">Term-Sheet Sprint:</span> Draft two-page royalty-note and pref-equity term sheets; circulate to veteran-focused angel syndicates week of 24 Jun.
              </div>
            </li>
            <li className="flex items-start">
              <CheckSquare className="w-5 h-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
              <div>
                <span className="font-bold">Seller-Note Re-trade:</span> Present earn-out math (20% note, 6% interest, 30% premium if EBITDA {'>'}= $750k in Y2).
              </div>
            </li>
            <li className="flex items-start">
              <CheckSquare className="w-5 h-5 mr-3 mt-1 text-green-500 flex-shrink-0" />
              <div>
                <span className="font-bold">PACE/504 Feasibility:</span> Engage NC GreenBank or local PACE administrator for preliminary underwriting.
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p>
          The structure above demonstrates a "Zero-ish" buyer equity scenario. Toggle the levers to see how each component impacts the capital stack and the Debt Service Coverage Ratio (DSCR). A DSCR above 1.5x is considered healthy by most lenders.
        </p>
      </div>
    </div>
  );
};

export default DynamicCapitalStack;

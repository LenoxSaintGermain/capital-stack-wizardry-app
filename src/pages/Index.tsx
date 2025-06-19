
import React, { useState, useEffect } from 'react';
import { DollarSign, BarChart, HardHat, Target, Building, Clipboard, ScrollText, GitBranch, Home, Users, Layers, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import PerformanceSimulator from '@/components/PerformanceSimulator';
import FinancialFreedomRoadmap from '@/components/FinancialFreedomRoadmap';
import DynamicCapitalStack from '@/components/DynamicCapitalStack';
import DealSelector from '@/components/DealSelector';
import BusinessAnalysisPanel from '@/components/BusinessAnalysisPanel';
import AppSidebar from "@/components/AppSidebar";

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

const Index = () => {
  const [selectedDeal, setSelectedDeal] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleDealSelect = (deal: Business) => {
    setSelectedDeal(deal);
    console.log('Selected deal:', deal);
  };

  const tabItems = [
    { id: 'analysis', label: 'Deal Analysis', icon: BarChart },
    { id: 'capital', label: 'Capital Stack', icon: DollarSign },
    { id: 'simulator', label: 'Performance', icon: Target },
    { id: 'roadmap', label: 'Freedom Roadmap', icon: Plane },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <header className="border-b bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex h-16 items-center px-6">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Project Million Dashboard
                </h1>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Deal Selector */}
            <DealSelector selectedDeal={selectedDeal} onDealSelect={handleDealSelect} />

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === item.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'analysis' && (
                <BusinessAnalysisPanel selectedBusiness={selectedDeal} />
              )}

              {activeTab === 'capital' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center">
                        <DollarSign className="w-8 h-8 mr-3 text-green-600" />
                        Dynamic Capital Structure
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DynamicCapitalStack />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center">
                        <Target className="w-8 h-8 mr-3 text-blue-600" />
                        Performance Simulator
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PerformanceSimulator />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center">
                        <Plane className="w-8 h-8 mr-3 text-purple-600" />
                        Financial Freedom Roadmap
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FinancialFreedomRoadmap />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* Quick Stats Footer */}
            {selectedDeal && (
              <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        ${(selectedDeal.asking_price / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-600">Purchase Price</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {(selectedDeal.composite_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Deal Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        {(selectedDeal.automation_opportunity_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">AI Opportunity</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {((selectedDeal.annual_net_profit / selectedDeal.asking_price) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Cap Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;

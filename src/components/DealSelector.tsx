
import React, { useState, useEffect } from 'react';
import { Building, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Business {
  id: string;
  business_name: string;
  sector: string;
  location: string;
  asking_price: number;
  composite_score: number;
  automation_opportunity_score: number;
  last_analyzed_at: string;
}

interface DealSelectorProps {
  selectedDeal: Business | null;
  onDealSelect: (deal: Business) => void;
}

const DealSelector: React.FC<DealSelectorProps> = ({ selectedDeal, onDealSelect }) => {
  const [deals, setDeals] = useState<Business[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, business_name, sector, location, asking_price, composite_score, automation_opportunity_score, last_analyzed_at')
        .eq('is_active', true)
        .order('composite_score', { ascending: false });

      if (error) throw error;
      
      // Prioritize Raleigh deals first, then sort by composite score
      const sortedDeals = (data || []).sort((a, b) => {
        // Check if either deal is from Raleigh or has "Raleigh" in the name/location
        const aIsRaleigh = a.location?.toLowerCase().includes('raleigh') || 
                          a.business_name?.toLowerCase().includes('raleigh') ||
                          a.business_name?.toLowerCase().includes('keystone');
        const bIsRaleigh = b.location?.toLowerCase().includes('raleigh') || 
                          b.business_name?.toLowerCase().includes('raleigh') ||
                          b.business_name?.toLowerCase().includes('keystone');
        
        if (aIsRaleigh && !bIsRaleigh) return -1;
        if (!aIsRaleigh && bIsRaleigh) return 1;
        
        // If both are Raleigh or neither, sort by composite score
        return b.composite_score - a.composite_score;
      });
      
      setDeals(sortedDeals);
      
      // Auto-select the highest priority deal if none selected
      if (!selectedDeal && sortedDeals.length > 0) {
        onDealSelect(sortedDeals[0]);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-50';
    if (score >= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const isPriorityDeal = (deal: Business) => {
    return deal.location?.toLowerCase().includes('raleigh') || 
           deal.business_name?.toLowerCase().includes('raleigh') ||
           deal.business_name?.toLowerCase().includes('keystone');
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (deals.length === 0) {
    return (
      <Card className="mb-6 border-yellow-200 bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">No Deals Available</h3>
              <p className="text-sm text-yellow-600">Run the business scanner to discover and analyze deals.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mb-6 relative">
      <Card className="border-2 border-blue-200">
        <CardContent className="p-0">
          <Button
            variant="ghost"
            className="w-full p-6 h-auto justify-between hover:bg-blue-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex items-center space-x-4">
              <Building className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">
                    {selectedDeal ? selectedDeal.business_name : 'Select a Deal'}
                  </h3>
                  {selectedDeal && isPriorityDeal(selectedDeal) && (
                    <Badge className="text-xs bg-blue-100 text-blue-800">Priority</Badge>
                  )}
                </div>
                {selectedDeal && (
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">{selectedDeal.sector}</span>
                    <span className="text-sm text-gray-600">{selectedDeal.location}</span>
                    <Badge className={`text-xs ${getScoreColor(selectedDeal.composite_score)}`}>
                      Score: {(selectedDeal.composite_score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CardContent>
      </Card>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto border-2 border-blue-200">
          <CardContent className="p-2">
            <div className="space-y-2">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedDeal?.id === deal.id 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => {
                    onDealSelect(deal);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{deal.business_name}</h4>
                        {isPriorityDeal(deal) && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">Priority</Badge>
                        )}
                        {selectedDeal?.id === deal.id && (
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{deal.sector}</span>
                        <span>{deal.location}</span>
                        <span>{formatCurrency(deal.asking_price)}</span>
                      </div>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge className={`text-xs ${getScoreColor(deal.composite_score)}`}>
                          Overall: {(deal.composite_score * 100).toFixed(0)}%
                        </Badge>
                        <Badge className={`text-xs ${getScoreColor(deal.automation_opportunity_score)}`}>
                          AI Score: {(deal.automation_opportunity_score * 100).toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DealSelector;

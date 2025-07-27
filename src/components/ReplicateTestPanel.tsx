import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  TestTube, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Brain,
  BarChart3,
  TrendingUp,
  Shield
} from 'lucide-react';
import { ReplicateBusinessAnalyzer } from '@/utils/replicateAnalyzer';

interface TestResult {
  source: 'existing' | 'enhanced';
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
  timestamp: string;
}

export default function ReplicateTestPanel() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestingExisting, setIsTestingExisting] = useState(false);
  const [isTestingEnhanced, setIsTestingEnhanced] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const { toast } = useToast();

  // Sample business data for testing
  const sampleBusiness = {
    business_name: "TechFlow Solutions",
    asking_price: 1500000,
    annual_revenue: 2200000,
    annual_net_profit: 450000,
    sector: "Digital Marketing",
    location: "Austin, TX",
    description: "Full-service digital marketing agency specializing in SaaS companies with 50+ recurring clients, proprietary automation tools, and strong management team."
  };

  const testExistingReplicateFunction = async () => {
    setIsTestingExisting(true);
    const startTime = Date.now();

    try {
      console.log('Testing existing Replicate API function...');
      
      // Test with a simple Llama 2 model call
      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          modelVersion: "meta/meta-llama-3-70b-instruct",
          input: {
            prompt: `Analyze this business opportunity and provide a brief assessment:

Business: ${sampleBusiness.business_name}
Asking Price: $${sampleBusiness.asking_price.toLocaleString()}
Annual Revenue: $${sampleBusiness.annual_revenue.toLocaleString()}
Annual Profit: $${sampleBusiness.annual_net_profit.toLocaleString()}
Sector: ${sampleBusiness.sector}

Provide a concise analysis focusing on financial health, growth potential, and investment recommendation.`,
            max_new_tokens: 500,
            temperature: 0.3,
            top_p: 0.9
          }
        }
      });

      const executionTime = Date.now() - startTime;

      if (error) {
        throw error;
      }

      const result: TestResult = {
        source: 'existing',
        success: true,
        data: data,
        executionTime,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Existing Function Test Complete",
        description: `Completed in ${(executionTime / 1000).toFixed(1)}s`,
      });

    } catch (error: any) {
      console.error('Existing function test failed:', error);
      
      const result: TestResult = {
        source: 'existing',
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Existing Function Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTestingExisting(false);
    }
  };

  const testEnhancedReplicateAnalyzer = async () => {
    setIsTestingEnhanced(true);
    const startTime = Date.now();

    try {
      console.log('Testing enhanced Replicate analyzer...');
      
      // Test comprehensive analysis
      const analysis = await ReplicateBusinessAnalyzer.runComprehensiveAnalysis(sampleBusiness);
      
      const executionTime = Date.now() - startTime;

      const result: TestResult = {
        source: 'enhanced',
        success: true,
        data: analysis,
        executionTime,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Enhanced Analyzer Test Complete",
        description: `Comprehensive analysis completed in ${(executionTime / 1000).toFixed(1)}s`,
      });

    } catch (error: any) {
      console.error('Enhanced analyzer test failed:', error);
      
      const result: TestResult = {
        source: 'enhanced',
        success: false,
        error: error.message,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Enhanced Analyzer Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsTestingEnhanced(false);
    }
  };

  const testSpecificAnalysis = async (analysisType: 'financial' | 'strategic' | 'market' | 'risk') => {
    const startTime = Date.now();

    try {
      let analysis;
      switch (analysisType) {
        case 'financial':
          analysis = await ReplicateBusinessAnalyzer.analyzeFinancials(sampleBusiness);
          break;
        case 'strategic':
          analysis = await ReplicateBusinessAnalyzer.analyzeStrategy(sampleBusiness);
          break;
        case 'market':
          analysis = await ReplicateBusinessAnalyzer.analyzeMarket(sampleBusiness);
          break;
        case 'risk':
          analysis = await ReplicateBusinessAnalyzer.analyzeRisks(sampleBusiness);
          break;
      }

      const executionTime = Date.now() - startTime;

      const result: TestResult = {
        source: 'enhanced',
        success: true,
        data: { [analysisType]: analysis },
        executionTime,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis Complete`,
        description: `Completed in ${(executionTime / 1000).toFixed(1)}s`,
      });

    } catch (error: any) {
      console.error(`${analysisType} analysis failed:`, error);
      
      toast({
        title: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis Failed`,
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const testCustomPrompt = async () => {
    if (!customInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a custom prompt to test",
        variant: "destructive"
      });
      return;
    }

    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('replicate-api', {
        body: {
          modelVersion: "meta/meta-llama-3-70b-instruct",
          input: {
            prompt: customInput,
            max_new_tokens: 1000,
            temperature: 0.5,
            top_p: 0.9
          }
        }
      });

      const executionTime = Date.now() - startTime;

      if (error) throw error;

      const result: TestResult = {
        source: 'existing',
        success: true,
        data: data,
        executionTime,
        timestamp: new Date().toISOString()
      };

      setTestResults(prev => [result, ...prev]);
      
      toast({
        title: "Custom Prompt Test Complete",
        description: `Completed in ${(executionTime / 1000).toFixed(1)}s`,
      });

    } catch (error: any) {
      console.error('Custom prompt test failed:', error);
      
      toast({
        title: "Custom Prompt Test Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatOutput = (data: any) => {
    if (typeof data === 'string') return data;
    if (Array.isArray(data)) return data.join('');
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <TestTube className="w-6 h-6 text-green-600" />
            <span>Replicate API Test Suite</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="comparison" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="comparison">Comparison Tests</TabsTrigger>
              <TabsTrigger value="specific">Specific Analysis</TabsTrigger>
              <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    Existing Replicate Function
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Test your deployed replicate-api Edge Function with a simple business analysis prompt.
                  </p>
                  <Button 
                    onClick={testExistingReplicateFunction}
                    disabled={isTestingExisting}
                    className="w-full"
                  >
                    {isTestingExisting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Testing Existing...
                      </>
                    ) : (
                      <>
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Existing Function
                      </>
                    )}
                  </Button>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    Enhanced Analyzer
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Test the enhanced ReplicateBusinessAnalyzer with comprehensive multi-model analysis.
                  </p>
                  <Button 
                    onClick={testEnhancedReplicateAnalyzer}
                    disabled={isTestingEnhanced}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isTestingEnhanced ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Running Analysis...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Test Enhanced Analyzer
                      </>
                    )}
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="specific" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  onClick={() => testSpecificAnalysis('financial')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Financial
                </Button>
                <Button 
                  onClick={() => testSpecificAnalysis('strategic')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Strategic
                </Button>
                <Button 
                  onClick={() => testSpecificAnalysis('market')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Market
                </Button>
                <Button 
                  onClick={() => testSpecificAnalysis('risk')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Risk
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-4">
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter your custom prompt for Llama 2 70B..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  rows={4}
                />
                <Button onClick={testCustomPrompt} className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Test Custom Prompt
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sample Business Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sample Business Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Business:</strong> {sampleBusiness.business_name}<br/>
              <strong>Sector:</strong> {sampleBusiness.sector}<br/>
              <strong>Location:</strong> {sampleBusiness.location}
            </div>
            <div>
              <strong>Asking Price:</strong> ${sampleBusiness.asking_price.toLocaleString()}<br/>
              <strong>Revenue:</strong> ${sampleBusiness.annual_revenue.toLocaleString()}<br/>
              <strong>Profit:</strong> ${sampleBusiness.annual_net_profit.toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={result.source === 'existing' ? 'border-blue-500 text-blue-700' : 'border-purple-500 text-purple-700'}
                      >
                        {result.source === 'existing' ? 'Existing Function' : 'Enhanced Analyzer'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                          {result.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {((result.executionTime || 0) / 1000).toFixed(1)}s
                      </div>
                      <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  {result.error && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800 mb-2">
                        View Response Data
                      </summary>
                      <pre className="p-3 bg-gray-50 rounded overflow-auto max-h-96">
                        {formatOutput(result.data)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
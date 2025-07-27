import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bug, CheckCircle, AlertTriangle, Wifi, Database, Zap } from 'lucide-react';

export default function AgentDebugPanel() {
  const [debugResults, setDebugResults] = useState<any>({});
  const [isDebugging, setIsDebugging] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setIsDebugging(true);
    const results: any = {};

    try {
      // Test 1: Database Connection
      console.log('Testing database connection...');
      const { data: dbTest, error: dbError } = await supabase
        .from('analysis_runs')
        .select('count(*)')
        .limit(1);
      
      results.database = {
        status: dbError ? 'error' : 'success',
        message: dbError ? dbError.message : 'Database connection successful',
        data: dbTest
      };

      // Test 2: Edge Function Existence
      console.log('Testing Edge Function availability...');
      try {
        const { data: funcTest, error: funcError } = await supabase.functions.invoke('project-million-scanner', {
          body: { action: 'test_connection' }
        });
        
        results.edgeFunction = {
          status: funcError ? 'error' : 'success',
          message: funcError ? funcError.message : 'Edge Function accessible',
          data: funcTest
        };
      } catch (error: any) {
        results.edgeFunction = {
          status: 'error',
          message: error.message || 'Edge Function not accessible',
          data: null
        };
      }

      // Test 3: Sample Business Insert
      console.log('Testing business insert...');
      const testBusiness = {
        business_name: `Debug Test Business ${Date.now()}`,
        sector: 'Technology',
        location: 'Test Location',
        asking_price: 1000000,
        annual_revenue: 800000,
        annual_net_profit: 200000,
        automation_opportunity_score: 0.8,
        composite_score: 0.85,
        description: 'Test business for debugging',
        source: 'debug_test',
        is_active: true,
        last_analyzed_at: new Date().toISOString()
      };

      const { data: insertTest, error: insertError } = await supabase
        .from('businesses')
        .insert([testBusiness])
        .select('id')
        .single();

      results.businessInsert = {
        status: insertError ? 'error' : 'success',
        message: insertError ? insertError.message : 'Business insert successful',
        data: insertTest
      };

      // Clean up test business
      if (insertTest?.id) {
        await supabase.from('businesses').delete().eq('id', insertTest.id);
      }

      // Test 4: Analysis Runs Table
      const { data: runsTest, error: runsError } = await supabase
        .from('analysis_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);

      results.analysisRuns = {
        status: runsError ? 'error' : 'success',
        message: runsError ? runsError.message : `Found ${runsTest?.length || 0} analysis runs`,
        data: runsTest
      };

      // Test 5: Environment Check
      results.environment = {
        status: 'info',
        message: 'Environment information',
        data: {
          url: window.location.href,
          userAgent: navigator.userAgent.slice(0, 50) + '...',
          timestamp: new Date().toISOString()
        }
      };

    } catch (error: any) {
      console.error('Diagnostic error:', error);
      results.error = {
        status: 'error',
        message: error.message,
        data: null
      };
    }

    setDebugResults(results);
    setIsDebugging(false);

    // Show summary toast
    const errorCount = Object.values(results).filter((r: any) => r.status === 'error').length;
    toast({
      title: errorCount === 0 ? "All Systems Operational" : `${errorCount} Issues Found`,
      description: `Diagnostic completed. Check the debug panel for details.`,
      variant: errorCount === 0 ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      default:
        return <Bug className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const testEdgeFunctionDirectly = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('project-million-scanner', {
        body: { action: 'start_scan' }
      });

      console.log('Direct Edge Function call result:', { data, error });
      
      toast({
        title: error ? "Edge Function Error" : "Edge Function Response",
        description: error ? error.message : JSON.stringify(data),
        variant: error ? "destructive" : "default"
      });
    } catch (error: any) {
      console.error('Direct Edge Function call failed:', error);
      toast({
        title: "Direct Call Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Debug Controls */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Bug className="w-6 h-6 text-orange-600" />
            <span>AI Agent Debug Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button 
              onClick={runDiagnostics} 
              disabled={isDebugging}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isDebugging ? (
                <>
                  <Bug className="w-4 h-4 mr-2 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run Full Diagnostics
                </>
              )}
            </Button>
            
            <Button 
              onClick={testEdgeFunctionDirectly}
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Test Edge Function
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Debug Results */}
      {Object.keys(debugResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Diagnostic Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(debugResults).map(([key, result]: [string, any]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <Badge variant="outline" className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                        View Data
                      </summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Fixes */}
      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <strong>Edge Function Not Deployed:</strong> The Supabase Edge Function may not be deployed in your Lovable environment. This is the most common issue.
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <strong>Missing API Keys:</strong> The AI models (OpenAI, Claude, Gemini, Perplexity) need API keys in Supabase environment variables.
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <strong>Database Issues:</strong> Check if the analysis_runs and businesses tables exist and have proper permissions.
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <strong>CORS Issues:</strong> Edge Function might have CORS configuration problems preventing frontend calls.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
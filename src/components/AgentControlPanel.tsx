
import React, { useState, useEffect } from 'react';
import { Bot, Play, Loader2, CheckCircle, AlertTriangle, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalysisRun {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  businesses_processed: number;
  businesses_added: number;
  businesses_updated: number;
  execution_time_seconds?: number;
  error_message?: string;
}

const AgentControlPanel: React.FC = () => {
  const [currentRun, setCurrentRun] = useState<AnalysisRun | null>(null);
  const [recentRuns, setRecentRuns] = useState<AnalysisRun[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecentRuns();
    
    // Set up real-time subscription for analysis runs
    const subscription = supabase
      .channel('analysis-runs')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analysis_runs'
      }, (payload) => {
        console.log('Analysis run updated:', payload);
        if (payload.eventType === 'UPDATE' && currentRun?.id === payload.new.id) {
          setCurrentRun(payload.new as AnalysisRun);
        }
        fetchRecentRuns();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentRun?.id]);

  const fetchRecentRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('analysis_runs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentRuns(data || []);
      
      // Check if there's an active run
      const activeRun = data?.find(run => run.status === 'pending' || run.status === 'processing');
      if (activeRun) {
        setCurrentRun(activeRun);
        setIsScanning(true);
      } else {
        setIsScanning(false);
      }
    } catch (error) {
      console.error('Error fetching analysis runs:', error);
    }
  };

  const startScan = async () => {
    try {
      setIsScanning(true);
      
      const { data, error } = await supabase.functions.invoke('project-million-scanner', {
        body: { action: 'start_scan' }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Scan Started",
          description: "AI-powered business discovery and analysis has begun.",
        });
        
        // Fetch the new run
        const { data: newRun } = await supabase
          .from('analysis_runs')
          .select('*')
          .eq('id', data.run_id)
          .single();
          
        if (newRun) {
          setCurrentRun(newRun);
        }
      } else {
        throw new Error(data.error || 'Failed to start scan');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      setIsScanning(false);
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to start business discovery scan.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Current Scan Status */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-purple-600" />
            <span>AI Agent Control Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentRun && isScanning ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(currentRun.status)}
                    <Badge className={getStatusColor(currentRun.status)}>
                      {currentRun.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(currentRun.started_at).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentRun.businesses_processed}
                    </div>
                    <div className="text-sm text-gray-600">Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentRun.businesses_added}
                    </div>
                    <div className="text-sm text-gray-600">Added</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {currentRun.businesses_updated}
                    </div>
                    <div className="text-sm text-gray-600">Updated</div>
                  </div>
                </div>

                {currentRun.status === 'processing' && (
                  <div className="text-center text-sm text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    Analyzing businesses with multi-model AI pipeline...
                  </div>
                )}

                {currentRun.error_message && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {currentRun.error_message}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <BarChart3 className="w-5 h-5" />
                  <span>Ready for business discovery</span>
                </div>
                <Button 
                  onClick={startScan}
                  disabled={isScanning}
                  size="lg"
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start AI Business Scan
                </Button>
                <p className="text-xs text-gray-500">
                  Discover and analyze businesses using OpenAI, Claude, Gemini, and Perplexity
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      {recentRuns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Scans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(run.status)}
                    <div>
                      <div className="text-sm font-medium">
                        {new Date(run.started_at).toLocaleDateString()} at{' '}
                        {new Date(run.started_at).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        {run.businesses_processed} businesses processed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${getStatusColor(run.status)}`}>
                      {run.status}
                    </Badge>
                    {run.execution_time_seconds && (
                      <div className="text-xs text-gray-600 mt-1">
                        {formatDuration(run.execution_time_seconds)}
                      </div>
                    )}
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

export default AgentControlPanel;

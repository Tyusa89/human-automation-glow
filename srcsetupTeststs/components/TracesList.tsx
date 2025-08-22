import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface SystemTrace {
  id: string;
  action: string;
  component: string;
  status: 'success' | 'error' | 'pending' | 'warning';
  message: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

const TracesList = () => {
  const [traces, setTraces] = useState<SystemTrace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock traces data
  const mockTraces: SystemTrace[] = [
    {
      id: '1',
      action: 'Lead Form Submission',
      component: 'ContactForm',
      status: 'success',
      message: 'Lead successfully created and auto-reply sent',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      duration: 1200,
      metadata: { leadId: 'lead_123', email: 'john@example.com' }
    },
    {
      id: '2',
      action: 'Task Creation',
      component: 'TaskManager',
      status: 'success',
      message: 'New automation task created successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      duration: 800,
      metadata: { taskId: 'task_456', priority: 'medium' }
    },
    {
      id: '3',
      action: 'KB Search',
      component: 'KnowledgeBase',
      status: 'success',
      message: 'Search completed with 3 relevant results',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      duration: 450,
      metadata: { query: 'automation setup', results: 3 }
    },
    {
      id: '4',
      action: 'Data Sync',
      component: 'Integrations',
      status: 'warning',
      message: 'Partial sync completed - some records skipped',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      duration: 3200,
      metadata: { syncedRecords: 128, skippedRecords: 5 }
    },
    {
      id: '5',
      action: 'API Request',
      component: 'WebhookHandler',
      status: 'error',
      message: 'Failed to connect to external service',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      duration: 5000,
      metadata: { endpoint: '/api/external', error: 'Connection timeout' }
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setTraces(mockTraces);
  }, []);

  const loadTraces = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add a new mock trace to simulate real-time updates
    const newTrace: SystemTrace = {
      id: Date.now().toString(),
      action: 'System Health Check',
      component: 'Monitor',
      status: 'success',
      message: 'All systems operational',
      timestamp: new Date().toISOString(),
      duration: 250,
      metadata: { systemStatus: 'healthy' }
    };
    
    setTraces(prev => [newTrace, ...prev.slice(0, 9)]); // Keep only 10 latest
    setIsLoading(false);
  };

  const getStatusIcon = (status: SystemTrace['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: SystemTrace['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">System Traces</h3>
          <p className="text-sm text-muted-foreground">Real-time system activity and automation logs</p>
        </div>
        <Button 
          onClick={loadTraces}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <Card className="border-accent/20">
        <CardContent className="p-0">
          {traces.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No traces yet</h3>
              <p>System activity traces will appear here as actions occur.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {traces.map((trace) => (
                  <TableRow key={trace.id} className="hover:bg-accent/5">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(trace.status)}
                        <Badge className={getStatusColor(trace.status)}>
                          {trace.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">{trace.action}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{trace.component}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{trace.message}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(trace.duration)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(trace.timestamp)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TracesList;
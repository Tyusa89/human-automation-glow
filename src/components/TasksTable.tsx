import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CheckSquare, Clock, AlertCircle, Play, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { runTask } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

const TasksTable = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Process lead qualification',
      description: 'Run AI analysis on new leads from contact form',
      status: 'completed',
      priority: 'medium',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z'
    },
    {
      id: '2',
      title: 'Generate weekly report',
      description: 'Compile automation metrics and performance data',
      status: 'in_progress',
      priority: 'high',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T12:30:00Z'
    },
    {
      id: '3',
      title: 'Sync customer data',
      description: 'Update CRM with latest customer interactions',
      status: 'pending',
      priority: 'low',
      createdAt: '2024-01-14T16:20:00Z',
      updatedAt: '2024-01-14T16:20:00Z'
    }
  ]);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority']
  });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '', priority: 'medium' });
    setIsAddTaskOpen(false);
    
    toast({
      title: "Task Added",
      description: "New task has been created successfully.",
    });
  };

  const handleRunDaily = async () => {
    try {
      const { status } = await runTask('daily_kpi', { since: 'yesterday' });
      if (status === 'ok') {
        toast({
          title: "Success",
          description: "Daily KPI report generated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate daily KPI report",
        variant: "destructive",
      });
    }
  };

  const handleGenerateSOP = async () => {
    try {
      const { status } = await runTask('generate_sop', { topic: 'Onboarding New Lead' });
      if (status === 'ok') {
        toast({
          title: "Success",
          description: "SOP for 'Onboarding New Lead' generated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SOP",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Tasks</h3>
          <p className="text-sm text-muted-foreground">Manage your automation tasks</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRunDaily}
            variant="outline"
            size="sm"
            className="border-primary/20 hover:bg-primary/10"
          >
            <Play className="mr-2 h-4 w-4" />
            Run Daily KPI
          </Button>
          <Button 
            onClick={handleGenerateSOP}
            variant="outline"
            size="sm"
            className="border-accent/20 hover:bg-accent/10"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate SOP
          </Button>
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title *</Label>
                <Input
                  id="task-title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: Task['priority']) => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-accent/20">
        <CardContent className="p-0">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
              <p>Create your first automation task to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-accent/5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground flex items-center">
                          {getStatusIcon(task.status)}
                          <span className="ml-2">{task.title}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(task.updatedAt)}
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

export default TasksTable;
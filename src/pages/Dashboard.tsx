import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, BookOpen, Activity } from 'lucide-react';
import LeadsTable from '@/components/LeadsTable';
import TasksTable from '@/components/TasksTable';
import KBList from '@/components/KBList';
import TracesList from '@/components/TracesList';
import { SPADEProcessor } from '@/components/SPADEProcessor';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');

  const stats = [
    {
      title: "Total Leads",
      value: "24",
      icon: Users,
      change: "+12%"
    },
    {
      title: "Active Tasks",
      value: "8",
      icon: CheckSquare,
      change: "+3"
    },
    {
      title: "KB Articles",
      value: "156",
      icon: BookOpen,
      change: "+23"
    },
    {
      title: "System Traces",
      value: "1,247",
      icon: Activity,
      change: "+156"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor your automation, leads, tasks, and system performance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-sm text-accent">
                        {stat.change}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Card className="border-accent/20">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="leads">Leads</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="kb">Knowledge Base</TabsTrigger>
                <TabsTrigger value="traces">Traces</TabsTrigger>
                <TabsTrigger value="spade">SPADE Demo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="leads" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Recent Leads</h3>
                  <p className="text-muted-foreground">Latest 25 leads from your contact forms</p>
                </div>
                <LeadsTable />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Task Management</h3>
                  <p className="text-muted-foreground">Track and manage your automation tasks</p>
                </div>
                <TasksTable />
              </TabsContent>
              
              <TabsContent value="kb" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Knowledge Base</h3>
                  <p className="text-muted-foreground">Search and manage your AI knowledge articles</p>
                </div>
                <KBList />
              </TabsContent>
              
              <TabsContent value="traces" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">System Traces</h3>
                  <p className="text-muted-foreground">Monitor automation activity and system logs</p>
                </div>
                <TracesList />
              </TabsContent>
              
              <TabsContent value="spade" className="mt-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">SPADE Processing Demo</h3>
                  <p className="text-muted-foreground">Demonstrating AI-powered lead processing using SPADE methodology</p>
                </div>
                <SPADEProcessor 
                  userInput="Hi, I'm Mia from LumenCo. We need help automating weekly reports."
                  context={{ source: 'website', timestamp: new Date().toISOString() }}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
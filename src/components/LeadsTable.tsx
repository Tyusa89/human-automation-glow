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
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Mail, Calendar } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  createdAt: string;
}

const LeadsTable = () => {
  // Mock data - this will be replaced with real data from API
  const [leads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@techcorp.com',
      company: 'TechCorp',
      message: 'Interested in AI automation for our customer service team.',
      status: 'new',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@innovate.io',
      company: 'Innovate Solutions',
      message: 'Looking for custom AI agents to help with lead qualification.',
      status: 'contacted',
      createdAt: '2024-01-14T14:22:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@startupxyz.com',
      company: 'StartupXYZ',
      message: 'Need help integrating our existing tools with AI workflows.',
      status: 'qualified',
      createdAt: '2024-01-13T09:15:00Z'
    }
  ]);

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'converted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (leads.length === 0) {
    return (
      <Card className="border-accent/20">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No leads yet</h3>
            <p>Leads from your contact form will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-accent/20">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id} className="hover:bg-accent/5">
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">{lead.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-foreground">{lead.company || '-'}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(lead.createdAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeadsTable;
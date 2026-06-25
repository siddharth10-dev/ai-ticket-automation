import React, { useEffect, useState } from 'react';
import { Ticket, Clock, AlertCircle, Wand2, ArrowRight, Bot, LineChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import StatsCard from '@/components/StatsCard';
import { getTickets } from '@/services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return <Badge variant="outline" className="bg-slate-100 text-slate-700">NEW</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">PROCESSING</Badge>;
      case 'ai assigned': return <Badge className="bg-primary hover:bg-primary/90">AI ASSIGNED</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">RESOLVED</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-500">System-wide performance overview and active ticket monitoring.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-border rounded-full shadow-sm text-sm font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live System: 99.9% Uptime
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Tickets" 
          value={loading ? "..." : String(tickets.length)} 
          icon={Ticket} 
          trend="up" 
          trendValue="Live" 
        />
        <StatsCard 
          title="Open Tickets" 
          value={loading ? "..." : String(tickets.filter(t => ['open', 'processing', 'new', 'ai assigned'].includes(t.status?.toLowerCase())).length)} 
          icon={Clock} 
          trend="steady" 
          trendValue="Active" 
        />
        <StatsCard 
          title="High Priority" 
          value={loading ? "..." : String(tickets.filter(t => ['high', 'critical'].includes(t.priority?.toLowerCase())).length).padStart(2, '0')} 
          icon={AlertCircle} 
          trend="down" 
          trendValue="Triage" 
          type="critical"
        />
        <StatsCard 
          title="AI Processed" 
          value={loading ? "..." : String(tickets.filter(t => t.confidence_score > 0).length)} 
          icon={Wand2} 
          trend="up" 
          trendValue={`${tickets.length ? Math.round((tickets.filter(t => t.confidence_score > 0).length / tickets.length) * 100) : 0}% Rate`} 
          type="primary"
        />
      </div>

      <div className="w-full">
        <div className="w-full">
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between py-5 border-b border-border">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Tickets</CardTitle>
              <Link to="/tickets" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                View All
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-500 w-[100px]">TICKET ID</TableHead>
                    <TableHead className="font-semibold text-slate-500">SUBJECT</TableHead>
                    <TableHead className="font-semibold text-slate-500">STATUS</TableHead>
                    <TableHead className="font-semibold text-slate-500">PRIORITY</TableHead>
                    <TableHead className="font-semibold text-slate-500 text-right">TIME</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">Loading tickets...</TableCell>
                    </TableRow>
                  ) : tickets.slice(0, 4).map((ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-slate-50/80 cursor-pointer transition-colors group">
                      <TableCell className="font-medium text-slate-900">#{ticket.id}</TableCell>
                      <TableCell className="font-medium text-slate-700">{ticket.title}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {ticket.priority.toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500">
                        {formatTimeAgo(ticket.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;

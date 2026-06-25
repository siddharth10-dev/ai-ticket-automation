import React, { useEffect, useState } from 'react';
import { Search, Filter, ArrowUpDown, X, Send, Sparkles, User, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTickets } from '@/services/api';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Tickets</h1>
          <p className="text-slate-500">Manage, review, and resolve user support inquiries.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Table & Search */}
        <Card className={`shadow-sm border-border w-full transition-all duration-300 ${selectedTicket ? 'lg:w-[60%]' : 'w-full'}`}>
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search by subject or ID..." 
                  className="pl-9 bg-white"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] bg-white">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-[120px] bg-white">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-semibold text-slate-500 w-[80px]">ID</TableHead>
                    <TableHead className="font-semibold text-slate-500">SUBJECT</TableHead>
                    <TableHead className="font-semibold text-slate-500">STATUS</TableHead>
                    <TableHead className="font-semibold text-slate-500">PRIORITY</TableHead>
                    {!selectedTicket && (
                      <>
                        <TableHead className="font-semibold text-slate-500 text-right">CONFIDENCE</TableHead>
                        <TableHead className="font-semibold text-slate-500 text-right">CREATED</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={selectedTicket ? 4 : 6} className="text-center py-12 text-slate-500">Loading tickets...</TableCell>
                    </TableRow>
                  ) : tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={selectedTicket ? 4 : 6} className="text-center py-12 text-slate-500">No tickets found.</TableCell>
                    </TableRow>
                  ) : tickets.map((ticket) => (
                    <TableRow 
                      key={ticket.id} 
                      onClick={() => setSelectedTicket(ticket)}
                      className={`interactive-row cursor-pointer transition-all duration-200 ${selectedTicket?.id === ticket.id ? 'bg-slate-50 border-l-2 border-primary' : 'hover:bg-slate-50/80'}`}
                    >
                      <TableCell className="font-medium text-slate-900">#{ticket.id}</TableCell>
                      <TableCell className="font-medium text-slate-700 max-w-[200px] truncate">{ticket.title}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority?.toUpperCase()}
                        </div>
                      </TableCell>
                      {!selectedTicket && (
                        <>
                          <TableCell className="text-right">
                            {ticket.confidence_score ? (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {(ticket.confidence_score * 100).toFixed(0)}%
                              </Badge>
                            ) : '-'}
                          </TableCell>
                          <TableCell className="text-right text-sm text-slate-500">
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Detail Drawer */}
        {selectedTicket && (
          <Card className="w-full lg:w-[40%] border-border shadow-md animate-in slide-in-from-right duration-300">
            <CardContent className="p-6 space-y-6">
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-400">TICKET #{selectedTicket.id}</span>
                    {selectedTicket.confidence_score && (
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 flex items-center gap-1 py-0 px-2 text-[10px] shadow-none">
                        <Sparkles size={10} className="text-emerald-600" />
                        AI Verified
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedTicket.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Status</span>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider block">Priority</span>
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-bold border ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority?.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <User size={14} />
                  <span>SENDER INFO & DESCRIPTION</span>
                </div>
                <div className="p-4 rounded-md border border-border bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      U
                    </div>
                    <span className="text-sm font-semibold text-slate-700">User Account</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description || "No description provided for this ticket."}
                  </p>
                </div>
              </div>

              {/* AI Auto-Response Preview Area */}
              <div className="space-y-3 border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <Sparkles size={14} />
                    Suggested AI Resolution
                  </span>
                  {selectedTicket.confidence_score && (
                    <span className="text-[10px] font-bold text-slate-400">Confidence: {(selectedTicket.confidence_score * 100).toFixed(0)}%</span>
                  )}
                </div>
                <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-md text-xs text-slate-700 leading-relaxed italic">
                  {selectedTicket.draft_response ? `"${selectedTicket.draft_response}"` : "No auto-response generated for this ticket."}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-primary hover:bg-primary/95 text-white rounded-md text-xs font-bold transition-all duration-200 active:scale-98 shadow-sm flex items-center justify-center gap-1.5">
                    <Send size={12} /> Apply AI Response
                  </button>
                  <button className="py-2 px-3 bg-white border border-border text-slate-700 rounded-md text-xs font-bold hover:bg-slate-50 active:scale-98 transition-all duration-200">
                    Draft Reply
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Tickets;

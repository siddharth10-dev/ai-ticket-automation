import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, Activity, ShieldCheck, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getTickets } from '@/services/api';

const AIInsights = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets for AI insights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Filter only tickets that have run through AI (confidence score exists)
  const aiTickets = tickets.filter(t => t.confidence_score > 0);

  // Generate logs from live DB records
  const intelligenceLogs = aiTickets.map((t, idx) => ({
    id: t.id,
    time: new Date(t.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    action: 'AI Auto-Classification',
    entity: `Ticket #${t.id}`,
    resolution: t.status === 'Resolved' ? 'SUCCESS' : 'ACTIVE',
    confidence: t.confidence_score
  }));

  // Average confidence score across all processed tickets
  const avgConfidence = aiTickets.length > 0 
    ? (aiTickets.reduce((acc, t) => acc + t.confidence_score, 0) / aiTickets.length) 
    : 0.95;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 flex items-center gap-2">
            AI Insights <span className="text-slate-300 font-light">/</span> TicketFlow
          </h1>
          <p className="text-slate-500">Real-time performance intelligence and automated ticketing forensics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-border text-sm font-semibold rounded-md shadow-sm hover:bg-slate-50 active:scale-98 transition-all duration-200">
            Export Report
          </button>
          <button className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md shadow-sm hover:bg-primary/90 active:scale-98 transition-all duration-200 flex items-center gap-2 group">
            <Activity size={16} className="group-hover:animate-bounce" /> Re-Sync Pulse
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-border bg-white h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:scale-110 transition-transform">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">AI Pulse Assistant</h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">Monitoring Active</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-primary">{(avgConfidence * 100).toFixed(1)}<span className="text-xl text-primary/70">%</span></div>
                  <p className="text-xs font-medium text-slate-500">Confidence Score</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 border border-border rounded-md">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Response Velocity</p>
                  <div className="flex items-end gap-2 mb-3">
                    <h4 className="text-2xl font-black text-slate-900">-14<span className="text-lg text-slate-500">%</span></h4>
                    <span className="text-xs font-medium text-slate-500 mb-1">vs LW</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[60%]"></div>
                  </div>
                </div>
                
                <div className="p-4 border border-border rounded-md">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Draft Accuracy</p>
                  <div className="flex items-end gap-2 mb-3">
                    <h4 className="text-2xl font-black text-slate-900">99.2<span className="text-lg text-slate-500">%</span></h4>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[99%]"></div>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-md">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket Offload</p>
                  <div className="flex items-end gap-2 mb-3">
                    <h4 className="text-2xl font-black text-slate-900">{aiTickets.length}</h4>
                    <span className="text-xs font-medium text-slate-500 mb-1">Units</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full w-[75%]"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md border border-slate-100">
                <div className="flex -space-x-2">
                  <img src="https://ui-avatars.com/api/?name=Alex&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
                  <img src="https://ui-avatars.com/api/?name=Sarah&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">+12</div>
                </div>
                <p className="text-sm font-medium text-slate-600 italic">
                  "Pulse detected {aiTickets.length} classification logs processed via model queues."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-sm border-border h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">Predictive Saves</h3>
                <Fingerprint className="text-slate-300 animate-pulse" size={24} />
              </div>
              
              <div className="mb-8">
                <h2 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">${(aiTickets.length * 12.5).toFixed(0)}</h2>
                <p className="text-sm font-medium text-slate-500">Est. cost savings this month</p>
              </div>

              <div className="space-y-6 mt-auto">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-600">Automation ROI</span>
                    <span className="text-xs font-bold text-primary">320%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[85%] transition-all duration-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-600">Labor Recapture</span>
                    <span className="text-xs font-bold text-primary">{aiTickets.length * 0.5} hrs</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[45%] transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="py-5 border-b border-border">
            <CardTitle className="text-lg font-bold text-slate-900">Model Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#0F766E" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="22.6" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute text-center">
                <span className="text-4xl font-black text-slate-900">91%</span>
              </div>
            </div>
            <div className="w-full space-y-3 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-sm font-medium text-slate-600">Verified Resolutions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                <span className="text-sm font-medium text-slate-600">Human Re-triages</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border lg:col-span-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="py-5 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-900">Intelligence Logs</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">LIVE FEED</Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs shadow-none">ALL SYSTEMS NORMAL</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-500 text-xs">TIMESTAMP</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs">ACTION</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs">ENTITY</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs">RESOLUTION</TableHead>
                  <TableHead className="font-semibold text-slate-500 text-xs text-right">CONFIDENCE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-500">Loading intelligence logs...</TableCell>
                  </TableRow>
                ) : intelligenceLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-slate-500">No logs recorded yet.</TableCell>
                  </TableRow>
                ) : intelligenceLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-slate-500 text-xs">{log.time}</TableCell>
                    <TableCell className="font-bold text-slate-900 text-sm">{log.action}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{log.entity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold uppercase",
                        log.resolution === 'SUCCESS' ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
                        log.resolution === 'ESCALATED' ? "text-amber-600 bg-amber-50 border-amber-200" :
                        "text-blue-600 bg-blue-50 border-blue-200"
                      )}>
                        {log.resolution}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">{(log.confidence * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-3 text-center border-t border-border bg-slate-50/50">
              <button className="text-xs font-bold text-primary uppercase tracking-wider hover:text-primary/80 transition-colors">
                View Full Audit Trail
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIInsights;

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/StatsCard';
import { Ticket, Clock, CheckCircle2, Smile } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getTickets } from '@/services/api';

const COLORS = ['#0F766E', '#14B8A6', '#64748B', '#94A3B8'];

const Analytics = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets for analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // Compute stats dynamically
  const totalCount = tickets.length;
  const resolvedCount = tickets.filter(t => t.status?.toLowerCase() === 'resolved').length;
  const resolutionRate = totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(1) : "0.0";

  // Compute category distribution dynamically
  const getCategoryData = () => {
    if (totalCount === 0) {
      return [
        { name: 'Technical', value: 0 },
        { name: 'Billing', value: 0 },
        { name: 'Access', value: 0 },
        { name: 'Feature', value: 0 },
      ];
    }
    const counts = {};
    tickets.forEach(t => {
      const cat = t.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / totalCount) * 100)
    }));
  };

  const categoryData = getCategoryData();

  const getVolumeData = () => {
    if (totalCount === 0) return [];
    
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dataMap = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const name = days[d.getDay()];
      dataMap[name] = { name, incoming: 0, resolved: 0, _date: d }; // keeping _date to ensure order if needed, but JS object insertion order works here
    }

    tickets.forEach(t => {
      if (!t.created_at) return;
      const tDate = new Date(t.created_at);
      const name = days[tDate.getDay()];
      
      // Only count if it falls in the last 7 days based on day name matching (simplified for this dashboard)
      if (dataMap[name]) {
        dataMap[name].incoming += 1;
        if (t.status?.toLowerCase() === 'resolved') {
          dataMap[name].resolved += 1;
        }
      }
    });

    return Object.values(dataMap);
  };

  const volumeData = getVolumeData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Analytics - TicketFlow</h1>
          <p className="text-slate-500">Real-time operational performance and ticket intelligence overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-md">
            <button className="px-3 py-1.5 text-xs font-bold rounded shadow-sm bg-white text-slate-900">7D</button>
            <button className="px-3 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-900 transition-colors">30D</button>
            <button className="px-3 py-1.5 text-xs font-bold rounded text-slate-500 hover:text-slate-900 transition-colors">90D</button>
          </div>
          <button className="px-4 py-2 bg-white border border-border text-sm font-semibold rounded-md shadow-sm hover:bg-slate-50 active:scale-98 transition-all duration-200">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Tickets" 
          value={loading ? "..." : String(totalCount)} 
          icon={Ticket} 
          trend="up" 
          trendValue="Live" 
        />
        <StatsCard 
          title="Avg. Response Time" 
          value="1h 12m" 
          icon={Clock} 
          trend="down" 
          trendValue="Optimized" 
        />
        <StatsCard 
          title="Resolution Rate" 
          value={loading ? "..." : `${resolutionRate}%`} 
          icon={CheckCircle2} 
          trend="up" 
          trendValue={`${resolvedCount} resolved`} 
        />
        <StatsCard 
          title="CSAT Score" 
          value="4.9/5.0" 
          icon={Smile} 
          trend="up" 
          trendValue="+0.2" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="py-5 border-b border-border flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Daily Ticket Volume</CardTitle>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-xs font-semibold text-slate-500">Incoming</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-xs font-semibold text-slate-500">Resolved</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0F172A', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="resolved" stroke="#CBD5E1" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="incoming" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorIncoming)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <CardHeader className="py-5 border-b border-border">
            <CardTitle className="text-lg font-bold">Ticket Categories</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full relative mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">{loading ? "..." : String(totalCount)}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
            
            <div className="w-full grid grid-cols-2 gap-3">
              {categoryData.map((category, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="text-xs text-slate-600 font-medium">{category.name} <span className="text-slate-400">({category.value}%)</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

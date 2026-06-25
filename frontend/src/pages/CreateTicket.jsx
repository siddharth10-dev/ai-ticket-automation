import React, { useState } from 'react';
import { Bot, Send, Sparkles, AlertCircle, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTicket } from '@/services/api';
import { cn } from '@/lib/utils';

const CreateTicket = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    customerId: '',
    subject: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setErrorMsg('');
    try {
      const response = await createTicket(formData);
      if (response && response.analysis) {
        setResult(response.analysis);
      } else {
        setResult({
          category: 'Uncategorized',
          priority: 'Manual Review',
          confidence_score: 0,
          draft_response: 'AI analysis could not be completed. The ticket was saved for manual review.'
        });
      }
    } catch (error) {
      console.error("Failed to submit ticket", error);
      setErrorMsg(error.message || "Failed to submit ticket. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Create Ticket</h1>
        <p className="text-slate-500">Initialize a new support workflow with AI-assisted categorization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm font-semibold mb-6 flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="customerId" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer ID</Label>
              <Input 
                id="customerId"
                placeholder="CUST-90210" 
                className="bg-white"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</Label>
              <Input 
                id="subject"
                placeholder="Brief summary of the issue" 
                className="bg-white"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
              <textarea 
                id="description"
                placeholder="Describe the incident in detail..." 
                className="flex min-h-[200px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={loading} className="gap-2 bg-primary hover:bg-primary/90 text-white px-8">
                {loading ? (
                  <>
                    <Bot className="animate-pulse" size={18} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Submit Ticket
                    <Send size={18} />
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" className="gap-2 bg-white text-slate-700">
                <Save size={18} />
                Save Draft
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              LIVE AI ANALYSIS
            </div>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {loading ? 'PROCESSING' : result ? 'COMPLETE' : 'ACTIVE'}
            </span>
          </div>

          {result ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Confidence Tags</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border border-border rounded-md bg-white text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Category</div>
                    <div className="font-semibold text-slate-900">{result.category || 'N/A'}</div>
                  </div>
                  <div className="p-3 border border-border rounded-md bg-white text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Urgency</div>
                    <div className="font-semibold text-slate-900">{result.priority || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-end gap-2 mb-2">
                  <h3 className="text-4xl font-black tracking-tighter text-slate-900">{((result.confidence_score || 0) * 100).toFixed(0)}<span className="text-2xl text-slate-400">%</span></h3>
                  <span className="text-sm font-semibold text-slate-500 mb-1.5">AI Prediction Confidence</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn(
                      "h-full flex-1 rounded-full",
                      i < Math.round((result.confidence_score || 0) * 5) ? "bg-primary" : "bg-slate-200"
                    )}></div>
                  ))}
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 relative">
                  <Sparkles className="absolute top-4 right-4 text-primary/40" size={24} />
                  <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                    <Bot size={16} /> Draft Response
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed italic pr-6">
                    "{result.draft_response || 'No auto-response generated.'}"
                  </p>
                </CardContent>
              </Card>

              <Button className="w-full gap-2 bg-white text-primary border border-primary hover:bg-primary/5 font-semibold">
                Apply AI Auto-Fill <Sparkles size={16} />
              </Button>
            </div>
          ) : (
            <Card className="border-border bg-slate-50/50 border-dashed border-2 text-center py-12">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Bot className="text-slate-400" size={24} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Waiting for Input</h3>
                <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
                  Start typing to see real-time suggestions and similar historical cases.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;

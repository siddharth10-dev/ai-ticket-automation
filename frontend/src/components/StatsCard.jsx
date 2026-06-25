import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, type = 'default' }) => {
  const isPrimary = type === 'primary';
  const isCritical = type === 'critical';

  return (
    <Card className={cn(
      "overflow-hidden border-border transition-all hover:shadow-md",
      isPrimary ? "bg-primary text-white border-primary" : "bg-white",
      isCritical ? "border-l-4 border-l-red-500" : ""
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className={cn(
            "p-2 rounded-md",
            isPrimary ? "bg-white/20" : isCritical ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"
          )}>
            <Icon size={20} />
          </div>
          
          {trend && (
            <div className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              trend === 'up' && !isPrimary ? "bg-emerald-50 text-emerald-600" : 
              trend === 'down' && !isPrimary ? "bg-red-50 text-red-600" : 
              trend === 'steady' && !isPrimary ? "bg-slate-100 text-slate-600" :
              "bg-white/20 text-white"
            )}>
              {trendValue}
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <p className={cn(
            "text-xs font-bold tracking-wider uppercase mb-1",
            isPrimary ? "text-primary-foreground/80" : "text-slate-500"
          )}>
            {title}
          </p>
          <h3 className={cn(
            "text-3xl font-bold",
            isPrimary ? "text-white" : "text-slate-900"
          )}>
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

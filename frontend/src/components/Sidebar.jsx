import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Bot, 
  LineChart, 
  Users, 
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Tickets', path: '/tickets', icon: Ticket },
  { name: 'Automation', path: '/automation', icon: Bot },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border group cursor-pointer">
        <div className="bg-primary p-1.5 rounded-md text-white transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
          <Zap size={20} />
        </div>
        <div className="font-bold text-xl text-foreground tracking-tight transition-colors duration-200 group-hover:text-primary">TicketFlow</div>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1.5 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium relative overflow-hidden group",
                isActive 
                  ? "bg-slate-100 text-primary shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:pl-5"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <item.icon size={18} className={cn("transition-transform duration-200 group-hover:scale-110", isActive && "text-primary")} />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="px-5 mb-4 mt-auto">
        <NavLink to="/new-ticket" className="w-full">
          <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 active:scale-95 text-white py-2.5 rounded-md text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
            <span className="transition-transform duration-200 group-hover:scale-110">+ New Ticket</span>
          </button>
        </NavLink>
      </div>


    </div>
  );
};

export default Sidebar;

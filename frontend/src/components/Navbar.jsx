import React from 'react';
import { Bell, HelpCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <div className="h-16 border-b border-border bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            type="search" 
            placeholder="Search tickets, logs, or members..." 
            className="pl-9 bg-slate-50 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary w-full"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-slate-900 transition-colors">
            <Bell size={20} />
          </button>
          <button className="hover:text-slate-900 transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
        
        <div className="h-8 w-[1px] bg-border"></div>
        
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-slate-900 leading-tight">Alex Sterling</div>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Admin Account</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Alex+Sterling&background=0F766E&color=fff" alt="Avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

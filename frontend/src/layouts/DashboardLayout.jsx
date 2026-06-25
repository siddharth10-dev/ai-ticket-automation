import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

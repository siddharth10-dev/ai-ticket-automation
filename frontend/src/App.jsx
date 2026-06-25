import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Tickets from '@/pages/Tickets';
import CreateTicket from '@/pages/CreateTicket';
import Analytics from '@/pages/Analytics';
import AIInsights from '@/pages/AIInsights';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="automation" element={<AIInsights />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="new-ticket" element={<CreateTicket />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

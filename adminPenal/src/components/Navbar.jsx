import React from 'react';
import logo from '../logo.png';
import { Menu, RefreshCw } from 'lucide-react';
import { API_BASE } from '../api';

export default function Navbar({
  activeTab,
  setSidebarOpen,
  onRefresh,
  refreshing,
}) {
  const titles = {
    dashboard: 'Dashboard Overview',
    bookings: 'Product Bookings & Orders',
    inquiries: 'Product Customer Inquiries',
    products: 'Products & Solar Catalog',
    contacts: 'Contact Form Leads & Queries',
    careers: 'Career & Job Applications',
    testimonials: 'Client Reviews & Testimonials',
    gallery: 'Company Photos Gallery',
    programs: 'Solar Programs & Schemes',
    users: 'User Accounts & Roles',
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <img src={logo} alt="Skybet" className="h-8 w-auto object-contain lg:hidden" />
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {titles[activeTab] || 'Admin Panel'}
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            Connected to Skybet Backend: <span className="font-mono text-emerald-600 font-medium">{API_BASE}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>API Connected</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
          <span className="hidden sm:inline">Refresh All Data</span>
        </button>
      </div>
    </header>
  );
}

import React from 'react';
import logo from '../logo.png';
import {
  LayoutDashboard,
  ShoppingBag,
  HelpCircle,
  Package,
  Mail,
  Briefcase,
  MessageSquareQuote,
  Image as ImageIcon,
  SunMedium,
  Users,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  counts,
  isOpen,
  setIsOpen,
  onLogout,
  adminUser,
}) {
  const sections = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings & Orders', icon: ShoppingBag, badge: counts.bookings },
        { id: 'inquiries', label: 'Inquiries', icon: HelpCircle, badge: counts.inquiries },
      ],
    },
    {
      title: 'Products & Catalog',
      items: [
        {
          id: 'products',
          label: 'Products Catalog',
          icon: Package,
          badge: (counts.products || 0) + (counts.solarLights || 0) + (counts.solarPanels || 0),
        },
      ],
    },
    {
      title: 'Leads & Applications',
      items: [
        { id: 'contacts', label: 'Contact Leads', icon: Mail, badge: counts.contacts },
        { id: 'careers', label: 'Job Applications', icon: Briefcase, badge: counts.careers },
      ],
    },
    {
      title: 'Website Content',
      items: [
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, badge: counts.testimonials },
        { id: 'gallery', label: 'Company Gallery', icon: ImageIcon, badge: counts.gallery },
        { id: 'programs', label: 'Solar Programs', icon: SunMedium, badge: counts.programs },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { id: 'users', label: 'User Accounts', icon: Users, badge: counts.users },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-1 border border-slate-700 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <img src={logo} alt="Skybet Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight block leading-tight">Skybet Solar</span>
              <span className="text-[11px] font-medium text-emerald-400 uppercase tracking-widest block">Admin Control</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {sec.title}
              </div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-slate-950/20 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Profile */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs">
                {adminUser?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {adminUser?.email || 'admin@skybet.com'}
                </p>
                <p className="text-[10px] text-emerald-400 font-medium capitalize">
                  {adminUser?.role || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

import React from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  HelpCircle,
  Package,
  TrendingUp,
  ArrowRight,
  MapPin,
  User,
} from 'lucide-react';
import { api } from '../api';

export default function DashboardView({
  bookings,
  inquiries,
  products,
  onNavigate,
}) {
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const deliveredBookings = bookings.filter((b) => b.status === 'delivered').length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;

  const stats = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: ShoppingBag,
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Pending Bookings',
      value: pendingBookings,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Delivered Bookings',
      value: deliveredBookings,
      icon: CheckCircle2,
      color: 'blue',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Inquiries',
      value: inquiries.length,
      icon: HelpCircle,
      color: 'purple',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Pending Inquiries',
      value: pendingInquiries,
      icon: Clock,
      color: 'rose',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200',
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'cyan',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-600',
      borderColor: 'border-cyan-200',
    },
  ];

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return (
      <span
        className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${
          map[status] || 'bg-slate-100 text-slate-800 border-slate-200'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to Skybet Operations
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Monitor real-time product bookings, respond to customer inquiries, and manage
            the product catalog from a single responsive interface.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => onNavigate('bookings')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Manage Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('inquiries')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`bg-white p-5 rounded-2xl border ${s.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">{s.title}</span>
                <div className={`w-8 h-8 rounded-xl ${s.bgColor} ${s.textColor} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Bookings & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Product Bookings</h3>
              <p className="text-xs text-slate-500">Latest customer orders and statuses</p>
            </div>
            <button
              onClick={() => onNavigate('bookings')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No product bookings found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking._id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={api.getImageUrl(booking.product?.img)}
                      alt={booking.product?.name || 'Product'}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/100x100?text=Product';
                      }}
                      className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {booking.product?.name || 'Solar Product'}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{booking.customerName}</span>
                        <span>•</span>
                        <span>Qty: {booking.quantity || 1}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {booking.shippingAddress?.city || booking.shippingAddress?.fullAddress || 'Address'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {getStatusBadge(booking.status)}
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Inquiries</h3>
              <p className="text-xs text-slate-500">Latest product queries submitted</p>
            </div>
            <button
              onClick={() => onNavigate('inquiries')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              No inquiries found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.slice(0, 5).map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {inquiry.product?.name || 'General Product Inquiry'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <span className="font-semibold text-slate-700">{inquiry.name || 'User'}</span>
                      {inquiry.phone && <span> ({inquiry.phone})</span>}
                    </p>
                    {inquiry.message && (
                      <p className="text-xs text-slate-500 truncate mt-1 italic">
                        "{inquiry.message}"
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {getStatusBadge(inquiry.status)}
                    <span className="block text-[10px] text-slate-400 mt-1 font-mono">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { api } from '../api';
import {
  Search,
  HelpCircle,
  Phone,
  Mail,
  User,
  Eye,
  Edit,
  Trash2,
  X,
  MessageSquare,
} from 'lucide-react';

export default function InquiriesView({ inquiries, onReload, setNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusModalInquiry, setStatusModalInquiry] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      contacted: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-bold rounded-full border capitalize inline-flex items-center gap-1 ${
          map[status] || 'bg-slate-100 text-slate-800 border-slate-200'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {status}
      </span>
    );
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = statusFilter === 'all' || inq.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (inq.name && inq.name.toLowerCase().includes(term)) ||
      (inq.email && inq.email.toLowerCase().includes(term)) ||
      (inq.phone && inq.phone.toLowerCase().includes(term)) ||
      (inq.product?.name && inq.product.name.toLowerCase().includes(term)) ||
      (inq.message && inq.message.toLowerCase().includes(term));
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusModalInquiry || !newStatus) return;
    setUpdating(true);

    try {
      await api.updateInquiryStatus(statusModalInquiry._id, newStatus);
      setNotify({
        type: 'success',
        message: `Inquiry status updated to ${newStatus}`,
      });
      setStatusModalInquiry(null);
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to update inquiry status' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await api.deleteInquiry(id);
      setNotify({ type: 'success', message: 'Inquiry deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete inquiry' });
    }
  };

  const statuses = ['all', 'pending', 'contacted', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, phone, email, message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredInquiries.length}</span> of{' '}
            <span className="font-bold text-slate-900">{inquiries.length}</span> inquiries
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {st} {st !== 'all' && `(${inquiries.filter((i) => i.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Inquiries Found</h4>
            <p className="text-xs text-slate-500 mt-1">No customer inquiries match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Message / Query</th>
                  <th className="py-4 px-6">Qty</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Product */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={api.getImageUrl(inq.product?.img)}
                          alt={inq.product?.name || 'Product'}
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=Product';
                          }}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{inq.product?.name || 'Solar Product'}</p>
                          <p className="text-xs text-slate-400 capitalize">{inq.product?.category || 'General'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{inq.name || inq.user?.email?.split('@')[0] || 'User'}</span>
                        </p>
                        {inq.phone && (
                          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{inq.phone}</span>
                          </p>
                        )}
                        {inq.email && (
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{inq.email}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Message */}
                    <td className="py-4 px-6 max-w-sm">
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 italic">{inq.message || 'No message provided'}</span>
                      </div>
                    </td>

                    {/* Qty */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {inq.quantity || 1}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">{getStatusBadge(inq.status)}</td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          title="View Details"
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setStatusModalInquiry(inq);
                            setNewStatus(inq.status);
                          }}
                          title="Update Status"
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteInquiry(inq._id)}
                          title="Delete Inquiry"
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Update Inquiry Status */}
      {statusModalInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Update Inquiry Status</h3>
                <p className="text-xs text-slate-500">
                  Customer: <span className="font-semibold text-slate-800">{statusModalInquiry.name || 'User'}</span>
                </p>
              </div>
              <button
                onClick={() => setStatusModalInquiry(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Select Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStatusModalInquiry(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {updating ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Full Inquiry */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Inquiry Details</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {selectedInquiry._id}</p>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={api.getImageUrl(selectedInquiry.product?.img)}
                alt={selectedInquiry.product?.name || 'Product'}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/100x100?text=Product';
                }}
                className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900">{selectedInquiry.product?.name || 'Product'}</h4>
                <p className="text-xs text-slate-500">Category: {selectedInquiry.product?.category}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  Requested Quantity: {selectedInquiry.quantity || 1}
                </p>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                Customer Information
              </span>
              <p className="text-slate-900 font-semibold">{selectedInquiry.name || 'Not provided'}</p>
              <p className="text-slate-600">Phone: {selectedInquiry.phone || 'Not provided'}</p>
              <p className="text-slate-600">Email: {selectedInquiry.email || 'Not provided'}</p>
            </div>

            {/* Message */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                Inquiry Message / Requirement
              </span>
              <p className="text-slate-800 leading-relaxed italic text-sm">
                "{selectedInquiry.message || 'No specific message was written.'}"
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


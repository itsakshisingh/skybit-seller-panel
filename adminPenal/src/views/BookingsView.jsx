import React, { useState } from 'react';
import { api } from '../api';
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Truck,
} from 'lucide-react';

export default function BookingsView({ bookings, onReload, setNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // Status badge styling
  const getStatusBadge = (status) => {
    const map = {
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
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

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (b.customerName && b.customerName.toLowerCase().includes(term)) ||
      (b.phone && b.phone.toLowerCase().includes(term)) ||
      (b.product?.name && b.product.name.toLowerCase().includes(term)) ||
      (b.shippingAddress?.city && b.shippingAddress.city.toLowerCase().includes(term)) ||
      (b.shippingAddress?.fullAddress && b.shippingAddress.fullAddress.toLowerCase().includes(term));
    return matchStatus && matchSearch;
  });

  // Handle Status Update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusModalBooking || !newStatus) return;
    setUpdating(true);

    try {
      await api.updateBookingStatus(statusModalBooking._id, newStatus);
      setNotify({
        type: 'success',
        message: `Booking #${statusModalBooking._id.slice(-6)} status updated to ${newStatus}`,
      });
      setStatusModalBooking(null);
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to update status' });
    } finally {
      setUpdating(false);
    }
  };

  // Handle Delete
  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.deleteBooking(id);
      setNotify({ type: 'success', message: 'Booking deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete booking' });
    }
  };

  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, phone, product, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredBookings.length}</span> of{' '}
            <span className="font-bold text-slate-900">{bookings.length}</span> bookings
          </div>
        </div>

        {/* Status Filter Tabs */}
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
              {st} {st !== 'all' && `(${bookings.filter((b) => b.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Bookings Found</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Customer & Phone</th>
                  <th className="py-4 px-6">Shipping Address</th>
                  <th className="py-4 px-6">Qty / Method</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Product */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={api.getImageUrl(b.product?.img)}
                          alt={b.product?.name || 'Product'}
                          onError={(e) => {
                            e.currentTarget.src = 'https://placehold.co/100x100?text=Product';
                          }}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{b.product?.name || 'Product'}</p>
                          <p className="text-xs text-slate-400 capitalize">{b.product?.category || 'General'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.customerName}</span>
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{b.phone}</span>
                        </p>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-start gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {b.shippingAddress?.fullAddress ||
                            [
                              b.shippingAddress?.street,
                              b.shippingAddress?.city,
                              b.shippingAddress?.state,
                              b.shippingAddress?.postalCode,
                            ]
                              .filter(Boolean)
                              .join(', ') ||
                            'Address not provided'}
                        </span>
                      </div>
                    </td>

                    {/* Quantity & Method */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-slate-900">{b.quantity || 1} unit(s)</span>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                          {b.paymentMethod || 'COD'}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">{getStatusBadge(b.status)}</td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedBooking(b)}
                          title="View Details"
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Update Status */}
                        <button
                          onClick={() => {
                            setStatusModalBooking(b);
                            setNewStatus(b.status);
                          }}
                          title="Update Status"
                          className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          title="Delete Booking"
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

      {/* MODAL 1: Update Booking Status */}
      {statusModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Update Booking Status</h3>
                <p className="text-xs text-slate-500">
                  Order ID: <span className="font-mono font-semibold">#{statusModalBooking._id.slice(-6)}</span>
                </p>
              </div>
              <button
                onClick={() => setStatusModalBooking(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
                  Select New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 capitalize"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                <p>
                  <strong>Customer:</strong> {statusModalBooking.customerName} ({statusModalBooking.phone})
                </p>
                <p>
                  <strong>Product:</strong> {statusModalBooking.product?.name || 'N/A'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStatusModalBooking(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {updating ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: View Full Booking Details */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Booking Details</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {selectedBooking._id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={api.getImageUrl(selectedBooking.product?.img)}
                alt={selectedBooking.product?.name || 'Product'}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/100x100?text=Product';
                }}
                className="w-16 h-16 rounded-xl object-cover bg-white border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900">{selectedBooking.product?.name || 'Product'}</h4>
                <p className="text-xs text-slate-500">Category: {selectedBooking.product?.category}</p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  Quantity: {selectedBooking.quantity || 1} unit(s)
                </p>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                  Customer Information
                </span>
                <p className="text-slate-900 font-semibold">{selectedBooking.customerName}</p>
                <p className="text-slate-600">{selectedBooking.phone}</p>
                {selectedBooking.email && <p className="text-slate-500">{selectedBooking.email}</p>}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
                  Booking Status
                </span>
                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                <p className="text-slate-500 mt-1">Payment: {selectedBooking.paymentMethod?.toUpperCase()}</p>
              </div>
            </div>

            {/* Full Shipping Address */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Shipping Delivery Address
              </span>
              <p className="text-slate-800 leading-relaxed font-medium">
                {selectedBooking.shippingAddress?.fullAddress ||
                  [
                    selectedBooking.shippingAddress?.street,
                    selectedBooking.shippingAddress?.city,
                    selectedBooking.shippingAddress?.state,
                    selectedBooking.shippingAddress?.postalCode,
                    selectedBooking.shippingAddress?.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
              </p>
            </div>

            {/* Notes if any */}
            {selectedBooking.notes && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <span className="font-bold block mb-0.5">Customer Notes:</span>
                <p>{selectedBooking.notes}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
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


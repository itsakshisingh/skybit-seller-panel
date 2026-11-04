import React, { useState } from 'react';
import { api } from '../api';
import {
  Search,
  Mail,
  Phone,
  Building,
  MapPin,
  Trash2,
  Eye,
  X,
  MessageSquare,
  Building2,
} from 'lucide-react';

export default function ContactsView({ contacts, onReload, setNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const filteredContacts = contacts.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.mobile && c.mobile.toLowerCase().includes(term)) ||
      (c.city && c.city.toLowerCase().includes(term)) ||
      (c.companyName && c.companyName.toLowerCase().includes(term)) ||
      (c.organisationName && c.organisationName.toLowerCase().includes(term))
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact enquiry?')) return;
    try {
      await api.deleteContact(id);
      setNotify({ type: 'success', message: 'Contact enquiry deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete contact' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, city, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredContacts.length}</span> of{' '}
          <span className="font-bold text-slate-900">{contacts.length}</span> submissions
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Contact Enquiries</h4>
            <p className="text-xs text-slate-500 mt-1">No contact submissions match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Customer Name</th>
                  <th className="py-4 px-6">Phone / Mobile</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">City & Country</th>
                  <th className="py-4 px-6">Company / Org</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-700">
                      {c.mobile}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {c.email}
                    </td>
                    <td className="py-4 px-6 text-xs">
                      <span className="font-semibold text-slate-800">{c.city}</span>
                      {c.country && <span className="text-slate-400">, {c.country}</span>}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      {c.companyName || c.organisationName || '-'}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedContact(c)}
                          title="View Details"
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          title="Delete Contact"
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
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

      {/* View Contact Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Contact Enquiry Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Name
                </span>
                <p className="font-bold text-slate-900">{selectedContact.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Mobile
                  </span>
                  <p className="font-semibold text-slate-800">{selectedContact.mobile}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    City / Country
                  </span>
                  <p className="font-semibold text-slate-800">
                    {selectedContact.city}, {selectedContact.country}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Email
                </span>
                <p className="text-slate-800 font-medium">{selectedContact.email}</p>
              </div>

              {(selectedContact.companyName || selectedContact.organisationName) && (
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Organization / Company
                  </span>
                  <p className="text-slate-800 font-medium">
                    {selectedContact.companyName} {selectedContact.organisationName ? `(${selectedContact.organisationName})` : ''}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedContact(null)}
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


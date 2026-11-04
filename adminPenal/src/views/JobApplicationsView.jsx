import React, { useState } from 'react';
import { api } from '../api';
import {
  Search,
  Briefcase,
  Phone,
  Mail,
  User,
  Trash2,
  Eye,
  X,
  FileText,
  Clock,
} from 'lucide-react';

export default function JobApplicationsView({ applications, onReload, setNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = applications.filter((app) => {
    const term = searchTerm.toLowerCase();
    return (
      (app.fullName && app.fullName.toLowerCase().includes(term)) ||
      (app.email && app.email.toLowerCase().includes(term)) ||
      (app.phone && app.phone.toLowerCase().includes(term)) ||
      (app.department && app.department.toLowerCase().includes(term)) ||
      (app.experience && app.experience.toLowerCase().includes(term))
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      await api.deleteJobApplication(id);
      setNotify({ type: 'success', message: 'Job application deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete application' });
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
            placeholder="Search by candidate name, department, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredApps.length}</span> of{' '}
          <span className="font-bold text-slate-900">{applications.length}</span> candidates
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Job Applications</h4>
            <p className="text-xs text-slate-500 mt-1">No candidate applications match your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {a.fullName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {a.department}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-700 font-medium">
                      {a.experience}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-700">
                      {a.phone}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {a.email}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(a)}
                          title="View Application Details"
                          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a._id)}
                          title="Delete Application"
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

      {/* Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Job Application Details</h3>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Candidate Name
                </span>
                <p className="font-bold text-slate-900 text-base">{selectedApp.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Department
                  </span>
                  <p className="font-semibold text-slate-900">{selectedApp.department}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Experience
                  </span>
                  <p className="font-semibold text-slate-900">{selectedApp.experience}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Phone
                  </span>
                  <p className="font-semibold text-slate-900">{selectedApp.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Email
                  </span>
                  <p className="font-semibold text-slate-900 truncate">{selectedApp.email}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Why Should We Hire You / Reason
                </span>
                <p className="text-slate-800 leading-relaxed text-sm">
                  {selectedApp.reason || 'No specific statement provided.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedApp(null)}
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


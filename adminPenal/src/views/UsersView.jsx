import React, { useState } from 'react';
import { api } from '../api';
import {
  Users,
  Search,
  Shield,
  User,
  Trash2,
  Mail,
  Calendar,
} from 'lucide-react';

export default function UsersView({ users, onReload, setNotify, currentAdmin }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((u) => {
    return !searchTerm || (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleDelete = async (user) => {
    if (user.email === currentAdmin?.email) {
      alert('You cannot delete your own logged-in admin account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) return;

    try {
      await api.deleteUser(user._id);
      setNotify({ type: 'success', message: `User ${user.email} deleted successfully` });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete user' });
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
            placeholder="Search users by email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Total Users: <span className="font-bold text-slate-900">{users.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Users Found</h4>
            <p className="text-xs text-slate-500 mt-1">No user accounts match your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                <tr>
                  <th className="py-4 px-6">User / Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">User ID</th>
                  <th className="py-4 px-6">Registered On</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isSelf = u.email === currentAdmin?.email;
                  return (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 font-bold flex items-center justify-center text-xs uppercase">
                            {u.email?.[0] || 'U'}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{u.email}</span>
                            {isSelf && (
                              <span className="text-[10px] text-emerald-600 font-bold">(Current Logged-in Admin)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full border capitalize inline-flex items-center gap-1 ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 border-purple-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {u.role === 'admin' ? (
                            <Shield className="w-3 h-3 text-purple-600" />
                          ) : (
                            <User className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{u.role || 'user'}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-slate-400">
                        {u._id}
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(u)}
                            title="Delete User"
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


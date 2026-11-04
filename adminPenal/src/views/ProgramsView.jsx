import React, { useState } from 'react';
import { api, isEmoji } from '../api';
import {
  SunMedium,
  Plus,
  Trash2,
  Upload,
  X,
  Search,
  Smile,
} from 'lucide-react';

export default function ProgramsView({ programs, onReload, setNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form states
  const [iconType, setIconType] = useState('emoji'); // 'emoji' | 'file'
  const [emojiIcon, setEmojiIcon] = useState('🌞');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');

  const quickEmojis = ['🌞', '💡', '⚡', '📋', '🔋', '✅', '☀️', '🌱', '🌍', '🛠️', '🏢', '🏆'];

  const filteredPrograms = programs.filter((p) => {
    return (
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) {
      setNotify({ type: 'error', message: 'Program title is required' });
      return;
    }

    setCreating(true);
    try {
      if (iconType === 'file' && iconFile) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('icon', iconFile);
        await api.createProgram(formData);
      } else {
        // Direct JSON with emoji
        const response = await fetch(`${api.getImageUrl ? 'http://backend.skybetsolarindustries.com' : ''}/api/program`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            icon: emojiIcon || '🌞',
          }),
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to create program');
        }
      }

      setNotify({ type: 'success', message: 'Program added successfully!' });
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      setIconFile(null);
      setIconPreview('');
      setEmojiIcon('🌞');
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to add program' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      await api.deleteProgram(id);
      setNotify({ type: 'success', message: 'Program deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete program' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search programs by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Program</span>
        </button>
      </div>

      {/* Grid */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <SunMedium className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No Solar Programs Found</h4>
          <p className="text-xs text-slate-500 mt-1">Add solar subsidy schemes, certifications or training programs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((p) => {
            const hasEmoji = isEmoji(p.icon);
            const iconUrl = api.getImageUrl(p.icon);

            return (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center overflow-hidden shrink-0">
                      {hasEmoji ? (
                        <span className="text-2xl leading-none select-none">{p.icon}</span>
                      ) : iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={p.title}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.parentElement) {
                              const fallback = document.createElement('span');
                              fallback.className = 'text-2xl';
                              fallback.textContent = '☀️';
                              e.currentTarget.parentElement.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <SunMedium className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(p._id)}
                      title="Delete Program"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-2">
                      {p.description || 'Solar training or subsidy scheme for sustainable development.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                  Created: {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Solar Program</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Program Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar PV Installation Certification"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              {/* Icon Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Program Icon Type
                </label>
                <div className="flex rounded-xl bg-slate-100 p-1 mb-3">
                  <button
                    type="button"
                    onClick={() => setIconType('emoji')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      iconType === 'emoji' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Emoji Icon (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconType('file')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      iconType === 'file' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    Image Upload
                  </button>
                </div>

                {iconType === 'emoji' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl">
                        {emojiIcon || '🌞'}
                      </div>
                      <input
                        type="text"
                        value={emojiIcon}
                        onChange={(e) => setEmojiIcon(e.target.value)}
                        placeholder="Paste or type emoji"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                      />
                    </div>
                    {/* Quick emoji selector */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {quickEmojis.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => setEmojiIcon(em)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-amber-100 transition-colors ${
                            emojiIcon === em ? 'bg-amber-200 ring-2 ring-amber-400' : 'bg-slate-100'
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {iconPreview && (
                      <img
                        src={iconPreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-contain border border-slate-200 p-1"
                      />
                    )}
                    <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-xs text-slate-600 block">
                        {iconFile ? iconFile.name : 'Choose icon file'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain benefits, training scope, or subsidy details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {creating ? 'Saving...' : 'Add Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

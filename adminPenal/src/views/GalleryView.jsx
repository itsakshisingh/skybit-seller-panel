import React, { useState } from 'react';
import { api } from '../api';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
  Search,
} from 'lucide-react';

export default function GalleryView({ gallery, onReload, setNotify }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const filteredGallery = gallery.filter((item) => {
    return !searchTerm || (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setNotify({ type: 'error', message: 'Image file is required' });
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('img', imageFile);

      await api.createGalleryItem(formData);
      setNotify({ type: 'success', message: 'Photo added to gallery successfully!' });
      setShowAddModal(false);
      setTitle('');
      setImageFile(null);
      setImagePreview('');
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to upload photo' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery photo?')) return;
    try {
      await api.deleteGalleryItem(id);
      setNotify({ type: 'success', message: 'Photo deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete photo' });
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
            placeholder="Search gallery photos by title..."
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
          <span>Upload Photo</span>
        </button>
      </div>

      {/* Grid */}
      {filteredGallery.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No Photos Found</h4>
          <p className="text-xs text-slate-500 mt-1">Upload company photos or project pictures to showcase.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
            >
              <div className="aspect-square bg-slate-100 overflow-hidden relative">
                <img
                  src={api.getImageUrl(item.img)}
                  alt={item.title || 'Gallery'}
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/400x400?text=Gallery+Photo';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => handleDelete(item._id)}
                  title="Delete Photo"
                  className="absolute top-3 right-3 p-2 bg-rose-500/90 hover:bg-rose-600 text-white rounded-xl shadow-md transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 truncate">
                  {item.title || 'Solar Project Photo'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Upload Gallery Photo</h3>
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
                  Photo Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 100kW Rooftop Installation at Jaipur"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Image File *
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  )}
                  <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-3 text-center cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-600 block">
                      {imageFile ? imageFile.name : 'Select image file'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
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
                  {creating ? 'Uploading...' : 'Save to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


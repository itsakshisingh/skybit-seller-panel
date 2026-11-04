import React, { useState } from 'react';
import { api } from '../api';
import {
  Package,
  Plus,
  Trash2,
  Search,
  X,
  Upload,
  Zap,
  Shield,
  Tag,
  Sun,
  MapPin,
  Eye,
  Edit,
  BatteryCharging,
  Clock,
  Gauge,
  CheckCircle2,
  Sliders,
  DollarSign,
  FileCheck,
} from 'lucide-react';

export default function ProductsView({
  products,
  solarLights,
  solarPanels,
  regionalProducts,
  onReload,
  setNotify,
}) {
  const [collection, setCollection] = useState('main'); // 'main' | 'solarLight' | 'solarPanel' | 'regional'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Get by ID view modal
  const [editingProduct, setEditingProduct] = useState(null); // Edit modal
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('solar');
  const [price, setPrice] = useState('');
  const [wattage, setWattage] = useState('');
  const [solarPanelWattage, setSolarPanelWattage] = useState('');
  const [voltage, setVoltage] = useState('');
  const [batteryCapacity, setBatteryCapacity] = useState('');
  const [backupTime, setBackupTime] = useState('');
  const [chargingTime, setChargingTime] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [lumes, setLumes] = useState('');
  const [temperature, setTemperature] = useState('');
  const [ipRating, setIpRating] = useState('IP65');
  const [material, setMaterial] = useState('');
  const [dimension, setDimension] = useState('');
  const [weight, setWeight] = useState('');
  const [guaranteeYear, setGuaranteeYear] = useState('5 Years');
  const [certification, setCertification] = useState('MNRE Approved, BIS, CE, ISO 9001');
  const [application, setApplication] = useState('Street Lighting, Highways, Commercial, Rural');
  const [inStock, setInStock] = useState(true);
  const [stockQuantity, setStockQuantity] = useState(10);
  const [description, setDescription] = useState('');
  const [featuresList, setFeaturesList] = useState('');
  const [place, setPlace] = useState('');
  const [state, setState] = useState('');
  const [zone, setZone] = useState('');
  const [year, setYear] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setEditingProduct(item);
    setName(item.name || item.title || '');
    setCategory(item.category || 'solar');
    setPrice(item.price || '');
    setWattage(item.wattage || item.power || '');
    setSolarPanelWattage(item.solarPanelWattage || '');
    setVoltage(item.voltage || '');
    setBatteryCapacity(item.batteryCapacity || '');
    setBackupTime(item.backupTime || item.time || '');
    setChargingTime(item.chargingTime || '');
    setEfficiency(item.efficiency || item.percentage || '');
    setLumes(item.lumes || '');
    setTemperature(item.temperature || '');
    setIpRating(item.ipRating || 'IP65');
    setMaterial(item.material || '');
    setDimension(item.dimension || '');
    setWeight(item.weight || '');
    setGuaranteeYear(item.guaranteeYear || '5 Years');
    setCertification(item.certification || '');
    setApplication(item.application || '');
    setInStock(item.inStock !== undefined ? item.inStock : true);
    setStockQuantity(item.stockQuantity || 10);
    setDescription(item.description || item.descp || '');
    setFeaturesList(Array.isArray(item.list) ? item.list.join(', ') : '');
    setImagePreview(item.img ? api.getImageUrl(item.img) : '');
    setImageFile(null);
  };

  const openDetailsModal = async (item) => {
    try {
      if (collection === 'main' && item._id) {
        // Fetch fresh by ID from backend
        const fullData = await api.getProductById(item._id);
        setSelectedProduct(fullData);
      } else {
        setSelectedProduct(item);
      }
    } catch {
      setSelectedProduct(item);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct && !imageFile) {
      setNotify({ type: 'error', message: 'Product image is required' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (imageFile) formData.append('img', imageFile);

      if (collection === 'main') {
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price || 0);
        formData.append('wattage', wattage);
        formData.append('solarPanelWattage', solarPanelWattage);
        formData.append('voltage', voltage);
        formData.append('batteryCapacity', batteryCapacity);
        formData.append('backupTime', backupTime);
        formData.append('chargingTime', chargingTime);
        formData.append('efficiency', efficiency);
        formData.append('lumes', lumes);
        formData.append('temperature', temperature);
        formData.append('ipRating', ipRating);
        formData.append('material', material);
        formData.append('dimension', dimension);
        formData.append('weight', weight);
        formData.append('guaranteeYear', guaranteeYear);
        formData.append('certification', certification);
        formData.append('application', application);
        formData.append('inStock', inStock);
        formData.append('stockQuantity', stockQuantity || 10);
        formData.append('description', description);
        if (featuresList) {
          const listArr = featuresList.split(',').map((s) => s.trim()).filter(Boolean);
          formData.append('list', JSON.stringify(listArr));
        }

        if (editingProduct) {
          await api.updateProduct(editingProduct._id, formData);
          setNotify({ type: 'success', message: 'Product specifications updated successfully!' });
        } else {
          await api.createProduct(formData);
          setNotify({ type: 'success', message: 'Solar product created successfully!' });
        }
      } else if (collection === 'solarLight') {
        formData.append('name', name);
        formData.append('power', wattage);
        formData.append('description', description);
        await api.createSolarLightProduct(formData);
        setNotify({ type: 'success', message: 'Solar light product added!' });
      } else if (collection === 'solarPanel') {
        formData.append('name', name);
        formData.append('place', place);
        formData.append('description', description);
        await api.createSolarPanelProduct(formData);
        setNotify({ type: 'success', message: 'Solar panel added!' });
      } else if (collection === 'regional') {
        formData.append('title', title || name);
        formData.append('place', place);
        formData.append('state', state);
        formData.append('zone', zone);
        formData.append('year', year);
        formData.append('descp', description);
        await api.createRegionalProduct(formData);
        setNotify({ type: 'success', message: 'Regional project added!' });
      }

      setShowAddModal(false);
      setEditingProduct(null);
      resetForm();
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to save product' });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setTitle('');
    setCategory('solar');
    setPrice('');
    setWattage('');
    setSolarPanelWattage('');
    setVoltage('');
    setBatteryCapacity('');
    setBackupTime('');
    setChargingTime('');
    setEfficiency('');
    setLumes('');
    setTemperature('');
    setIpRating('IP65');
    setMaterial('');
    setDimension('');
    setWeight('');
    setGuaranteeYear('5 Years');
    setCertification('MNRE Approved, BIS, CE, ISO 9001');
    setApplication('Street Lighting, Highways, Commercial, Rural');
    setInStock(true);
    setStockQuantity(10);
    setDescription('');
    setFeaturesList('');
    setPlace('');
    setState('');
    setZone('');
    setYear('');
    setImageFile(null);
    setImagePreview('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      if (collection === 'main') await api.deleteProduct(id);
      else if (collection === 'solarLight') await api.deleteSolarLightProduct(id);
      else if (collection === 'solarPanel') await api.deleteSolarPanelProduct(id);
      else if (collection === 'regional') await api.deleteRegionalProduct(id);

      setNotify({ type: 'success', message: 'Product deleted successfully' });
      onReload();
    } catch (err) {
      setNotify({ type: 'error', message: err.message || 'Failed to delete product' });
    }
  };

  // Active collection items
  const currentItems =
    collection === 'main'
      ? products
      : collection === 'solarLight'
      ? solarLights
      : collection === 'solarPanel'
      ? solarPanels
      : regionalProducts;

  const filteredItems = currentItems.filter((item) => {
    const itemName = item.name || item.title || '';
    const matchSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
    if (collection === 'main' && categoryFilter !== 'all') {
      return matchSearch && item.category === categoryFilter;
    }
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Collection Switcher Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            setCollection('main');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            collection === 'main'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>General Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => {
            setCollection('solarLight');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            collection === 'solarLight'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Solar Lights ({solarLights.length})</span>
        </button>

        <button
          onClick={() => {
            setCollection('solarPanel');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            collection === 'solarPanel'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4 text-blue-500" />
          <span>Solar Panels ({solarPanels.length})</span>
        </button>

        <button
          onClick={() => {
            setCollection('regional');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            collection === 'regional'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4 text-emerald-500" />
          <span>Regional Products ({regionalProducts.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search products by name in ${collection}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
            />
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Solar Product</span>
          </button>
        </div>

        {/* Sub-category tabs */}
        {collection === 'main' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            {['all', 'solar', 'led', 'battery', 'pole'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} {cat !== 'all' && `(${products.filter((p) => p.category === cat).length})`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No Solar Products Found</h4>
          <p className="text-xs text-slate-500 mt-1">Click "Add Solar Product" to create your first item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-video bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img
                    src={api.getImageUrl(item.img) || 'https://placehold.co/400x300?text=No+Image'}
                    alt={item.name || item.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/400x300?text=Solar+Product';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(item.category || item.zone || item.power) && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-full bg-slate-900/80 backdrop-blur-md text-white uppercase tracking-wider">
                      {item.category || item.zone || item.power}
                    </span>
                  )}
                  {item.price > 0 && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-500 text-slate-950 shadow-md">
                      ₹{item.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                      {item.name || item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {item.description || item.descp || 'Solar product engineered for clean reliable power.'}
                    </p>
                  </div>

                  {/* Technical Tags */}
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {(item.wattage || item.power) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 text-[11px]">
                        <Zap className="w-3 h-3" />
                        {item.wattage || item.power}
                      </span>
                    )}
                    {item.batteryCapacity && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 font-semibold border border-amber-100 text-[11px]">
                        <BatteryCharging className="w-3 h-3" />
                        {item.batteryCapacity}
                      </span>
                    )}
                    {item.guaranteeYear && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-semibold border border-blue-100 text-[11px]">
                        <Shield className="w-3 h-3" />
                        {item.guaranteeYear}
                      </span>
                    )}
                    {item.voltage && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-700 font-semibold border border-purple-100 text-[11px]">
                        {item.voltage}
                      </span>
                    )}
                    {(item.place || item.state) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-semibold border border-slate-200 text-[11px]">
                        <MapPin className="w-3 h-3" />
                        {[item.place, item.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                </span>

                <div className="flex items-center gap-1">
                  {/* View Details (Get by ID) */}
                  <button
                    onClick={() => openDetailsModal(item)}
                    title="View Solar Technical Specs"
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit Product */}
                  {collection === 'main' && (
                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit Solar Product"
                      className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}

                  {/* Delete Product */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    title="Delete Product"
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Solar Technical Specification Sheet (Get By ID View) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Solar Technical Datasheet (ID: {selectedProduct._id})
                </span>
                <h3 className="text-xl font-bold text-slate-900">{selectedProduct.name || selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Product Snapshot */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={api.getImageUrl(selectedProduct.img)}
                alt={selectedProduct.name || selectedProduct.title}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/300x300?text=Solar+Product';
                }}
                className="w-28 h-28 rounded-2xl object-cover bg-white border border-slate-200 shrink-0"
              />
              <div className="space-y-1 text-center sm:text-left flex-1">
                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-900 text-white uppercase tracking-wider">
                  {selectedProduct.category || 'Solar'}
                </span>
                {selectedProduct.price > 0 && (
                  <p className="text-lg font-bold text-emerald-600 pt-1">
                    ₹{selectedProduct.price.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                  {selectedProduct.description || selectedProduct.descp || 'No detailed description available.'}
                </p>
              </div>
            </div>

            {/* Technical Specs Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Electrical & Solar Parameters</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">System Wattage</span>
                  <span className="font-bold text-slate-900">{selectedProduct.wattage || selectedProduct.power || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Solar Panel</span>
                  <span className="font-bold text-slate-900">{selectedProduct.solarPanelWattage || 'High Efficiency PV'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Working Voltage</span>
                  <span className="font-bold text-slate-900">{selectedProduct.voltage || '12V DC / 24V DC'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Battery Storage</span>
                  <span className="font-bold text-slate-900">{selectedProduct.batteryCapacity || 'LiFePO4 Lithium'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Autonomy / Backup</span>
                  <span className="font-bold text-slate-900">{selectedProduct.backupTime || selectedProduct.time || '12-14 Hours'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Sunlight Charging</span>
                  <span className="font-bold text-slate-900">{selectedProduct.chargingTime || '6-8 Hours'}</span>
                </div>
              </div>
            </div>

            {/* Lighting & Mechanical Specs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Optical, Durability & Physical Specs</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lumens Output</span>
                  <span className="font-bold text-slate-900">{selectedProduct.lumes ? `${selectedProduct.lumes} lm` : 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Color Temp (CCT)</span>
                  <span className="font-bold text-slate-900">{selectedProduct.temperature || '6000K (Cool White)'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Ingress Protection</span>
                  <span className="font-bold text-slate-900">{selectedProduct.ipRating || 'IP65'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Housing Material</span>
                  <span className="font-bold text-slate-900">{selectedProduct.material || 'Die-cast Aluminum'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Dimensions</span>
                  <span className="font-bold text-slate-900">{selectedProduct.dimension || 'Standard'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Warranty Period</span>
                  <span className="font-bold text-emerald-600">{selectedProduct.guaranteeYear || '5 Years Replacement'}</span>
                </div>
              </div>
            </div>

            {/* Certifications & Applications */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700 block text-[10px] uppercase">Compliance & Certifications:</span>
                <span className="text-slate-600">{selectedProduct.certification || 'MNRE Approved, BIS, CE, RoHS, ISO 9001'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700 block text-[10px] uppercase">Recommended Applications:</span>
                <span className="text-slate-600">{selectedProduct.application || 'Streets, Highways, Industrial Yards, Residential, Rural Electrification'}</span>
              </div>
            </div>

            {/* Features Array */}
            {Array.isArray(selectedProduct.list) && selectedProduct.list.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Highlights</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.list.map((feat, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Datasheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add / Edit Solar Product */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProduct ? 'Edit Solar Product' : `Add to ${collection === 'main' ? 'Catalog' : collection}`}
                </h3>
                <p className="text-xs text-slate-500">Enter technical solar specifications and upload photo</p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingProduct(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              {/* Basic Section */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  1. Basic Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 100W All-in-One Solar Street Light"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>

                  {collection === 'main' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 capitalize"
                      >
                        <option value="solar">Solar (Panels / Kits)</option>
                        <option value="led">LED (Street / Flood)</option>
                        <option value="battery">Battery (LiFePO4 / Tubular)</option>
                        <option value="pole">Pole (Steel / Octagonal)</option>
                      </select>
                    </div>
                  )}

                  {collection === 'main' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Price (₹ INR)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                      System Wattage / Power
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50W, 100W, 250W"
                      value={wattage}
                      onChange={(e) => setWattage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Solar & Electrical Parameters */}
              {collection === 'main' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Solar & Electrical Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Solar Panel Spec
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 80W Mono-crystalline"
                        value={solarPanelWattage}
                        onChange={(e) => setSolarPanelWattage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Battery Capacity
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12.8V 36Ah LiFePO4"
                        value={batteryCapacity}
                        onChange={(e) => setBatteryCapacity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Working Voltage
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12V DC / 24V DC"
                        value={voltage}
                        onChange={(e) => setVoltage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Backup / Autonomy
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12-14 Hours (2-3 Days)"
                        value={backupTime}
                        onChange={(e) => setBackupTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Sunlight Charge Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 6-8 Hours"
                        value={chargingTime}
                        onChange={(e) => setChargingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Efficiency
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ≥21.5% Mono"
                        value={efficiency}
                        onChange={(e) => setEfficiency(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Physical & Lighting Specs */}
              {collection === 'main' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    3. Lighting, Physical & Compliance
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Lumens Output
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5000 lm"
                        value={lumes}
                        onChange={(e) => setLumes(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        IP Rating
                      </label>
                      <input
                        type="text"
                        placeholder="IP65"
                        value={ipRating}
                        onChange={(e) => setIpRating(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Warranty
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Years"
                        value={guaranteeYear}
                        onChange={(e) => setGuaranteeYear(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Material
                      </label>
                      <input
                        type="text"
                        placeholder="Die-cast Aluminum"
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Certifications
                      </label>
                      <input
                        type="text"
                        placeholder="MNRE Approved, BIS, CE, ISO 9001"
                        value={certification}
                        onChange={(e) => setCertification(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                        Applications
                      </label>
                      <input
                        type="text"
                        placeholder="Streets, Highways, Industrial, Farmhouse"
                        value={application}
                        onChange={(e) => setApplication(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Product Photo */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Product Image {!editingProduct && '*'}
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
                      {imageFile ? imageFile.name : editingProduct ? 'Change product image' : 'Choose image file'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Description & Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Technical Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive solar product overview and applications..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 resize-none"
                />
              </div>

              {collection === 'main' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Key Features (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto Dusk to Dawn, LiFePO4 Battery, PIR Motion Sensor, Weatherproof"
                    value={featuresList}
                    onChange={(e) => setFeaturesList(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Solar Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

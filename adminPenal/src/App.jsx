import React, { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import BookingsView from './views/BookingsView';
import InquiriesView from './views/InquiriesView';
import ProductsView from './views/ProductsView';
import ContactsView from './views/ContactsView';
import JobApplicationsView from './views/JobApplicationsView';
import TestimonialsView from './views/TestimonialsView';
import GalleryView from './views/GalleryView';
import ProgramsView from './views/ProgramsView';
import UsersView from './views/UsersView';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('skybet_admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('skybet_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [solarLights, setSolarLights] = useState([]);
  const [solarPanels, setSolarPanels] = useState([]);
  const [regionalProducts, setRegionalProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notify, setNotify] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (notify) {
      const timer = setTimeout(() => setNotify(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notify]);

  // Auth logout listener
  useEffect(() => {
    const handleLogout = () => {
      setToken(null);
      setAdminUser(null);
    };
    window.addEventListener('skybet_auth_logout', handleLogout);
    return () => window.removeEventListener('skybet_auth_logout', handleLogout);
  }, []);

  // Fetch all backend data
  const fetchData = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const [
        bookingsRes,
        inquiriesRes,
        productsRes,
        solarLightsRes,
        solarPanelsRes,
        regionalRes,
        contactsRes,
        jobsRes,
        testimonialsRes,
        galleryRes,
        programsRes,
        usersRes,
      ] = await Promise.all([
        api.getBookings().catch(() => ({ bookings: [] })),
        api.getInquiries().catch(() => ({ inquiries: [] })),
        api.getProducts().catch(() => []),
        api.getSolarLightProducts().catch(() => []),
        api.getSolarPanelProducts().catch(() => []),
        api.getRegionalProducts().catch(() => []),
        api.getContacts().catch(() => []),
        api.getJobApplications().catch(() => []),
        api.getTestimonials().catch(() => []),
        api.getGallery().catch(() => []),
        api.getPrograms().catch(() => []),
        api.getUsers().catch(() => []),
      ]);

      setBookings(bookingsRes.bookings || []);
      setInquiries(inquiriesRes.inquiries || []);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
      setSolarLights(Array.isArray(solarLightsRes) ? solarLightsRes : []);
      setSolarPanels(Array.isArray(solarPanelsRes) ? solarPanelsRes : []);
      setRegionalProducts(Array.isArray(regionalRes) ? regionalRes : []);
      setContacts(Array.isArray(contactsRes) ? contactsRes : []);
      setJobApplications(Array.isArray(jobsRes) ? jobsRes : []);
      setTestimonials(Array.isArray(testimonialsRes) ? testimonialsRes : []);
      setGallery(Array.isArray(galleryRes) ? galleryRes : []);
      setPrograms(Array.isArray(programsRes) ? programsRes : []);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setLoading(true);
      fetchData();
    }
  }, [token, fetchData]);

  const handleLoginSuccess = (userData) => {
    setToken(userData.token);
    setAdminUser(userData);
    setNotify({ type: 'success', message: 'Welcome back, Admin!' });
  };

  const handleLogout = () => {
    localStorage.removeItem('skybet_admin_token');
    localStorage.removeItem('skybet_admin_user');
    setToken(null);
    setAdminUser(null);
    setNotify({ type: 'info', message: 'Signed out successfully' });
  };

  if (!token) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const counts = {
    bookings: bookings.length,
    inquiries: inquiries.length,
    products: products.length,
    solarLights: solarLights.length,
    solarPanels: solarPanels.length,
    contacts: contacts.length,
    careers: jobApplications.length,
    testimonials: testimonials.length,
    gallery: gallery.length,
    programs: programs.length,
    users: users.length,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notification */}
      {notify && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white text-slate-800 animate-in slide-in-from-top-4 duration-300">
          {notify.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-xs font-semibold">{notify.message}</span>
          <button
            onClick={() => setNotify(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
        adminUser={adminUser}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          onRefresh={fetchData}
          refreshing={refreshing}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
              <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
              <p className="text-xs font-medium">Syncing with Skybet backend APIs...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  bookings={bookings}
                  inquiries={inquiries}
                  products={products}
                  contacts={contacts}
                  jobApplications={jobApplications}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'bookings' && (
                <BookingsView
                  bookings={bookings}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'inquiries' && (
                <InquiriesView
                  inquiries={inquiries}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'products' && (
                <ProductsView
                  products={products}
                  solarLights={solarLights}
                  solarPanels={solarPanels}
                  regionalProducts={regionalProducts}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'contacts' && (
                <ContactsView
                  contacts={contacts}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'careers' && (
                <JobApplicationsView
                  applications={jobApplications}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'testimonials' && (
                <TestimonialsView
                  testimonials={testimonials}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'gallery' && (
                <GalleryView
                  gallery={gallery}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'programs' && (
                <ProgramsView
                  programs={programs}
                  onReload={fetchData}
                  setNotify={setNotify}
                />
              )}

              {activeTab === 'users' && (
                <UsersView
                  users={users}
                  onReload={fetchData}
                  setNotify={setNotify}
                  currentAdmin={adminUser}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

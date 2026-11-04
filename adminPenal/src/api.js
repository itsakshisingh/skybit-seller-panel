export const API_BASE = 'http://backend.skybetsolarindustries.com';

// Helper for HTTP requests with automatic Authorization Bearer token injection and auto-refresh
async function request(endpoint, options = {}) {
  let token = localStorage.getItem('skybet_admin_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If not FormData, set application/json
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // If 401 Unauthorized, attempt refresh token auto-recovery once
  if (response.status === 401 && !options._retry && endpoint !== '/api/auth/login' && endpoint !== '/api/auth/refresh-token') {
    const refreshToken = localStorage.getItem('skybet_admin_refresh_token');

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newToken = refreshData.accessToken || refreshData.token;
          const newRefreshToken = refreshData.refreshToken;

          localStorage.setItem('skybet_admin_token', newToken);
          if (newRefreshToken) {
            localStorage.setItem('skybet_admin_refresh_token', newRefreshToken);
          }

          // Retry the original request with the new access token
          headers['Authorization'] = `Bearer ${newToken}`;
          response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            _retry: true,
            headers,
          });
        }
      } catch (err) {
        console.error('Auto-refresh token failed:', err);
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('skybet_admin_token');
      localStorage.removeItem('skybet_admin_refresh_token');
      localStorage.removeItem('skybet_admin_user');
      window.dispatchEvent(new Event('skybet_auth_logout'));
    }
    throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

// Check if string is an emoji or text icon (like '🌞', '💡', '⚡')
export const isEmoji = (str) => {
  if (!str) return false;
  const trimmed = str.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/uploads') ||
    trimmed.startsWith('uploads/') ||
    trimmed.includes('.jpg') ||
    trimmed.includes('.jpeg') ||
    trimmed.includes('.png') ||
    trimmed.includes('.webp') ||
    trimmed.includes('.svg') ||
    trimmed.includes('.gif')
  ) {
    return false;
  }
  // Short strings without file extensions are emojis or icon symbols
  return trimmed.length <= 8;
};

export const api = {
  // Auth & Users
  login: async (email, password) => {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  refreshToken: async (refreshToken) => {
    return request('/api/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
  logout: async (userId, refreshToken) => {
    return request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ userId, refreshToken }),
    });
  },
  getUsers: async () => {
    return request('/api/auth/users');
  },
  deleteUser: async (id) => {
    return request(`/api/auth/users/${id}`, { method: 'DELETE' });
  },

  // Product Bookings
  getBookings: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/product-bookings${query ? `?${query}` : ''}`);
  },
  updateBookingStatus: async (id, status, paymentStatus) => {
    return request(`/api/product-bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentStatus }),
    });
  },
  deleteBooking: async (id) => {
    return request(`/api/product-bookings/${id}`, { method: 'DELETE' });
  },

  // Product Inquiries
  getInquiries: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/product-inquiries${query ? `?${query}` : ''}`);
  },
  updateInquiryStatus: async (id, status) => {
    return request(`/api/product-inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  deleteInquiry: async (id) => {
    return request(`/api/product-inquiries/${id}`, { method: 'DELETE' });
  },

  // Main Products
  getProducts: async () => {
    return request('/api/products');
  },
  getProductById: async (id) => {
    return request(`/api/products/${id}`);
  },
  createProduct: async (formData) => {
    return request('/api/products', { method: 'POST', body: formData });
  },
  updateProduct: async (id, formData) => {
    return request(`/api/products/${id}`, { method: 'PUT', body: formData });
  },
  deleteProduct: async (id) => {
    return request(`/api/products/${id}`, { method: 'DELETE' });
  },

  // Solar Light Products
  getSolarLightProducts: async () => {
    return request('/api/solarlightproduct');
  },
  createSolarLightProduct: async (formData) => {
    return request('/api/solarlightproduct', { method: 'POST', body: formData });
  },
  deleteSolarLightProduct: async (id) => {
    return request(`/api/solarlightproduct/${id}`, { method: 'DELETE' });
  },

  // Solar Panel Products
  getSolarPanelProducts: async () => {
    return request('/api/solarpanelproduct');
  },
  createSolarPanelProduct: async (formData) => {
    return request('/api/solarpanelproduct', { method: 'POST', body: formData });
  },
  deleteSolarPanelProduct: async (id) => {
    return request(`/api/solarpanelproduct/${id}`, { method: 'DELETE' });
  },

  // Regional Products
  getRegionalProducts: async () => {
    return request('/api/regionalproduct');
  },
  createRegionalProduct: async (formData) => {
    return request('/api/regionalproduct', { method: 'POST', body: formData });
  },
  deleteRegionalProduct: async (id) => {
    return request(`/api/regionalproduct/${id}`, { method: 'DELETE' });
  },

  // Contact Leads
  getContacts: async () => {
    return request('/api/contact');
  },
  deleteContact: async (id) => {
    return request(`/api/contact/${id}`, { method: 'DELETE' });
  },

  // Job Applications
  getJobApplications: async () => {
    return request('/api/jobapplication');
  },
  deleteJobApplication: async (id) => {
    return request(`/api/jobapplication/${id}`, { method: 'DELETE' });
  },

  // Testimonials
  getTestimonials: async () => {
    return request('/api/testimonials');
  },
  createTestimonial: async (formData) => {
    return request('/api/testimonials', { method: 'POST', body: formData });
  },
  deleteTestimonial: async (id) => {
    return request(`/api/testimonials/${id}`, { method: 'DELETE' });
  },

  // Gallery
  getGallery: async () => {
    return request('/api/companygallery');
  },
  createGalleryItem: async (formData) => {
    return request('/api/companygallery', { method: 'POST', body: formData });
  },
  deleteGalleryItem: async (id) => {
    return request(`/api/companygallery/${id}`, { method: 'DELETE' });
  },

  // Programs & Schemes
  getPrograms: async () => {
    return request('/api/program');
  },
  createProgram: async (formData) => {
    return request('/api/program', { method: 'POST', body: formData });
  },
  deleteProgram: async (id) => {
    return request(`/api/program/${id}`, { method: 'DELETE' });
  },

  // Cart APIs
  getCart: async (userId) => {
    return request(`/api/cart${userId ? `?userId=${userId}` : ''}`);
  },
  addToCart: async (productId, quantity = 1, userId) => {
    return request('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, userId }),
    });
  },
  updateCartItem: async (productId, quantity, userId) => {
    return request('/api/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity, userId }),
    });
  },
  removeFromCart: async (productId, userId) => {
    return request(`/api/cart/remove/${productId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },
  clearCart: async (userId) => {
    return request('/api/cart/clear', {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  // Wishlist APIs
  getWishlist: async (userId) => {
    return request(`/api/wishlist${userId ? `?userId=${userId}` : ''}`);
  },
  addToWishlist: async (productId, userId) => {
    return request('/api/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId, userId }),
    });
  },
  toggleWishlist: async (productId, userId) => {
    return request('/api/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId, userId }),
    });
  },
  removeFromWishlist: async (productId, userId) => {
    return request(`/api/wishlist/remove/${productId}`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },
  clearWishlist: async (userId) => {
    return request('/api/wishlist/clear', {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },

  // Image helper
  getImageUrl: (imagePath) => {
    if (!imagePath) return '';
    if (isEmoji(imagePath)) return '';
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_BASE}${cleanPath}`;
  },
};

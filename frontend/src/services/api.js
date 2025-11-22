// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(!options.skipAuth),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
    skipAuth: true,
  }),

  login: (email, password) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  }),

  forgotPassword: (email) => apiCall('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuth: true,
  }),

  resetPassword: (email, otp, newPassword) => apiCall('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword }),
    skipAuth: true,
  }),

  verifyOTP: (email, otp) => apiCall('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
    skipAuth: true,
  }),

  getMe: () => apiCall('/auth/me'),

  updateProfile: (userData) => apiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/products/${id}`),

  create: (productData) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  update: (id, productData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),

  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),

  getLowStock: () => apiCall('/products/low-stock'),
};

// Warehouses API
export const warehousesAPI = {
  getAll: () => apiCall('/warehouses'),

  getById: (id) => apiCall(`/warehouses/${id}`),

  create: (warehouseData) => apiCall('/warehouses', {
    method: 'POST',
    body: JSON.stringify(warehouseData),
  }),

  update: (id, warehouseData) => apiCall(`/warehouses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(warehouseData),
  }),

  delete: (id) => apiCall(`/warehouses/${id}`, {
    method: 'DELETE',
  }),
};

// Locations API
export const locationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/locations${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/locations/${id}`),

  create: (locationData) => apiCall('/locations', {
    method: 'POST',
    body: JSON.stringify(locationData),
  }),

  update: (id, locationData) => apiCall(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(locationData),
  }),

  delete: (id) => apiCall(`/locations/${id}`, {
    method: 'DELETE',
  }),
};

// Stock API
export const stockAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/stock${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/stock/${id}`),

  createOrUpdate: (stockData) => apiCall('/stock', {
    method: 'POST',
    body: JSON.stringify(stockData),
  }),

  update: (id, stockData) => apiCall(`/stock/${id}`, {
    method: 'PUT',
    body: JSON.stringify(stockData),
  }),

  getSummary: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/stock/summary${queryString ? `?${queryString}` : ''}`);
  },
};

// Receipts API
export const receiptsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/receipts${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/receipts/${id}`),

  create: (receiptData) => apiCall('/receipts', {
    method: 'POST',
    body: JSON.stringify(receiptData),
  }),

  update: (id, receiptData) => apiCall(`/receipts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(receiptData),
  }),

  validate: (id) => apiCall(`/receipts/${id}/validate`, {
    method: 'PUT',
  }),

  delete: (id) => apiCall(`/receipts/${id}`, {
    method: 'DELETE',
  }),
};

// Deliveries API
export const deliveriesAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/deliveries${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/deliveries/${id}`),

  create: (deliveryData) => apiCall('/deliveries', {
    method: 'POST',
    body: JSON.stringify(deliveryData),
  }),

  update: (id, deliveryData) => apiCall(`/deliveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deliveryData),
  }),

  updatePicking: (id, items) => apiCall(`/deliveries/${id}/pick`, {
    method: 'PUT',
    body: JSON.stringify({ items }),
  }),

  updatePacking: (id, items) => apiCall(`/deliveries/${id}/pack`, {
    method: 'PUT',
    body: JSON.stringify({ items }),
  }),

  complete: (id, warehouse, location) => apiCall(`/deliveries/${id}/complete`, {
    method: 'PUT',
    body: JSON.stringify({ warehouse, location }),
  }),

  delete: (id) => apiCall(`/deliveries/${id}`, {
    method: 'DELETE',
  }),
};

// Transfers API
export const transfersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/transfers${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/transfers/${id}`),

  create: (transferData) => apiCall('/transfers', {
    method: 'POST',
    body: JSON.stringify(transferData),
  }),

  update: (id, transferData) => apiCall(`/transfers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transferData),
  }),

  complete: (id) => apiCall(`/transfers/${id}/complete`, {
    method: 'PUT',
  }),

  delete: (id) => apiCall(`/transfers/${id}`, {
    method: 'DELETE',
  }),
};

// Adjustments API
export const adjustmentsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/adjustments${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/adjustments/${id}`),

  create: (adjustmentData) => apiCall('/adjustments', {
    method: 'POST',
    body: JSON.stringify(adjustmentData),
  }),

  update: (id, adjustmentData) => apiCall(`/adjustments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(adjustmentData),
  }),

  approve: (id) => apiCall(`/adjustments/${id}/approve`, {
    method: 'PUT',
  }),

  reject: (id) => apiCall(`/adjustments/${id}/reject`, {
    method: 'PUT',
  }),

  delete: (id) => apiCall(`/adjustments/${id}`, {
    method: 'DELETE',
  }),
};

// Ledger API
export const ledgerAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/ledger${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) => apiCall(`/ledger/${id}`),

  getByProduct: (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/ledger/product/${productId}${queryString ? `?${queryString}` : ''}`);
  },

  getByType: (type, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/ledger/type/${type}${queryString ? `?${queryString}` : ''}`);
  },
};

// CSV Export API - Returns URLs for download
export const exportAPI = {
  exportStock: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const token = getAuthToken();
    return `${API_BASE_URL}/export/stock${queryString ? `?${queryString}` : ''}${token ? `&token=${token}` : ''}`;
  },

  exportProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const token = getAuthToken();
    return `${API_BASE_URL}/export/products${queryString ? `?${queryString}` : ''}${token ? `&token=${token}` : ''}`;
  },
};

export default {
  auth: authAPI,
  products: productsAPI,
  warehouses: warehousesAPI,
  locations: locationsAPI,
  stock: stockAPI,
  receipts: receiptsAPI,
  deliveries: deliveriesAPI,
  transfers: transfersAPI,
  adjustments: adjustmentsAPI,
  ledger: ledgerAPI,
  export: exportAPI,
};


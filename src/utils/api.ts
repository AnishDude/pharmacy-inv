import axios from 'axios'

// Base API URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('lipms-auth-storage')
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage)
        const token = state?.token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear auth and redirect to login
      localStorage.removeItem('lipms-auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login-json', { email, password }),
  register: (data: { email: string; password: string; name: string; role?: string }) => 
    api.post('/auth/register', data),
  me: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users/'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users/', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

// Medicines API
export const medicinesAPI = {
  getAll: (params?: { skip?: number; limit?: number; search?: string; category?: string }) => 
    api.get('/medicines/', { params }),
  getById: (id: string) => api.get(`/medicines/${id}`),
  create: (data: any) => api.post('/medicines/', data),
  update: (id: string, data: any) => api.put(`/medicines/${id}`, data),
  delete: (id: string) => api.delete(`/medicines/${id}`),
  updateStock: (id: string, quantity: number, operation: 'add' | 'subtract') => 
    api.patch(`/medicines/${id}/stock`, { medicine_id: parseInt(id), quantity, operation }),
  getLowStock: () => api.get('/medicines/low-stock/'),
}

// Orders API
export const ordersAPI = {
  getAll: (params?: { skip?: number; limit?: number; status?: string }) => 
    api.get('/orders/', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders/', data),
  updateStatus: (id: string, status: string) => 
    api.patch(`/orders/${id}/status`, { status }),
}

// Sales API
export const salesAPI = {
  getAll: (params?: { skip?: number; limit?: number }) => 
    api.get('/sales/', { params }),
  getById: (id: string) => api.get(`/sales/${id}`),
  create: (data: any) => api.post('/sales/', data),
}

export default api

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'pharmacist' | 'staff'
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  updateProfile: (updates: Partial<User>) => void
}

// Mock authentication - replace with real API calls
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation - in real app, this would be an API call
  if (email === 'admin@pharmacy.com' && password === 'admin123') {
    return {
      id: '1',
      email: 'admin@pharmacy.com',
      name: 'Admin User',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    }
  } else if (email === 'pharmacist@pharmacy.com' && password === 'pharma123') {
    return {
      id: '2',
      email: 'pharmacist@pharmacy.com',
      name: 'Dr. Sarah Johnson',
      role: 'pharmacist',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    }
  } else if (email === 'staff@pharmacy.com' && password === 'staff123') {
    return {
      id: '3',
      email: 'staff@pharmacy.com',
      name: 'John Smith',
      role: 'staff',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  } else {
    throw new Error('Invalid email or password')
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const user = await mockLogin(email, password)
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      checkAuth: () => {
        const { user } = get()
        if (user) {
          set({ isAuthenticated: true })
        }
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ 
            user: { ...user, ...updates }
          })
        }
      }
    }),
    {
      name: 'lipms-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

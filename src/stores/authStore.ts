import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../utils/api'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'pharmacist' | 'staff'
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(email, password)
          const { access_token, user } = response.data
          
          // Map backend user data to frontend User interface
          const mappedUser: User = {
            id: user.id.toString(),
            email: user.email,
            name: user.name || user.email,
            role: user.role || 'staff',
            avatar: user.avatar_url
          }
          
          set({ 
            user: mappedUser,
            token: access_token,
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ isLoading: false })
          const errorMessage = error.response?.data?.detail || 'Invalid email or password'
          throw new Error(errorMessage)
        }
      },

      logout: () => {
        set({ 
          user: null,
          token: null,
          isAuthenticated: false 
        })
      },

      checkAuth: async () => {
        const { token } = get()
        if (token) {
          try {
            const response = await authAPI.me()
            const user = response.data
            
            // Map backend user data to frontend User interface
            const mappedUser: User = {
              id: user.id.toString(),
              email: user.email,
              name: user.name || user.email,
              role: user.role || 'staff',
              avatar: user.avatar_url
            }
            
            set({ 
              user: mappedUser,
              isAuthenticated: true 
            })
          } catch (error) {
            // Token is invalid, clear auth
            set({ 
              user: null,
              token: null,
              isAuthenticated: false 
            })
          }
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          try {
            // Update on backend
            const response = await authAPI.updateProfile(updates)
            const updatedUser: User = {
              id: response.data.id.toString(),
              email: response.data.email,
              name: response.data.name || response.data.email,
              role: response.data.role || 'staff',
              avatar: response.data.avatar_url
            }
            
            set({ user: updatedUser })
          } catch (error) {
            console.error('Failed to update profile:', error)
            throw error
          }
        }
      }
    }),
    {
      name: 'lipms-auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Customer {
  id: string
  email: string
  companyName: string
  contactPerson: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  licenseNumber?: string
  isVerified: boolean
  registrationDate: string
  lastLogin?: string
}

export interface CustomerAuthState {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
  register: (customerData: Omit<Customer, 'id' | 'isVerified' | 'registrationDate'>) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
  updateProfile: (updates: Partial<Customer>) => void
}

// Mock registration and login - replace with real API calls
const mockRegister = async (customerData: Omit<Customer, 'id' | 'isVerified' | 'registrationDate'>): Promise<Customer> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock validation - in real app, this would be an API call
  const newCustomer: Customer = {
    id: Math.random().toString(36).substr(2, 9),
    ...customerData,
    isVerified: false, // New registrations need verification
    registrationDate: new Date().toISOString(),
  }
  
  // Store in localStorage for demo purposes (in real app, this would be handled by backend)
  const existingCustomers = JSON.parse(localStorage.getItem('lipms-customers') || '[]')
  existingCustomers.push(newCustomer)
  localStorage.setItem('lipms-customers', JSON.stringify(existingCustomers))
  
  return newCustomer
}

const mockLogin = async (email: string, password: string): Promise<Customer> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Get customers from localStorage (in real app, this would be an API call)
  const customers: Customer[] = JSON.parse(localStorage.getItem('lipms-customers') || '[]')
  const customer = customers.find(c => c.email === email)
  
  if (!customer) {
    throw new Error('Customer not found. Please register first.')
  }
  
  // For demo purposes, any password works (in real app, verify password hash)
  if (password.length < 6) {
    throw new Error('Invalid password')
  }
  
  // Update last login
  customer.lastLogin = new Date().toISOString()
  const updatedCustomers = customers.map(c => 
    c.id === customer.id ? customer : c
  )
  localStorage.setItem('lipms-customers', JSON.stringify(updatedCustomers))
  
  return customer
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      customer: null,
      isAuthenticated: false,
      isLoading: false,

      register: async (customerData) => {
        set({ isLoading: true })
        try {
          const customer = await mockRegister(customerData)
          set({ 
            customer, 
            isAuthenticated: true, 
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const customer = await mockLogin(email, password)
          set({ 
            customer, 
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
          customer: null, 
          isAuthenticated: false 
        })
      },

      checkAuth: () => {
        const { customer } = get()
        if (customer) {
          set({ isAuthenticated: true })
        }
      },

      updateProfile: (updates: Partial<Customer>) => {
        const { customer } = get()
        if (customer) {
          const updatedCustomer = { ...customer, ...updates }
          set({ customer: updatedCustomer })
          
          // Update in localStorage (in real app, this would be an API call)
          const customers: Customer[] = JSON.parse(localStorage.getItem('lipms-customers') || '[]')
          const updatedCustomers = customers.map(c => 
            c.id === customer.id ? updatedCustomer : c
          )
          localStorage.setItem('lipms-customers', JSON.stringify(updatedCustomers))
        }
      }
    }),
    {
      name: 'lipms-customer-auth-storage',
      partialize: (state) => ({ 
        customer: state.customer, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

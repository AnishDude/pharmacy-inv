import { create } from 'zustand'
import { salesAPI } from '../utils/api'
import toast from 'react-hot-toast'

export interface CartItem {
  medicineId: string
  medicineName: string
  unitPrice: number
  quantity: number
  discount: number
  total: number
}

export interface Sale {
  id: string
  saleNumber: string
  customerName?: string
  totalAmount: number
  paymentMethod: string
  notes?: string
  createdAt: string
  items: CartItem[]
}

export interface SaleState {
  cart: CartItem[]
  sales: Sale[]
  isLoading: boolean
  
  // Cart actions
  addToCart: (medicine: { id: string; name: string; price: number }) => void
  updateCartItem: (medicineId: string, quantity: number, discount?: number) => void
  removeFromCart: (medicineId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  
  // Sale actions
  completeSale: (customerName?: string, paymentMethod?: string, notes?: string) => Promise<void>
  fetchSales: () => Promise<void>
  getSaleById: (id: string) => Sale | undefined
}

export const useSaleStore = create<SaleState>((set, get) => ({
  cart: [],
  sales: [],
  isLoading: false,

  addToCart: (medicine) => {
    const { cart } = get()
    const existingItem = cart.find(item => item.medicineId === medicine.id)
    
    if (existingItem) {
      // Increase quantity if already in cart
      set({
        cart: cart.map(item =>
          item.medicineId === medicine.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice - item.discount }
            : item
        )
      })
    } else {
      // Add new item
      set({
        cart: [...cart, {
          medicineId: medicine.id,
          medicineName: medicine.name,
          unitPrice: medicine.price,
          quantity: 1,
          discount: 0,
          total: medicine.price
        }]
      })
    }
  },

  updateCartItem: (medicineId, quantity, discount = 0) => {
    const { cart } = get()
    set({
      cart: cart.map(item =>
        item.medicineId === medicineId
          ? {
              ...item,
              quantity,
              discount,
              total: (quantity * item.unitPrice) - discount
            }
          : item
      )
    })
  },

  removeFromCart: (medicineId) => {
    const { cart } = get()
    set({ cart: cart.filter(item => item.medicineId !== medicineId) })
  },

  clearCart: () => {
    set({ cart: [] })
  },

  getCartTotal: () => {
    const { cart } = get()
    return cart.reduce((total, item) => total + item.total, 0)
  },

  completeSale: async (customerName, paymentMethod = 'cash', notes) => {
    const { cart, clearCart } = get()
    
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }

    set({ isLoading: true })
    try {
      const saleData = {
        customer_name: customerName,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          medicine_id: parseInt(item.medicineId),
          quantity: item.quantity,
          unit_price: item.unitPrice,
          discount: item.discount
        })),
        notes
      }

      const response = await salesAPI.create(saleData)
      
      toast.success(`Sale completed! Sale #${response.data.sale_number}`)
      
      // Add to sales history
      const newSale: Sale = {
        id: response.data.id.toString(),
        saleNumber: response.data.sale_number,
        customerName: response.data.customer_name,
        totalAmount: response.data.total_amount,
        paymentMethod: response.data.payment_method,
        notes: response.data.notes,
        createdAt: response.data.created_at,
        items: cart
      }
      
      set(state => ({
        sales: [newSale, ...state.sales],
        isLoading: false
      }))
      
      // Clear cart
      clearCart()
    } catch (error: any) {
      set({ isLoading: false })
      const errorMessage = error.response?.data?.detail || 'Failed to complete sale'
      toast.error(errorMessage)
      throw error
    }
  },

  fetchSales: async () => {
    set({ isLoading: true })
    try {
      const response = await salesAPI.getAll()
      const sales = response.data.map((sale: any) => ({
        id: sale.id.toString(),
        saleNumber: sale.sale_number,
        customerName: sale.customer_name,
        totalAmount: sale.total_amount,
        paymentMethod: sale.payment_method,
        notes: sale.notes,
        createdAt: sale.created_at,
        items: sale.items.map((item: any) => ({
          medicineId: item.medicine_id.toString(),
          medicineName: item.medicine_name,
          unitPrice: item.unit_price,
          quantity: item.quantity,
          discount: item.discount,
          total: item.total_price
        }))
      }))
      
      set({ sales, isLoading: false })
    } catch (error) {
      console.error('Failed to fetch sales:', error)
      set({ isLoading: false })
    }
  },

  getSaleById: (id) => {
    const { sales } = get()
    return sales.find(sale => sale.id === id)
  }
}))


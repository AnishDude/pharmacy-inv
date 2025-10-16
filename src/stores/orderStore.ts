import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useNotificationStore } from './notificationStore'
import { ordersAPI } from '../utils/api'

export interface OrderItem {
  medicineId: string
  medicineName: string
  price: number
  quantity: number
  total: number
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  companyName: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'dispatched' | 'delivered' | 'cancelled'
  orderDate: string
  dispatchedDate?: string
  deliveredDate?: string
  notes?: string
  trackingNumber?: string
}

export interface OrderState {
  orders: Order[]
  isLoading: boolean
  
  // Actions
  fetchOrders: () => Promise<void>
  createOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => Promise<void>
  getOrdersByStatus: (status: Order['status']) => Order[]
  getOrdersByCustomer: (customerId: string) => Order[]
  getOrderById: (orderId: string) => Order | undefined
  getPendingOrders: () => Order[]
  dispatchOrder: (orderId: string, trackingNumber?: string) => Promise<void>
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

      fetchOrders: async () => {
        set({ isLoading: true })
        try {
          const response = await ordersAPI.getAll()
          const orders = response.data.map((order: any) => ({
            id: order.id.toString(),
            customerId: order.customer_id?.toString() || '',
            customerName: order.customer?.name || '',
            customerEmail: order.customer?.email || '',
            companyName: order.shipping_address || '',
            items: (order.items || []).map((item: any) => ({
              medicineId: item.medicine_id.toString(),
              medicineName: item.medicine_name,
              price: item.unit_price,
              quantity: item.quantity,
              total: item.total_price
            })),
            totalAmount: parseFloat(order.total_amount),
            status: order.status,
            orderDate: order.created_at,
            dispatchedDate: order.dispatched_at,
            deliveredDate: order.delivered_at,
            notes: order.notes,
            trackingNumber: order.tracking_number
          }))
          set({ orders, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch orders:', error)
          set({ isLoading: false })
        }
      },

      createOrder: async (orderData) => {
        try {
          const response = await ordersAPI.create({
            shipping_address: orderData.companyName,
            items: orderData.items.map(item => ({
              medicine_id: parseInt(item.medicineId),
              quantity: item.quantity
            })),
            notes: orderData.notes
          })
          
          const newOrder: Order = {
            id: response.data.id.toString(),
            customerId: orderData.customerId,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            companyName: orderData.companyName,
            items: orderData.items,
            totalAmount: response.data.total_amount,
            status: response.data.status || 'pending',
            orderDate: response.data.created_at || new Date().toISOString(),
            notes: orderData.notes
          }
          
          set(state => ({
            orders: [...state.orders, newOrder]
          }))

          // Add activity for order placed
          import('./activityStore').then(({ useActivityStore }) => {
            const activityStore = useActivityStore.getState()
            activityStore.addActivity({
              type: 'order_placed',
              message: `New order #${newOrder.id} placed by ${orderData.companyName} - $${newOrder.totalAmount}`,
              orderId: newOrder.id,
              customerId: orderData.customerId,
              quantity: orderData.items.reduce((sum, item) => sum + item.quantity, 0),
              metadata: {
                totalAmount: newOrder.totalAmount,
                itemCount: orderData.items.length,
                companyName: orderData.companyName
              }
            })
          })

          // Create notification for customer (order placed)
          const notificationStore = useNotificationStore.getState()
          notificationStore.addNotification({
            customerId: orderData.customerId,
            orderId: newOrder.id,
            type: 'order_placed',
            title: 'Order Placed Successfully',
            message: `Your order #${newOrder.id} has been placed and is being processed.`
          })

          // Create notification for admin (new order)
          notificationStore.addNotification({
            customerId: 'admin', // Special ID for admin notifications
            orderId: newOrder.id,
            type: 'order_placed',
            title: 'New Order Received',
            message: `New order #${newOrder.id} from ${orderData.companyName} (${orderData.customerName}) - $${newOrder.totalAmount}`
          })
        } catch (error) {
          console.error('Failed to create order:', error)
          throw error
        }
      },

      updateOrderStatus: async (orderId, status, trackingNumber) => {
        try {
          await ordersAPI.updateStatus(orderId, status)
          
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId 
                ? {
                    ...order,
                    status,
                    ...(status === 'dispatched' && { dispatchedDate: new Date().toISOString() }),
                    ...(status === 'delivered' && { deliveredDate: new Date().toISOString() }),
                    ...(trackingNumber && { trackingNumber })
                  }
                : order
            )
          }))
        } catch (error) {
          console.error('Failed to update order status:', error)
          throw error
        }
      },

      getOrdersByStatus: (status) => {
        const { orders } = get()
        return orders.filter(order => order.status === status)
      },

      getOrdersByCustomer: (customerId) => {
        const { orders } = get()
        return orders.filter(order => order.customerId === customerId)
      },

      getOrderById: (orderId) => {
        const { orders } = get()
        return orders.find(order => order.id === orderId)
      },

      getPendingOrders: () => {
        const { orders } = get()
        return orders.filter(order => order.status === 'pending')
      },

      dispatchOrder: async (orderId, trackingNumber) => {
        const { updateOrderStatus, getOrderById } = get()
        await updateOrderStatus(orderId, 'dispatched', trackingNumber)
        
        // Create notification for order dispatched
        const order = getOrderById(orderId)
        if (order) {
          const notificationStore = useNotificationStore.getState()
          
          // Customer notification
          notificationStore.addNotification({
            customerId: order.customerId,
            orderId: order.id,
            type: 'order_dispatched',
            title: 'Order Dispatched',
            message: `Your order #${order.id} has been dispatched${trackingNumber ? ` with tracking number: ${trackingNumber}` : ''}. You should receive it soon!`
          })

          // Admin notification
          notificationStore.addNotification({
            customerId: 'admin',
            orderId: order.id,
            type: 'order_dispatched',
            title: 'Order Dispatched',
            message: `Order #${order.id} has been dispatched to ${order.companyName}${trackingNumber ? ` with tracking number: ${trackingNumber}` : ''}`
          })

          // Add activity for order dispatched
          import('./activityStore').then(({ useActivityStore }) => {
            const activityStore = useActivityStore.getState()
            activityStore.addActivity({
              type: 'order_dispatched',
              message: `Order #${order.id} dispatched to ${order.companyName}${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}`,
              orderId: order.id,
              customerId: order.customerId,
              metadata: {
                trackingNumber,
                companyName: order.companyName,
                totalAmount: order.totalAmount
              }
            })
          })
        }
      }
    }),
    {
      name: 'lipms-orders-storage',
      partialize: (state) => ({ orders: state.orders }),
    }
  )
)

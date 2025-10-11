import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useNotificationStore } from './notificationStore'

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
  createOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => void
  updateOrderStatus: (orderId: string, status: Order['status'], trackingNumber?: string) => void
  getOrdersByStatus: (status: Order['status']) => Order[]
  getOrdersByCustomer: (customerId: string) => Order[]
  getOrderById: (orderId: string) => Order | undefined
  getPendingOrders: () => Order[]
  dispatchOrder: (orderId: string, trackingNumber?: string) => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,

      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          orderDate: new Date().toISOString(),
          status: 'pending'
        }
        
        set(state => ({
          orders: [...state.orders, newOrder]
        }))

        // Reduce stock for each item in the order
        // Note: In a real app, this would be an API call
        // For now, we'll import dynamically to avoid circular dependency
        import('./inventoryStore').then(({ useInventoryStore }) => {
          const inventoryStore = useInventoryStore.getState()
          orderData.items.forEach(item => {
            inventoryStore.reduceStock(item.medicineId, item.quantity)
          })
        })

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
      },

      updateOrderStatus: (orderId, status, trackingNumber) => {
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

      dispatchOrder: (orderId, trackingNumber) => {
        const { updateOrderStatus, getOrderById } = get()
        updateOrderStatus(orderId, 'dispatched', trackingNumber)
        
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
        }
      }
    }),
    {
      name: 'lipms-orders-storage',
      partialize: (state) => ({ orders: state.orders }),
    }
  )
)

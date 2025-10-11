import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  customerId: string
  orderId: string
  type: 'order_placed' | 'order_dispatched' | 'order_delivered' | 'order_cancelled'
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface NotificationState {
  notifications: Notification[]
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: (customerId: string) => void
  getUnreadCount: (customerId: string) => number
  getNotificationsByCustomer: (customerId: string) => Notification[]
  clearNotifications: (customerId: string) => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          read: false,
          createdAt: new Date().toISOString()
        }
        
        set(state => ({
          notifications: [...state.notifications, newNotification]
        }))
      },

      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        }))
      },

      markAllAsRead: (customerId) => {
        set(state => ({
          notifications: state.notifications.map(notification =>
            notification.customerId === customerId && !notification.read
              ? { ...notification, read: true }
              : notification
          )
        }))
      },

      getUnreadCount: (customerId) => {
        const { notifications } = get()
        return notifications.filter(
          notification => notification.customerId === customerId && !notification.read
        ).length
      },

      getNotificationsByCustomer: (customerId) => {
        const { notifications } = get()
        return notifications
          .filter(notification => notification.customerId === customerId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      clearNotifications: (customerId) => {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.customerId !== customerId
          )
        }))
      }
    }),
    {
      name: 'lipms-notifications-storage',
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
)

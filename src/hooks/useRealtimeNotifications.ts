import { useEffect, useRef } from 'react'
import { useNotificationStore } from '@/stores/notificationStore'
import { useOrderStore } from '@/stores/orderStore'
import toast from 'react-hot-toast'

/**
 * Hook to enable real-time notifications across tabs/windows
 * Listens to localStorage changes and shows browser notifications
 */
export function useRealtimeNotifications(enabled: boolean = true) {
  const previousOrderCount = useRef<number>(0)
  const previousNotificationCount = useRef<number>(0)
  const hasInitialized = useRef<boolean>(false)
  
  const orders = useOrderStore(state => state.orders)
  const adminNotifications = useNotificationStore(
    state => state.getNotificationsByCustomer('admin')
  )
  const getUnreadCount = useNotificationStore(state => state.getUnreadCount)

  // Request browser notification permission
  useEffect(() => {
    if (enabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [enabled])

  // Listen for localStorage changes (cross-tab sync)
  useEffect(() => {
    if (!enabled) return

    const handleStorageChange = (e: StorageEvent) => {
      // Listen for order and notification updates from other tabs
      if (e.key === 'lipms-orders-storage' || e.key === 'lipms-notifications-storage') {
        // Force re-render by triggering store updates
        window.location.reload()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [enabled])

  // Monitor for new orders and notifications
  useEffect(() => {
    if (!enabled) return

    // Initialize on first render
    if (!hasInitialized.current) {
      previousOrderCount.current = orders.length
      previousNotificationCount.current = adminNotifications.length
      hasInitialized.current = true
      return
    }

    // Check for new orders
    if (orders.length > previousOrderCount.current) {
      const newOrdersCount = orders.length - previousOrderCount.current
      const latestOrder = orders[orders.length - 1]
      
      // Show toast notification
      toast.success(
        `🎉 ${newOrdersCount} New Order${newOrdersCount > 1 ? 's' : ''} Received!`,
        {
          duration: 5000,
          position: 'top-right',
        }
      )

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order Received! 🎉', {
          body: `Order #${latestOrder.id} from ${latestOrder.companyName} - $${latestOrder.totalAmount}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: latestOrder.id,
          requireInteraction: false,
        })
      }

      // Play notification sound
      playNotificationSound()
      
      previousOrderCount.current = orders.length
    }

    // Check for new notifications
    if (adminNotifications.length > previousNotificationCount.current) {
      previousNotificationCount.current = adminNotifications.length
    }
  }, [orders, adminNotifications, enabled])

  // Auto-refresh notification badge
  useEffect(() => {
    if (!enabled) return

    const interval = setInterval(() => {
      // This will trigger a re-render to update unread count
      const unreadCount = getUnreadCount('admin')
      if (unreadCount > 0 && document.hidden) {
        // Update browser tab title to show unread count
        document.title = `(${unreadCount}) LIPMS - Admin Dashboard`
      } else if (!document.hidden) {
        document.title = 'LIPMS - Admin Dashboard'
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [enabled, getUnreadCount])

  return {
    unreadCount: getUnreadCount('admin'),
    totalOrders: orders.length
  }
}

// Play notification sound
function playNotificationSound() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('Could not play notification sound:', error)
  }
}


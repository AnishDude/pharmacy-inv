import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Activity {
  id: string
  type: 'order_placed' | 'order_dispatched' | 'order_delivered' | 'stock_reduced' | 'low_stock' | 'restock'
  message: string
  timestamp: string
  orderId?: string
  customerId?: string
  medicineId?: string
  quantity?: number
  metadata?: Record<string, any>
}

export interface ActivityState {
  activities: Activity[]
  
  // Actions
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void
  getRecentActivities: (limit?: number) => Activity[]
  clearOldActivities: (daysOld?: number) => void
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (activity) => {
        const newActivity: Activity = {
          ...activity,
          id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        }
        
        set(state => ({
          activities: [newActivity, ...state.activities].slice(0, 100) // Keep only last 100 activities
        }))
      },

      getRecentActivities: (limit = 10) => {
        const { activities } = get()
        return activities.slice(0, limit)
      },

      clearOldActivities: (daysOld = 30) => {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysOld)
        
        set(state => ({
          activities: state.activities.filter(activity => 
            new Date(activity.timestamp) > cutoffDate
          )
        }))
      }
    }),
    {
      name: 'lipms-activity-storage',
      partialize: (state) => ({ activities: state.activities }),
    }
  )
)

// Helper function to format time ago
export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const activityTime = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - activityTime.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days !== 1 ? 's' : ''} ago`
  }
}

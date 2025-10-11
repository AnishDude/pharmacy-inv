import { Activity, Package, AlertTriangle, TrendingUp, ShoppingCart, Truck } from 'lucide-react'
import { useActivityStore, formatTimeAgo } from '@/stores/activityStore'

export function RecentActivity() {
  const { getRecentActivities } = useActivityStore()
  const activities = getRecentActivities(5)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order_placed':
        return { icon: ShoppingCart, color: 'text-green-600' }
      case 'order_dispatched':
        return { icon: Truck, color: 'text-blue-600' }
      case 'order_delivered':
        return { icon: Package, color: 'text-purple-600' }
      case 'stock_reduced':
        return { icon: TrendingUp, color: 'text-orange-600' }
      case 'low_stock':
        return { icon: AlertTriangle, color: 'text-yellow-600' }
      case 'restock':
        return { icon: Package, color: 'text-blue-600' }
      default:
        return { icon: Activity, color: 'text-gray-600' }
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
      </div>
      <div className="card-content">
        <div className="flow-root">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h4>
              <p className="text-gray-500">Activities will appear here as orders are placed and processed</p>
            </div>
          ) : (
            <ul role="list" className="-mb-8">
              {activities.map((activity, activityIdx) => {
                const { icon: IconComponent, color } = getActivityIcon(activity.type)
                return (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white`}>
                            <IconComponent className={`h-4 w-4 ${color}`} aria-hidden="true" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">{activity.message}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            <time>{formatTimeAgo(activity.timestamp)}</time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

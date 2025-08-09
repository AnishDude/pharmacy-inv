import { Activity, Package, AlertTriangle, TrendingUp } from 'lucide-react'

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'sale',
      message: 'Sold 50 units of Acetaminophen 500mg',
      time: '2 minutes ago',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      id: 2,
      type: 'low_stock',
      message: 'Vitamin D3 1000 IU is running low (15 units left)',
      time: '15 minutes ago',
      icon: AlertTriangle,
      color: 'text-yellow-600',
    },
    {
      id: 3,
      type: 'restock',
      message: 'Received 200 units of Band-Aids from MedSupply Co.',
      time: '1 hour ago',
      icon: Package,
      color: 'text-blue-600',
    },
    {
      id: 4,
      type: 'sale',
      message: 'Sold 25 units of Ibuprofen 200mg',
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      id: 5,
      type: 'low_stock',
      message: 'Aspirin 81mg is running low (8 units left)',
      time: '3 hours ago',
      icon: AlertTriangle,
      color: 'text-yellow-600',
    },
  ]

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
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
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
                        <activity.icon className={`h-4 w-4 ${activity.color}`} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">{activity.message}</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time>{activity.time}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

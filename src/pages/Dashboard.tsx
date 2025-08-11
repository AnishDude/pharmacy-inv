import { Package, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { LowStockAlerts } from '@/components/dashboard/LowStockAlerts'
import { InventoryChart } from '@/components/dashboard/InventoryChart'

export function Dashboard() {
  const stats = [
    {
      name: 'Total Products',
      value: '1,247',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Package,
    },
    {
      name: 'Low Stock Items',
      value: '23',
      change: '-5%',
      changeType: 'decrease' as const,
      icon: AlertTriangle,
    },
    {
      name: 'Monthly Sales',
      value: '$45,231',
      change: '+18%',
      changeType: 'increase' as const,
      icon: TrendingUp,
    },
    {
      name: 'Active Suppliers',
      value: '12',
      change: '+2',
      changeType: 'increase' as const,
      icon: Users,
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Welcome to your Live Pharmacy Inventory Management System
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <InventoryChart />
        <RecentActivity />
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-6">
        <LowStockAlerts />
      </div>
    </div>
  )
}

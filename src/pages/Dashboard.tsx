import { useEffect } from 'react'
import { Package, AlertTriangle, TrendingUp, Users, ShoppingCart } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { LowStockAlerts } from '@/components/dashboard/LowStockAlerts'
import { InventoryChart } from '@/components/dashboard/InventoryChart'
import { OrderManagement } from '@/components/dashboard/OrderManagement'
import { useOrderStore } from '@/stores/orderStore'
import { useInventoryStore } from '@/stores/inventoryStore'

export function Dashboard() {
  const { orders, getOrdersByStatus, fetchOrders } = useOrderStore()
  const { medicines, getLowStockMedicines, fetchMedicines } = useInventoryStore()
  
  // Fetch data on component mount
  useEffect(() => {
    fetchMedicines()
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  const pendingOrders = getOrdersByStatus('pending')
  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const lowStockItems = getLowStockMedicines()
  
  const stats = [
    {
      name: 'Total Products',
      value: medicines.length.toString(),
      change: '+12%',
      changeType: 'increase' as const,
      icon: Package,
    },
    {
      name: 'Low Stock Items',
      value: lowStockItems.length.toString(),
      change: lowStockItems.length > 0 ? 'Needs attention' : 'All good',
      changeType: lowStockItems.length > 0 ? 'increase' as const : 'decrease' as const,
      icon: AlertTriangle,
    },
    {
      name: 'Pending Orders',
      value: pendingOrders.length.toString(),
      change: pendingOrders.length > 0 ? 'Needs attention' : 'All caught up',
      changeType: pendingOrders.length > 0 ? 'increase' as const : 'decrease' as const,
      icon: ShoppingCart,
    },
    {
      name: 'Total Sales',
      value: `$${totalOrderValue.toLocaleString()}`,
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

      {/* Order Management */}
      <div className="mt-6">
        <OrderManagement />
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-6">
        <LowStockAlerts />
      </div>
    </div>
  )
}

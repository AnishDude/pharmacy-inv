import { useState } from 'react'
import { Download, Calendar, BarChart3, TrendingUp, Package } from 'lucide-react'

export function Reports() {
  const [dateRange, setDateRange] = useState('30')
  const [reportType, setReportType] = useState('sales')

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', description: 'Revenue and transaction analysis' },
    { id: 'inventory', name: 'Inventory Report', description: 'Stock levels and turnover' },
    { id: 'products', name: 'Product Performance', description: 'Best and worst selling products' },
    { id: 'suppliers', name: 'Supplier Analysis', description: 'Supplier performance metrics' },
  ]

  const quickStats = [
    { name: 'Total Revenue', value: '$45,231', change: '+18%', icon: TrendingUp },
    { name: 'Products Sold', value: '1,247', change: '+12%', icon: Package },
    { name: 'Low Stock Items', value: '23', change: '-5%', icon: BarChart3 },
    { name: 'Top Category', value: 'Prescription', change: '+8%', icon: TrendingUp },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-700">
          Analyze your pharmacy performance with detailed reports and analytics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-content">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-md bg-primary-100 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="ml-2 text-sm text-green-600">{stat.change}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Controls */}
      <div className="mb-8">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Generate Report</h3>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  className="input w-full"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  {reportTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  className="input w-full"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="btn btn-primary btn-md">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </button>
              <button className="btn btn-secondary btn-md">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((type) => (
          <div key={type.id} className="card">
            <div className="card-content">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  <p className="text-sm text-gray-500">{type.description}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn btn-primary btn-sm flex-1">
                  View Report
                </button>
                <button className="btn btn-secondary btn-sm">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

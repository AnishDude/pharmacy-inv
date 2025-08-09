import { TrendingUp, TrendingDown } from 'lucide-react'

export function InventoryChart() {
  // Mock chart data
  const chartData = [
    { month: 'Jan', sales: 4000, inventory: 2400 },
    { month: 'Feb', sales: 3000, inventory: 1398 },
    { month: 'Mar', sales: 2000, inventory: 9800 },
    { month: 'Apr', sales: 2780, inventory: 3908 },
    { month: 'May', sales: 1890, inventory: 4800 },
    { month: 'Jun', sales: 2390, inventory: 3800 },
  ]

  const maxValue = Math.max(...chartData.map(d => Math.max(d.sales, d.inventory)))

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Inventory Overview</h3>
            <p className="text-sm text-gray-500">Last 6 months</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary-500"></div>
              <span className="text-sm text-gray-600">Sales</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-pharmacy-500"></div>
              <span className="text-sm text-gray-600">Inventory</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-content">
        {/* Simple bar chart representation */}
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={data.month} className="flex items-center gap-4">
              <div className="w-8 text-sm text-gray-500">{data.month}</div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${(data.sales / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">${data.sales}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-pharmacy-500 h-2 rounded-full" 
                    style={{ width: `${(data.inventory / maxValue) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">{data.inventory}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+12.5%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Sales Growth</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">-3.2%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Inventory Turnover</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

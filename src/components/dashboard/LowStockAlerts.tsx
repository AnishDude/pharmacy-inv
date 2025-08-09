import { AlertTriangle, Package } from 'lucide-react'

export function LowStockAlerts() {
  const lowStockItems = [
    {
      id: 1,
      name: 'Aspirin 81mg',
      currentStock: 8,
      minStock: 25,
      category: 'Prescription',
      supplier: 'MedSupply Co.',
    },
    {
      id: 2,
      name: 'Vitamin D3 1000 IU',
      currentStock: 15,
      minStock: 30,
      category: 'Vitamins',
      supplier: 'HealthPlus Ltd.',
    },
    {
      id: 3,
      name: 'Ibuprofen 200mg',
      currentStock: 12,
      minStock: 20,
      category: 'OTC',
      supplier: 'MedSupply Co.',
    },
    {
      id: 4,
      name: 'Band-Aids (100 pack)',
      currentStock: 5,
      minStock: 15,
      category: 'Medical Supplies',
      supplier: 'HealthPlus Ltd.',
    },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
          </div>
          <span className="inline-flex items-center rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-medium text-warning-800">
            {lowStockItems.length} items
          </span>
        </div>
      </div>
      <div className="card-content">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-warning-100 flex items-center justify-center mr-3">
                        <Package className="h-4 w-4 text-warning-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.minStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.supplier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900">
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

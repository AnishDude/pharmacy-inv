import { useState } from 'react'
import { Package, Edit, Trash2, Eye } from 'lucide-react'

interface InventoryFilters {
  category: string
  status: string
  supplier: string
}

interface InventoryTableProps {
  searchTerm: string
  filters: InventoryFilters
}

export function InventoryTable({ searchTerm, filters }: InventoryTableProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Mock inventory data
  const inventoryItems = [
    {
      id: 1,
      name: 'Acetaminophen 500mg',
      sku: 'ACET-500-001',
      category: 'Prescription',
      currentStock: 150,
      minStock: 50,
      maxStock: 500,
      unitPrice: 12.99,
      supplier: 'MedSupply Co.',
      expiryDate: '2025-06-15',
      status: 'in_stock',
    },
    {
      id: 2,
      name: 'Vitamin D3 1000 IU',
      sku: 'VITD3-1000-001',
      category: 'Vitamins',
      currentStock: 75,
      minStock: 25,
      maxStock: 200,
      unitPrice: 24.99,
      supplier: 'HealthPlus Ltd.',
      expiryDate: '2026-03-20',
      status: 'low_stock',
    },
    {
      id: 3,
      name: 'Band-Aids (100 pack)',
      sku: 'BAND-100-001',
      category: 'Medical Supplies',
      currentStock: 200,
      minStock: 100,
      maxStock: 1000,
      unitPrice: 8.99,
      supplier: 'MedSupply Co.',
      expiryDate: '2027-01-10',
      status: 'in_stock',
    },
    {
      id: 4,
      name: 'Ibuprofen 200mg',
      sku: 'IBUP-200-001',
      category: 'OTC',
      currentStock: 12,
      minStock: 20,
      maxStock: 300,
      unitPrice: 15.99,
      supplier: 'HealthPlus Ltd.',
      expiryDate: '2025-08-30',
      status: 'low_stock',
    },
  ]

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !filters.category || item.category.toLowerCase() === filters.category.toLowerCase()
    const matchesStatus = !filters.status || item.status === filters.status
    const matchesSupplier = !filters.supplier || item.supplier.toLowerCase().includes(filters.supplier.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800'
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock'
      case 'low_stock':
        return 'Low Stock'
      case 'out_of_stock':
        return 'Out of Stock'
      default:
        return status
    }
  }

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  return (
    <div className="card">
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                  onChange={toggleAllSelection}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-100 flex items-center justify-center mr-3">
                      <Package className="h-4 w-4 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.supplier}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.sku}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.currentStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.unitPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.expiryDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-primary-600 hover:text-primary-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Package, Edit, Trash2, Eye } from 'lucide-react'
import { useInventoryStore } from '@/stores/inventoryStore'
import toast from 'react-hot-toast'

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
  const { medicines, deleteMedicine } = useInventoryStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sort medicines by newest first (assuming they have ID - higher ID = newer)
  const sortedMedicines = [...medicines].sort((a, b) => {
    const idA = parseInt(a.id)
    const idB = parseInt(b.id)
    return idB - idA // Descending order (newest first)
  })

  // Apply filters and search
  const filteredItems = sortedMedicines.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !filters.category || item.category.toLowerCase() === filters.category.toLowerCase()
    
    // Determine status based on stock levels
    const status = item.stock === 0 ? 'out_of_stock' : 
                  (item.minStockLevel && item.stock <= item.minStockLevel) ? 'low_stock' : 
                  'in_stock'
    const matchesStatus = !filters.status || status === filters.status
    const matchesSupplier = !filters.supplier || item.manufacturer.toLowerCase().includes(filters.supplier.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier
  })

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  const getStatusBadge = (stock: number, minStock?: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800'
    if (minStock && stock <= minStock) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (stock: number, minStock?: number) => {
    if (stock === 0) return 'Out of Stock'
    if (minStock && stock <= minStock) return 'Low Stock'
    return 'In Stock'
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const toggleAllSelection = () => {
    if (selectedItems.length === paginatedItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(paginatedItems.map(item => item.id))
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMedicine(id)
        toast.success('Medicine deleted successfully')
        // Reset to page 1 if current page becomes empty
        if (paginatedItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } catch (error) {
        toast.error('Failed to delete medicine')
      }
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                    onChange={toggleAllSelection}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.map((item) => (
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
                        <div className="text-sm text-gray-500">{item.manufacturer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.dosage || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.stock}
                    {item.minStockLevel && (
                      <span className="text-xs text-gray-500 ml-1">/ {item.minStockLevel}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.stock, item.minStockLevel)}`}>
                      {getStatusText(item.stock, item.minStockLevel)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        className="text-primary-600 hover:text-primary-900"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        onClick={() => handleDelete(item.id, item.name)}
                      >
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
              {searchTerm || filters.category || filters.status || filters.supplier
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first inventory item.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredItems.length)}</span> of{' '}
                <span className="font-medium">{filteredItems.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

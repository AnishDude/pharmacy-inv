import { Pill, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react'
import { useInventoryStore, Medicine } from '@/stores/inventoryStore'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Medicine
}

export function ProductCard({ product }: ProductCardProps) {
  const { deleteMedicine } = useInventoryStore()
  const isLowStock = product.minStockLevel ? product.stock <= product.minStockLevel : false

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase()
    if (cat.includes('pain')) return 'bg-red-100 text-red-800'
    if (cat.includes('antibiotic')) return 'bg-orange-100 text-orange-800'
    if (cat.includes('vitamin')) return 'bg-green-100 text-green-800'
    if (cat.includes('first aid') || cat.includes('aid')) return 'bg-purple-100 text-purple-800'
    if (cat.includes('digestive')) return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteMedicine(product.id)
        toast.success('Product deleted successfully')
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="card-header">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">{product.name}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getCategoryColor(product.category)}`}>
                {product.category}
              </span>
            </div>
          </div>
          
          {isLowStock && (
            <AlertTriangle className="h-5 w-5 text-warning-500" />
          )}
        </div>
      </div>

      <div className="card-content space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Price:</span>
            <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          <div>
            <span className="text-gray-500">Stock:</span>
            <p className={`font-medium ${isLowStock ? 'text-warning-600' : 'text-gray-900'}`}>
              {product.stock}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Min Stock:</span>
            <p className="font-medium text-gray-900">{product.minStockLevel || 'N/A'}</p>
          </div>
          <div>
            <span className="text-gray-500">Dosage:</span>
            <p className="font-medium text-sm text-gray-900">
              {product.dosage || 'N/A'}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Manufacturer:</span> {product.manufacturer}
          </p>
        </div>

        {product.description && (
          <div className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </div>
        )}

        {isLowStock && (
          <div className="bg-warning-50 border border-warning-200 rounded-md p-2">
            <p className="text-xs text-warning-700">
              ⚠️ Low stock alert - Consider reordering
            </p>
          </div>
        )}

        {product.prescription && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2">
            <p className="text-xs text-red-700">
              📋 Prescription required
            </p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="flex gap-2 w-full">
          <button 
            className="btn btn-secondary btn-sm flex-1"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            className="btn btn-secondary btn-sm flex-1"
            title="Edit product"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="btn btn-danger btn-sm flex-1"
            title="Delete product"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

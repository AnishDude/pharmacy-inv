import { Pill, Edit, Trash2, Eye, AlertTriangle } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  expiryDate: string
  supplier: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.stock <= product.minStock
  const isExpiringSoon = new Date(product.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'prescription':
        return 'bg-red-100 text-red-800'
      case 'otc':
        return 'bg-blue-100 text-blue-800'
      case 'vitamins':
        return 'bg-green-100 text-green-800'
      case 'medical':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
            <p className="font-medium text-gray-900">${product.price}</p>
          </div>
          <div>
            <span className="text-gray-500">Stock:</span>
            <p className={`font-medium ${isLowStock ? 'text-warning-600' : 'text-gray-900'}`}>
              {product.stock}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Min Stock:</span>
            <p className="font-medium text-gray-900">{product.minStock}</p>
          </div>
          <div>
            <span className="text-gray-500">Expiry:</span>
            <p className={`font-medium text-sm ${isExpiringSoon ? 'text-danger-600' : 'text-gray-900'}`}>
              {new Date(product.expiryDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Supplier:</span> {product.supplier}
          </p>
        </div>

        {isLowStock && (
          <div className="bg-warning-50 border border-warning-200 rounded-md p-2">
            <p className="text-xs text-warning-700">
              ⚠️ Low stock alert - Consider reordering
            </p>
          </div>
        )}

        {isExpiringSoon && (
          <div className="bg-danger-50 border border-danger-200 rounded-md p-2">
            <p className="text-xs text-danger-700">
              ⚠️ Expires soon - Check expiry date
            </p>
          </div>
        )}
      </div>

      <div className="card-footer">
        <div className="flex gap-2 w-full">
          <button className="btn btn-secondary btn-sm flex-1">
            <Eye className="h-4 w-4" />
          </button>
          <button className="btn btn-secondary btn-sm flex-1">
            <Edit className="h-4 w-4" />
          </button>
          <button className="btn btn-danger btn-sm flex-1">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Search, Package, Edit, Trash2 } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { AddProductModal } from '@/components/products/AddProductModal'

export function Products() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'prescription', name: 'Prescription' },
    { id: 'otc', name: 'Over-the-Counter' },
    { id: 'vitamins', name: 'Vitamins & Supplements' },
    { id: 'medical', name: 'Medical Supplies' },
  ]

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Acetaminophen 500mg',
      category: 'prescription',
      price: 12.99,
      stock: 150,
      minStock: 50,
      expiryDate: '2025-06-15',
      supplier: 'MedSupply Co.',
    },
    {
      id: 2,
      name: 'Vitamin D3 1000 IU',
      category: 'vitamins',
      price: 24.99,
      stock: 75,
      minStock: 25,
      expiryDate: '2026-03-20',
      supplier: 'HealthPlus Ltd.',
    },
    {
      id: 3,
      name: 'Band-Aids (100 pack)',
      category: 'medical',
      price: 8.99,
      stock: 200,
      minStock: 100,
      expiryDate: '2027-01-10',
      supplier: 'MedSupply Co.',
    },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your product catalog and information
            </p>
          </div>
          <button 
            className="btn btn-primary btn-md"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="input w-48"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}

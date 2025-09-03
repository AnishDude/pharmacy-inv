import { X } from 'lucide-react'

interface InventoryFiltersProps {
  filters: {
    category: string
    status: string
    supplier: string
  }
  onFiltersChange: (filters: { category: string; status: string; supplier: string }) => void
}

export function InventoryFilters({ filters, onFiltersChange }: InventoryFiltersProps) {
  const categories = [
    'Prescription',
    'OTC',
    'Vitamins',
    'Medical Supplies',
    'Health & Beauty',
  ]

  const statuses = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ]

  const suppliers = [
    'MedSupply Co.',
    'HealthPlus Ltd.',
    'PharmaDirect',
    'Medical Solutions Inc.',
  ]

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      status: '',
      supplier: '',
    })
  }

  const hasActiveFilters = filters.category || filters.status || filters.supplier

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border">
      <span className="text-sm font-medium text-gray-700">Active filters:</span>
      
      {filters.category && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          Category: {filters.category}
          <button
            onClick={() => onFiltersChange({ ...filters, category: '' })}
            className="ml-1 hover:text-primary-600"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      
      {filters.status && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          Status: {statuses.find(s => s.value === filters.status)?.label}
          <button
            onClick={() => onFiltersChange({ ...filters, status: '' })}
            className="ml-1 hover:text-primary-600"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      
      {filters.supplier && (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          Supplier: {filters.supplier}
          <button
            onClick={() => onFiltersChange({ ...filters, supplier: '' })}
            className="ml-1 hover:text-primary-600"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      
      <button
        onClick={clearFilters}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Clear all
      </button>
    </div>
  )
}

import { useState } from 'react'
import { Plus, Search, Filter, Download } from 'lucide-react'
import { InventoryTable } from '@/components/inventory/InventoryTable'
import { InventoryFilters } from '@/components/inventory/InventoryFilters'
import { AddInventoryModal } from '@/components/inventory/AddInventoryModal'

export function Inventory() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    supplier: '',
  })

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your pharmacy inventory and stock levels
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary btn-md">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              className="btn btn-primary btn-md"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary btn-md">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
        
        <InventoryFilters 
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      
      <InventoryTable 
        searchTerm={searchTerm}
        filters={filters}
      />

      
      
    </div>
  )
}

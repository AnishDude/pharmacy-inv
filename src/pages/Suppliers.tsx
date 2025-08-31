import { useState } from 'react'
import { Plus, Search, Truck, Phone, Mail, MapPin } from 'lucide-react'

export function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('')

  const suppliers = [
    {
      id: 1,
      name: 'MedSupply Co.',
      contact: 'John Smith',
      phone: '(555) 123-4567',
      email: 'john@medsupply.com',
      address: '123 Medical St, Health City, HC 12345',
      products: 45,
      lastOrder: '2024-01-15',
      status: 'active',
    },
    {
      id: 2,
      name: 'HealthPlus Ltd.',
      contact: 'Sarah Johnson',
      phone: '(555) 987-6543',
      email: 'sarah@healthplus.com',
      address: '456 Wellness Ave, Med Town, MT 67890',
      products: 32,
      lastOrder: '2024-01-12',
      status: 'active',
    },
    {
      id: 3,
      name: 'PharmaDirect',
      contact: 'Mike Wilson',
      phone: '(555) 456-7890',
      email: 'mike@pharmadirect.com',
      address: '789 Drug Lane, Pharmacy City, PC 13579',
      products: 67,
      lastOrder: '2024-01-10',
      status: 'inactive',
    },
  ]

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your supplier relationships and contact information
            </p>
          </div>
          <button className="btn btn-primary btn-md">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                    <p className="text-sm text-gray-500">{supplier.contact}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  supplier.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {supplier.status}
                </span>
              </div>
            </div>
            
            <div className="card-content space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {supplier.email}
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5" />
                {supplier.address}
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Products:</span>
                  <span className="font-medium">{supplier.products}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Order:</span>
                  <span className="font-medium">{supplier.lastOrder}</span>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <div className="flex gap-2 w-full">
                <button className="btn btn-secondary btn-sm flex-1">
                  View Products
                </button>
                <button className="btn btn-primary btn-sm flex-1">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No suppliers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}

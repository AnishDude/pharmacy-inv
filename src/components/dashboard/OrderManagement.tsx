import React, { useState } from 'react'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Mail,
  Phone
} from 'lucide-react'
import { useOrderStore } from '@/stores/orderStore'
import toast from 'react-hot-toast'

interface OrderManagementProps {
  className?: string
}

export const OrderManagement: React.FC<OrderManagementProps> = ({ className = '' }) => {
  const { 
    orders, 
    getOrdersByStatus, 
    dispatchOrder, 
    updateOrderStatus 
  } = useOrderStore()
  
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'processing' | 'dispatched' | 'delivered'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: getOrdersByStatus('pending').length },
    { value: 'processing', label: 'Processing', count: getOrdersByStatus('processing').length },
    { value: 'dispatched', label: 'Dispatched', count: getOrdersByStatus('dispatched').length },
    { value: 'delivered', label: 'Delivered', count: getOrdersByStatus('delivered').length },
  ]

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'dispatched':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'dispatched':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDispatchOrder = (orderId: string) => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number')
      return
    }
    
    dispatchOrder(orderId, trackingNumber.trim())
    toast.success('Order dispatched successfully!')
    setSelectedOrder(null)
    setTrackingNumber('')
  }

  const handleUpdateStatus = (orderId: string, status: 'processing' | 'delivered') => {
    updateOrderStatus(orderId, status)
    toast.success(`Order status updated to ${status}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Order Management</h2>
            <p className="text-sm text-gray-500">Manage customer orders and dispatch tracking</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Package className="h-4 w-4" />
            <span>{orders.length} total orders</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No orders have been placed yet'
              }
            </p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium text-gray-900">#{order.id}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                    {order.trackingNumber && (
                      <span className="text-xs text-gray-500">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="flex items-center mb-1">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="font-medium">{order.companyName}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{order.customerName}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{order.customerEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Items Preview */}
                  <div className="mt-2 text-xs text-gray-500">
                    Items: {order.items.map(item => `${item.medicineName} (${item.quantity}x)`).join(', ')}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedOrder(order.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'processing')}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Process
                    </button>
                  )}
                  
                  {order.status === 'processing' && (
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      Dispatch
                    </button>
                  )}
                  
                  {order.status === 'dispatched' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'delivered')}
                      className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dispatch Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispatch Order</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number *
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedOrder(null)
                  setTrackingNumber('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDispatchOrder(selectedOrder)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Dispatch Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

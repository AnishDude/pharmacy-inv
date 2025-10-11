import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  User, 
  LogOut, 
  Search,
  Filter,
  Plus,
  Minus,
  Building2,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { useCustomerAuthStore } from '@/stores/customerAuthStore'
import { useOrderStore } from '@/stores/orderStore'
import { useInventoryStore, Medicine } from '@/stores/inventoryStore'
import { Notifications } from '@/components/customer/Notifications'
import toast from 'react-hot-toast'

interface CartItem {
  medicine: Medicine
  quantity: number
}

export const CustomerDashboard: React.FC = () => {
  const { customer, logout } = useCustomerAuthStore()
  const { createOrder } = useOrderStore()
  const { medicines } = useInventoryStore()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const categories = ['All', ...Array.from(new Set(medicines.map(m => m.category)))]

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (medicine: Medicine) => {
    const existingItem = cart.find(item => item.medicine.id === medicine.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0
    
    // Check if adding one more would exceed stock
    if (currentQuantity + 1 > medicine.stock) {
      toast.error(`Only ${medicine.stock} units available in stock`)
      return
    }
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.medicine.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { medicine, quantity: 1 }])
    }
    toast.success(`${medicine.name} added to cart`)
  }

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter(item => item.medicine.id !== medicineId))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId)
      return
    }
    
    // Check if quantity exceeds available stock
    const medicine = medicines.find(m => m.id === medicineId)
    if (medicine && quantity > medicine.stock) {
      toast.error(`Only ${medicine.stock} units available in stock`)
      return
    }
    
    setCart(cart.map(item => 
      item.medicine.id === medicineId 
        ? { ...item, quantity }
        : item
    ))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    if (!customer) {
      toast.error('Customer information not found')
      return
    }

    // Create order data
    const orderItems = cart.map(item => ({
      medicineId: item.medicine.id,
      medicineName: item.medicine.name,
      price: item.medicine.price,
      quantity: item.quantity,
      total: item.medicine.price * item.quantity
    }))

    const orderData = {
      customerId: customer.id,
      customerName: customer.contactPerson,
      customerEmail: customer.email,
      companyName: customer.companyName,
      items: orderItems,
      totalAmount: getTotalPrice()
    }

    // Create the order
    createOrder(orderData)
    
    toast.success('Order placed successfully! You will receive a confirmation email.')
    setCart([])
    setShowCart(false)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/customer/login')
  }

  if (!customer) {
    navigate('/customer/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">LIPMS Customer Portal</h1>
                <p className="text-sm text-gray-500">Order medicines for your company</p>
              </div>
            </div>
            
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Notifications />
            
            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-400 hover:text-gray-500"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{customer.companyName}</p>
                  <p className="text-xs text-gray-500">{customer.contactPerson}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filter */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Medicines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedicines.map(medicine => (
                <div key={medicine.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                      <p className="text-sm text-gray-600">{medicine.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      medicine.prescription 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {medicine.prescription ? 'Prescription' : 'OTC'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Manufacturer:</span>
                      <span className="font-medium">{medicine.manufacturer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Dosage:</span>
                      <span className="font-medium">{medicine.dosage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Stock:</span>
                      <span className="font-medium">{medicine.stock} units</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${medicine.price}</span>
                    <button
                      onClick={() => addToCart(medicine)}
                      disabled={medicine.stock === 0}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.medicine.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.medicine.name}</h4>
                          <p className="text-sm text-gray-500">${item.medicine.price} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-xl font-bold text-green-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{customer.companyName}</span>
              </div>
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{customer.contactPerson}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{customer.email}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-900">{customer.phone}</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-900">{customer.address}</p>
                  <p className="text-gray-900">{customer.city}, {customer.state} {customer.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

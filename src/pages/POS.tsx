import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Trash2, Plus, Minus, DollarSign, CreditCard, User } from 'lucide-react'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useSaleStore } from '@/stores/saleStore'
import toast from 'react-hot-toast'

export function POS() {
  const { medicines, fetchMedicines } = useInventoryStore()
  const { cart, addToCart, updateCartItem, removeFromCart, getCartTotal, completeSale, isLoading } = useSaleStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance'>('cash')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchMedicines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredMedicines = medicines.filter(medicine =>
    medicine.stock > 0 && (
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ).slice(0, 10) // Limit to 10 results

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart')
      return
    }

    try {
      await completeSale(customerName || undefined, paymentMethod, notes || undefined)
      setCustomerName('')
      setNotes('')
      // Refresh medicines to show updated stock
      fetchMedicines()
    } catch (error) {
      // Error already handled by store
    }
  }

  const cartTotal = getCartTotal()

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-6">
      {/* Left Side - Medicine Selection */}
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Point of Sale</h1>
          <p className="mt-2 text-sm text-gray-700">
            Search and add medicines to cart
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search medicines..."
            className="input pl-10 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {/* Medicine List */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow">
          {searchTerm && (
            <div className="divide-y divide-gray-200">
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => addToCart({ id: medicine.id, name: medicine.name, price: medicine.price })}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-gray-500">{medicine.category}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">Stock: {medicine.stock}</span>
                          {medicine.dosage && (
                            <>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">{medicine.dosage}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-lg font-semibold text-primary-600">${medicine.price.toFixed(2)}</p>
                        <button className="mt-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No medicines found
                </div>
              )}
            </div>
          )}
          
          {!searchTerm && (
            <div className="p-12 text-center text-gray-400">
              <Search className="h-16 w-16 mx-auto mb-4" />
              <p>Start typing to search for medicines</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart & Checkout */}
      <div className="w-96 flex flex-col bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShoppingCart className="h-5 w-5" />
            Cart ({cart.length} items)
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.medicineId} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.medicineName}</h4>
                    <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.medicineId)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItem(item.medicineId, Math.max(1, item.quantity - 1), item.discount)}
                      className="btn btn-secondary btn-sm p-1"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateCartItem(item.medicineId, item.quantity + 1, item.discount)}
                      className="btn btn-primary btn-sm p-1"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="font-semibold text-gray-900">
                    ${item.total.toFixed(2)}
                  </div>
                </div>

                {/* Discount input */}
                <div className="mt-2">
                  <input
                    type="number"
                    placeholder="Discount"
                    className="input input-sm w-full text-xs"
                    value={item.discount || ''}
                    onChange={(e) => updateCartItem(item.medicineId, item.quantity, parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-12">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Cart is empty</p>
            </div>
          )}
        </div>

        {/* Customer Info & Payment */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="h-4 w-4 inline mr-1" />
              Customer Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              className="input input-sm w-full"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`btn btn-sm ${paymentMethod === 'cash' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <DollarSign className="h-4 w-4" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`btn btn-sm ${paymentMethod === 'card' ? 'btn-primary' : 'btn-secondary'}`}
              >
                <CreditCard className="h-4 w-4" />
                Card
              </button>
              <button
                onClick={() => setPaymentMethod('insurance')}
                className={`btn btn-sm ${paymentMethod === 'insurance' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Insurance
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add notes..."
              className="input input-sm w-full resize-none"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Total */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">${cartTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0 || isLoading}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


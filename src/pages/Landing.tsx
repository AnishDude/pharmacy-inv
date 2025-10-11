import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Building2, Users, Package, Truck, BarChart3 } from 'lucide-react'

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">LIPMS</h1>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/customer/login"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Customer Portal
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Live Pharmacy Inventory
            <span className="text-blue-600"> Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Order medicines for your company with ease. Our platform provides seamless medicine ordering 
            for businesses with real-time inventory, secure transactions, and professional support.
          </p>
          <div className="flex justify-center">
            <Link
              to="/customer/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Register Your Company
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LIPMS?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides powerful features for business customers to order medicines efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Features */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <Building2 className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">For Companies</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <Package className="h-5 w-5 text-green-600 mr-2" />
                  Easy medicine ordering
                </li>
                <li className="flex items-center">
                  <Building2 className="h-5 w-5 text-green-600 mr-2" />
                  Company account management
                </li>
                <li className="flex items-center">
                  <Truck className="h-5 w-5 text-green-600 mr-2" />
                  Order tracking
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  Bulk ordering capabilities
                </li>
              </ul>
            </div>

            {/* System Features */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-gray-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">System Features</h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                  Secure authentication
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                  Real-time updates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                  Mobile responsive
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                  Professional support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies using LIPMS for their medicine ordering needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/customer/register"
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Register Your Company
            </Link>
            <Link
              to="/customer/login"
              className="bg-transparent hover:bg-blue-700 text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Customer Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-lg font-semibold">LIPMS</span>
            </div>
            <p className="text-gray-400 mb-4">
              Live Pharmacy Inventory Management System
            </p>
            <p className="text-sm text-gray-500">
              © 2024 LIPMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

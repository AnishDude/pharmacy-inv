import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Landing } from '@/pages/Landing'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Inventory } from '@/pages/Inventory'
import { Products } from '@/pages/Products'
import { Suppliers } from '@/pages/Suppliers'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Registration } from '@/pages/Registration'
import { CustomerLogin } from '@/pages/CustomerLogin'
import { CustomerDashboard } from '@/pages/CustomerDashboard'
import { CustomerProtectedRoute } from '@/components/auth/CustomerProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Customer routes */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/register" element={<Registration />} />
      <Route path="/customer/dashboard" element={
        <CustomerProtectedRoute>
          <CustomerDashboard />
        </CustomerProtectedRoute>
      } />
      
      {/* Staff protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/inventory" element={
        <ProtectedRoute>
          <Layout>
            <Inventory />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Layout>
            <Products />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/suppliers" element={
        <ProtectedRoute>
          <Layout>
            <Suppliers />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Layout>
            <ProtectedRoute requiredRole="pharmacist">
              <Reports />
            </ProtectedRoute>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <ProtectedRoute requiredRole="admin">
              <Settings />
            </ProtectedRoute>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route for 404 */}
      <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
    </Routes>
  )
}

export default App

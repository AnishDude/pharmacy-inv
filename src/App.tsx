import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Inventory } from '@/pages/Inventory'
import { Products } from '@/pages/Products'
import { Suppliers } from '@/pages/Suppliers'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/reports" element={<ProtectedRoute requiredRole="pharmacist"><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute requiredRole="admin"><Settings /></ProtectedRoute>} />
              {/* Catch all route for 404 */}
              <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route for 404 */}
      <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
    </Routes>
  )
}

export default App

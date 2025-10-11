import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useCustomerAuthStore } from '@/stores/customerAuthStore'

interface CustomerProtectedRouteProps {
  children: React.ReactNode
}

export const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({ 
  children 
}) => {
  const { isAuthenticated, customer } = useCustomerAuthStore()
  const location = useLocation()

  // Check if customer is authenticated
  if (!isAuthenticated || !customer) {
    return <Navigate to="/customer/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

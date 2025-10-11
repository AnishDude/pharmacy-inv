import React, { useEffect } from 'react'
import { useCustomerAuthStore } from '@/stores/customerAuthStore'

interface CustomerAuthGuardProps {
  children: React.ReactNode
}

export const CustomerAuthGuard: React.FC<CustomerAuthGuardProps> = ({ children }) => {
  const { checkAuth } = useCustomerAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return <>{children}</>
}

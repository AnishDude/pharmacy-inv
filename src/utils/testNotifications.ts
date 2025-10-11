/**
 * Test utility to simulate customer orders for testing real-time notifications
 * Use this in the browser console to test admin notifications
 */

import { useOrderStore } from '@/stores/orderStore'

export function simulateCustomerOrder() {
  const orderStore = useOrderStore.getState()
  
  const mockOrders = [
    {
      customerId: 'CUST-001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      companyName: 'Smith Medical Supplies',
      items: [
        {
          medicineId: 'MED-001',
          medicineName: 'Aspirin 100mg',
          price: 5.99,
          quantity: 50,
          total: 299.50
        },
        {
          medicineId: 'MED-002',
          medicineName: 'Ibuprofen 200mg',
          price: 7.99,
          quantity: 30,
          total: 239.70
        }
      ],
      totalAmount: 539.20
    },
    {
      customerId: 'CUST-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@healthcare.com',
      companyName: 'Johnson Healthcare',
      items: [
        {
          medicineId: 'MED-003',
          medicineName: 'Paracetamol 500mg',
          price: 4.99,
          quantity: 100,
          total: 499.00
        }
      ],
      totalAmount: 499.00
    },
    {
      customerId: 'CUST-003',
      customerName: 'Mike Wilson',
      customerEmail: 'mike@pharmacy.com',
      companyName: 'Wilson Pharmacy Chain',
      items: [
        {
          medicineId: 'MED-004',
          medicineName: 'Amoxicillin 250mg',
          price: 12.99,
          quantity: 25,
          total: 324.75
        },
        {
          medicineId: 'MED-005',
          medicineName: 'Vitamin D3 1000IU',
          price: 8.99,
          quantity: 40,
          total: 359.60
        },
        {
          medicineId: 'MED-006',
          medicineName: 'Zinc Tablets 50mg',
          price: 6.99,
          quantity: 20,
          total: 139.80
        }
      ],
      totalAmount: 824.15
    }
  ]

  // Select random order from mock data
  const randomOrder = mockOrders[Math.floor(Math.random() * mockOrders.length)]
  
  // Create the order
  orderStore.createOrder(randomOrder)
  
  console.log('✅ Simulated order created:', randomOrder)
  console.log('📢 Check your admin notifications for real-time update!')
  
  return randomOrder
}

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).simulateOrder = simulateCustomerOrder
}

export default simulateCustomerOrder


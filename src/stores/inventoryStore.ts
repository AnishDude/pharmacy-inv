import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Medicine {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  manufacturer: string
  dosage: string
  prescription: boolean
  minStockLevel?: number
  maxStockLevel?: number
}

export interface InventoryState {
  medicines: Medicine[]
  isLoading: boolean
  
  // Actions
  getMedicineById: (id: string) => Medicine | undefined
  updateStock: (medicineId: string, quantity: number, operation: 'add' | 'subtract') => void
  reduceStock: (medicineId: string, quantity: number) => void
  addStock: (medicineId: string, quantity: number) => void
  getLowStockMedicines: () => Medicine[]
  updateMedicine: (medicineId: string, updates: Partial<Medicine>) => void
}

// Initial mock medicines data
const initialMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    description: 'Pain relief and fever reducer',
    price: 5.99,
    stock: 100,
    category: 'Pain Relief',
    manufacturer: 'MedPharm Ltd',
    dosage: '500mg',
    prescription: false,
    minStockLevel: 10,
    maxStockLevel: 200
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic for bacterial infections',
    price: 12.50,
    stock: 50,
    category: 'Antibiotic',
    manufacturer: 'HealthCorp',
    dosage: '250mg',
    prescription: true,
    minStockLevel: 5,
    maxStockLevel: 100
  },
  {
    id: '3',
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever',
    price: 8.75,
    stock: 75,
    category: 'Pain Relief',
    manufacturer: 'MedPharm Ltd',
    dosage: '400mg',
    prescription: false,
    minStockLevel: 10,
    maxStockLevel: 150
  },
  {
    id: '4',
    name: 'Vitamin D3 1000IU',
    description: 'Vitamin D supplement',
    price: 15.99,
    stock: 200,
    category: 'Vitamin',
    manufacturer: 'VitCorp',
    dosage: '1000IU',
    prescription: false,
    minStockLevel: 20,
    maxStockLevel: 300
  }
]

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      medicines: initialMedicines,
      isLoading: false,

      getMedicineById: (id: string) => {
        const { medicines } = get()
        return medicines.find(medicine => medicine.id === id)
      },

      updateStock: (medicineId: string, quantity: number, operation: 'add' | 'subtract') => {
        set(state => ({
          medicines: state.medicines.map(medicine =>
            medicine.id === medicineId
              ? {
                  ...medicine,
                  stock: operation === 'add' 
                    ? medicine.stock + quantity 
                    : Math.max(0, medicine.stock - quantity)
                }
              : medicine
          )
        }))
      },

      reduceStock: (medicineId: string, quantity: number) => {
        const { updateStock } = get()
        updateStock(medicineId, quantity, 'subtract')
      },

      addStock: (medicineId: string, quantity: number) => {
        const { updateStock } = get()
        updateStock(medicineId, quantity, 'add')
      },

      getLowStockMedicines: () => {
        const { medicines } = get()
        return medicines.filter(medicine => 
          medicine.minStockLevel && medicine.stock <= medicine.minStockLevel
        )
      },

      updateMedicine: (medicineId: string, updates: Partial<Medicine>) => {
        set(state => ({
          medicines: state.medicines.map(medicine =>
            medicine.id === medicineId
              ? { ...medicine, ...updates }
              : medicine
          )
        }))
      }
    }),
    {
      name: 'lipms-inventory-storage',
      partialize: (state) => ({ medicines: state.medicines }),
    }
  )
)

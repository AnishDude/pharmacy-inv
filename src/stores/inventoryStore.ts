import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { medicinesAPI } from '../utils/api'

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
  fetchMedicines: () => Promise<void>
  getMedicineById: (id: string) => Medicine | undefined
  updateStock: (medicineId: string, quantity: number, operation: 'add' | 'subtract') => Promise<void>
  reduceStock: (medicineId: string, quantity: number) => Promise<void>
  addStock: (medicineId: string, quantity: number) => Promise<void>
  getLowStockMedicines: () => Medicine[]
  updateMedicine: (medicineId: string, updates: Partial<Medicine>) => Promise<void>
  addMedicine: (medicine: Omit<Medicine, 'id'>) => Promise<void>
  deleteMedicine: (medicineId: string) => Promise<void>
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

      fetchMedicines: async () => {
        set({ isLoading: true })
        try {
          const response = await medicinesAPI.getAll()
          const medicines = response.data.map((med: any) => ({
            id: med.id.toString(),
            name: med.name,
            description: med.description || '',
            price: parseFloat(med.price),
            stock: med.stock,  // Backend uses 'stock' not 'quantity'
            category: med.category,
            manufacturer: med.manufacturer || '',
            dosage: med.dosage || '',
            prescription: med.prescription_required || false,  // Backend uses 'prescription_required'
            minStockLevel: med.min_stock_level,
            maxStockLevel: med.max_stock_level
          }))
          set({ medicines, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch medicines:', error)
          set({ isLoading: false })
        }
      },

      getMedicineById: (id: string) => {
        const { medicines } = get()
        return medicines.find(medicine => medicine.id === id)
      },

      updateStock: async (medicineId: string, quantity: number, operation: 'add' | 'subtract') => {
        try {
          // Use the backend's stock update endpoint with proper payload
          const response = await medicinesAPI.updateStock(medicineId, quantity, operation)
          
          set(state => ({
            medicines: state.medicines.map(med =>
              med.id === medicineId
                ? { ...med, stock: response.data.stock }
                : med
            )
          }))
        } catch (error) {
          console.error('Failed to update stock:', error)
          throw error
        }
      },

      reduceStock: async (medicineId: string, quantity: number) => {
        const { updateStock, getMedicineById } = get()
        const medicine = getMedicineById(medicineId)
        
        if (medicine) {
          await updateStock(medicineId, quantity, 'subtract')
          
          // Add activity for stock reduction
          import('./activityStore').then(({ useActivityStore }) => {
            const activityStore = useActivityStore.getState()
            activityStore.addActivity({
              type: 'stock_reduced',
              message: `Stock reduced: ${quantity} units of ${medicine.name}`,
              medicineId: medicineId,
              quantity: quantity,
              metadata: {
                medicineName: medicine.name,
                previousStock: medicine.stock,
                newStock: medicine.stock - quantity
              }
            })
          })
        }
      },

      addStock: async (medicineId: string, quantity: number) => {
        const { updateStock } = get()
        await updateStock(medicineId, quantity, 'add')
      },

      getLowStockMedicines: () => {
        const { medicines } = get()
        return medicines.filter(medicine => 
          medicine.minStockLevel && medicine.stock <= medicine.minStockLevel
        )
      },

      updateMedicine: async (medicineId: string, updates: Partial<Medicine>) => {
        try {
          await medicinesAPI.update(medicineId, updates)
          
          set(state => ({
            medicines: state.medicines.map(medicine =>
              medicine.id === medicineId
                ? { ...medicine, ...updates }
                : medicine
            )
          }))
        } catch (error) {
          console.error('Failed to update medicine:', error)
          throw error
        }
      },

      addMedicine: async (medicine: Omit<Medicine, 'id'>) => {
        try {
          const response = await medicinesAPI.create({
            name: medicine.name,
            description: medicine.description,
            price: medicine.price,
            stock: medicine.stock,
            category: medicine.category,
            manufacturer: medicine.manufacturer,
            dosage: medicine.dosage,
            prescription_required: medicine.prescription,
            min_stock_level: medicine.minStockLevel || 0,
            max_stock_level: medicine.maxStockLevel || 1000
          })
          
          const newMedicine: Medicine = {
            id: response.data.id.toString(),
            name: response.data.name,
            description: response.data.description || '',
            price: parseFloat(response.data.price),
            stock: response.data.stock,
            category: response.data.category,
            manufacturer: response.data.manufacturer || '',
            dosage: response.data.dosage || '',
            prescription: response.data.prescription_required || false,
            minStockLevel: response.data.min_stock_level,
            maxStockLevel: response.data.max_stock_level
          }
          
          set(state => ({
            medicines: [...state.medicines, newMedicine]
          }))
        } catch (error) {
          console.error('Failed to add medicine:', error)
          throw error
        }
      },

      deleteMedicine: async (medicineId: string) => {
        try {
          await medicinesAPI.delete(medicineId)
          
          set(state => ({
            medicines: state.medicines.filter(med => med.id !== medicineId)
          }))
        } catch (error) {
          console.error('Failed to delete medicine:', error)
          throw error
        }
      }
    }),
    {
      name: 'lipms-inventory-storage',
      partialize: (state) => ({ medicines: state.medicines }),
    }
  )
)

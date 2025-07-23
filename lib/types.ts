export interface Order {
  _id?: string
  id?: number
  clientName: string
  phone: string
  address: string
  eventDate: Date
  eventTime: string
  numberOfPeople: string
  eventType: string
  specialRequests: string
  selectedCategory: number
  selectedItems: Record<string, boolean>
  itemVarieties: Record<string, number>
  vegetableCalculations: Record<string, number>
  manufacturingCalculations: Record<string, number>
  status: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id?: string
  id: number
  name: string
  description: string
  items: MenuItem[]
  createdAt: Date
  updatedAt: Date
}

export interface MenuItem {
  id: number
  name: string
  vegetables: string[]
  baseQuantity: number
  type?: string
}

export interface ManufacturingItem {
  _id?: string
  id: number
  name: string
  baseQuantity: number
  per: number
  createdAt: Date
  updatedAt: Date
}

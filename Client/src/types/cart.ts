export interface CartItem {
    id: string
    medicineId: string
    medicineName: string
    medicineImage?: string
    quantity: number
    price: number
    prescriptionRequired: boolean
  }

  export interface Cart {
    id: string
    user: UserDto
    items: CartItem[]
    totalItems: number
    totalAmount: number
    createdAt: string
    updatedAt: string
  }

  export interface UserDto {
    firstName: string
    lastName: string
    imageUrl: string
  }

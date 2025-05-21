// Types for medicine/pharmacy products
export interface MedicineResponseDTO {
    id: string
    name: string
    manufacturer: string
    price: number
    stockQuantity: number
    category: string
    prescriptionRequired: boolean
    description: string
    manufacturingDate: string
    expiryDate: string
    activeIngredients: string[]
    sideEffects: string[]
    dosageInstructions: string
    images: string[]
    createdAt: string
    updatedAt: string
  }

  // Types for API responses
  export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
  }

  // Types for filter options (frontend only)
  export interface FilterOptions {
    category?: string
    manufacturer?: string
    minPrice?: number
    maxPrice?: number
    prescriptionRequired?: boolean
    inStock?: boolean
    sortBy?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest"
    search?: string
  }

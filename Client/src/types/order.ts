export interface OrderItem {
    id: string
    medicineId: string
    medicineName: string
    medicineImage?: string
    quantity: number
    price: number
    subtotal: number
  }

  export interface Order {
    id: string
    userId: string
    orderNumber: string
    items: OrderItem[]
    totalItems: number
    totalAmount: number
    shippingAddress: string
    paymentMethod: string
    status: OrderStatus
    createdAt: string
    updatedAt: string
  }

  export enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
  }

  export interface OrderCreationRequest {
    shippingAddress: string
    paymentMethod: string
    items?: { medicineId: string; quantity: number }[]
  }

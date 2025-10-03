export interface OrderDTO {
  id: string;
  patientId: string;
  patientName: string;
  items: OrderItemDTO[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentId?: string;
  orderDate: string;
  updatedAt: string;
}

export interface OrderItemDTO {
  medicineId: string;
  medicineName: string;
  medicineImage: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface OrderCreationRequest {
  shippingAddress: string;
  paymentMethod: string;
  items?: { medicineId: string; quantity: number }[];
}

export enum OrderStatus {
  PENDING_PAYMENT = "Pending Payment",
  CONFIRMED = "Confirmed",
  SAMPLE_COLLECTION_SCHEDULED = "Sample Collection Scheduled",
  SAMPLE_COLLECTED = "Sample Collected",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

export enum PaymentStatus {
  PENDING = "Pending",
  PAID = "Paid",
  FAILED = "Failed",
  REFUNDED = "Refunded",
}

export enum TestStatus {
  ORDERED = "Ordered",
  SAMPLE_COLLECTED = "Sample Collected",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
}

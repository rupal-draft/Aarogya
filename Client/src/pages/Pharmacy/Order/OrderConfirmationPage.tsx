"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { Order } from "../../../types/order"
import { getOrderById } from "../../../Services/orderService"
import LoadingSpinner from "../../../components/Spinners/LoadingSpinner"
import ErrorDisplay from "../../../components/Error/ErrorDisplay"


const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      try {
        setLoading(true)
        setError(null)
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (err) {
        console.error("Error fetching order:", err)
        setError("Failed to load order details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Generate estimated delivery date (7 days from order date)
  const getEstimatedDeliveryDate = (orderDate: string) => {
    const date = new Date(orderDate)
    date.setDate(date.getDate() + 7)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <ErrorDisplay message={error || "Order not found"} onRetry={() => window.location.reload()} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-teal-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-teal-100">Thank you for your purchase.</p>
          </div>

          {/* Order details */}
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="text-sm font-medium text-gray-500">ORDER NUMBER</h2>
                <p className="text-lg font-bold text-gray-900">{order.orderNumber || order.id}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">ORDER DATE</h2>
                <p className="text-lg font-bold text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-4">
                      <img
                        src={item.medicineImage || "/placeholder.svg?height=64&width=64"}
                        alt={item.medicineName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900">{item.medicineName}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-base font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Shipping</span>
                <span className="text-sm font-medium text-gray-900">$0.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Tax</span>
                <span className="text-sm font-medium text-gray-900">${(order.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-medium text-teal-600">${(order.totalAmount * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">SHIPPING ADDRESS</h2>
                  <p className="text-sm text-gray-900 whitespace-pre-line">{order.shippingAddress}</p>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">PAYMENT METHOD</h2>
                  <p className="text-sm text-gray-900">
                    {order.paymentMethod === "CREDIT_CARD"
                      ? "Credit Card"
                      : order.paymentMethod === "PAYPAL"
                        ? "PayPal"
                        : "Cash on Delivery"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Estimated Delivery Date</p>
                    <p className="text-sm text-gray-600">{getEstimatedDeliveryDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-teal-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Status</p>
                    <p className="text-sm text-gray-600">
                      {order.status === "PENDING"
                        ? "Pending"
                        : order.status === "PROCESSING"
                          ? "Processing"
                          : order.status === "SHIPPED"
                            ? "Shipped"
                            : order.status === "DELIVERED"
                              ? "Delivered"
                              : "Cancelled"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-6">A confirmation email has been sent to your email address.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/medicines"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/orders"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View All Orders
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage

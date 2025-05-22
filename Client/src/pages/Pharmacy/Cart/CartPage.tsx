"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "../../../context/Cart/CartContext"
import EmptyState from "../../../components/Pharmacy/EmptyState"


const CartPage = () => {
  const { cart, loading, error, updateItem, removeItem } = useCart()
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleQuantityChange = async (medicineId: string, quantity: number) => {
    if (quantity < 1) return

    try {
      setUpdatingItemId(medicineId)
      await updateItem(medicineId, quantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setUpdatingItemId(null)
    }
  }

  const handleRemoveItem = async (medicineId: string) => {
    try {
      setRemovingItemId(medicineId)
      await removeItem(medicineId)
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setRemovingItemId(null)
    }
  }

  const proceedToCheckout = () => {
    navigate("/pharmacy/checkout")
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="rounded-md bg-gray-200 h-16 w-16"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Cart</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added any medicines to your cart yet."
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            actionText="Browse Medicines"
            actionLink="/medicines"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Cart header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                {cart.totalItems} {cart.totalItems === 1 ? "Item" : "Items"}
              </h2>
              <Link to="/medicines" className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add More Items
              </Link>
            </div>
          </div>

          {/* Cart items */}
          <ul className="divide-y divide-gray-200">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.li
                  key={item.medicineId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, overflow: "hidden" }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    {/* Product image */}
                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-4 mb-4 sm:mb-0">
                      <img
                        src={item.medicineImage || "/placeholder.svg?height=80&width=80"}
                        alt={item.medicineName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/medicines/${item.medicineId}`}
                        className="text-lg font-medium text-gray-900 hover:text-teal-600"
                      >
                        {item.medicineName}
                      </Link>

                      {/* Price */}
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Prescription badge */}
                      {item.prescriptionRequired && (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Prescription Required
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center mt-4 sm:mt-0">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.medicineId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItemId === item.medicineId}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.medicineId, item.quantity + 1)}
                          disabled={updatingItemId === item.medicineId}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveItem(item.medicineId)}
                        disabled={removingItemId === item.medicineId}
                        className="ml-4 text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {removingItemId === item.medicineId ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="mt-4 text-right">
                    <span className="text-sm text-gray-500">Subtotal:</span>
                    <span className="ml-2 text-base font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Cart summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center text-base font-medium text-gray-900">
              <span>Total</span>
              <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          </div>
        </div>

        {/* Prescription notice */}
        {cart.items.some((item) => item.prescriptionRequired) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Some items in your cart require a valid prescription. Please have your prescription ready to upload
                  during checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to="/medicines"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Continue Shopping
          </Link>

          <motion.button
            onClick={proceedToCheckout}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Proceed to Checkout
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default CartPage

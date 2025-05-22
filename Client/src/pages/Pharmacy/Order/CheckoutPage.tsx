"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import { useCart } from "../../../context/Cart/CartContext"
import { createOrderFromCart } from "../../../Services/orderService"
import EmptyState from "../../../components/Pharmacy/EmptyState"

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  paymentMethod: "CREDIT_CARD" | "PAYPAL" | "CASH_ON_DELIVERY"
  cardNumber?: string
  cardExpiry?: string
  cardCvv?: string
  prescriptionFile?: File | null
}

interface FormErrors {
  [key: string]: string
}

const CheckoutPage = () => {
  const { cart, loading: cartLoading, error: cartError, clearItems } = useCart()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "CREDIT_CARD",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    prescriptionFile: null,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false)

  // Check if any item requires prescription
  const requiresPrescription = cart?.items.some((item) => item.prescriptionRequired) || false

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle file upload for prescription
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, prescriptionFile: file }))

    // Clear error when user uploads a file
    if (errors.prescriptionFile) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.prescriptionFile
        return newErrors
      })
    }
  }

  // Validate form data
  const validateForm = (step: 1 | 2): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
      if (!formData.address.trim()) newErrors.address = "Address is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (!formData.state.trim()) newErrors.state = "State is required"
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
    }

    if (step === 2) {
      if (formData.paymentMethod === "CREDIT_CARD") {
        if (!formData.cardNumber?.trim()) newErrors.cardNumber = "Card number is required"
        else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
          newErrors.cardNumber = "Card number must be 16 digits"

        if (!formData.cardExpiry?.trim()) newErrors.cardExpiry = "Expiry date is required"
        else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry))
          newErrors.cardExpiry = "Expiry date must be in MM/YY format"

        if (!formData.cardCvv?.trim()) newErrors.cardCvv = "CVV is required"
        else if (!/^\d{3,4}$/.test(formData.cardCvv)) newErrors.cardCvv = "CVV must be 3 or 4 digits"
      }

      if (requiresPrescription && !formData.prescriptionFile) {
        newErrors.prescriptionFile = "Prescription is required for some items in your cart"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateForm(1)) {
      setStep(2)
      if (requiresPrescription) {
        setShowPrescriptionUpload(true)
      }
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setStep(1)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm(step)) return

    try {
      setIsSubmitting(true)

      // Format shipping address
      const shippingAddress = `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.phone}`

      // Create order from cart
      const order = await createOrderFromCart(shippingAddress, formData.paymentMethod)

      // Clear cart after successful order
      await clearItems()

      // Redirect to order confirmation page
      navigate(`/pharmacy/order-confirmation/${order.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      setErrors({
        submit: "Failed to place your order. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (cartError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
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
            <p className="text-gray-600 mb-4">{cartError}</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>
          <EmptyState
            title="Your cart is empty"
            description="You need to add items to your cart before proceeding to checkout."
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

        {/* Checkout steps */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <div className={`text-sm font-medium ${step >= 1 ? "text-teal-600" : "text-gray-500"}`}>
              Shipping Information
            </div>
            <div className={`text-sm font-medium ${step >= 2 ? "text-teal-600" : "text-gray-500"}`}>
              Payment & Review
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-teal-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(step / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md p-6 mb-6"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Full Name */}
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${
                            errors.fullName ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${
                            errors.email ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          errors.phone ? "border-red-300" : "border-gray-300"
                        } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`block w-full rounded-md border ${
                          errors.address ? "border-red-300" : "border-gray-300"
                        } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* City */}
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${
                            errors.city ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${
                            errors.state ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                      </div>

                      {/* ZIP Code */}
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className={`block w-full rounded-md border ${
                            errors.zipCode ? "border-red-300" : "border-gray-300"
                          } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                        />
                        {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <Link
                        to="/cart"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Back to Cart
                      </Link>

                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Payment
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Payment Method */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>

                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            id="credit-card"
                            name="paymentMethod"
                            type="radio"
                            value="CREDIT_CARD"
                            checked={formData.paymentMethod === "CREDIT_CARD"}
                            onChange={handleChange}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                            Credit Card
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="paypal"
                            name="paymentMethod"
                            type="radio"
                            value="PAYPAL"
                            checked={formData.paymentMethod === "PAYPAL"}
                            onChange={handleChange}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                            PayPal
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="cash-on-delivery"
                            name="paymentMethod"
                            type="radio"
                            value="CASH_ON_DELIVERY"
                            checked={formData.paymentMethod === "CASH_ON_DELIVERY"}
                            onChange={handleChange}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                          />
                          <label htmlFor="cash-on-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                            Cash on Delivery
                          </label>
                        </div>
                      </div>

                      {/* Credit Card Details */}
                      {formData.paymentMethod === "CREDIT_CARD" && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Card Number */}
                            <div>
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number *
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                placeholder="1234 5678 9012 3456"
                                className={`block w-full rounded-md border ${
                                  errors.cardNumber ? "border-red-300" : "border-gray-300"
                                } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                              />
                              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                            </div>

                            {/* Card Expiry */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                  Expiry Date *
                                </label>
                                <input
                                  type="text"
                                  id="cardExpiry"
                                  name="cardExpiry"
                                  value={formData.cardExpiry}
                                  onChange={handleChange}
                                  placeholder="MM/YY"
                                  className={`block w-full rounded-md border ${
                                    errors.cardExpiry ? "border-red-300" : "border-gray-300"
                                  } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                                />
                                {errors.cardExpiry && <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>}
                              </div>

                              {/* Card CVV */}
                              <div>
                                <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                                  CVV *
                                </label>
                                <input
                                  type="text"
                                  id="cardCvv"
                                  name="cardCvv"
                                  value={formData.cardCvv}
                                  onChange={handleChange}
                                  placeholder="123"
                                  className={`block w-full rounded-md border ${
                                    errors.cardCvv ? "border-red-300" : "border-gray-300"
                                  } px-3 py-2 focus:outline-none focus:ring-teal-500 focus:border-teal-500`}
                                />
                                {errors.cardCvv && <p className="mt-1 text-sm text-red-600">{errors.cardCvv}</p>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Prescription Upload */}
                    {showPrescriptionUpload && (
                      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Prescription Upload</h2>
                        <p className="text-sm text-gray-600 mb-4">
                          Some items in your cart require a valid prescription. Please upload a clear image or PDF of
                          your prescription.
                        </p>

                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                          <input
                            type="file"
                            id="prescriptionFile"
                            name="prescriptionFile"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png,.pdf"
                            className="hidden"
                          />
                          <label
                            htmlFor="prescriptionFile"
                            className="cursor-pointer flex flex-col items-center justify-center"
                          >
                            {formData.prescriptionFile ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-green-500 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">
                                  {formData.prescriptionFile.name}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">Click to change file</span>
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-gray-400 mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                <span className="text-sm font-medium text-gray-900">
                                  Drag and drop your file here or click to browse
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  Supported formats: JPG, JPEG, PNG, PDF
                                </span>
                              </>
                            )}
                          </label>
                        </div>
                        {errors.prescriptionFile && (
                          <p className="mt-2 text-sm text-red-600">{errors.prescriptionFile}</p>
                        )}
                      </div>
                    )}

                    {/* Submit error */}
                    {errors.submit && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-600"
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
                            <p className="text-sm text-red-700">{errors.submit}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <motion.button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Back
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            Processing...
                          </>
                        ) : (
                          <>
                            Place Order
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 ml-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.medicineId} className="flex items-center">
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-3">
                      <img
                        src={item.medicineImage || "/placeholder.svg?height=48&width=48"}
                        alt={item.medicineName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.medicineName}</p>
                      <p className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${(cart.totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-teal-600">${(cart.totalAmount * 1.1).toFixed(2)}</span>
                </div>
              </div>

              {/* Secure checkout badge */}
              <div className="mt-6 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

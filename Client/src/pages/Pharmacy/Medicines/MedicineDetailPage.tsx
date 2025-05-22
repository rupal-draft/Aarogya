"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import type { MedicineResponseDTO } from "../../../types/medicine"
import { useCart } from "../../../context/Cart/CartContext"
import { fetchMedicinesByCategory, getMedicineById } from "../../../Services/medicineService"
import LoadingSpinner from "../../../components/Spinners/LoadingSpinner"
import ErrorDisplay from "../../../components/Error/ErrorDisplay"


const MedicineDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [medicine, setMedicine] = useState<MedicineResponseDTO | null>(null)
  const [relatedMedicines, setRelatedMedicines] = useState<MedicineResponseDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchMedicine = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        const data = await getMedicineById(id)
        setMedicine(data)
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0])
        }

        const related = await fetchMedicinesByCategory(data.category)
        const filteredRelated = related.filter(med => med.id !== id).slice(0, 4)
setRelatedMedicines(filteredRelated)
      } catch (err) {
        setError("Failed to load medicine details. Please try again.")
        console.error("Error fetching medicine:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
    // Reset state when ID changes
    setQuantity(1)
    setAddedToCart(false)
  }, [id])

  const handleQuantityChange = (value: number) => {
    if (!medicine) return

    // Ensure quantity is between 1 and available stock
    const newQuantity = Math.max(1, Math.min(value, medicine.stockQuantity))
    setQuantity(newQuantity)
  }

  const handleAddToCart = async () => {
    if (!medicine || !isInStock || isAddingToCart) return

    try {
      setIsAddingToCart(true)
      await addItem(medicine.id, quantity)
      setAddedToCart(true)
      setTimeout(() => {
        setAddedToCart(false)
      }, 3000)
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Check if medicine is in stock
  const isInStock = medicine && medicine.stockQuantity > 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center text-sm">
            <li>
              <Link to="/" className="text-teal-600 hover:text-teal-800">
                Home
              </Link>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li>
              <Link to="/medicines" className="text-teal-600 hover:text-teal-800">
                Medicines
              </Link>
            </li>
            <li className="mx-2 text-gray-500">/</li>
            <li className="text-gray-600 truncate max-w-[200px]">{loading ? "Loading..." : medicine?.name}</li>
          </ol>
        </nav>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <LoadingSpinner />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
            </motion.div>
          ) : medicine ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                  {/* Left column - Images */}
                  <div className="md:w-1/2 p-6">
                    {/* Main image */}
                    <motion.div
                      className="relative h-80 rounded-lg overflow-hidden bg-gray-100 mb-4"
                      layoutId={`medicine-image-${medicine.id}`}
                    >
                      <img
                        src={
                          selectedImage ||
                          (medicine.images.length > 0 ? medicine.images[0] : "/placeholder.svg?height=400&width=600")
                        }
                        alt={medicine.name}
                        className="w-full h-full object-contain"
                      />

                      {/* Prescription badge */}
                      {medicine.prescriptionRequired && (
                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                          Prescription Required
                        </div>
                      )}
                    </motion.div>

                    {/* Thumbnail images */}
                    {medicine.images.length > 1 && (
                      <div className="flex space-x-2 overflow-x-auto pb-2">
                        {medicine.images.map((image, index) => (
                          <motion.button
                            key={index}
                            className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                              selectedImage === image ? "border-teal-500" : "border-transparent"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${medicine.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right column - Details */}
                  <div className="md:w-1/2 p-6 md:border-l border-gray-200">
                    <div className="mb-6">
                      <div className="text-sm text-teal-600 font-medium uppercase tracking-wide mb-1">
                        {medicine.category}
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h1>
                      <p className="text-gray-600 mb-4">
                        Manufactured by <span className="font-medium">{medicine.manufacturer}</span>
                      </p>

                      {/* Price and stock */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-3xl font-bold text-gray-900">${Number(medicine.price).toFixed(2)}</div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isInStock ? `${medicine.stockQuantity} in stock` : "Out of stock"}
                        </div>
                      </div>

                      {/* Add to cart section */}
                      {isInStock && (
                        <div className="mb-8">
                          <div className="flex items-center mb-4">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-4">
                              Quantity:
                            </label>
                            <div className="flex items-center">
                              <motion.button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                                className={`w-8 h-8 flex items-center justify-center rounded-l-md ${
                                  quantity <= 1
                                    ? "bg-gray-200 text-gray-400"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                                whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </motion.button>

                              <input
                                type="number"
                                id="quantity"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                                min="1"
                                max={medicine.stockQuantity}
                                className="w-12 h-8 text-center border-y border-gray-200 focus:outline-none"
                              />

                              <motion.button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= medicine.stockQuantity}
                                className={`w-8 h-8 flex items-center justify-center rounded-r-md ${
                                  quantity >= medicine.stockQuantity
                                    ? "bg-gray-200 text-gray-400"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                                whileHover={quantity < medicine.stockQuantity ? { scale: 1.1 } : {}}
                                whileTap={quantity < medicine.stockQuantity ? { scale: 0.9 } : {}}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </motion.button>
                            </div>
                          </div>

                          <div className="flex space-x-4">
                            <motion.button
                              onClick={handleAddToCart}
                              disabled={isAddingToCart}
                              className={`flex-1 flex items-center justify-center bg-teal-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                                isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                              }`}
                              whileHover={{ scale: isAddingToCart ? 1 : 1.02 }}
                              whileTap={{ scale: isAddingToCart ? 1 : 0.98 }}
                            >
                              {isAddingToCart ? (
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
                                  Adding...
                                </>
                              ) : addedToCart ? (
                                <>
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
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Added to Cart
                                </>
                              ) : (
                                <>
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
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                  </svg>
                                  Add to Cart
                                </>
                              )}
                            </motion.button>

                            <motion.button
                              className="flex items-center justify-center w-12 h-12 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </motion.button>
                          </div>
                        </div>
                      )}

                      {/* Prescription warning */}
                      {medicine.prescriptionRequired && (
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
                                This medicine requires a valid prescription. Please upload your prescription during
                                checkout.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key information */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">Description</h3>
                          <p className="mt-1 text-sm text-gray-600">{medicine.description}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-sm font-medium text-gray-900">Key Information</h3>
                          <dl className="mt-2 divide-y divide-gray-200">
                            <div className="flex justify-between py-2">
                              <dt className="text-sm text-gray-600">Manufacturing Date</dt>
                              <dd className="text-sm font-medium text-gray-900">
                                {formatDate(medicine.manufacturingDate)}
                              </dd>
                            </div>
                            <div className="flex justify-between py-2">
                              <dt className="text-sm text-gray-600">Expiry Date</dt>
                              <dd className="text-sm font-medium text-gray-900">{formatDate(medicine.expiryDate)}</dd>
                            </div>
                            <div className="flex justify-between py-2">
                              <dt className="text-sm text-gray-600">Dosage Instructions</dt>
                              <dd className="text-sm font-medium text-gray-900">{medicine.dosageInstructions}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs for additional information */}
                <div className="border-t border-gray-200">
                  <div className="px-6 py-4">
                    <div className="border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <button className="border-teal-500 text-teal-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                          Details
                        </button>
                        <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                          Active Ingredients
                        </button>
                        <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                          Side Effects
                        </button>
                      </nav>
                    </div>

                    <div className="py-6">
                      {/* Active ingredients */}
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Active Ingredients</h3>
                      <ul className="list-disc pl-5 space-y-2 mb-6">
                        {medicine.activeIngredients.map((ingredient, index) => (
                          <li key={index} className="text-gray-600">
                            {ingredient}
                          </li>
                        ))}
                      </ul>

                      {/* Side effects */}
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Side Effects</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {medicine.sideEffects.map((effect, index) => (
                          <li key={index} className="text-gray-600">
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related medicines */}
              {relatedMedicines.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedMedicines.map((relatedMedicine) => (
                      <motion.div
                        key={relatedMedicine.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden"
                      >
                        <Link to={`/medicines/${relatedMedicine.id}`} className="block">
                          <div className="h-40 overflow-hidden">
                            <img
                              src={
                                relatedMedicine.images && relatedMedicine.images.length > 0
                                  ? relatedMedicine.images[0]
                                  : "/placeholder.svg?height=160&width=240"
                              }
                              alt={relatedMedicine.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{relatedMedicine.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{relatedMedicine.manufacturer}</p>
                            <p className="mt-2 text-sm font-medium text-gray-900">
                              ${Number(relatedMedicine.price).toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default MedicineDetailPage

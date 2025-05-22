"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { MedicineResponseDTO } from "../../../types/medicine"
import { useCart } from "../../../context/Cart/CartContext"


interface MedicineCardProps {
  medicine: MedicineResponseDTO
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Format price to 2 decimal places
  const formattedPrice = Number(medicine.price).toFixed(2)

  // Check if medicine is in stock
  const isInStock = medicine.stockQuantity > 0

  // Get first image or placeholder
  const imageUrl =
    medicine.images && medicine.images.length > 0 ? medicine.images[0] : "/placeholder.svg?height=300&width=400"

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: { duration: 0.3 },
    },
  }

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling

    if (!isInStock || isAdding) return

    try {
      setIsAdding(true)
      await addItem(medicine.id, 1)
      // Show success animation
      setTimeout(() => {
        setIsAdding(false)
      }, 1000)
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      setIsAdding(false)
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white rounded-xl shadow-md overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/medicines/${medicine.id}`} className="block h-full">
        {/* Product Image */}
        <div className="relative overflow-hidden h-48">
          <motion.img
            src={imageUrl}
            alt={medicine.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Prescription Badge */}
          {medicine.prescriptionRequired && (
            <motion.div
              className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
            >
              Rx
            </motion.div>
          )}

          {/* Out of Stock Overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-md font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-teal-600 font-medium uppercase tracking-wide mb-1">{medicine.category}</div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 h-14">{medicine.name}</h3>

          {/* Manufacturer */}
          <div className="text-sm text-gray-600 mb-2">{medicine.manufacturer}</div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-800">${formattedPrice}</span>
            <span className={`text-sm ${isInStock ? "text-green-600" : "text-red-500"}`}>
              {isInStock ? `${medicine.stockQuantity} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {/* View Details Button */}
            <motion.div
              className="flex-1 py-2 rounded-md text-sm font-medium text-center bg-gray-100 text-gray-800 hover:bg-gray-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              View Details
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={!isInStock || isAdding}
              className={`px-3 py-2 rounded-md text-sm font-medium text-center ${
                isInStock
                  ? isAdding
                    ? "bg-green-500 text-white"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              whileHover={isInStock && !isAdding ? { scale: 1.03 } : {}}
              whileTap={isInStock && !isAdding ? { scale: 0.97 } : {}}
            >
              {isAdding ? (
                <svg
                  className="w-5 h-5 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default MedicineCard

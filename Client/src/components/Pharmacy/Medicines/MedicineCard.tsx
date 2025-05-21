"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import type { MedicineResponseDTO } from "../../../types/pharmacy"

interface MedicineCardProps {
  medicine: MedicineResponseDTO
}

const MedicineCard = ({ medicine }: MedicineCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

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
      <Link to={`/pharmacy/medicines/${medicine.id}`} className="block h-full">
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

          {/* View Details Button */}
          <motion.div
            className={`w-full py-2 rounded-md text-sm font-medium text-center ${
              isInStock ? "bg-teal-600 text-white" : "bg-gray-300 text-gray-600"
            }`}
            whileHover={isInStock ? { scale: 1.03 } : {}}
            whileTap={isInStock ? { scale: 0.97 } : {}}
          >
            View Details
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}

export default MedicineCard

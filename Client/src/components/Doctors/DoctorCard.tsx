"use client"

import type React from "react"
import type { DoctorResponseDTO } from "../../types/doctor"
import { motion } from "framer-motion"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Award,
  Clock,
  Calendar,
  Heart,
  Users,
} from "lucide-react"
import { getSpecializationColor, getSpecializationIcon } from "../../utils/data"

interface DoctorCardProps {
  doctor: DoctorResponseDTO
  onSelect: (doctor: DoctorResponseDTO) => void
  index: number
}



const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, index }) => {
  const SpecIcon = getSpecializationIcon(doctor.specialization)
  const specColor = getSpecializationColor(doctor.specialization)

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }


  const hoverVariants = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group cursor-pointer"
    >
      <motion.div
        variants={hoverVariants}
        className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>

        {/* Header Section */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start space-x-4">
            {/* Doctor Avatar */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative"
              >
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl || "/placeholder.svg"}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {doctor.firstName[0]}
                    {doctor.lastName[0]}
                  </span>
                )}
              </motion.div>

              {/* Online Status */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-blue-600 font-medium">{doctor.specialization}</p>

              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${specColor} mb-2`}
              >
                <SpecIcon className="w-4 h-4 mr-1" />
                {doctor.specialization}
              </div>

              <div className="flex items-center text-gray-700 text-sm">
                <Award className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{doctor.experienceYears}+ years experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-4 bg-gray-50/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                className="text-2xl font-bold text-blue-600"
              >
                4.9
              </motion.div>
              <div className="text-xs text-gray-700 flex items-center justify-center">
                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                Rating
              </div>
            </div>
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                className="text-2xl font-bold text-blue-600"
              >
                500+
              </motion.div>
              <div className="text-xs text-gray-700 flex items-center justify-center">
                <Users className="w-3 h-3 mr-1" />
                Patients
              </div>
            </div>
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                className="text-2xl font-bold text-blue-600"
              >
                98%
              </motion.div>
              <div className="text-xs text-gray-700 flex items-center justify-center">
                <Heart className="w-3 h-3 text-red-500 mr-1" />
                Success
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center text-gray-700 text-sm">
            <Mail className="w-4 h-4 mr-3 text-blue-500" />
            <span className="truncate">{doctor.email}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Phone className="w-4 h-4 mr-3 text-green-500" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <MapPin className="w-4 h-4 mr-3 text-red-500" />
            <span className="truncate">{doctor.address}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation()
              onSelect(doctor)
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
          >
            <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Book Appointment</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              →
            </motion.div>
          </motion.button>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-4 right-4 text-blue-200 opacity-50"
        >
          <Clock className="w-6 h-6" />
        </motion.div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl"></div>
      </motion.div>
    </motion.div>
  )
}


export default DoctorCard

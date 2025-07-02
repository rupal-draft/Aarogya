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
  Sparkles,
} from "lucide-react"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"

interface DoctorCardProps {
  doctor: DoctorResponseDTO
  onSelect: (doctor: DoctorResponseDTO) => void
  index: number
}



const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>()

  const handleBookAppointment = () => {
    onSelect(doctor)
  }

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        cardVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-[1.02] group relative"
        whileHover={{ y: -8 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Floating elements */}
        <motion.div
          className="absolute top-4 left-4 text-yellow-400 z-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>

        {/* Doctor Image Section */}
        <div className="relative h-64 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden">
          {doctor.imageUrl ? (
            <motion.img
              src={doctor.imageUrl || "/placeholder.svg?height=256&width=400"}
              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              whileHover={{ scale: 1.1 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-6xl border-4 border-white/30"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                👨‍⚕️
              </motion.div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

          {/* Experience Badge */}
          <motion.div
            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20"
            whileHover={{ scale: 1.1 }}
            animate={{
              boxShadow: [
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold text-gray-800">{doctor.experienceYears}+ years</span>
            </div>
          </motion.div>

          {/* Rating Badge */}
          <motion.div
            className="absolute bottom-4 left-4 bg-yellow-400/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg flex items-center space-x-1"
            whileHover={{ scale: 1.1 }}
            animate={{
              y: [0, -2, 0],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <Star className="h-4 w-4 text-white fill-current" />
            <span className="text-sm font-bold text-white">4.9</span>
          </motion.div>

          {/* Floating hearts */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-300"
            animate={{
              y: [-10, -20, -10],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
          >
            <Heart className="h-6 w-6 fill-current" />
          </motion.div>
        </div>

        {/* Doctor Info Section */}
        <div className="p-8 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-b-3xl"></div>

          <div className="relative z-10">
            {/* Name and Specialization */}
            <div className="mb-6">
              <motion.h3 className="text-2xl font-bold text-gray-900 mb-2" whileHover={{ scale: 1.02 }}>
                Dr. {doctor.firstName} {doctor.lastName}
              </motion.h3>
              <motion.div
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                    "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                    "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {doctor.specialization}
              </motion.div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              <motion.div
                className="flex items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{doctor.email}</span>
              </motion.div>

              <motion.div
                className="flex items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{doctor.phone}</span>
              </motion.div>

              <motion.div
                className="flex items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{doctor.address}</span>
              </motion.div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
                whileHover={{ scale: 1.05 }}
                animate={{
                  backgroundColor: ["rgba(239, 246, 255, 1)", "rgba(219, 234, 254, 1)", "rgba(239, 246, 255, 1)"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">150+</div>
                <div className="text-xs text-blue-500 font-medium">Appointments</div>
              </motion.div>

              <motion.div
                className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200"
                whileHover={{ scale: 1.05 }}
                animate={{
                  backgroundColor: ["rgba(240, 253, 244, 1)", "rgba(220, 252, 231, 1)", "rgba(240, 253, 244, 1)"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-xs text-green-500 font-medium">Available</div>
              </motion.div>

              <motion.div
                className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200"
                whileHover={{ scale: 1.05 }}
                animate={{
                  backgroundColor: ["rgba(253, 242, 248, 1)", "rgba(252, 231, 243, 1)", "rgba(253, 242, 248, 1)"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
              >
                <Heart className="h-6 w-6 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-pink-600">98%</div>
                <div className="text-xs text-pink-500 font-medium">Satisfaction</div>
              </motion.div>
            </div>

            {/* License Information */}
            <motion.div
              className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mr-3">
                  <Award className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Medical License</div>
                  <div className="text-xs text-gray-600">{doctor.licenseNumber}</div>
                </div>
              </div>
            </motion.div>

            {/* Book Appointment Button */}
            <motion.button
              onClick={handleBookAppointment}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
              whileTap={{ scale: 0.98 }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                backgroundPosition: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              <div className="relative z-10 flex items-center justify-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>Book Appointment</span>
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                  →
                </motion.div>
              </div>

              {/* Floating particles */}
              <motion.div
                className="absolute top-2 right-4 text-white/50"
                animate={{
                  y: [-2, -8, -2],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  )
}


export default DoctorCard

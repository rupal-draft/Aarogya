"use client"

import type React from "react"
import { useState, useEffect } from "react"

import DoctorCard from "./DoctorCard"
import type { DoctorResponseDTO } from "../../types/doctor"
import { motion, AnimatePresence } from "framer-motion"
import { getDoctorsBySpecialization } from "../../Services/doctor"
import { specializations } from "../../utils/data"
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Award,
  Users,
} from "lucide-react"

interface DoctorSearchProps {
  onDoctorSelect: (doctor: DoctorResponseDTO) => void
}

const DoctorSearch: React.FC<DoctorSearchProps> = ({ onDoctorSelect }) => {
  const [doctors, setDoctors] = useState<DoctorResponseDTO[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorResponseDTO[]>([])
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [doctors, selectedSpecialization, searchQuery])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const {data} = await getDoctorsBySpecialization()
      setDoctors(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch doctors. Please try again.")
      console.error("Error fetching doctors:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterDoctors = () => {
    let filtered = doctors

    if (selectedSpecialization !== "All Specializations") {
      filtered = filtered.filter(
        (doctor) => doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase(),
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(query) ||
          doctor.lastName.toLowerCase().includes(query) ||
          doctor.specialization.toLowerCase().includes(query),
      )
    }

    setFilteredDoctors(filtered)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full"
          />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-red-500 text-6xl mb-6"
          >
            ⚠️
          </motion.div>
          <h3 className="text-xl font-bold text-red-800 mb-4">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchDoctors}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Search Hero Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Find Your Perfect Doctor
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-lg"
            >
              Search through our network of qualified healthcare professionals
            </motion.p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <motion.input
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg text-gray-900 bg-white/95 backdrop-blur-sm border-0 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/30 pl-14 shadow-xl"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Filter className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
          className="absolute top-4 right-4 text-white/20"
        >
          <Award size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-4 left-4 text-white/20"
        >
          <Star size={35} />
        </motion.div>
      </motion.div>

      {/* Specialization Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Filter className="w-6 h-6 mr-3 text-blue-500" />
                Filter by Specialization
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {specializations.map((spec, index) => {
                  const Icon = spec.icon
                  const isSelected = selectedSpecialization === spec.name

                  return (
                    <motion.button
                      key={spec.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSpecialization(spec.name)}
                      className={`p-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? `bg-gradient-to-r ${spec.color} text-white shadow-lg`
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className="w-6 h-6" />
                        <span className="text-center leading-tight">{spec.name}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-7 h-7 mr-3 text-blue-500" />
            Available Doctors ({filteredDoctors.length})
          </h3>
          {selectedSpecialization !== "All Specializations" && (
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mt-2"
            >
              <MapPin className="w-4 h-4 mr-1" />
              {selectedSpecialization}
            </motion.span>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Available Today</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Top Rated</span>
          </div>
        </div>
      </motion.div>

      {/* Doctors Grid */}
      <AnimatePresence mode="wait">
  {filteredDoctors.length === 0 ? (
    <motion.div
      key="no-results"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-8xl mb-6"
      >
        👨‍⚕️
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">No doctors found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any doctors matching your criteria. Try adjusting your search or filters.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSearchQuery("")
          setSelectedSpecialization("All Specializations")
        }}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
      >
        Clear Filters
      </motion.button>
    </motion.div>
  ) : (
    <motion.div
      key="doctor-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.95 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {filteredDoctors.map((doctor, index) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onSelect={onDoctorSelect}
          index={index}
        />
      ))}
    </motion.div>
  )}
</AnimatePresence>

    </motion.div>
  )
}

export default DoctorSearch

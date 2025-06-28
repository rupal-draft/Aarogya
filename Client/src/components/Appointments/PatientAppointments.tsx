"use client"

import type React from "react"
import { useState, useEffect } from "react"

import AppointmentCard from "./AppointmentCard"
import type { AppointmentResponseDto } from "../../types/appointment"
import {AppointmentStatus } from "../../types/appointment"
import { getPatientAppointments } from "../../Services/appointment"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Filter,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface PatientAppointmentsProps {
  onBack: () => void
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ onBack }) => {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    page: 0,
    size: 10,
  })
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [filters])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPatientAppointments(
        filters.status || undefined,
        filters.date || undefined,
        filters.page,
        filters.size,
      )

      setAppointments(response.content)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)
    } catch (err) {
      setError("Failed to fetch appointments. Please try again.")
      console.error("Error fetching appointments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === "page" ? Number(value) : 0,
    }))
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case AppointmentStatus.CONFIRMED:
        return "bg-green-100 text-green-800 border-green-200"
      case AppointmentStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-200"
      case AppointmentStatus.COMPLETED:
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return Clock
      case AppointmentStatus.CONFIRMED:
        return CheckCircle
      case AppointmentStatus.CANCELLED:
        return XCircle
      case AppointmentStatus.COMPLETED:
        return CheckCircle
      default:
        return Calendar
    }
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

  if (loading && appointments.length === 0) {
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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Floating Background Elements */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"
        />

        <div className="relative z-10 p-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mb-6 flex items-center text-white/80 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Booking
          </motion.button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-2 flex items-center"
              >
                <Calendar className="w-10 h-10 mr-4" />
                My Appointments
              </motion.h2>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-green-100 text-lg"
              >
                {totalElements} appointment{totalElements !== 1 ? "s" : ""} found
              </motion.p>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 md:mt-0"
            >
              <div className="text-6xl">📅</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.values(AppointmentStatus).map((status) => {
          const Icon = getStatusIcon(status)
          const count = appointments.filter((apt) => apt.status === status).length

          return (
            <motion.div
              key={status}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`p-6 rounded-2xl border-2 ${getStatusColor(status)} text-center`}
            >
              <Icon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm font-medium">{status}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Filter className="w-6 h-6 mr-3 text-blue-500" />
              Filter Appointments
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Hide" : "Show"} Filters</span>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {Object.values(AppointmentStatus).map((status) => {
                      const Icon = getStatusIcon(status)
                      return (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      )
                    })}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Page Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Items per page
                  </label>
                  <select
                    id="size"
                    value={filters.size}
                    onChange={(e) => handleFilterChange("size", Number.parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                {/* Refresh Button */}
                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchAppointments}
                    className="w-full px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </motion.button>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.status || filters.date) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.status && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(filters.status as AppointmentStatus)} flex items-center space-x-1`}
                    >
                      <span>{filters.status}</span>
                      <button onClick={() => handleFilterChange("status", "")} className="hover:text-red-600 ml-1">
                        ×
                      </button>
                    </motion.span>
                  )}
                  {filters.date && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200 flex items-center space-x-1"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(filters.date).toLocaleDateString()}</span>
                      <button onClick={() => handleFilterChange("date", "")} className="hover:text-red-600 ml-1">
                        ×
                      </button>
                    </motion.span>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            className="text-red-500 text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Appointments</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAppointments}
            className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
          >
            Try Again
          </motion.button>
        </motion.div>
      )}

      {/* Appointments List */}
      {!error && (
        <div className="space-y-6">
          {appointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-8xl mb-6"
              >
                📅
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No appointments found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filters.status || filters.date
                  ? "Try adjusting your filters or book a new appointment"
                  : "You haven't booked any appointments yet. Start your healthcare journey today!"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center space-x-3 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Book New Appointment</span>
              </motion.button>
            </motion.div>
          ) : (
            <>
              <motion.div variants={containerVariants} className="space-y-6">
                {appointments.map((appointment, index) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div variants={itemVariants} className="flex justify-center items-center space-x-4 mt-12">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange("page", Math.max(0, filters.page - 1))}
                    disabled={filters.page === 0 || loading}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </motion.button>

                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(0, Math.min(totalPages - 5, filters.page - 2)) + i
                      return (
                        <motion.button
                          key={pageNum}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleFilterChange("page", pageNum)}
                          className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                            filters.page === pageNum
                              ? "bg-blue-500 text-white shadow-lg"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum + 1}
                        </motion.button>
                      )
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange("page", Math.min(totalPages - 1, filters.page + 1))}
                    disabled={filters.page >= totalPages - 1 || loading}
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}

              {/* Loading overlay for pagination */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <RefreshCw className="w-8 h-8 text-blue-500" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

export default PatientAppointments

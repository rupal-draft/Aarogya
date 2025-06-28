"use client"

import type React from "react"
import { useState, useEffect } from "react"

import AppointmentCard from "./AppointmentCard"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import type { AppointmentResponseDto } from "../../types/appointment"
import {AppointmentStatus } from "../../types/appointment"
import { getPatientAppointments } from "../../Services/appointment"

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

  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [filtersRef, filtersVisible] = useScrollAnimation<HTMLDivElement>()

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
        return "⏳"
      case AppointmentStatus.CONFIRMED:
        return "✅"
      case AppointmentStatus.CANCELLED:
        return "❌"
      case AppointmentStatus.COMPLETED:
        return "✔️"
      default:
        return "📅"
    }
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        ref={headerRef}
        className={`transition-all duration-1000 ${
          headerVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <button
            onClick={onBack}
            className="mb-6 flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <span className="text-xl mr-2">←</span>
            Back to Booking
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h2>
              <p className="text-gray-600">
                {totalElements} appointment{totalElements !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        ref={filtersRef}
        className={`transition-all duration-1000 delay-200 ${
          filtersVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Appointments</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                {Object.values(AppointmentStatus).map((status) => (
                  <option key={status} value={status}>
                    {getStatusIcon(status)} {status}
                  </option>
                ))}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.status || filters.date) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.status && (
                <span
                  className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(filters.status as AppointmentStatus)}`}
                >
                  {getStatusIcon(filters.status as AppointmentStatus)} {filters.status}
                  <button onClick={() => handleFilterChange("status", "")} className="ml-2 hover:text-red-600">
                    ×
                  </button>
                </span>
              )}
              {filters.date && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-200">
                  📅 {new Date(filters.date).toLocaleDateString()}
                  <button onClick={() => handleFilterChange("date", "")} className="ml-2 hover:text-red-600">
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Appointments</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAppointments}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Appointments List */}
      {!error && (
        <div className="space-y-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-6">
                {filters.status || filters.date
                  ? "Try adjusting your filters or book a new appointment"
                  : "You haven't booked any appointments yet"}
              </p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Book New Appointment
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6">
                {appointments.map((appointment, index) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => handleFilterChange("page", Math.max(0, filters.page - 1))}
                    disabled={filters.page === 0 || loading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(0, Math.min(totalPages - 5, filters.page - 2)) + i
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleFilterChange("page", pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                            filters.page === pageNum
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => handleFilterChange("page", Math.min(totalPages - 1, filters.page + 1))}
                    disabled={filters.page >= totalPages - 1 || loading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Loading overlay for pagination */}
              {loading && (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default PatientAppointments

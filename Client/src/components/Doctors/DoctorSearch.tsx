"use client"

import type React from "react"
import { useState, useEffect } from "react"

import DoctorCard from "./DoctorCard"
import type { DoctorResponseDTO } from "../../types/doctor"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import { getDoctorsBySpecialization } from "../../Services/doctor"
import { specializations } from "../../utils/data"

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

  const [searchRef, searchVisible] = useScrollAnimation<HTMLDivElement>()
  const [filtersRef, filtersVisible] = useScrollAnimation<HTMLDivElement>()

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    filterDoctors()
  }, [doctors, selectedSpecialization, searchQuery])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const data = await getDoctorsBySpecialization()
      setDoctors(data.data)
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

    // Filter by specialization
    if (selectedSpecialization !== "All Specializations") {
      filtered = filtered.filter(
        (doctor) => doctor.specialization.toLowerCase() === selectedSpecialization.toLowerCase(),
      )
    }

    // Filter by search query
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Doctors</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDoctors}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div
        ref={searchRef}
        className={`transition-all duration-1000 ${
          searchVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Your Doctor</h2>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search by doctor name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 pl-14"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div
        ref={filtersRef}
        className={`transition-all duration-1000 delay-200 ${
          filtersVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Specialization</h3>
          <div className="flex flex-wrap gap-3">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSpecialization === spec
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Available Doctors ({filteredDoctors.length})</h3>
          {selectedSpecialization !== "All Specializations" && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {selectedSpecialization}
            </span>
          )}
        </div>

        {filteredDoctors?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors?.map((doctor, index) => (
              <DoctorCard key={doctor.id} doctor={doctor} onSelect={onDoctorSelect} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorSearch

"use client"

import type React from "react"
import type { DoctorResponseDTO } from "../../types/doctor"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"


interface DoctorCardProps {
  doctor: DoctorResponseDTO
  onSelect: (doctor: DoctorResponseDTO) => void
  index: number
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>()

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        cardVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 group">
        {/* Doctor Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl || "/placeholder.svg"}
              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl">👨‍⚕️</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Experience Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold text-gray-800">{doctor.experienceYears}+ years</span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Dr. {doctor.firstName} {doctor.lastName}
            </h3>
            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <span className="text-lg mr-3">📧</span>
              <span className="text-sm">{doctor.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-lg mr-3">📞</span>
              <span className="text-sm">{doctor.phone}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-lg mr-3">📍</span>
              <span className="text-sm">{doctor.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-lg mr-3">🏥</span>
              <span className="text-sm">License: {doctor.licenseNumber}</span>
            </div>
          </div>

          <button
            onClick={() => onSelect(doctor)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard

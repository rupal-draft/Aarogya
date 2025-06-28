"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  type DoctorResponseDTO,
  type DoctorAvailabilityResponse,
  type AvailableSlotDTO,
} from "../../types/doctor"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import { getDoctorAvailability } from "../../Services/doctor"

interface DoctorAvailabilityProps {
  doctor: DoctorResponseDTO
  onSlotSelect: (date: string, slot: { startTime: string; endTime: string }) => void
  onBack: () => void
}

const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({ doctor, onSlotSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [availabilityData, setAvailabilityData] = useState<DoctorAvailabilityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()
  const [calendarRef, calendarVisible] = useScrollAnimation<HTMLDivElement>()
  const [slotsRef, slotsVisible] = useScrollAnimation<HTMLDivElement>()

  useEffect(() => {
    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setSelectedDate(tomorrow.toISOString().split("T")[0])
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability()
    }
  }, [selectedDate])

  const fetchAvailability = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDoctorAvailability(doctor.id, selectedDate)
      setAvailabilityData(data)
    } catch (err) {
      setError("Failed to fetch availability. Please try again.")
      console.error("Error fetching availability:", err)
    } finally {
      setLoading(false)
    }
  }

  const generateDateOptions = () => {
    const dates = []
    const today = new Date()

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        }),
      })
    }

    return dates
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleSlotClick = (slot: AvailableSlotDTO) => {
    if (slot.available) {
      onSlotSelect(selectedDate, {
        startTime: slot.startTime,
        endTime: slot.endTime,
      })
    }
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
            Back to Search
          </button>

          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
              {doctor.imageUrl ? (
                <img
                  src={doctor.imageUrl || "/placeholder.svg"}
                  alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl">👨‍⚕️</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h2>
              <p className="text-blue-600 font-medium text-lg">{doctor.specialization}</p>
              <p className="text-gray-600">{doctor.experienceYears}+ years experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div
        ref={calendarRef}
        className={`transition-all duration-1000 delay-200 ${
          calendarVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Select Date</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {generateDateOptions().map((date) => (
              <button
                key={date.value}
                onClick={() => setSelectedDate(date.value)}
                className={`p-4 rounded-xl text-center transition-all duration-200 ${
                  selectedDate === date.value
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105"
                }`}
              >
                <div className="font-semibold">{date.label.split(",")[0]}</div>
                <div className="text-sm opacity-75">{date.label.split(",")[1]}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Slots */}
      {selectedDate && (
        <div
          ref={slotsRef}
          className={`transition-all duration-1000 delay-400 ${
            slotsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Available Time Slots -{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchAvailability}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : availabilityData ? (
              <div>
                {/* Doctor Schedule Info */}
                {availabilityData.availability && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Doctor's Schedule</h4>
                    <div className="text-sm text-blue-800">
                      <p>
                        Working Hours: {formatTime(availabilityData.availability.startTime)} -{" "}
                        {formatTime(availabilityData.availability.endTime)}
                      </p>
                      {availabilityData.availability.breakStart && availabilityData.availability.breakEnd && (
                        <p>
                          Break Time: {formatTime(availabilityData.availability.breakStart)} -{" "}
                          {formatTime(availabilityData.availability.breakEnd)}
                        </p>
                      )}
                      <p>Slot Duration: {availabilityData.availability.slotDuration} minutes</p>
                    </div>
                  </div>
                )}

                {/* Time Slots */}
                {availabilityData.availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availabilityData.availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSlotClick(slot)}
                        disabled={!slot.available}
                        className={`p-4 rounded-xl text-center transition-all duration-200 ${
                          slot.available
                            ? "bg-green-50 text-green-800 border-2 border-green-200 hover:bg-green-100 hover:scale-105 hover:shadow-md"
                            : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                        }`}
                      >
                        <div className="font-semibold">{formatTime(slot.startTime)}</div>
                        <div className="text-sm opacity-75">{formatTime(slot.endTime)}</div>
                        <div className="text-xs mt-1">{slot.available ? "✅ Available" : "❌ Booked"}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">No slots available</h4>
                    <p className="text-gray-600">Please try a different date</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorAvailability

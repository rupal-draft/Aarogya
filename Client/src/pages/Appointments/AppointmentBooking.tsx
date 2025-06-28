"use client"

import React, { useState } from "react"
import type { DoctorResponseDTO } from "../../types/doctor"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import EmergencyAppointmentForm from "../../components/Appointments/EmergencyAppointmentForm"
import PatientAppointments from "../../components/Appointments/PatientAppointments"
import DoctorSearch from "../../components/Doctors/DoctorSearch"
import DoctorAvailability from "../../components/Doctors/DoctorAvailability"
import AppointmentForm from "../../components/Home/AppointmentForm"


type BookingStep = "search" | "availability" | "booking" | "emergency" | "appointments"

const AppointmentBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("search")
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponseDTO | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedSlot, setSelectedSlot] = useState<{ startTime: string; endTime: string } | null>(null)

  const [headerRef, headerVisible] = useScrollAnimation<HTMLDivElement>()

  const handleDoctorSelect = (doctor: DoctorResponseDTO) => {
    setSelectedDoctor(doctor)
    setCurrentStep("availability")
  }

  const handleSlotSelect = (date: string, slot: { startTime: string; endTime: string }) => {
    setSelectedDate(date)
    setSelectedSlot(slot)
    setCurrentStep("booking")
  }

  const handleBookingComplete = () => {
    setCurrentStep("appointments")
    setSelectedDoctor(null)
    setSelectedDate("")
    setSelectedSlot(null)
  }

  const handleEmergencyComplete = () => {
    setCurrentStep("appointments")
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: "search", label: "Find Doctor", icon: "🔍" },
      { key: "availability", label: "Select Time", icon: "📅" },
      { key: "booking", label: "Book Appointment", icon: "✅" },
    ]

    if (currentStep === "emergency" || currentStep === "appointments") {
      return null
    }

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  currentStep === step.key
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : steps.findIndex((s) => s.key === currentStep) > index
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="font-medium">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 transition-colors duration-300 ${
                    steps.findIndex((s) => s.key === currentStep) > index ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div
        ref={headerRef}
        className={`bg-white shadow-lg transition-all duration-1000 ${
          headerVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
              <p className="text-gray-600 mt-1">Find and book appointments with our healthcare professionals</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentStep("search")}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Find Doctor
              </button>
              <button
                onClick={() => setCurrentStep("emergency")}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Emergency
              </button>
              <button
                onClick={() => setCurrentStep("appointments")}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === "search" && <DoctorSearch onDoctorSelect={handleDoctorSelect} />}

        {currentStep === "availability" && selectedDoctor && (
          <DoctorAvailability
            doctor={selectedDoctor}
            onSlotSelect={handleSlotSelect}
            onBack={() => setCurrentStep("search")}
          />
        )}

        {currentStep === "booking" && selectedDoctor && selectedDate && selectedSlot && (
          <AppointmentForm
            doctor={selectedDoctor}
            date={selectedDate}
            slot={selectedSlot}
            onComplete={handleBookingComplete}
            onBack={() => setCurrentStep("availability")}
          />
        )}

        {currentStep === "emergency" && (
          <EmergencyAppointmentForm onComplete={handleEmergencyComplete} onBack={() => setCurrentStep("search")} />
        )}

        {currentStep === "appointments" && <PatientAppointments onBack={() => setCurrentStep("search")} />}
      </div>
    </div>
  )
}

export default AppointmentBooking

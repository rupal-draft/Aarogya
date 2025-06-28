"use client"

import type React from "react"
import { useState } from "react"
import type { DoctorResponseDTO } from "../../types/doctor"
import type { AppointmentRequestDto } from "../../types/appointment"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import {AppointmentType} from "../../types/appointment"
import { requestAppointment } from "../../Services/appointment"


interface AppointmentFormProps {
  doctor: DoctorResponseDTO
  date: string
  slot: { startTime: string; endTime: string }
  onComplete: () => void
  onBack: () => void
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ doctor, date, slot, onComplete, onBack }) => {
  const [formData, setFormData] = useState<AppointmentRequestDto>({
    doctorId: doctor.id,
    appointmentDate: date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    type: AppointmentType.REGULAR,
    reason: "",
    symptoms: [],
    priority: 1,
    isVirtual: false,
  })

  const [currentSymptom, setCurrentSymptom] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formRef, formVisible] = useScrollAnimation<HTMLDivElement>()

  const commonSymptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
    "Abdominal Pain",
    "Back Pain",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const addSymptom = (symptom: string) => {
    if (symptom.trim() && !formData.symptoms?.includes(symptom.trim()) && (formData.symptoms?.length || 0) < 10) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), symptom.trim()],
      }))
      setCurrentSymptom("")
    }
  }

  const removeSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms?.filter((s) => s !== symptom) || [],
    }))
  }

  const validateForm = (): string | null => {
    if (!formData.reason?.trim()) {
      return "Please provide a reason for the appointment"
    }
    if (formData.reason.length > 500) {
      return "Reason cannot exceed 500 characters"
    }
    if ((formData.symptoms?.length || 0) > 10) {
      return "Maximum 10 symptoms allowed"
    }
    if (formData.priority < 1 || formData.priority > 5) {
      return "Priority must be between 1 and 5"
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)
      setError(null)

      await requestAppointment(formData)
      setSuccess(true)

      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (err) {
      setError("Failed to book appointment. Please try again.")
      console.error("Error booking appointment:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="text-6xl mb-6 animate-bounce">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Appointment Booked Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment with Dr. {doctor.firstName} {doctor.lastName} has been scheduled.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-green-800">
              <p>
                <strong>Date:</strong> {new Date(date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </p>
              <p>
                <strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}
              </p>
              <p>
                <strong>Specialization:</strong> {doctor.specialization}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Redirecting to your appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={formRef}
        className={`transition-all duration-1000 ${
          formVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
            <button
              onClick={onBack}
              className="mb-4 flex items-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <span className="text-xl mr-2">←</span>
              Back to Availability
            </button>

            <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}
                  </p>
                  <p>
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 text-xl mr-3">⚠️</span>
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Appointment Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.values(AppointmentType).map((type) => (
                  <label
                    key={type}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  >
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={handleInputChange}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-3">
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                placeholder="Please describe the reason for your appointment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.reason?.length || 0}/500 characters</p>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Symptoms (Optional)</label>

              {/* Common Symptoms */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Quick add common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptom(symptom)}
                      disabled={formData.symptoms?.includes(symptom)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                        formData.symptoms?.includes(symptom)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Symptom Input */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  placeholder="Add custom symptom..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSymptom(currentSymptom)
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addSymptom(currentSymptom)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Add
                </button>
              </div>

              {/* Selected Symptoms */}
              {formData.symptoms && formData.symptoms.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Selected symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{formData.symptoms.length}/10 symptoms</p>
                </div>
              )}
            </div>

            {/* Priority and Virtual Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-3">
                  Priority Level
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2 - Normal</option>
                  <option value={3}>3 - Medium</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Urgent</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isVirtual"
                    checked={formData.isVirtual}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <span className="font-semibold text-gray-700">Virtual Appointment</span>
                    <p className="text-sm text-gray-500">Conduct appointment via video call</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Booking Appointment...
                  </div>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AppointmentForm

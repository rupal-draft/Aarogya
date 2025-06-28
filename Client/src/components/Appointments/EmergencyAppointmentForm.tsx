"use client"

import type React from "react"
import { useState } from "react"
import type { EmergencyAppointmentDto } from "../../types/appointment"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"
import { requestEmergencyAppointment } from "../../Services/appointment"
import { emergencySymptoms, specializations } from "../../utils/data"


interface EmergencyAppointmentFormProps {
  onComplete: () => void
  onBack: () => void
}

const EmergencyAppointmentForm: React.FC<EmergencyAppointmentFormProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState<EmergencyAppointmentDto>({
    symptoms: [],
    emergencyDescription: "",
    preferredSpecialization: "",
    priority: 5,
  })

  const [currentSymptom, setCurrentSymptom] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formRef, formVisible] = useScrollAnimation<HTMLDivElement>()


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addSymptom = (symptom: string) => {
    if (symptom.trim() && !formData.symptoms.includes(symptom.trim()) && formData.symptoms.length < 10) {
      setFormData((prev) => ({
        ...prev,
        symptoms: [...prev.symptoms, symptom.trim()],
      }))
      setCurrentSymptom("")
    }
  }

  const removeSymptom = (symptom: string) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.filter((s) => s !== symptom),
    }))
  }

  const validateForm = (): string | null => {
    if (formData.symptoms.length === 0) {
      return "Please add at least one symptom"
    }
    if (!formData.emergencyDescription.trim()) {
      return "Please provide an emergency description"
    }
    if (formData.emergencyDescription.length > 1000) {
      return "Emergency description cannot exceed 1000 characters"
    }
    if (formData.symptoms.length > 10) {
      return "Maximum 10 symptoms allowed"
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

      await requestEmergencyAppointment(formData)
      setSuccess(true)

      setTimeout(() => {
        onComplete()
      }, 3000)
    } catch (err) {
      setError("Failed to request emergency appointment. Please try again or call emergency services.")
      console.error("Error requesting emergency appointment:", err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="text-6xl mb-6 animate-pulse">🚨</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Emergency Request Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your emergency appointment request has been submitted. Our medical team will contact you shortly.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">
              If this is a life-threatening emergency, please call 911 immediately.
            </p>
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
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
            <button
              onClick={onBack}
              className="mb-4 flex items-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <span className="text-xl mr-2">←</span>
              Back
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-4xl">🚨</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Emergency Appointment Request</h2>
                <p className="text-white/90">For urgent medical situations requiring immediate attention</p>
              </div>
            </div>

            <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm font-semibold">⚠️ Important:</p>
              <p className="text-sm">If this is a life-threatening emergency, please call 911 immediately.</p>
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

            {/* Emergency Symptoms */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Emergency Symptoms <span className="text-red-500">*</span>
              </label>

              {/* Quick Add Emergency Symptoms */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Select emergency symptoms:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {emergencySymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptom(symptom)}
                      disabled={formData.symptoms.includes(symptom)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors duration-200 text-left ${
                        formData.symptoms.includes(symptom)
                          ? "bg-red-200 text-red-800 cursor-not-allowed"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Add
                </button>
              </div>

              {/* Selected Symptoms */}
              {formData.symptoms.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Selected symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-red-600 hover:text-red-800"
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

            {/* Emergency Description */}
            <div>
              <label htmlFor="emergencyDescription" className="block text-sm font-semibold text-gray-700 mb-3">
                Emergency Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="emergencyDescription"
                name="emergencyDescription"
                value={formData.emergencyDescription}
                onChange={handleInputChange}
                rows={6}
                maxLength={1000}
                placeholder="Please provide detailed information about your emergency situation, when it started, severity, and any relevant medical history..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.emergencyDescription.length}/1000 characters</p>
            </div>

            {/* Preferred Specialization */}
            <div>
              <label htmlFor="preferredSpecialization" className="block text-sm font-semibold text-gray-700 mb-3">
                Preferred Specialization (Optional)
              </label>
              <select
                id="preferredSpecialization"
                name="preferredSpecialization"
                value={formData.preferredSpecialization}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Any Available Specialist</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Level */}
            <div>
              <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-3">
                Emergency Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value={5}>5 - Critical Emergency</option>
                <option value={4}>4 - High Priority</option>
                <option value={3}>3 - Moderate Emergency</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Emergency appointments are automatically set to high priority
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                } text-white`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Submitting Emergency Request...
                  </div>
                ) : (
                  "🚨 Submit Emergency Request"
                )}
              </button>
            </div>

            {/* Emergency Contact Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Emergency Contacts</h4>
              <div className="text-sm text-red-700 space-y-1">
                <p>
                  <strong>Life-threatening emergencies:</strong> Call 911
                </p>
                <p>
                  <strong>Poison Control:</strong> 1-800-222-1222
                </p>
                <p>
                  <strong>Mental Health Crisis:</strong> 988
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EmergencyAppointmentForm

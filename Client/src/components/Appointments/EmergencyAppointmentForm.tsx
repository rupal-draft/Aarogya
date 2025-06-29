"use client"

import type React from "react"
import { useState } from "react"
import type { EmergencyAppointmentDto } from "../../types/appointment"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  AlertTriangle,
  Activity,
  Plus,
  X,
  FileText,
  Star,
  Phone,
  Loader,
} from "lucide-react"
import { requestEmergencyAppointment } from "../../Services/appointment"
import { emergencySymptoms, emmergency_specializations } from "../../Data/appointment"


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
      }, 4000)
    } catch (err) {
      setError("Failed to request emergency appointment. Please try again or call emergency services.")
      console.error("Error requesting emergency appointment:", err)
    } finally {
      setLoading(false)
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

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto my-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-8xl mb-6"
            >
              🚨
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Emergency Request Submitted!</h2>
            <p className="text-red-100 text-lg">
              Your emergency appointment request has been submitted. Our medical team will contact you shortly.
            </p>
          </div>

          <div className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="font-bold text-red-800 text-lg">Important Notice</h3>
              </div>
              <p className="text-red-800 font-semibold text-center">
                If this is a life-threatening emergency, please call 911 immediately.
              </p>
            </div>

            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="inline-block text-red-500 mb-4"
              >
                <Loader className="w-6 h-6" />
              </motion.div>
              <p className="text-gray-500">Redirecting to your appointments...</p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white"
        >
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Animated Background Elements */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -360],
            }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -bottom-8 -left-8 w-16 h-16 bg-white/5 rounded-full"
          />

          <div className="relative z-10">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="mb-6 flex items-center text-white/80 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </motion.button>

            <div className="flex items-center space-x-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl"
              >
                🚨
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Emergency Appointment Request</h2>
                <p className="text-red-100 text-lg">For urgent medical situations requiring immediate attention</p>
              </div>
            </div>

            <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <p className="font-bold">⚠️ Important:</p>
              </div>
              <p className="text-sm">If this is a life-threatening emergency, please call 911 immediately.</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4"
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emergency Symptoms */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-red-500" />
              Emergency Symptoms <span className="text-red-500 ml-1">*</span>
            </label>

            {/* Quick Add Emergency Symptoms */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">Select emergency symptoms:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {emergencySymptoms.map((symptom) => {
                  const Icon = symptom.icon
                  const isSelected = formData.symptoms.includes(symptom.name)

                  return (
                    <motion.button
                      key={symptom.name}
                      type="button"
                      whileHover={!isSelected ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!isSelected ? { scale: 0.95 } : {}}
                      onClick={() => addSymptom(symptom.name)}
                      disabled={isSelected}
                      className={`p-4 rounded-2xl text-sm font-medium transition-all duration-200 text-center ${
                        isSelected
                          ? "bg-red-200 text-red-800 cursor-not-allowed border-2 border-red-300"
                          : `bg-gradient-to-r ${symptom.color} text-white hover:shadow-lg border-2 border-transparent`
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Icon className="w-6 h-6" />
                        <span className="leading-tight">{symptom.name}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Custom Symptom Input */}
            <div className="flex space-x-3 mb-4">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                placeholder="Add custom symptom..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSymptom(currentSymptom)
                  }
                }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addSymptom(currentSymptom)}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            {/* Selected Symptoms */}
            <AnimatePresence>
              {formData.symptoms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className="text-sm text-gray-600 mb-3">Selected symptoms:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.symptoms.map((symptom) => (
                      <motion.span
                        key={symptom}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                      >
                        {symptom}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">{formData.symptoms.length}/10 symptoms</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Emergency Description */}
          <motion.div variants={itemVariants}>
            <label
              htmlFor="emergencyDescription"
              className="block text-sm font-bold text-gray-700 mb-4 flex items-center"
            >
              <FileText className="w-5 h-5 mr-2 text-red-500" />
              Emergency Description <span className="text-red-500 ml-1">*</span>
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              id="emergencyDescription"
              name="emergencyDescription"
              value={formData.emergencyDescription}
              onChange={handleInputChange}
              rows={6}
              maxLength={1000}
              placeholder="Please provide detailed information about your emergency situation, when it started, severity, and any relevant medical history..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 resize-none"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">{formData.emergencyDescription.length}/1000 characters</p>
              <div
                className={`text-sm ${formData.emergencyDescription.length > 900 ? "text-red-500" : "text-gray-400"}`}
              >
                {1000 - formData.emergencyDescription.length} remaining
              </div>
            </div>
          </motion.div>

          {/* Preferred Specialization and Priority */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label
                  htmlFor="preferredSpecialization"
                  className="block text-sm font-bold text-gray-700 mb-4 flex items-center"
                >
                  <Star className="w-5 h-5 mr-2 text-red-500" />
                  Preferred Specialization (Optional)
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="preferredSpecialization"
                  name="preferredSpecialization"
                  value={formData.preferredSpecialization}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                >
                  <option value="">Any Available Specialist</option>
                  {emmergency_specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </motion.select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Emergency Priority Level
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200"
                >
                  <option value={5}>5 - Critical Emergency</option>
                  <option value={4}>4 - High Priority</option>
                  <option value={3}>3 - Moderate Emergency</option>
                </motion.select>
                <p className="text-sm text-gray-500 mt-2">
                  Emergency appointments are automatically set to high priority
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-xl hover:shadow-2xl"
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Loader className="w-6 h-6" />
                  </motion.div>
                  <span>Submitting Emergency Request...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <AlertTriangle className="w-6 h-6" />
                  <span>🚨 Submit Emergency Request</span>
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Emergency Contact Info */}
          <motion.div variants={itemVariants}>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-red-600 mr-3" />
                <h4 className="font-bold text-red-800 text-lg">Emergency Contacts</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-red-700">
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="font-bold">Life-threatening emergencies</p>
                  <p className="text-2xl font-bold text-red-600">911</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="font-bold">Poison Control</p>
                  <p className="text-lg font-bold text-red-600">1-800-222-1222</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl">
                  <p className="font-bold">Mental Health Crisis</p>
                  <p className="text-2xl font-bold text-red-600">988</p>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}

export default EmergencyAppointmentForm

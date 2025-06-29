"use client"

import type React from "react"
import { useState } from "react"
import type { DoctorResponseDTO } from "../../types/doctor"
import type { AppointmentRequestDto } from "../../types/appointment"
import {AppointmentType} from "../../Data/enums/Appointment"
import { requestAppointment } from "../../Services/appointment"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  Plus,
  X,
  Video,
  Star,
  CheckCircle,
  Loader,
  Activity,
} from "lucide-react"
import { commonSymptoms } from "../../Data/appointment"

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
      }, 3000)
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="text-8xl mb-6"
            >
              ✅
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Appointment Booked Successfully!</h2>
            <p className="text-green-100 text-lg">
              Your appointment with Dr. {doctor.firstName} {doctor.lastName} has been scheduled.
            </p>
          </div>

          <div className="p-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-green-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <p>
                    <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}
                  </p>
                  <p>
                    <strong>Specialization:</strong> {doctor.specialization}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="inline-block text-blue-500 mb-4"
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
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white"
        >
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Floating Background Elements */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360, scale: [1, 1.2, 1] }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
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
              Back to Availability
            </motion.button>

            <h2 className="text-3xl font-bold mb-6">Book Your Appointment</h2>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>
                      <strong>Doctor:</strong> Dr. {doctor.firstName} {doctor.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    <span>
                      <strong>Specialization:</strong> {doctor.specialization}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      <strong>Date:</strong> {new Date(date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      <strong>Time:</strong> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                </div>
              </div>
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
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Appointment Type */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Appointment Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(AppointmentType).map((type) => (
                <motion.label
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-4 border-2 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all duration-200"
                >
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleInputChange}
                    className="text-blue-500 focus:ring-blue-500 w-5 h-5"
                  />
                  <span className="font-semibold text-gray-700">{type}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Reason */}
          <motion.div variants={itemVariants}>
            <label htmlFor="reason" className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Reason for Visit <span className="text-red-500 ml-1">*</span>
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={4}
              maxLength={500}
              placeholder="Please describe the reason for your appointment in detail..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none"
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">{formData.reason?.length || 0}/500 characters</p>
              <div className={`text-sm ${formData.reason?.length > 450 ? "text-red-500" : "text-gray-400"}`}>
                {500 - (formData.reason?.length || 0)} remaining
              </div>
            </div>
          </motion.div>

          {/* Symptoms */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Symptoms (Optional)
            </label>

            {/* Common Symptoms */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Quick add common symptoms:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {commonSymptoms.map((symptom) => {
                  const Icon = symptom.icon
                  const isSelected = formData.symptoms?.includes(symptom.name)

                  return (
                    <motion.button
                      key={symptom.name}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addSymptom(symptom.name)}
                      disabled={isSelected}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isSelected
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : `bg-gradient-to-r ${symptom.color} text-white hover:shadow-lg`
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <Icon className="w-4 h-4" />
                        <span className="text-xs leading-tight">{symptom.name}</span>
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
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
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
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>

            {/* Selected Symptoms */}
            <AnimatePresence>
              {formData.symptoms && formData.symptoms.length > 0 && (
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
                        className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {symptom}
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 text-green-600 hover:text-green-800 transition-colors"
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

          {/* Priority and Virtual Options */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="priority" className="block text-sm font-bold text-gray-700 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-blue-500" />
                  Priority Level
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                >
                  <option value={1}>1 - Low Priority</option>
                  <option value={2}>2 - Normal</option>
                  <option value={3}>3 - Medium</option>
                  <option value={4}>4 - High</option>
                  <option value={5}>5 - Urgent</option>
                </motion.select>
              </div>

              <div className="flex items-center">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-4 cursor-pointer p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    name="isVirtual"
                    checked={formData.isVirtual}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-500 focus:ring-blue-500 rounded"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">Virtual Appointment</span>
                      <p className="text-sm text-gray-500">Conduct appointment via video call</p>
                    </div>
                  </div>
                </motion.label>
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
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl"
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
                  <span>Booking Appointment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="w-6 h-6" />
                  <span>Book Appointment</span>
                </div>
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  )
}

export default AppointmentForm

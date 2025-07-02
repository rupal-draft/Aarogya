import type React from "react"
import type { AppointmentResponseDto } from "../../types/appointment"
import {AppointmentStatus,AppointmentType } from "../../Data/enums/Appointment"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Video,
  Star,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Award,
} from "lucide-react"
import { useScrollAnimation } from "../../hooks/Animation/useScrollAnimation"

interface AppointmentCardProps {
  appointment: AppointmentResponseDto
  index: number
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, index }) => {
  const [cardRef, cardVisible] = useScrollAnimation<HTMLDivElement>()

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return "from-yellow-400 to-orange-500"
      case AppointmentStatus.CONFIRMED:
        return "from-green-400 to-emerald-500"
      case AppointmentStatus.CANCELLED:
        return "from-red-400 to-pink-500"
      case AppointmentStatus.COMPLETED:
        return "from-blue-400 to-indigo-500"
      default:
        return "from-gray-400 to-gray-500"
    }
  }

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return <AlertCircle className="h-5 w-5" />
      case AppointmentStatus.CONFIRMED:
        return <CheckCircle className="h-5 w-5" />
      case AppointmentStatus.CANCELLED:
        return <XCircle className="h-5 w-5" />
      case AppointmentStatus.COMPLETED:
        return <Award className="h-5 w-5" />
      default:
        return <Calendar className="h-5 w-5" />
    }
  }

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.EMERGENCY:
        return "🚨"
      case AppointmentType.FOLLOW_UP:
        return "🔄"
      default:
        return "📋"
    }
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isUpcoming = () => {
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.startTime}`)
    return appointmentDateTime > new Date() && appointment.status !== AppointmentStatus.CANCELLED
  }

  const isPast = () => {
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.endTime}`)
    return appointmentDateTime < new Date()
  }

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 ${
        cardVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <motion.div
        className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-l-8 ${
          appointment.type === AppointmentType.EMERGENCY
            ? "border-l-red-500"
            : isUpcoming()
              ? "border-l-green-500"
              : isPast()
                ? "border-l-gray-400"
                : "border-l-blue-500"
        } hover:scale-[1.02] group relative`}
        whileHover={{ y: -5 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-4 right-4 text-yellow-400 z-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>

        {/* Background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        <div className="p-8 relative z-10">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Doctor Avatar */}
              <motion.div
                className="relative w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                {appointment.doctor?.imageUrl ? (
                  <img
                    src={appointment.doctor.imageUrl || "/placeholder.svg?height=64&width=64"}
                    alt={`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl">
                    👨‍⚕️
                  </div>
                )}

                {/* Online status indicator */}
                <motion.div
                  className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </motion.div>

              <div>
                <motion.h3 className="text-xl font-bold text-gray-900 mb-1" whileHover={{ scale: 1.02 }}>
                  Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </motion.h3>
                <motion.div
                  className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  {appointment.doctor?.specialization}
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {/* Status Badge */}
              <motion.div
                className={`px-4 py-2 rounded-full text-white font-semibold text-sm shadow-lg bg-gradient-to-r ${getStatusColor(appointment.status)} flex items-center space-x-2`}
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {getStatusIcon(appointment.status)}
                <span>{appointment.status}</span>
              </motion.div>

              {/* Type Badge */}
              {appointment.type !== AppointmentType.REGULAR && (
                <motion.div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.type === AppointmentType.EMERGENCY
                      ? "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
                      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="mr-1">{getTypeIcon(appointment.type)}</span>
                  {appointment.type}
                </motion.div>
              )}
            </div>
          </div>

          {/* Appointment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Date and Time */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-blue-500 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h4 className="font-semibold text-blue-800">Date & Time</h4>
              </div>
              <p className="font-bold text-gray-900 text-lg mb-1">{formatDate(appointment.appointmentDate)}</p>
              <p className="text-blue-600 font-medium">
                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
              </p>
            </motion.div>

            {/* Additional Info */}
            <div className="space-y-3">
              {appointment.isVirtual && (
                <motion.div
                  className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2 bg-green-500 rounded-lg mr-3">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-green-800 font-medium">Virtual Appointment</span>
                </motion.div>
              )}

              <motion.div
                className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-2 bg-purple-500 rounded-lg mr-3">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <span className="text-purple-800 font-medium">Priority: {appointment.priority}/5</span>
              </motion.div>
            </div>
          </div>

          {/* Reason Section */}
          {appointment.reason && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200"
              whileHover={{ scale: 1.01 }}
            >
              <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center">
                <div className="p-1 bg-gray-500 rounded mr-2">
                  <Heart className="h-3 w-3 text-white" />
                </div>
                Reason for Visit:
              </h4>
              <p className="text-gray-700 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                {appointment.reason}
              </p>
            </motion.div>
          )}

          {/* Symptoms */}
          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <div className="p-1 bg-orange-500 rounded mr-2">
                  <AlertCircle className="h-3 w-3 text-white" />
                </div>
                Symptoms:
              </h4>
              <div className="flex flex-wrap gap-2">
                {appointment.symptoms.map((symptom, idx) => (
                  <motion.span
                    key={idx}
                    className="px-3 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full text-sm font-medium border border-orange-300 shadow-sm"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {symptom}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notes Section */}
          {(appointment.notes || appointment.doctorNotes) && (
            <div className="mb-6 space-y-3">
              {appointment.notes && (
                <motion.div
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <h4 className="text-sm font-bold text-blue-800 mb-2">Patient Notes:</h4>
                  <p className="text-blue-700 bg-white p-3 rounded-xl shadow-sm">{appointment.notes}</p>
                </motion.div>
              )}
              {appointment.doctorNotes && (
                <motion.div
                  className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <h4 className="text-sm font-bold text-green-800 mb-2">Doctor Notes:</h4>
                  <p className="text-green-700 bg-white p-3 rounded-xl shadow-sm">{appointment.doctorNotes}</p>
                </motion.div>
              )}
            </div>
          )}

          {/* Cancellation Reason */}
          {appointment.status === AppointmentStatus.CANCELLED && appointment.cancellationReason && (
            <motion.div
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200"
              whileHover={{ scale: 1.01 }}
            >
              <h4 className="text-sm font-bold text-red-800 mb-2">Cancellation Reason:</h4>
              <p className="text-red-700 bg-white p-3 rounded-xl shadow-sm">{appointment.cancellationReason}</p>
            </motion.div>
          )}

          {/* Actions Section */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Created: {new Date(appointment.createdAt).toLocaleDateString()}
              </p>
              {appointment.updatedAt !== appointment.createdAt && (
                <p className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated: {new Date(appointment.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              {appointment.isVirtual && appointment.meetingLink && isUpcoming() && (
                <motion.a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Video className="h-4 w-4" />
                  <span>Join Meeting</span>
                </motion.a>
              )}

              {isUpcoming() && appointment.status === AppointmentStatus.CONFIRMED && (
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Reschedule</span>
                </motion.button>
              )}

              {appointment.status === AppointmentStatus.PENDING && (
                <motion.button
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative floating elements */}
        <motion.div
          className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-br from-blue-300 to-purple-400 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-br from-pink-300 to-yellow-400 rounded-full opacity-20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  )
}

export default AppointmentCard

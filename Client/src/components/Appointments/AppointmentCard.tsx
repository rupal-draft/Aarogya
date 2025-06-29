import type React from "react"
import type { AppointmentResponseDto } from "../../types/appointment"
import {AppointmentStatus,AppointmentType } from "../../Data/enums/Appointment"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  User,
  Video,
  Star,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  FileText,
  Thermometer,
} from "lucide-react"

interface AppointmentCardProps {
  appointment: AppointmentResponseDto
  index: number
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, index }) => {
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
        return Clock
      case AppointmentStatus.CONFIRMED:
        return CheckCircle
      case AppointmentStatus.CANCELLED:
        return XCircle
      case AppointmentStatus.COMPLETED:
        return CheckCircle
      default:
        return Calendar
    }
  }

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.EMERGENCY:
        return AlertTriangle
      case AppointmentType.FOLLOW_UP:
        return Activity
      default:
        return FileText
    }
  }

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.EMERGENCY:
        return "bg-red-100 text-red-800 border-red-200"
      case AppointmentType.FOLLOW_UP:
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const StatusIcon = getStatusIcon(appointment.status)
  const TypeIcon = getTypeIcon(appointment.type)

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  }

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group cursor-pointer"
    >
      <motion.div
        variants={hoverVariants}
        className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-l-8 ${
          appointment.type === AppointmentType.EMERGENCY
            ? "border-l-red-500"
            : isUpcoming()
              ? "border-l-green-500"
              : isPast()
                ? "border-l-gray-400"
                : "border-l-blue-500"
        } relative`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>

        {/* Header Section */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            {/* Doctor Info */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden relative"
              >
                {appointment.doctor?.imageUrl ? (
                  <img
                    src={appointment.doctor.imageUrl || "/placeholder.svg"}
                    alt={`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {appointment.doctor?.firstName?.[0]}
                    {appointment.doctor?.lastName?.[0]}
                  </span>
                )}
              </motion.div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </h3>
                <p className="text-blue-600 font-medium">{appointment.doctor?.specialization}</p>
              </div>
            </div>

            {/* Status and Type Badges */}
            <div className="flex flex-col items-end space-y-2">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(appointment.status)} flex items-center space-x-2`}
              >
                <StatusIcon className="w-4 h-4" />
                <span>{appointment.status}</span>
              </motion.span>

              {appointment.type !== AppointmentType.REGULAR && (
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(appointment.type)} flex items-center space-x-1`}
                >
                  <TypeIcon className="w-3 h-3" />
                  <span>{appointment.type}</span>
                </motion.span>
              )}
            </div>
          </div>

          {/* Appointment Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Star className="w-5 h-5 mr-3 text-yellow-500" />
                <span className="text-sm">Priority: {appointment.priority}/5</span>
              </div>

              {appointment.isVirtual && (
                <div className="flex items-center text-gray-600">
                  <Video className="w-5 h-5 mr-3 text-green-500" />
                  <span className="text-sm font-medium text-green-700">Virtual Appointment</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {appointment.reason && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    Reason:
                  </p>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-100 line-clamp-2">
                    {appointment.reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Symptoms */}
          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-orange-500" />
                Symptoms:
              </p>
              <div className="flex flex-wrap gap-2">
                {appointment.symptoms.slice(0, 4).map((symptom, idx) => (
                  <motion.span
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200 flex items-center space-x-1"
                  >
                    <Thermometer className="w-3 h-3" />
                    <span>{symptom}</span>
                  </motion.span>
                ))}
                {appointment.symptoms.length > 4 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    +{appointment.symptoms.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {(appointment.notes || appointment.doctorNotes) && (
            <div className="mb-4 space-y-3">
              {appointment.notes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Patient Notes:
                  </p>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl border border-blue-100">
                    {appointment.notes}
                  </p>
                </div>
              )}
              {appointment.doctorNotes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-green-500" />
                    Doctor Notes:
                  </p>
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-xl border border-green-100">
                    {appointment.doctorNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cancellation Reason */}
          {appointment.status === AppointmentStatus.CANCELLED && appointment.cancellationReason && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-red-700 mb-1 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Cancellation Reason:
              </p>
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                {appointment.cancellationReason}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="relative bg-gray-50/50 p-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Timestamps */}
            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Created: {new Date(appointment.createdAt).toLocaleDateString()}
              </p>
              {appointment.updatedAt !== appointment.createdAt && (
                <p className="flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  Updated: {new Date(appointment.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {appointment.isVirtual && appointment.meetingLink && isUpcoming() && (
                <motion.a
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-xl hover:bg-green-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Meeting</span>
                </motion.a>
              )}

              {isUpcoming() && appointment.status === AppointmentStatus.CONFIRMED && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500 text-white text-sm rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Edit className="w-4 h-4" />
                  <span>Reschedule</span>
                </motion.button>
              )}

              {appointment.status === AppointmentStatus.PENDING && (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Cancel</span>
                </motion.button>
              )}

              {/* <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-xl hover:bg-gray-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <Eye className="w-4 h-4" />
                <span>View Details</span>
              </motion.button> */}
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl pointer-events-none"></div>

        {/* Priority Indicator */}
        {appointment.priority >= 4 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default AppointmentCard

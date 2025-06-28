import type React from "react"
import type { AppointmentResponseDto } from "../../types/appointment"
import {AppointmentStatus,AppointmentType } from "../../types/appointment"
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
        return "⏳"
      case AppointmentStatus.CONFIRMED:
        return "✅"
      case AppointmentStatus.CANCELLED:
        return "❌"
      case AppointmentStatus.COMPLETED:
        return "✔️"
      default:
        return "📅"
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
      <div
        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-l-4 ${
          appointment.type === AppointmentType.EMERGENCY
            ? "border-l-red-500"
            : isUpcoming()
              ? "border-l-green-500"
              : isPast()
                ? "border-l-gray-400"
                : "border-l-blue-500"
        } hover:scale-[1.02] group`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
                {appointment.doctor?.imageUrl ? (
                  <img
                    src={appointment.doctor.imageUrl || "/placeholder.svg"}
                    alt={`Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xl">👨‍⚕️</span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </h3>
                <p className="text-blue-600 font-medium">{appointment.doctor?.specialization}</p>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(appointment.status)}`}
              >
                {getStatusIcon(appointment.status)} {appointment.status}
              </span>
              {appointment.type !== AppointmentType.REGULAR && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.type === AppointmentType.EMERGENCY
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {getTypeIcon(appointment.type)} {appointment.type}
                </span>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <span className="text-lg mr-3">📅</span>
                <div>
                  <p className="font-medium">{formatDate(appointment.appointmentDate)}</p>
                  <p className="text-sm text-gray-500">
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </p>
                </div>
              </div>

              {appointment.isVirtual && (
                <div className="flex items-center text-gray-600">
                  <span className="text-lg mr-3">💻</span>
                  <span className="text-sm">Virtual Appointment</span>
                </div>
              )}

              <div className="flex items-center text-gray-600">
                <span className="text-lg mr-3">⚡</span>
                <span className="text-sm">Priority: {appointment.priority}/5</span>
              </div>
            </div>

            <div className="space-y-3">
              {appointment.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{appointment.reason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Symptoms */}
          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {appointment.symptoms.map((symptom, idx) => (
                  <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {(appointment.notes || appointment.doctorNotes) && (
            <div className="mb-4 space-y-2">
              {appointment.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient Notes:</p>
                  <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">{appointment.notes}</p>
                </div>
              )}
              {appointment.doctorNotes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Doctor Notes:</p>
                  <p className="text-sm text-gray-600 bg-green-50 p-2 rounded-lg">{appointment.doctorNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Cancellation Reason */}
          {appointment.status === AppointmentStatus.CANCELLED && appointment.cancellationReason && (
            <div className="mb-4">
              <p className="text-sm font-medium text-red-700">Cancellation Reason:</p>
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{appointment.cancellationReason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              <p>Created: {new Date(appointment.createdAt).toLocaleDateString()}</p>
              {appointment.updatedAt !== appointment.createdAt && (
                <p>Updated: {new Date(appointment.updatedAt).toLocaleDateString()}</p>
              )}
            </div>

            <div className="flex space-x-2">
              {appointment.isVirtual && appointment.meetingLink && isUpcoming() && (
                <a
                  href={appointment.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors duration-200"
                >
                  Join Meeting
                </a>
              )}

              {isUpcoming() && appointment.status === AppointmentStatus.CONFIRMED && (
                <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Reschedule
                </button>
              )}

              {appointment.status === AppointmentStatus.PENDING && (
                <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors duration-200">
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentCard

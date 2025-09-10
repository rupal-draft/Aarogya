"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  CheckCircle,
  Filter,
  Search,
  Video,
  ChevronDown,
  Edit,
  MessageCircle,
  BadgeInfo,
  CalendarDays,
  Stethoscope,
} from "lucide-react";
import {
  getSpecializationIcon,
  statusConfig,
  typeConfig,
} from "../../Data/appointment";
import type { AppointmentResponseDto } from "../../types/appointment";
import { getDoctorAppointments } from "../../Services/appointment";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter";
import { FloatingElements } from "../../common/Floating Particles/floating-elements";

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  const IconComponent = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} shadow-sm`}
    >
      <IconComponent className="w-3 h-3 mr-1" />
      {status.replace("_", " ")}
    </motion.span>
  );
};

// Enhanced type badge
const TypeBadge = ({ type }: { type: string }) => {
  const config = typeConfig[type] || typeConfig.REGULAR;
  const IconComponent = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} shadow-sm`}
    >
      <IconComponent className="w-3 h-3 mr-1" />
      {type.replace("_", " ")}
    </motion.span>
  );
};

// Priority indicator with subtle animation
const PriorityIndicator = ({ priority }: { priority: number }) => {
  const colors = [
    "bg-emerald-100 text-emerald-800 border-emerald-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-rose-100 text-rose-800 border-rose-200",
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={`flex items-center justify-center w-6 h-6 rounded-full ${
        colors[priority - 1] || colors[0]
      } text-xs font-bold border`}
    >
      {priority}
    </motion.div>
  );
};

const DoctorAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>(
    []
  );
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentResponseDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(
    null
  );

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await getDoctorAppointments(
          selectedStatus === "ALL" ? undefined : selectedStatus,
          selectedDate,
          0,
          10
        );
        setAppointments(response.content);
        setFilteredAppointments(response.content);
      } catch (err) {
        console.error("Failed to fetch doctor appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedStatus, selectedDate]);

  // Fix search functionality
  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const matchesSearch =
        searchTerm === "" ||
        appointment.patientDetails.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.patientDetails.lastName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "ALL" || appointment.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });

    setFilteredAppointments(filtered);
  }, [searchTerm, appointments, selectedStatus]);

  const toggleExpand = (id: string) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
          <Stethoscope className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 w-6 h-6" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <FloatingElements />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-3"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Medical Appointments
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Manage your patient appointments with our elegant healthcare
            dashboard
          </motion.p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients or reasons..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REJECTED">Rejected</option>
              <option value="NO_SHOW">No Show</option>
            </select>

            <input
              type="date"
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {[
            {
              title: "Total Appointments",
              value: appointments.length,
              icon: CalendarDays,
              color: "from-blue-500 to-cyan-500",
              border: "border-l-blue-500",
            },
            {
              title: "Pending",
              value: appointments.filter((a) => a.status === "PENDING").length,
              icon: Clock,
              color: "from-amber-500 to-orange-500",
              border: "border-l-amber-500",
            },
            {
              title: "Completed",
              value: appointments.filter((a) => a.status === "COMPLETED")
                .length,
              icon: CheckCircle,
              color: "from-emerald-500 to-green-500",
              border: "border-l-emerald-500",
            },
            {
              title: "Virtual",
              value: appointments.filter((a) => a.isVirtual).length,
              icon: Video,
              color: "from-purple-500 to-pink-500",
              border: "border-l-purple-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -3 }}
              className={`bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border-l-4 ${stat.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    <AnimatedCounter value={stat.value} duration={1.5} />
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-5"
        >
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg border border-gray-100"
            >
              <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No appointments found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </motion.div>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const SpecializationIcon = getSpecializationIcon(
                appointment.reason
              );

              return (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all"
                >
                  {/* Appointment Header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => toggleExpand(appointment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={appointment.patientDetails.imageUrl}
                            alt={`${appointment.patientDetails.firstName} ${appointment.patientDetails.lastName}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                          <div className="absolute -bottom-1 -right-1">
                            <PriorityIndicator
                              priority={appointment.priority}
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {appointment.patientDetails.firstName}{" "}
                            {appointment.patientDetails.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {calculateAge(
                              appointment.patientDetails.dateOfBirth
                            )}{" "}
                            years • {appointment.patientDetails.gender} •{" "}
                            {appointment.patientDetails.bloodGroup}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={appointment.status} />
                        <TypeBadge type={appointment.type} />
                        {expandedAppointment === appointment.id ? (
                          <ChevronDown className="w-5 h-5 text-blue-500 transform rotate-180" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1 text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-lg">
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.appointmentDate)}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-lg">
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </div>

                        {appointment.isVirtual && (
                          <div className="flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            <Video className="w-4 h-4" />
                            Virtual
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600 bg-blue-50 px-2 py-1 rounded-lg">
                        <SpecializationIcon className="w-4 h-4" />
                        {appointment.reason}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedAppointment === appointment.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Patient Details */}
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4 text-blue-500" />
                              Patient Details
                            </h4>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                {appointment.patientDetails.email}
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                {appointment.patientDetails.phone}
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {appointment.patientDetails.address}
                              </div>

                              <div className="flex items-center gap-2 text-gray-600">
                                <AlertCircle className="w-4 h-4" />
                                Emergency:{" "}
                                {appointment.patientDetails.emergencyContact} (
                                {appointment.patientDetails.emergencyPhone})
                              </div>
                            </div>
                          </div>

                          {/* Appointment Details */}
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                              <BadgeInfo className="w-4 h-4 text-blue-500" />
                              Appointment Details
                            </h4>

                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">
                                  Symptoms:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {appointment.symptoms.map((symptom, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                    >
                                      {symptom}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {appointment.notes && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Notes:
                                  </span>
                                  <p className="text-gray-600 mt-1">
                                    {appointment.notes}
                                  </p>
                                </div>
                              )}

                              {appointment.doctorNotes && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Doctor Notes:
                                  </span>
                                  <p className="text-gray-600 mt-1">
                                    {appointment.doctorNotes}
                                  </p>
                                </div>
                              )}

                              {appointment.cancellationReason && (
                                <div>
                                  <span className="font-medium text-gray-700">
                                    Cancellation Reason:
                                  </span>
                                  <p className="text-red-600 mt-1">
                                    {appointment.cancellationReason}
                                  </p>
                                </div>
                              )}

                              {appointment.meetingLink &&
                                appointment.isVirtual && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      Meeting Link:
                                    </span>
                                    <a
                                      href={appointment.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline block mt-1"
                                    >
                                      Join Virtual Meeting
                                    </a>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="border-t border-gray-100 p-5 flex justify-end gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Message
                          </motion.button>

                          {appointment.status === "APPROVED" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Start
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorAppointmentsDashboard;

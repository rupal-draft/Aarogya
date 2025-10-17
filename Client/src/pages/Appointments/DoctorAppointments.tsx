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
  BadgeInfo,
  CalendarDays,
  Stethoscope,
  FileText,
  Pill,
  Sparkles,
  Zap,
  Activity,
  TrendingUp,
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
import { UpdateAppointmentStatusModal } from "../../components/Dashboard/Doctor/UpdateAppointmentStatusModal";
import { useNavigate } from "react-router-dom";

const statusChangeVariants = {
  initial: { opacity: 0, scale: 0.8, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 10 },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  const IconComponent = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -1 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.color} shadow-sm border backdrop-blur-sm`}
    >
      <IconComponent className="w-3 h-3 mr-1.5" />
      {status.replace("_", " ")}
    </motion.span>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const config = typeConfig[type] || typeConfig.REGULAR;
  const IconComponent = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -1 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${config.color} shadow-sm border backdrop-blur-sm`}
    >
      <IconComponent className="w-3 h-3 mr-1.5" />
      {type.replace("_", " ")}
    </motion.span>
  );
};

const PriorityIndicator = ({ priority }: { priority: number }) => {
  const colors = [
    "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-200",
    "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-200",
    "bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-200",
    "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-200",
  ];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: 1.2, rotate: 5 }}
      className={`flex items-center justify-center w-7 h-7 rounded-full ${
        colors[priority - 1] || colors[0]
      } text-xs font-bold shadow-lg`}
    >
      {priority}
    </motion.div>
  );
};

const AvatarWithFallback = ({
  src,
  firstName,
  lastName,
  className = "w-12 h-12",
}: {
  src?: string;
  firstName: string;
  lastName: string;
  className?: string;
}) => {
  const [imageError, setImageError] = useState(!src);

  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const getColorClass = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-cyan-500",
      "bg-gradient-to-br from-purple-500 to-pink-500",
      "bg-gradient-to-br from-green-500 to-emerald-500",
      "bg-gradient-to-br from-orange-500 to-red-500",
      "bg-gradient-to-br from-indigo-500 to-blue-500",
      "bg-gradient-to-br from-teal-500 to-cyan-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (imageError) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`${className} ${getColorClass(
          firstName
        )} rounded-full flex items-center justify-center text-white font-semibold shadow-lg`}
      >
        {getInitials(firstName, lastName)}
      </motion.div>
    );
  }

  return (
    <motion.img
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      src={src}
      alt={`${firstName} ${lastName}`}
      className={`${className} rounded-full object-cover border-2 border-white shadow-lg`}
      onError={() => setImageError(true)}
      whileHover={{ scale: 1.1 }}
    />
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
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponseDto | null>(null);
  const [hoveredAppointment, setHoveredAppointment] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const handleEditClick = (appointment: AppointmentResponseDto) => {
    setSelectedAppointment(appointment);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = (updatedAppointment: AppointmentResponseDto) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
    setFilteredAppointments((prev) =>
      prev.map((apt) =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
  };

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 via-sky-200/20 to-cyan-200/20"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full shadow-lg"></div>
            <Stethoscope className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 w-8 h-8" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-blue-600 font-medium"
          >
            Loading appointments...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200/10 via-sky-200/10 to-cyan-200/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>
      </div>

      <FloatingElements />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <Sparkles className="w-8 h-8 text-blue-400" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Medical Appointments
          </motion.h1>

          <motion.p
            className="text-lg text-blue-600/80 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Manage your patient appointments with our elegant healthcare
            dashboard
          </motion.p>

          {/* Animated decoration */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ delay: 0.7, duration: 1 }}
            className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-6 rounded-full"
          />
        </motion.div>

        {/* Enhanced Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <motion.div whileHover={{ scale: 1.02 }} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search patients or reasons..."
                  className="pl-12 pr-4 py-3 w-full border border-blue-200/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/50 backdrop-blur-sm text-blue-900 placeholder-blue-400/60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </motion.div>
            </div>

            <motion.select
              whileHover={{ scale: 1.02 }}
              className="px-4 py-3 border border-blue-200/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/50 backdrop-blur-sm text-blue-900"
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
            </motion.select>

            <motion.input
              whileHover={{ scale: 1.02 }}
              type="date"
              className="px-4 py-3 border border-blue-200/50 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white/50 backdrop-blur-sm text-blue-900"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <Filter className="w-4 h-4" />
              Filter
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              title: "Total Appointments",
              value: appointments.length,
              icon: CalendarDays,
              color: "from-blue-500 to-sky-500",
              bgColor: "bg-gradient-to-br from-blue-500/10 to-sky-500/10",
              border: "border-l-blue-500",
            },
            {
              title: "Pending",
              value: appointments.filter((a) => a.status === "PENDING").length,
              icon: Clock,
              color: "from-amber-500 to-orange-500",
              bgColor: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
              border: "border-l-amber-500",
            },
            {
              title: "Completed",
              value: appointments.filter((a) => a.status === "COMPLETED")
                .length,
              icon: CheckCircle,
              color: "from-emerald-500 to-green-500",
              bgColor: "bg-gradient-to-br from-emerald-500/10 to-green-500/10",
              border: "border-l-emerald-500",
            },
            {
              title: "Virtual",
              value: appointments.filter((a) => a.isVirtual).length,
              icon: Video,
              color: "from-purple-500 to-indigo-500",
              bgColor: "bg-gradient-to-br from-purple-500/10 to-indigo-500/10",
              border: "border-l-purple-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-l-4 ${stat.border} ${stat.bgColor} relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600/80 font-medium">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-blue-900 mt-2">
                      <AnimatedCounter value={stat.value} duration={1.5} />
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </motion.div>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1 + index * 0.2, duration: 1 }}
                  className="h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20 mt-3"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Appointments List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-2xl border border-white/50"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-semibold text-blue-900 mb-3">
                No appointments found
              </h3>
              <p className="text-blue-600/80 text-lg">
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
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{ y: -5, scale: 1.005 }}
                  onHoverStart={() => setHoveredAppointment(appointment.id)}
                  onHoverEnd={() => setHoveredAppointment(null)}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/50 hover:shadow-3xl transition-all duration-300 relative"
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: hoveredAppointment === appointment.id ? 0.1 : 0,
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl"
                  />

                  {/* Appointment Header */}
                  <div
                    className="p-6 cursor-pointer relative z-10"
                    onClick={() => toggleExpand(appointment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="relative cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/patient-management/${appointment.patientDetails.id}`
                            );
                          }}
                        >
                          <AvatarWithFallback
                            src={appointment.patientDetails.imageUrl}
                            firstName={appointment.patientDetails.firstName}
                            lastName={appointment.patientDetails.lastName}
                            className="w-14 h-14"
                          />
                          <div className="absolute -bottom-2 -right-2">
                            <PriorityIndicator
                              priority={appointment.priority}
                            />
                          </div>
                        </motion.div>

                        <div>
                          <motion.h3
                            whileHover={{ x: 5 }}
                            className="font-bold text-xl text-blue-900"
                          >
                            {appointment.patientDetails.firstName}{" "}
                            {appointment.patientDetails.lastName}
                          </motion.h3>
                          <p className="text-blue-600/80">
                            {calculateAge(
                              appointment.patientDetails.dateOfBirth
                            )}{" "}
                            years • {appointment.patientDetails.gender} •{" "}
                            {appointment.patientDetails.bloodGroup}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={appointment.status}
                            variants={statusChangeVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                          >
                            <StatusBadge status={appointment.status} />
                          </motion.span>
                        </AnimatePresence>
                        <TypeBadge type={appointment.type} />
                        <motion.div
                          animate={{
                            rotate:
                              expandedAppointment === appointment.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-blue-500" />
                        </motion.div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 text-blue-700 bg-blue-100/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-blue-200/50"
                        >
                          <Calendar className="w-4 h-4" />
                          {formatDate(appointment.appointmentDate)}
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center gap-2 text-blue-700 bg-blue-100/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-blue-200/50"
                        >
                          <Clock className="w-4 h-4" />
                          {formatTime(appointment.startTime)} -{" "}
                          {formatTime(appointment.endTime)}
                        </motion.div>

                        {appointment.isVirtual && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 text-cyan-600 bg-cyan-100/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-cyan-200/50"
                          >
                            <Video className="w-4 h-4" />
                            Virtual
                          </motion.div>
                        )}
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 text-blue-700 bg-blue-100/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-blue-200/50"
                      >
                        <SpecializationIcon className="w-4 h-4" />
                        {appointment.reason}
                      </motion.div>
                    </div>
                  </div>

                  {/* Enhanced Expanded Details */}
                  <AnimatePresence>
                    {expandedAppointment === appointment.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="border-t border-blue-200/50 relative z-10"
                      >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Patient Details */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                          >
                            <h4 className="font-semibold text-blue-900 text-lg flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              Patient Details
                            </h4>

                            <div className="space-y-3 text-blue-800">
                              {[
                                {
                                  icon: Mail,
                                  text: appointment.patientDetails.email,
                                },
                                {
                                  icon: Phone,
                                  text: appointment.patientDetails.phone,
                                },
                                {
                                  icon: MapPin,
                                  text: appointment.patientDetails.address,
                                },
                                {
                                  icon: AlertCircle,
                                  text: `Emergency: ${appointment.patientDetails.emergencyContact} (${appointment.patientDetails.emergencyPhone})`,
                                },
                              ].map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + idx * 0.1 }}
                                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50/50 transition-colors"
                                >
                                  <item.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                  <span className="text-sm">{item.text}</span>
                                </motion.div>
                              ))}
                            </div>

                            {/* Enhanced Navigation Buttons */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              className="flex flex-wrap gap-2 pt-4 border-t border-blue-200/50"
                            >
                              {[
                                {
                                  label: "Demographics",
                                  icon: User,
                                  color: "bg-blue-500 hover:bg-blue-600",
                                  onClick: () =>
                                    navigate(
                                      `/patient-management/${appointment.patientDetails.id}`
                                    ),
                                },
                                {
                                  label: "Lab History",
                                  icon: FileText,
                                  color: "bg-purple-500 hover:bg-purple-600",
                                  onClick: () =>
                                    navigate(
                                      `/lab-history/${appointment.patientDetails.id}`
                                    ),
                                },
                                {
                                  label: "Prescriptions",
                                  icon: Pill,
                                  color: "bg-teal-500 hover:bg-teal-600",
                                  onClick: () =>
                                    navigate(
                                      `/doctor/prescriptions/${appointment.patientDetails.id}`
                                    ),
                                },
                              ].map((button, idx) => (
                                <motion.button
                                  key={button.label}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={button.onClick}
                                  className={`flex items-center gap-2 px-4 py-2 text-white rounded-xl transition-all shadow-lg ${button.color} text-sm font-medium`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.7 + idx * 0.1 }}
                                >
                                  <button.icon className="w-4 h-4" />
                                  <span>{button.label}</span>
                                </motion.button>
                              ))}
                            </motion.div>
                          </motion.div>

                          {/* Appointment Details */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-4"
                          >
                            <h4 className="font-semibold text-blue-900 text-lg flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <BadgeInfo className="w-5 h-5 text-blue-600" />
                              </div>
                              Appointment Details
                            </h4>

                            <div className="space-y-4 text-blue-800">
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <span className="font-medium text-blue-900">
                                  Symptoms:
                                </span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {appointment.symptoms.map((symptom, idx) => (
                                    <motion.span
                                      key={idx}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.5 + idx * 0.1 }}
                                      whileHover={{ scale: 1.1 }}
                                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200"
                                    >
                                      {symptom}
                                    </motion.span>
                                  ))}
                                </div>
                              </motion.div>

                              {appointment.notes && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6 }}
                                >
                                  <span className="font-medium text-blue-900">
                                    Notes:
                                  </span>
                                  <p className="text-blue-700 mt-1 bg-blue-50/50 p-3 rounded-lg border border-blue-200/50">
                                    {appointment.notes}
                                  </p>
                                </motion.div>
                              )}

                              {appointment.doctorNotes && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.7 }}
                                >
                                  <span className="font-medium text-blue-900">
                                    Doctor Notes:
                                  </span>
                                  <p className="text-blue-700 mt-1 bg-blue-50/50 p-3 rounded-lg border border-blue-200/50">
                                    {appointment.doctorNotes}
                                  </p>
                                </motion.div>
                              )}

                              {appointment.meetingLink &&
                                appointment.isVirtual && (
                                  <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                  >
                                    <span className="font-medium text-blue-900">
                                      Meeting Link:
                                    </span>
                                    <motion.a
                                      href={appointment.meetingLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.05 }}
                                      className="text-blue-600 hover:text-blue-700 font-medium block mt-1 bg-blue-50/50 p-3 rounded-lg border border-blue-200/50 hover:bg-blue-100/50 transition-colors"
                                    >
                                      Join Virtual Meeting
                                    </motion.a>
                                  </motion.div>
                                )}
                            </div>
                          </motion.div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                          className="border-t border-blue-200/50 p-6 flex justify-end gap-3 bg-blue-50/30"
                        >
                          <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditClick(appointment)}
                            className="px-6 py-3 border border-blue-300 rounded-xl text-blue-700 hover:bg-blue-50 transition-all flex items-center gap-2 font-medium shadow-sm"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Status
                          </motion.button>

                          {appointment.status === "APPROVED" && (
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center gap-2 font-medium shadow-lg shadow-green-500/25"
                            >
                              <Zap className="w-4 h-4" />
                              Start Consultation
                            </motion.button>
                          )}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </motion.div>

        <UpdateAppointmentStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          appointment={selectedAppointment!}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default DoctorAppointmentsDashboard;

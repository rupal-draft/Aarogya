"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { getDoctorAvailability } from "../../Services/doctor";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  MapPin,
  Phone,
  Star,
  Activity,
  Users,
  AlertCircle,
  Info,
} from "lucide-react";
import type { DoctorResponseDTO } from "../../types/doctor";
import type {
  AvailabilityResponse,
  TimeSlotResponse,
} from "../../types/availability";

interface DoctorAvailabilityProps {
  doctor: DoctorResponseDTO;
  onSlotSelect: (
    date: string,
    slot: { startTime: string; endTime: string }
  ) => void;
  onBack: () => void;
}

const DoctorAvailability: React.FC<DoctorAvailabilityProps> = ({
  doctor,
  onSlotSelect,
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [availabilityData, setAvailabilityData] =
    useState<AvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDoctorAvailability(doctor.id, selectedDate);
      setAvailabilityData(data);
    } catch (err) {
      setError("Failed to fetch availability. Please try again.");
      console.error("Error fetching availability:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        fullLabel: date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      });
    }

    return dates;
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleSlotClick = (slot: TimeSlotResponse) => {
    if (slot.isAvailable && slot.availableSlots > 0) {
      onSlotSelect(selectedDate, {
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    }
  };

  const getSlotStatus = (slot: TimeSlotResponse) => {
    if (!slot.isAvailable) return "UNAVAILABLE";
    if (slot.availableSlots === 0) return "FULL";
    return "AVAILABLE";
  };

  const getSlotStatusText = (slot: TimeSlotResponse) => {
    const status = getSlotStatus(slot);
    switch (status) {
      case "AVAILABLE":
        return `${slot.availableSlots} slot${
          slot.availableSlots !== 1 ? "s" : ""
        } available`;
      case "FULL":
        return "Fully booked";
      case "UNAVAILABLE":
        return slot.reasonForUnavailability || "Not available";
      default:
        return "Not available";
    }
  };

  const getSlotStatusColor = (slot: TimeSlotResponse) => {
    const status = getSlotStatus(slot);
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800 border-green-200";
      case "FULL":
        return "bg-red-100 text-red-800 border-red-200";
      case "UNAVAILABLE":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSlotStatusIcon = (slot: TimeSlotResponse) => {
    const status = getSlotStatus(slot);
    switch (status) {
      case "AVAILABLE":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "FULL":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "UNAVAILABLE":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Doctor Profile Header */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white"
      >
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Floating Background Elements */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"
        />

        <div className="relative z-10 p-8">
          <motion.button
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="mb-6 flex items-center text-white/80 hover:text-white transition-colors duration-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Search
          </motion.button>

          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Doctor Avatar */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30">
                {doctor.imageUrl ? (
                  <img
                    src={doctor.imageUrl || "/placeholder.svg"}
                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {doctor.firstName[0]}
                    {doctor.lastName[0]}
                  </span>
                )}
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Doctor Info */}
            <div className="flex-1">
              <motion.h2
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                Dr. {doctor.firstName} {doctor.lastName}
              </motion.h2>

              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-blue-100 font-medium text-xl mb-4"
              >
                {doctor.specialization}
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>{doctor.experienceYears}+ years experience</span>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  <Star className="w-4 h-4 text-yellow-300" />
                  <span>4.9 Rating (500+ reviews)</span>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{doctor.phone}</span>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{doctor.address}</span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Date Selection */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
      >
        <div className="flex items-center mb-8">
          <Calendar className="w-8 h-8 text-blue-500 mr-4" />
          <h3 className="text-2xl font-bold text-gray-900">
            Select Appointment Date
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {generateDateOptions().map((date, index) => (
            <motion.button
              key={date.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDate(date.value)}
              className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                selectedDate === date.value
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-blue-200"
              }`}
            >
              <div className="font-bold text-lg">
                {date.label.split(" ")[0]}
              </div>
              <div className="text-sm opacity-75">
                {date.label.split(" ").slice(1).join(" ")}
              </div>
              {selectedDate === date.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2"
                >
                  <CheckCircle className="w-5 h-5 mx-auto" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Availability Summary */}
      {availabilityData && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center">
              <Info className="w-8 h-8 text-blue-500 mr-4" />
              Availability Summary
            </h3>
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                availabilityData.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {availabilityData.isAvailable ? "Available" : "Not Available"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Slot Duration
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {availabilityData.slotDurationMinutes} mins
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">
                  Available Slots
                </span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {availabilityData.totalAvailableSlots}
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <div className="flex items-center mb-2">
                <Users className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">
                  Max per Slot
                </span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {availabilityData.maxPatientsPerSlot}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800">
                  Booked Slots
                </span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {availabilityData.totalBookedSlots}
              </p>
            </div>
          </div>

          {!availabilityData.isAvailable &&
            availabilityData.reasonForUnavailability && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-800">
                    Reason for Unavailability:
                  </span>
                </div>
                <p className="text-yellow-700 mt-2">
                  {availabilityData.reasonForUnavailability}
                </p>
              </div>
            )}
        </motion.div>
      )}

      {/* Available Slots */}
      {selectedDate && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-8 h-8 text-blue-500 mr-4" />
                  Time Slots
                </h3>
                <p className="text-gray-600 mt-2">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="text-blue-500"
              >
                <Activity className="w-8 h-8" />
              </motion.div>
            </div>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center py-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="relative"
                >
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full"
                  />
                </motion.div>
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-red-500 text-5xl mb-4"
                  >
                    ⚠️
                  </motion.div>
                  <h4 className="text-lg font-semibold text-red-800 mb-2">
                    Unable to load slots
                  </h4>
                  <p className="text-red-600 mb-4">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchAvailability}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 font-semibold"
                  >
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            ) : availabilityData ? (
              <div>
                {/* Time Slots Grid */}
                {availabilityData.timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {availabilityData.timeSlots.map((slot, index) => {
                      const isAvailable =
                        slot.isAvailable && slot.availableSlots > 0;
                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={isAvailable ? { scale: 1.05, y: -5 } : {}}
                          whileTap={isAvailable ? { scale: 0.95 } : {}}
                          onClick={() => handleSlotClick(slot)}
                          disabled={!isAvailable}
                          className={`p-6 rounded-2xl text-center transition-all duration-300 relative overflow-hidden group border-2 ${getSlotStatusColor(
                            slot
                          )} ${
                            isAvailable
                              ? "hover:shadow-lg cursor-pointer"
                              : "cursor-not-allowed"
                          }`}
                        >
                          <div className="relative z-10">
                            <div className="font-bold text-lg mb-1">
                              {formatTime(slot.startTime)}
                            </div>
                            <div className="text-sm opacity-75 mb-2">
                              {formatTime(slot.endTime)}
                            </div>

                            <div className="flex items-center justify-center space-x-1 text-xs mb-2">
                              {getSlotStatusIcon(slot)}
                              <span>{getSlotStatusText(slot)}</span>
                            </div>

                            {slot.availableSlots > 0 && (
                              <div className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                {slot.availableSlots}/
                                {slot.availableSlots + slot.bookedCount} left
                              </div>
                            )}
                          </div>

                          {isAvailable && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                              }}
                              className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"
                            />
                          )}

                          {!isAvailable && slot.reasonForUnavailability && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-2 rounded-2xl">
                              <p className="text-white text-xs text-center">
                                {slot.reasonForUnavailability}
                              </p>
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="text-8xl mb-6"
                    >
                      📅
                    </motion.div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      No slots available
                    </h4>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Unfortunately, there are no available time slots for this
                      date. Please try selecting a different date.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 2);
                        setSelectedDate(tomorrow.toISOString().split("T")[0]);
                      }}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                    >
                      Try Next Day
                    </motion.button>
                  </motion.div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorAvailability;

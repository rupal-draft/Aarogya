import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Plus,
  Settings,
  Users,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  CalendarDays,
  Timer,
  UserCheck,
  Ban,
} from "lucide-react";
import type {
  AvailabilityRangeResponse,
  ScheduleResponse,
  RecurringUnavailabilityResponse,
  SpecialAvailabilityResponse,
} from "../../types/availability";
import { AvailabilityStatus } from "../../Data/enums/availability";
import { availabilityService } from "../../Services/availabilityService";
import SlotManager from "../../components/Availability/SlotManager";
import ScheduleManager from "../../components/Availability/ScheduleManager";
import CalendarView from "../../components/Availability/CalendarView";
import AvailabilityModal from "../../components/Availability/AvailabilityModal";
import RecurringUnavailabilityModal from "../../components/Availability/RecurringUnavailabilityModal";
import SpecialAvailabilityModal from "../../components/Availability/SpecialAvailabilityModal";

const AvailabilityDashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availabilityRange, setAvailabilityRange] =
    useState<AvailabilityRangeResponse | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const [recurringUnavailabilities, setRecurringUnavailabilities] = useState<
    RecurringUnavailabilityResponse[]
  >([]);
  const [specialAvailabilities, setSpecialAvailabilities] = useState<
    SpecialAvailabilityResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"calendar" | "schedule" | "slots">(
    "calendar"
  );

  // Modal states
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showScheduleManager, setShowScheduleManager] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, [currentDate]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const [rangeData, scheduleData, recurringData, specialData] =
        await Promise.all([
          availabilityService.getAvailabilityRange({
            startDate: startOfMonth.toISOString().split("T")[0],
            endDate: endOfMonth.toISOString().split("T")[0],
            includeSlots: true,
          }),
          availabilityService.getSchedule(),
          availabilityService.getRecurringUnavailabilities(),
          availabilityService.getSpecialAvailabilities(),
        ]);

      setAvailabilityRange(rangeData);
      setSchedule(scheduleData);
      setRecurringUnavailabilities(recurringData);
      setSpecialAvailabilities(specialData);
    } catch (error) {
      console.error("Error fetching availability data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchInitialData();
  };

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return "green";
      case AvailabilityStatus.PARTIALLY_AVAILABLE:
        return "yellow";
      case AvailabilityStatus.FULLY_BOOKED:
        return "orange";
      case AvailabilityStatus.UNAVAILABLE:
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return CheckCircle;
      case AvailabilityStatus.PARTIALLY_AVAILABLE:
        return UserCheck;
      case AvailabilityStatus.FULLY_BOOKED:
        return Users;
      case AvailabilityStatus.UNAVAILABLE:
        return Ban;
      default:
        return AlertCircle;
    }
  };
  const totalDays =
    availabilityRange &&
    (new Date(availabilityRange.endDate).getTime() -
      new Date(availabilityRange.startDate).getTime()) /
      (1000 * 60 * 60 * 24) +
      1;

  const availableDays = availabilityRange?.totalAvailableDays ?? 0;

  // Slot-related values can be computed if backend sends per-day slots
  const totalSlots = availabilityRange
    ? availabilityRange.availabilities.reduce(
        (sum, a) => sum + (a.totalAvailableSlots ?? 0),
        0
      )
    : 0;

  const bookedSlots = availabilityRange
    ? availabilityRange.availabilities.reduce(
        (sum, a) => sum + (a.totalBookedSlots ?? 0),
        0
      )
    : 0;

  const availableSlots = totalSlots - bookedSlots;

  const stats = availabilityRange
    ? [
        {
          icon: CalendarDays,
          label: "Total Days",
          value: totalDays,
          color: "blue",
          change: `${availableDays} available`,
        },
        {
          icon: CheckCircle,
          label: "Available Days",
          value: availableDays,
          color: "green",
          change: `${Math.round((availableDays / totalDays) * 100)}% of range`,
        },
        {
          icon: Timer,
          label: "Total Slots",
          value: totalSlots,
          color: "purple",
          change: `${availableSlots} available`,
        },
        {
          icon: Users,
          label: "Booked Slots",
          value: bookedSlots,
          color: "orange",
          change: `${Math.round(
            totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0
          )}% utilization`,
        },
      ]
    : [];

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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-blue-100 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Availability Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Manage your schedule and appointments
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowScheduleManager(true)}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                Schedule Settings
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAvailabilityModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Set Availability
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        {stats.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-${stat.color}-100`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="text-right">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          type: "spring",
                          stiffness: 200,
                        }}
                        className={`text-2xl font-bold text-${stat.color}-600`}
                      >
                        {stat.value}
                      </motion.div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {stat.label}
                    </h3>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-blue-100">
            {[
              { id: "calendar", label: "Calendar View", icon: Calendar },
              { id: "schedule", label: "Weekly Schedule", icon: Clock },
              { id: "slots", label: "Slot Management", icon: Users },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-blue-50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "calendar" && (
              <CalendarView
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                availabilityRange={availabilityRange}
                specialAvailabilities={specialAvailabilities}
                onAvailabilityUpdate={fetchInitialData}
              />
            )}

            {activeTab === "schedule" && (
              <ScheduleManager
                schedule={schedule}
                onScheduleUpdate={fetchInitialData}
                recurringUnavailabilities={recurringUnavailabilities}
                onRecurringUpdate={fetchInitialData}
              />
            )}

            {activeTab === "slots" && (
              <SlotManager
                selectedDate={selectedDate || new Date()}
                onSlotUpdate={fetchInitialData}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowRecurringModal(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all"
              >
                <div className="p-2 bg-purple-500 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Recurring Unavailability
                  </div>
                  <div className="text-sm text-gray-600">
                    Set recurring time blocks
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSpecialModal(true)}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg hover:from-green-200 hover:to-emerald-200 transition-all"
              >
                <div className="p-2 bg-green-500 rounded-lg">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Special Availability
                  </div>
                  <div className="text-sm text-gray-600">
                    Set custom schedules
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const startDate = new Date();
                  const endDate = new Date();
                  endDate.setMonth(endDate.getMonth() + 1);
                  availabilityService
                    .generateAvailabilities(
                      startDate.toISOString().split("T")[0],
                      endDate.toISOString().split("T")[0]
                    )
                    .then(() => {
                      fetchInitialData();
                    });
                }}
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg hover:from-blue-200 hover:to-indigo-200 transition-all"
              >
                <div className="p-2 bg-blue-500 rounded-lg">
                  <CalendarDays className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    Generate Schedule
                  </div>
                  <div className="text-sm text-gray-600">
                    Auto-generate next month
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAvailabilityModal && (
          <AvailabilityModal
            isOpen={showAvailabilityModal}
            onClose={() => setShowAvailabilityModal(false)}
            selectedDate={selectedDate}
            onSuccess={fetchInitialData}
          />
        )}
        {showScheduleManager && (
          <ScheduleManager
            schedule={schedule}
            onScheduleUpdate={fetchInitialData}
            recurringUnavailabilities={recurringUnavailabilities}
            onRecurringUpdate={fetchInitialData}
            isModal={true}
            onClose={() => setShowScheduleManager(false)}
          />
        )}
        {showRecurringModal && (
          <RecurringUnavailabilityModal
            isOpen={showRecurringModal}
            onClose={() => setShowRecurringModal(false)}
            onSuccess={fetchInitialData}
          />
        )}
        {showSpecialModal && (
          <SpecialAvailabilityModal
            isOpen={showSpecialModal}
            onClose={() => setShowSpecialModal(false)}
            onSuccess={fetchInitialData}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AvailabilityDashboard;

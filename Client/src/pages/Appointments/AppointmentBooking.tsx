"use client";

import React, { useState } from "react";
import type { DoctorResponseDTO } from "../../types/doctor";
import EmergencyAppointmentForm from "../../components/Appointments/EmergencyAppointmentForm";
import PatientAppointments from "../../components/Appointments/PatientAppointments";
import DoctorSearch from "../../components/Doctors/DoctorSearch";
import DoctorAvailability from "../../components/Doctors/DoctorAvailability";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Heart,
  Stethoscope,
  Activity,
  Shield,
  Star,
  ArrowRight,
  Phone,
  Video,
  MapPin,
  ListChecks,
  Sparkles,
} from "lucide-react";
import AppointmentForm from "../../components/Appointments/AppointmentForm";

type BookingStep =
  | "search"
  | "availability"
  | "booking"
  | "emergency"
  | "appointments";

const AppointmentBooking: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("search");
  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorResponseDTO | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const handleDoctorSelect = (doctor: DoctorResponseDTO) => {
    setSelectedDoctor(doctor);
    setCurrentStep("availability");
  };

  const handleSlotSelect = (
    date: string,
    slot: { startTime: string; endTime: string }
  ) => {
    setSelectedDate(date);
    setSelectedSlot(slot);
    setCurrentStep("booking");
  };

  const handleBookingComplete = () => {
    setCurrentStep("appointments");
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedSlot(null);
  };

  const handleEmergencyComplete = () => {
    setCurrentStep("appointments");
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

  const renderHeroSection = () => {
    if (currentStep !== "search") return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full"
          />

          {/* Floating Medical Icons */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 text-white/20"
          >
            <Stethoscope size={40} />
          </motion.div>

          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-32 right-32 text-white/20"
          >
            <Heart size={35} />
          </motion.div>

          <motion.div
            animate={{
              y: [-5, 15, -5],
              x: [-5, 5, -5],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute bottom-40 left-40 text-white/20"
          >
            <Activity size={30} />
          </motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                >
                  <Calendar className="w-10 h-10 text-white" />
                </motion.div>
                <motion.div
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                  className="absolute inset-0 w-20 h-20 bg-white/10 rounded-full"
                />
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
            >
              Book Your
              <span className="block text-yellow-300">Health Journey</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with world-class healthcare professionals. Schedule
              appointments, get emergency care, and manage your health with
              ease.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep("search")}
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3"
              >
                <Search className="w-6 h-6" />
                <span>Find Doctor</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep("emergency")}
                className="group bg-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl hover:bg-red-600 transition-all duration-300 flex items-center space-x-3"
              >
                <AlertTriangle className="w-6 h-6" />
                <span>Emergency Care</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* New Beautiful Appointments Button */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentStep("appointments")}
                className="group relative bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-3 overflow-hidden"
              >
                {/* Animated sparkle effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute -left-4 top-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                </motion.div>

                {/* Main content */}
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <ListChecks className="w-6 h-6" />
                </motion.div>
                <span>My Appointments</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                {/* Hover effect overlay */}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  whileHover={{ x: "100%", opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12"
                />

                {/* Pulsing dot */}
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute top-3 right-3 w-2 h-2 bg-yellow-300 rounded-full"
                />
              </motion.button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  className="text-4xl font-bold text-yellow-300 mb-2"
                >
                  500+
                </motion.div>
                <div className="text-blue-100 flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Expert Doctors</span>
                </div>
              </div>

              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                  }}
                  className="text-4xl font-bold text-green-300 mb-2"
                >
                  24/7
                </motion.div>
                <div className="text-blue-100 flex items-center justify-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Emergency Care</span>
                </div>
              </div>

              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                  }}
                  className="text-4xl font-bold text-pink-300 mb-2"
                >
                  98%
                </motion.div>
                <div className="text-blue-100 flex items-center justify-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Satisfaction Rate</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: "search", label: "Find Doctor", icon: Search },
      { key: "availability", label: "Select Time", icon: Calendar },
      { key: "booking", label: "Book Appointment", icon: CheckCircle },
    ];

    if (currentStep === "emergency" || currentStep === "appointments") {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-12"
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.key;
              const isCompleted =
                steps.findIndex((s) => s.key === currentStep) > index;

              return (
                <React.Fragment key={step.key}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <motion.div
                      animate={isActive ? { rotate: [0, 360] } : {}}
                      transition={{
                        duration: 2,
                        repeat: isActive ? Number.POSITIVE_INFINITY : 0,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <span className="font-semibold">{step.label}</span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-1 bg-green-500 rounded-full origin-left"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  const renderQuickActions = () => {
    if (currentStep !== "search") return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 mt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <p className="text-gray-600 text-lg">
              Get started with your healthcare journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep("search")}
              className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Find Doctors
                </h3>
                <p className="text-gray-600 text-sm">
                  Search by specialty or name
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep("emergency")}
              className="group bg-gradient-to-br from-red-50 to-pink-100 p-8 rounded-2xl border border-red-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Emergency</h3>
                <p className="text-gray-600 text-sm">Urgent medical care</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep("appointments")}
              className="group bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border border-green-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  My Appointments
                </h3>
                <p className="text-gray-600 text-sm">View scheduled visits</p>
              </div>
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="group bg-gradient-to-br from-purple-50 to-violet-100 p-8 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Health Records
                </h3>
                <p className="text-gray-600 text-sm">
                  Access your medical history
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderServiceHighlights = () => {
    if (currentStep !== "search") return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mb-16 bg-gradient-to-r from-gray-50 to-blue-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose Our Healthcare Platform?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience world-class healthcare with cutting-edge technology and
              compassionate care
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "Telemedicine",
                description:
                  "Consult with doctors from the comfort of your home",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Clock,
                title: "24/7 Availability",
                description: "Round-the-clock emergency care and support",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your health data is protected with enterprise-grade security",
                color: "from-purple-500 to-violet-500",
              },
              {
                icon: Star,
                title: "Top-Rated Doctors",
                description:
                  "Access to highly qualified and experienced specialists",
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: Phone,
                title: "Instant Support",
                description: "Get immediate help when you need it most",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: MapPin,
                title: "Multiple Locations",
                description: "Convenient healthcare centers across the city",
                color: "from-indigo-500 to-blue-500",
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          {renderHeroSection()}
          {renderQuickActions()}
          {renderServiceHighlights()}
          {renderStepIndicator()}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            {currentStep === "search" && (
              <DoctorSearch onDoctorSelect={handleDoctorSelect} />
            )}

            {currentStep === "availability" && selectedDoctor && (
              <DoctorAvailability
                doctor={selectedDoctor}
                onSlotSelect={handleSlotSelect}
                onBack={() => setCurrentStep("search")}
              />
            )}

            {currentStep === "booking" &&
              selectedDoctor &&
              selectedDate &&
              selectedSlot && (
                <AppointmentForm
                  doctor={selectedDoctor}
                  date={selectedDate}
                  slot={selectedSlot}
                  onComplete={handleBookingComplete}
                  onBack={() => setCurrentStep("availability")}
                />
              )}

            {currentStep === "emergency" && (
              <EmergencyAppointmentForm
                onComplete={handleEmergencyComplete}
                onBack={() => setCurrentStep("search")}
              />
            )}

            {currentStep === "appointments" && (
              <PatientAppointments onBack={() => setCurrentStep("search")} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AppointmentBooking;

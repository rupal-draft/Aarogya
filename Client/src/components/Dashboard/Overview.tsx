"use client";

import type { FC } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Shield,
  Pill,
  Target,
  HeartPulse,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  TrendingUp,
  Stethoscope,
  AlertTriangle,
  Users,
  FileText,
  Sparkles,
  Heart,
  Brain,
  Eye,
} from "lucide-react";
import VitalCard from "./VitalCard";
import AllergyCard from "./AllergyCard";
import MedicalConditionCard from "./MedicalConditionCard";
import MedicationCard from "./MedicationCard";
import GoalCard from "./GoalCard";
import EmergencyContactCard from "./EmergencyContactCard";
import DoctorNoteCard from "./DoctorNoteCard";
import type { PatientDashboardData } from "../../types/dashboard";
import GlassCard from "../../common/Cards/GlassCard";
import { AnimatedCounter } from "../../pages/Dashboard/PatientDashboard";

type DashboardOverviewProps = {
  data: PatientDashboardData;
};

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

const PulsingBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
};

const DashboardOverview: FC<DashboardOverviewProps> = ({ data }) => {
  return (
    <div className="relative min-h-screen">
      <PulsingBackground />
      <FloatingParticles />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 space-y-12 p-6"
      >
        {data?.data && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-12 relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <div className="relative z-10 py-8">
                <motion.div
                  className="flex justify-center items-center gap-4 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <motion.div
                    className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Heart className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.div
                    className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl"
                    animate={{
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  >
                    <Brain className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.div
                    className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-2xl"
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <Eye className="w-12 h-12 text-white" />
                  </motion.div>
                </motion.div>
                <motion.h1
                  className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  Health Dashboard
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Your comprehensive health overview at a glance
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
            >
              {/* Health Score */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                className="group perspective-1000"
              >
                <GlassCard
                  className="p-8 text-center relative overflow-hidden
                    backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 
                    border border-white/40 shadow-2xl rounded-3xl 
                    hover:shadow-blue-500/25 hover:shadow-3xl transition-all duration-500
                    before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/10 before:to-purple-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl"
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="relative z-10 p-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-3xl 
                     w-fit mx-auto mb-6 shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500"
                    whileHover={{
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: 1.15,
                      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Activity className="w-10 h-10 text-white drop-shadow-lg" />
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-3xl"
                      animate={{
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold text-sky-900 mb-3 tracking-wide"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(59, 130, 246, 0)",
                        "0 0 10px rgba(59, 130, 246, 0.3)",
                        "0 0 0px rgba(59, 130, 246, 0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    Health Score
                  </motion.h3>
                  <div className="text-5xl font-black bg-gradient-to-r from-sky-600 via-blue-700 to-purple-700 bg-clip-text text-transparent drop-shadow-lg">
                    <AnimatedCounter
                      value={data.data.healthOverview?.healthScore || 0}
                    />
                  </div>
                  <motion.div
                    className="absolute top-4 right-4"
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-blue-400/60" />
                  </motion.div>
                </GlassCard>
              </motion.div>

              {/* Overall Status */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                className="group perspective-1000"
              >
                <GlassCard className="p-8 text-center relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 border border-white/40 shadow-2xl rounded-3xl hover:shadow-emerald-500/25 hover:shadow-3xl transition-all duration-500">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl"
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  <motion.div
                    className="relative z-10 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl w-fit mx-auto mb-6 shadow-2xl group-hover:shadow-emerald-500/50 transition-all duration-500"
                    whileHover={{
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: 1.15,
                      boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.5)",
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Shield className="w-10 h-10 text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-sky-900 mb-3 tracking-wide">
                    Overall Status
                  </h3>
                  <motion.div
                    className="text-2xl font-bold text-emerald-600"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    {data.data.healthOverview?.overallHealthStatus || "Good"}
                  </motion.div>
                </GlassCard>
              </motion.div>

              {/* Active Meds */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                className="group perspective-1000"
              >
                <GlassCard className="p-8 text-center relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 border border-white/40 shadow-2xl rounded-3xl hover:shadow-purple-500/25 hover:shadow-3xl transition-all duration-500">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-3xl"
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  />
                  <motion.div
                    className="relative z-10 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl w-fit mx-auto mb-6 shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-500"
                    whileHover={{
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: 1.15,
                      boxShadow: "0 25px 50px -12px rgba(147, 51, 234, 0.5)",
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Pill className="w-10 h-10 text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-sky-900 mb-3 tracking-wide">
                    Active Meds
                  </h3>
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-600 via-indigo-700 to-pink-700 bg-clip-text text-transparent drop-shadow-lg">
                    <AnimatedCounter
                      value={
                        data.data.dashboard?.activeMedications?.length || 0
                      }
                    />
                  </div>
                </GlassCard>
              </motion.div>

              {/* Active Goals */}
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: -5,
                  z: 50,
                }}
                whileTap={{ scale: 0.95 }}
                className="group perspective-1000"
              >
                <GlassCard className="p-8 text-center relative overflow-hidden backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/10 border border-white/40 shadow-2xl rounded-3xl hover:shadow-orange-500/25 hover:shadow-3xl transition-all duration-500">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-3xl"
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 3,
                    }}
                  />
                  <motion.div
                    className="relative z-10 p-6 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl w-fit mx-auto mb-6 shadow-2xl group-hover:shadow-orange-500/50 transition-all duration-500"
                    whileHover={{
                      rotate: [0, -10, 10, -5, 5, 0],
                      scale: 1.15,
                      boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)",
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <Target className="w-10 h-10 text-white drop-shadow-lg" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-sky-900 mb-3 tracking-wide">
                    Active Goals
                  </h3>
                  <div className="text-5xl font-black bg-gradient-to-r from-orange-600 via-amber-700 to-red-700 bg-clip-text text-transparent drop-shadow-lg">
                    <AnimatedCounter
                      value={data.data.dashboard?.activeGoals?.length || 0}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8 space-y-8"
              >
                <motion.div
                  className="flex items-center justify-between relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-red-500/5 rounded-2xl blur-xl"
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <h2 className="relative z-10 text-4xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <HeartPulse className="w-10 h-10 text-rose-500 drop-shadow-lg" />
                    </motion.div>
                    Latest Vital Signs
                  </h2>
                </motion.div>

                {data.data.dashboard?.latestVitals && (
                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, staggerChildren: 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Activity}
                        label="Systolic BP"
                        value={
                          data.data.dashboard.latestVitals.bloodPressureSystolic
                        }
                        unit="mmHg"
                        color="bg-gradient-to-br from-rose-500 via-pink-600 to-red-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Activity}
                        label="Diastolic BP"
                        value={
                          data.data.dashboard.latestVitals
                            .bloodPressureDiastolic
                        }
                        unit="mmHg"
                        color="bg-gradient-to-br from-rose-400 via-pink-500 to-red-500"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={HeartPulse}
                        label="Heart Rate"
                        value={data.data.dashboard.latestVitals.heartRate}
                        unit="bpm"
                        color="bg-gradient-to-br from-pink-500 via-rose-600 to-red-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Thermometer}
                        label="Temperature"
                        value={data.data.dashboard.latestVitals.temperature}
                        unit="°F"
                        color="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Droplets}
                        label="Oxygen Saturation"
                        value={
                          data.data.dashboard.latestVitals.oxygenSaturation
                        }
                        unit="%"
                        color="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Wind}
                        label="Respiratory Rate"
                        value={data.data.dashboard.latestVitals.respiratoryRate}
                        unit="/min"
                        color="bg-gradient-to-br from-teal-500 via-cyan-600 to-blue-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Zap}
                        label="Weight"
                        value={data.data.dashboard.latestVitals.weight}
                        unit="kg"
                        color="bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={TrendingUp}
                        label="Height"
                        value={data.data.dashboard.latestVitals.height}
                        unit="cm"
                        color="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, z: 10 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <VitalCard
                        icon={Activity}
                        label="BMI"
                        value={data.data.dashboard.latestVitals.bmi}
                        unit=""
                        color="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {data.data.dashboard?.criticalAllergies?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-4 space-y-6"
                >
                  <motion.div
                    className="flex items-center justify-between relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 rounded-2xl blur-xl"
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <h2 className="relative z-10 text-3xl font-bold text-gray-800 flex items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <AlertTriangle className="w-8 h-8 text-red-500 drop-shadow-lg" />
                      </motion.div>
                      Critical Allergies
                    </h2>
                  </motion.div>

                  <div className="space-y-4">
                    {data.data.dashboard.criticalAllergies
                      .slice(0, 2)
                      .map((allergy, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow:
                              "0 20px 40px -12px rgba(239, 68, 68, 0.25)",
                          }}
                        >
                          <AllergyCard allergy={allergy} />
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <motion.div
                  className="flex items-center justify-between relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl"
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <h2 className="relative z-10 text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-4">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <Stethoscope className="w-10 h-10 text-blue-500 drop-shadow-lg" />
                    </motion.div>
                    Medical Conditions
                  </h2>
                </motion.div>

                {data.data.dashboard?.activeMedicalConditions?.length > 0 && (
                  <div className="space-y-4">
                    {data.data.dashboard.activeMedicalConditions
                      .slice(0, 4)
                      .map((condition, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{
                            scale: 1.03,
                            x: 10,
                            boxShadow:
                              "0 20px 40px -12px rgba(59, 130, 246, 0.25)",
                          }}
                        >
                          <MedicalConditionCard condition={condition} />
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <motion.div
                  className="flex items-center justify-between relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl"
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <h2 className="relative z-10 text-4xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-4">
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Pill className="w-10 h-10 text-green-500 drop-shadow-lg" />
                    </motion.div>
                    Current Medications
                  </h2>
                </motion.div>

                {data.data.dashboard?.activeMedications?.length > 0 && (
                  <div className="space-y-4">
                    {data.data.dashboard.activeMedications
                      .slice(0, 3)
                      .map((medication, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{
                            scale: 1.03,
                            x: -10,
                            boxShadow:
                              "0 20px 40px -12px rgba(16, 185, 129, 0.25)",
                          }}
                        >
                          <MedicationCard medication={medication} />
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                className="flex items-center justify-between relative"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl blur-xl"
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <h2 className="relative z-10 text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    <Target className="w-10 h-10 text-purple-500 drop-shadow-lg" />
                  </motion.div>
                  Health Goals Progress
                </h2>
              </motion.div>

              {data.data.dashboard?.activeGoals?.length > 0 && (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, staggerChildren: 0.1 }}
                >
                  {data.data.dashboard.activeGoals
                    .slice(0, 3)
                    .map((goal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{
                          scale: 1.05,
                          rotateY: 5,
                          boxShadow:
                            "0 25px 50px -12px rgba(147, 51, 234, 0.25)",
                        }}
                      >
                        <GoalCard goal={goal} />
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="lg:col-span-2 space-y-6"
              >
                <motion.div
                  className="flex items-center justify-between relative"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 rounded-2xl blur-xl"
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <h2 className="relative z-10 text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Users className="w-10 h-10 text-blue-500 drop-shadow-lg" />
                    </motion.div>
                    Emergency Contacts
                  </h2>
                </motion.div>

                {data.data.emergencyContacts?.length > 0 && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, staggerChildren: 0.1 }}
                  >
                    {data.data.emergencyContacts
                      .slice(0, 4)
                      .map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow:
                              "0 20px 40px -12px rgba(59, 130, 246, 0.25)",
                          }}
                        >
                          <EmergencyContactCard contact={contact} />
                        </motion.div>
                      ))}
                  </motion.div>
                )}
              </motion.div>

              {data.data.dashboard?.recentDoctorNotes?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-6"
                >
                  <motion.div
                    className="flex items-center justify-between relative"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-2xl blur-xl"
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <h2 className="relative z-10 text-3xl font-bold text-gray-800 flex items-center gap-3">
                      <motion.div
                        animate={{
                          y: [0, -3, 0],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      >
                        <FileText className="w-8 h-8 text-purple-500 drop-shadow-lg" />
                      </motion.div>
                      Recent Notes
                    </h2>
                  </motion.div>

                  <div className="space-y-4">
                    {data.data.dashboard.recentDoctorNotes
                      .slice(0, 2)
                      .map((note, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                          whileHover={{
                            scale: 1.03,
                            boxShadow:
                              "0 20px 40px -12px rgba(147, 51, 234, 0.25)",
                          }}
                        >
                          <DoctorNoteCard note={note} />
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardOverview;

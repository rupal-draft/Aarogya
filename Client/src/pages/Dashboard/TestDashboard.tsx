"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  HeartPulse,
  Thermometer,
  Droplets,
  Wind,
  Zap,
  Stethoscope,
  Pill,
  Target,
  AlertTriangle,
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import { Home, Brain, BarChart3 } from "lucide-react";
import axios from "axios";

const tabs = [
  { id: "overview", label: "Overview", icon: Home, count: undefined },
  {
    id: "diseases",
    label: "Disease History",
    icon: FileText,
    count: undefined,
  },
  { id: "history", label: "Medical History", icon: FileText, count: undefined }, // Added medical history tab
  {
    id: "allergies",
    label: "Allergies",
    icon: AlertTriangle,
    count: undefined,
  },
  { id: "medications", label: "Medications", icon: Pill, count: undefined },
  { id: "vitals", label: "Vitals", icon: Activity, count: undefined },
  { id: "symptoms", label: "Symptoms", icon: Brain, count: undefined },
  { id: "goals", label: "Health Goals", icon: Target, count: undefined },
  {
    id: "contacts",
    label: "Emergency Contacts",
    icon: Users,
    count: undefined,
  },
  { id: "notes", label: "Doctor Notes", icon: Stethoscope, count: undefined },
  { id: "analytics", label: "Analytics", icon: BarChart3, count: undefined },
];

interface PatientDashboardData {
  success: boolean;
  message: string;
  data: {
    dashboard: {
      latestVitals: {
        bloodPressureSystolic: number;
        bloodPressureDiastolic: number;
        heartRate: number;
        bodyTemperature: number;
        oxygenSaturation: number;
        respiratoryRate: number;
        weight: number;
        height: number;
        bmi: number;
        recordedAt: string;
      };
      activeMedicalConditions: Array<{
        conditionName: string;
        severity: string;
        diagnosedDate: string;
        status: string;
        description: string;
      }>;
      criticalAllergies: Array<{
        allergen: string;
        severity: string;
        reaction: string;
        diagnosedDate: string;
      }>;
      activeMedications: Array<{
        medicationName: string;
        dosage: string;
        frequency: string;
        startDate: string;
        prescribedBy: string;
        instructions: string;
      }>;
      activeGoals: Array<{
        goalType: string;
        targetValue: number;
        currentValue: number;
        unit: string;
        targetDate: string;
        progress: number;
        status: string;
      }>;
      recentDoctorNotes: Array<{
        noteDate: string;
        doctorName: string;
        noteType: string;
        content: string;
        followUpRequired: boolean;
      }>;
      healthSummary: {
        overallStatus: string;
        riskFactors: string[];
        recommendations: string[];
      };
    };
    healthOverview: {
      overallHealthStatus: string;
      healthScore: number;
      lastUpdated: string;
    };
    emergencyContacts: Array<{
      name: string;
      relationship: string;
      phoneNumber: string;
      email: string;
      address: string;
      isPrimary: boolean;
    }>;
    recentVitals: Array<{
      bloodPressureSystolic: number;
      bloodPressureDiastolic: number;
      heartRate: number;
      bodyTemperature: number;
      oxygenSaturation: number;
      respiratoryRate: number;
      recordedAt: string;
    }>;
    allergies: Array<{
      allergen: string;
      severity: string;
      reaction: string;
      diagnosedDate: string;
    }>;
    medications: Array<{
      medicationName: string;
      dosage: string;
      frequency: string;
      startDate: string;
      prescribedBy: string;
      instructions: string;
    }>;
    healthGoals: Array<{
      goalType: string;
      targetValue: number;
      currentValue: number;
      unit: string;
      targetDate: string;
      progress: number;
      status: string;
    }>;
    doctorNotes: Array<{
      noteDate: string;
      doctorName: string;
      noteType: string;
      content: string;
      followUpRequired: boolean;
    }>;
  };
  timestamp: string;
}

const GlassCard = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`backdrop-blur-xl bg-gradient-to-br from-white/30 via-sky-100/40 to-blue-100/30 border border-sky-200/50 rounded-3xl shadow-2xl hover:shadow-sky-500/25 transition-all duration-500 cursor-pointer hover:border-sky-300/60 ${className}`}
    onClick={onClick}
  >
    <motion.div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-transparent to-blue-500/10 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const ShowMoreButton = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) => (
  <motion.button
    whileHover={{
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white rounded-full hover:from-sky-600 hover:via-blue-600 hover:to-indigo-700 transition-all duration-500 shadow-xl hover:shadow-2xl backdrop-blur-sm border border-sky-300/30"
  >
    <Eye className="w-4 h-4" />
    {label}
  </motion.button>
);

const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(count + 1);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [count, value]);

  return <span>{count}</span>;
};

const VitalCard = ({
  icon: Icon,
  label,
  value,
  unit,
  color,
  trend,
}: {
  icon: any;
  label: string;
  value: number | string;
  unit: string;
  color: string;
  trend?: "up" | "down" | "stable";
}) => (
  <GlassCard className="p-6 text-center group">
    <motion.div
      className={`p-4 ${color} rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="w-8 h-8 text-white" />
    </motion.div>
    <h3 className="text-sm font-medium text-sky-700 mb-2">{label}</h3>
    <div className="flex items-center justify-center gap-2">
      <motion.span
        className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {value}
      </motion.span>
      <span className="text-sm text-sky-600">{unit}</span>
      {trend && (
        <TrendingUp
          className={`w-4 h-4 ${
            trend === "up"
              ? "text-emerald-500"
              : trend === "down"
              ? "text-rose-500"
              : "text-sky-400"
          }`}
        />
      )}
    </div>
  </GlassCard>
);

const MedicalConditionCard = ({ condition }: { condition: any }) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-semibold text-gray-800 text-lg">
        {condition.conditionName}
      </h3>
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          condition.severity === "High"
            ? "bg-red-100 text-red-800"
            : condition.severity === "Medium"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {condition.severity}
      </span>
    </div>
    <p className="text-gray-600 text-sm mb-3">{condition.description}</p>
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>
        Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString()}
      </span>
      <span
        className={`px-2 py-1 rounded ${
          condition.status === "Active"
            ? "bg-red-100 text-red-700"
            : "bg-green-100 text-green-700"
        }`}
      >
        {condition.status}
      </span>
    </div>
  </GlassCard>
);

const MedicationCard = ({ medication }: { medication: any }) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Pill className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">
            {medication.medicationName}
          </h3>
          <p className="text-sm text-gray-600">{medication.dosage}</p>
        </div>
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-600">Frequency:</span>
        <span className="font-medium">{medication.frequency}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Prescribed by:</span>
        <span className="font-medium">{medication.prescribedBy}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Started:</span>
        <span className="font-medium">
          {new Date(medication.startDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  </GlassCard>
);

const GoalCard = ({ goal }: { goal: any }) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Target className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{goal.goalType}</h3>
          <p className="text-sm text-gray-600">
            {goal.currentValue} / {goal.targetValue} {goal.unit}
          </p>
        </div>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          goal.status === "On Track"
            ? "bg-green-100 text-green-800"
            : goal.status === "Behind"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {goal.status}
      </span>
    </div>
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>Progress</span>
        <span>{goal.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${goal.progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
        />
      </div>
    </div>
    <div className="text-xs text-gray-500">
      Target Date: {new Date(goal.targetDate).toLocaleDateString()}
    </div>
  </GlassCard>
);

const AllergyCard = ({ allergy }: { allergy: any }) => (
  <GlassCard className="p-4">
    <div className="flex items-center gap-3 mb-3">
      <div
        className={`p-2 rounded-lg ${
          allergy.severity === "Severe"
            ? "bg-red-100"
            : allergy.severity === "Moderate"
            ? "bg-yellow-100"
            : "bg-green-100"
        }`}
      >
        <AlertTriangle
          className={`w-4 h-4 ${
            allergy.severity === "Severe"
              ? "text-red-600"
              : allergy.severity === "Moderate"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">
          {allergy.allergen}
        </h3>
        <p className="text-xs text-gray-600">{allergy.severity}</p>
      </div>
    </div>
    <p className="text-xs text-gray-600 mb-2">{allergy.reaction}</p>
    <div className="text-xs text-gray-500">
      Since: {new Date(allergy.diagnosedDate).toLocaleDateString()}
    </div>
  </GlassCard>
);

const EmergencyContactCard = ({ contact }: { contact: any }) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            contact.isPrimary ? "bg-red-100" : "bg-blue-100"
          }`}
        >
          <Users
            className={`w-5 h-5 ${
              contact.isPrimary ? "text-red-600" : "text-blue-600"
            }`}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{contact.name}</h3>
          <p className="text-sm text-gray-600">{contact.relationship}</p>
        </div>
      </div>
      {contact.isPrimary && (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
          Primary
        </span>
      )}
    </div>
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-gray-400" />
        <span>{contact.phoneNumber}</span>
      </div>
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-gray-400" />
        <span className="truncate">{contact.email}</span>
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
        <span className="text-xs">{contact.address}</span>
      </div>
    </div>
  </GlassCard>
);

const DoctorNoteCard = ({ note }: { note: any }) => (
  <GlassCard className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <FileText className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{note.noteType}</h3>
          <p className="text-sm text-gray-600">Dr. {note.doctorName}</p>
        </div>
      </div>
      {note.followUpRequired && (
        <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
          Follow-up Required
        </span>
      )}
    </div>
    <p className="text-gray-700 text-sm mb-3 line-clamp-3">{note.content}</p>
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <Calendar className="w-4 h-4" />
      {new Date(note.noteDate).toLocaleDateString()}
    </div>
  </GlassCard>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
    />
  </div>
);

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="p-4 bg-red-100 rounded-full">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-red-600 text-center">{error}</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRetry}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </motion.button>
  </div>
);

const TabNavigation = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-sky-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-xl border border-sky-200/50 rounded-3xl p-2 shadow-2xl mb-8"
  >
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
              isActive
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                : "text-sky-700 hover:bg-sky-100/50 hover:text-sky-800"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  </motion.div>
);

const TabContent = ({ activeTab, data }: { activeTab: string; data: any }) => {
  if (activeTab === "overview") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {data?.data && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              <GlassCard className="p-6 text-center group">
                <motion.div
                  className="p-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Activity className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-sky-800 mb-2">
                  Health Score
                </h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                  <AnimatedCounter
                    value={data.data.healthOverview?.healthScore || 0}
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6 text-center group">
                <motion.div
                  className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-sky-800 mb-2">
                  Overall Status
                </h3>
                <div className="text-lg font-bold text-emerald-600">
                  {data.data.healthOverview?.overallHealthStatus || "Good"}
                </div>
              </GlassCard>

              <GlassCard className="p-6 text-center group">
                <motion.div
                  className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Pill className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-sky-800 mb-2">
                  Active Meds
                </h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                  <AnimatedCounter
                    value={data.data.dashboard?.activeMedications?.length || 0}
                  />
                </div>
              </GlassCard>

              <GlassCard className="p-6 text-center group">
                <motion.div
                  className="p-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl w-fit mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Target className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-sky-800 mb-2">
                  Active Goals
                </h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
                  <AnimatedCounter
                    value={data.data.dashboard?.activeGoals?.length || 0}
                  />
                </div>
              </GlassCard>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent flex items-center gap-3">
                    <HeartPulse className="w-8 h-8 text-rose-500" />
                    Latest Vital Signs
                  </h2>
                </div>

                {data.data.dashboard?.latestVitals && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <VitalCard
                      icon={Activity}
                      label="Systolic BP"
                      value={
                        data.data.dashboard.latestVitals.bloodPressureSystolic
                      }
                      unit="mmHg"
                      color="bg-gradient-to-r from-rose-500 to-pink-600"
                    />
                    <VitalCard
                      icon={Activity}
                      label="Diastolic BP"
                      value={
                        data.data.dashboard.latestVitals.bloodPressureDiastolic
                      }
                      unit="mmHg"
                      color="bg-gradient-to-r from-rose-400 to-pink-500"
                    />
                    <VitalCard
                      icon={HeartPulse}
                      label="Heart Rate"
                      value={data.data.dashboard.latestVitals.heartRate}
                      unit="bpm"
                      color="bg-gradient-to-r from-pink-500 to-rose-600"
                    />
                    <VitalCard
                      icon={Thermometer}
                      label="Temperature"
                      value={data.data.dashboard.latestVitals.bodyTemperature}
                      unit="°F"
                      color="bg-gradient-to-r from-orange-500 to-amber-600"
                    />
                    <VitalCard
                      icon={Droplets}
                      label="Oxygen Saturation"
                      value={data.data.dashboard.latestVitals.oxygenSaturation}
                      unit="%"
                      color="bg-gradient-to-r from-sky-500 to-blue-600"
                    />
                    <VitalCard
                      icon={Wind}
                      label="Respiratory Rate"
                      value={data.data.dashboard.latestVitals.respiratoryRate}
                      unit="/min"
                      color="bg-gradient-to-r from-teal-500 to-cyan-600"
                    />
                    <VitalCard
                      icon={Zap}
                      label="Weight"
                      value={data.data.dashboard.latestVitals.weight}
                      unit="kg"
                      color="bg-gradient-to-r from-purple-500 to-indigo-600"
                    />
                    <VitalCard
                      icon={TrendingUp}
                      label="Height"
                      value={data.data.dashboard.latestVitals.height}
                      unit="cm"
                      color="bg-gradient-to-r from-emerald-500 to-teal-600"
                    />
                    <VitalCard
                      icon={Activity}
                      label="BMI"
                      value={data.data.dashboard.latestVitals.bmi}
                      unit=""
                      color="bg-gradient-to-r from-indigo-500 to-blue-600"
                    />
                  </div>
                )}
              </motion.div>

              {data.data.dashboard?.criticalAllergies?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="lg:col-span-4 space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                      Critical Allergies
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {data.data.dashboard.criticalAllergies
                      .slice(0, 4)
                      .map((allergy, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Stethoscope className="w-8 h-8 text-blue-500" />
                    Medical Conditions
                  </h2>
                </div>

                {data.data.dashboard?.activeMedicalConditions?.length > 0 && (
                  <div className="space-y-4">
                    {data.data.dashboard.activeMedicalConditions
                      .slice(0, 5)
                      .map((condition, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Pill className="w-8 h-8 text-green-500" />
                    Current Medications
                  </h2>
                </div>

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
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Target className="w-8 h-8 text-purple-500" />
                  Health Goals Progress
                </h2>
              </div>

              {data.data.dashboard?.activeGoals?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.data.dashboard.activeGoals
                    .slice(0, 3)
                    .map((goal, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                      >
                        <GoalCard goal={goal} />
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="lg:col-span-2 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-500" />
                    Emergency Contacts
                  </h2>
                </div>

                {data.data.emergencyContacts?.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.data.emergencyContacts
                      .slice(0, 4)
                      .map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + index * 0.1 }}
                        >
                          <EmergencyContactCard contact={contact} />
                        </motion.div>
                      ))}
                  </div>
                )}
              </motion.div>

              {data.data.dashboard?.recentDoctorNotes?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-purple-500" />
                      Recent Notes
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {data.data.dashboard.recentDoctorNotes
                      .slice(0, 2)
                      .map((note, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <GlassCard className="p-12 max-w-md mx-auto">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="p-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full w-fit mx-auto mb-6"
        >
          {tabs.find((tab) => tab.id === activeTab)?.icon &&
            React.createElement(
              tabs.find((tab) => tab.id === activeTab)!.icon,
              {
                className: "w-12 h-12 text-white",
              }
            )}
        </motion.div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent mb-4">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </h2>
        <p className="text-sky-600 text-lg">
          This section is coming soon! We're working hard to bring you
          comprehensive{" "}
          {tabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{" "}
          management.
        </p>
      </GlassCard>
    </motion.div>
  );
};

export default function PatientDashboard() {
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/patient/dashboard/complete-profile",
        {
          withCredentials: true,
        }
      );
      setData(response.data);
      //   setData({
      //     success: true,
      //     message: "Patient profile retrieved successfully",
      //     data: {
      //       dashboard: {
      //         latestVitals: {
      //           bloodPressureSystolic: 120,
      //           bloodPressureDiastolic: 80,
      //           heartRate: 76,
      //           bodyTemperature: 98.6,
      //           oxygenSaturation: 98,
      //           respiratoryRate: 16,
      //           weight: 70,
      //           height: 175,
      //           bmi: 22.9,
      //           recordedAt: "2024-01-15T10:30:00Z",
      //         },
      //         activeMedicalConditions: [
      //           {
      //             conditionName: "Hypertension",
      //             severity: "Medium",
      //             diagnosedDate: "2023-06-15T00:00:00Z",
      //             status: "Active",
      //             description:
      //               "High blood pressure requiring medication management",
      //           },
      //           {
      //             conditionName: "Type 2 Diabetes",
      //             severity: "High",
      //             diagnosedDate: "2022-03-10T00:00:00Z",
      //             status: "Active",
      //             description: "Diabetes mellitus type 2 with dietary management",
      //           },
      //           {
      //             conditionName: "Asthma",
      //             severity: "Low",
      //             diagnosedDate: "2020-08-22T00:00:00Z",
      //             status: "Controlled",
      //             description: "Mild intermittent asthma with inhaler as needed",
      //           },
      //         ],
      //         criticalAllergies: [
      //           {
      //             allergen: "Penicillin",
      //             severity: "Severe",
      //             reaction: "Anaphylaxis",
      //             diagnosedDate: "2019-05-12T00:00:00Z",
      //           },
      //           {
      //             allergen: "Shellfish",
      //             severity: "Moderate",
      //             reaction: "Hives and swelling",
      //             diagnosedDate: "2018-09-03T00:00:00Z",
      //           },
      //         ],
      //         activeMedications: [
      //           {
      //             medicationName: "Lisinopril",
      //             dosage: "10mg",
      //             frequency: "Once daily",
      //             startDate: "2023-06-15T00:00:00Z",
      //             prescribedBy: "Dr. Smith",
      //             instructions: "Take with food in the morning",
      //           },
      //           {
      //             medicationName: "Metformin",
      //             dosage: "500mg",
      //             frequency: "Twice daily",
      //             startDate: "2022-03-10T00:00:00Z",
      //             prescribedBy: "Dr. Johnson",
      //             instructions: "Take with meals",
      //           },
      //           {
      //             medicationName: "Albuterol Inhaler",
      //             dosage: "90mcg",
      //             frequency: "As needed",
      //             startDate: "2020-08-22T00:00:00Z",
      //             prescribedBy: "Dr. Brown",
      //             instructions: "Use for shortness of breath",
      //           },
      //         ],
      //         activeGoals: [
      //           {
      //             goalType: "Weight Loss",
      //             targetValue: 65,
      //             currentValue: 70,
      //             unit: "kg",
      //             targetDate: "2024-06-01T00:00:00Z",
      //             progress: 50,
      //             status: "On Track",
      //           },
      //           {
      //             goalType: "Blood Pressure Control",
      //             targetValue: 120,
      //             currentValue: 125,
      //             unit: "mmHg",
      //             targetDate: "2024-03-01T00:00:00Z",
      //             progress: 80,
      //             status: "On Track",
      //           },
      //           {
      //             goalType: "Daily Steps",
      //             targetValue: 10000,
      //             currentValue: 7500,
      //             unit: "steps",
      //             targetDate: "2024-12-31T00:00:00Z",
      //             progress: 75,
      //             status: "Behind",
      //           },
      //         ],
      //         recentDoctorNotes: [
      //           {
      //             noteDate: "2024-01-10T00:00:00Z",
      //             doctorName: "Dr. Smith",
      //             noteType: "Follow-up Visit",
      //             content:
      //               "Patient showing good progress with blood pressure management. Continue current medication regimen.",
      //             followUpRequired: false,
      //           },
      //           {
      //             noteDate: "2024-01-05T00:00:00Z",
      //             doctorName: "Dr. Johnson",
      //             noteType: "Routine Check",
      //             content:
      //               "Diabetes management is stable. HbA1c levels within target range. Recommend continuing current diet and exercise plan.",
      //             followUpRequired: true,
      //           },
      //         ],
      //         healthSummary: {
      //           overallStatus: "Good",
      //           riskFactors: ["Hypertension", "Diabetes"],
      //           recommendations: [
      //             "Regular exercise",
      //             "Low sodium diet",
      //             "Monitor blood sugar",
      //           ],
      //         },
      //       },
      //       healthOverview: {
      //         overallHealthStatus: "Good",
      //         healthScore: 78,
      //         lastUpdated: "2024-01-15T10:30:00Z",
      //       },
      //       emergencyContacts: [
      //         {
      //           name: "Jane Doe",
      //           relationship: "Spouse",
      //           phoneNumber: "+1-555-0123",
      //           email: "jane.doe@email.com",
      //           address: "123 Main St, City, State 12345",
      //           isPrimary: true,
      //         },
      //         {
      //           name: "John Smith",
      //           relationship: "Brother",
      //           phoneNumber: "+1-555-0456",
      //           email: "john.smith@email.com",
      //           address: "456 Oak Ave, City, State 12345",
      //           isPrimary: false,
      //         },
      //       ],
      //       recentVitals: [],
      //       allergies: [],
      //       medications: [],
      //       healthGoals: [],
      //       doctorNotes: [],
      //     },
      //     timestamp: "2024-01-15T10:30:00Z",
      //   });
    } catch (err: any) {
      console.error("Failed to load mock data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error && !data)
    return <ErrorState error={error} onRetry={fetchPatientData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-sky-300/20 to-blue-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/3 right-20 w-48 h-48 bg-gradient-to-r from-indigo-300/20 to-purple-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-300/20 to-teal-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            Your Health Dashboard
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto rounded-full"
          />
        </motion.div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabContent activeTab={activeTab} data={data} />
          </motion.div>
        </AnimatePresence>
      </div>

      <Modal
        isOpen={selectedModal === "conditions"}
        onClose={() => setSelectedModal(null)}
        title="All Medical Conditions"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data.dashboard?.activeMedicalConditions?.map(
            (condition, index) => (
              <MedicalConditionCard key={index} condition={condition} />
            )
          )}
        </div>
      </Modal>

      <Modal
        isOpen={selectedModal === "medications"}
        onClose={() => setSelectedModal(null)}
        title="All Medications"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data.dashboard?.activeMedications?.map((medication, index) => (
            <MedicationCard key={index} medication={medication} />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedModal === "goals"}
        onClose={() => setSelectedModal(null)}
        title="All Health Goals"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data.dashboard?.activeGoals?.map((goal, index) => (
            <GoalCard key={index} goal={goal} />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedModal === "allergies"}
        onClose={() => setSelectedModal(null)}
        title="All Allergies"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.dashboard?.criticalAllergies?.map((allergy, index) => (
            <AllergyCard key={index} allergy={allergy} />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedModal === "contacts"}
        onClose={() => setSelectedModal(null)}
        title="All Emergency Contacts"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data.emergencyContacts?.map((contact, index) => (
            <EmergencyContactCard key={index} contact={contact} />
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={selectedModal === "notes"}
        onClose={() => setSelectedModal(null)}
        title="All Doctor Notes"
      >
        <div className="grid grid-cols-1 gap-6">
          {data?.data.dashboard?.recentDoctorNotes?.map((note, index) => (
            <DoctorNoteCard key={index} note={note} />
          ))}
        </div>
      </Modal>
    </div>
  );
}

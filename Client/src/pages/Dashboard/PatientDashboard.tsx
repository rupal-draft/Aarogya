import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Activity,
  Pill,
  Target,
  FileText,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
  RefreshCw,
  BarChart3,
} from "lucide-react";

import type { PatientProfile } from "../../types/patient";
import { HealthOverviewCard } from "../../components/Dashboard/Patient/HealthOverviewCard";
import { VitalsCard } from "../../components/Dashboard/Patient/VitalsCard";
import { MedicalConditionsCard } from "../../components/Dashboard/Patient/MedicalConditionsCard";
import { HealthGoalsCard } from "../../components/Dashboard/Patient/HealthGoalsCard";
import { MedicationsCard } from "../../components/Dashboard/Patient/MedicationsCard";
import { DoctorNotesCard } from "../../components/Dashboard/Patient/DoctorNotesCard";
import { AllergiesCard } from "../../components/Dashboard/Patient/AllergiesCard";
import { LoadingSpinner } from "../../common/Spinners/LoadingSpinner2";
import { DashboardService } from "../../Services/dashboard";
import { StatsCard } from "../../components/Lab/StatsCard";
import { DiseaseHistoryCard } from "../../components/Dashboard/Patient/DiseaseHistoryCard";
import { EmergencyContactsCard } from "../../components/Dashboard/Patient/EmergencyContactsCard";
import { SymptomsCard } from "../../components/Dashboard/Patient/SymptomsCard";
import { VitalsStatsCard } from "../../components/Dashboard/Patient/VitalsStatsCard";
import { AnalyticsCard } from "../../components/Dashboard/Patient/AnalyticsCard";
import { StatisticsCard } from "../../components/Dashboard/Patient/StatisticsCard";

export const PatientDashboard: React.FC = () => {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "details" | "history" | "analytics"
  >("overview");
  const dashboardService = new DashboardService();

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getPatientDashboard();
      setProfile(response);
    } catch (err) {
      setError("Failed to load patient profile");
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);
  console.log(profile);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <LoadingSpinner text="Loading patient dashboard..." size={48} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadProfile}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Health Score",
      value: profile.healthOverview.healthScore,
      icon: Heart,
      color: "from-red-500 to-red-600",
      suffix: "/10",
    },
    {
      title: "Active Conditions",
      value: profile.healthOverview.activeConditions,
      icon: Activity,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Active Medications",
      value: profile.healthOverview.activeMedications,
      icon: Pill,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Critical Allergies",
      value: profile.healthOverview.criticalAllergies,
      icon: Shield,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Active Goals",
      value: profile.goalStats.activeGoals,
      icon: Target,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Adherence Rate",
      value: profile.healthOverview.medicationSummary.adherenceRate,
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600",
      suffix: "%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <User className="text-white" size={28} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Patient Dashboard
                </h1>
                <p className="text-gray-600">
                  Overall Status: {profile.healthOverview.overallHealthStatus} •
                  Last Updated:{" "}
                  {new Date(
                    profile.statistics.lastUpdated
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadProfile}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw size={18} />
              Refresh
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              index={index}
              suffix={stat.suffix}
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8"
        >
          <div className="flex gap-2">
            {[
              { key: "overview", label: "Health Overview", icon: Heart },
              { key: "details", label: "Medical Details", icon: FileText },
              { key: "history", label: "Medical History", icon: Calendar },
              { key: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <HealthOverviewCard
                  healthOverview={profile.healthOverview}
                  index={0}
                />
                <VitalsCard vitals={profile.vitalsStats} index={1} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MedicalConditionsCard
                  conditions={profile.dashboard.activeMedicalConditions}
                  index={2}
                  maxItems={4}
                />
                <AllergiesCard
                  allergies={profile.dashboard.criticalAllergies}
                  index={3}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MedicationsCard
                  medications={profile.dashboard.activeMedications}
                  index={0}
                />
                <HealthGoalsCard
                  goals={profile.dashboard.activeGoals}
                  index={1}
                />
              </div>

              <DoctorNotesCard
                notes={profile.dashboard.recentDoctorNotes}
                index={2}
              />
            </motion.div>
          )}

          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DiseaseHistoryCard
                  diseases={profile.diseaseHistory}
                  index={0}
                />
                <EmergencyContactsCard
                  contacts={profile.emergencyContacts}
                  index={1}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SymptomsCard
                  symptoms={profile.symptomStatsResponse.recentSymptoms}
                  index={2}
                />
                <VitalsStatsCard vitalsStats={profile.vitalsStats} index={3} />
              </div>
            </motion.div>
          )}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <AnalyticsCard analytics={profile.analytics} index={0} />

              <StatisticsCard statistics={profile.statistics} index={1} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

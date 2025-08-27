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
import { AnimatedCounter } from "../../pages/Dashboard/TestDashboard";

type DashboardOverviewProps = {
  data: PatientDashboardData;
};

const DashboardOverview: FC<DashboardOverviewProps> = ({data}) => {
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
          >
            {/* Health Score */}
            <GlassCard
              className="p-6 text-center group 
    backdrop-blur-xl bg-white/20 border border-white/30 
    shadow-lg rounded-2xl hover:bg-white/30 transition-colors duration-300"
            >
              <motion.div
                className="p-5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl 
                 w-fit mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-sky-900 mb-2 tracking-wide">
                Health Scores
              </h3>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                <AnimatedCounter
                  value={data.data.healthOverview?.healthScore || 0}
                />
              </div>
            </GlassCard>

            {/* Overall Status */}
            <GlassCard className="p-6 text-center group backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-2xl">
              <motion.div
                className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl w-fit mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-sky-900 mb-2 tracking-wide">
                Overall Status
              </h3>
              <div className="text-xl font-bold text-emerald-600">
                {data.data.healthOverview?.overallHealthStatus || "Good"}
              </div>
            </GlassCard>

            {/* Active Meds */}
            <GlassCard className="p-6 text-center group backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-2xl">
              <motion.div
                className="p-5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl w-fit mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Pill className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-sky-900 mb-2 tracking-wide">
                Active Meds
              </h3>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                <AnimatedCounter
                  value={data.data.dashboard?.activeMedications?.length || 0}
                />
              </div>
            </GlassCard>

            {/* Active Goals */}
            <GlassCard className="p-6 text-center group backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-2xl">
              <motion.div
                className="p-5 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl w-fit mx-auto mb-5 shadow-lg group-hover:shadow-xl transition-all duration-300"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-sky-900 mb-2 tracking-wide">
                Active Goals
              </h3>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent">
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
                    value={data.data.dashboard.latestVitals.temperature}
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
                    .slice(0, 2)
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
                    .slice(0, 4)
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
};

export default DashboardOverview;

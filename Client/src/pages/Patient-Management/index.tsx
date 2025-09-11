import { motion } from "framer-motion";
import {
  Loader2,
  AlertCircle,
  HeartPulse,
  Shield,
  Activity,
  Calendar,
} from "lucide-react";
import { usePatientData } from "../../hooks/Patient-Management/usePatientData";
import { PatientHeader } from "../../components/Patient-Management/PatientHeader";
import { VitalsCard } from "../../components/Patient-Management/VitalsCard";
import { DoctorNotesCard } from "../../components/Patient-Management/DoctorNotesCard";
import { HealthGoalsCard } from "../../components/Patient-Management/HealthGoalsCard";
import { MedicalHistoryCard } from "../../components/Patient-Management/MedicalHistoryCard";
import { EmergencyContactCard } from "../../components/Patient-Management/EmergencyContactCard";
import { AllergiesCard } from "../../components/Patient-Management/AllergyCard";
import { MedicationsCard } from "../../components/Patient-Management/MedicationsCard";
import { SymptomsTimelineCard } from "../../components/Patient-Management/SymptomsTimelineCard";
import { useParams } from "react-router-dom";

function PatientManagement() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = usePatientData(id || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-500" />
          </motion.div>
          <p className="text-lg text-gray-600">Loading patient data...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center border border-red-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to Load Patient Data
          </h2>
          <p className="text-gray-600 mb-4">
            {error ||
              "Something went wrong while fetching patient information."}
          </p>
          <p className="text-sm text-gray-500">
            Please ensure the API server is running on localhost:8080
          </p>
        </motion.div>
      </div>
    );
  }

  const {
    patient,
    latestVitals,
    activeMedications,
    recentDoctorNotes,
    healthGoals,
    allergies,
    primaryEmergencyContact,
    recentSymptoms,
    medicalHistory,
  } = data.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <motion.div
        className="mx-auto w-[1600px] px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-8">
          <PatientHeader patient={patient} />
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HeartPulse className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Patient Status</p>
              <p className="font-semibold text-gray-800">Active</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Checkup</p>
              <p className="font-semibold text-gray-800">2 weeks ago</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Appointment</p>
              <p className="font-semibold text-gray-800">In 1 week</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Clinical Information */}
          <div className="lg:col-span-8 space-y-6">
            {/* Vitals - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VitalsCard vitals={latestVitals} />
            </motion.div>

            {/* Two-column section for Notes and Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Doctor Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DoctorNotesCard notes={recentDoctorNotes} />
              </motion.div>

              {/* Health Goals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <HealthGoalsCard goals={healthGoals} />
              </motion.div>
            </div>

            {/* Medical History - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <MedicalHistoryCard history={medicalHistory} />
            </motion.div>
          </div>

          {/* Right Column - Patient Information */}
          <div className="lg:col-span-4 space-y-6">
            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EmergencyContactCard contact={primaryEmergencyContact} />
            </motion.div>

            {/* Allergies & Medications in a grid */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <AllergiesCard allergies={allergies} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MedicationsCard medications={activeMedications} />
              </motion.div>
            </div>

            {/* Recent Symptoms */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <SymptomsTimelineCard symptoms={recentSymptoms} />
            </motion.div>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <motion.div
          className="mt-12 mb-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Last updated</p>
                <p className="font-medium text-gray-800">
                  {new Date(data.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Online</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Data Synced</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Records Complete</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                Print Summary
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PatientManagement;

// components/Patient-Management/PatientManagement.tsx
import { useState } from "react";
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
import { MedicationsCard } from "../../components/Patient-Management/MedicationsCard";
import { SymptomsTimelineCard } from "../../components/Patient-Management/SymptomsTimelineCard";
import { DiseasesCard } from "../../components/Patient-Management/DiseasesCard";
import { useParams } from "react-router-dom";
import { AllergiesCard } from "../../components/Patient-Management/AllergyCard";
import { ViewAllModal } from "../../common/Modals/ViewAllModal";
import { StatisticsCard } from "../../components/Patient-Management/StatisticsCard";

function PatientManagement() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = usePatientData(id || "");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);

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
    activeMedications = [],
    recentDoctorNotes = [],
    diseases = [],
    allergies = [],
    healthGoals = [],
    primaryEmergencyContact,
    recentSymptoms = [],
    medicalHistory = [],
  } = data.data;

  // Safe data with fallbacks
  const safeMedications = activeMedications || [];
  const safeDoctorNotes = recentDoctorNotes || [];
  const safeHealthGoals = healthGoals || [];
  const safeAllergies = allergies || [];
  const safeSymptoms = recentSymptoms || [];
  const safeMedicalHistory = medicalHistory || [];
  const safeDiseases = diseases || [];
  const safeVitals = latestVitals || {
    recordedAt: "",
    bloodPressureSystolic: 0,
    bloodPressureDiastolic: 0,
    heartRate: 0,
    temperature: 0,
    respiratoryRate: 0,
    oxygenSaturation: 0,
    weight: 0,
    height: 0,
    bmi: 0,
    recordedBy: "N/A",
    recordedByType: "N/A",
    notes: "No vitals recorded",
  };

  // Get first 3 items for preview
  const previewMedications = safeMedications.slice(0, 2);
  const previewDoctorNotes = safeDoctorNotes.slice(0, 4);
  const previewHealthGoals = safeHealthGoals.slice(0, 2);
  const previewAllergies = safeAllergies.slice(0, 3);
  const previewSymptoms = safeSymptoms.slice(0, 3);
  const previewMedicalHistory = safeMedicalHistory.slice(0, 3);
  const previewDiseases = safeDiseases.slice(0, 3);

  const statisticsData = {
    totalMedications: safeMedications.length,
    totalAllergies: safeAllergies.length,
    totalSymptoms: safeSymptoms.length,
    totalGoals: safeHealthGoals.length,
    totalNotes: safeDoctorNotes.length,
    totalConditions: safeMedicalHistory.length + safeDiseases.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <motion.div
        className="mx-auto max-w-[1800px] px-4 py-6"
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

        {/* Main Content Grid - Improved Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Clinical Information (8 columns) */}
          <div className="xl:col-span-8 space-y-6">
            {/* Vitals - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VitalsCard vitals={safeVitals} />
            </motion.div>

            {/* Two-column section for Medications and Symptoms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medications - Moved to left side */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <MedicationsCard
                  medications={previewMedications}
                  onViewAll={() => openModal("medications")}
                  totalCount={safeMedications.length}
                />
              </motion.div>

              {/* Symptoms - Moved to left side */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <SymptomsTimelineCard
                  symptoms={previewSymptoms}
                  onViewAll={() => openModal("symptoms")}
                  totalCount={safeSymptoms.length}
                />
              </motion.div>
            </div>

            {/* Two-column section for Notes and Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Doctor Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <DoctorNotesCard
                  notes={previewDoctorNotes}
                  onViewAll={() => openModal("doctorNotes")}
                  totalCount={safeDoctorNotes.length}
                />
              </motion.div>

              {/* Health Goals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <HealthGoalsCard
                  goals={previewHealthGoals}
                  onViewAll={() => openModal("healthGoals")}
                  totalCount={safeHealthGoals.length}
                />
              </motion.div>
            </div>

            {/* Medical History & Diseases - Full Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Medical History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <MedicalHistoryCard
                  history={previewMedicalHistory}
                  onViewAll={() => openModal("medicalHistory")}
                  totalCount={safeMedicalHistory.length}
                />
              </motion.div>

              {/* Diseases History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <DiseasesCard
                  diseases={previewDiseases}
                  onViewAll={() => openModal("diseases")}
                  totalCount={safeDiseases.length}
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column - Patient Information (4 columns) */}
          <div className="xl:col-span-4 space-y-6">
            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EmergencyContactCard contact={primaryEmergencyContact} />
            </motion.div>

            {/* Allergies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AllergiesCard
                allergies={previewAllergies}
                onViewAll={() => openModal("allergies")}
                totalCount={safeAllergies.length}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <StatisticsCard data={statisticsData} />
            </motion.div>
          </div>
        </div>

        {/* Modals - Same as before */}
        <ViewAllModal
          isOpen={activeModal === "doctorNotes"}
          onClose={closeModal}
          title="Doctor Notes"
          data={safeDoctorNotes}
          renderItem={(note, index) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {note.title || "Untitled Note"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {note.content || "No content available"}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    note.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : note.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {note.priority || "low"} priority
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>By: {note.doctorName || "Unknown Doctor"}</span>
                <span>
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>
            </div>
          )}
        />

        <ViewAllModal
          isOpen={activeModal === "healthGoals"}
          onClose={closeModal}
          title="Health Goals"
          data={safeHealthGoals}
          renderItem={(goal, index) => {
            const progress = Math.min(
              (goal.currentValue / goal.targetValue) * 100,
              100
            );
            return (
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {goal.title || "Untitled Goal"}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {goal.description || "No description available"}
                </p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>
                      Progress: {goal.currentValue || 0} /{" "}
                      {goal.targetValue || 0} {goal.unit || ""}
                    </span>
                    <span className="font-semibold">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Target:{" "}
                    {goal.targetDate
                      ? new Date(goal.targetDate).toLocaleDateString()
                      : "No target date"}
                  </span>
                  <span
                    className={
                      goal.priority === "high"
                        ? "text-red-600 font-medium"
                        : "text-gray-600"
                    }
                  >
                    {goal.priority || "low"} priority
                  </span>
                </div>
              </div>
            );
          }}
        />

        <ViewAllModal
          isOpen={activeModal === "medicalHistory"}
          onClose={closeModal}
          title="Medical History"
          data={safeMedicalHistory}
          renderItem={(history, index) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {history.conditionName || "Unknown Condition"}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {history.notes || "No notes available"}
              </p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Category: {history.category || "Uncategorized"}</span>
                <span>Status: {history.status || "Unknown"}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>
                  Diagnosed:{" "}
                  {history.diagnosisDate
                    ? new Date(history.diagnosisDate).toLocaleDateString()
                    : "Unknown date"}
                </span>
                <span>Severity: {history.severity || "Unknown"}</span>
              </div>
            </div>
          )}
        />

        <ViewAllModal
          isOpen={activeModal === "diseases"}
          onClose={closeModal}
          title="Diseases"
          data={safeDiseases}
          renderItem={(disease, index) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {disease.diseaseName || "Unknown Disease"}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Code:</span>{" "}
                  {disease.diseaseCode || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {disease.status || "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Severity:</span>{" "}
                  {disease.severity || "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {disease.isChronic ? "Chronic" : "Acute"}
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Diagnosed:{" "}
                  {disease.diagnosisDate
                    ? new Date(disease.diagnosisDate).toLocaleDateString()
                    : "Unknown date"}
                </span>
                {disease.recoveryDate && (
                  <span>
                    Recovered:{" "}
                    {new Date(disease.recoveryDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        />

        <ViewAllModal
          isOpen={activeModal === "allergies"}
          onClose={closeModal}
          title="Allergies"
          data={safeAllergies}
          renderItem={(allergy, index) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {allergy.allergen || "Unknown Allergen"}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Type:</span>{" "}
                  {allergy.allergyType || "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Severity:</span>{" "}
                  {allergy.severity || "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Reaction:</span>{" "}
                  {allergy.reaction || "No reaction details"}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {allergy.isActive ? "Active" : "Inactive"}
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg mb-3">
                <p className="text-sm text-red-800 font-medium">
                  Emergency Action:{" "}
                  {allergy.emergencyAction || "No emergency action specified"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Diagnosed:{" "}
                {allergy.diagnosedDate
                  ? new Date(allergy.diagnosedDate).toLocaleDateString()
                  : "Unknown date"}
              </div>
            </div>
          )}
        />

        <ViewAllModal
          isOpen={activeModal === "medications"}
          onClose={closeModal}
          title="Medications"
          data={safeMedications}
          renderItem={(medication, index) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {medication.medicationName || "Unknown Medication"}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Dosage:</span>{" "}
                  {medication.dosage || "N/A"} {medication.dosageUnit || ""}
                </div>
                <div>
                  <span className="font-medium">Frequency:</span>{" "}
                  {medication.frequency || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Route:</span>{" "}
                  {medication.route || "N/A"}
                </div>
                <div>
                  <span className="font-medium">Status:</span>{" "}
                  {medication.status || "Unknown"}
                </div>
              </div>
              {medication.instructions && (
                <div className="bg-blue-50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Instructions:</span>{" "}
                    {medication.instructions}
                  </p>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Prescribed by: {medication.prescribedBy || "Unknown"}
                </span>
                <span>
                  Started:{" "}
                  {medication.startDate
                    ? new Date(medication.startDate).toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>
            </div>
          )}
        />

        <ViewAllModal
          isOpen={activeModal === "symptoms"}
          onClose={closeModal}
          title="Symptoms"
          data={safeSymptoms}
          renderItem={(symptom, index) => (
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {symptom.symptomName || "Unknown Symptom"}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {symptom.description || "No description available"}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span className="font-medium">Severity:</span>{" "}
                  {symptom.severity || 0}/10
                </div>
                <div>
                  <span className="font-medium">Duration:</span>{" "}
                  {symptom.duration || "Unknown"}
                </div>
                <div>
                  <span className="font-medium">Frequency:</span>{" "}
                  {symptom.frequency || "Unknown"}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Recorded:{" "}
                {symptom.recordedAt
                  ? new Date(symptom.recordedAt).toLocaleDateString()
                  : "Unknown date"}
              </div>
            </div>
          )}
        />

        {/* Quick Actions Footer */}
        <motion.div
          className="mt-12 mb-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
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

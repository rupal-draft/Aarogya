import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  FileText,
  Heart,
  Home,
  Pill,
  Settings,
  Stethoscope,
  Target,
  Thermometer,
  TrendingUp,
  User,
  Users,
  Brain,
  Bell,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Star,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
  Plus,
  Calendar,
  CheckCircle,
} from "lucide-react";

import type {
  CompletePatientProfileResponse,
  DiseaseHistoryResponse,
  DoctorNoteResponse,
  EmergencyContactResponse,
  HealthGoalResponse,
  MedicalHistoryResponse,
  PatientAllergyResponse,
  PatientMedicationResponse,
  PatientVitalsResponse,
  SymptomTrackerResponse,
} from "../../types/dashboard";
import {
  allergiesService,
  diseaseHistoryService,
  doctorNotesService,
  emergencyContactsService,
  healthGoalsService,
  medicalHistoryService,
  medicationsService,
  patientProfileService,
  symptomsService,
  vitalsService,
} from "../../Services/Dashboard/Patient";

const GlassCard = ({
  children,
  className = "",
  delay = 0,
  onClick,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className={`glass-card rounded-xl p-6 ${
      hover ? "hover:scale-105 hover:shadow-2xl" : ""
    } transition-all duration-300 cursor-pointer ${className}`}
    onClick={onClick}
    whileHover={hover ? { scale: 1.02 } : {}}
    whileTap={hover ? { scale: 0.98 } : {}}
  >
    {children}
  </motion.div>
);

// Animated button component
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  className?: string;
}) => {
  const variants = {
    primary: "gradient-primary text-white",
    secondary: "bg-secondary text-secondary-foreground",
    success: "gradient-success text-white",
    danger: "gradient-danger text-white",
    warning: "gradient-warning text-white",
    accent: "gradient-accent text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      className={`flex items-center gap-2 rounded-lg font-medium transition-all duration-300 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      <span>{label}</span>
    </motion.button>
  );
};

// Stats card component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  delay = 0,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  delay?: number;
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  return (
    <GlassCard delay={delay} className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {getTrendIcon()}
              <span
                className={`text-sm ${
                  trend === "up"
                    ? "text-green-500"
                    : trend === "down"
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-primary/10`}>
          <Icon className={`h-6 w-6 text-primary`} />
        </div>
      </div>
    </GlassCard>
  );
};

// Tab navigation component
const TabNavigation = ({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) => (
  <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-thin">
    <div className="flex gap-2 min-w-max">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
            activeTab === tab.id
              ? "gradient-primary text-white shadow-lg"
              : "bg-card text-card-foreground hover:bg-muted"
          }`}
          onClick={() => onTabChange(tab.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <tab.icon className="h-4 w-4" />
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? "bg-white/20"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {tab.count}
            </span>
          )}
        </motion.button>
      ))}
    </div>
  </div>
);

// Disease history item component
const DiseaseHistoryItem = ({
  disease,
}: {
  disease: DiseaseHistoryResponse;
}) => (
  <GlassCard
    className={`hover:shadow-lg ${
      disease.isCritical ? "border-l-4 border-red-500" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-foreground">{disease.diseaseName}</h3>
        {disease.diseaseCode && (
          <p className="text-xs text-muted-foreground">
            Code: {disease.diseaseCode}
          </p>
        )}
        {disease.description && (
          <p className="text-sm text-muted-foreground">{disease.description}</p>
        )}
      </div>
      <div className="flex gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            disease.severityBadgeColor || "bg-yellow-100 text-yellow-700"
          }`}
        >
          {disease.severity}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            disease.statusBadgeColor || "bg-blue-100 text-blue-700"
          }`}
        >
          {disease.status}
        </span>
        {disease.isChronic && (
          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
            Chronic
          </span>
        )}
      </div>
    </div>

    <div className="space-y-1 text-sm text-muted-foreground">
      <p>
        <strong>Diagnosed:</strong> {disease.formattedDiagnosisDate}
      </p>
      <p>
        <strong>Diagnosed by:</strong> {disease.diagnosedBy}
      </p>
      <p>
        <strong>Days since diagnosis:</strong> {disease.daysSinceDiagnosis}
      </p>
      {disease.treatment && (
        <p>
          <strong>Treatment:</strong> {disease.treatment}
        </p>
      )}
      {disease.notes && (
        <p>
          <strong>Notes:</strong> {disease.notes}
        </p>
      )}
      {disease.isActive && <p className="text-green-600">Currently Active</p>}
      {disease.isCritical && (
        <p className="text-red-600">⚠️ Critical Condition</p>
      )}
    </div>
  </GlassCard>
);

// Allergy item component
const AllergyItem = ({ allergy }: { allergy: PatientAllergyResponse }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/70 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-foreground">{allergy.allergen}</h3>
        <p className="text-sm text-muted-foreground">{allergy.allergyType}</p>
      </div>
      <div
        className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
          allergy.severity === "SEVERE"
            ? "bg-red-500/10 text-red-600"
            : allergy.severity === "MODERATE"
            ? "bg-yellow-500/10 text-yellow-600"
            : "bg-green-500/10 text-green-600"
        }`}
      >
        {allergy.severity === "SEVERE" && <AlertCircle className="w-3 h-3" />}
        {allergy.severity}
      </div>
    </div>

    {allergy.symptoms && allergy.symptoms.length > 0 && (
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground mb-2">Symptoms:</p>
        <div className="flex flex-wrap gap-1">
          {allergy.symptoms.map((symptom, index) => (
            <span
              key={index}
              className="bg-muted/50 text-muted-foreground px-2 py-1 rounded text-xs"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>
    )}

    {allergy.emergencyAction && (
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground">Emergency Action:</p>
        <p className="text-sm text-muted-foreground">
          {allergy.emergencyAction}
        </p>
      </div>
    )}

    {allergy.notes && (
      <div className="mb-3">
        <p className="text-sm font-medium text-foreground">Notes:</p>
        <p className="text-sm text-muted-foreground">{allergy.notes}</p>
      </div>
    )}

    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
      <span className="text-xs text-muted-foreground">
        Diagnosed: {new Date(allergy.diagnosedDate).toLocaleDateString()}
      </span>
      {allergy.createdAt && (
        <span className="text-xs text-muted-foreground">
          Last Reaction: {new Date(allergy.createdAt).toLocaleDateString()}
        </span>
      )}
    </div>
  </motion.div>
);

// Medication item component
const MedicationItem = ({
  medication,
}: {
  medication: PatientMedicationResponse;
}) => (
  <GlassCard className="hover:shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <Pill className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-foreground">
          {medication.medicationName}
        </h3>
      </div>
      <span
        className={`px-2 py-1 rounded-full text-xs bg-green-100 text-green-700`}
      >
        {medication.status}
      </span>
    </div>
    <div className="space-y-1 text-sm text-muted-foreground">
      <p>
        <strong>Dosage:</strong> {medication.dosage}
      </p>
      <p>
        <strong>Frequency:</strong> {medication.frequency}
      </p>
      <p>
        <strong>Route:</strong> {medication.route}
      </p>
      <p>
        <strong>Prescribed by:</strong> {medication.prescribedBy}
      </p>
      <p>
        <strong>Started:</strong> {medication.formattedStartDate}
      </p>
      {medication.endDate && (
        <p>
          <strong>Ends:</strong> {medication.formattedEndDate}
        </p>
      )}
    </div>
    {medication.reason && (
      <div className="mt-3 p-2 bg-muted/50 rounded-lg">
        <p className="text-sm">
          <strong>Reason:</strong> {medication.reason}
        </p>
      </div>
    )}
  </GlassCard>
);

// Vitals display component
const VitalsDisplay = ({ vitals }: { vitals: PatientVitalsResponse }) => (
  <GlassCard
    className={`hover:shadow-lg ${
      vitals.isAbnormal ? "border-l-4 border-yellow-500" : ""
    }`}
  >
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Blood Pressure</p>
        <p className="font-semibold">{vitals.bloodPressureDisplay}</p>
        <p className="text-xs text-muted-foreground">
          {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
        </p>
      </div>
      <div className="text-center">
        <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Heart Rate</p>
        <p className="font-semibold">{vitals.heartRate} bpm</p>
      </div>
      <div className="text-center">
        <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Temperature</p>
        <p className="font-semibold">{vitals.temperatureDisplay}</p>
      </div>
      <div className="text-center">
        <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">BMI</p>
        <p className="font-semibold">{vitals.bmiDisplay}</p>
        <p className="text-xs text-muted-foreground">{vitals.bmiCategory}</p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
      <div>
        <p>
          <strong>Weight:</strong> {vitals.weightDisplay}
        </p>
        <p>
          <strong>Height:</strong> {vitals.heightDisplay}
        </p>
      </div>
      <div>
        <p>
          <strong>Health Status:</strong> {vitals.healthStatus}
        </p>
        <p>
          <strong>Recorded by:</strong> {vitals.recordedByType}
        </p>
      </div>
    </div>

    {vitals.isAbnormal && (
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700">⚠️ Abnormal readings detected</p>
      </div>
    )}

    {vitals.notes && (
      <div className="mt-4 p-2 bg-muted/50 rounded-lg">
        <p className="text-sm">
          <strong>Notes:</strong> {vitals.notes}
        </p>
      </div>
    )}
  </GlassCard>
);

// Health goal item component
const HealthGoalItem = ({ goal }: { goal: HealthGoalResponse }) => (
  <GlassCard className="hover:shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-foreground">{goal.title}</h3>
        <p className="text-sm text-muted-foreground">{goal.description}</p>
      </div>
      <div className="flex gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700`}
        >
          {goal.priority}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700`}
        >
          {goal.status}
        </span>
      </div>
    </div>

    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span>Progress</span>
        <span>{goal.progressPercentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="gradient-primary h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${goal.progressPercentage}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>

    <div className="flex justify-between text-sm text-muted-foreground">
      <span>
        Current: {goal.currentValue} {goal.unit}
      </span>
      <span>
        Target: {goal.targetValue} {goal.unit}
      </span>
    </div>

    <div className="mt-2 text-xs text-muted-foreground">
      <span>Target Date: {goal.formattedTargetDate}</span>
      {goal.daysRemaining > 0 && (
        <span className="ml-2">({goal.daysRemaining} days remaining)</span>
      )}
      {goal.isOverdue && <span className="ml-2 text-red-500">(Overdue)</span>}
    </div>
  </GlassCard>
);

// Emergency contact item component
const EmergencyContactItem = ({
  contact,
}: {
  contact: EmergencyContactResponse;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/70 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{contact.fullName}</h3>
          <p className="text-sm text-muted-foreground">
            {contact.relationship}
          </p>
        </div>
      </div>
      {contact.isPrimary && (
        <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full text-xs">
          <Star className="w-3 h-3" />
          Primary
        </div>
      )}
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <Phone className="w-4 h-4 text-muted-foreground" />
        <span>{contact.primaryPhone}</span>
      </div>
      {contact.email && (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span>{contact.email}</span>
        </div>
      )}
      {contact.address && (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span>{contact.address}</span>
        </div>
      )}
      {contact.notes && (
        <div className="flex items-start gap-2 text-sm">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <span className="text-muted-foreground">{contact.notes}</span>
        </div>
      )}
    </div>

    <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
      <span className="text-xs text-muted-foreground">
        Added: {new Date(contact.createdAt).toLocaleDateString()}
      </span>
      {contact.updatedAt && (
        <span className="text-xs text-muted-foreground">
          Updated: {new Date(contact.updatedAt).toLocaleDateString()}
        </span>
      )}
    </div>
  </motion.div>
);

// Doctor note item component
const DoctorNoteItem = ({ note }: { note: DoctorNoteResponse }) => (
  <GlassCard
    className={`hover:shadow-lg ${
      note.isUrgent ? "border-l-4 border-red-500" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-foreground">{note.title}</h3>
        <p className="text-sm text-muted-foreground">Dr. {note.doctorName}</p>
      </div>
      <div className="flex gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            note.categoryBadgeColor || "bg-blue-100 text-blue-700"
          }`}
        >
          {note.category}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            note.noteTypeBadgeColor || "bg-purple-100 text-purple-700"
          }`}
        >
          {note.noteType}
        </span>
        {note.isUrgent && (
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
            Urgent
          </span>
        )}
        {note.isPrivate && (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            Private
          </span>
        )}
      </div>
    </div>

    <div className="mb-3">
      <p className="text-sm text-foreground">{note.content}</p>
    </div>

    <div className="flex justify-between text-xs text-muted-foreground">
      <span>Priority: {note.priority}</span>
      <span>{note.timeAgo}</span>
      {note.isRecent && <span className="text-green-600">Recent</span>}
    </div>
  </GlassCard>
);

// Symptom tracker item component
const SymptomItem = ({ symptom }: { symptom: SymptomTrackerResponse }) => (
  <GlassCard className="hover:shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-foreground">{symptom.symptomName}</h3>
        <p className="text-sm text-muted-foreground">{symptom.description}</p>
      </div>
      <div className="flex gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs bg-red-100 text-red-700`}
        >
          Severity: {symptom.severityLevel}/10
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700`}
        >
          {symptom.category}
        </span>
      </div>
    </div>

    {symptom.triggers && symptom.triggers.length > 0 && (
      <div className="mb-2">
        <p className="text-sm text-muted-foreground">
          <strong>Triggers:</strong> {symptom.triggers.join(", ")}
        </p>
      </div>
    )}

    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Duration: {symptom.duration}</span>
      <span>Frequency: {symptom.frequency}</span>
    </div>

    <div className="mt-2 text-xs text-muted-foreground">
      <span>Recorded: {symptom.timeAgo}</span>
    </div>
  </GlassCard>
);

// Medical history item component
const MedicalHistoryItem = ({
  history,
}: {
  history: MedicalHistoryResponse;
}) => (
  <GlassCard
    className={`hover:shadow-lg ${
      history.isCritical ? "border-l-4 border-red-500" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-foreground">
          {history.conditionName}
        </h3>
        {history.notes && (
          <p className="text-sm text-muted-foreground">{history.notes}</p>
        )}
      </div>
      <div className="flex gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            history.categoryBadgeColor || "bg-blue-100 text-blue-700"
          }`}
        >
          {history.category}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            history.severityBadgeColor || "bg-yellow-100 text-yellow-700"
          }`}
        >
          {history.severity}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            history.statusBadgeColor || "bg-green-100 text-green-700"
          }`}
        >
          {history.status}
        </span>
      </div>
    </div>

    <div className="space-y-1 text-sm text-muted-foreground">
      <p>
        <strong>Diagnosed:</strong> {history.formattedDiagnosisDate}
      </p>
      <p>
        <strong>Days since diagnosis:</strong> {history.daysSinceDiagnosis}
      </p>
      <p>
        <strong>Time ago:</strong> {history.timeAgo}
      </p>
      {history.isActive && (
        <p className="text-green-600">
          <strong>Status:</strong> Currently Active
        </p>
      )}
      {history.isCritical && (
        <p className="text-red-600">
          <strong>⚠️ Critical Condition</strong>
        </p>
      )}
    </div>
  </GlassCard>
);

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-8 w-full max-w-7xl mx-auto p-6">
    <div className="h-8 w-64 bg-muted rounded-full"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-64 bg-muted rounded-xl"></div>
      ))}
    </div>
  </div>
);

// Main dashboard component
export default function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [patientData, setPatientData] =
    useState<CompletePatientProfileResponse | null>(null);

  const [diseaseHistory, setDiseaseHistory] = useState<
    DiseaseHistoryResponse[]
  >([]);
  const [symptoms, setSymptoms] = useState<SymptomTrackerResponse[]>([]);
  const [vitals, setVitals] = useState<PatientVitalsResponse[]>([]);
  const [healthGoals, setHealthGoals] = useState<HealthGoalResponse[]>([]);
  const [doctorNotes, setDoctorNotes] = useState<DoctorNoteResponse[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContactResponse[]
  >([]);
  const [medicalHistory, setMedicalHistory] = useState<
    MedicalHistoryResponse[]
  >([]); // Now properly typed and will be used
  const [allergies, setAllergies] = useState<PatientAllergyResponse[]>([]);
  const [medications, setMedications] = useState<PatientMedicationResponse[]>(
    []
  );

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        profileData,
        diseaseData,
        symptomsData,
        vitalsData,
        goalsData,
        notesData,
        contactsData,
        historyData,
        allergiesData,
        medicationsData,
      ] = await Promise.all([
        patientProfileService.getCompletePatientProfile(),
        diseaseHistoryService.getDiseaseHistory(),
        symptomsService.getPatientSymptoms(),
        vitalsService.getPatientVitals(),
        healthGoalsService.getPatientHealthGoals(),
        doctorNotesService.getMyNotes(),
        emergencyContactsService.getPatientEmergencyContacts(),
        medicalHistoryService.getPatientMedicalHistory(), // Now properly fetching medical history
        allergiesService.getPatientAllergies(),
        medicationsService.getPatientMedications(),
      ]);

      setPatientData(profileData);
      setDiseaseHistory(Array.isArray(diseaseData) ? diseaseData : []);
      setSymptoms(Array.isArray(symptomsData) ? symptomsData : []);
      setVitals(Array.isArray(vitalsData) ? vitalsData : []);
      setHealthGoals(Array.isArray(goalsData) ? goalsData : []);
      setDoctorNotes(Array.isArray(notesData) ? notesData : []);
      setEmergencyContacts(Array.isArray(contactsData) ? contactsData : []);
      setMedicalHistory(
        Array.isArray(historyData.content)
          ? historyData.content
          : Array.isArray(historyData)
          ? historyData
          : []
      ); // Handle PageResponse structure
      setAllergies(Array.isArray(allergiesData) ? allergiesData : []);
      setMedications(Array.isArray(medicationsData) ? medicationsData : []);
    } catch (err) {
      console.error("[v0] Error fetching patient data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch patient data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingSkeleton /> {/* Now using the LoadingSkeleton component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GlassCard className="text-center max-w-md">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-muted-foreground mb-4 whitespace-pre-line">
            {error}
          </p>
          {error.includes("Configuration Error") && (
            <div className="text-sm text-muted-foreground mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium mb-2">To fix this:</p>
              <ol className="text-left space-y-1">
                <li>1. Click the ⚙️ gear icon in the top right</li>
                <li>2. Go to "Environment Variables"</li>
                <li>3. Add: NEXT_PUBLIC_API_BASE_URL</li>
                <li>
                  4. Set value to your Spring Boot API URL (e.g.,
                  http://localhost:8080/api)
                </li>
              </ol>
            </div>
          )}
          <ActionButton
            label="Retry"
            onClick={() => window.location.reload()}
            variant="primary"
          />
        </GlassCard>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <GlassCard className="text-center max-w-md">
          <Info className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No Data Available
          </h2>
          <p className="text-muted-foreground">
            No patient data found for this profile.
          </p>
        </GlassCard>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Active Diseases"
                value={
                  diseaseHistory.filter((d) => d.status === "Active").length
                }
                icon={Activity}
                trend="stable"
                delay={0.1}
              />
              <StatsCard
                title="Recent Symptoms"
                value={symptoms.length}
                icon={AlertTriangle}
                trend="down"
                trendValue="2 less than last week"
                delay={0.2}
              />
              <StatsCard
                title="Active Goals"
                value={healthGoals.filter((g) => g.status === "ACTIVE").length}
                icon={Target}
                trend="up"
                trendValue="1 new this month"
                delay={0.3}
              />
              <StatsCard
                title="Medications"
                value={medications.length}
                icon={Pill}
                trend="stable"
                delay={0.4}
              />
            </div>

            {medicalHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Recent Medical History
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicalHistory.slice(0, 2).map((history, index) => (
                    <MedicalHistoryItem
                      key={history.id || index}
                      history={history}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {vitals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  Latest Vitals
                </h3>
                <VitalsDisplay vitals={vitals[0]} />
              </motion.div>
            )}

            {healthGoals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-400" />
                  Active Health Goals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {healthGoals.slice(0, 4).map((goal, index) => (
                    <HealthGoalItem key={goal.id || index} goal={goal} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        );

      case "diseases":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Disease History
              </h2>
              <ActionButton
                onClick={async () => {
                  await diseaseHistoryService.getActiveDiseases();
                  await diseaseHistoryService.getChronicDiseases();
                }}
                label="Add Disease"
                variant="secondary"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diseaseHistory.map((disease, index) => (
                <DiseaseHistoryItem
                  key={disease.id || index}
                  disease={disease}
                />
              ))}
            </div>
          </div>
        );

      case "allergies":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Allergies</h2>
              <ActionButton
                onClick={async () => {
                  await allergiesService.getCriticalAllergies();
                }}
                label="Add Allergy"
                variant="danger"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allergies.map((allergy, index) => (
                <AllergyItem key={allergy.id || index} allergy={allergy} />
              ))}
            </div>
          </div>
        );

      case "medications":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Medications
              </h2>
              <ActionButton
                onClick={async () => {
                  await medicationsService.getActiveMedications();
                }}
                label="Add Medication"
                variant="primary"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medications.map((medication, index) => (
                <MedicationItem
                  key={medication.id || index}
                  medication={medication}
                />
              ))}
            </div>
          </div>
        );

      case "vitals":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Vital Signs
              </h2>
              <ActionButton
                onClick={async () => {
                  await vitalsService.getLatestVitals();
                  await vitalsService.getVitalsStats(30); // Get stats for last 30 days
                  const endDate = new Date().toISOString().split("T")[0];
                  const startDate = new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .split("T")[0];
                  await vitalsService.getVitalsTrends(startDate, endDate);
                }}
                label="Record Vitals"
                variant="primary"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vitals.map((vital, index) => (
                <VitalsDisplay key={vital.id || index} vitals={vital} />
              ))}
            </div>
          </div>
        );

      case "symptoms":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Symptoms Tracking
              </h2>
              <ActionButton
                onClick={async () => {
                  const sevenDaysAgo = new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                  ).toISOString();
                  await symptomsService.getRecentSymptoms(sevenDaysAgo);
                  await symptomsService.getSevereSymptoms();
                  await symptomsService.getSymptomStats();
                }}
                label="Record Symptom"
                variant="warning"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {symptoms.map((symptom, index) => (
                <SymptomItem key={symptom.id || index} symptom={symptom} />
              ))}
            </div>
          </div>
        );

      case "goals":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Health Goals
              </h2>
              <ActionButton
                onClick={async () => {
                  await healthGoalsService.getActiveGoals();
                  await healthGoalsService.getGoalsByPriority("HIGH");
                  await healthGoalsService.getOverdueGoals();
                  await healthGoalsService.getHealthGoalStats();
                }}
                label="Add Goal"
                variant="success"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {healthGoals.map((goal, index) => (
                <HealthGoalItem key={goal.id || index} goal={goal} />
              ))}
            </div>
          </div>
        );

      case "contacts":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Emergency Contacts
              </h2>
              <ActionButton
                onClick={async () => {
                  await emergencyContactsService.getPrimaryContact();
                  await emergencyContactsService.getPatientEmergencyContacts();
                }}
                label="Add Contact"
                variant="primary"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((contact, index) => (
                <EmergencyContactItem
                  key={contact.id || index}
                  contact={contact}
                />
              ))}
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Doctor Notes
              </h2>
              <ActionButton
                onClick={async () => {
                  await doctorNotesService.getMyNotes();
                  await doctorNotesService.getUrgentNotes();
                }}
                label="Add Note"
                variant="accent"
                icon={Plus}
              />
            </div>

            <div className="space-y-4">
              {doctorNotes.map((note, index) => (
                <DoctorNoteItem key={note.id || index} note={note} />
              ))}
            </div>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Health Analytics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Appointments"
                value={doctorNotes.length}
                icon={Calendar}
                trend="up"
                trendValue="+12%"
                delay={0.1}
              />
              <StatsCard
                title="Avg Symptom Severity"
                value={
                  symptoms.length > 0
                    ? (
                        symptoms.reduce(
                          (acc, s) => acc + (s.severityLevel || 0),
                          0
                        ) / symptoms.length
                      ).toFixed(1)
                    : "0"
                }
                icon={TrendingUp}
                trend="down"
                trendValue="-0.5"
                delay={0.2}
              />
              <StatsCard
                title="Goals Completed"
                value={
                  healthGoals.filter((g) => g.status === "COMPLETED").length
                }
                icon={CheckCircle}
                trend="up"
                trendValue="+3"
                delay={0.3}
              />
              <StatsCard
                title="Medication Adherence"
                value="94%"
                icon={Pill}
                trend="up"
                trendValue="+2%"
                delay={0.4}
              />
            </div>
          </div>
        );

      case "history": // Added medical history tab
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                Medical History
              </h2>
              <ActionButton
                onClick={async () => {
                  await medicalHistoryService.getActiveMedicalHistory();
                }}
                label="Add History"
                variant="primary"
                icon={Plus}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medicalHistory.map((history, index) => (
                <MedicalHistoryItem
                  key={history.id || index}
                  history={history}
                />
              ))}
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="glass-card rounded-none border-0 border-b border-border/50 p-6 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Healthcare Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive patient health management system
            </p>
          </div>
          <div className="flex gap-3">
            <ActionButton
              icon={Bell}
              label="Notifications"
              onClick={() => {}}
              variant="secondary"
            />
            <ActionButton
              icon={Settings}
              label="Settings"
              onClick={() => {}}
              variant="secondary"
            />
            <ActionButton
              icon={User}
              label="Profile"
              onClick={() => {}}
              variant="primary"
            />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        {/* Tab Navigation */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

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

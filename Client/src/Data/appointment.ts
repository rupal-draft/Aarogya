import {
  Heart,
  Activity,
  Thermometer,
  Zap,
  Baby,
  Sparkles,
  Brain,
  Eye,
  Bone,
  Users,
  Award,
  Star,
  Droplets,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  XCircle,
  User,
  Stethoscope,
  AlertCircle,
  Video,
  MessageCircle,
  CalendarDays,
  Wind,
  Smile,
} from "lucide-react";

export const specializations = [
  {
    name: "All Specializations",
    icon: Users,
    color: "from-gray-500 to-gray-600",
  },
  { name: "Cardiology", icon: Heart, color: "from-red-500 to-pink-500" },
  {
    name: "Dermatology",
    icon: Sparkles,
    color: "from-yellow-500 to-orange-500",
  },
  { name: "Endocrinology", icon: Zap, color: "from-purple-500 to-violet-500" },
  {
    name: "Gastroenterology",
    icon: Award,
    color: "from-green-500 to-emerald-500",
  },
  { name: "Neurology", icon: Brain, color: "from-indigo-500 to-blue-500" },
  { name: "Oncology", icon: Star, color: "from-pink-500 to-rose-500" },
  { name: "Orthopedics", icon: Bone, color: "from-orange-500 to-red-500" },
  { name: "Pediatrics", icon: Baby, color: "from-blue-500 to-cyan-500" },
  { name: "Psychiatry", icon: Brain, color: "from-teal-500 to-green-500" },
  { name: "Radiology", icon: Eye, color: "from-violet-500 to-purple-500" },
  { name: "Surgery", icon: Award, color: "from-red-600 to-pink-600" },
];

export const emergencySymptoms = [
  { name: "Severe Chest Pain", icon: Heart, color: "from-red-600 to-red-700" },
  {
    name: "Difficulty Breathing",
    icon: Activity,
    color: "from-blue-600 to-blue-700",
  },
  { name: "Severe Bleeding", icon: Droplets, color: "from-red-500 to-red-600" },
  {
    name: "Loss of Consciousness",
    icon: Brain,
    color: "from-purple-600 to-purple-700",
  },
  {
    name: "Severe Headache",
    icon: Brain,
    color: "from-indigo-600 to-indigo-700",
  },
  {
    name: "High Fever",
    icon: Thermometer,
    color: "from-orange-600 to-red-600",
  },
  {
    name: "Severe Abdominal Pain",
    icon: Activity,
    color: "from-yellow-600 to-orange-600",
  },
  {
    name: "Severe Allergic Reaction",
    icon: AlertTriangle,
    color: "from-red-600 to-pink-600",
  },
  { name: "Severe Burns", icon: Zap, color: "from-orange-600 to-red-600" },
  { name: "Broken Bones", icon: Bone, color: "from-gray-600 to-gray-700" },
  {
    name: "Severe Vomiting",
    icon: Activity,
    color: "from-green-600 to-green-700",
  },
  { name: "Seizure", icon: Brain, color: "from-purple-700 to-indigo-700" },
];

export const emmergency_specializations = [
  "Emergency Medicine",
  "Cardiology",
  "Internal Medicine",
  "Surgery",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
];

export const commonSymptoms = [
  { name: "Fever", icon: Thermometer, color: "from-red-500 to-orange-500" },
  { name: "Headache", icon: Activity, color: "from-purple-500 to-violet-500" },
  { name: "Cough", icon: Activity, color: "from-blue-500 to-cyan-500" },
  { name: "Fatigue", icon: Zap, color: "from-yellow-500 to-orange-500" },
  { name: "Nausea", icon: Activity, color: "from-green-500 to-emerald-500" },
  { name: "Dizziness", icon: Activity, color: "from-indigo-500 to-blue-500" },
  { name: "Chest Pain", icon: Heart, color: "from-red-500 to-pink-500" },
  {
    name: "Shortness of Breath",
    icon: Activity,
    color: "from-cyan-500 to-blue-500",
  },
  {
    name: "Abdominal Pain",
    icon: Activity,
    color: "from-orange-500 to-red-500",
  },
  { name: "Back Pain", icon: Activity, color: "from-gray-500 to-gray-600" },
];

export const getSpecializationColor = (specialization: string) => {
  const spec = specialization.toLowerCase();
  if (spec.includes("cardio")) return "from-red-500 to-pink-500";
  if (spec.includes("neuro")) return "from-indigo-500 to-blue-500";
  if (spec.includes("ophthal") || spec.includes("eye"))
    return "from-violet-500 to-purple-500";
  if (spec.includes("orthop") || spec.includes("bone"))
    return "from-orange-500 to-red-500";
  if (spec.includes("pediatr")) return "from-blue-500 to-cyan-500";
  if (spec.includes("endocrin")) return "from-purple-500 to-violet-500";
  if (spec.includes("dermat")) return "from-yellow-500 to-orange-500";
  return "from-gray-500 to-gray-600";
};

export const statusConfig = {
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  APPROVED: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  IN_PROGRESS: { color: "bg-purple-100 text-purple-800", icon: TrendingUp },
  COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
  REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle },
  NO_SHOW: { color: "bg-gray-100 text-gray-800", icon: User },
};

export const typeConfig = {
  REGULAR: { color: "bg-blue-50 text-blue-700", icon: Stethoscope },
  EMERGENCY: { color: "bg-red-50 text-red-700", icon: AlertCircle },
  VIRTUAL: { color: "bg-purple-50 text-purple-700", icon: Video },
  CONSULTATION: { color: "bg-green-50 text-green-700", icon: MessageCircle },
  FOLLOW_UP: { color: "bg-amber-50 text-amber-700", icon: CalendarDays },
};

export const getSpecializationIcon = (text: string) => {
  const lower = text.toLowerCase();

  if (lower.includes("cardio") || lower.includes("heart")) return Heart;
  if (lower.includes("neuro") || lower.includes("brain")) return Brain;
  if (
    lower.includes("ophthal") ||
    lower.includes("eye") ||
    lower.includes("vision")
  )
    return Eye;
  if (
    lower.includes("orthop") ||
    lower.includes("bone") ||
    lower.includes("ortho")
  )
    return Bone;
  if (lower.includes("pediatr") || lower.includes("child")) return Baby;
  if (lower.includes("endocrin")) return Zap;
  if (lower.includes("dermat")) return Sparkles;
  if (lower.includes("dental") || lower.includes("tooth")) return Smile;
  if (lower.includes("lung") || lower.includes("respiratory")) return Wind;

  return Stethoscope;
};

export const priorityColors = [
  "bg-green-100 text-green-800", // Low priority
  "bg-yellow-100 text-yellow-800", // Medium priority
  "bg-orange-100 text-orange-800", // High priority
  "bg-red-100 text-red-800", // Critical priority
];

export const statusOptions = [
  {
    value: "PENDING",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "APPROVED", label: "Approved", color: "bg-blue-100 text-blue-800" },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "NO_SHOW", label: "No Show", color: "bg-gray-100 text-gray-800" },
];

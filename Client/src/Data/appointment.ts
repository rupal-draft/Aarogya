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
  } from "lucide-react"

  export const specializations = [
    { name: "All Specializations", icon: Users, color: "from-gray-500 to-gray-600" },
    { name: "Cardiology", icon: Heart, color: "from-red-500 to-pink-500" },
    { name: "Dermatology", icon: Sparkles, color: "from-yellow-500 to-orange-500" },
    { name: "Endocrinology", icon: Zap, color: "from-purple-500 to-violet-500" },
    { name: "Gastroenterology", icon: Award, color: "from-green-500 to-emerald-500" },
    { name: "Neurology", icon: Brain, color: "from-indigo-500 to-blue-500" },
    { name: "Oncology", icon: Star, color: "from-pink-500 to-rose-500" },
    { name: "Orthopedics", icon: Bone, color: "from-orange-500 to-red-500" },
    { name: "Pediatrics", icon: Baby, color: "from-blue-500 to-cyan-500" },
    { name: "Psychiatry", icon: Brain, color: "from-teal-500 to-green-500" },
    { name: "Radiology", icon: Eye, color: "from-violet-500 to-purple-500" },
    { name: "Surgery", icon: Award, color: "from-red-600 to-pink-600" },
  ]


  export const emergencySymptoms = [
    { name: "Severe Chest Pain", icon: Heart, color: "from-red-600 to-red-700" },
    { name: "Difficulty Breathing", icon: Activity, color: "from-blue-600 to-blue-700" },
    { name: "Severe Bleeding", icon: Droplets, color: "from-red-500 to-red-600" },
    { name: "Loss of Consciousness", icon: Brain, color: "from-purple-600 to-purple-700" },
    { name: "Severe Headache", icon: Brain, color: "from-indigo-600 to-indigo-700" },
    { name: "High Fever", icon: Thermometer, color: "from-orange-600 to-red-600" },
    { name: "Severe Abdominal Pain", icon: Activity, color: "from-yellow-600 to-orange-600" },
    { name: "Severe Allergic Reaction", icon: AlertTriangle, color: "from-red-600 to-pink-600" },
    { name: "Severe Burns", icon: Zap, color: "from-orange-600 to-red-600" },
    { name: "Broken Bones", icon: Bone, color: "from-gray-600 to-gray-700" },
    { name: "Severe Vomiting", icon: Activity, color: "from-green-600 to-green-700" },
    { name: "Seizure", icon: Brain, color: "from-purple-700 to-indigo-700" },
  ]

  export const emmergency_specializations = [
    "Emergency Medicine",
    "Cardiology",
    "Internal Medicine",
    "Surgery",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
  ]

  export const commonSymptoms = [
      { name: "Fever", icon: Thermometer, color: "from-red-500 to-orange-500" },
      { name: "Headache", icon: Activity, color: "from-purple-500 to-violet-500" },
      { name: "Cough", icon: Activity, color: "from-blue-500 to-cyan-500" },
      { name: "Fatigue", icon: Zap, color: "from-yellow-500 to-orange-500" },
      { name: "Nausea", icon: Activity, color: "from-green-500 to-emerald-500" },
      { name: "Dizziness", icon: Activity, color: "from-indigo-500 to-blue-500" },
      { name: "Chest Pain", icon: Heart, color: "from-red-500 to-pink-500" },
      { name: "Shortness of Breath", icon: Activity, color: "from-cyan-500 to-blue-500" },
      { name: "Abdominal Pain", icon: Activity, color: "from-orange-500 to-red-500" },
      { name: "Back Pain", icon: Activity, color: "from-gray-500 to-gray-600" },
    ]


    export const getSpecializationIcon = (specialization: string) => {
      const spec = specialization.toLowerCase()
      if (spec.includes("cardio")) return Heart
      if (spec.includes("neuro")) return Brain
      if (spec.includes("ophthal") || spec.includes("eye")) return Eye
      if (spec.includes("orthop") || spec.includes("bone")) return Bone
      if (spec.includes("pediatr")) return Baby
      if (spec.includes("endocrin")) return Zap
      if (spec.includes("dermat")) return Sparkles
      return Users
    }

    export const getSpecializationColor = (specialization: string) => {
      const spec = specialization.toLowerCase()
      if (spec.includes("cardio")) return "from-red-500 to-pink-500"
      if (spec.includes("neuro")) return "from-indigo-500 to-blue-500"
      if (spec.includes("ophthal") || spec.includes("eye")) return "from-violet-500 to-purple-500"
      if (spec.includes("orthop") || spec.includes("bone")) return "from-orange-500 to-red-500"
      if (spec.includes("pediatr")) return "from-blue-500 to-cyan-500"
      if (spec.includes("endocrin")) return "from-purple-500 to-violet-500"
      if (spec.includes("dermat")) return "from-yellow-500 to-orange-500"
      return "from-gray-500 to-gray-600"
    }

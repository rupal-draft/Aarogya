import type React from "react"
import type { AIRecommendations, Disease } from "../../types/assitant"
import Card from "../../common/Ui/Card"
import Badge from "../../common/Ui/Badge"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  CheckCircle,
  Shield,
  Apple,
  Activity,
  Eye,
  Phone,
  UserCheck,
  Pill,
  Clock,
  Sparkles,
} from "lucide-react"

interface PredictionResultsProps {
  results: {
    consultation_id: string
    predictions: Disease[]
    ai_recommendations: AIRecommendations
  }
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ results }) => {
  const { predictions, ai_recommendations } = results

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "high"
      case "moderate":
        return "moderate"
      case "low":
        return "low"
      default:
        return "default"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-6 h-6" />
      case "moderate":
        return <Eye className="w-6 h-6" />
      case "low":
        return <CheckCircle className="w-6 h-6" />
      default:
        return <Activity className="w-6 h-6" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Urgent Message */}
      {ai_recommendations.urgent_message && (
        <motion.div variants={itemVariants}>
          <Card
            className={`border-l-4 glow-effect ${
              ai_recommendations.risk_level === "high"
                ? "border-red-500 bg-gradient-to-r from-red-50 to-pink-50"
                : ai_recommendations.risk_level === "moderate"
                  ? "border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50"
                  : "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50"
            }`}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  ai_recommendations.risk_level === "high"
                    ? "danger-gradient"
                    : ai_recommendations.risk_level === "moderate"
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                      : "health-gradient"
                }`}
                whileHover={{ scale: 1.1 }}
                animate={{ pulse: true }}
              >
                <motion.div
                  className="text-white"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {getRiskIcon(ai_recommendations.risk_level)}
                </motion.div>
              </motion.div>
              <div className="flex-1">
                <motion.h3
                  className="font-bold text-xl mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Medical Assessment Complete
                </motion.h3>
                <motion.p
                  className="text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {ai_recommendations.urgent_message}
                </motion.p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Predictions */}
      <motion.div variants={itemVariants}>
        <Card glass className="overflow-hidden">
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              className="medical-gradient w-10 h-10 rounded-full flex items-center justify-center shadow-glow"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <h3 className="font-bold text-xl gradient-text">AI Analysis Results</h3>
          </div>

          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm rounded-xl border border-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-800">{prediction.disease}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="medical-gradient h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-fit">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Badge variant={getRiskColor(prediction.risk_level)} pulse>
                  {prediction.risk_level.toUpperCase()}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* AI Recommendations Grid */}
      <motion.div className="grid md:grid-cols-2 gap-6" variants={containerVariants}>
        {/* Precautions */}
        {ai_recommendations.precautions && ai_recommendations.precautions.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card glass hover className="h-full">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="health-gradient w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg">Immediate Precautions</h3>
              </div>
              <ul className="space-y-3">
                {ai_recommendations.precautions.map((precaution, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-health-500 rounded-full mt-2 flex-shrink-0"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">{precaution}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Diet Recommendations */}
        {ai_recommendations.diet_recommendations && ai_recommendations.diet_recommendations.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card glass hover className="h-full">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Apple className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg">Diet Recommendations</h3>
              </div>
              <ul className="space-y-3">
                {ai_recommendations.diet_recommendations.map((diet, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">{diet}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Lifestyle Modifications */}
        {ai_recommendations.lifestyle_modifications && ai_recommendations.lifestyle_modifications.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card glass hover className="h-full">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Activity className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg">Lifestyle Changes</h3>
              </div>
              <ul className="space-y-3">
                {ai_recommendations.lifestyle_modifications.map((lifestyle, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">{lifestyle}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* When to Seek Care */}
        {ai_recommendations.when_to_seek_care && ai_recommendations.when_to_seek_care.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card glass hover className="h-full">
              <div className="flex items-center space-x-3 mb-4">
                <motion.div
                  className="danger-gradient w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  <Phone className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="font-bold text-lg">When to Seek Medical Care</h3>
              </div>
              <ul className="space-y-3">
                {ai_recommendations.when_to_seek_care.map((care, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">{care}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Doctor Recommendation */}
      {ai_recommendations.recommended_specialist && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-medical-50 to-blue-50 border-medical-200 glow-effect">
            <div className="flex items-center space-x-4">
              <motion.div
                className="medical-gradient w-16 h-16 rounded-full flex items-center justify-center shadow-glow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                animate={{ pulse: true }}
              >
                <UserCheck className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-xl gradient-text mb-2">Recommended Specialist</h3>
                <p className="text-lg font-medium text-medical-800 mb-2">{ai_recommendations.recommended_specialist}</p>
                <div className="flex items-center space-x-4 text-sm text-medical-600">
                  {ai_recommendations.recovery_timeline && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Recovery: {ai_recommendations.recovery_timeline}</span>
                    </div>
                  )}
                  {ai_recommendations.treatment_approach && (
                    <div className="flex items-center space-x-1">
                      <Pill className="w-4 h-4" />
                      <span>Treatment: {ai_recommendations.treatment_approach}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-start space-x-3">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <AlertTriangle className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">Important Medical Disclaimer</h4>
              <p className="text-yellow-700 text-sm leading-relaxed">
                This AI assessment provides general medical information and should not replace professional medical
                advice. Always consult with qualified healthcare professionals for proper diagnosis and treatment. In
                case of emergency, contact your local emergency services immediately.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default PredictionResults

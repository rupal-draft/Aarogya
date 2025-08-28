import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Heart,
  Pill,
  Target,
  AlertTriangle,
  Brain,
  Users,
  Shield,
  Thermometer,
  Stethoscope,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card } from "../../../../common/Ui/Card2";
import Button from "../../../../common/Ui/Button";
import { Badge } from "../../../../common/Ui/Badge2";

interface AnalyticsTabProps {
  data: any;
}

export default function AnalyticsTab({ data }: AnalyticsTabProps) {
  const [analyticsData] = useState(data);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const AnalyticsCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    trend,
    percentage,
    gradient,
  }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.08,
        y: -12,
        rotateY: 8,
        rotateX: 2,
        boxShadow: "0 35px 80px rgba(139, 92, 246, 0.4)",
      }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      className="relative overflow-hidden perspective-1000 group"
    >
      <Card className="glass-card p-6 h-full relative border-2 border-transparent animate-pulse-border bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
        {/* Enhanced floating particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 ${
                gradient || color
              } rounded-full opacity-20`}
              animate={{
                x: [0, 150, -60, 100, 0],
                y: [0, -80, 60, -30, 0],
                scale: [1, 2, 0.3, 1.5, 1],
                opacity: [0.2, 0.8, 0.1, 0.6, 0.2],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6 + i * 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + i * 10}%`,
              }}
            />
          ))}
        </div>

        {/* Animated border glow */}
        <motion.div
          className={`absolute inset-0 rounded-lg ${
            gradient || color
          } opacity-20`}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: {
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                },
              }}
              className={`p-4 ${
                gradient || color
              } rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-300`}
            >
              {icon}
            </motion.div>
            {trend && (
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="p-2 bg-white/10 rounded-full backdrop-blur-sm"
              >
                {trend === "up" ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : trend === "down" ? (
                  <TrendingDown className="w-6 h-6 text-red-400" />
                ) : (
                  <Activity className="w-6 h-6 text-blue-400" />
                )}
              </motion.div>
            )}
          </div>

          <motion.h3
            className="font-bold text-xl text-card-foreground mb-3"
            animate={{
              textShadow: [
                "0 0 0px rgba(139, 92, 246, 0)",
                "0 0 12px rgba(139, 92, 246, 0.4)",
                "0 0 0px rgba(139, 92, 246, 0)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {title}
          </motion.h3>

          <motion.div
            className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              scale: [1, 1.05, 1],
            }}
            transition={{
              backgroundPosition: {
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: {
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
              },
            }}
          >
            {value}
          </motion.div>

          {subtitle && (
            <p className="text-sm text-muted-foreground font-medium">
              {subtitle}
            </p>
          )}

          {percentage && (
            <motion.div
              className="mt-3 flex items-center gap-2 p-2 bg-white/5 rounded-lg backdrop-blur-sm"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-xs text-muted-foreground">Change:</span>
              <span
                className={`text-sm font-bold ${
                  percentage.startsWith("+")
                    ? "text-green-400"
                    : percentage.startsWith("-")
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {percentage}
              </span>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 relative"
    >
      {/* Enhanced floating background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-full opacity-8"
            animate={{
              x: [0, window.innerWidth || 1200],
              y: [
                Math.random() * (window.innerHeight || 800),
                Math.random() * (window.innerHeight || 800),
              ],
              scale: [0, 1.5, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "linear",
            }}
            style={{
              left: -20,
              top: Math.random() * (window.innerHeight || 800),
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="flex items-center justify-between relative z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            }}
            className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl"
          >
            <BarChart3 className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <motion.h2
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Health Analytics Dashboard
            </motion.h2>
            <p className="text-muted-foreground mt-1">
              Comprehensive health insights and trends
            </p>
          </div>
        </div>
      </motion.div>

      {/* Overall Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-10 relative z-10"
      >
        <Card className="glass-card p-10 text-center relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${getHealthScoreColor(
              analyticsData.overallHealthScore
            )} opacity-8`}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.08, 0.2, 0.08],
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Animated rings around health score */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute border-2 ${getHealthScoreColor(
                  analyticsData.overallHealthScore
                ).replace(
                  "bg-gradient-to-r",
                  "border-gradient-to-r"
                )} rounded-full opacity-20`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.05, 0.2],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.5,
                }}
                style={{
                  width: `${200 + i * 50}px`,
                  height: `${200 + i * 50}px`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <motion.h3
              className="text-3xl font-bold text-foreground mb-6"
              animate={{
                textShadow: [
                  "0 0 0px rgba(168, 85, 247, 0)",
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                  "0 0 0px rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              Overall Health Score
            </motion.h3>
            <motion.div
              className={`text-8xl font-black bg-gradient-to-r ${getHealthScoreColor(
                analyticsData.overallHealthScore
              )} bg-clip-text text-transparent mb-6`}
              animate={{
                scale: [1, 1.1, 1],
                textShadow: [
                  "0 0 0px rgba(168, 85, 247, 0)",
                  "0 0 30px rgba(168, 85, 247, 0.5)",
                  "0 0 0px rgba(168, 85, 247, 0)",
                ],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              {analyticsData.overallHealthScore}
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Badge
                className={`${getSeverityColor(
                  analyticsData.healthScoreColor
                )} text-white px-6 py-3 text-xl font-bold`}
              >
                {analyticsData.healthScoreText} • {analyticsData.healthTrend}
              </Badge>
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AnalyticsCard
              title="Total Diseases"
              value={analyticsData.totalDiseases}
              subtitle={`${analyticsData.activeDiseases} Active • ${analyticsData.chronicDiseases} Chronic`}
              icon={<Stethoscope className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-red-500 to-rose-600"
              trend="stable"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnalyticsCard
              title="Critical Allergies"
              value={analyticsData.criticalAllergies}
              subtitle={`${analyticsData.totalAllergies} Total Allergies`}
              icon={<Shield className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-orange-500 to-red-500"
              trend="stable"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnalyticsCard
              title="Medication Adherence"
              value={`${analyticsData.medicationAnalytics.adherenceRate}%`}
              subtitle={`${analyticsData.medicationAnalytics.activeMedications} Active Medications`}
              icon={<Pill className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              trend="up"
              percentage="+5%"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <AnalyticsCard
              title="Health Goals Progress"
              value={`${Math.round(
                analyticsData.goalAnalytics.averageProgress
              )}%`}
              subtitle={`${analyticsData.goalAnalytics.activeGoals} Active Goals`}
              icon={<Target className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-green-500 to-emerald-600"
              trend="up"
              percentage="+12%"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AnalyticsCard
              title="Vitals Records"
              value={analyticsData.vitalsAnalytics.totalVitalsRecords}
              subtitle={`Avg HR: ${analyticsData.vitalsAnalytics.averageVitals.heartRate} BPM`}
              icon={<Heart className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-pink-500 to-rose-600"
              trend="stable"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AnalyticsCard
              title="Symptoms Tracked"
              value={analyticsData.symptomAnalytics.totalSymptoms}
              subtitle={`Most Common: ${analyticsData.symptomAnalytics.mostCommonSymptoms[0]}`}
              icon={<Activity className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-purple-500 to-violet-600"
              trend="stable"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <AnalyticsCard
              title="Emergency Contacts"
              value={analyticsData.emergencyContacts}
              subtitle="Available 24/7"
              icon={<Users className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-teal-500 to-cyan-600"
              trend="stable"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <AnalyticsCard
              title="Profile Completeness"
              value={analyticsData.profileCompleteness}
              subtitle="All sections filled"
              icon={<CheckCircle className="w-7 h-7 text-white" />}
              gradient="bg-gradient-to-br from-emerald-500 to-green-600"
              trend="up"
              percentage="100%"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Health Alerts */}
      {analyticsData.healthAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10"
        >
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">
                Health Alerts
              </h3>
            </div>
            <div className="space-y-4">
              {analyticsData.healthAlerts.map((alert: any, index: number) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                >
                  <Badge
                    className={`${getSeverityColor(alert.severity)} text-white`}
                  >
                    {alert.severity}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alert.actionRequired}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Recommendations */}
      {analyticsData.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Brain className="w-6 h-6 text-blue-500" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground">
                AI Recommendations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData.recommendations.map((rec: any, index: number) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-foreground">
                      {rec.title}
                    </h4>
                    <Badge
                      className={`${getSeverityColor(
                        rec.priority
                      )} text-white text-xs`}
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    Take Action
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Vitals Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative z-10"
      >
        <Card className="glass-card p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4 mb-8">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
              }}
              className="p-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl"
            >
              <Thermometer className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                Vitals Analytics
              </h3>
              <p className="text-muted-foreground">
                Average vital signs and trends
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-foreground">
                  Blood Pressure
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {analyticsData.vitalsAnalytics.averageVitals.systolic}/
                {analyticsData.vitalsAnalytics.averageVitals.diastolic}
              </div>
              <p className="text-sm text-muted-foreground">mmHg</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-foreground">
                  Heart Rate
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {analyticsData.vitalsAnalytics.averageVitals.heartRate}
              </div>
              <p className="text-sm text-muted-foreground">BPM</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-foreground">
                  Temperature
                </span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {analyticsData.vitalsAnalytics.averageVitals.temperature}°C
              </div>
              <p className="text-sm text-muted-foreground">Body Temp</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-foreground">
                  Last Record
                </span>
              </div>
              <div className="text-sm font-bold text-green-600">
                Aug 24, 2025
              </div>
              <p className="text-sm text-muted-foreground">22:19</p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

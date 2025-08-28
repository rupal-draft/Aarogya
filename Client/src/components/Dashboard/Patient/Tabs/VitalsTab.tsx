"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Activity,
  Heart,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
  Droplets,
  Weight,
  Zap,
  HeartPulse,
} from "lucide-react";
import Button from "./../../../../common/Ui/Button";
import { Card } from "./../../../../common/Ui/Card2";
import { Badge } from "./../../../../common/Ui/Badge2";

interface VitalsTabProps {
  data: any[];
}

export default function VitalsTab({ data }: VitalsTabProps) {
  const [vitalsData] = useState(data);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "NORMAL":
        return "bg-green-500";
      case "HIGH":
        return "bg-red-500";
      case "LOW":
        return "bg-yellow-500";
      case "CRITICAL":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend?.toUpperCase()) {
      case "INCREASING":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "DECREASING":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "STABLE":
        return <Minus className="w-4 h-4 text-blue-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const VitalCard = ({ title, icon, data, unit, color }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{
        scale: 1.05,
        y: -8,
        rotateY: 5,
        boxShadow: "0 25px 50px rgba(139, 92, 246, 0.25)",
      }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
      className="relative overflow-hidden perspective-1000"
    >
      <Card className="glass-vital-card p-6 h-full relative border-2 border-transparent animate-pulse-border">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${color} rounded-full opacity-30`}
              animate={{
                x: [0, 150, -50, 100, 0],
                y: [0, -80, 50, -30, 0],
                scale: [1, 2, 0.5, 1.5, 1],
                opacity: [0.3, 0.8, 0.2, 0.6, 0.3],
              }}
              transition={{
                duration: 6 + i * 0.5,
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
          <motion.div
            className={`absolute inset-0 ${color} opacity-5 rounded-xl`}
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
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
                  scale: {
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  },
                }}
                className={`p-4 ${color} rounded-2xl shadow-lg relative overflow-hidden`}
              >
                <motion.div
                  className="absolute inset-0 bg-white opacity-20 rounded-2xl"
                  animate={{
                    x: [-100, 100],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                {icon}
                <HeartPulse className="absolute top-1 right-1 w-3 h-3 text-white opacity-60" />
              </motion.div>
              <div>
                <motion.h3
                  className="font-bold text-xl text-card-foreground mb-2"
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(139, 92, 246, 0)",
                      "0 0 10px rgba(139, 92, 246, 0.3)",
                      "0 0 0px rgba(139, 92, 246, 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  {title}
                </motion.h3>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`${getStatusColor(
                      data.status
                    )} text-white text-xs px-3 py-1 shadow-md`}
                  >
                    {data.status}
                  </Badge>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    {getTrendIcon(data.trend)}
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="text-center mb-8"
            animate={{
              scale: [1, 1.03, 1],
              rotateX: [0, 2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-3 relative"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                textShadow: [
                  "0 0 0px rgba(139, 92, 246, 0)",
                  "0 0 20px rgba(139, 92, 246, 0.4)",
                  "0 0 0px rgba(139, 92, 246, 0)",
                ],
              }}
              transition={{
                backgroundPosition: {
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                textShadow: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                },
              }}
            >
              {data.current}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 1,
                }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </motion.div>
            <motion.p
              className="text-sm text-muted-foreground font-semibold tracking-wide"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              {unit}
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100"
              whileHover={{
                scale: 1.08,
                rotateY: 5,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Average
              </p>
              <motion.p
                className="font-bold text-lg text-blue-600"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {data.average}
              </motion.p>
            </motion.div>
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border border-green-100"
              whileHover={{
                scale: 1.08,
                rotateY: -5,
                boxShadow: "0 10px 25px rgba(34, 197, 94, 0.15)",
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Range
              </p>
              <motion.p
                className="font-bold text-lg text-green-600"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.5,
                }}
              >
                {data.minimum}-{data.maximum}
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-xl border border-purple-100 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 25px rgba(168, 85, 247, 0.15)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0"
              animate={{
                opacity: [0, 0.3, 0],
                x: [-100, 100],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
            />
            <span className="text-sm text-muted-foreground font-medium">
              Change:
            </span>
            <motion.span
              className={`font-bold text-lg ${
                data.changeFromPrevious > 0
                  ? "text-green-600"
                  : data.changeFromPrevious < 0
                  ? "text-red-600"
                  : "text-blue-600"
              } relative z-10`}
              animate={{
                scale: [1, 1.15, 1],
                textShadow: [
                  "0 0 0px rgba(34, 197, 94, 0)",
                  "0 0 10px rgba(34, 197, 94, 0.3)",
                  "0 0 0px rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {data.changePercentage}
            </motion.span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative"
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10"
            animate={{
              x: [0, window.innerWidth || 1200],
              y: [
                Math.random() * (window.innerHeight || 800),
                Math.random() * (window.innerHeight || 800),
              ],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
              ease: "linear",
            }}
            style={{
              left: -10,
              top: Math.random() * (window.innerHeight || 800),
            }}
          />
        ))}
      </div>

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
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
              scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
            }}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl"
          >
            <Activity className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <motion.h2
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              Vital Signs Monitor
            </motion.h2>
            <p className="text-muted-foreground mt-1">
              Real-time health metrics tracking
            </p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Record Vitals
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 relative z-10"
      >
        <Card className="glass-card p-8 text-center animate-pulse-glow relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
              rotateX: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <motion.h3
              className="text-3xl font-bold text-foreground mb-4"
              animate={{
                textShadow: [
                  "0 0 0px rgba(34, 197, 94, 0)",
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 0px rgba(34, 197, 94, 0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              Overall Health Status
            </motion.h3>
            <motion.div
              className="text-6xl font-black bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                scale: [1, 1.05, 1],
              }}
              transition={{
                backgroundPosition: {
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                },
              }}
            >
              {vitalsData.overallHealthStatus}
            </motion.div>
            <motion.p
              className="text-muted-foreground text-lg"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              Last recorded:{" "}
              {new Date(vitalsData.lastRecorded).toLocaleDateString()}
            </motion.p>
          </motion.div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <VitalCard
              title="Blood Pressure"
              icon={<Activity className="w-6 h-6 text-white" />}
              data={vitalsData.bloodPressure}
              unit="mmHg"
              color="bg-red-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <VitalCard
              title="Heart Rate"
              icon={<Heart className="w-6 h-6 text-white" />}
              data={vitalsData.heartRate}
              unit="bpm"
              color="bg-pink-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <VitalCard
              title="Temperature"
              icon={<Thermometer className="w-6 h-6 text-white" />}
              data={vitalsData.temperature}
              unit="°F"
              color="bg-orange-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <VitalCard
              title="Oxygen Saturation"
              icon={<Droplets className="w-6 h-6 text-white" />}
              data={vitalsData.oxygenSaturation}
              unit="%"
              color="bg-blue-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <VitalCard
              title="Weight"
              icon={<Weight className="w-6 h-6 text-white" />}
              data={vitalsData.weight}
              unit="lbs"
              color="bg-green-500"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

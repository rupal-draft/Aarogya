"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/Ui/Card2";
import { Badge } from "../../../../common/Ui/Badge2";
import Button from "../../../../common/Ui/Button";
import { Input } from "../../../../common/Ui/input";
import { Label } from "../../../../common/Ui/label";
import { Textarea } from "../../../../common/Ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/Ui/Select";
import {
  Brain,
  Activity,
  AlertTriangle,
  Clock,
  Calendar,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  X,
  Zap,
  Heart,
  Stethoscope,
  Shield,
  Eye,
  Thermometer,
  Sparkles,
  Star,
  Waves,
} from "lucide-react";
import clsx from "clsx";

interface Symptom {
  id: string;
  patientId: string;
  symptomName: string;
  category: string;
  severityLevel: number;
  description: string;
  triggers: string[];
  duration: string;
  frequency: string;
  associatedSymptoms: string[];
  notes: string;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  formattedRecordedAt: string;
  severityText: string;
  severityBadgeColor: string;
  categoryBadgeColor: string;
  timeAgo: string;
  recent: boolean;
  severe: boolean;
}

interface SymptomSummary {
  avgSeverity: number;
  symptomName: string;
  count: number;
}

interface SymptomsData {
  symptomSummaries: SymptomSummary[];
  recentSymptoms: Symptom[];
  totalSymptoms: number;
  generatedAt: string;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "neurological":
      return Brain;
    case "respiratory":
      return Activity;
    case "gastrointestinal":
      return Heart;
    case "general":
      return Zap;
    default:
      return AlertTriangle;
  }
};

const getSeverityColor = (severity: number) => {
  if (severity >= 8) return "from-rose-500 via-red-500 to-pink-600";
  if (severity >= 6) return "from-amber-500 via-orange-500 to-yellow-500";
  if (severity >= 4) return "from-emerald-400 via-teal-500 to-cyan-500";
  return "from-green-400 via-emerald-500 to-teal-500";
};

const getSeverityBadgeColor = (severity: number) => {
  if (severity >= 8)
    return "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/30";
  if (severity >= 6)
    return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30";
  if (severity >= 4)
    return "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30";
  return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30";
};

const getCategoryBadgeColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "neurological":
      return "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30";
    case "respiratory":
      return "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30";
    case "gastrointestinal":
      return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30";
    case "general":
      return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-500/30";
    default:
      return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border-gray-500/30";
  }
};

// Enhanced floating particles with multiple types
const EnhancedFloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full opacity-60"
          style={{
            background: `linear-gradient(45deg, 
              ${
                i % 3 === 0
                  ? "#10b981, #06b6d4"
                  : i % 3 === 1
                  ? "#8b5cf6, #06b6d4"
                  : "#f59e0b, #ef4444"
              })`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 8 + 6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Floating medical icons */}
      {[...Array(8)].map((_, i) => {
        const icons = [
          Stethoscope,
          Heart,
          Brain,
          Activity,
          Shield,
          Eye,
          Thermometer,
          Sparkles,
        ];
        const IconComponent = icons[i % icons.length];
        return (
          <motion.div
            key={`icon-${i}`}
            className="absolute text-emerald-400/10"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <IconComponent size={24} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Premium glassmorphism background
const GlassmorphismBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
        style={{
          background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
        style={{
          background: "linear-gradient(225deg, #10b981, #f59e0b)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-25"
        style={{
          background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
          filter: "blur(30px)",
        }}
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default function SymptomsTab({ data }: { data: SymptomsData }) {
  const [symptomsData] = useState<SymptomsData>(data);

  const stats = [
    {
      label: "Total Symptoms",
      value: symptomsData.totalSymptoms,
      icon: Activity,
      color: "text-blue-400",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
    },
    {
      label: "Recent Records",
      value: symptomsData.recentSymptoms.length,
      icon: Clock,
      color: "text-purple-400",
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
    },
    {
      label: "Categories",
      value: symptomsData.symptomSummaries.length,
      icon: Shield,
      color: "text-emerald-400",
      gradient: "from-emerald-500 via-green-500 to-teal-500",
    },
  ];

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);

  const handleAddSymptom = () => {
    setShowAddForm(true);
  };

  const handleEditSymptom = (symptom: Symptom) => {
    setEditingSymptom(symptom);
    setShowAddForm(true);
  };

  const handleDeleteSymptom = (symptomId: string) => {
    console.log("Delete symptom:", symptomId);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingSymptom(null);
  };
  const [counters, setCounters] = useState([0, 0, 0]);
  useEffect(() => {
    const duration = 2000; // ms
    const interval = 20; // ms
    const steps = duration / interval;

    const newCounters = stats.map((stat) => stat.value);
    const increments = newCounters.map((value) => value / steps);

    let currentCounts = [0, 0, 0];
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      currentCounts = currentCounts.map((count, index) =>
        Math.min(count + increments[index], newCounters[index])
      );

      setCounters(currentCounts);

      if (step >= steps) {
        clearInterval(timer);
        setCounters(newCounters);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [symptomsData]);

  return (
    <div className="relative min-h-screen">
      {/* Premium background */}
      <GlassmorphismBackground />
      <EnhancedFloatingParticles />

      <div className="relative z-10 p-8 space-y-10">
        {/* Hero Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 backdrop-blur-xl border border-emerald-500/30 rounded-3xl shadow-2xl">
                  <Brain className="w-10 h-10 text-emerald-300" />
                </div>
              </motion.div>

              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent"
                >
                  Symptoms Intelligence
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-slate-400 mt-2 text-lg"
                >
                  Advanced health monitoring with AI-powered insights
                </motion.p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={handleAddSymptom}
                className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <Plus className="w-5 h-5 mr-2" />
                Record Symptom
              </Button>
            </motion.div>
          </div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-4"
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    y: -6,
                    transition: { duration: 0.3 },
                  }}
                  className="relative group"
                >
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 rounded-3xl"></div>

                  {/* Main card */}
                  <div className="relative backdrop-blur-xl bg-slate-900/60 border border-slate-700/40 rounded-3xl p-6 overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)]">
                    {/* Gradient border effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
                    ></div>

                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.08] bg-grid-pattern"></div>

                    {/* Content */}
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <p className="text-slate-400 text-sm font-medium mb-2 tracking-wider uppercase">
                          {stat.label}
                        </p>
                        <motion.p
                          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r bg-clip-text text-transparent font-[Inter] drop-shadow-sm tracking-tight"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${stat.gradient
                              .split(" ")
                              .join(", ")})`,
                          }}
                          animate={{
                            scale: [1, 1.07, 1],
                          }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            delay: index * 0.4,
                          }}
                        >
                          {Math.round(counters[index])}
                        </motion.p>
                      </div>

                      <motion.div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 border border-slate-700/40 shadow-md`}
                        whileHover={{ rotate: 8, scale: 1.15 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 12,
                        }}
                      >
                        <IconComponent
                          className={`w-9 h-9 ${stat.color} drop-shadow-lg`}
                        />
                      </motion.div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-6 relative z-10">
                      <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: 1.5,
                            delay: 0.5 + index * 0.25,
                          }}
                          className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.4)]`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Enhanced Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {symptomsData.symptomSummaries.map((summary, index) => {
            const IconComponent = getCategoryIcon(summary.symptomName);
            return (
              <motion.div
                key={summary.symptomName}
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.08,
                  rotateY: 8,
                  z: 100,
                  transition: { duration: 0.3 },
                }}
                className="relative group perspective-1000"
              >
                {/* Holographic effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(45deg, ${getSeverityColor(
                      summary.avgSeverity
                    )})`,
                    filter: "blur(20px)",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-2xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-500 rounded-3xl shadow-2xl group-hover:shadow-emerald-500/20">
                  {/* Animated mesh gradient overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${getSeverityColor(
                        summary.avgSeverity
                      )})`,
                    }}
                  />

                  {/* Floating sparkles */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-60"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${20 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                      }}
                    />
                  ))}

                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <motion.div
                        animate={{
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                        className="relative"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${getSeverityColor(
                            summary.avgSeverity
                          )}/30 rounded-2xl blur-sm`}
                        ></div>
                        <div
                          className={`relative p-4 bg-gradient-to-br ${getSeverityColor(
                            summary.avgSeverity
                          )}/20 backdrop-blur-sm rounded-2xl border border-white/10`}
                        >
                          <IconComponent
                            className={`w-7 h-7 text-white drop-shadow-lg`}
                          />
                        </div>
                      </motion.div>

                      <Badge
                        className={clsx(
                          getSeverityBadgeColor(summary.avgSeverity),
                          "border text-sm font-bold px-3 py-1 rounded-full"
                        )}
                      >
                        <motion.span
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2,
                          }}
                        >
                          {summary.avgSeverity}/10
                        </motion.span>
                      </Badge>
                    </div>

                    <h3 className="font-bold text-white mb-4 text-lg group-hover:text-emerald-300 transition-colors duration-300">
                      {summary.symptomName}
                    </h3>

                    <div className="flex items-center justify-between text-sm mb-6">
                      <span className="text-slate-400 font-medium">
                        Episodes
                      </span>
                      <motion.span
                        className="font-bold text-2xl bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent"
                        animate={{
                          scale: [1, 1.15, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: index * 0.4,
                        }}
                      >
                        {summary.count}
                      </motion.span>
                    </div>

                    {/* Enhanced severity visualization */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Severity Level</span>
                        <span>{summary.avgSeverity}/10</span>
                      </div>
                      <div className="relative w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getSeverityColor(
                            summary.avgSeverity
                          )} rounded-full relative`}
                          initial={{ width: 0, x: -20 }}
                          animate={{
                            width: `${(summary.avgSeverity / 10) * 100}%`,
                            x: 0,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: index * 0.2,
                            ease: "easeOut",
                          }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 2 + index * 0.3,
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Premium Recent Symptoms Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-2xl border border-slate-600/30 rounded-3xl shadow-2xl">
            {/* Animated background pattern */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                                   radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <CardHeader className="relative z-10 pb-6">
              <CardTitle className="flex items-center space-x-4 text-3xl">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-md opacity-75"></div>
                  <div className="relative p-3 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-full border border-emerald-400/30">
                    <Activity className="w-8 h-8 text-emerald-300" />
                  </div>
                </motion.div>
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent font-extrabold">
                  Recent Health Events
                </span>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-emerald-400/70" />
                </motion.div>
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 px-8 pb-8">
              <div className="space-y-6">
                {symptomsData.recentSymptoms.map((symptom, index) => {
                  const IconComponent = getCategoryIcon(symptom.category);
                  return (
                    <motion.div
                      key={symptom.id}
                      initial={{ opacity: 0, x: -30, rotateX: -15 }}
                      animate={{ opacity: 1, x: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.7,
                        delay: index * 0.15,
                        type: "spring",
                        stiffness: 80,
                      }}
                      whileHover={{
                        scale: 1.03,
                        x: 15,
                        rotateY: 3,
                        transition: { duration: 0.3 },
                      }}
                      className="group relative"
                    >
                      <Card className="relative overflow-hidden bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 backdrop-blur-xl border border-slate-600/30 hover:border-emerald-400/40 transition-all duration-500 rounded-2xl shadow-xl group-hover:shadow-2xl group-hover:shadow-emerald-500/10">
                        {/* Dynamic glow effect */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100"
                          style={{
                            background: `linear-gradient(135deg, ${getSeverityColor(
                              symptom.severityLevel
                            )}/10, transparent 70%)`,
                          }}
                          transition={{ duration: 0.4 }}
                        />

                        {/* Pulse effect for severe symptoms */}
                        {symptom.severe && (
                          <motion.div
                            className="absolute inset-0 border-2 border-red-500/30 rounded-2xl"
                            animate={{
                              opacity: [0.3, 0.8, 0.3],
                              scale: [1, 1.02, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}

                        <CardContent className="p-8 relative z-10">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-6 flex-1">
                              <motion.div
                                whileHover={{
                                  rotate: 20,
                                  scale: 1.15,
                                  transition: { duration: 0.2 },
                                }}
                                className="relative flex-shrink-0"
                              >
                                <div
                                  className={`absolute inset-0 bg-gradient-to-br ${getSeverityColor(
                                    symptom.severityLevel
                                  )}/30 rounded-2xl blur-sm`}
                                ></div>
                                <div
                                  className={`relative p-4 bg-gradient-to-br ${getSeverityColor(
                                    symptom.severityLevel
                                  )}/20 backdrop-blur-sm rounded-2xl border border-white/10`}
                                >
                                  <IconComponent className="w-7 h-7 text-white drop-shadow-lg" />
                                </div>
                              </motion.div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-4 mb-4">
                                  <h3 className="font-bold text-white text-xl group-hover:text-emerald-300 transition-colors duration-300">
                                    {symptom.symptomName}
                                  </h3>

                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      className={clsx(
                                        getCategoryBadgeColor(symptom.category),
                                        "border text-xs font-semibold px-3 py-1"
                                      )}
                                    >
                                      {symptom.category}
                                    </Badge>
                                    <Badge
                                      className={clsx(
                                        getSeverityBadgeColor(
                                          symptom.severityLevel
                                        ),
                                        "border text-xs font-bold px-3 py-1"
                                      )}
                                    >
                                      <motion.span
                                        animate={{
                                          scale: symptom.severe
                                            ? [1, 1.1, 1]
                                            : 1,
                                        }}
                                        transition={{
                                          duration: 1.5,
                                          repeat: symptom.severe ? Infinity : 0,
                                        }}
                                      >
                                        {symptom.severityLevel}/10
                                      </motion.span>
                                    </Badge>
                                    {symptom.recent && (
                                      <motion.div
                                        animate={{
                                          scale: [1, 1.2, 1],
                                          opacity: [0.7, 1, 0.7],
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                        }}
                                      >
                                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30 border">
                                          <Star className="w-3 h-3 mr-1" />
                                          New
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>

                                <p className="text-slate-300 mb-6 leading-relaxed text-lg">
                                  {symptom.description}
                                </p>

                                {/* Enhanced info grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                  {[
                                    {
                                      icon: Clock,
                                      label: "Duration",
                                      value: symptom.duration,
                                      color: "text-blue-400",
                                    },
                                    {
                                      icon: TrendingUp,
                                      label: "Frequency",
                                      value: symptom.frequency,
                                      color: "text-emerald-400",
                                    },
                                    {
                                      icon: Calendar,
                                      label: "Recorded",
                                      value: symptom.timeAgo,
                                      color: "text-purple-400",
                                    },
                                    {
                                      icon: AlertTriangle,
                                      label: "Triggers",
                                      value: symptom.triggers
                                        .slice(0, 2)
                                        .join(", "),
                                      color: "text-orange-400",
                                    },
                                  ].map((item, idx) => {
                                    const ItemIcon = item.icon;
                                    return (
                                      <motion.div
                                        key={idx}
                                        className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        <ItemIcon
                                          className={`w-5 h-5 ${item.color}`}
                                        />
                                        <div>
                                          <span className="text-slate-400 text-xs font-medium block">
                                            {item.label}
                                          </span>
                                          <span className="text-white text-sm font-semibold">
                                            {item.value}
                                          </span>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>

                                {/* Associated symptoms with enhanced styling */}
                                {symptom.associatedSymptoms.length > 0 && (
                                  <div className="mb-6">
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Waves className="w-4 h-4 text-emerald-400" />
                                      <span className="text-slate-400 font-medium">
                                        Related Symptoms:
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {symptom.associatedSymptoms.map(
                                        (assocSymptom, idx) => (
                                          <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ scale: 1.1 }}
                                          >
                                            <Badge className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-slate-300 border-slate-500/30 border hover:from-emerald-700/30 hover:to-teal-700/30 hover:text-emerald-300 transition-all duration-300 px-3 py-1">
                                              {assocSymptom}
                                            </Badge>
                                          </motion.div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Notes section with premium styling */}
                                {symptom.notes && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl p-6 border border-slate-600/30 backdrop-blur-sm"
                                  >
                                    <div className="flex items-center space-x-2 mb-3">
                                      <Eye className="w-4 h-4 text-teal-400" />
                                      <span className="text-slate-400 font-medium">
                                        Clinical Notes:
                                      </span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed italic">
                                      "{symptom.notes}"
                                    </p>
                                  </motion.div>
                                )}
                              </div>
                            </div>

                            {/* Action buttons with enhanced design */}
                            <div className="flex flex-col space-y-3 ml-6">
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditSymptom(symptom)}
                                className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-400 hover:text-emerald-300 transition-all duration-300 border border-emerald-500/30 hover:border-emerald-400/50 backdrop-blur-sm group/btn"
                              >
                                <Edit className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-200" />
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteSymptom(symptom.id)}
                                className="p-3 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 text-red-400 hover:text-red-300 transition-all duration-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-sm group/btn"
                              >
                                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                              </motion.button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
              onClick={handleCloseForm}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl border border-slate-600/50 p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl"
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                {/* Modal background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 rounded-3xl" />
                <motion.div
                  className="absolute inset-0 opacity-20"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30"
                      >
                        <Plus className="w-8 h-8 text-emerald-400" />
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                          {editingSymptom
                            ? "Update Health Record"
                            : "New Health Record"}
                        </h3>
                        <p className="text-slate-400 mt-1">
                          {editingSymptom
                            ? "Modify your symptom details"
                            : "Capture your current symptoms accurately"}
                        </p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCloseForm}
                      className="p-3 rounded-2xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-300 border border-slate-600/50 hover:border-slate-500/50"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <form className="space-y-8">
                    {/* Form content with enhanced styling */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="symptomName"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <Stethoscope className="w-4 h-4 text-emerald-400" />
                          <span>Symptom Name</span>
                        </Label>
                        <Input
                          id="symptomName"
                          placeholder="Enter symptom name..."
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                          defaultValue={editingSymptom?.symptomName || ""}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="category"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <Brain className="w-4 h-4 text-emerald-400" />
                          <span>Category</span>
                        </Label>
                        <Select defaultValue={editingSymptom?.category || ""}>
                          <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white rounded-xl p-4 text-lg backdrop-blur-sm focus:border-emerald-500">
                            <SelectValue placeholder="Select category..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="neurological">
                              Neurological
                            </SelectItem>
                            <SelectItem value="respiratory">
                              Respiratory
                            </SelectItem>
                            <SelectItem value="gastrointestinal">
                              Gastrointestinal
                            </SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="description"
                        className="text-white font-semibold text-lg flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>Detailed Description</span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your symptoms in detail..."
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 min-h-[120px] rounded-xl p-4 text-lg backdrop-blur-sm"
                        defaultValue={editingSymptom?.description || ""}
                      />
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="severity"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <AlertTriangle className="w-4 h-4 text-emerald-400" />
                          <span>Severity (1-10)</span>
                        </Label>
                        <Input
                          id="severity"
                          type="number"
                          min="1"
                          max="10"
                          placeholder="Rate 1-10"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                          defaultValue={editingSymptom?.severityLevel || ""}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="duration"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <Clock className="w-4 h-4 text-emerald-400" />
                          <span>Duration</span>
                        </Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 3 hours"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                          defaultValue={editingSymptom?.duration || ""}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="frequency"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span>Frequency</span>
                        </Label>
                        <Input
                          id="frequency"
                          placeholder="e.g., Daily, Weekly"
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                          defaultValue={editingSymptom?.frequency || ""}
                        />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="triggers"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <Zap className="w-4 h-4 text-emerald-400" />
                          <span>Triggers</span>
                        </Label>
                        <Input
                          id="triggers"
                          placeholder="e.g., Stress, Weather, Food..."
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                          defaultValue={
                            editingSymptom?.triggers.join(", ") || ""
                          }
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="associatedSymptoms"
                          className="text-white font-semibold text-lg flex items-center space-x-2"
                        >
                          <Waves className="w-4 h-4 text-emerald-400" />
                          <span>Related Symptoms</span>
                        </Label>
                        <Input
                          id="associatedSymptoms"
                          placeholder="e.g., Nausea, Headache..."
                          className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                          defaultValue={
                            editingSymptom?.associatedSymptoms.join(", ") || ""
                          }
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="notes"
                        className="text-white font-semibold text-lg flex items-center space-x-2"
                      >
                        <Star className="w-4 h-4 text-emerald-400" />
                        <span>Additional Notes</span>
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional observations, medications taken, or relevant details..."
                        className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl p-4 text-lg backdrop-blur-sm"
                        defaultValue={editingSymptom?.notes || ""}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex justify-end space-x-6 pt-6"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCloseForm}
                        className="border-slate-500 text-slate-300 hover:bg-slate-700 bg-transparent px-8 py-4 text-lg font-semibold rounded-2xl backdrop-blur-sm"
                      >
                        Cancel
                      </Button>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-2xl hover:shadow-emerald-500/25 px-8 py-4 text-lg font-semibold rounded-2xl relative overflow-hidden"
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                            animate={{
                              x: ["-100%", "100%"],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          {editingSymptom ? "Update Record" : "Save Record"}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

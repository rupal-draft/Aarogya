import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Stethoscope,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Eye,
  EyeOff,
  Zap,
  Star,
  Sparkles,
  Pill,
  Heart,
  Activity,
  Thermometer,
  Bandage,
  Lock,
  Unlock,
} from "lucide-react";

// Type definitions
interface DoctorNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  noteType: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  formattedCreatedAt: string;
  categoryBadgeColor: string;
  noteTypeBadgeColor: string;
  timeAgo: string;
  private: boolean;
  recent: boolean;
  urgent: boolean;
}

interface DoctorNotesTabProps {
  notesData: DoctorNote[];
}

// Helper function to get icon based on note type
const getNoteTypeIcon = (noteType: string) => {
  switch (noteType) {
    case "Prescription":
      return <Pill className="h-5 w-5" />;
    case "Observation":
      return <Eye className="h-5 w-5" />;
    case "Emergency Note":
      return <AlertCircle className="h-5 w-5" />;
    case "Consultation":
      return <Stethoscope className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Hematology":
      return <Activity className="h-4 w-4" />;
    case "Allergy & Immunology":
      return <Thermometer className="h-4 w-4" />;
    case "Infectious Diseases":
      return <Bandage className="h-4 w-4" />;
    case "Cardiology":
      return <Heart className="h-4 w-4" />;
    case "Preventive Care":
      return <Sparkles className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "bg-gradient-to-r from-red-600 to-rose-700 text-white";
    case "High":
      return "bg-gradient-to-r from-orange-500 to-amber-600 text-white";
    case "Medium":
      return "bg-gradient-to-r from-yellow-500 to-amber-500 text-white";
    case "Low":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-500 to-slate-600 text-white";
  }
};

// Helper function to get note type color
const getNoteTypeColor = (noteType: string) => {
  switch (noteType) {
    case "Prescription":
      return "from-blue-500 to-cyan-600";
    case "Observation":
      return "from-purple-500 to-indigo-600";
    case "Emergency Note":
      return "from-red-500 to-rose-600";
    case "Consultation":
      return "from-green-500 to-emerald-600";
    default:
      return "from-gray-500 to-slate-600";
  }
};

// Helper function to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Hematology":
      return "bg-gradient-to-r from-red-400 to-pink-500 text-white";
    case "Allergy & Immunology":
      return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white";
    case "Infectious Diseases":
      return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
    case "Cardiology":
      return "bg-gradient-to-r from-rose-400 to-red-500 text-white";
    case "Preventive Care":
      return "bg-gradient-to-r from-cyan-400 to-blue-500 text-white";
    default:
      return "bg-gradient-to-r from-gray-400 to-slate-500 text-white";
  }
};

const DoctorNotesTab: React.FC<DoctorNotesTabProps> = ({ notesData }) => {
  const [filter, setFilter] = useState<
    "all" | "prescription" | "emergency" | "private"
  >("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "category">(
    "date"
  );
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  // Calculate stats
  const stats = {
    totalNotes: notesData.length,
    prescriptions: notesData.filter((n) => n.noteType === "Prescription")
      .length,
    emergencyNotes: notesData.filter((n) => n.noteType === "Emergency Note")
      .length,
    privateNotes: notesData.filter((n) => n.private).length,
  };

  // Filter notes based on selected filter
  const filteredNotes = notesData.filter((note) => {
    if (filter === "all") return true;
    if (filter === "prescription") return note.noteType === "Prescription";
    if (filter === "emergency") return note.noteType === "Emergency Note";
    if (filter === "private") return note.private;
    return true;
  });

  // Sort notes based on selected sort option
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "priority") {
      const priorityOrder = { Critical: 1, High: 2, Medium: 3, Low: 4 };
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    } else if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const statVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: i * 0.1,
      },
    }),
  };

  const toggleExpand = (id: string) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Animated background elements */}
      <div className="fixed top-0 right-0 -z-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity },
          }}
          className="bg-gradient-to-r from-blue-200 to-cyan-200 opacity-20 rounded-full w-96 h-96 blur-xl"
        />
      </div>

      <div className="fixed bottom-0 left-0 -z-10">
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 7, repeat: Infinity },
          }}
          className="bg-gradient-to-r from-indigo-200 to-purple-200 opacity-20 rounded-full w-80 h-80 blur-xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg mb-4">
          <Sparkles className="h-5 w-5" />
          <h1 className="text-3xl font-bold">Doctor Notes</h1>
          <Sparkles className="h-5 w-5" />
        </div>
        <p className="text-slate-700 font-medium">
          Medical notes and observations from healthcare providers
        </p>
      </motion.div>

      {/* Stats Overview - Horizontal Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            title: "Total Notes",
            value: stats.totalNotes,
            icon: <FileText className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-slate-600 to-blue-600",
            custom: 0,
          },
          {
            title: "Prescriptions",
            value: stats.prescriptions,
            icon: <Pill className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
            custom: 1,
          },
          {
            title: "Emergency",
            value: stats.emergencyNotes,
            icon: <AlertCircle className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-red-500 to-rose-500",
            custom: 2,
          },
          {
            title: "Private",
            value: stats.privateNotes,
            icon: <Lock className="h-6 w-6" />,
            bg: "bg-gradient-to-r from-purple-500 to-indigo-500",
            custom: 3,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            className={`rounded-2xl p-5 text-white shadow-lg ${stat.bg} overflow-hidden relative`}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            custom={stat.custom}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            {/* Animated sparkles */}
            <motion.div
              className="absolute top-2 right-2"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <Star className="h-4 w-4 text-yellow-200" fill="currentColor" />
            </motion.div>

            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl mr-4 backdrop-blur-sm">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm opacity-90">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Sorting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md"
      >
        <div className="flex flex-wrap gap-2">
          {[
            {
              key: "all",
              label: "All Notes",
              color: "bg-gradient-to-r from-slate-600 to-blue-600",
            },
            {
              key: "prescription",
              label: "Prescriptions",
              color: "bg-gradient-to-r from-blue-500 to-cyan-500",
            },
            {
              key: "emergency",
              label: "Emergency",
              color: "bg-gradient-to-r from-red-500 to-rose-500",
            },
            {
              key: "private",
              label: "Private",
              color: "bg-gradient-to-r from-purple-500 to-indigo-500",
            },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => setFilter(btn.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium text-white shadow-md ${
                filter === btn.key
                  ? btn.color
                  : "bg-gradient-to-r from-gray-400 to-slate-400"
              }`}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white py-2 px-4 rounded-full shadow-sm">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            className="bg-transparent py-1 text-sm focus:outline-none focus:ring-0"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "date" | "priority" | "category")
            }
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="category">Category</option>
          </select>
        </div>
      </motion.div>

      {/* Notes Grid Layout */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {sortedNotes.map((note) => (
            <motion.div
              key={note.id}
              variants={itemVariants}
              layout
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border-0 relative"
            >
              {/* Note type accent bar */}
              <div
                className={`h-2 bg-gradient-to-r ${getNoteTypeColor(
                  note.noteType
                )}`}
              />

              {/* Private note indicator */}
              {note.private && (
                <motion.div
                  className="absolute top-4 right-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Private
                  </div>
                </motion.div>
              )}

              {/* Urgent note indicator */}
              {note.urgent && (
                <motion.div
                  className="absolute top-14 right-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Urgent
                  </div>
                </motion.div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${getNoteTypeColor(
                        note.noteType
                      )} text-white`}
                    >
                      {getNoteTypeIcon(note.noteType)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {note.title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      note.priority
                    )} shadow-sm`}
                  >
                    {note.priority} Priority
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                      note.category
                    )} shadow-sm`}
                  >
                    {getCategoryIcon(note.category)}
                    <span className="ml-1">{note.category}</span>
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <User className="h-3 w-3 mr-1" />
                    {note.doctorName}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600 line-clamp-3">{note.content}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {note.timeAgo}
                    </span>
                    {note.private ? (
                      <span className="flex items-center text-purple-600">
                        <Lock className="h-4 w-4 mr-1" />
                        Private
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <Unlock className="h-4 w-4 mr-1" />
                        Shared
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleExpand(note.id)}
                    className="px-3 py-1 bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 text-slate-700 rounded-lg text-xs font-medium transition-all shadow-sm flex items-center gap-1"
                  >
                    {expandedNote === note.id ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        View Details
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expandedNote === note.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Full Note Details
                        </h4>
                        <p className="text-blue-700">{note.content}</p>
                        <div className="mt-3 flex items-center text-xs text-blue-600">
                          <Clock className="h-3 w-3 mr-1" />
                          Created: {new Date(note.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {sortedNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border-0 mt-6 col-span-full"
        >
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No notes found
          </h3>
          <p className="text-gray-500">Try changing your filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorNotesTab;

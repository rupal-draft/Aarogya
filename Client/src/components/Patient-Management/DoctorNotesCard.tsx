import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { DoctorNote } from "../../types/patientManagement";

interface DoctorNotesCardProps {
  notes: DoctorNote[];
}

export const DoctorNotesCard: React.FC<DoctorNotesCardProps> = ({ notes }) => {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  const toggleNote = (noteId: string) => {
    setExpandedNotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "emergency note":
        return "bg-red-50 border-red-200";
      case "prescription":
        return "bg-blue-50 border-blue-200";
      case "consultation":
        return "bg-green-50 border-green-200";
      case "observation":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FileText className="w-6 h-6 text-blue-500" />
        Recent Doctor Notes
        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
          {notes.length}
        </span>
      </h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className={`rounded-xl p-4 border-2 ${getTypeColor(note.noteType)}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {note.title}
                  </h3>
                  {note.isUrgent && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </motion.div>
                  )}
                  {note.isPrivate && <Eye className="w-4 h-4 text-gray-500" />}
                </div>

                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      note.priority
                    )}`}
                  >
                    {note.priority} Priority
                  </span>
                  <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                    {note.noteType}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleNote(note.id)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                {expandedNotes.has(note.id) ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            <AnimatePresence>
              {expandedNotes.has(note.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(note.createdAt).toLocaleDateString()} at{" "}
                {new Date(note.createdAt).toLocaleTimeString()}
              </span>
              <span className="font-medium">{note.doctorName}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

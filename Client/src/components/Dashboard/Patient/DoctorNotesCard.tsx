import React from "react";
import { motion } from "framer-motion";
import { FileText, User, Clock, AlertTriangle, Lock } from "lucide-react";
import type { DoctorNote } from "../../../types/patient";

interface DoctorNotesCardProps {
  notes: DoctorNote[];
  index: number;
}

export const DoctorNotesCard: React.FC<DoctorNotesCardProps> = ({
  notes,
  index,
}) => {
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

  const getNoteTypeColor = (noteType: string) => {
    switch (noteType.toLowerCase()) {
      case "prescription":
        return "bg-blue-100 text-blue-800";
      case "observation":
        return "bg-green-100 text-green-800";
      case "emergency note":
        return "bg-red-100 text-red-800";
      case "consultation":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Recent Doctor Notes</h3>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {notes.filter((n) => n.recent).length} Recent
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note, noteIndex) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 + noteIndex * 0.05,
            }}
            className={`rounded-xl p-4 border-l-4 ${
              note.urgent
                ? "bg-red-50 border-red-500"
                : note.private
                ? "bg-blue-50 border-blue-500"
                : "bg-gray-50 border-gray-500"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {note.urgent ? (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  ) : note.private ? (
                    <Lock className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{note.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getNoteTypeColor(
                        note.noteType
                      )}`}
                    >
                      {note.noteType}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        note.priority
                      )}`}
                    >
                      {note.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <User className="w-4 h-4" />
                  <span>{note.doctorName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{note.timeAgo}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
              <p className="text-sm text-gray-700">{note.content}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Category: {note.category}</span>
              <span>
                {new Date(note.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No recent doctor notes</p>
        </div>
      )}
    </motion.div>
  );
};

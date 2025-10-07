// components/Patient-Management/DoctorNotesCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  User,
  Lock,
  Bell,
} from "lucide-react";
import type { DoctorNote } from "../../types/patientManagement";
import type {
  CreateDoctorNoteRequest,
  UpdateDoctorNoteRequest,
} from "../../types/patientDashboard";
import { doctorNotesService } from "../../Services/Patient/doctorNotesService";

interface DoctorNotesCardProps {
  notes: DoctorNote[];
  onViewAll?: () => void;
  totalCount?: number;
  onDataUpdate?: () => void;
  patientId?: string;
  doctorId?: string;
  doctorName?: string;
}

export const DoctorNotesCard: React.FC<DoctorNotesCardProps> = ({
  notes,
  onViewAll,
  totalCount = 0,
  onDataUpdate,
  patientId,
  doctorId,
  doctorName,
}) => {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateDoctorNoteRequest>>(
    {}
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  const showViewAll = totalCount > 3;

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

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
    switch (priority?.toLowerCase()) {
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
    switch (type?.toLowerCase()) {
      case "emergency note":
        return "bg-red-50 border-red-200";
      case "prescription":
        return "bg-blue-50 border-blue-200";
      case "consultation":
        return "bg-green-50 border-green-200";
      case "observation":
        return "bg-purple-50 border-purple-200";
      case "progress note":
        return "bg-indigo-50 border-indigo-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Start editing a note
  const startEdit = (note: DoctorNote) => {
    setEditingNote(note.id);
    setFormData({
      noteType: note.noteType,
      title: note.title,
      content: note.content,
      category: "",
      priority: note.priority,
      isPrivate: note.isPrivate,
      isUrgent: note.isUrgent,
      doctorName: note.doctorName,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingNote(null);
    setFormData({});
  };

  // Start adding new note
  const startAdd = () => {
    setIsAdding(true);
    setFormData({
      noteType: "consultation",
      title: "",
      content: "",
      category: "general",
      priority: "medium",
      isPrivate: false,
      isUrgent: false,
      doctorName: doctorName,
    });
  };

  // Cancel adding
  const cancelAdd = () => {
    setIsAdding(false);
    setFormData({});
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save note (create or update)
  const saveNote = async () => {
    if (!formData.title || !formData.content || !formData.noteType) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(editingNote || "new");

    try {
      if (editingNote) {
        // Update existing note
        const updateRequest: UpdateDoctorNoteRequest = {
          noteType: formData.noteType,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          priority: formData.priority,
          isPrivate: formData.isPrivate,
          isUrgent: formData.isUrgent,
        };

        await doctorNotesService.updateDoctorNote(
          patientId,
          editingNote,
          updateRequest
        );
      } else {
        // Create new note
        const createRequest: CreateDoctorNoteRequest = {
          patientId,
          doctorId,
          doctorName: formData.doctorName,
          noteType: formData.noteType!,
          title: formData.title!,
          content: formData.content!,
          category: formData.category,
          priority: formData.priority,
          isPrivate: formData.isPrivate,
          isUrgent: formData.isUrgent,
        };

        await doctorNotesService.createDoctorNote(createRequest);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingNote(null);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving doctor note:", error);
      alert("Error saving doctor note. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete note
  const deleteNote = async (noteId: string) => {
    setLoading(noteId);

    try {
      await doctorNotesService.deleteDoctorNote(patientId, noteId);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting doctor note:", error);
      alert("Error deleting doctor note. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Toggle urgent status
  const toggleUrgentStatus = async (noteId: string, currentStatus: boolean) => {
    setLoading(`${noteId}-urgent`);

    try {
      await doctorNotesService.updateDoctorNote(patientId, noteId, {
        isUrgent: !currentStatus,
      });

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating urgent status:", error);
      alert("Error updating urgent status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Toggle private status
  const togglePrivateStatus = async (
    noteId: string,
    currentStatus: boolean
  ) => {
    setLoading(`${noteId}-private`);

    try {
      await doctorNotesService.updateDoctorNote(patientId, noteId, {
        isPrivate: !currentStatus,
      });

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating private status:", error);
      alert("Error updating private status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-500" />
          Recent Doctor Notes
          <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full ml-2">
            {totalCount}
          </span>
        </h2>

        <div className="flex items-center gap-2">
          {showViewAll && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewAll}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
              View All
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAdd}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Note
          </motion.button>
        </div>
      </div>

      {/* Add New Note Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">
                Add New Doctor Note
              </h3>
              <button
                onClick={cancelAdd}
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Note title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Type *
                </label>
                <select
                  value={formData.noteType || ""}
                  onChange={(e) =>
                    handleInputChange("noteType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="progress note">Progress Note</option>
                  <option value="prescription">Prescription</option>
                  <option value="observation">Observation</option>
                  <option value="emergency note">Emergency Note</option>
                  <option value="discharge summary">Discharge Summary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category || ""}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="symptoms">Symptoms</option>
                  <option value="diagnosis">Diagnosis</option>
                  <option value="treatment">Treatment</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="medication">Medication</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority || ""}
                  onChange={(e) =>
                    handleInputChange("priority", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your notes here..."
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent || false}
                    onChange={(e) =>
                      handleInputChange("isUrgent", e.target.checked)
                    }
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Bell className="w-4 h-4 text-red-500" />
                    Urgent
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate || false}
                    onChange={(e) =>
                      handleInputChange("isPrivate", e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Lock className="w-4 h-4 text-blue-500" />
                    Private
                  </span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={cancelAdd}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading === "new"}
                >
                  Cancel
                </button>
                <button
                  onClick={saveNote}
                  disabled={loading === "new"}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "new" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Add Note
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {notes.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-gray-500">
            No doctor notes found. Click "Add Note" to create one.
          </div>
        ) : (
          notes.map((note, index) => (
            <motion.div
              key={note.id}
              className={`rounded-xl p-4 border-2 ${getTypeColor(
                note.noteType
              )}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {editingNote === note.id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Edit Note
                    </h3>
                    <button
                      onClick={cancelEdit}
                      className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority || ""}
                        onChange={(e) =>
                          handleInputChange("priority", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content *
                    </label>
                    <textarea
                      value={formData.content || ""}
                      onChange={(e) =>
                        handleInputChange("content", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={loading === note.id}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveNote}
                      disabled={loading === note.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                      {loading === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {safeValue(note.title)}
                        </h3>
                        {note.isUrgent && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </motion.div>
                        )}
                        {note.isPrivate && (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            note.priority
                          )}`}
                        >
                          {safeValue(note.priority)} Priority
                        </span>
                        <span className="px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                          {safeValue(note.noteType)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            toggleUrgentStatus(note.id, note.isUrgent)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            note.isUrgent
                              ? "text-red-600 bg-red-100 hover:bg-red-200"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={
                            note.isUrgent ? "Mark as Normal" : "Mark as Urgent"
                          }
                          disabled={loading === `${note.id}-urgent`}
                        >
                          {loading === `${note.id}-urgent` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Bell className="w-4 h-4" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            togglePrivateStatus(note.id, note.isPrivate)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            note.isPrivate
                              ? "text-blue-600 bg-blue-100 hover:bg-blue-200"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={
                            note.isPrivate ? "Make Public" : "Make Private"
                          }
                          disabled={loading === `${note.id}-private`}
                        >
                          {loading === `${note.id}-private` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(note)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Note"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowDeleteConfirm(note.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <button
                        onClick={() => toggleNote(note.id)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors ml-2"
                      >
                        {expandedNotes.has(note.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
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
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {safeValue(note.content)}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleDateString()
                        : "N/A"}{" "}
                      at{" "}
                      {note.createdAt
                        ? new Date(note.createdAt).toLocaleTimeString()
                        : "N/A"}
                    </span>
                    <span className="font-medium flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {safeValue(note.doctorName)}
                    </span>
                  </div>
                </>
              )}

              {/* Delete Confirmation Modal */}
              <AnimatePresence>
                {showDeleteConfirm === note.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-white rounded-xl p-6 m-4 max-w-sm w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Delete Note
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Are you sure you want to delete the note{" "}
                        <strong>"{note.title}"</strong>? This action cannot be
                        undone.
                      </p>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={loading === note.id}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          disabled={loading === note.id}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                        >
                          {loading === note.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

// components/Patient-Management/EmergencyContactCard.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Users,
  PhoneCall,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  Loader2,
  Star,
  User,
  Home,
} from "lucide-react";
import type { EmergencyContact } from "../../types/patientManagement";
import type {
  CreateEmergencyContactRequest,
  UpdateEmergencyContactRequest,
} from "../../types/patientDashboard";
import { emergencyContactsService } from "../../Services/Patient/emergencyContactsService";

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onDataUpdate?: () => void;
  patientId: string;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  onDataUpdate,
  patientId,
}) => {
  const [editingContact, setEditingContact] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState(!contact);
  const [loading, setLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Partial<CreateEmergencyContactRequest>
  >({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  // Start editing contact
  const startEdit = () => {
    setEditingContact(true);
    setFormData({
      contactName: contact?.contactName || "",
      relationship: contact?.relationship || "",
      phoneNumber: contact?.phoneNumber || "",
      secondaryPhone: contact?.secondaryPhone || "",
      email: contact?.email || "",
      address: contact?.address || "",
      notes: "",
      isPrimary: contact?.isPrimary || false,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingContact(false);
    setIsAdding(!contact);
    setFormData({});
  };

  // Start adding new contact
  const startAdd = () => {
    setIsAdding(true);
    setEditingContact(true);
    setFormData({
      contactName: "",
      relationship: "",
      phoneNumber: "",
      secondaryPhone: "",
      email: "",
      address: "",
      notes: "",
      isPrimary: false,
    });
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save contact (create or update)
  const saveContact = async () => {
    if (
      !formData.contactName ||
      !formData.relationship ||
      !formData.phoneNumber
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading("saving");

    try {
      if (contact?.id) {
        // Update existing contact
        const updateRequest: UpdateEmergencyContactRequest = {
          contactName: formData.contactName,
          relationship: formData.relationship,
          phoneNumber: formData.phoneNumber,
          secondaryPhone: formData.secondaryPhone,
          email: formData.email,
          address: formData.address,
          notes: formData.notes,
          isPrimary: formData.isPrimary,
        };

        await emergencyContactsService.updateEmergencyContact(
          contact.id,
          updateRequest
        );
      } else {
        // Create new contact
        const createRequest: CreateEmergencyContactRequest = {
          contactName: formData.contactName!,
          relationship: formData.relationship!,
          phoneNumber: formData.phoneNumber!,
          secondaryPhone: formData.secondaryPhone,
          email: formData.email,
          address: formData.address,
          notes: formData.notes,
          isPrimary: formData.isPrimary || false,
        };

        await emergencyContactsService.createEmergencyContact(createRequest);
      }

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      // Reset form
      setEditingContact(false);
      setIsAdding(false);
      setFormData({});
    } catch (error) {
      console.error("Error saving emergency contact:", error);
      alert("Error saving emergency contact. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Delete contact
  const deleteContact = async () => {
    if (!contact?.id) return;

    setLoading("deleting");

    try {
      await emergencyContactsService.deleteEmergencyContact(contact.id);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }

      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting emergency contact:", error);
      alert("Error deleting emergency contact. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Set as primary contact
  const setAsPrimary = async () => {
    if (!contact?.id) return;

    setLoading("primary");

    try {
      await emergencyContactsService.setPrimaryContact(contact.id);

      // Refresh data
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error setting primary contact:", error);
      alert("Error setting primary contact. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const toggleActiveStatus = async () => {
    if (!contact?.id) return;

    setLoading("status");

    try {
      await emergencyContactsService.partialUpdateEmergencyContact(contact.id, {
        isActive: !contact.isActive,
      });

      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error("Error updating contact status:", error);
      alert("Error updating contact status. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (!contact && !isAdding) {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Emergency Contact
          </h3>
          <p className="text-gray-600 mb-4">
            Add an emergency contact for this patient
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            Add Emergency Contact
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          Emergency Contact
          {contact?.isPrimary && (
            <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full ml-2">
              Primary
            </span>
          )}
        </h2>

        {!editingContact && contact && (
          <div className="flex items-center gap-2">
            {!contact.isPrimary && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={setAsPrimary}
                disabled={loading === "primary"}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                title="Set as Primary"
              >
                {loading === "primary" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
                Set Primary
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startEdit}
              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </motion.button>
          </div>
        )}
      </div>

      {editingContact ? (
        // Edit/Add Form
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">
              {contact ? "Edit Emergency Contact" : "Add Emergency Contact"}
            </h3>
            <button
              onClick={cancelEdit}
              className="p-1 hover:bg-blue-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-blue-600" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.contactName || ""}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship *
              </label>
              <select
                value={formData.relationship || ""}
                onChange={(e) =>
                  handleInputChange("relationship", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Friend</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Phone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={formData.phoneNumber || ""}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Primary phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Phone
              </label>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  value={formData.secondaryPhone || ""}
                  onChange={(e) =>
                    handleInputChange("secondaryPhone", e.target.value)
                  }
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Secondary phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Home address"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional notes about this contact..."
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPrimary || false}
                onChange={(e) =>
                  handleInputChange("isPrimary", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" />
                Set as Primary Contact
              </span>
            </label>

            <div className="flex gap-2">
              {contact && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </motion.button>
              )}
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={loading === "saving"}
              >
                Cancel
              </button>
              <button
                onClick={saveContact}
                disabled={loading === "saving"}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading === "saving" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {contact ? "Save Changes" : "Add Contact"}
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        // Display Mode
        <motion.div
          className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-100"
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Users className="w-8 h-8 text-red-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900">
              {safeValue(contact?.contactName)}
            </h3>
            <p className="text-red-600 font-medium">
              {safeValue(contact?.relationship)}
            </p>

            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={toggleActiveStatus}
                disabled={loading === "status"}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  contact?.isActive
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } transition-colors`}
              >
                {loading === "status" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : contact?.isActive ? (
                  "Active"
                ) : (
                  "Inactive"
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Phone className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900">
                  {safeValue(contact?.phoneNumber)}
                </p>
                <p className="text-sm text-gray-600">Primary Phone</p>
              </div>
            </motion.div>

            {contact?.secondaryPhone && (
              <motion.div
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <PhoneCall className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {safeValue(contact.secondaryPhone)}
                  </p>
                  <p className="text-sm text-gray-600">Secondary Phone</p>
                </div>
              </motion.div>
            )}

            {contact?.email && (
              <motion.div
                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {safeValue(contact.email)}
                  </p>
                  <p className="text-sm text-gray-600">Email Address</p>
                </div>
              </motion.div>
            )}

            {contact?.address && (
              <motion.div
                className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {safeValue(contact.address)}
                  </p>
                  <p className="text-sm text-gray-600">Home Address</p>
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            className="mt-6 p-3 bg-red-100 rounded-lg border border-red-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-red-800 text-sm text-center font-medium">
              ⚡ Contact immediately in case of emergency
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 m-4 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Emergency Contact
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the emergency contact for{" "}
                <strong>{contact?.contactName}</strong>? This action cannot be
                undone.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={loading === "deleting"}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteContact}
                  disabled={loading === "deleting"}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {loading === "deleting" ? (
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
  );
};

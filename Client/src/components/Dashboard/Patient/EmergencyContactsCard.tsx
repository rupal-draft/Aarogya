import React from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  User,
  Star,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { EmergencyContact } from "../../../types/patient";

interface EmergencyContactsCardProps {
  contacts: EmergencyContact[];
  index: number;
}

export const EmergencyContactsCard: React.FC<EmergencyContactsCardProps> = ({
  contacts,
  index,
}) => {
  const getRelationshipColor = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case "spouse":
        return "bg-pink-100 text-pink-800";
      case "mother":
      case "father":
        return "bg-blue-100 text-blue-800";
      case "sister":
      case "brother":
        return "bg-green-100 text-green-800";
      case "friend":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case "spouse":
        return "💑";
      case "mother":
        return "👩";
      case "father":
        return "👨";
      case "sister":
        return "👩‍🦱";
      case "brother":
        return "👨‍🦱";
      case "friend":
        return "👥";
      default:
        return "👤";
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
        <h3 className="text-xl font-bold text-gray-900">Emergency Contacts</h3>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-600">
            {contacts.filter((c) => c.primary).length} Primary /{" "}
            {contacts.length} Total
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, contactIndex) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1 + contactIndex * 0.05,
            }}
            className={`rounded-xl p-4 border-l-4 ${
              contact.primary
                ? "bg-blue-50 border-blue-500"
                : "bg-gray-50 border-gray-300"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {getRelationshipIcon(contact.relationship)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    {contact.fullName}
                    {contact.primary && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(
                      contact.relationship
                    )}`}
                  >
                    {contact.relationship}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contact.hasCompleteInfo ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contact.primaryPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Primary:</span>
                    <span className="font-medium text-gray-900">
                      {contact.primaryPhone}
                    </span>
                  </div>
                )}
                {contact.secondaryPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Secondary:</span>
                    <span className="font-medium text-gray-900">
                      {contact.secondaryPhone}
                    </span>
                  </div>
                )}
              </div>

              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">
                    {contact.email}
                  </span>
                </div>
              )}

              {contact.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium text-gray-900">
                      {contact.address}
                    </p>
                  </div>
                </div>
              )}

              {contact.notes && (
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    Notes:
                  </p>
                  <p className="text-sm text-gray-700">{contact.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No emergency contacts added</p>
        </div>
      )}
    </motion.div>
  );
};

import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Users, PhoneCall } from "lucide-react";
import type { EmergencyContact } from "../../types/patientManagement";

interface EmergencyContactCardProps {
  contact: EmergencyContact;
}

export const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
}) => {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-500" />
        Emergency Contact
        {contact.isPrimary && (
          <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full ml-2">
            Primary
          </span>
        )}
      </h2>

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
            {contact.contactName}
          </h3>
          <p className="text-red-600 font-medium">{contact.relationship}</p>
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
                {contact.phoneNumber}
              </p>
              <p className="text-sm text-gray-600">Primary Phone</p>
            </div>
          </motion.div>

          {contact.secondaryPhone && (
            <motion.div
              className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <PhoneCall className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900">
                  {contact.secondaryPhone}
                </p>
                <p className="text-sm text-gray-600">Secondary Phone</p>
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Mail className="w-5 h-5 text-purple-500" />
            <div>
              <p className="font-semibold text-gray-900">{contact.email}</p>
              <p className="text-sm text-gray-600">Email Address</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">{contact.address}</p>
              <p className="text-sm text-gray-600">Home Address</p>
            </div>
          </motion.div>
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
    </motion.div>
  );
};

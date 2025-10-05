// components/Patient-Management/PatientHeader.tsx
import React from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Calendar, Droplets } from "lucide-react";
import type { Patient } from "../../types/patientManagement";

interface PatientHeaderProps {
  patient: Patient;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const safeValue = (val: any, fallback: string = "N/A") =>
    val !== undefined && val !== null ? val : fallback;

  const age = patient?.dateOfBirth
    ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
    : "N/A";

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-center gap-6">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={safeValue(patient?.imageUrl, "/default-avatar.png")}
            alt={`${safeValue(patient?.firstName)} ${safeValue(
              patient?.lastName
            )}`}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
          />
          <motion.div
            className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <motion.h1
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {safeValue(patient?.firstName)} {safeValue(patient?.lastName)}
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <motion.div
              className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <User className="w-4 h-4 text-blue-500" />
              <span>Age: {safeValue(age)} years</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Droplets className="w-4 h-4 text-red-500" />
              <span>Blood: {safeValue(patient?.bloodGroup)}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Calendar className="w-4 h-4 text-green-500" />
              <span>Gender: {safeValue(patient?.gender)}</span>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <motion.div
              className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Phone className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{safeValue(patient?.phone)}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Mail className="w-4 h-4 text-purple-500" />
              <span className="text-sm">{safeValue(patient?.email)}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm truncate">
                {safeValue(patient?.address)}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Thermometer,
  Activity,
  Droplets,
  Weight,
  Ruler,
} from "lucide-react";
import type { LatestVitals } from "../../types/patientManagement";
import { AnimatedCounter } from "../../common/Counter/AnimatedCounter2";

interface VitalsCardProps {
  vitals: LatestVitals;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ vitals }) => {
  const safeValue = (val: any, fallback: string = "NA") =>
    val !== undefined && val !== null ? val : fallback;

  const vitalsData = [
    {
      label: "Blood Pressure",
      value:
        vitals.bloodPressureSystolic !== undefined &&
        vitals.bloodPressureDiastolic !== undefined
          ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`
          : "-/-",
      unit: "mmHg",
      icon: Heart,
      color: "text-red-500",
      bgColor: "bg-red-50",
      normal:
        vitals.bloodPressureSystolic !== undefined &&
        vitals.bloodPressureDiastolic !== undefined &&
        vitals.bloodPressureSystolic <= 120 &&
        vitals.bloodPressureDiastolic <= 80,
    },
    {
      label: "Heart Rate",
      value: safeValue(vitals.heartRate),
      unit: "bpm",
      icon: Activity,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      normal:
        vitals.heartRate !== undefined &&
        vitals.heartRate >= 60 &&
        vitals.heartRate <= 100,
    },
    {
      label: "Temperature",
      value: safeValue(vitals.temperature),
      unit: "°C",
      icon: Thermometer,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      normal:
        vitals.temperature !== undefined &&
        vitals.temperature >= 36.1 &&
        vitals.temperature <= 37.2,
    },
    {
      label: "Oxygen Saturation",
      value: safeValue(vitals.oxygenSaturation),
      unit: "%",
      icon: Droplets,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      normal:
        vitals.oxygenSaturation !== undefined && vitals.oxygenSaturation >= 95,
    },
    {
      label: "Weight",
      value: safeValue(vitals.weight),
      unit: "kg",
      icon: Weight,
      color: "text-green-500",
      bgColor: "bg-green-50",
      normal: true,
    },
    {
      label: "BMI",
      value: safeValue(vitals.bmi),
      unit: "",
      icon: Ruler,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      normal:
        vitals.bmi !== undefined && vitals.bmi >= 18.5 && vitals.bmi <= 24.9,
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-500" />
        Latest Vitals
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {vitalsData.map((vital, index) => {
          const Icon = vital.icon;
          return (
            <motion.div
              key={vital.label}
              className={`${vital.bgColor} rounded-xl p-4 border border-opacity-20`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 ${vital.color}`} />
                {vital.normal ? (
                  <motion.div
                    className="w-3 h-3 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                ) : (
                  <motion.div
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {typeof vital.value === "number" ? (
                  <AnimatedCounter
                    value={vital.value}
                    decimals={1}
                    suffix={vital.unit}
                  />
                ) : (
                  <span>
                    {vital.value !== undefined && vital.value !== null
                      ? `${vital.value}${vital.unit}`
                      : "NA"}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">{vital.label}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="bg-gray-50 rounded-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="font-semibold text-gray-900 mb-2">Recorded by</h3>
        <p className="text-gray-600 text-sm">
          {safeValue(vitals.recordedBy)} ({safeValue(vitals.recordedByType)})
        </p>
        <p className="text-gray-600 text-sm">
          {vitals.recordedAt
            ? `${new Date(
                vitals.recordedAt
              ).toLocaleDateString()} at ${new Date(
                vitals.recordedAt
              ).toLocaleTimeString()}`
            : "NA"}
        </p>
        {vitals.notes && (
          <p className="text-gray-600 text-sm mt-2 italic">"{vitals.notes}"</p>
        )}
      </motion.div>
    </motion.div>
  );
};

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { LabTestResponse } from "../../types/lab";
import LabTestSearch from "../../components/Lab/LabTestSearch";
import LabOrderForm from "../../components/Lab/LabOrderForm";
import PatientLabOrders from "../../components/Lab/PatientLabOrders";

type LabStep = "search" | "booking" | "dashboard";

const LabManagement: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<LabStep>("search");
  const [selectedTests, setSelectedTests] = useState<LabTestResponse[]>([]);

  const handleTestToggle = (test: LabTestResponse) => {
    setSelectedTests((prev) => {
      const isSelected = prev.some((selected) => selected.id === test.id);
      if (isSelected) {
        return prev.filter((selected) => selected.id !== test.id);
      } else {
        return [...prev, test];
      }
    });
  };

  const handleContinueToBooking = () => {
    if (selectedTests.length > 0) {
      setCurrentStep("booking");
    }
  };

  const handleBookingComplete = () => {
    setSelectedTests([]);
    setCurrentStep("dashboard");
  };

  const handleBackToSearch = () => {
    setCurrentStep("search");
  };

  const handleBackToDashboard = () => {
    setCurrentStep("dashboard");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
        >
          {currentStep === "search" && (
            <LabTestSearch
              selectedTests={selectedTests}
              onTestToggle={handleTestToggle}
              onContinue={handleContinueToBooking}
            />
          )}

          {currentStep === "booking" && (
            <LabOrderForm
              selectedTests={selectedTests}
              onBack={handleBackToSearch}
              onComplete={handleBookingComplete}
            />
          )}

          {currentStep === "dashboard" && (
            <PatientLabOrders onBack={handleBackToSearch} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick Navigation */}
      {currentStep !== "search" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-8 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={
              currentStep === "booking"
                ? handleBackToSearch
                : handleBackToDashboard
            }
            className="bg-white shadow-2xl rounded-full p-4 flex items-center space-x-3 border border-gray-200 hover:shadow-3xl transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">
              {currentStep === "booking"
                ? "Back to Tests"
                : "Back to Dashboard"}
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 right-8 z-40 space-y-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentStep("search")}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            currentStep === "search"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 hover:bg-blue-50"
          }`}
        >
          🔍
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentStep("dashboard")}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            currentStep === "dashboard"
              ? "bg-green-500 text-white"
              : "bg-white text-gray-600 hover:bg-green-50"
          }`}
        >
          📊
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LabManagement;

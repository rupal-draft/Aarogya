"use client";

import React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import DashboardOverview from "../../components/Dashboard/Overview";
import GlassCard from "../../common/Cards/GlassCard";
import { DashboardTabs } from "../../Data/tabs";
import type { PatientDashboardData } from "../../types/dashboard";
import LoadingSpinner from "../../common/Spinners/LoadingSpinner";
import ErrorState from "../../common/Error/ErrorState";
import TabNavigation from "../../components/Dashboard/TabNavigation";

export const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(count + 1);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [count, value]);

  return <span>{count}</span>;
};

const TabContent = ({ activeTab, data }: { activeTab: string; data: any }) => {
  if (activeTab === "overview") {
    return <DashboardOverview data={data} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <GlassCard className="p-12 max-w-md mx-auto">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          className="p-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-full w-fit mx-auto mb-6"
        >
          {DashboardTabs.find((tab) => tab.id === activeTab)?.icon &&
            React.createElement(
              DashboardTabs.find((tab) => tab.id === activeTab)!.icon,
              {
                className: "w-12 h-12 text-white",
              }
            )}
        </motion.div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-700 to-blue-800 bg-clip-text text-transparent mb-4">
          {DashboardTabs.find((tab) => tab.id === activeTab)?.label}
        </h2>
        <p className="text-sky-600 text-lg">
          This section is coming soon! We're working hard to bring you
          comprehensive{" "}
          {DashboardTabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()}{" "}
          management.
        </p>
      </GlassCard>
    </motion.div>
  );
};

export default function PatientDashboard() {
  const [data, setData] = useState<PatientDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/patient/dashboard/complete-profile",
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setData(response.data);
    } catch (err: any) {
      console.error("Failed to load mock data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error && !data)
    return <ErrorState error={error} onRetry={fetchPatientData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-sky-300/20 to-blue-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/3 right-20 w-48 h-48 bg-gradient-to-r from-indigo-300/20 to-purple-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-cyan-300/20 to-teal-400/20 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            Your Health Dashboard
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto rounded-full"
          />
        </motion.div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabContent activeTab={activeTab} data={data} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

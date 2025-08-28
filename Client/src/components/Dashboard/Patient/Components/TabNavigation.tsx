"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTabs } from "../../../../Data/tabs";
import { Grid, X } from "lucide-react";

const TabNavigation = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50" ref={menuRef}>
      {/* Main Floating Button */}
      <motion.button
        onClick={toggleExpanded}
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-2xl ${
          isExpanded
            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
            : "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Grid className="w-6 h-6" />}
      </motion.button>

      {/* Expanded Tabs - Enhanced Layout */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full left-0 mb-4 bg-white/95 backdrop-blur-md border border-sky-200/60 rounded-2xl p-3 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-sky-800">
                Quick Navigation
              </h3>
              <motion.button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-sky-500 hover:text-sky-700 rounded-full hover:bg-sky-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Tabs Grid */}
            <div className="grid grid-cols-2 gap-2">
              {DashboardTabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => {
                        onTabChange(tab.id);
                        setIsExpanded(false);
                      }}
                      className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl transition-all duration-200 relative overflow-hidden group ${
                        isActive
                          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                          : "text-sky-700 bg-white hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 hover:text-sky-800 border border-sky-100/60"
                      }`}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}

                      {/* Glow effect for active tab */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-sky-400/30 to-blue-500/30 rounded-xl"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            isActive
                              ? "bg-white/20"
                              : "bg-sky-100 group-hover:bg-sky-200/50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium px-1 text-center leading-tight">
                          {tab.label}
                        </span>
                      </div>

                      {/* Active indicator dot */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </motion.button>

                    {/* Subtle hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/0 to-blue-500/0 group-hover:from-sky-400/10 group-hover:to-blue-500/10 pointer-events-none"
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Current active tab indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 pt-3 border-t border-sky-100/50"
            >
              <div className="text-xs text-sky-600 text-center">
                Current:{" "}
                <span className="font-semibold">
                  {DashboardTabs.find((tab) => tab.id === activeTab)?.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TabNavigation;

import { DashboardTabs } from "../../Data/tabs";
import { motion } from "framer-motion";

const TabNavigation = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-sky-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-xl border border-sky-200/50 rounded-3xl p-2 shadow-2xl mb-8"
  >
    <div className="flex flex-wrap gap-2">
      {DashboardTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-medium transition-all duration-300 relative overflow-hidden ${
              isActive
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg"
                : "text-sky-700 hover:bg-sky-100/50 hover:text-sky-800"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  </motion.div>
);

export default TabNavigation;

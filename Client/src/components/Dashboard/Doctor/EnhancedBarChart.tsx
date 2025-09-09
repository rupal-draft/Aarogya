import { motion } from "framer-motion";

export const EnhancedBarChart = ({
  data,
  color,
  title,
}: {
  data: { label: string; value: number }[];
  color: string;
  title?: string;
}) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-3">
      {title && (
        <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
      )}
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center"
        >
          <span className="text-xs text-gray-600 w-20 truncate">
            {item.label}
          </span>
          <div className="flex-1 ml-2 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className={`h-3 rounded-full ${color} relative overflow-hidden`}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
          <span className="text-xs text-gray-600 ml-2 w-8 text-right font-medium">
            {item.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

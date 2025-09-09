import { motion } from "framer-motion";

export const CategoryBadge = ({
  name,
  count,
  index,
}: {
  name: string;
  count: number;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ scale: 1.05 }}
    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
  >
    <span className="text-sm font-medium text-blue-800">{name}</span>
    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
      {count}
    </span>
  </motion.div>
);

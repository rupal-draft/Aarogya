import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ErrorState = ({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <div className="p-4 bg-red-100 rounded-full">
      <AlertCircle className="w-8 h-8 text-red-600" />
    </div>
    <p className="text-red-600 text-center">{error}</p>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onRetry}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Try Again
    </motion.button>
  </div>
);

export default ErrorState;

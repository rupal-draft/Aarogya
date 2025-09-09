import { motion } from "framer-motion";
import { Star } from "lucide-react";

export const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.div
        key={star}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: star * 0.1, type: "spring", stiffness: 100 }}
        whileHover={{ scale: 1.2, rotate: 10 }}
      >
        <Star
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : star === Math.ceil(rating) && rating % 1 > 0
              ? "text-yellow-400 fill-current opacity-50"
              : "text-gray-300"
          }`}
        />
      </motion.div>
    ))}
  </div>
);

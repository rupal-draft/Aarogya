import { motion } from "framer-motion";

export const TagCloud = ({
  tags,
}: {
  tags: { tag: string; count: number }[];
}) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag, index) => (
      <motion.span
        key={index}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.05, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 text-xs font-medium rounded-full border border-purple-200 cursor-pointer"
      >
        {tag.tag} ({tag.count})
      </motion.span>
    ))}
  </div>
);

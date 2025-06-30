import type React from "react"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"
const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      className="flex justify-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
        {/* Avatar */}
        <motion.div
          className="w-8 h-8 rounded-full glass-card flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          <Bot className="w-4 h-4 text-medical-600" />
        </motion.div>

        {/* Typing Animation */}
        <motion.div
          className="chat-message chat-message-assistant"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600 mr-2">AI is thinking</span>
            <div className="typing-dots">
              <motion.div
                className="typing-dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
              />
              <motion.div
                className="typing-dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              />
              <motion.div
                className="typing-dot"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator

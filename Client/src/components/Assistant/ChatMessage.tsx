import type React from "react"
import type { Message } from "../../types/assitant"
import { motion } from "framer-motion"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  message: Message
  index: number
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  const isUser = message.role === "user"

  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
      >
        {/* Avatar */}
        <motion.div
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
            isUser ? "medical-gradient" : "glass-card"
          }`}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-medical-600" />}
        </motion.div>

        {/* Message */}
        <motion.div
          className={`chat-message ${isUser ? "chat-message-user" : "chat-message-assistant"}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
          <div className={`text-xs mt-2 ${isUser ? "text-white/70" : "text-gray-500"}`}>
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ChatMessage

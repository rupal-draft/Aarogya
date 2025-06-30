"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Message } from "../../types/assitant"
import api from "../../Services/assistant"
import Card from "../../common/Ui/Card"
import Button from "../../common/Ui/Button"
import ChatMessage from "./ChatMessage"
import PredictionResults from "./PredictionResults"
import TypingIndicator from "./TypingIndicator"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Sparkles, Heart, Stethoscope, RefreshCw } from "lucide-react"
import ParticleBackground from "../../common/Backgrounds/ParticleBackground"


const ChatInterface: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [predictionResults, setPredictionResults] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    startNewChat()
  }, [])

  const startNewChat = async () => {
    setIsLoading(true)
    setError(null)
    setPredictionResults(null)

    try {
      const response = await api.startChat()

      if (response.data) {
        setSessionId(response.data.session_id)
        setMessages([
          {
            role: "assistant",
            content: response.data.message,
            timestamp: new Date().toISOString(),
          },
        ])
      } else {
        setError(response.error || "Failed to start chat")
      }
    } catch (err) {
      setError("Failed to connect to the medical assistant")
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (message: string) => {
    if (!sessionId || !message.trim()) return

    const userMessage: Message = {
      role: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)
    setSuggestions([])
    setError(null)

    try {
      const response = await api.sendMessage(sessionId, message.trim())

      if (response.data) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.data.message,
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setSuggestions(response.data.suggestions || [])

        // Handle prediction results
        if (response.data.prediction_triggered && response.data.predictions) {
          setPredictionResults({
            consultation_id: response.data.consultation_id,
            predictions: response.data.predictions,
            ai_recommendations: response.data.ai_recommendations,
          })
        }
      } else {
        setError(response.error || "Failed to send message")
      }
    } catch (err) {
      setError("Failed to send message")
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full relative overflow-hidden">
        <ParticleBackground />
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="medical-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Stethoscope className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h3
            className="text-2xl font-bold gradient-text mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Initializing AI Medical Assistant
          </motion.h3>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Preparing your personalized medical consultation...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <ParticleBackground />

      {/* Header */}
      <motion.div
        className="glass-card border-b border-white/20 px-6 py-4 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="medical-gradient w-12 h-12 rounded-full flex items-center justify-center shadow-glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">AI Medical Assistant</h1>
              <p className="text-sm text-gray-600">Powered by advanced AI technology</p>
            </div>
          </div>
          <Button variant="glass" size="sm" onClick={startNewChat} icon={<RefreshCw className="w-4 h-4" />}>
            New Chat
          </Button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-4 z-10">
        <AnimatePresence>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} index={index} />
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="danger-gradient w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">⚠️</span>
                  </div>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prediction Results */}
        <AnimatePresence>
          {predictionResults && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <PredictionResults results={predictionResults} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            className="px-6 py-2 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="glass-button px-3 py-1 rounded-full text-xs hover:bg-white/20 transition-all duration-200"
                  onClick={() => handleSuggestionClick(suggestion)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <motion.div
        className="glass-card border-t border-white/20 px-6 py-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
              disabled={isTyping}
            />
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              animate={{ rotate: isTyping ? 360 : 0 }}
              transition={{ duration: 1, repeat: isTyping ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-medical-500" />
            </motion.div>
          </div>
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            loading={isTyping}
            icon={<Send className="w-4 h-4" />}
            glow
          >
            Send
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default ChatInterface

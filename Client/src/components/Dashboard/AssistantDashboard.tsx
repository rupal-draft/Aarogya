"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { HealthStatus } from "../../types/assitant"
import api from "../../Services/assistant"
import Badge from "../../common/Ui/Badge"
import Button from "../../common/Ui/Button"
import Card from "../../common/Ui/Card"


interface DashboardProps {
  onStartChat: () => void
  onViewHistory: () => void
}

const Dashboard: React.FC<DashboardProps> = ({ onStartChat, onViewHistory }) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    try {
      const response = await api.checkHealth()
      if (response.data) {
        setHealthStatus(response.data)
      }
    } catch (error) {
      console.error("Failed to check system health:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "connected":
      case "loaded":
      case "healthy":
        return <Badge variant="low">✅ {status}</Badge>
      case "disconnected":
      case "not_loaded":
      case "unhealthy":
        return <Badge variant="high">❌ {status}</Badge>
      default:
        return <Badge variant="moderate">⚠️ {status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🏥 AI Medical Assistant</h1>
        <p className="text-xl text-gray-600 mb-8">Get instant medical guidance powered by advanced AI technology</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onStartChat} className="text-lg px-8 py-4">
            🩺 Start Medical Consultation
          </Button>
          <Button variant="secondary" size="lg" onClick={onViewHistory} className="text-lg px-8 py-4">
            📋 View Medical History
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
          <p className="text-gray-600 text-sm">
            Advanced machine learning algorithms analyze your symptoms to provide accurate medical insights.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-lg font-semibold mb-2">Conversational Interface</h3>
          <p className="text-gray-600 text-sm">
            Natural conversation flow makes it easy to describe your symptoms and get personalized advice.
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
          <p className="text-gray-600 text-sm">
            Get immediate medical guidance with detailed recommendations and risk assessments.
          </p>
        </Card>
      </div>

      {/* How It Works */}
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-medical-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-medical-600 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Describe Symptoms</h4>
            <p className="text-sm text-gray-600">Tell us about your symptoms in natural language</p>
          </div>

          <div className="text-center">
            <div className="bg-medical-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-medical-600 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">AI Analysis</h4>
            <p className="text-sm text-gray-600">Our AI analyzes your symptoms using medical knowledge</p>
          </div>

          <div className="text-center">
            <div className="bg-medical-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-medical-600 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Get Recommendations</h4>
            <p className="text-sm text-gray-600">Receive personalized medical advice and precautions</p>
          </div>

          <div className="text-center">
            <div className="bg-medical-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-medical-600 font-bold">4</span>
            </div>
            <h4 className="font-semibold mb-2">Take Action</h4>
            <p className="text-sm text-gray-600">Follow guidance and consult healthcare professionals</p>
          </div>
        </div>
      </Card>

      {/* System Status */}
      {healthStatus && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">🔧 System Status</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Status:</span>
              {getStatusBadge(healthStatus.status)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database:</span>
              {getStatusBadge(healthStatus.database)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ML Model:</span>
              {getStatusBadge(healthStatus.ml_model)}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">AI Service:</span>
              {getStatusBadge(healthStatus.ollama_service)}
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Last updated: {new Date(healthStatus.timestamp).toLocaleString()}
          </div>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start">
          <div className="text-yellow-600 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h3>
            <p className="text-yellow-700 text-sm">
              This AI assistant provides general medical information and should not replace professional medical advice.
              Always consult with qualified healthcare professionals for proper diagnosis and treatment. In case of
              emergency, contact your local emergency services immediately.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard

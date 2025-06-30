"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Consultation } from "../../types/assitant"
import api from "../../Services/assistant"
import LoadingSpinner from "../../common/Ui/LoadingSpinner"
import Card from "../../common/Ui/Card"
import Button from "../../common/Ui/Button"
import Badge from "../../common/Ui/Badge"


const MedicalHistory: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.getMedicalHistory(20)

      if (response.data) {
        setConsultations(response.data.consultations)
      } else {
        setError(response.error || "Failed to fetch medical history")
      }
    } catch (err) {
      setError("Failed to load medical history")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high":
        return "high"
      case "moderate":
        return "moderate"
      case "low":
        return "low"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading your medical history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-danger-50 border-danger-200">
        <div className="text-center">
          <div className="text-danger-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-danger-800 mb-2">Error Loading History</h3>
          <p className="text-danger-700 mb-4">{error}</p>
          <Button onClick={fetchHistory}>Try Again</Button>
        </div>
      </Card>
    )
  }

  if (consultations.length === 0) {
    return (
      <Card className="text-center">
        <div className="text-gray-400 text-6xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Medical History</h3>
        <p className="text-gray-600">
          You haven't had any consultations yet. Start a new chat to begin your medical assessment.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📋 Medical History</h2>
        <Button variant="secondary" onClick={fetchHistory}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {consultations.map((consultation) => (
          <Card key={consultation.consultation_id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{consultation.consultation_id}</h3>
                  <Badge variant={getRiskColor(consultation.risk_assessment)}>
                    {consultation.risk_assessment.toUpperCase()} RISK
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Symptoms</h4>
                    <div className="flex flex-wrap gap-1">
                      {consultation.symptoms.map((symptom, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {symptom.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Top Prediction</h4>
                    {consultation.predicted_diseases.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{consultation.predicted_diseases[0].disease}</span>
                        <span className="text-sm text-gray-600">
                          ({(consultation.predicted_diseases[0].confidence * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{formatDate(consultation.created_at)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedConsultation(
                        selectedConsultation?.consultation_id === consultation.consultation_id ? null : consultation,
                      )
                    }
                  >
                    {selectedConsultation?.consultation_id === consultation.consultation_id
                      ? "Hide Details"
                      : "View Details"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Detailed View */}
            {selectedConsultation?.consultation_id === consultation.consultation_id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* All Predictions */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">All Predictions</h4>
                    <div className="space-y-2">
                      {consultation.predicted_diseases.map((disease, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{disease.disease}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{(disease.confidence * 100).toFixed(1)}%</span>
                            <Badge variant={getRiskColor(disease.risk_level)} className="text-xs">
                              {disease.risk_level}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendations Summary */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">AI Recommendations</h4>
                    <div className="space-y-3">
                      {consultation.ai_recommendations.recommended_specialist && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Specialist:</span>
                          <p className="text-sm text-gray-600">
                            {consultation.ai_recommendations.recommended_specialist}
                          </p>
                        </div>
                      )}

                      {consultation.ai_recommendations.recovery_timeline && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Recovery Time:</span>
                          <p className="text-sm text-gray-600">{consultation.ai_recommendations.recovery_timeline}</p>
                        </div>
                      )}

                      <div>
                        <span className="text-sm font-medium text-gray-700">Doctor Urgency:</span>
                        <p className="text-sm text-gray-600">{consultation.doctor_recommendation.replace("_", " ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MedicalHistory

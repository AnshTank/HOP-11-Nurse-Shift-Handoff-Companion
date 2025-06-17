"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Clock,
  Pill,
  Shield,
  Calendar,
  Mic,
  Volume2,
  MessageCircle,
  Activity,
  AlertTriangle,
  Bed,
} from "lucide-react"
import type { PatientBasic, PatientStatus } from "@/types/patient-enhanced"

interface WarmPatientCardProps {
  patient: PatientBasic
  status: PatientStatus
  isSelected?: boolean
  onSelect: () => void
  onStartHandoff: () => void
}

// Mock additional patient details
const getPatientDetails = (patientId: string) => ({
  emergencyContact: {
    name: "Jane Johnson",
    relationship: "Daughter",
    phone: "(555) 123-4567",
  },
  insurance: {
    provider: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",
  },
  vitals: {
    temperature: 98.6,
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    lastTaken: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  medications: [
    { name: "Metoprolol", dosage: "25mg", frequency: "BID", nextDue: "2:00 PM" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Daily", nextDue: "8:00 AM" },
    { name: "Aspirin", dosage: "81mg", frequency: "Daily", nextDue: "8:00 AM" },
  ],
  dietRestrictions: ["Low sodium", "Diabetic"],
  fallRisk: "High",
  codeStatus: "Full Code",
  physician: "Dr. Sarah Williams",
  admittingDiagnosis: "Acute myocardial infarction",
  procedures: ["Cardiac catheterization", "Stent placement"],
  labResults: {
    lastDrawn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    pending: ["CBC", "BMP", "Troponin"],
    critical: ["Troponin elevated"],
  },
})

export function WarmPatientCard({ patient, status, isSelected, onSelect, onStartHandoff }: WarmPatientCardProps) {
  const [mood, setMood] = useState<"calm" | "anxious" | "pain" | null>(null)
  // Remove isExpanded state
  // const [isExpanded, setIsExpanded] = useState(false)

  const patientDetails = getPatientDetails(patient.id)

  const getPriorityRibbon = () => {
    if (patient.riskLevel === "critical" || patient.acuityLevel >= 4) {
      return "bg-gradient-to-r from-critical to-red-300"
    }
    if (patient.riskLevel === "high" || patient.acuityLevel === 3) {
      return "bg-gradient-to-r from-high to-orange-300"
    }
    return "bg-gradient-to-r from-stable to-green-300"
  }

  const getMoodColor = () => {
    switch (mood) {
      case "calm":
        return "bg-calm"
      case "anxious":
        return "bg-anxious"
      case "pain":
        return "bg-pain"
      default:
        return "bg-gray-200"
    }
  }

  const getMoodEmoji = () => {
    switch (mood) {
      case "calm":
        return "😌"
      case "anxious":
        return "😰"
      case "pain":
        return "😣"
      default:
        return "😐"
    }
  }

  const getTimeUntilNext = (nextTime?: string) => {
    if (!nextTime) return null
    const now = new Date()
    const next = new Date(nextTime)
    const diffMinutes = Math.floor((next.getTime() - now.getTime()) / (1000 * 60))

    if (diffMinutes < 0) return "Overdue"
    if (diffMinutes < 60) return `${diffMinutes}m`
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffHours > 0) return `${diffHours}h ago`
    return `${diffMinutes}m ago`
  }

  const getVitalStatus = (vital: string, value: number) => {
    const ranges = {
      temperature: { normal: [97, 99], low: 97, high: 99 },
      heartRate: { normal: [60, 100], low: 60, high: 100 },
      systolic: { normal: [90, 140], low: 90, high: 140 },
      diastolic: { normal: [60, 90], low: 60, high: 90 },
      respiratoryRate: { normal: [12, 20], low: 12, high: 20 },
      oxygenSaturation: { normal: [95, 100], low: 95, high: 100 },
    }

    const range = ranges[vital as keyof typeof ranges]
    if (!range) return "normal"

    if (value < range.low) return "low"
    if (value > range.high) return "high"
    return "normal"
  }

  const getVitalColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-green-600"
    }
  }

  return (
    <Card
      className={`
        relative overflow-hidden cursor-pointer transition-all duration-300 ease-out
        hover:shadow-warm hover:scale-[1.02] group h-full flex flex-col
        ${isSelected ? "ring-2 ring-primary shadow-warm scale-[1.02]" : "shadow-soft"}
        bg-gradient-to-br from-white to-primary-50/30
        border-0 rounded-3xl
        
      `}
      onClick={onSelect}
    >
      {/* Priority Ribbon */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${getPriorityRibbon()}`} />

      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Patient Name and Acuity */}
        <div className="flex items-start justify-between mb-1">
          {/* Patient Name and Mood */}
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{patient.name}</h3>

              {/* Mood Indicator */}
              <div className="flex items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full ${getMoodColor()} flex items-center justify-center text-xs cursor-pointer transition-all hover:scale-110`}
                  onClick={(e) => {
                    e.stopPropagation()
                    const moods: ("calm" | "anxious" | "pain")[] = ["calm", "anxious", "pain"]
                    const currentIndex = mood ? moods.indexOf(mood) : -1
                    const nextMood = moods[(currentIndex + 1) % moods.length]
                    setMood(nextMood)
                  }}
                  title="Click to set patient mood"
                >
                  {getMoodEmoji()}
                </div>
              </div>
            </div>

            {/* Primary Diagnosis */}
            <div className="text-xs text-gray-600 truncate mb-3">{patient.primaryDiagnosis}</div>
          </div>

          {/* Acuity Level - Smaller and Higher */}
          <div className="flex flex-col items-center flex-shrink-0 ml-2">
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white
                ${
                  patient.acuityLevel >= 4
                    ? "bg-gradient-to-br from-critical to-red-400"
                    : patient.acuityLevel === 3
                      ? "bg-gradient-to-br from-high to-orange-400"
                      : "bg-gradient-to-br from-stable to-green-400"
                }
              `}
            >
              {patient.acuityLevel}
            </div>
            <span className="text-xs text-gray-500 text-center">Acuity</span>
          </div>
        </div>

        {/* Room and Admission Date - Moved Down */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <Badge
            variant="outline"
            className="bg-white/80 border-primary-200 text-primary-700 rounded-xl px-3 flex-shrink-0"
          >
            Room {patient.room}
          </Badge>
          <span className="text-xs text-gray-500 flex-shrink-0">•</span>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Calendar className="h-3 w-3" />
            <span>Admitted {new Date(patient.admissionDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Status Indicators - Fixed Height */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {patient.hasAlerts && (
            <Badge className="bg-critical/20 text-critical-foreground border-critical/30 rounded-xl animate-pulse-soft">
              🚨 Alert
            </Badge>
          )}

          {status.hasCriticalLabs && (
            <Badge className="bg-warning/20 text-warning-foreground border-warning/30 rounded-xl">
              🧪 Critical Labs
            </Badge>
          )}

          {status.hasNewOrders && (
            <Badge className="bg-primary/20 text-primary-foreground border-primary/30 rounded-xl">📋 New Orders</Badge>
          )}

          {patient.requiresFollowUp && (
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30 rounded-xl">📅 Follow-up</Badge>
          )}

          {patient.isPendingDischarge && (
            <Badge className="bg-success/20 text-success-foreground border-success/30 rounded-xl">
              🏠 Discharge Pending
            </Badge>
          )}

          {patient.isolationStatus && (
            <Badge className="bg-destructive/20 text-destructive-foreground border-destructive/30 rounded-xl">
              <Shield className="h-3 w-3 mr-1" />
              {patient.isolationStatus}
            </Badge>
          )}
        </div>

        {/* Quick Vitals Overview */}
        <div className="bg-white/60 rounded-2xl p-3 border border-primary-100 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary-600" />
              Latest Vitals
            </h4>
            <span className="text-xs text-gray-500">{getTimeAgo(patientDetails.vitals.lastTaken)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div
                className={`font-semibold ${getVitalColor(getVitalStatus("temperature", patientDetails.vitals.temperature))}`}
              >
                {patientDetails.vitals.temperature}°F
              </div>
              <div className="text-gray-500">Temp</div>
            </div>
            <div className="text-center">
              <div
                className={`font-semibold ${getVitalColor(getVitalStatus("heartRate", patientDetails.vitals.heartRate))}`}
              >
                {patientDetails.vitals.heartRate}
              </div>
              <div className="text-gray-500">HR</div>
            </div>
            <div className="text-center">
              <div
                className={`font-semibold ${getVitalColor(getVitalStatus("systolic", patientDetails.vitals.bloodPressure.systolic))}`}
              >
                {patientDetails.vitals.bloodPressure.systolic}/{patientDetails.vitals.bloodPressure.diastolic}
              </div>
              <div className="text-gray-500">BP</div>
            </div>
          </div>
        </div>

        {/* Time-sensitive Information - Flexible Height */}
        <div className="grid grid-cols-2 gap-3 mb-4 flex-grow">
          {patient.nextMedTime && (
            <div className="bg-white/60 rounded-2xl p-3 border border-primary-100">
              <div className="flex items-center gap-2 mb-1">
                <Pill className="h-4 w-4 text-primary-600" />
                <span className="text-xs font-medium text-gray-600">Next Medication</span>
              </div>
              <div className="text-sm font-semibold text-gray-800">{getTimeUntilNext(patient.nextMedTime)}</div>
              <div className="text-xs text-gray-500">{patientDetails.medications[0]?.name}</div>
            </div>
          )}

          {status.painLevel && status.painLevel > 0 && (
            <div className="bg-white/60 rounded-2xl p-3 border border-accent-100">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-accent-600" />
                <span className="text-xs font-medium text-gray-600">Pain Level</span>
              </div>
              <div
                className={`text-sm font-semibold ${
                  status.painLevel >= 7 ? "text-critical" : status.painLevel >= 4 ? "text-warning" : "text-success"
                }`}
              >
                {status.painLevel}/10
              </div>
            </div>
          )}

          <div className="bg-white/60 rounded-2xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Bed className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Mobility</span>
            </div>
            <div className="text-sm font-semibold text-gray-800 capitalize">{status.mobilityStatus}</div>
          </div>

          <div className="bg-white/60 rounded-2xl p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-600">Fall Risk</span>
            </div>
            <div
              className={`text-sm font-semibold ${patientDetails.fallRisk === "High" ? "text-critical" : "text-success"}`}
            >
              {patientDetails.fallRisk}
            </div>
          </div>
        </div>

        {/* Allergies - Fixed Height */}
        {patient.allergies.length > 0 && (
          <div className="bg-destructive/10 rounded-2xl p-3 border border-destructive/20 mb-4 min-h-[60px]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-medium text-destructive">⚠️ Allergies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.allergies.slice(0, 3).map((allergy, index) => (
                <Badge key={index} variant="destructive" className="text-xs rounded-lg">
                  {allergy}
                </Badge>
              ))}
              {patient.allergies.length > 3 && (
                <Badge variant="destructive" className="text-xs rounded-lg">
                  +{patient.allergies.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Always at Bottom */}
        <div className="flex gap-2 mt-auto">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onStartHandoff()
            }}
            className="flex-1 bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white rounded-2xl h-12 font-medium transition-all duration-200 hover:shadow-warm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Handoff
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl h-12 w-12 border-primary-200 hover:bg-primary-50 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              // Voice input functionality
            }}
          >
            <Mic className="h-4 w-4 text-primary-600" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl h-12 w-12 border-secondary-200 hover:bg-secondary-50 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              // Text-to-speech functionality
            }}
          >
            <Volume2 className="h-4 w-4 text-secondary-600" />
          </Button>
        </div>

        {/* Last Updated - Fixed at Bottom */}
        <div className="text-xs text-gray-500 text-center pt-3 mt-2 border-t border-gray-100">
          <Clock className="h-3 w-3 inline mr-1" />
          Last updated by day shift at 6:00 AM
        </div>
      </CardContent>

      {/* Gentle glow effect when selected */}
      {isSelected && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      )}
    </Card>
  )
}

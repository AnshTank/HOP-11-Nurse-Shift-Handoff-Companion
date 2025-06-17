"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Pill,
  Thermometer,
  Activity,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  RotateCcw,
  Mic,
  MicOff,
  FileText,
  MapPin,
  Calendar,
  Stethoscope,
  Volume2,
  Save,
  ArrowLeft,
} from "lucide-react"
import { useVoiceInput } from "@/hooks/use-voice-input"
import type { PatientBasic, PatientStatus } from "@/types/patient-enhanced"

interface PatientDetailViewProps {
  patient: PatientBasic
  status: PatientStatus
  onClose: () => void
  onMarkReviewed: () => void
  onSaveNotes: (notes: string) => void
  isMobile?: boolean
}

interface VitalSign {
  timestamp: string
  temperature: number
  bloodPressure: { systolic: number; diastolic: number }
  heartRate: number
  respiratoryRate: number
  oxygenSaturation: number
  painLevel: number
}

interface Medication {
  name: string
  dosage: string
  frequency: string
  nextDue: string
  lastGiven?: string
  missed?: boolean
  notes?: string
}

interface Task {
  id: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueTime?: string
  completedBy?: string
  completedAt?: string
}

// Mock data for detailed view
const mockVitals: VitalSign[] = [
  {
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    temperature: 98.6,
    bloodPressure: { systolic: 120, diastolic: 80 },
    heartRate: 72,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    painLevel: 3,
  },
  {
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    temperature: 99.1,
    bloodPressure: { systolic: 125, diastolic: 82 },
    heartRate: 78,
    respiratoryRate: 18,
    oxygenSaturation: 97,
    painLevel: 4,
  },
]

const mockMedications: Medication[] = [
  {
    name: "Metoprolol",
    dosage: "25mg",
    frequency: "BID",
    nextDue: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    lastGiven: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Daily",
    nextDue: new Date(Date.now() + 14 * 60 * 60 * 1000).toISOString(),
    lastGiven: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: "Morphine",
    dosage: "2mg",
    frequency: "PRN",
    nextDue: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    missed: true,
    notes: "Patient refused due to nausea",
  },
]

const mockCompletedTasks: Task[] = [
  {
    id: "1",
    description: "Morning vitals assessment",
    completed: true,
    priority: "high",
    completedBy: "Sarah RN",
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    description: "Wound dressing change",
    completed: true,
    priority: "medium",
    completedBy: "Sarah RN",
    completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    description: "Patient education on medication",
    completed: true,
    priority: "low",
    completedBy: "Sarah RN",
    completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
]

const mockPendingTasks: Task[] = [
  {
    id: "4",
    description: "Lab results review with physician",
    completed: false,
    priority: "high",
    dueTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    description: "Physical therapy consultation",
    completed: false,
    priority: "medium",
    dueTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    description: "Family meeting scheduled",
    completed: false,
    priority: "low",
    dueTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
  },
]

export function PatientDetailView({
  patient,
  status,
  onClose,
  onMarkReviewed,
  onSaveNotes,
  isMobile = false,
}: PatientDetailViewProps) {
  const [openSections, setOpenSections] = useState({
    diagnosis: true,
    medications: true,
    vitals: true,
    alerts: true,
    tasks: true,
  })
  const [notes, setNotes] = useState("")
  const [isReviewed, setIsReviewed] = useState(false)
  const [patientMood, setPatientMood] = useState<"calm" | "anxious" | "pain" | "sleeping">("calm")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript, setTranscript } =
    useVoiceInput()

  useEffect(() => {
    if (transcript) {
      setNotes((prev) => prev + (prev ? " " : "") + transcript)
    }
  }, [transcript])

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleMarkReviewed = () => {
    setIsReviewed(true)
    onMarkReviewed()
  }

  const handleSaveNotes = () => {
    onSaveNotes(notes)
    // Auto-save feedback
    const button = document.getElementById("save-notes-btn")
    if (button) {
      button.textContent = "Saved! ✓"
      setTimeout(() => {
        button.textContent = "Save Notes"
      }, 2000)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      speechSynthesis.speak(utterance)
    }
  }

  const getMoodEmoji = () => {
    switch (patientMood) {
      case "calm":
        return "😌"
      case "anxious":
        return "😰"
      case "pain":
        return "😣"
      case "sleeping":
        return "😴"
      default:
        return "😐"
    }
  }

  const getStatusColor = () => {
    if (patient.riskLevel === "critical" || patient.acuityLevel >= 4) return "destructive"
    if (patient.riskLevel === "high") return "default"
    return "secondary"
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffHours > 0) return `${diffHours}h ago`
    return `${diffMinutes}m ago`
  }

  const getTimeUntil = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffHours = Math.floor((time.getTime() - now.getTime()) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((time.getTime() - now.getTime()) / (1000 * 60))

    if (diffHours > 0) return `in ${diffHours}h`
    if (diffMinutes > 0) return `in ${diffMinutes}m`
    return "now"
  }

  const latestVitals = mockVitals[0]

  const containerClass = isMobile
    ? "fixed inset-0 z-50 bg-gradient-to-br from-primary-50 via-white to-secondary-50"
    : "fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-gradient-to-br from-primary-50 via-white to-secondary-50 shadow-2xl"

  return (
    <div className={containerClass}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-primary-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onClose} className="rounded-2xl border-primary-200 hover:bg-primary-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isMobile ? "Back" : "Close"}
            </Button>

            <div className="flex items-center gap-3">
              <Button
                variant={isReviewed ? "default" : "outline"}
                onClick={handleMarkReviewed}
                className={`rounded-2xl ${
                  isReviewed
                    ? "bg-gradient-to-r from-success to-green-400 text-white"
                    : "border-primary-200 hover:bg-primary-50"
                }`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isReviewed ? "Reviewed ✓" : "Mark Reviewed"}
              </Button>

              <Button
                variant={isListening ? "destructive" : "default"}
                onClick={handleVoiceToggle}
                disabled={!isSupported}
                className={`rounded-2xl ${
                  isListening
                    ? "animate-pulse-soft"
                    : "bg-gradient-to-r from-primary to-primary-400 text-white hover:from-primary-600 hover:to-primary-500"
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                {isListening ? "Stop Voice" : "Start Voice Note"}
              </Button>
            </div>
          </div>

          {/* Patient Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl flex items-center justify-center text-2xl cursor-pointer hover:scale-110 transition-transform"
                onClick={() => {
                  const moods: ("calm" | "anxious" | "pain" | "sleeping")[] = ["calm", "anxious", "pain", "sleeping"]
                  const currentIndex = moods.indexOf(patientMood)
                  const nextMood = moods[(currentIndex + 1) % moods.length]
                  setPatientMood(nextMood)
                }}
                title="Click to change patient mood"
              >
                {getMoodEmoji()}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-1">{patient.name}</h1>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Room {patient.room}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Admitted {new Date(patient.admissionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Badge variant={getStatusColor()} className="text-lg px-4 py-2 rounded-2xl">
                {patient.riskLevel.toUpperCase()}
              </Badge>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white ${
                  patient.acuityLevel >= 4
                    ? "bg-gradient-to-br from-critical to-red-400"
                    : patient.acuityLevel === 3
                      ? "bg-gradient-to-br from-high to-orange-400"
                      : "bg-gradient-to-br from-stable to-green-400"
                }`}
              >
                {patient.acuityLevel}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            {/* Diagnosis & Condition */}
            <Collapsible open={openSections.diagnosis} onOpenChange={() => toggleSection("diagnosis")}>
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-400 rounded-2xl flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-white" />
                        </div>
                        <span>Diagnosis & Condition</span>
                      </div>
                      {openSections.diagnosis ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <div className="bg-white/80 rounded-2xl p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Primary Diagnosis</h4>
                      <p className="text-gray-700">{patient.primaryDiagnosis}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/80 rounded-2xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Mobility Status</h4>
                        <p className="text-gray-700 capitalize">{status.mobilityStatus}</p>
                      </div>

                      <div className="bg-white/80 rounded-2xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Fall Risk</h4>
                        <Badge
                          variant={
                            patient.riskLevel === "high" || patient.riskLevel === "critical"
                              ? "destructive"
                              : "secondary"
                          }
                          className="rounded-xl"
                        >
                          {patient.riskLevel === "high" || patient.riskLevel === "critical" ? "High Risk" : "Low Risk"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Medications */}
            <Collapsible open={openSections.medications} onOpenChange={() => toggleSection("medications")}>
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                          <Pill className="h-5 w-5 text-white" />
                        </div>
                        <span>Medications ({mockMedications.length})</span>
                      </div>
                      {openSections.medications ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-3">
                    {mockMedications.map((med, index) => (
                      <div
                        key={index}
                        className={`bg-white/80 rounded-2xl p-4 border-l-4 ${
                          med.missed ? "border-critical" : "border-success"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {med.name} {med.dosage}
                            </h4>
                            <p className="text-sm text-gray-600">{med.frequency}</p>
                          </div>
                          {med.missed && (
                            <Badge variant="destructive" className="rounded-xl">
                              Missed
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Next Due:</span>
                            <p className="font-medium">{getTimeUntil(med.nextDue)}</p>
                          </div>
                          {med.lastGiven && (
                            <div>
                              <span className="text-gray-500">Last Given:</span>
                              <p className="font-medium">{getTimeAgo(med.lastGiven)}</p>
                            </div>
                          )}
                        </div>

                        {med.notes && (
                          <div className="mt-2 p-2 bg-warning/20 rounded-xl">
                            <p className="text-sm text-warning-foreground">{med.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Vitals Timeline */}
            <Collapsible open={openSections.vitals} onOpenChange={() => toggleSection("vitals")}>
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span>Vital Signs</span>
                        <Badge variant="outline" className="rounded-xl">
                          Last: {getTimeAgo(latestVitals.timestamp)}
                        </Badge>
                      </div>
                      {openSections.vitals ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white/80 rounded-2xl p-4 text-center">
                        <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                        <div className="text-2xl font-bold text-gray-800">{latestVitals.temperature}°F</div>
                        <div className="text-xs text-gray-500">Temperature</div>
                      </div>

                      <div className="bg-white/80 rounded-2xl p-4 text-center">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                        <div className="text-2xl font-bold text-gray-800">{latestVitals.heartRate}</div>
                        <div className="text-xs text-gray-500">Heart Rate</div>
                      </div>

                      <div className="bg-white/80 rounded-2xl p-4 text-center">
                        <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                        <div className="text-lg font-bold text-gray-800">
                          {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                        </div>
                        <div className="text-xs text-gray-500">Blood Pressure</div>
                      </div>

                      <div className="bg-white/80 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800">{latestVitals.oxygenSaturation}%</div>
                        <div className="text-xs text-gray-500">O2 Saturation</div>
                      </div>
                    </div>

                    {/* Pain Level */}
                    <div className="bg-white/80 rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-800">Pain Level</h4>
                        <Badge
                          variant={
                            latestVitals.painLevel >= 7
                              ? "destructive"
                              : latestVitals.painLevel >= 4
                                ? "default"
                                : "secondary"
                          }
                          className="rounded-xl"
                        >
                          {latestVitals.painLevel}/10
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            latestVitals.painLevel >= 7
                              ? "bg-gradient-to-r from-critical to-red-400"
                              : latestVitals.painLevel >= 4
                                ? "bg-gradient-to-r from-high to-orange-400"
                                : "bg-gradient-to-r from-stable to-green-400"
                          }`}
                          style={{ width: `${(latestVitals.painLevel / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Alerts & Precautions */}
            <Collapsible open={openSections.alerts} onOpenChange={() => toggleSection("alerts")}>
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-critical to-red-400 rounded-2xl flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <span>Alerts & Precautions</span>
                      </div>
                      {openSections.alerts ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-3">
                    {/* Allergies */}
                    {patient.allergies.length > 0 && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <h4 className="font-semibold text-destructive">Allergies</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {patient.allergies.map((allergy, index) => (
                            <Badge key={index} variant="destructive" className="rounded-xl">
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Isolation */}
                    {patient.isolationStatus && (
                      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-warning" />
                          <h4 className="font-semibold text-warning">Isolation Precautions</h4>
                        </div>
                        <Badge variant="outline" className="bg-warning/20 text-warning-foreground rounded-xl">
                          {patient.isolationStatus}
                        </Badge>
                      </div>
                    )}

                    {/* Critical Labs */}
                    {status.hasCriticalLabs && (
                      <div className="bg-critical/10 border border-critical/20 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-5 w-5 text-critical" />
                          <h4 className="font-semibold text-critical">Critical Lab Results</h4>
                        </div>
                        <p className="text-sm text-critical">Pending physician review</p>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Tasks */}
            <Collapsible open={openSections.tasks} onOpenChange={() => toggleSection("tasks")}>
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <span>Tasks & Follow-ups</span>
                      </div>
                      {openSections.tasks ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {/* Completed Tasks */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Completed This Shift ({mockCompletedTasks.length})
                      </h4>
                      <div className="space-y-2">
                        {mockCompletedTasks.map((task) => (
                          <div key={task.id} className="bg-success/10 border border-success/20 rounded-2xl p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{task.description}</p>
                                <p className="text-sm text-gray-600">
                                  Completed by {task.completedBy} • {getTimeAgo(task.completedAt!)}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pending Tasks */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-warning" />
                        Pending Tasks ({mockPendingTasks.length})
                      </h4>
                      <div className="space-y-2">
                        {mockPendingTasks.map((task) => (
                          <div key={task.id} className="bg-warning/10 border border-warning/20 rounded-2xl p-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{task.description}</p>
                                <p className="text-sm text-gray-600">Due: {getTimeUntil(task.dueTime!)}</p>
                              </div>
                              <Badge
                                variant={
                                  task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                      ? "default"
                                      : "secondary"
                                }
                                className="rounded-xl"
                              >
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Handoff Notes */}
            <Card className="bg-white/60 border-0 shadow-soft rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-400 rounded-2xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span>Handoff Notes</span>
                  {isListening && (
                    <Badge className="bg-critical/20 text-critical animate-bounce-gentle rounded-xl">
                      🎤 Recording...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your handoff notes here... You can type or use voice input."
                  className="min-h-32 rounded-2xl border-primary-200 focus:border-primary-400 focus:ring-primary-400 resize-none"
                />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => speakText(notes)}
                      disabled={!notes.trim()}
                      className="rounded-2xl border-primary-200 hover:bg-primary-50"
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      Read Aloud
                    </Button>

                    {transcript && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearTranscript}
                        className="rounded-2xl border-primary-200 hover:bg-primary-50"
                      >
                        Clear Voice
                      </Button>
                    )}
                  </div>

                  <Button
                    id="save-notes-btn"
                    onClick={handleSaveNotes}
                    disabled={!notes.trim()}
                    className="bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white rounded-2xl"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generate Summary */}
            <Card className="bg-gradient-to-r from-success/10 to-primary-50 border-0 shadow-soft rounded-3xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Complete Handoff?</h3>
                  <p className="text-gray-600 mb-4">Generate a comprehensive handoff summary for the next nurse</p>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-success to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-2xl px-8"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Generate Final Handoff Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-primary-100 p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last updated by Sarah RN at 6:10 AM</span>
            </div>
            <Button variant="outline" onClick={onClose} className="rounded-2xl border-primary-200 hover:bg-primary-50">
              Back to Patient List
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Voice Button */}
      {!isMobile && (
        <Button
          onClick={handleVoiceToggle}
          disabled={!isSupported}
          className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-warm hover:shadow-xl transition-all duration-300 hover:scale-110 ${
            isListening
              ? "bg-gradient-to-r from-critical to-red-400 animate-pulse-soft"
              : "bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500"
          } text-white`}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
      )}
    </div>
  )
}

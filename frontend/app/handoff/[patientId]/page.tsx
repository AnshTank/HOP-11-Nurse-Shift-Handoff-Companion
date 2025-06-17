"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EmpatheticChatbot } from "@/components/empathetic-chatbot"
import { NursingChatbot } from "@/components/nursing-chatbot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Heart,
  Clock,
  MessageCircle,
  Bot,
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Stethoscope,
  Pill,
  Activity,
  AlertTriangle,
  Shield,
  Phone,
  FileText,
  Droplets,
  Utensils,
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles,
} from "lucide-react"
import type { PatientBasic, PatientStatus } from "@/types/patient-enhanced"
import type { HandoffEntry } from "@/types/shift-handoff"

// Mock data - in real app, this would come from API/database
const mockPatients: Record<string, PatientBasic> = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    room: "ICU-101",
    admissionDate: "2024-01-15",
    primaryDiagnosis: "Post-operative cardiac surgery",
    allergies: ["Penicillin", "Latex"],
    riskLevel: "critical",
    isolationStatus: "Contact Precautions",
    acuityLevel: 5,
    lastVitalsTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    nextMedTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    hasAlerts: true,
    isPendingDischarge: false,
    requiresFollowUp: true,
    nursingNotes: ["Patient reports chest pain", "Requires frequent monitoring"],
  },
  // Add other patients as needed
}

const mockPatientStatuses: Record<string, PatientStatus> = {
  "1": {
    hasNewOrders: true,
    hasCriticalLabs: true,
    hasUnreadMessages: false,
    painLevel: 7,
    mobilityStatus: "bedrest",
  },
}

// Enhanced patient details
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
    painLevel: 7,
    lastTaken: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  medications: [
    { name: "Metoprolol", dosage: "25mg", frequency: "BID", nextDue: "2:00 PM", lastGiven: "6:00 AM" },
    { name: "Lisinopril", dosage: "10mg", frequency: "Daily", nextDue: "8:00 AM", lastGiven: "Yesterday 8:00 AM" },
    { name: "Aspirin", dosage: "81mg", frequency: "Daily", nextDue: "8:00 AM", lastGiven: "Yesterday 8:00 AM" },
    { name: "Morphine", dosage: "2mg", frequency: "PRN", nextDue: "As needed", lastGiven: "4:00 AM" },
  ],
  dietRestrictions: ["Low sodium", "Diabetic", "NPO after midnight"],
  fallRisk: "High",
  codeStatus: "Full Code",
  physician: "Dr. Sarah Williams",
  admittingDiagnosis: "Acute myocardial infarction",
  procedures: ["Cardiac catheterization", "Stent placement", "CABG x3"],
  labResults: {
    lastDrawn: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    pending: ["CBC", "BMP", "Troponin", "PT/INR"],
    critical: ["Troponin elevated at 15.2", "Creatinine 2.1"],
    recent: [
      { test: "Hemoglobin", value: "9.2 g/dL", status: "Low", time: "6:00 AM" },
      { test: "Glucose", value: "180 mg/dL", status: "High", time: "6:00 AM" },
      { test: "Potassium", value: "3.2 mEq/L", status: "Low", time: "6:00 AM" },
    ],
  },
  nursingAssessment: {
    neurological: "Alert and oriented x3, follows commands",
    cardiovascular: "Irregular rhythm, +2 pedal edema bilaterally",
    respiratory: "Crackles in bilateral bases, O2 sat 94% on 2L NC",
    gastrointestinal: "Bowel sounds present, last BM yesterday",
    genitourinary: "Foley catheter in place, clear yellow urine",
    integumentary: "Surgical incision clean, dry, intact",
    musculoskeletal: "Weakness noted, requires assistance with mobility",
  },
  tasks: {
    completed: [
      { task: "Morning vitals", time: "6:00 AM", nurse: "Sarah RN" },
      { task: "Medication administration", time: "6:30 AM", nurse: "Sarah RN" },
      { task: "Wound assessment", time: "7:00 AM", nurse: "Sarah RN" },
    ],
    pending: [
      { task: "Lab results review with physician", priority: "High", due: "10:00 AM" },
      { task: "Physical therapy consultation", priority: "Medium", due: "2:00 PM" },
      { task: "Family meeting", priority: "Low", due: "4:00 PM" },
    ],
  },
})

interface HandoffPageProps {
  params: {
    patientId: string
  }
}

export default function HandoffPage({ params }: HandoffPageProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<PatientBasic | null>(null)
  const [patientStatus, setPatientStatus] = useState<PatientStatus | null>(null)
  const [patientDetails, setPatientDetails] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [useAIModel, setUseAIModel] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    vitals: true,
    medications: true,
    assessment: false,
    labs: false,
    tasks: false,
  })
  const [completionStatus, setCompletionStatus] = useState({
    assessment: false,
    vitals: false,
    medications: false,
    interventions: false,
    pending: false,
    alerts: false,
  })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Load patient data
    const patientData = mockPatients[params.patientId]
    const statusData = mockPatientStatuses[params.patientId]
    const detailsData = getPatientDetails(params.patientId)

    if (patientData) {
      setPatient(patientData)
      setPatientStatus(statusData)
      setPatientDetails(detailsData)
    } else {
      // Redirect if patient not found
      router.push("/")
    }
  }, [params.patientId, router])

  const handleAddEntry = (entry: Omit<HandoffEntry, "id" | "timestamp">) => {
    // Update completion status
    setCompletionStatus((prev) => ({
      ...prev,
      [entry.category]: true,
    }))

    // In real app, save to database
    console.log("Entry added:", entry)
  }

  const handleCompleteHandoff = () => {
    // In real app, save final handoff and redirect
    console.log("Handoff completed for patient:", patient?.name)
    router.push("/")
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const getShiftStatus = () => {
    const now = new Date()
    const hour = now.getHours()
    if (hour >= 7 && hour < 19) return "day"
    if (hour >= 19 && hour < 23) return "evening"
    return "night"
  }

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
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
        return "text-red-600 bg-red-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  if (!patient || !patientStatus || !patientDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Patient Information...</h2>
          <p className="text-gray-600">Please wait while we prepare the handoff interface</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="rounded-2xl border-primary-200 hover:bg-primary-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
              </Button>

              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-400 rounded-3xl flex items-center justify-center shadow-warm">
                <Heart className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                  Patient Handoff
                </h1>
                <p className="text-gray-600 font-medium">Comprehensive care transition for {patient.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2 bg-white/60 rounded-2xl px-4 py-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
              </div>

              <Badge className="bg-gradient-to-r from-primary to-primary-400 text-white rounded-2xl px-4 py-2 capitalize">
                {getShiftStatus()} Shift
              </Badge>

              {/* AI Model Toggle */}
              <div className="flex items-center gap-3 bg-white/60 rounded-2xl px-4 py-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">AI Model</span>
                <Switch checked={useAIModel} onCheckedChange={setUseAIModel} />
                <Sparkles className={`h-4 w-4 ${useAIModel ? "text-primary" : "text-gray-400"}`} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Patient Info Bar */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{patient.name}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Room {patient.room}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Admitted {new Date(patient.admissionDate).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <span>{patient.primaryDiagnosis}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="rounded-2xl px-3 py-1">
                  {patient.riskLevel.toUpperCase()}
                </Badge>

                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white ${
                    patient.acuityLevel >= 4
                      ? "bg-gradient-to-br from-critical to-red-400"
                      : patient.acuityLevel === 3
                        ? "bg-gradient-to-br from-high to-orange-400"
                        : "bg-gradient-to-br from-stable to-green-400"
                  }`}
                >
                  {patient.acuityLevel}
                </div>

                {patient.isolationStatus && (
                  <Badge variant="destructive" className="rounded-2xl">
                    {patient.isolationStatus}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500">Handoff Progress</div>
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(
                  (Object.values(completionStatus).filter(Boolean).length / Object.keys(completionStatus).length) * 100,
                )}
                %
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 rounded-3xl p-2 mb-8">
            <TabsTrigger
              value="profile"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-400 data-[state=active]:text-white"
            >
              <User className="h-4 w-4 mr-2" />
              Patient Profile
            </TabsTrigger>
            <TabsTrigger
              value="handoff"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-400 data-[state=active]:text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Guided Handoff
            </TabsTrigger>
            <TabsTrigger
              value="assistant"
              className="rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary-400 data-[state=active]:to-secondary-500 data-[state=active]:text-white"
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vital Signs */}
              <Collapsible open={expandedSections.vitals} onOpenChange={() => toggleSection("vitals")}>
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
                            {getTimeAgo(patientDetails.vitals.lastTaken)}
                          </Badge>
                        </div>
                        {expandedSections.vitals ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div
                          className={`rounded-2xl p-4 text-center ${getVitalColor(getVitalStatus("temperature", patientDetails.vitals.temperature))}`}
                        >
                          <div className="text-2xl font-bold">{patientDetails.vitals.temperature}°F</div>
                          <div className="text-xs opacity-70">Temperature</div>
                        </div>
                        <div
                          className={`rounded-2xl p-4 text-center ${getVitalColor(getVitalStatus("heartRate", patientDetails.vitals.heartRate))}`}
                        >
                          <div className="text-2xl font-bold">{patientDetails.vitals.heartRate}</div>
                          <div className="text-xs opacity-70">Heart Rate</div>
                        </div>
                        <div
                          className={`rounded-2xl p-4 text-center ${getVitalColor(getVitalStatus("systolic", patientDetails.vitals.bloodPressure.systolic))}`}
                        >
                          <div className="text-lg font-bold">
                            {patientDetails.vitals.bloodPressure.systolic}/
                            {patientDetails.vitals.bloodPressure.diastolic}
                          </div>
                          <div className="text-xs opacity-70">Blood Pressure</div>
                        </div>
                        <div
                          className={`rounded-2xl p-4 text-center ${getVitalColor(getVitalStatus("respiratoryRate", patientDetails.vitals.respiratoryRate))}`}
                        >
                          <div className="text-2xl font-bold">{patientDetails.vitals.respiratoryRate}</div>
                          <div className="text-xs opacity-70">Respiratory Rate</div>
                        </div>
                        <div
                          className={`rounded-2xl p-4 text-center ${getVitalColor(getVitalStatus("oxygenSaturation", patientDetails.vitals.oxygenSaturation))}`}
                        >
                          <div className="text-2xl font-bold">{patientDetails.vitals.oxygenSaturation}%</div>
                          <div className="text-xs opacity-70">O2 Saturation</div>
                        </div>
                        <div className="rounded-2xl p-4 text-center bg-red-50">
                          <div className="text-2xl font-bold text-red-600">{patientDetails.vitals.painLevel}/10</div>
                          <div className="text-xs text-red-600">Pain Level</div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Medications */}
              <Collapsible open={expandedSections.medications} onOpenChange={() => toggleSection("medications")}>
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                            <Pill className="h-5 w-5 text-white" />
                          </div>
                          <span>Medications ({patientDetails.medications.length})</span>
                        </div>
                        {expandedSections.medications ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {patientDetails.medications.map((med: any, index: number) => (
                        <div key={index} className="bg-white/80 rounded-2xl p-4 border-l-4 border-blue-400">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {med.name} {med.dosage}
                              </h4>
                              <p className="text-sm text-gray-600">{med.frequency}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Next Due:</span>
                              <p className="font-medium">{med.nextDue}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Last Given:</span>
                              <p className="font-medium">{med.lastGiven}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Nursing Assessment */}
              <Collapsible open={expandedSections.assessment} onOpenChange={() => toggleSection("assessment")}>
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-white" />
                          </div>
                          <span>Nursing Assessment</span>
                        </div>
                        {expandedSections.assessment ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {Object.entries(patientDetails.nursingAssessment).map(([system, assessment]) => (
                        <div key={system} className="bg-white/80 rounded-2xl p-4">
                          <h4 className="font-semibold text-gray-800 capitalize mb-2">{system}</h4>
                          <p className="text-sm text-gray-700">{assessment as string}</p>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Lab Results */}
              <Collapsible open={expandedSections.labs} onOpenChange={() => toggleSection("labs")}>
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                            <Droplets className="h-5 w-5 text-white" />
                          </div>
                          <span>Lab Results</span>
                        </div>
                        {expandedSections.labs ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Recent Results</h4>
                        <div className="space-y-2">
                          {patientDetails.labResults.recent.map((lab: any, index: number) => (
                            <div key={index} className="flex justify-between items-center bg-white/80 rounded-2xl p-3">
                              <div>
                                <span className="font-medium">{lab.test}</span>
                                <span className="text-sm text-gray-500 ml-2">{lab.time}</span>
                              </div>
                              <Badge
                                variant={lab.status === "Normal" ? "secondary" : "destructive"}
                                className="rounded-xl"
                              >
                                {lab.value} ({lab.status})
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {patientDetails.labResults.critical.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Critical Results</h4>
                          <div className="space-y-2">
                            {patientDetails.labResults.critical.map((result: string, index: number) => (
                              <div key={index} className="bg-red-50 border border-red-200 rounded-2xl p-3">
                                <span className="text-red-700 font-medium">{result}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Pending Orders</h4>
                        <div className="flex flex-wrap gap-2">
                          {patientDetails.labResults.pending.map((test: string, index: number) => (
                            <Badge key={index} variant="outline" className="rounded-xl">
                              {test}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Tasks & Follow-ups */}
              <Collapsible open={expandedSections.tasks} onOpenChange={() => toggleSection("tasks")}>
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-primary-50/50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <span>Tasks & Follow-ups</span>
                        </div>
                        {expandedSections.tasks ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">Completed This Shift</h4>
                        <div className="space-y-2">
                          {patientDetails.tasks.completed.map((task: any, index: number) => (
                            <div key={index} className="bg-green-50 border border-green-200 rounded-2xl p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">{task.task}</span>
                                <div className="text-sm text-green-600">
                                  {task.time} by {task.nurse}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">Pending Tasks</h4>
                        <div className="space-y-2">
                          {patientDetails.tasks.pending.map((task: any, index: number) => (
                            <div key={index} className="bg-orange-50 border border-orange-200 rounded-2xl p-3">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-orange-800">{task.task}</span>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      task.priority === "High"
                                        ? "destructive"
                                        : task.priority === "Medium"
                                          ? "default"
                                          : "secondary"
                                    }
                                    className="rounded-xl"
                                  >
                                    {task.priority}
                                  </Badge>
                                  <span className="text-sm text-orange-600">{task.due}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Additional Patient Information */}
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span>Additional Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/80 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Emergency Contact
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>{patientDetails.emergencyContact.name}</strong>
                      </div>
                      <div className="text-gray-600">{patientDetails.emergencyContact.relationship}</div>
                      <div className="text-gray-600">{patientDetails.emergencyContact.phone}</div>
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      Care Team
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Physician:</strong> {patientDetails.physician}
                      </div>
                      <div>
                        <strong>Code Status:</strong> {patientDetails.codeStatus}
                      </div>
                      <div>
                        <strong>Fall Risk:</strong> <span className="text-red-600">{patientDetails.fallRisk}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Diet & Restrictions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {patientDetails.dietRestrictions.map((restriction: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs rounded-lg">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {patient.allergies.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Allergies
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive" className="text-xs rounded-lg">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/80 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Recent Procedures
                    </h4>
                    <div className="space-y-1 text-sm">
                      {patientDetails.procedures.map((procedure: string, index: number) => (
                        <div key={index}>• {procedure}</div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Insurance
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div>
                        <strong>Provider:</strong> {patientDetails.insurance.provider}
                      </div>
                      <div>
                        <strong>Policy:</strong> {patientDetails.insurance.policyNumber}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="handoff">
            <EmpatheticChatbot
              patientName={patient.name}
              onEntryComplete={handleAddEntry}
              completionStatus={completionStatus}
              onComplete={handleCompleteHandoff}
              useAIModel={useAIModel}
            />
          </TabsContent>

          <TabsContent value="assistant">
            <NursingChatbot
              currentPatient={patient.name}
              onQuickAction={(action, data) => {
                console.log("Quick action:", action, data)
              }}
              useAIModel={useAIModel}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

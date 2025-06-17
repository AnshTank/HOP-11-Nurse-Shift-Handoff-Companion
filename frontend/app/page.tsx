"use client"

import { useState, useEffect } from "react"
import { WarmPatientCard } from "@/components/warm-patient-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, Clock, Moon, Sun, ChevronLeft, ChevronRight, Mic, Plus } from "lucide-react"
import type { PatientBasic, PatientStatus } from "@/types/patient-enhanced"
import type { PatientSummary, HandoffEntry } from "@/types/shift-handoff"
import { PatientDetailView } from "@/components/patient-detail-view"
import { AddPatientModal } from "@/components/add-patient-modal"
import { useRouter } from "next/navigation"

const mockPatients: PatientBasic[] = [
  {
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
    nextMedTime: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(),
    hasAlerts: true,
    isPendingDischarge: false,
    requiresFollowUp: true,
    nursingNotes: ["Patient reports chest pain", "Requires frequent monitoring"],
  },
  {
    id: "2",
    name: "Michael Chen",
    room: "Med-205",
    admissionDate: "2024-01-16",
    primaryDiagnosis: "Pneumonia recovery",
    allergies: [],
    riskLevel: "medium",
    acuityLevel: 3,
    lastVitalsTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    nextMedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    hasAlerts: false,
    isPendingDischarge: false,
    requiresFollowUp: false,
    nursingNotes: ["Responding well to antibiotics"],
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    room: "ICU-103",
    admissionDate: "2024-01-14",
    primaryDiagnosis: "Stroke recovery",
    allergies: ["Sulfa drugs"],
    riskLevel: "high",
    acuityLevel: 4,
    lastVitalsTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    nextMedTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    hasAlerts: true,
    isPendingDischarge: false,
    requiresFollowUp: true,
    nursingNotes: ["Left-sided weakness improving", "Speech therapy scheduled"],
  },
  {
    id: "4",
    name: "Robert Wilson",
    room: "Med-210",
    admissionDate: "2024-01-17",
    primaryDiagnosis: "Diabetes management",
    allergies: [],
    riskLevel: "low",
    acuityLevel: 2,
    lastVitalsTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    nextMedTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    hasAlerts: false,
    isPendingDischarge: true,
    requiresFollowUp: false,
    nursingNotes: ["Blood sugar stable", "Discharge planning in progress"],
  },
  {
    id: "5",
    name: "Lisa Thompson",
    room: "Med-208",
    admissionDate: "2024-01-16",
    primaryDiagnosis: "Post-surgical recovery",
    allergies: ["Morphine"],
    riskLevel: "medium",
    acuityLevel: 3,
    lastVitalsTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    nextMedTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    hasAlerts: false,
    isPendingDischarge: false,
    requiresFollowUp: true,
    nursingNotes: ["Pain well controlled", "Ambulating with assistance"],
  },
  {
    id: "6",
    name: "David Martinez",
    room: "ICU-102",
    admissionDate: "2024-01-17",
    primaryDiagnosis: "Respiratory failure",
    allergies: ["Iodine"],
    riskLevel: "critical",
    acuityLevel: 5,
    lastVitalsTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    nextMedTime: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(),
    hasAlerts: true,
    isPendingDischarge: false,
    requiresFollowUp: true,
    nursingNotes: ["On ventilator support", "Family meeting scheduled"],
  },
]

const mockPatientStatuses: Record<string, PatientStatus> = {
  "1": {
    hasNewOrders: true,
    hasCriticalLabs: true,
    hasUnreadMessages: false,
    painLevel: 7,
    mobilityStatus: "bedrest",
  },
  "2": {
    hasNewOrders: false,
    hasCriticalLabs: false,
    hasUnreadMessages: false,
    painLevel: 3,
    mobilityStatus: "assistance",
  },
  "3": {
    hasNewOrders: true,
    hasCriticalLabs: false,
    hasUnreadMessages: true,
    painLevel: 4,
    mobilityStatus: "assistance",
  },
  "4": {
    hasNewOrders: false,
    hasCriticalLabs: false,
    hasUnreadMessages: false,
    painLevel: 1,
    mobilityStatus: "independent",
  },
  "5": {
    hasNewOrders: false,
    hasCriticalLabs: false,
    hasUnreadMessages: false,
    painLevel: 2,
    mobilityStatus: "assistance",
  },
  "6": {
    hasNewOrders: true,
    hasCriticalLabs: true,
    hasUnreadMessages: true,
    painLevel: 5,
    mobilityStatus: "bedrest",
  },
}

const createMockSummary = (patientId: string): PatientSummary => ({
  patientId,
  currentShift: {
    id: `shift-${patientId}-${Date.now()}`,
    patientId,
    shiftDate: new Date().toISOString().split("T")[0],
    shiftType: "day",
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  entries: [],
  completionStatus: {
    assessment: false,
    vitals: false,
    medications: false,
    interventions: false,
    pending: false,
    alerts: false,
  },
  lastUpdated: new Date().toISOString(),
})

export default function NurseShiftCompanion() {
  const [selectedPatient, setSelectedPatient] = useState<PatientBasic | undefined>()
  const [patientSummaries, setPatientSummaries] = useState<Record<string, PatientSummary>>({})
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState("handoff")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isHandoffMode, setIsHandoffMode] = useState(false)
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [patients, setPatients] = useState<PatientBasic[]>(mockPatients)
  const router = useRouter()

  useEffect(() => {
    console.log("Router ready:", router)
  }, [router])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const summaries: Record<string, PatientSummary> = {}
    patients.forEach((patient) => {
      summaries[patient.id] = createMockSummary(patient.id)
    })
    setPatientSummaries(summaries)
  }, [])

  const handleAddEntry = (patientId: string, entry: Omit<HandoffEntry, "id" | "timestamp">) => {
    const newEntry: HandoffEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    setPatientSummaries((prev) => {
      const updated = { ...prev }
      if (updated[patientId]) {
        updated[patientId] = {
          ...updated[patientId],
          entries: [...updated[patientId].entries, newEntry],
          completionStatus: {
            ...updated[patientId].completionStatus,
            [entry.category]: true,
          },
          lastUpdated: new Date().toISOString(),
        }
      }
      return updated
    })
  }

  const handleCompleteHandoff = () => {
    if (selectedPatient) {
      setPatientSummaries((prev) => {
        const updated = { ...prev }
        if (updated[selectedPatient.id]) {
          updated[selectedPatient.id] = {
            ...updated[selectedPatient.id],
            currentShift: {
              ...updated[selectedPatient.id].currentShift,
              status: "completed",
              endTime: new Date().toISOString(),
            },
          }
        }
        return updated
      })

      // Show success message and return to patient list
      setTimeout(() => {
        setIsHandoffMode(false)
        setSelectedPatient(undefined)
      }, 2000)
    }
  }

  const getShiftStatus = () => {
    const now = new Date()
    const hour = now.getHours()
    if (hour >= 7 && hour < 19) return "day"
    if (hour >= 19 && hour < 23) return "evening"
    return "night"
  }

  const getCriticalCount = () => {
    return patients.filter((p) => p.riskLevel === "critical" || p.acuityLevel >= 4).length
  }

  // Sort patients by priority
  const sortPatientsByPriority = (patients: PatientBasic[]) => {
    return [...patients].sort((a, b) => {
      // Critical patients first
      if (a.riskLevel === "critical" && b.riskLevel !== "critical") return -1
      if (b.riskLevel === "critical" && a.riskLevel !== "critical") return 1

      // Then by acuity level (higher first)
      if (a.acuityLevel !== b.acuityLevel) {
        return b.acuityLevel - a.acuityLevel
      }

      // Then by alerts
      if (a.hasAlerts && !b.hasAlerts) return -1
      if (b.hasAlerts && !a.hasAlerts) return 1

      // Then by risk level
      const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      if (a.riskLevel !== b.riskLevel) {
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
      }

      // Finally by name
      return a.name.localeCompare(b.name)
    })
  }

  const sortedPatients = sortPatientsByPriority(patients)

  const handleAddPatient = (newPatientData: Omit<PatientBasic, "id">) => {
    const newPatient: PatientBasic = {
      ...newPatientData,
      id: Date.now().toString(),
    }

    setPatients((prev) => [...prev, newPatient])
    setShowAddPatientModal(false)
  }

  const getVisiblePatients = () => {
    const cardsPerView = 3
    return sortedPatients.slice(currentCardIndex, currentCardIndex + cardsPerView)
  }

  const nextCards = () => {
    if (currentCardIndex + 3 < sortedPatients.length) {
      setCurrentCardIndex(currentCardIndex + 3)
    }
  }

  const prevCards = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(Math.max(0, currentCardIndex - 3))
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-primary-50 via-white to-secondary-50"
      }`}
    >
      {/* Warm Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-400 rounded-3xl flex items-center justify-center shadow-warm">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                  Caring Handoff Companion
                </h1>
                <p className="text-gray-600 font-medium">Supporting compassionate patient care transitions ✨</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2 bg-white/60 rounded-2xl px-4 py-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
                </div>

                <Badge className="bg-gradient-to-r from-primary to-primary-400 text-white rounded-2xl px-4 py-2 capitalize">
                  {getShiftStatus()} Shift
                </Badge>

                <div className="flex items-center gap-2 bg-white/60 rounded-2xl px-4 py-2">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{patients.length} Patients</span>
                </div>

                {getCriticalCount() > 0 && (
                  <Badge className="bg-gradient-to-r from-critical to-red-400 text-white rounded-2xl px-4 py-2 animate-pulse-soft">
                    🚨 {getCriticalCount()} Critical
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => setShowAddPatientModal(true)}
                className="bg-gradient-to-r from-success to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-2xl px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Patient
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-2xl border-primary-200 hover:bg-primary-50"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isHandoffMode && selectedPatient ? (
          <PatientDetailView
            patient={selectedPatient}
            status={mockPatientStatuses[selectedPatient.id]}
            onClose={() => {
              setIsHandoffMode(false)
              setSelectedPatient(undefined)
            }}
            onMarkReviewed={() => {
              console.log("Patient reviewed")
            }}
            onSaveNotes={(notes) => {
              console.log("Notes saved:", notes)
            }}
            isMobile={window.innerWidth < 768}
          />
        ) : (
          /* Patient Cards Carousel */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Patients Today</h2>
              <p className="text-gray-600 text-lg">Select a patient to begin their handoff documentation</p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevCards}
                disabled={currentCardIndex === 0}
                className="rounded-2xl border-primary-200 hover:bg-primary-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: Math.ceil(sortedPatients.length / 3) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      Math.floor(currentCardIndex / 3) === index ? "bg-primary w-8" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextCards}
                disabled={currentCardIndex + 3 >= sortedPatients.length}
                className="rounded-2xl border-primary-200 hover:bg-primary-50 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Patient Cards - Dynamic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {getVisiblePatients().map((patient) => (
                <WarmPatientCard
                  key={patient.id}
                  patient={patient}
                  status={mockPatientStatuses[patient.id]}
                  isSelected={selectedPatient?.id === patient.id}
                  onSelect={() => setSelectedPatient(patient)}
                  onStartHandoff={() => {
                    console.log("Navigating to patient details for:", patient.id)
                    router.push(`/patient-details/${patient.id}`)
                  }}
                />
              ))}
            </div>

            {/* Floating Voice Button */}
            <div className="fixed bottom-8 right-8">
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white shadow-warm hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
        <AddPatientModal
          isOpen={showAddPatientModal}
          onClose={() => setShowAddPatientModal(false)}
          onAddPatient={handleAddPatient}
        />
      </main>
    </div>
  )
}

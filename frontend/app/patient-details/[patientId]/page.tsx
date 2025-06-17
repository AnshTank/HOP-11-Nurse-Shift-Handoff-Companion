"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Heart,
  Clock,
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  Stethoscope,
  Pill,
  Activity,
  Phone,
  Bot,
  Save,
  Send,
  Thermometer,
  Zap,
  FileText,
  History,
  UserCheck,
  Plus,
  Check,
  X,
  MessageSquare,
  Volume2,
  Mic,
} from "lucide-react"

// Enhanced patient data with change tracking
const mockPatients: Record<string, any> = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    room: "ICU-101",
    primaryDiagnosis: "Post-operative cardiac surgery",
    age: 59,
    lastModified: {
      by: "Sarah RN",
      at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      changes: ["Updated pain assessment", "Modified medication schedule"],
    },
  },
  "2": {
    id: "2",
    name: "Michael Chen",
    room: "Med-205",
    primaryDiagnosis: "Pneumonia recovery",
    age: 45,
    lastModified: {
      by: "Jennifer RN",
      at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      changes: ["Updated vital signs", "Added nursing notes"],
    },
  },
  "3": {
    id: "3",
    name: "Emma Rodriguez",
    room: "ICU-103",
    primaryDiagnosis: "Stroke recovery",
    age: 67,
    lastModified: {
      by: "Michael RN",
      at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      changes: ["Neurological assessment update"],
    },
  },
  "4": {
    id: "4",
    name: "Robert Wilson",
    room: "Med-210",
    primaryDiagnosis: "Diabetes management",
    age: 52,
    lastModified: {
      by: "Lisa RN",
      at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      changes: ["Blood glucose monitoring", "Diet modification"],
    },
  },
  "5": {
    id: "5",
    name: "Lisa Thompson",
    room: "Med-208",
    primaryDiagnosis: "Post-surgical recovery",
    age: 38,
    lastModified: {
      by: "David RN",
      at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      changes: ["Wound assessment", "Pain management update"],
    },
  },
  "6": {
    id: "6",
    name: "David Martinez",
    room: "ICU-102",
    primaryDiagnosis: "Respiratory failure",
    age: 71,
    lastModified: {
      by: "Sarah RN",
      at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      changes: ["Respiratory therapy notes", "Oxygen saturation monitoring"],
    },
  },
}

// Activity log structure
interface ActivityLog {
  id: string
  timestamp: string
  nurse: string
  action: string
  category: "vitals" | "medication" | "assessment" | "notes" | "procedure" | "communication"
  details: string
  priority: "low" | "medium" | "high"
}

// Generate comprehensive patient details with activity logs
const getComprehensivePatientDetails = (patientId: string) => {
  const baseTime = Date.now()

  return {
    demographics: {
      dateOfBirth: patientId === "1" ? "1965-03-15" : "1978-08-22",
      age: patientId === "1" ? 59 : 45,
      gender: patientId === "1" ? "Female" : "Male",
      maritalStatus: patientId === "1" ? "Married" : "Single",
      occupation: patientId === "1" ? "Teacher" : "Engineer",
      address: patientId === "1" ? "123 Main Street, Springfield, IL 62701" : "456 Oak Avenue, Chicago, IL 60601",
      preferredLanguage: "English",
      religion: patientId === "1" ? "Catholic" : "Buddhist",
    },
    emergencyContact: {
      name: patientId === "1" ? "Jane Johnson" : "Lisa Chen",
      relationship: patientId === "1" ? "Daughter" : "Sister",
      phone: patientId === "1" ? "(555) 123-4567" : "(555) 987-6543",
      address: patientId === "1" ? "456 Oak Avenue, Springfield, IL 62702" : "789 Pine Street, Chicago, IL 60602",
      email: patientId === "1" ? "jane.johnson@email.com" : "lisa.chen@email.com",
    },
    insurance: {
      provider: patientId === "1" ? "Blue Cross Blue Shield" : "Aetna",
      policyNumber: patientId === "1" ? "BC123456789" : "AET987654321",
      groupNumber: patientId === "1" ? "GRP789456" : "GRP456789",
      subscriberName: patientId === "1" ? "Sarah Johnson" : "Michael Chen",
      effectiveDate: "2024-01-01",
      copay: patientId === "1" ? "$25" : "$30",
    },
    vitals: {
      temperature: patientId === "1" ? 98.6 : 101.2,
      bloodPressure: patientId === "1" ? { systolic: 120, diastolic: 80 } : { systolic: 140, diastolic: 90 },
      heartRate: patientId === "1" ? 72 : 88,
      respiratoryRate: patientId === "1" ? 16 : 22,
      oxygenSaturation: patientId === "1" ? 98 : 94,
      painLevel: patientId === "1" ? 7 : 3,
      weight: patientId === "1" ? 145 : 180,
      height: patientId === "1" ? "5'6\"" : "5'10\"",
      bmi: patientId === "1" ? 23.4 : 25.8,
      lastTaken: new Date(baseTime - 2 * 60 * 60 * 1000).toISOString(),
      takenBy: "Sarah RN",
    },
    medications:
      patientId === "1"
        ? [
            {
              name: "Metoprolol",
              dosage: "25mg",
              route: "PO",
              frequency: "BID",
              nextDue: "2:00 PM",
              lastGiven: "6:00 AM",
              prescriber: "Dr. Williams",
              indication: "Hypertension",
              status: "active",
            },
            {
              name: "Lisinopril",
              dosage: "10mg",
              route: "PO",
              frequency: "Daily",
              nextDue: "8:00 AM",
              lastGiven: "Yesterday 8:00 AM",
              prescriber: "Dr. Williams",
              indication: "Heart failure",
              status: "active",
            },
            {
              name: "Morphine",
              dosage: "2mg",
              route: "IV",
              frequency: "PRN",
              nextDue: "As needed",
              lastGiven: "4:00 AM",
              prescriber: "Dr. Williams",
              indication: "Pain management",
              status: "active",
            },
          ]
        : [
            {
              name: "Azithromycin",
              dosage: "500mg",
              route: "PO",
              frequency: "Daily",
              nextDue: "10:00 AM",
              lastGiven: "Yesterday 10:00 AM",
              prescriber: "Dr. Smith",
              indication: "Pneumonia",
              status: "active",
            },
            {
              name: "Albuterol",
              dosage: "2.5mg",
              route: "Nebulizer",
              frequency: "Q6H",
              nextDue: "12:00 PM",
              lastGiven: "6:00 AM",
              prescriber: "Dr. Smith",
              indication: "Bronchodilator",
              status: "active",
            },
          ],
    activityLog: [
      {
        id: "1",
        timestamp: new Date(baseTime - 30 * 60 * 1000).toISOString(),
        nurse: "Sarah RN",
        action: "Updated pain assessment",
        category: "assessment" as const,
        details:
          "Pain level increased from 5/10 to 7/10. Patient reports chest discomfort. Morphine 2mg IV administered with good effect.",
        priority: "high" as const,
      },
      {
        id: "2",
        timestamp: new Date(baseTime - 45 * 60 * 1000).toISOString(),
        nurse: "Sarah RN",
        action: "Vital signs recorded",
        category: "vitals" as const,
        details: "Temperature 98.6°F, BP 120/80, HR 72, RR 16, O2 Sat 98%. All within normal limits.",
        priority: "medium" as const,
      },
      {
        id: "3",
        timestamp: new Date(baseTime - 60 * 60 * 1000).toISOString(),
        nurse: "Michael RN",
        action: "Medication administered",
        category: "medication" as const,
        details: "Metoprolol 25mg PO given as scheduled. Patient tolerated well, no adverse reactions noted.",
        priority: "medium" as const,
      },
      {
        id: "4",
        timestamp: new Date(baseTime - 90 * 60 * 1000).toISOString(),
        nurse: "Jennifer RN",
        action: "Family communication",
        category: "communication" as const,
        details:
          "Spoke with daughter Jane Johnson regarding patient's progress. Updated on current condition and treatment plan.",
        priority: "low" as const,
      },
      {
        id: "5",
        timestamp: new Date(baseTime - 120 * 60 * 1000).toISOString(),
        nurse: "Sarah RN",
        action: "Wound assessment",
        category: "assessment" as const,
        details:
          patientId === "1"
            ? "Sternotomy incision clean, dry, and intact. No signs of infection. Staples in place."
            : "No wounds present. Skin integrity maintained.",
        priority: "medium" as const,
      },
      {
        id: "6",
        timestamp: new Date(baseTime - 150 * 60 * 1000).toISOString(),
        nurse: "David RN",
        action: "Shift handoff received",
        category: "communication" as const,
        details:
          "Received comprehensive handoff from night shift. Patient stable overnight with no significant events.",
        priority: "low" as const,
      },
    ],
    nursingNotes: [
      {
        id: "1",
        timestamp: new Date(baseTime - 30 * 60 * 1000).toISOString(),
        nurse: "Sarah RN",
        note: "Patient reports increased chest discomfort. Pain level 7/10. Morphine 2mg IV administered with good relief. Will continue to monitor closely.",
        category: "pain management",
      },
      {
        id: "2",
        timestamp: new Date(baseTime - 90 * 60 * 1000).toISOString(),
        nurse: "Michael RN",
        note: "Patient ambulated to chair with minimal assistance. Tolerated activity well. Encouraged deep breathing exercises.",
        category: "mobility",
      },
      {
        id: "3",
        timestamp: new Date(baseTime - 180 * 60 * 1000).toISOString(),
        nurse: "Jennifer RN",
        note: "Family visit from daughter. Patient in good spirits. Discussed discharge planning and home care needs.",
        category: "psychosocial",
      },
    ],
  }
}

// Simple chatbot responses
const getChatbotResponse = (message: string, patientData: any): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("medication") || lowerMessage.includes("med")) {
    return `${patientData.name} is currently on ${patientData.medications.length} medications: ${patientData.medications.map((med: any) => `${med.name} ${med.dosage}`).join(", ")}. The next medication due is ${patientData.medications[0].name} at ${patientData.medications[0].nextDue}.`
  }

  if (lowerMessage.includes("vital") || lowerMessage.includes("bp") || lowerMessage.includes("temperature")) {
    return `Latest vitals taken at ${new Date(patientData.vitals.lastTaken).toLocaleTimeString()}: Temperature ${patientData.vitals.temperature}°F, BP ${patientData.vitals.bloodPressure.systolic}/${patientData.vitals.bloodPressure.diastolic}, HR ${patientData.vitals.heartRate}, RR ${patientData.vitals.respiratoryRate}, O2 Sat ${patientData.vitals.oxygenSaturation}%, Pain ${patientData.vitals.painLevel}/10.`
  }

  if (lowerMessage.includes("pain")) {
    return `Current pain level is ${patientData.vitals.painLevel}/10. ${patientData.vitals.painLevel > 5 ? "Patient may need pain medication as ordered." : "Pain is well controlled."} Last pain assessment was updated by ${patientData.activityLog[0].nurse}.`
  }

  if (lowerMessage.includes("activity") || lowerMessage.includes("log")) {
    const recentActivities = patientData.activityLog
      .slice(0, 3)
      .map((log: any) => `${log.action} by ${log.nurse}`)
      .join(", ")
    return `Recent activities: ${recentActivities}. Check the activity log tab for complete details.`
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return `Hello! I'm here to help you with information about ${patientData.name}. You can ask me about medications, vitals, recent activities, pain levels, or any other patient information.`
  }

  return `I can help you with information about ${patientData.name}. Try asking about medications, vitals, recent activities, pain assessment, or nursing notes.`
}

interface PatientDetailsPageProps {
  params: {
    patientId: string
  }
}

export default function PatientDetailsPage({ params }: PatientDetailsPageProps) {
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [patientDetails, setPatientDetails] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [chatMessages, setChatMessages] = useState<Array<{ type: "user" | "bot"; message: string; time: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [newNursingNote, setNewNursingNote] = useState("")
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({})
  const [editValues, setEditValues] = useState<Record<string, any>>({})
  const [showChatbot, setShowChatbot] = useState(false)
  const [currentNurse] = useState("Sarah RN") // In real app, get from auth

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const patientData = mockPatients[params.patientId]
      const detailsData = getComprehensivePatientDetails(params.patientId)

      if (patientData) {
        setPatient(patientData)
        setPatientDetails(detailsData)
        // Initialize chat with welcome message
        setChatMessages([
          {
            type: "bot",
            message: `Hello! I'm here to assist you with ${patientData.name}'s care. You can ask me about medications, vitals, recent activities, or any other patient information.`,
            time: new Date().toLocaleTimeString(),
          },
        ])
      }
      setLoading(false)
    }, 500)
  }, [params.patientId])

  const handleSendMessage = () => {
    if (!chatInput.trim() || !patientDetails) return

    const userMessage = {
      type: "user" as const,
      message: chatInput,
      time: new Date().toLocaleTimeString(),
    }

    const botResponse = {
      type: "bot" as const,
      message: getChatbotResponse(chatInput, { ...patient, ...patientDetails }),
      time: new Date().toLocaleTimeString(),
    }

    setChatMessages((prev) => [...prev, userMessage, botResponse])
    setChatInput("")
  }

  const addActivityLog = (
    action: string,
    category: ActivityLog["category"],
    details: string,
    priority: ActivityLog["priority"] = "medium",
  ) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      nurse: currentNurse,
      action,
      category,
      details,
      priority,
    }

    setPatientDetails((prev: any) => ({
      ...prev,
      activityLog: [newLog, ...prev.activityLog],
    }))

    // Update patient's last modified info
    setPatient((prev: any) => ({
      ...prev,
      lastModified: {
        by: currentNurse,
        at: new Date().toISOString(),
        changes: [action],
      },
    }))
  }

  const handleSaveField = (field: string, value: any, category: ActivityLog["category"]) => {
    setPatientDetails((prev: any) => ({
      ...prev,
      [field]: value,
    }))

    setIsEditing((prev) => ({ ...prev, [field]: false }))
    setEditValues((prev) => ({ ...prev, [field]: undefined }))

    // Add to activity log
    addActivityLog(`Updated ${field}`, category, `${field} updated to: ${JSON.stringify(value)}`)
  }

  const handleAddNursingNote = () => {
    if (!newNursingNote.trim()) return

    const newNote = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      nurse: currentNurse,
      note: newNursingNote,
      category: "general",
    }

    setPatientDetails((prev: any) => ({
      ...prev,
      nursingNotes: [newNote, ...prev.nursingNotes],
    }))

    addActivityLog("Added nursing note", "notes", newNursingNote)
    setNewNursingNote("")
  }

  const getShiftStatus = () => {
    const now = new Date()
    const hour = now.getHours()
    if (hour >= 7 && hour < 19) return "day"
    if (hour >= 19 && hour < 23) return "evening"
    return "night"
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return `${diffMinutes}m ago`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vitals":
        return <Activity className="h-4 w-4" />
      case "medication":
        return <Pill className="h-4 w-4" />
      case "assessment":
        return <Stethoscope className="h-4 w-4" />
      case "notes":
        return <FileText className="h-4 w-4" />
      case "procedure":
        return <UserCheck className="h-4 w-4" />
      case "communication":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Patient Information...</h2>
          <p className="text-gray-600">Please wait while we prepare the patient details</p>
        </div>
      </div>
    )
  }

  if (!patient || !patientDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The requested patient could not be found.</p>
          <Button onClick={() => router.push("/")} className="rounded-2xl">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient List
          </Button>
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
                  {patient.name} - Patient Profile
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Room {patient.room}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Age {patientDetails.demographics.age}</span>
                  </div>
                  <span>•</span>
                  <span>{patient.primaryDiagnosis}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Chatbot Toggle */}
              <Button
                variant={showChatbot ? "default" : "outline"}
                onClick={() => setShowChatbot(!showChatbot)}
                className={`rounded-2xl px-4 py-2 transition-all duration-200 ${
                  showChatbot
                    ? "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-warm"
                    : "border-secondary-200 hover:bg-secondary-50"
                }`}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
                {showChatbot && <span className="ml-2 text-xs">●</span>}
              </Button>

              <div className="flex items-center gap-2 bg-white/60 rounded-2xl px-4 py-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
              </div>

              <Badge className="bg-gradient-to-r from-primary to-primary-400 text-white rounded-2xl px-4 py-2 capitalize">
                {getShiftStatus()} Shift
              </Badge>
            </div>
          </div>

          {/* Last Modified Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-800">
              <UserCheck className="h-4 w-4" />
              <span className="text-sm font-medium">
                Last updated by {patient.lastModified.by} • {getTimeAgo(patient.lastModified.at)}
              </span>
              <span className="text-xs text-blue-600">({patient.lastModified.changes.join(", ")})</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/60 rounded-3xl p-2 mb-8 transition-all duration-300">
              <TabsTrigger
                value="overview"
                className="rounded-2xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-400 data-[state=active]:text-white data-[state=active]:shadow-warm"
              >
                <User className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="vitals"
                className="rounded-2xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-warm"
              >
                <Activity className="h-4 w-4 mr-2" />
                Vitals & Meds
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-2xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-warm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Nursing Notes
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-2xl transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-warm"
              >
                <History className="h-4 w-4 mr-2" />
                Activity Log
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demographics */}
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 slide-in-from-left-4 duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span>Demographics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <Label className="text-gray-500">Date of Birth</Label>
                        <p className="font-medium">
                          {new Date(patientDetails.demographics.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Age</Label>
                        <p className="font-medium">{patientDetails.demographics.age} years</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Gender</Label>
                        <p className="font-medium">{patientDetails.demographics.gender}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Marital Status</Label>
                        <p className="font-medium">{patientDetails.demographics.maritalStatus}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-150">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <span>Emergency Contact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div>
                        <Label className="text-gray-500">Name</Label>
                        <p className="font-medium">{patientDetails.emergencyContact.name}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Relationship</Label>
                        <p className="font-medium">{patientDetails.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500">Phone</Label>
                        <p className="font-medium">{patientDetails.emergencyContact.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="vitals" className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="space-y-6">
                {/* Vital Signs */}
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 slide-in-from-top-4 duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                          <Activity className="h-5 w-5 text-white" />
                        </div>
                        <span>Vital Signs</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Simulate updating vitals
                          const newVitals = {
                            ...patientDetails.vitals,
                            lastTaken: new Date().toISOString(),
                            takenBy: currentNurse,
                          }
                          handleSaveField("vitals", newVitals, "vitals")
                        }}
                        className="rounded-xl"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Update Vitals
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        {
                          icon: Thermometer,
                          value: `${patientDetails.vitals.temperature}°F`,
                          label: "Temperature",
                          delay: "delay-75",
                        },
                        {
                          icon: Heart,
                          value: patientDetails.vitals.heartRate,
                          label: "Heart Rate",
                          delay: "delay-100",
                        },
                        {
                          icon: Zap,
                          value: `${patientDetails.vitals.bloodPressure.systolic}/${patientDetails.vitals.bloodPressure.diastolic}`,
                          label: "Blood Pressure",
                          delay: "delay-150",
                        },
                        {
                          icon: null,
                          value: patientDetails.vitals.respiratoryRate,
                          label: "Respiratory Rate",
                          delay: "delay-200",
                        },
                        {
                          icon: null,
                          value: `${patientDetails.vitals.oxygenSaturation}%`,
                          label: "O2 Saturation",
                          delay: "delay-250",
                        },
                        {
                          icon: null,
                          value: `${patientDetails.vitals.painLevel}/10`,
                          label: "Pain Level",
                          delay: "delay-300",
                          special: true,
                        },
                      ].map((vital, index) => (
                        <div
                          key={index}
                          className={`${vital.special ? "bg-red-50 border border-red-200" : "bg-white/80 border"} rounded-2xl p-3 text-center animate-in fade-in-0 zoom-in-95 duration-500 ${vital.delay}`}
                        >
                          <div
                            className={`text-lg font-bold flex items-center justify-center gap-1 ${vital.special ? "text-red-600" : ""}`}
                          >
                            {vital.icon && <vital.icon className="h-4 w-4" />}
                            {vital.value}
                          </div>
                          <div className={`text-xs ${vital.special ? "text-red-600" : "opacity-70"}`}>
                            {vital.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-xs text-gray-500 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-400">
                      Last taken by {patientDetails.vitals.takenBy} at{" "}
                      {new Date(patientDetails.vitals.lastTaken).toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>

                {/* Medications */}
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <Pill className="h-5 w-5 text-white" />
                      </div>
                      <span>Medications ({patientDetails.medications.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {patientDetails.medications.map((med: any, index: number) => (
                      <div
                        key={index}
                        className={`bg-white/80 rounded-2xl p-3 border-l-4 border-blue-400 animate-in fade-in-0 slide-in-from-left-4 duration-500`}
                        style={{ animationDelay: `${300 + index * 100}ms` }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {med.name} {med.dosage}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {med.route} • {med.frequency} • {med.indication}
                            </p>
                          </div>
                          <Badge variant={med.status === "active" ? "default" : "secondary"} className="rounded-xl">
                            {med.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <Label className="text-gray-500">Next Due</Label>
                            <p className="font-medium">{med.nextDue}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Last Given</Label>
                            <p className="font-medium">{med.lastGiven}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              addActivityLog(
                                `Administered ${med.name}`,
                                "medication",
                                `${med.name} ${med.dosage} ${med.route} given as scheduled. Patient tolerated well.`,
                                "medium",
                              )
                            }}
                            className="rounded-xl text-xs hover:scale-105 transition-transform duration-200"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Mark Given
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              addActivityLog(
                                `Held ${med.name}`,
                                "medication",
                                `${med.name} ${med.dosage} held per clinical judgment.`,
                                "high",
                              )
                            }}
                            className="rounded-xl text-xs hover:scale-105 transition-transform duration-200"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Hold
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <div className="space-y-6">
                {/* Add New Note */}
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 slide-in-from-top-4 duration-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <span>Add Nursing Note</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        value={newNursingNote}
                        onChange={(e) => setNewNursingNote(e.target.value)}
                        placeholder="Enter your nursing note here..."
                        className="min-h-24 rounded-2xl transition-all duration-200 focus:scale-[1.02]"
                      />
                      <Button
                        onClick={handleAddNursingNote}
                        disabled={!newNursingNote.trim()}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl hover:scale-105 transition-all duration-200"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Existing Notes */}
                <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <span>Nursing Notes ({patientDetails.nursingNotes.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-4">
                        {patientDetails.nursingNotes.map((note: any, index: number) => (
                          <div
                            key={note.id}
                            className={`bg-white/80 rounded-2xl p-4 border animate-in fade-in-0 slide-in-from-right-4 duration-500 hover:shadow-md transition-all duration-200`}
                            style={{ animationDelay: `${300 + index * 150}ms` }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="rounded-xl text-xs">
                                  {note.category}
                                </Badge>
                                <span className="text-sm font-medium text-gray-800">{note.nurse}</span>
                              </div>
                              <span className="text-xs text-gray-500">{new Date(note.timestamp).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-700">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
              <Card className="bg-white/60 border-0 shadow-soft rounded-3xl animate-in fade-in-0 zoom-in-95 duration-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <History className="h-5 w-5 text-white" />
                    </div>
                    <span>Activity Log ({patientDetails.activityLog.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {patientDetails.activityLog.map((log: ActivityLog, index: number) => (
                        <div
                          key={log.id}
                          className={`bg-white/80 rounded-2xl p-4 border-l-4 border-purple-400 animate-in fade-in-0 slide-in-from-left-4 duration-500 hover:shadow-md transition-all duration-200`}
                          style={{ animationDelay: `${200 + index * 100}ms` }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(log.category)}
                              <span className="font-medium text-gray-800">{log.action}</span>
                              <Badge className={`rounded-xl text-xs ${getPriorityColor(log.priority)}`}>
                                {log.priority}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-800">{log.nurse}</div>
                              <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{log.details}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Assistant Floating Modal */}
        {showChatbot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl h-[600px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">AI Nursing Assistant</h3>
                      <p className="text-secondary-100 text-sm">Ask me about {patient.name}'s care</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowChatbot(false)}
                    className="text-white hover:bg-white/20 rounded-2xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full px-6 py-4">
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {message.type === "bot" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}

                        <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                          <div
                            className={`rounded-3xl px-4 py-3 shadow-soft ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-primary to-primary-400 text-white ml-auto"
                                : "bg-white border border-gray-200 text-gray-800"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.message}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 px-2">
                            <span className="text-xs text-gray-500">{message.time}</span>
                            {message.type === "bot" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 rounded-full hover:bg-secondary-100"
                                onClick={() => {
                                  if ("speechSynthesis" in window) {
                                    const utterance = new SpeechSynthesisUtterance(message.message)
                                    utterance.rate = 0.9
                                    speechSynthesis.speak(utterance)
                                  }
                                }}
                              >
                                <Volume2 className="h-3 w-3 text-secondary-600" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {message.type === "user" && (
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Quick Suggestions */}
              <div className="px-6 py-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {[
                    "Latest vitals",
                    "Pain assessment",
                    "Recent medications",
                    "Activity summary",
                    "Emergency contact",
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput(suggestion)
                        setTimeout(() => handleSendMessage(), 100)
                      }}
                      className="text-xs h-8 rounded-2xl border-secondary-200 hover:bg-secondary-50 hover:border-secondary-300 transition-all duration-200"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-6 pt-3 bg-gray-50/50 rounded-b-3xl">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about the patient's care..."
                      className="rounded-2xl border-secondary-200 focus:border-secondary-400 focus:ring-secondary-400 pr-12 bg-white/80"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-xl hover:bg-secondary-100"
                      onClick={() => {
                        // Voice input functionality could be added here
                        alert("Voice input feature coming soon!")
                      }}
                    >
                      <Mic className="h-4 w-4 text-secondary-600" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="rounded-2xl bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white px-6 transition-all duration-200 hover:shadow-warm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

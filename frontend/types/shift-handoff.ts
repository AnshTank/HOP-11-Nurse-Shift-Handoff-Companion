export interface ShiftHandoff {
  id: string
  patientId: string
  shiftDate: string
  shiftType: "day" | "evening" | "night"
  startTime: string
  endTime?: string
  status: "active" | "completed" | "pending-review"
}

export interface HandoffEntry {
  id: string
  handoffId: string
  timestamp: string
  inputMethod: "voice" | "text" | "guided"
  category: "assessment" | "interventions" | "pending" | "alerts" | "medications" | "vitals" | "other"
  content: string
  priority: "normal" | "important" | "critical"
  isComplete: boolean
}

export interface PatientSummary {
  patientId: string
  currentShift: ShiftHandoff
  entries: HandoffEntry[]
  completionStatus: {
    assessment: boolean
    vitals: boolean
    medications: boolean
    interventions: boolean
    pending: boolean
    alerts: boolean
  }
  lastUpdated: string
}

export interface GuidedPrompt {
  id: string
  category: string
  question: string
  required: boolean
  completed: boolean
}

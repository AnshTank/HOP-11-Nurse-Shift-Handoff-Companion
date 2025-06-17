export interface Patient {
  id: string
  name: string
  room: string
  admissionDate: string
  primaryDiagnosis: string
  allergies: string[]
  currentMedications: string[]
}

export interface HandoffNote {
  id: string
  patientId: string
  nurseId: string
  nurseName: string
  shift: "day" | "evening" | "night"
  timestamp: string
  inputMethod: "voice" | "text"
  rawContent: string
  structuredContent?: {
    assessment: string
    interventions: string[]
    concerns: string[]
    recommendations: string[]
  }
  priority: "low" | "medium" | "high" | "critical"
}

export interface ShiftHandoff {
  id: string
  patientId: string
  fromShift: string
  toShift: string
  handoffDate: string
  notes: HandoffNote[]
  summary: string
  completedBy: string
  reviewedBy?: string
}

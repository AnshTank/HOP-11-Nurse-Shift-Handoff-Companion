export interface PatientBasic {
  id: string
  name: string
  room: string
  admissionDate: string
  primaryDiagnosis: string
  allergies: string[]
  riskLevel: "low" | "medium" | "high" | "critical"
  isolationStatus?: string
  acuityLevel: 1 | 2 | 3 | 4 | 5 // 5 being most critical
  lastVitalsTime?: string
  nextMedTime?: string
  hasAlerts: boolean
  isPendingDischarge: boolean
  requiresFollowUp: boolean
  nursingNotes: string[]
}

export interface PatientStatus {
  hasNewOrders: boolean
  hasCriticalLabs: boolean
  hasUnreadMessages: boolean
  lastAssessmentTime?: string
  nextScheduledCare?: string
  painLevel?: number
  mobilityStatus: "bedrest" | "assistance" | "independent" | "restricted"
}

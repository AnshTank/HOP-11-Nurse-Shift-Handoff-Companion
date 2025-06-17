export interface PatientBasic {
  id: string
  name: string
  room: string
  admissionDate: string
  primaryDiagnosis: string
  allergies: string[]
  riskLevel: "low" | "medium" | "high" | "critical"
  isolationStatus?: string
}

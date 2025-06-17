import type { Patient } from "./patient" // Assuming Patient is declared in another file

export interface VitalSigns {
  timestamp: string
  temperature: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  respiratoryRate: number
  oxygenSaturation: number
  painLevel: number
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  route: string
  startDate: string
  endDate?: string
  prescribedBy: string
  notes?: string
}

export interface CarePlan {
  id: string
  patientId: string
  goal: string
  interventions: string[]
  expectedOutcome: string
  targetDate: string
  status: "active" | "completed" | "discontinued"
  assignedNurse: string
}

export interface PatientExtended extends Patient {
  vitals: VitalSigns[]
  medications: Medication[]
  carePlans: CarePlan[]
  riskFactors: string[]
  mobilityStatus: string
  dietRestrictions: string[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  insuranceInfo: {
    provider: string
    policyNumber: string
  }
}

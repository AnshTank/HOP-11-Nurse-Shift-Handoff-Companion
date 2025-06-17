export interface Nurse {
  id: string
  name: string
  email: string
  department: string
  specialization: string[]
  yearsExperience: number
  certifications: string[]
  preferredShift: "day" | "evening" | "night"
  avatar?: string
  isOnline: boolean
  currentShift?: {
    start: string
    end: string
    patients: string[]
  }
}

export interface NursePreferences {
  nurseId: string
  voiceInputDefault: boolean
  priorityNotifications: boolean
  autoSaveNotes: boolean
  theme: "light" | "dark"
  language: string
}

export interface ShiftHistory {
  id: string
  nurseId: string
  date: string
  shift: "day" | "evening" | "night"
  patientsHandled: number
  notesCreated: number
  handoffsCompleted: number
}

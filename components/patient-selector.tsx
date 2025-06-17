"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, MapPin, Calendar } from "lucide-react"
import type { Patient } from "@/types/patient"

interface PatientSelectorProps {
  patients: Patient[]
  onSelectPatient: (patient: Patient) => void
  selectedPatient?: Patient
}

export function PatientSelector({ patients, onSelectPatient, selectedPatient }: PatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, room, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-3 max-h-96 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedPatient?.id === patient.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelectPatient(patient)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{patient.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {patient.room}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{patient.primaryDiagnosis}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                  </div>

                  {patient.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

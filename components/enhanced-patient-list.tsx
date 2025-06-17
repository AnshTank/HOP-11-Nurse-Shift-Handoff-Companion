"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, Pill, Activity, User, Bell, Calendar, Thermometer, Shield, ArrowUp } from "lucide-react"
import type { PatientBasic, PatientStatus } from "@/types/patient-enhanced"

interface EnhancedPatientListProps {
  patients: PatientBasic[]
  patientStatuses: Record<string, PatientStatus>
  selectedPatient?: PatientBasic
  onSelectPatient: (patient: PatientBasic) => void
}

export function EnhancedPatientList({
  patients,
  patientStatuses,
  selectedPatient,
  onSelectPatient,
}: EnhancedPatientListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"priority" | "room" | "name" | "acuity">("priority")
  const [filterBy, setFilterBy] = useState<"all" | "critical" | "alerts" | "followup">("all")

  const sortedAndFilteredPatients = useMemo(() => {
    const filtered = patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.primaryDiagnosis.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchesSearch) return false

      switch (filterBy) {
        case "critical":
          return patient.riskLevel === "critical" || patient.acuityLevel >= 4
        case "alerts":
          return patient.hasAlerts || patientStatuses[patient.id]?.hasCriticalLabs
        case "followup":
          return patient.requiresFollowUp || patient.isPendingDischarge
        default:
          return true
      }
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          // Sort by acuity level (highest first), then by alerts, then by risk level
          if (a.acuityLevel !== b.acuityLevel) {
            return b.acuityLevel - a.acuityLevel
          }
          if (a.hasAlerts !== b.hasAlerts) {
            return a.hasAlerts ? -1 : 1
          }
          const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]

        case "acuity":
          return b.acuityLevel - a.acuityLevel

        case "room":
          return a.room.localeCompare(b.room)

        case "name":
          return a.name.localeCompare(b.name)

        default:
          return 0
      }
    })
  }, [patients, patientStatuses, searchTerm, sortBy, filterBy])

  const getAcuityColor = (level: number) => {
    switch (level) {
      case 5:
        return "bg-red-600 text-white"
      case 4:
        return "bg-red-500 text-white"
      case 3:
        return "bg-orange-500 text-white"
      case 2:
        return "bg-yellow-500 text-white"
      case 1:
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
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

  const getTimeUntilNext = (nextTime?: string) => {
    if (!nextTime) return null
    const now = new Date()
    const next = new Date(nextTime)
    const diffMinutes = Math.floor((next.getTime() - now.getTime()) / (1000 * 60))

    if (diffMinutes < 0) return "Overdue"
    if (diffMinutes < 60) return `${diffMinutes}m`
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const getCriticalCount = () => {
    return patients.filter((p) => p.riskLevel === "critical" || p.acuityLevel >= 4).length
  }

  const getAlertsCount = () => {
    return patients.filter((p) => p.hasAlerts || patientStatuses[p.id]?.hasCriticalLabs).length
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>Patients ({sortedAndFilteredPatients.length})</span>
          </div>
          <div className="flex gap-1">
            {getCriticalCount() > 0 && (
              <Badge variant="destructive" className="text-xs">
                {getCriticalCount()} Critical
              </Badge>
            )}
            {getAlertsCount() > 0 && (
              <Badge variant="outline" className="text-xs">
                <Bell className="h-3 w-3 mr-1" />
                {getAlertsCount()}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-3 w-3" />
                    Priority
                  </div>
                </SelectItem>
                <SelectItem value="acuity">Acuity Level</SelectItem>
                <SelectItem value="room">Room Number</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3" />
                    Critical Only
                  </div>
                </SelectItem>
                <SelectItem value="alerts">
                  <div className="flex items-center gap-2">
                    <Bell className="h-3 w-3" />
                    With Alerts
                  </div>
                </SelectItem>
                <SelectItem value="followup">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Follow-up
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {sortedAndFilteredPatients.map((patient) => {
            const status = patientStatuses[patient.id]
            const isSelected = selectedPatient?.id === patient.id

            return (
              <Card
                key={patient.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary shadow-md" : ""
                } ${patient.acuityLevel >= 4 ? "border-l-4 border-l-red-500" : ""}`}
                onClick={() => onSelectPatient(patient)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-base">{patient.name}</h4>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-bold ${getAcuityColor(patient.acuityLevel)}`}
                          >
                            {patient.acuityLevel}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">Room {patient.room}</span>
                          <span>•</span>
                          <span>{patient.primaryDiagnosis}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-xs">
                          {patient.riskLevel.toUpperCase()}
                        </Badge>
                        {patient.isolationStatus && (
                          <Badge variant="destructive" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            {patient.isolationStatus}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex flex-wrap gap-2">
                      {patient.hasAlerts && (
                        <Badge variant="destructive" className="text-xs flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Alert
                        </Badge>
                      )}

                      {status?.hasCriticalLabs && (
                        <Badge variant="destructive" className="text-xs flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          Critical Labs
                        </Badge>
                      )}

                      {status?.hasNewOrders && (
                        <Badge variant="default" className="text-xs flex items-center gap-1">
                          <Bell className="h-3 w-3" />
                          New Orders
                        </Badge>
                      )}

                      {patient.requiresFollowUp && (
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Follow-up
                        </Badge>
                      )}

                      {patient.isPendingDischarge && (
                        <Badge variant="secondary" className="text-xs">
                          Pending D/C
                        </Badge>
                      )}
                    </div>

                    {/* Time-sensitive Information */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {patient.nextMedTime && (
                        <div className="flex items-center gap-1">
                          <Pill className="h-3 w-3 text-blue-600" />
                          <span className="text-muted-foreground">Next med:</span>
                          <span className="font-medium">{getTimeUntilNext(patient.nextMedTime)}</span>
                        </div>
                      )}

                      {patient.lastVitalsTime && (
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">Last vitals:</span>
                          <span className="font-medium">
                            {Math.floor((Date.now() - new Date(patient.lastVitalsTime).getTime()) / (1000 * 60 * 60))}h
                            ago
                          </span>
                        </div>
                      )}

                      {status?.painLevel && status.painLevel > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Pain:</span>
                          <span
                            className={`font-medium ${
                              status.painLevel >= 7
                                ? "text-red-600"
                                : status.painLevel >= 4
                                  ? "text-orange-600"
                                  : "text-green-600"
                            }`}
                          >
                            {status.painLevel}/10
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Mobility:</span>
                        <span className="font-medium capitalize">{status?.mobilityStatus || "Unknown"}</span>
                      </div>
                    </div>

                    {/* Allergies */}
                    {patient.allergies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground mr-1">Allergies:</span>
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
            )
          })}
        </div>

        {sortedAndFilteredPatients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No patients match your search criteria</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

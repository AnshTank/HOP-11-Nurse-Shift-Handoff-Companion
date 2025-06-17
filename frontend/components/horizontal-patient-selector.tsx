"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, AlertTriangle, Pill, Thermometer, Shield, Bell, Calendar, Filter } from "lucide-react"
import type { PatientBasic, PatientStatus } from "@/types/patient-enhanced"

interface HorizontalPatientSelectorProps {
  patients: PatientBasic[]
  patientStatuses: Record<string, PatientStatus>
  selectedPatient?: PatientBasic
  onSelectPatient: (patient: PatientBasic) => void
}

export function HorizontalPatientSelector({
  patients,
  patientStatuses,
  selectedPatient,
  onSelectPatient,
}: HorizontalPatientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "critical" | "alerts" | "followup">("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredPatients = patients.filter((patient) => {
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

  // Sort by priority
  const sortedPatients = filteredPatients.sort((a, b) => {
    if (a.acuityLevel !== b.acuityLevel) {
      return b.acuityLevel - a.acuityLevel
    }
    if (a.hasAlerts !== b.hasAlerts) {
      return a.hasAlerts ? -1 : 1
    }
    const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
  })

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
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header with stats and controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-lg">Patients ({sortedPatients.length})</h3>
              <div className="flex gap-2">
                {getCriticalCount() > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {getCriticalCount()} Critical
                  </Badge>
                )}
                {getAlertsCount() > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    {getAlertsCount()} Alerts
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1"
              >
                <Filter className="h-3 w-3" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search and Filter Controls */}
          {showFilters && (
            <div className="flex gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9"
                />
              </div>

              <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
                <SelectTrigger className="w-40 h-9">
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
          )}

          {/* Horizontal Patient Cards */}
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {sortedPatients.map((patient) => {
                const status = patientStatuses[patient.id]
                const isSelected = selectedPatient?.id === patient.id

                return (
                  <Card
                    key={patient.id}
                    className={`cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-80 ${
                      isSelected ? "ring-2 ring-primary shadow-md" : ""
                    } ${patient.acuityLevel >= 4 ? "border-l-4 border-l-red-500" : ""}`}
                    onClick={() => onSelectPatient(patient)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm truncate">{patient.name}</h4>
                              <div
                                className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${getAcuityColor(patient.acuityLevel)}`}
                              >
                                {patient.acuityLevel}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Room {patient.room}</span>
                              <span className="mx-1">•</span>
                              <span className="truncate">{patient.primaryDiagnosis}</span>
                            </div>
                          </div>

                          <Badge variant={getRiskBadgeVariant(patient.riskLevel)} className="text-xs ml-2">
                            {patient.riskLevel.toUpperCase()}
                          </Badge>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-wrap gap-1">
                          {patient.hasAlerts && (
                            <Badge variant="destructive" className="text-xs flex items-center gap-1">
                              <AlertTriangle className="h-2 w-2" />
                              Alert
                            </Badge>
                          )}

                          {status?.hasCriticalLabs && (
                            <Badge variant="destructive" className="text-xs">
                              Critical Labs
                            </Badge>
                          )}

                          {status?.hasNewOrders && (
                            <Badge variant="default" className="text-xs">
                              New Orders
                            </Badge>
                          )}

                          {patient.requiresFollowUp && (
                            <Badge variant="outline" className="text-xs">
                              Follow-up
                            </Badge>
                          )}

                          {patient.isPendingDischarge && (
                            <Badge variant="secondary" className="text-xs">
                              D/C Pending
                            </Badge>
                          )}

                          {patient.isolationStatus && (
                            <Badge variant="destructive" className="text-xs flex items-center gap-1">
                              <Shield className="h-2 w-2" />
                              Isolation
                            </Badge>
                          )}
                        </div>

                        {/* Time-sensitive Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {patient.nextMedTime && (
                            <div className="flex items-center gap-1">
                              <Pill className="h-3 w-3 text-blue-600" />
                              <span className="text-muted-foreground">Med:</span>
                              <span className="font-medium">{getTimeUntilNext(patient.nextMedTime)}</span>
                            </div>
                          )}

                          {patient.lastVitalsTime && (
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-3 w-3 text-green-600" />
                              <span className="text-muted-foreground">Vitals:</span>
                              <span className="font-medium">
                                {Math.floor(
                                  (Date.now() - new Date(patient.lastVitalsTime).getTime()) / (1000 * 60 * 60),
                                )}
                                h
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
                            <span className="font-medium capitalize text-xs">
                              {status?.mobilityStatus || "Unknown"}
                            </span>
                          </div>
                        </div>

                        {/* Allergies */}
                        {patient.allergies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-muted-foreground">Allergies:</span>
                            {patient.allergies.slice(0, 2).map((allergy, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                            {patient.allergies.length > 2 && (
                              <Badge variant="destructive" className="text-xs">
                                +{patient.allergies.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {sortedPatients.length === 0 && (
                <div className="flex-1 text-center py-8 text-muted-foreground">
                  <p>No patients match your search criteria</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Selected Patient Summary */}
          {selectedPatient && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-bold ${getAcuityColor(selectedPatient.acuityLevel)}`}
                    >
                      {selectedPatient.acuityLevel}
                    </div>
                    <span className="font-semibold">{selectedPatient.name}</span>
                    <Badge variant="outline">Room {selectedPatient.room}</Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Selected for handoff documentation</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

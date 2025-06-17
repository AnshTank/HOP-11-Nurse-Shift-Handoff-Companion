"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, AlertTriangle, Mic, Type, MessageSquare, FileText, Activity } from "lucide-react"
import type { PatientBasic } from "@/types/patient-simple"
import type { PatientSummary, HandoffEntry } from "@/types/shift-handoff"

interface ShiftHandoffInterfaceProps {
  patient: PatientBasic
  summary: PatientSummary
  onAddEntry: (entry: Omit<HandoffEntry, "id" | "timestamp">) => void
  onCompleteShift: () => void
}

export function ShiftHandoffInterface({ patient, summary, onAddEntry, onCompleteShift }: ShiftHandoffInterfaceProps) {
  const [activeInputMethod, setActiveInputMethod] = useState<"voice" | "text" | "guided">("text")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getCompletionPercentage = () => {
    const completed = Object.values(summary.completionStatus).filter(Boolean).length
    const total = Object.keys(summary.completionStatus).length
    return Math.round((completed / total) * 100)
  }

  const getShiftDuration = () => {
    const start = new Date(summary.currentShift.startTime)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60))
    const diffMinutes = Math.floor(((now.getTime() - start.getTime()) % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}h ${diffMinutes}m`
  }

  const getCriticalEntries = () => {
    return summary.entries.filter((entry) => entry.priority === "critical")
  }

  const getPendingEntries = () => {
    return summary.entries.filter((entry) => entry.category === "pending" && !entry.isComplete)
  }

  const getRiskBadgeColor = (risk: string) => {
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

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{patient.name}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  Room {patient.room}
                </Badge>
                <Badge variant={getRiskBadgeColor(patient.riskLevel)}>{patient.riskLevel.toUpperCase()} RISK</Badge>
                {patient.isolationStatus && <Badge variant="destructive">{patient.isolationStatus}</Badge>}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Current Shift</div>
              <div className="font-semibold capitalize">{summary.currentShift.shiftType}</div>
              <div className="text-sm text-muted-foreground">Duration: {getShiftDuration()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3 inline mr-1" />
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium">Primary Diagnosis</div>
              <div className="text-sm text-muted-foreground">{patient.primaryDiagnosis}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Admission Date</div>
              <div className="text-sm text-muted-foreground">
                {new Date(patient.admissionDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Allergies</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None known</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Handoff Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Handoff Completion Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{getCompletionPercentage()}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(summary.completionStatus).map(([category, completed]) => (
                <div key={category} className="flex items-center gap-2">
                  {completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={`text-sm capitalize ${completed ? "text-green-600" : "text-muted-foreground"}`}>
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Alerts */}
      {getCriticalEntries().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts ({getCriticalEntries().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getCriticalEntries().map((entry) => (
                <div key={entry.id} className="bg-white p-3 rounded border-l-4 border-red-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Badge variant="destructive" className="text-xs mb-1">
                        {entry.category.toUpperCase()}
                      </Badge>
                      <p className="text-sm">{entry.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Items */}
      {getPendingEntries().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Clock className="h-5 w-5" />
              Pending Items ({getPendingEntries().length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getPendingEntries().map((entry) => (
                <div key={entry.id} className="bg-white p-3 rounded border-l-4 border-orange-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm">{entry.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Add Handoff Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeInputMethod === "text" ? "default" : "outline"}
              onClick={() => setActiveInputMethod("text")}
              className="flex items-center gap-2"
            >
              <Type className="h-4 w-4" />
              Text Input
            </Button>
            <Button
              variant={activeInputMethod === "voice" ? "default" : "outline"}
              onClick={() => setActiveInputMethod("voice")}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Voice Input
            </Button>
            <Button
              variant={activeInputMethod === "guided" ? "default" : "outline"}
              onClick={() => setActiveInputMethod("guided")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Guided Entry
            </Button>
          </div>

          {/* Input components will be rendered here based on activeInputMethod */}
          <div className="min-h-[200px] border rounded-lg p-4 bg-muted/50">
            <div className="text-center text-muted-foreground">
              {activeInputMethod === "text" && "Text input component will be rendered here"}
              {activeInputMethod === "voice" && "Voice input component will be rendered here"}
              {activeInputMethod === "guided" && "Guided chatbot component will be rendered here"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete Shift Button */}
      <div className="flex justify-end">
        <Button
          onClick={onCompleteShift}
          size="lg"
          className="bg-green-600 hover:bg-green-700"
          disabled={getCompletionPercentage() < 80}
        >
          <FileText className="h-4 w-4 mr-2" />
          Complete Shift Handoff
          {getCompletionPercentage() < 80 && (
            <span className="ml-2 text-xs">({getCompletionPercentage()}% complete)</span>
          )}
        </Button>
      </div>
    </div>
  )
}

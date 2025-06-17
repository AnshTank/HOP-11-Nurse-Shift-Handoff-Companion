"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User, Mic, Type, AlertTriangle, FileText } from "lucide-react"
import type { Patient, HandoffNote } from "@/types/patient"

interface HandoffSummaryProps {
  patient: Patient
  notes: HandoffNote[]
  onGenerateSummary?: () => void
}

export function HandoffSummary({ patient, notes, onGenerateSummary }: HandoffSummaryProps) {
  const sortedNotes = notes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "critical" || priority === "high") {
      return <AlertTriangle className="h-3 w-3" />
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Shift Handoff Summary</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{patient.name}</Badge>
            <Badge variant="outline">{patient.room}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Overview */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Patient Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Primary Diagnosis:</span> {patient.primaryDiagnosis}
            </div>
            <div>
              <span className="font-medium">Admission Date:</span>{" "}
              {new Date(patient.admissionDate).toLocaleDateString()}
            </div>
            {patient.allergies.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-medium">Allergies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Notes ({notes.length})</h3>
            {notes.length > 0 && (
              <Button onClick={onGenerateSummary} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate AI Summary
              </Button>
            )}
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No handoff notes yet. Add your first note above.
            </div>
          ) : (
            <div className="space-y-4">
              {sortedNotes.map((note, index) => (
                <Card key={note.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(note.priority)} className="flex items-center gap-1">
                          {getPriorityIcon(note.priority)}
                          {note.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {note.inputMethod === "voice" ? <Mic className="h-3 w-3" /> : <Type className="h-3 w-3" />}
                          {note.inputMethod}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(note.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <User className="h-3 w-3" />
                        {note.nurseName} - {note.shift} shift
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed">{note.rawContent}</p>

                    {note.structuredContent && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {note.structuredContent.assessment && (
                            <div>
                              <span className="font-medium">Assessment:</span>
                              <p className="mt-1">{note.structuredContent.assessment}</p>
                            </div>
                          )}
                          {note.structuredContent.concerns.length > 0 && (
                            <div>
                              <span className="font-medium">Concerns:</span>
                              <ul className="mt-1 list-disc list-inside">
                                {note.structuredContent.concerns.map((concern, i) => (
                                  <li key={i}>{concern}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

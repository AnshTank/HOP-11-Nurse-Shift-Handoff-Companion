"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, MicOff, Type, Save } from "lucide-react"
import { useVoiceInput } from "@/hooks/use-voice-input"
import type { Patient, HandoffNote } from "@/types/patient"

interface NoteInputProps {
  patient: Patient
  onSaveNote: (note: Omit<HandoffNote, "id" | "timestamp">) => void
}

export function NoteInput({ patient, onSaveNote }: NoteInputProps) {
  const [inputMethod, setInputMethod] = useState<"voice" | "text">("text")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [shift, setShift] = useState<"day" | "evening" | "night">("day")
  const [nurseName, setNurseName] = useState("")
  const [textContent, setTextContent] = useState("")

  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript, setTranscript } =
    useVoiceInput()

  useEffect(() => {
    if (inputMethod === "voice" && transcript) {
      setTextContent(transcript)
    }
  }, [transcript, inputMethod])

  const handleSave = () => {
    if (!textContent.trim() || !nurseName.trim()) return

    const note: Omit<HandoffNote, "id" | "timestamp"> = {
      patientId: patient.id,
      nurseId: "current-nurse", // In real app, get from auth
      nurseName,
      shift,
      inputMethod,
      rawContent: textContent,
      priority,
    }

    onSaveNote(note)
    setTextContent("")
    clearTranscript()
  }

  const getPriorityColor = (p: string) => {
    switch (p) {
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add Handoff Note</span>
          <Badge variant="outline">
            {patient.name} - {patient.room}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nurse and Shift Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Nurse Name</label>
            <input
              type="text"
              value={nurseName}
              onChange={(e) => setNurseName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Shift</label>
            <Select value={shift} onValueChange={(value: "day" | "evening" | "night") => setShift(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day (7AM - 7PM)</SelectItem>
                <SelectItem value="evening">Evening (7PM - 11PM)</SelectItem>
                <SelectItem value="night">Night (11PM - 7AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high" | "critical") => setPriority(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input Method Toggle */}
        <div className="flex gap-2">
          <Button
            variant={inputMethod === "text" ? "default" : "outline"}
            onClick={() => setInputMethod("text")}
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            Text Input
          </Button>
          <Button
            variant={inputMethod === "voice" ? "default" : "outline"}
            onClick={() => setInputMethod("voice")}
            disabled={!isSupported}
            className="flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            Voice Input
            {!isSupported && <span className="text-xs">(Not supported)</span>}
          </Button>
        </div>

        {/* Voice Controls */}
        {inputMethod === "voice" && isSupported && (
          <div className="flex gap-2 items-center">
            <Button
              variant={isListening ? "destructive" : "default"}
              onClick={isListening ? stopListening : startListening}
              className="flex items-center gap-2"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? "Stop Recording" : "Start Recording"}
            </Button>
            {isListening && (
              <Badge variant="destructive" className="animate-pulse">
                Recording...
              </Badge>
            )}
          </div>
        )}

        {/* Text Area */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Patient Notes
            <Badge variant={getPriorityColor(priority)} className="ml-2">
              {priority.toUpperCase()}
            </Badge>
          </label>
          <Textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Enter patient assessment, interventions, concerns, and recommendations..."
            className="min-h-32"
            disabled={inputMethod === "voice" && isListening}
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!textContent.trim() || !nurseName.trim()}
          className="w-full flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Handoff Note
        </Button>
      </CardContent>
    </Card>
  )
}

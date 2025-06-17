"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, AlertTriangle, Save } from "lucide-react"
import type { PatientBasic } from "@/types/patient-enhanced"

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPatient: (patient: Omit<PatientBasic, "id">) => void
}

export function AddPatientModal({ isOpen, onClose, onAddPatient }: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    primaryDiagnosis: "",
    allergies: [] as string[],
    riskLevel: "medium" as "low" | "medium" | "high" | "critical",
    acuityLevel: 3 as 1 | 2 | 3 | 4 | 5,
    isolationStatus: "",
    hasAlerts: false,
    isPendingDischarge: false,
    requiresFollowUp: false,
    nursingNotes: [] as string[],
  })

  const [currentAllergy, setCurrentAllergy] = useState("")
  const [currentNote, setCurrentNote] = useState("")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.room.trim() || !formData.primaryDiagnosis.trim()) {
      alert("Please fill in all required fields")
      return
    }

    const newPatient: Omit<PatientBasic, "id"> = {
      ...formData,
      admissionDate: new Date().toISOString(),
      lastVitalsTime: new Date().toISOString(),
      nextMedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    }

    onAddPatient(newPatient)
    onClose()

    // Reset form
    setFormData({
      name: "",
      room: "",
      primaryDiagnosis: "",
      allergies: [],
      riskLevel: "medium",
      acuityLevel: 3,
      isolationStatus: "",
      hasAlerts: false,
      isPendingDischarge: false,
      requiresFollowUp: false,
      nursingNotes: [],
    })
    setCurrentAllergy("")
    setCurrentNote("")
  }

  const addAllergy = () => {
    if (currentAllergy.trim() && !formData.allergies.includes(currentAllergy.trim())) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, currentAllergy.trim()],
      }))
      setCurrentAllergy("")
    }
  }

  const removeAllergy = (allergy: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const addNote = () => {
    if (currentNote.trim()) {
      setFormData((prev) => ({
        ...prev,
        nursingNotes: [...prev.nursingNotes, currentNote.trim()],
      }))
      setCurrentNote("")
    }
  }

  const removeNote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      nursingNotes: prev.nursingNotes.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-primary-50/30 border-0 shadow-2xl rounded-3xl">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-400 text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Add New Patient</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-2xl">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  1
                </div>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter patient name"
                    className="rounded-2xl border-primary-200 focus:border-primary-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                  <Input
                    value={formData.room}
                    onChange={(e) => setFormData((prev) => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., ICU-101"
                    className="rounded-2xl border-primary-200 focus:border-primary-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Diagnosis *</label>
                <Input
                  value={formData.primaryDiagnosis}
                  onChange={(e) => setFormData((prev) => ({ ...prev, primaryDiagnosis: e.target.value }))}
                  placeholder="Enter primary diagnosis"
                  className="rounded-2xl border-primary-200 focus:border-primary-400"
                  required
                />
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  2
                </div>
                Risk Assessment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                  <Select
                    value={formData.riskLevel}
                    onValueChange={(value: "low" | "medium" | "high" | "critical") =>
                      setFormData((prev) => ({ ...prev, riskLevel: value }))
                    }
                  >
                    <SelectTrigger className="rounded-2xl border-primary-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Risk</SelectItem>
                      <SelectItem value="medium">Medium Risk</SelectItem>
                      <SelectItem value="high">High Risk</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Acuity Level (1-5)</label>
                  <Select
                    value={formData.acuityLevel.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, acuityLevel: Number.parseInt(value) as 1 | 2 | 3 | 4 | 5 }))
                    }
                  >
                    <SelectTrigger className="rounded-2xl border-primary-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Stable</SelectItem>
                      <SelectItem value="2">2 - Stable</SelectItem>
                      <SelectItem value="3">3 - Moderate</SelectItem>
                      <SelectItem value="4">4 - High Acuity</SelectItem>
                      <SelectItem value="5">5 - Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Isolation Status (Optional)</label>
                <Select
                  value={formData.isolationStatus}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, isolationStatus: value }))}
                >
                  <SelectTrigger className="rounded-2xl border-primary-200">
                    <SelectValue placeholder="Select isolation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Isolation</SelectItem>
                    <SelectItem value="contact">Contact Precautions</SelectItem>
                    <SelectItem value="droplet">Droplet Precautions</SelectItem>
                    <SelectItem value="airborne">Airborne Precautions</SelectItem>
                    <SelectItem value="protective">Protective Isolation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  3
                </div>
                Allergies
              </h3>

              <div className="flex gap-2">
                <Input
                  value={currentAllergy}
                  onChange={(e) => setCurrentAllergy(e.target.value)}
                  placeholder="Enter allergy"
                  className="flex-1 rounded-2xl border-primary-200 focus:border-primary-400"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAllergy())}
                />
                <Button
                  type="button"
                  onClick={addAllergy}
                  className="bg-gradient-to-r from-primary to-primary-400 text-white rounded-2xl px-4"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <Badge
                      key={index}
                      variant="destructive"
                      className="rounded-xl flex items-center gap-1 cursor-pointer"
                      onClick={() => removeAllergy(allergy)}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {allergy}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Status Flags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  4
                </div>
                Status Flags
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAlerts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hasAlerts: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Has Active Alerts</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresFollowUp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requiresFollowUp: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Requires Follow-up</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPendingDischarge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isPendingDischarge: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Pending Discharge</span>
                </label>
              </div>
            </div>

            {/* Initial Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                  5
                </div>
                Initial Notes (Optional)
              </h3>

              <div className="flex gap-2">
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Add initial nursing note"
                  className="flex-1 rounded-2xl border-primary-200 focus:border-primary-400 resize-none"
                  rows={2}
                />
                <Button
                  type="button"
                  onClick={addNote}
                  className="bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white rounded-2xl px-4 self-start"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.nursingNotes.length > 0 && (
                <div className="space-y-2">
                  {formData.nursingNotes.map((note, index) => (
                    <div
                      key={index}
                      className="bg-white/60 rounded-2xl p-3 border border-primary-100 flex justify-between items-start"
                    >
                      <p className="text-sm text-gray-700 flex-1">{note}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeNote(index)}
                        className="text-gray-500 hover:text-red-500 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl border-primary-200 hover:bg-primary-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-primary to-primary-400 hover:from-primary-600 hover:to-primary-500 text-white rounded-2xl"
              >
                <Save className="h-4 w-4 mr-2" />
                Add Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

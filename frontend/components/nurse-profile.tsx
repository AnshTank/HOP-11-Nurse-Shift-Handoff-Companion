"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Award, Edit, Save, X } from "lucide-react"
import type { Nurse, NursePreferences, ShiftHistory } from "@/types/nurse"

interface NurseProfileProps {
  nurse: Nurse
  preferences: NursePreferences
  shiftHistory: ShiftHistory[]
  onUpdateNurse: (nurse: Nurse) => void
  onUpdatePreferences: (preferences: NursePreferences) => void
}

export function NurseProfile({
  nurse,
  preferences,
  shiftHistory,
  onUpdateNurse,
  onUpdatePreferences,
}: NurseProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedNurse, setEditedNurse] = useState(nurse)
  const [editedPreferences, setEditedPreferences] = useState(preferences)

  const handleSave = () => {
    onUpdateNurse(editedNurse)
    onUpdatePreferences(editedPreferences)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedNurse(nurse)
    setEditedPreferences(preferences)
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const totalShifts = shiftHistory.length
  const totalPatients = shiftHistory.reduce((sum, shift) => sum + shift.patientsHandled, 0)
  const totalNotes = shiftHistory.reduce((sum, shift) => sum + shift.notesCreated, 0)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={nurse.avatar || "/placeholder.svg"} />
              <AvatarFallback>{getInitials(nurse.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{nurse.name}</h3>
              <p className="text-sm text-muted-foreground">{nurse.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={nurse.isOnline ? "default" : "secondary"}>{nurse.isOnline ? "Online" : "Offline"}</Badge>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Full Name</label>
                {isEditing ? (
                  <Input
                    value={editedNurse.name}
                    onChange={(e) => setEditedNurse({ ...editedNurse, name: e.target.value })}
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{nurse.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                {isEditing ? (
                  <Input
                    value={editedNurse.email}
                    onChange={(e) => setEditedNurse({ ...editedNurse, email: e.target.value })}
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{nurse.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                {isEditing ? (
                  <Select
                    value={editedNurse.department}
                    onValueChange={(value) => setEditedNurse({ ...editedNurse, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Surgical">Surgical</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Oncology">Oncology</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{nurse.department}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedNurse.yearsExperience}
                    onChange={(e) =>
                      setEditedNurse({ ...editedNurse, yearsExperience: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                ) : (
                  <p className="text-sm p-2 bg-muted rounded">{nurse.yearsExperience} years</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Preferred Shift</label>
                {isEditing ? (
                  <Select
                    value={editedNurse.preferredShift}
                    onValueChange={(value: "day" | "evening" | "night") =>
                      setEditedNurse({ ...editedNurse, preferredShift: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day (7AM - 7PM)</SelectItem>
                      <SelectItem value="evening">Evening (7PM - 11PM)</SelectItem>
                      <SelectItem value="night">Night (11PM - 7AM)</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm p-2 bg-muted rounded capitalize">{nurse.preferredShift}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Specializations</label>
              <div className="flex flex-wrap gap-2">
                {nurse.specialization.map((spec, index) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {nurse.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Voice Input by Default</label>
                  <p className="text-xs text-muted-foreground">Use voice input as the default method for notes</p>
                </div>
                <Switch
                  checked={editedPreferences.voiceInputDefault}
                  onCheckedChange={(checked) =>
                    setEditedPreferences({ ...editedPreferences, voiceInputDefault: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Priority Notifications</label>
                  <p className="text-xs text-muted-foreground">Receive notifications for high-priority patients</p>
                </div>
                <Switch
                  checked={editedPreferences.priorityNotifications}
                  onCheckedChange={(checked) =>
                    setEditedPreferences({ ...editedPreferences, priorityNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto-save Notes</label>
                  <p className="text-xs text-muted-foreground">Automatically save notes as you type</p>
                </div>
                <Switch
                  checked={editedPreferences.autoSaveNotes}
                  onCheckedChange={(checked) => setEditedPreferences({ ...editedPreferences, autoSaveNotes: checked })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select
                  value={editedPreferences.language}
                  onValueChange={(value) => setEditedPreferences({ ...editedPreferences, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalShifts}</div>
                  <p className="text-sm text-muted-foreground">Total Shifts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{totalPatients}</div>
                  <p className="text-sm text-muted-foreground">Patients Cared For</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalNotes}</div>
                  <p className="text-sm text-muted-foreground">Notes Created</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recent Shifts</h4>
              {shiftHistory.slice(0, 5).map((shift) => (
                <Card key={shift.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{new Date(shift.date).toLocaleDateString()}</p>
                          <p className="text-sm text-muted-foreground capitalize">{shift.shift} shift</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{shift.patientsHandled} patients</p>
                        <p className="text-xs text-muted-foreground">{shift.notesCreated} notes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

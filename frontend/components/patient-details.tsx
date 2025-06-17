"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Heart,
  Thermometer,
  Activity,
  Pill,
  ClipboardList,
  Phone,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react"
import type { PatientExtended } from "@/types/patient-extended"

interface PatientDetailsProps {
  patient: PatientExtended
  onUpdatePatient?: (patient: PatientExtended) => void
}

export function PatientDetails({ patient, onUpdatePatient }: PatientDetailsProps) {
  const [selectedTab, setSelectedTab] = useState("overview")

  const latestVitals = patient.vitals[patient.vitals.length - 1]
  const activeMedications = patient.medications.filter((med) => !med.endDate || new Date(med.endDate) > new Date())
  const activeCarePlans = patient.carePlans.filter((plan) => plan.status === "active")

  const getVitalStatus = (vital: string, value: number) => {
    const ranges = {
      temperature: { normal: [97, 99], low: 97, high: 99 },
      heartRate: { normal: [60, 100], low: 60, high: 100 },
      systolic: { normal: [90, 140], low: 90, high: 140 },
      diastolic: { normal: [60, 90], low: 60, high: 90 },
      respiratoryRate: { normal: [12, 20], low: 12, high: 20 },
      oxygenSaturation: { normal: [95, 100], low: 95, high: 100 },
    }

    const range = ranges[vital as keyof typeof ranges]
    if (!range) return "normal"

    if (value < range.low) return "low"
    if (value > range.high) return "high"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-600 bg-red-50"
      case "low":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-green-600 bg-green-50"
    }
  }

  const getRiskLevel = () => {
    const riskFactors = patient.riskFactors.length
    if (riskFactors >= 3) return { level: "High", color: "destructive", progress: 80 }
    if (riskFactors >= 2) return { level: "Medium", color: "default", progress: 50 }
    return { level: "Low", color: "secondary", progress: 20 }
  }

  const riskAssessment = getRiskLevel()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">{patient.name}</h3>
              <p className="text-sm text-muted-foreground">Room {patient.room}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={riskAssessment.color}>Risk: {riskAssessment.level}</Badge>
            <Badge variant="outline">{new Date(patient.admissionDate).toLocaleDateString()}</Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Primary Diagnosis</h4>
                  <p className="text-sm">{patient.primaryDiagnosis}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Mobility Status</h4>
                  <p className="text-sm">{patient.mobilityStatus}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Risk Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Risk Level</span>
                    <span className="font-medium">{riskAssessment.level}</span>
                  </div>
                  <Progress value={riskAssessment.progress} className="h-2" />
                </div>
              </div>

              {patient.riskFactors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Risk Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.allergies.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 text-red-600">Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.dietRestrictions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Diet Restrictions</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.dietRestrictions.map((restriction, index) => (
                      <Badge key={index} variant="secondary">
                        {restriction}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-4">
            {latestVitals ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Thermometer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                      <div
                        className={`text-lg font-bold p-2 rounded ${getStatusColor(getVitalStatus("temperature", latestVitals.temperature))}`}
                      >
                        {latestVitals.temperature}°F
                      </div>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
                      <div
                        className={`text-lg font-bold p-2 rounded ${getStatusColor(getVitalStatus("heartRate", latestVitals.heartRate))}`}
                      >
                        {latestVitals.heartRate}
                      </div>
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Activity className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <div
                        className={`text-lg font-bold p-2 rounded ${getStatusColor(getVitalStatus("systolic", latestVitals.bloodPressure.systolic))}`}
                      >
                        {latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}
                      </div>
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <div
                        className={`text-lg font-bold p-2 rounded ${getStatusColor(getVitalStatus("oxygenSaturation", latestVitals.oxygenSaturation))}`}
                      >
                        {latestVitals.oxygenSaturation}%
                      </div>
                      <p className="text-xs text-muted-foreground">O2 Saturation</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Pain Level</h4>
                      <Badge
                        variant={
                          latestVitals.painLevel >= 7
                            ? "destructive"
                            : latestVitals.painLevel >= 4
                              ? "default"
                              : "secondary"
                        }
                      >
                        {latestVitals.painLevel}/10
                      </Badge>
                    </div>
                    <Progress value={latestVitals.painLevel * 10} className="h-3" />
                  </CardContent>
                </Card>

                <p className="text-xs text-muted-foreground">
                  Last updated: {new Date(latestVitals.timestamp).toLocaleString()}
                </p>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No vital signs recorded yet.</div>
            )}
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Active Medications ({activeMedications.length})</h4>
              <Button variant="outline" size="sm">
                <Pill className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {activeMedications.length > 0 ? (
              <div className="space-y-3">
                {activeMedications.map((medication) => (
                  <Card key={medication.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium">{medication.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {medication.dosage} - {medication.frequency} ({medication.route})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Prescribed by: {medication.prescribedBy}</p>
                          {medication.notes && <p className="text-xs text-blue-600 mt-1">{medication.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Started: {new Date(medication.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No active medications.</div>
            )}
          </TabsContent>

          <TabsContent value="care-plans" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Active Care Plans ({activeCarePlans.length})</h4>
              <Button variant="outline" size="sm">
                <ClipboardList className="h-4 w-4 mr-2" />
                Add Care Plan
              </Button>
            </div>

            {activeCarePlans.length > 0 ? (
              <div className="space-y-3">
                {activeCarePlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{plan.goal}</h5>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(plan.targetDate).toLocaleDateString()}
                          </Badge>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-1">Interventions:</p>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {plan.interventions.map((intervention, index) => (
                              <li key={index}>{intervention}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium">Expected Outcome:</p>
                          <p className="text-sm text-muted-foreground">{plan.expectedOutcome}</p>
                        </div>

                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Assigned to: {plan.assignedNurse}</span>
                          <Badge variant="secondary">{plan.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No active care plans.</div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">Emergency Contact</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{patient.emergencyContact.name}</p>
                    <p className="text-sm text-muted-foreground">{patient.emergencyContact.relationship}</p>
                    <p className="text-sm">{patient.emergencyContact.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium">Insurance Information</h4>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{patient.insuranceInfo.provider}</p>
                    <p className="text-sm text-muted-foreground">Policy: {patient.insuranceInfo.policyNumber}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

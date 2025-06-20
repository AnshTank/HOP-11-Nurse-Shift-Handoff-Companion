"use client";

import type React from "react";
import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Plus,
  Save,
  AlertCircle,
  Star,
  FileText,
  Phone,
  User,
  Camera,
  Thermometer,
  Syringe,
  Activity,
} from "lucide-react";
import type { PatientBasic } from "@/types/patient-enhanced";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Omit<PatientBasic, "id">) => void;
}

export function AddPatientModal({
  isOpen,
  onClose,
  onAddPatient,
}: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    // Personal Info
    name: "",
    room: "",
    primaryDiagnosis: "",
    birthDate: "",
    age: "",
    gender: "",
    maritalStatus: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    // Risk & Acuity
    riskLevel: "medium" as "low" | "medium" | "high" | "critical",
    acuityLevel: 3 as 1 | 2 | 3 | 4 | 5,
    isolationType: "",
    // Vitals
    vitals: {
      temperature: "",
      heartRate: "",
      bloodPressure: "",
      respiratoryRate: "",
      oxygenSaturation: "",
      painLevel: "",
    },
    // Medications & Allergies
    medications: [] as string[],
    currentMedication: "",
    allergies: [] as string[],
    currentAllergy: "",
    // Nursing Notes
    nursingNotes: [] as string[],
    currentNote: "",
    // Flags
    hasAlerts: false,
    requiresFollowUp: false,
    isPendingDischarge: false,
    // imageUrl: "",
    hasCriticalLabs: false,
    labs: [] as string[],
    imaging: [] as string[],
    diagnostics: [] as string[],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVitalChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [name]: value },
    }));
  };

  const addToList = (listKey: keyof typeof formData, fieldKey: string) => {
    const item = (formData as any)[fieldKey].trim();
    if (item) {
      setFormData((prev) => ({
        ...prev,
        [listKey]: [...(prev as any)[listKey], item],
        [fieldKey]: "",
      }));
    }
  };

  const removeFromList = (listKey: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [listKey]: (prev as any)[listKey].filter((x: string) => x !== value),
    }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newPatient: Omit<PatientBasic, "id"> = {
      ...formData,
      admissionDate: new Date().toISOString(),
      lastVitalsTime: new Date().toISOString(),
      nextMedTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    };
    onAddPatient(newPatient);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl p-6 md:p-10 my-10 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Plus className="w-6 h-6" /> Add New Patient
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Information */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                name="room"
                placeholder="Room No."
                value={formData.room}
                onChange={handleChange}
              />
              <Input
                name="primaryDiagnosis"
                placeholder="Primary Diagnosis"
                value={formData.primaryDiagnosis}
                onChange={handleChange}
              />
              <Input
                name="birthDate"
                placeholder="Date of Birth"
                value={formData.birthDate}
                onChange={handleChange}
              />
              <Input
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
              <Select
                value={formData.gender}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, gender: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Input
                name="maritalStatus"
                placeholder="Marital Status"
                value={formData.maritalStatus}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* 2. Emergency Contact */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="emergencyContactName"
                placeholder="Contact Name"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
              <Input
                name="emergencyContactRelationship"
                placeholder="Relationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
              />
              <Input
                name="emergencyContactPhone"
                placeholder="Phone Number"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* 3. Risk & Acuity */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Risk & Acuity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={formData.riskLevel}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, riskLevel: val as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="critical">🔴 Critical</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={formData.acuityLevel.toString()}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    acuityLevel: parseInt(val) as any,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Acuity Level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <SelectItem key={lvl} value={lvl.toString()}>
                      {lvl} <Star className="inline w-4 h-4 text-yellow-400" />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={formData.isolationType}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, isolationType: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Isolation Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="contact">Contact</SelectItem>
                  <SelectItem value="droplet">Droplet</SelectItem>
                  <SelectItem value="airborne">Airborne</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* 4. Vitals */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-500" />
              Vitals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="temperature"
                placeholder="Temperature (°C)"
                value={formData.vitals.temperature}
                onChange={handleVitalChange}
              />
              <Input
                name="heartRate"
                placeholder="Heart Rate (bpm)"
                value={formData.vitals.heartRate}
                onChange={handleVitalChange}
              />
              <Input
                name="bloodPressure"
                placeholder="BP (e.g., 120/80)"
                value={formData.vitals.bloodPressure}
                onChange={handleVitalChange}
              />
              <Input
                name="respiratoryRate"
                placeholder="Respiratory Rate"
                value={formData.vitals.respiratoryRate}
                onChange={handleVitalChange}
              />
              <Input
                name="oxygenSaturation"
                placeholder="O₂ Sat (%)"
                value={formData.vitals.oxygenSaturation}
                onChange={handleVitalChange}
              />
              <Input
                name="painLevel"
                placeholder="Pain Level (1-10)"
                value={formData.vitals.painLevel}
                onChange={handleVitalChange}
              />
            </div>
          </section>

          {/* 5. Medications */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Syringe className="w-5 h-5 text-green-600" />
              Medications
            </h3>
            <div className="flex gap-2 items-center">
              <Input
                name="currentMedication"
                placeholder="Add Medication"
                value={formData.currentMedication}
                onChange={handleChange}
              />
              <Button
                type="button"
                onClick={() => addToList("medications", "currentMedication")}
                variant="secondary"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.medications.map((m, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  {m}{" "}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeFromList("medications", m)}
                  />
                </Badge>
              ))}
            </div>
          </section>

          {/* 6. Allergies */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Allergies
            </h3>
            <div className="flex gap-2 items-center">
              <Input
                name="currentAllergy"
                placeholder="Add Allergy"
                value={formData.currentAllergy}
                onChange={handleChange}
              />
              <Button
                type="button"
                onClick={() => addToList("allergies", "currentAllergy")}
                variant="secondary"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((a, i) => (
                <Badge
                  key={i}
                  variant="destructive"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  {a}{" "}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeFromList("allergies", a)}
                  />
                </Badge>
              ))}
            </div>
          </section>

          {/* 7. Nursing Notes */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Nursing Notes
            </h3>
            <div className="flex gap-2 items-start">
              <Textarea
                name="currentNote"
                placeholder="Add a note..."
                value={formData.currentNote}
                onChange={handleChange}
              />
              <Button
                type="button"
                onClick={() => addToList("nursingNotes", "currentNote")}
                variant="secondary"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <ul className="list-disc pl-6 space-y-1">
              {formData.nursingNotes.map((n, i) => (
                <li key={i} className="flex justify-between items-center">
                  {n}
                  <X
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    onClick={() => removeFromList("nursingNotes", n)}
                  />
                </li>
              ))}
            </ul>
          </section>

          {/* 8. Image Upload
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Camera className="w-5 h-5 text-gray-600" />
              Profile Image
            </h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Patient"
                className="w-32 h-32 rounded-lg object-cover"
              />
            )}
          </section> */}

          {/* 9. Status Flags */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Status Flags
            </h3>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasAlerts}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasAlerts: e.target.checked,
                    }))
                  }
                />{" "}
                Has Alerts
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.requiresFollowUp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requiresFollowUp: e.target.checked,
                    }))
                  }
                />{" "}
                Follow-up Needed
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPendingDischarge}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPendingDischarge: e.target.checked,
                    }))
                  }
                />{" "}
                Pending Discharge
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasCriticalLabs}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasCriticalLabs: e.target.checked,
                    }))
                  }
                />
                Critical Lab Results
              </label>
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="w-5 h-5 mr-1" /> Save Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

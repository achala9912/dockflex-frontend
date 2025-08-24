"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppointmentFormData } from "@/schemas/Appointment/AppointmentSchema";
import FormField from "@/components/Fields/FormField";
import Dropdown from "@/components/Dropdown/Dropdown";
import InputField from "@/components/InputField/InputField";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import SearchBar from "@/components/Searchbar/Searchbar";
import { getPatientSuggestions } from "@/api/patientsApi";
import { getSessionSuggestions } from "@/api/sessionsApi";
import { toast } from "react-toastify";

interface Patient {
  _id: string;
  patientId: string;
  patientName: string;
  contactNo: string;
  email: string;
  age: string;
  nic?: string;
  dob?: string;
  address: string;
  searchTerm?: string;
}

interface Session {
  id: string; // Changed from _id to id
  sessionId: string;
  sessionName: string;
}

interface Suggestion {
  value: string;
  label: string;
}

function AppointmentForm() {
  const [formData, setFormData] = useState<AppointmentFormData>({
    centerId: "",
    sessionId: "",
    date: "",
    contactNo: "",
    email: "",
    patientId: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof AppointmentFormData, string>>
  >({});
  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessionOptions, setSessionOptions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof AppointmentFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    if (field === "centerId") {
      // reset dependent fields
      setFormData((prev) => ({
        ...prev,
        sessionId: "",
        patientId: "",
        contactNo: "",
        email: "",
      }));
      setSessionOptions([]);
      setPatients([]);
    }
  };

  // Handle contact number change and fetch patients
  const handleContactChange = useCallback(
    async (contactNo: string) => {
      setFormData((prev) => ({ ...prev, contactNo }));

      // Clear errors when user types
      if (errors.contactNo) {
        setErrors((prev) => ({ ...prev, contactNo: undefined }));
      }

      // Only search if we have a contact number and center selected
      if (!contactNo.trim() || !formData.centerId) {
        setPatients([]);
        return;
      }

      try {
        const result = await getPatientSuggestions(
          contactNo,
          formData.centerId
        );
        console.log("Patient suggestions:", result);
        setPatients(result || []);
      } catch (err: any) {
        console.error("Failed to fetch patient suggestions:", err);
        toast.error(err.message || "Failed to fetch patient suggestions.");
        setPatients([]);
      }
    },
    [formData.centerId, errors.contactNo]
  );

  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients.find((p) => p._id === patientId);
    if (!selectedPatient) return;

    setFormData((prev) => ({
      ...prev,
      contactNo: selectedPatient.contactNo || "",
      email: selectedPatient.email || "",
      patientId: selectedPatient._id || "",
    }));

    if (errors.contactNo) {
      setErrors((prev) => ({ ...prev, contactNo: undefined }));
    }
  };

  // Handle session dropdown change
  const handleSessionChange = (value: string | string[]) => {
    const sessionValue = Array.isArray(value) ? value[0] : value;
    handleInputChange("sessionId", sessionValue);
  };

  // Fetch sessions when center changes
  const fetchSessions = useCallback(async () => {
    if (!formData.centerId) {
      setSessionOptions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getSessionSuggestions(formData.centerId);
      console.log("Session API response in component:", response);
      console.log("Response type:", typeof response);
      console.log("Is array:", Array.isArray(response));
      
      // Ensure we have an array to work with
      const sessionsArray = Array.isArray(response) ? response : [];
      console.log("Sessions array:", sessionsArray);
      
      const transformed: Suggestion[] = sessionsArray.map((session: Session) => {
        console.log("Mapping session:", session);
        return {
          value: session.id,
          label: session.sessionName,
        };
      });
      
      console.log("Transformed sessions:", transformed);
      setSessionOptions(transformed);
    } catch (err: any) {
      console.error("Failed to fetch sessions:", err);
      toast.error(err.message || "Failed to fetch sessions.");
      setSessionOptions([]);
    } finally {
      setLoading(false);
    }
  }, [formData.centerId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Create patient suggestions for SearchBar
  const patientSuggestions: string[] = patients.map(
    (p) => `${p.patientName} - ${p.contactNo}`
  );

  const selectedPatient = patients.find((p) => p._id === formData.patientId);

  return (
    <div className="space-y-6">
      {/* Medical Center & Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Medical Center" error={errors.centerId}>
          <CenterDropdown
            id="centerId"
            value={formData.centerId}
            onChange={(val: string) => handleInputChange("centerId", val)}
            placeholder="Select Medical Center"
          />
        </FormField>

        <FormField label="Date" error={errors.date}>
          <DatePicker
            id="date"
            value={formData.date}
            dateFormat="yyyy-MM-dd"
            onDateChange={(date: string) => handleInputChange("date", date)}
            className="w-full"
            placeholder="Select a Date"
          />
        </FormField>
      </div>

      {/* Session & Contact */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Session" error={errors.sessionId}>
          <Dropdown
            id="sessionId"
            value={formData.sessionId}
            options={sessionOptions}
            placeholder="Select a Session"
            disabled={loading || !formData.centerId}
            onChange={handleSessionChange}
          />
        </FormField>

        <FormField label="Contact No" error={errors.contactNo}>
          <SearchBar
            id="contactNo"
            value={formData.contactNo}
            placeholder="Search by contact number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleContactChange(e.target.value)
            }
            suggestions={patientSuggestions}
            onSuggestionSelect={(suggestion: string) => {
              // Find patient by matching the suggestion format
              const patient = patients.find(
                (p) => suggestion === `${p.patientName} - ${p.contactNo}`
              );
              if (patient) {
                handlePatientSelect(patient._id);
              }
            }}
          />
        </FormField>
      </div>

      {/* Patient Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Patient Name">
          <InputField
            id="patientName"
            type="text"
            value={selectedPatient?.patientName || ""}
            placeholder="Patient name"
            readOnly
          />
        </FormField>

        <FormField label="Age">
          <InputField
            id="age"
            type="number"
            value={selectedPatient?.age || ""}
            placeholder="Age"
            readOnly
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email">
          <InputField
            id="email"
            type="email"
            value={formData.email}
            placeholder="Email"
            readOnly
          />
        </FormField>

        <FormField label="Address">
          <InputField
            id="address"
            type="text"
            value={selectedPatient?.address || ""}
            placeholder="Address"
            readOnly
          />
        </FormField>
      </div>

      {/* Remarks */}
      <FormField label="Remarks (Optional)" error={errors.remarks}>
        <InputField
          id="remarks"
          type="text"
          value={formData.remarks}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
          placeholder="Enter remarks"
        />
      </FormField>
    </div>
  );
}

export default AppointmentForm;
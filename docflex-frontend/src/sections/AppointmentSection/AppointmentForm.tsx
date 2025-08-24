"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
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
  title: any;
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
  id: string;
  sessionId: string;
  sessionName: string;
}

interface Suggestion {
  value: string;
  label: string;
}

function AppointmentForm() {
  // Use React Hook Form context instead of local state
  const {
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext<AppointmentFormData>();

  // Watch form values
  const centerId = watch("centerId");
  const contactNo = watch("contactNo");
  const sessionId = watch("sessionId");
  const patientId = watch("patientId");
  const email = watch("email");
  const remarks = watch("remarks");
  const date = watch("date");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessionOptions, setSessionOptions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    field: keyof AppointmentFormData,
    value: string
  ) => {
    setValue(field, value);

    if (errors[field]) {
      clearErrors(field);
    }

    if (field === "centerId") {
      // reset dependent fields
      setValue("sessionId", "");
      setValue("patientId", "");
      setValue("contactNo", "");
      setValue("email", "");
      setSessionOptions([]);
      setPatients([]);
    }
  };

  // Handle contact number change and fetch patients
  const handleContactChange = useCallback(
    async (contactNo: string) => {
      setValue("contactNo", contactNo);

      // Clear errors when user types
      if (errors.contactNo) {
        clearErrors("contactNo");
      }

      // Only search if we have a contact number and center selected
      if (!contactNo.trim() || !centerId) {
        setPatients([]);
        return;
      }

      try {
        const result = await getPatientSuggestions(contactNo, centerId);
        console.log("Patient suggestions:", result);
        setPatients(result || []);
      } catch (err: any) {
        console.error("Failed to fetch patient suggestions:", err);
        toast.error(err.message || "Failed to fetch patient suggestions.");
        setPatients([]);
      }
    },
    [centerId, errors.contactNo, setValue, clearErrors]
  );

  const handlePatientSelect = (patientId: string) => {
    const selectedPatient = patients.find((p) => p._id === patientId);
    if (!selectedPatient) return;

    setValue("contactNo", selectedPatient.contactNo || "");
    setValue("email", selectedPatient.email || "");
    setValue("patientId", selectedPatient._id || "");

    if (errors.contactNo) {
      clearErrors("contactNo");
    }
  };

  // Handle session dropdown change
  const handleSessionChange = (value: string | string[]) => {
    const sessionValue = Array.isArray(value) ? value[0] : value;
    handleInputChange("sessionId", sessionValue);
  };

  // Fetch sessions when center changes
  const fetchSessions = useCallback(async () => {
    if (!centerId) {
      setSessionOptions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await getSessionSuggestions(centerId);
      console.log("Session API response in component:", response);
      
      const sessionsArray = Array.isArray(response) ? response : [];
      console.log("Sessions array:", sessionsArray);
      
      const transformed: Suggestion[] = sessionsArray.map((session: Session) => {
        console.log("Mapping session:", session);
        return {
          value: session.sessionId,
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
  }, [centerId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Create patient suggestions for SearchBar
  const patientSuggestions: string[] = patients.map(
    (p) => `${p.title} ${p.patientName} - ${p.contactNo}`
  );

  const selectedPatient = patients.find((p) => p._id === patientId);

  return (
    <div className="space-y-6">
      {/* Medical Center & Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Medical Center" error={errors.centerId?.message}>
          <CenterDropdown
            id="centerId"
            value={centerId || ""}
            onChange={(val: string) => handleInputChange("centerId", val)}
            placeholder="Select Medical Center"
          />
        </FormField>

        <FormField label="Date" error={errors.date?.message}>
          <DatePicker
            id="date"
            value={date || ""}
            dateFormat="yyyy-MM-dd"
            onDateChange={(date: string) => handleInputChange("date", date)}
            className="w-full"
            placeholder="Select a Date"
          />
        </FormField>
      </div>

      {/* Session & Contact */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Session" error={errors.sessionId?.message}>
          <Dropdown
            id="sessionId"
            value={sessionId || ""}
            options={sessionOptions}
            placeholder="Select a Session"
            readOnly={loading || !centerId}
            onChange={handleSessionChange}
          />
        </FormField>

        <FormField label="Contact No" error={errors.contactNo?.message}>
          <SearchBar
            id="contactNo"
            value={contactNo || ""}
            placeholder="Search by contact number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleContactChange(e.target.value)
            }
            suggestions={patientSuggestions}
            onSuggestionSelect={(suggestion: string) => {
              // Find patient by matching the suggestion format
              const patient = patients.find(
                (p) => suggestion === `${p.title} ${p.patientName} - ${p.contactNo}`
              );
              if (patient) {
                handlePatientSelect(patient._id);
              }
            }}
            readOnly={loading || !centerId}
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
            value={email || ""}
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
      <FormField label="Remarks (Optional)" error={errors.remarks?.message}>
        <InputField
          id="remarks"
          type="text"
          value={remarks || ""}
          onChange={(e) => handleInputChange("remarks", e.target.value)}
          placeholder="Enter remarks"
        />
      </FormField>
    </div>
  );
}

export default AppointmentForm;
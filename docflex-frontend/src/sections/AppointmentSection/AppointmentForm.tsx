"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

import { AppointmentFormData } from "@/schemas/Appointment/AppointmentSchema";
import FormField from "@/components/Fields/FormField";
import CenterDropdown from "@/components/Dropdown/CenterDropdown";
import Dropdown from "@/components/Dropdown/Dropdown";
import InputField from "@/components/InputField/InputField";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import SearchBar from "@/components/Searchbar/Searchbar";

import { getPatientSuggestions } from "@/api/patientsApi";
import { getSessionSuggestions } from "@/api/sessionsApi";

interface Patient {
  title?: string;
  _id: string;
  patientId: string;
  patientName: string;
  contactNo: string;
  email: string;
  age: string;
  address: string;
}

interface Session {
  sessionId: string;
  sessionName: string;
}

interface Suggestion {
  value: string;
  label: string;
}

const AppointmentForm: React.FC = () => {
  const {
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext<AppointmentFormData>();

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

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastCenterId = useRef<string | undefined>(undefined);

  /** Fetch sessions only when center changes */
  useEffect(() => {
    if (!centerId || lastCenterId.current === centerId) return;

    lastCenterId.current = centerId;
    setLoading(true);

    (async () => {
      try {
        const response = await getSessionSuggestions(centerId);
        const options: Suggestion[] = (
          Array.isArray(response) ? response : []
        ).map((s: Session) => ({
          value: s.sessionId,
          label: s.sessionName,
        }));
        setSessionOptions(options);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to fetch sessions.");
        setSessionOptions([]);
      } finally {
        setLoading(false);
      }
    })();

    // Reset dependent fields
    setValue("sessionId", "");
    setValue("patientId", "");
    setValue("contactNo", "");
    setValue("email", "");
    setPatients([]);
  }, [centerId, setValue]);

  /** Handle input changes for regular fields */
  const handleInputChange = useCallback(
    (field: keyof AppointmentFormData, value: string) => {
      setValue(field, value);
      if (errors[field]) clearErrors(field);
    },
    [setValue, clearErrors, errors]
  );

  /** Debounced patient search */
  const handleContactChange = useCallback(
    (value: string) => {
      setValue("contactNo", value);
      if (errors.contactNo) clearErrors("contactNo");

      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(async () => {
        if (!value.trim() || !centerId) {
          setPatients([]);
          return;
        }

        try {
          const result = await getPatientSuggestions(value, centerId);
          setPatients(result || []);
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Failed to fetch patient suggestions.");
          setPatients([]);
        }
      }, 300);
    },
    [centerId, setValue, clearErrors, errors.contactNo]
  );

  /** Select patient */
  const handlePatientSelect = useCallback(
    (selectedId: string) => {
      const patient = patients.find((p) => p._id === selectedId);
      if (!patient) return;

      setValue("contactNo", patient.contactNo || "");
      setValue("email", patient.email || "");
      setValue("patientId", patient._id || "");
      if (errors.contactNo) clearErrors("contactNo");
    },
    [patients, setValue, clearErrors, errors.contactNo]
  );

  /** Session dropdown change */
  const handleSessionChange = useCallback(
    (value: string | string[]) => {
      handleInputChange("sessionId", Array.isArray(value) ? value[0] : value);
    },
    [handleInputChange]
  );

  /** Memoized patient suggestions */
  const patientSuggestions = useMemo(
    () =>
      patients.map((p) => `${p.title || ""} ${p.patientName} - ${p.contactNo}`),
    [patients]
  );

  const selectedPatient = useMemo(
    () => patients.find((p) => p._id === patientId),
    [patients, patientId]
  );

  return (
    <div className="space-y-6">
      {/* Center & Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Medical Center" error={errors.centerId?.message}>
          <CenterDropdown
            id="centerId"
            value={centerId || ""}
            onChange={(val) => handleInputChange("centerId", val)}
            placeholder="Select Medical Center"
          />
        </FormField>

        <FormField label="Date" error={errors.date?.message}>
          <DatePicker
            id="date"
            value={date || ""}
            dateFormat="yyyy-MM-dd"
            onDateChange={(val) => handleInputChange("date", val)}
            className="w-full"
            placeholder="Select an appointment date"
            isDisablePast={true}
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

        <FormField label="Patient Contact No" error={errors.contactNo?.message}>
          <SearchBar
            id="contactNo"
            value={contactNo || ""}
            placeholder="Search patient by contact no"
            onChange={(e) => handleContactChange(e.target.value)}
            suggestions={patientSuggestions}
            onSuggestionSelect={(suggestion) => {
              const patient = patients.find(
                (p) =>
                  suggestion ===
                  `${p.title || ""} ${p.patientName} - ${p.contactNo}`
              );
              if (patient) handlePatientSelect(patient._id);
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
            readOnly
            placeholder="Patient name"
          />
        </FormField>

        <FormField label="Age">
          <InputField
            id="age"
            type="number"
            value={selectedPatient?.age || ""}
            readOnly
            placeholder="Age"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email">
          <InputField
            id="email"
            type="email"
            value={email || ""}
            readOnly
            placeholder="Email"
          />
        </FormField>

        <FormField label="Address">
          <InputField
            id="address"
            type="text"
            value={selectedPatient?.address || ""}
            readOnly
            placeholder="Address"
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
};

export default AppointmentForm;

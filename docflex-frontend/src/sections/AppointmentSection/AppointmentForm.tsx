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
import { Tooltip } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import AddNewPatientPopup from "../PatientSection/AddNewPatientPopup";

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

  useEffect(() => {
    if (!watch("date")) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setValue("date", `${yyyy}-${mm}-${dd}`);
    }
  }, [watch, setValue]);

  const date = watch("date");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [sessionOptions, setSessionOptions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastCenterId = useRef<string | undefined>(undefined);

  const [isNewPatientPopupOpen, setIsNewPatientPopupOpen] = useState(false);

  const fetchPatientSuggestions = useCallback(
    async (value: string) => {
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
    },
    [centerId]
  );

  /** Fetch sessions only when center changes */ useEffect(() => {
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
    setValue("age", "");
    setPatients([]);
  }, [centerId, setValue]);

  const handleInputChange = useCallback(
    (field: keyof AppointmentFormData, value: string) => {
      setValue(field, value);
      clearErrors(field);
    },
    [setValue, clearErrors]
  );

  const handleContactChange = useCallback(
    (value: string) => {
      setValue("contactNo", value);
      clearErrors("contactNo");

      // If the search bar is empty, clear all patient-related data
      if (!value.trim()) {
        setValue("patientId", "");
        setValue("email", "");
        setValue("age", "");
        setPatients([]);
      } else {
        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
          fetchPatientSuggestions(value);
        }, 300);
      }
    },
    [setValue, clearErrors, fetchPatientSuggestions]
  );

  const handlePatientSelect = useCallback(
    (selectedId: string) => {
      const patient = patients.find((p) => p._id === selectedId);
      if (!patient) return;

      setValue("contactNo", patient.contactNo || "");
      setValue("email", patient.email || "");
      setValue("age", patient.age || "");
      setValue("patientId", patient._id || "");
      clearErrors("contactNo");
    },
    [patients, setValue, clearErrors]
  );

  const handleSessionChange = useCallback(
    (value: string | string[]) => {
      handleInputChange("sessionId", Array.isArray(value) ? value[0] : value);
    },
    [handleInputChange]
  );

  const patientSuggestions = useMemo(
    () =>
      patients.map((p) => ({
        label: `${p.title || ""} ${p.patientName} - ${p.contactNo}`,
        value: p._id,
      })),
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
          <div className="flex gap-2 items-center">
            <SearchBar
              id="contactNo"
              value={contactNo || ""}
              placeholder="Search patient by contact no"
              onChange={(e) => handleContactChange(e.target.value)}
              suggestions={patientSuggestions.map((p) => p.label)}
              onSuggestionSelect={(suggestion) => {
                const patient = patientSuggestions.find(
                  (p) => p.label === suggestion
                );
                if (patient) handlePatientSelect(patient.value);
              }}
              readOnly={loading || !centerId}
            />

            <Tooltip content="Add New Patient" side="bottom">
              <button
                type="button"
                onClick={() => setIsNewPatientPopupOpen(true)}
                className="p-2 bg-blue-200 border h-10 w-10 flex items-center justify-center border-gray-400 rounded-md shadow-sm hover:bg-transparent hover:text-blue-600 hover:border-blue-600"
              >
                <Plus size={16} />
              </button>
            </Tooltip>
          </div>
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
            type="text"
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

      {/* New Patient Popup */}
      {isNewPatientPopupOpen && (
        <AddNewPatientPopup
          isOpen={isNewPatientPopupOpen}
          onClose={async () => {
            setIsNewPatientPopupOpen(false);
            if (contactNo) {
              await fetchPatientSuggestions(contactNo);
            }
          }}
        />
      )}
    </div>
  );
};

export default AppointmentForm;

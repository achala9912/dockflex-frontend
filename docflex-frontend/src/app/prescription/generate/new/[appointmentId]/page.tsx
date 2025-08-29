"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";
import { LiaCloudscale } from "react-icons/lia";
import { toast } from "react-toastify";

import PrescriptionTemplate from "@/components/Canvas/PrescriptionTemplate";
import Dropdown from "@/components/Dropdown/Dropdown";
import MultiDropdown from "@/components/Dropdown/MultiDropdown";
import FormField from "@/components/Fields/FormField";
import InputField from "@/components/InputField/InputField";
import TextArea from "@/components/InputField/TextArea";
import CustomTable from "@/components/Table/CustomTable";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { calculateBMI } from "@/utils/functions/Calculation";
import { getAppointmentById } from "@/api/appointmentsApi";
import { getProductSuggestions } from "@/api/productApi";
import { TreatmentMgmtColoums } from "@/components/Table/Coloumns";
import SearchBar from "@/components/Searchbar/Searchbar";

interface RowData {
  route: string;
  productName: string;
  genericName: string;
  dose: string;
  frequency: string;
  duration: string;
  note: string;
}

interface PatientData {
  _id: string;
  patientId: string;
  patientName: string;
  age: string;
  contactNo: string;
  address: string;
  nic: string;
  email: string;
  remark: string;
  gender?: string;
  dob?: string;
  title?: string;
}

interface CenterData {
  _id: string;
  centerId: string;
  centerName: string;
  contactNo?: string;
  address?: string;
  town?: string;
  logo?: string;
  email?: string;
}

interface AppointmentData {
  _id: string;
  patientId: PatientData;
  centerId: CenterData;
  date: string;
  appointmentId: string;
  // Add other fields as needed
}

interface PrescriberDetails {
  name: string;
  specialization: string;
  slmcNo: string;
  digitalSignature?: string;
  title?: string;
  remarks?: string;
}

const GeneratePrescriptionPage = () => {
  const router = useRouter();
  const params = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<string>("");
  const [pulseRate, setPulseRate] = useState<string>("");
  const [clinicalDetails, setClinicalDetails] = useState<string>("");
  const [advice, setAdvice] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [appointmentData, setAppointmentData] =
    useState<AppointmentData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [centerData, setCenterData] = useState<CenterData | null>(null);
  const [prescriberDetails] = useState<PrescriberDetails>({
    name: "",
    specialization: "",
    slmcNo: "",
    title: "",
  });

  // Ensure appointmentId is a string
  const appointmentId: string | undefined = Array.isArray(params?.appointmentId)
    ? params.appointmentId[0]
    : params?.appointmentId;

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (!appointmentId) return;
      try {
        const response = await getAppointmentById(appointmentId);
        if (!response.data) {
          toast.error("Appointment data not found");
          return;
        }

        const data = response.data;
        setAppointmentData(data);
        setPatientData(data.patientId);
        setCenterData(data.centerId);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
        toast.error("Failed to load appointment details.");
      }
    };
    fetchAppointmentData();
  }, [appointmentId]);

  const fetchProducts = useCallback(async () => {
    if (!centerData?._id) return;

    try {
      setError(null);
      const res = await getProductSuggestions(centerData._id);
      console.log("ProdutSugg", res);
      setProducts(res || []);
    } catch (err: any) {
      console.error(err);
      setProducts([]);
      setError("Failed to fetch products");
    }
  }, [centerData]);

  useEffect(() => {
    if (centerData) {
      fetchProducts();
    }
  }, [centerData, fetchProducts]);

  const [rowData, setRowData] = useState<RowData[]>([
    {
      route: "",
      productName: "",
      genericName: "",
      dose: "",
      frequency: "",
      duration: "",
      note: "",
    },
  ]);

  // ✅ Handle form submission
  const handleSubmit = () => {
    // Add your form submission logic here
    console.log("Form submitted", rowData);
    toast.success("Prescription saved successfully!");
  };

  // ✅ Update a row field
  const handleInputChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    const updatedRows = [...rowData];
    updatedRows[index][field] = value;
    setRowData(updatedRows);
  };

  // ✅ Add a row
  const handleAddRow = () => {
    setRowData([
      ...rowData,
      {
        route: "",
        productName: "",
        genericName: "",
        dose: "",
        frequency: "",
        duration: "",
        note: "",
      },
    ]);
  };

  // ✅ Delete a row
  const handleDeleteRow = (index: number) => {
    if (rowData.length === 1) return; // keep at least 1 row
    setRowData(rowData.filter((_, i) => i !== index));
  };

  // ✅ Handle search change
  const handleSearchChange = (value: string, index: number) => {
    handleInputChange(index, "productName", value);
  };

  const handleProductSuggestionSelect = (suggestion: string, index: number) => {
    handleInputChange(index, "productName", suggestion);

    // Match by productName (not name)
    const selectedProduct = products.find(
      (product) => product.productName === suggestion
    );

    handleInputChange(
      index,
      "genericName",
      selectedProduct?.genericName || "Generic name not found"
    );
  };

  // ✅ Enter key adds new row
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter" && index === rowData.length - 1) {
      handleAddRow();
    }
  };

  // Calculate BMI when weight or height changes
  const bmi =
    weight && height
      ? calculateBMI(parseFloat(weight), parseFloat(height))
      : "";

  // Prepare vital signs for the preview
  const vitalSigns = [
    { name: "Weight", value: weight, unit: "kg" },
    { name: "Height", value: height, unit: "cm" },
    { name: "BMI", value: bmi.toString(), unit: "" },
    { name: "Temperature", value: temperature, unit: "°C" },
    { name: "Pulse Rate", value: pulseRate, unit: "bpm" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Tooltip content="Back" side="bottom">
            <button
              id="backButton"
              onClick={() => router.push("/prescription/generate")}
              className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
            >
              <IoChevronBackOutline size={18} />
            </button>
          </Tooltip>
          <h3 className="flex items-center font-semibold font-inter">
            Generate Prescription
          </h3>
        </div>

        <div className="flex flex-wrap justify-end gap-4 mt-6">
          <Button
            variant="outline"
            size="default"
            onClick={() => router.back()}
            className="px-6 py-2 text-sm font-semibold text-white transition bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="default"
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Patient & Prescription Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4">
          <FormField label="Patient Details" labelClassName="mb-4">
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <InputField
                id="patientName"
                type="text"
                label
                labelName="Name"
                width="w-full"
                value={patientData?.patientName || "Loading..."}
                readOnly
              />
              <InputField
                id="age"
                type="text"
                label
                labelName="Age"
                width="w-full"
                value={patientData?.age || "Loading..."}
                readOnly
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-center mt-6">
              <InputField
                id="email"
                type="email"
                label
                labelName="Email"
                width="w-full"
                value={patientData?.email || "Loading..."}
                readOnly
              />
              <InputField
                id="contactNo"
                type="text"
                label
                labelName="Contact No"
                width="w-full"
                value={patientData?.contactNo || "Loading..."}
                readOnly
              />
            </div>
          </FormField>

          <FormField label="Reason for visit:">
            <TextArea
              id="reasonForVisit"
              placeholder="Enter a reason"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
            />
          </FormField>

          <FormField label="Symptoms:">
            <MultiDropdown
              id="symptoms"
              placeholder="Select Symptoms"
              multiple
              value={symptoms}
              options={["Nausea", "Vomiting", "Runny Nose", "Dry Cough"]}
              onChange={(selected) => setSymptoms(selected)}
            />
          </FormField>

          <FormField label="Vital Signs:" labelClassName="mb-4">
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <InputField
                id="weight"
                type="text"
                label
                value={weight}
                labelName="Weight"
                icon="Kg"
                onChange={(e) => setWeight(e.target.value)}
              />
              <InputField
                id="height"
                type="text"
                label
                labelName="Height"
                icon="CM"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <InputField
                id="bmi"
                type="text"
                label
                labelName="BMI"
                icon={<LiaCloudscale />}
                value={bmi.toString()}
                readOnly
              />
              <InputField
                id="temperature"
                type="text"
                label
                value={temperature}
                labelName="Temperature"
                icon="℃"
                onChange={(e) => setTemperature(e.target.value)}
              />
              <InputField
                id="pulseRate"
                type="text"
                label
                value={pulseRate}
                labelName="Pulse Rate"
                icon="bpm"
                onChange={(e) => setPulseRate(e.target.value)}
              />
            </div>
          </FormField>

          <FormField label="Clinical Details in Brief:">
            <TextArea
              id="clinicalDetails"
              placeholder="Enter clinical details"
              value={clinicalDetails}
              onChange={(e) => setClinicalDetails(e.target.value)}
            />
          </FormField>

          <FormField label="Advice (Optional):">
            <TextArea
              id="advise"
              placeholder="Enter advice"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </FormField>

          <FormField label="Remarks (Optional):">
            <TextArea
              id="remarks"
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </FormField>
        </div>

        {/* Right Section */}
        <div>
          {/* Live Preview */}
          <PrescriptionTemplate
            centerId={{
              centerName: centerData?.centerName || "",
              contactNo: centerData?.contactNo || "",
              address: centerData?.address || "",
              town: centerData?.town || "",
              logo: centerData?.logo || "",
              email: centerData?.email || "",
            }}
            createdAt={appointmentData?.date || ""}
            patientId={{
              patientName: patientData?.patientName || "",
              age: patientData?.age || "",
              contactNo: patientData?.contactNo || "",
              email: patientData?.email || "",
              gender: patientData?.gender || "",
              dob: patientData?.dob || "",
              title: patientData?.title || "",
            }}
            reasonForVisit={reasonForVisit}
            symptoms={symptoms}
            vitalSigns={vitalSigns}
            clinicalDetails={clinicalDetails}
            advice={advice}
            medications={rowData}
            prescriberDetails={prescriberDetails}
          />
        </div>
      </div>

      {/* Treatment Management Table */}
      <CustomTable
        className="min-h-400 mt-6"
        columns={TreatmentMgmtColoums}
        data={rowData.map((row, index) => ({
          route: (
            <Dropdown
              id={`route-${index}`}
              width="min-w-[200px]"
              options={["Oral", "IV", "IM", "Rectal"]}
              value={row.route}
              onChange={(val) => handleInputChange(index, "route", val)}
            />
          ),
          productName: (
            <SearchBar
              id={`productName-${index}`}
              width="md:w-[400px]"
              placeholder="Search Product"
              value={row.productName || ""}
              onChange={(e) => handleSearchChange(e.target.value, index)}
              suggestions={products.map((p) => p.productName)} // ✅ array of strings
              onSuggestionSelect={(suggestion) =>
                handleProductSuggestionSelect(suggestion, index)
              }
            />
          ),

          genericName: (
            <InputField
              id={`genericName-${index}`}
              width="max-w-[280px]"
              className="text-center"
              type="text"
              value={row.genericName}
              readOnly
            />
          ),
          dose: (
            <InputField
              id={`dose-${index}`}
              width="max-w-[120px]"
              className="text-center"
              type="text"
              value={row.dose}
              onChange={(e) => handleInputChange(index, "dose", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ),
          frequency: (
            <Dropdown
              id={`frequency-${index}`}
              width="min-w-[200px]"
              options={["Once Daily", "Twice Daily", "Thrice Daily"]}
              value={row.frequency}
              onChange={(val) => handleInputChange(index, "frequency", val)}
            />
          ),
          duration: (
            <Dropdown
              id={`duration-${index}`}
              width="min-w-[200px]"
              options={["3 Days", "5 Days", "7 Days", "10 Days"]}
              value={row.duration}
              onChange={(val) => handleInputChange(index, "duration", val)}
            />
          ),
          note: (
            <InputField
              id={`note-${index}`}
              width="max-w-[200px]"
              className="text-right"
              type="text"
              value={row.note}
              onChange={(e) => handleInputChange(index, "note", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ),
          action: (
            <div className="flex space-x-4">
              <FaPlus
                className="text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={handleAddRow}
                aria-label="Add Row"
              />
              <FaTrash
                className="text-red-600 cursor-pointer hover:text-red-800"
                onClick={() => handleDeleteRow(index)}
                aria-label="Delete Row"
              />
            </div>
          ),
        }))}
      />
    </div>
  );
};

export default GeneratePrescriptionPage;

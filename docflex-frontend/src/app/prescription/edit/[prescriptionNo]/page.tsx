"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";
import { LiaCloudscale } from "react-icons/lia";
import { toast } from "react-toastify";
import MultiDropdown from "@/components/Dropdown/MultiDropdown";
import FormField from "@/components/Fields/FormField";
import InputField from "@/components/InputField/InputField";
import TextArea from "@/components/InputField/TextArea";
import CustomTable from "@/components/Table/CustomTable";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { calculateBMI } from "@/utils/functions/Calculation";
import { getProductSuggestions } from "@/api/productApi";
import { TreatmentMgmtColoums } from "@/components/Table/Coloumns";
import SearchBar from "@/components/Searchbar/Searchbar";
import {
  updatePrescription,
  getPrescriptionDataById,
} from "@/api/prescriptionsApi";
import { useAuthStore } from "@/store/authStore";
import LivePrescription from "@/components/Canvas/LivePrescription";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";
import {
  DoseUnitOptions,
  DurationOptions,
  FrequencyOptions,
  LabTestsOptions,
  RouteOptions,
  SymptomsOptions,
} from "@/constants/medical.constants";

interface RowData {
  route: string;
  productName: string;
  genericName: string;
  dose: string;
  doseUnit: string;
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

const GeneratePrescriptionPage = () => {
  const router = useRouter();
  const params = useParams();
  const user = useAuthStore((state) => state.user);

  const prescriptionNo: string | undefined = Array.isArray(
    params?.prescriptionNo
  )
    ? params.prescriptionNo[0]
    : params?.prescriptionNo;

  const [products, setProducts] = useState<any[]>([]);
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [reasonForVisit, setReasonForVisit] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [labTests, setLabTests] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<string>("");
  const [pulseRate, setPulseRate] = useState<string>("");
  const [clinicalDetails, setClinicalDetails] = useState<string>("");
  const [advice, setAdvice] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [centerData, setCenterData] = useState<CenterData | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [appointmentId, setAppointmentId] = useState<string>("");

  const [rowData, setRowData] = useState<RowData[]>([
    {
      route: "",
      productName: "",
      genericName: "",
      dose: "",
      doseUnit: "",
      frequency: "",
      duration: "",
      note: "",
    },
  ]);
  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!prescriptionNo) return;
      try {
        const response = await getPrescriptionDataById(prescriptionNo);

        if (!response) {
          toast.error("Prescription data not found");
          return;
        }

        const data = response;

        // Patient & Center
        setPatientData(data.patientId);
        setCenterData(data.centerId);
        setAppointmentId(data.appointmentId?._id || "");

        // Prescription details
        setReasonForVisit(data.reasonForVisit || "");
        setSymptoms(data.symptoms || []);
        setLabTests(data.labTests || []);
        setClinicalDetails(data.clinicalDetails || "");
        setAdvice(data.advice || "");
        setRemarks(data.remark || "");

        // Vitals
        if (data.vitalSigns && data.vitalSigns.length > 0) {
          const vital = data.vitalSigns[0];
          setWeight(vital.weight || "");
          setHeight(vital.height || "");
          setTemperature(vital.temperature || "");
          setPulseRate(vital.pulseRate || "");
        }

        // Medications (rows)
        if (data.medications && data.medications.length > 0) {
          const meds = data.medications.map((med: any) => ({
            route: med.route || "",
            productName: med.productName || "",
            genericName: med.genericName || "",
            dose: med.dose || "",
            doseUnit: med.doseUnit || "",
            frequency: med.frequency || "",
            duration: med.duration || "",
            note: med.note || "",
          }));
          setRowData(meds);
        }
      } catch (error) {
        console.error("Failed to fetch prescription:", error);
        toast.error("Failed to load prescription data.");
      }
    };

    fetchPrescriptionData();
  }, [prescriptionNo]);

  const fetchProducts = useCallback(async () => {
    if (!centerData?._id) return;

    try {
      const res = await getProductSuggestions(centerData._id);
      console.log("ProdutSugg", res);
      setProducts(res || []);
    } catch (err: any) {
      console.error(err);
      setProducts([]);
    }
  }, [centerData]);

  useEffect(() => {
    if (centerData) {
      fetchProducts();
    }
  }, [centerData, fetchProducts]);

  const handleInputChange = (
    index: number,
    field: keyof RowData,
    value: string
  ) => {
    const updatedRows = [...rowData];
    updatedRows[index][field] = value;
    setRowData(updatedRows);
  };

  const handleAddRow = (targetIndex?: number) => {
    const rowToValidate =
      targetIndex !== undefined ? rowData[targetIndex] : rowData[0];

    const requiredFields = [
      "route",
      "productName",
      "genericName",
      "dose",
      "doseUnit",
      "frequency",
      "duration",
    ];
    const missingFields = requiredFields.filter(
      (field) => !rowToValidate[field as keyof RowData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill all required fields in the current row: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    const newRow: RowData = {
      route: "",
      productName: "",
      genericName: "",
      dose: "",
      doseUnit: "",
      frequency: "",
      duration: "",
      note: "",
    };

    if (targetIndex === undefined) {
      setRowData([newRow, ...rowData]);
    } else {
      const updatedRows = [...rowData];
      updatedRows.splice(targetIndex, 0, newRow);
      setRowData(updatedRows);
    }
  };
  // Clear First Row
  const clearFirstRow = () => {
    setRowData((prev) =>
      prev.map((row, i) =>
        i === 0
          ? {
              route: "",
              productName: "",
              genericName: "",
              dose: "",
              doseUnit: "",
              frequency: "",
              duration: "",
              note: "",
            }
          : row
      )
    );
  };

  const handleDeleteRow = (index: number) => {
    const topRowEmpty = Object.values(rowData[0]).every((val) => val === "");

    if (index === 0) {
      if (!topRowEmpty) {
        clearFirstRow();
      } else if (rowData.length > 1) {
        setRowData((prev) => prev.slice(1));
      }
    } else {
      setDeleteIndex(index);
      setIsDeleteConfirmOpen(true);
    }
  };

  const handleSearchChange = (value: string, index: number) => {
    handleInputChange(index, "productName", value);
  };

  const handleProductSuggestionSelect = (suggestion: string, index: number) => {
    handleInputChange(index, "productName", suggestion);

    const selectedProduct = products.find(
      (product) => product.productName === suggestion
    );

    handleInputChange(
      index,
      "genericName",
      selectedProduct?.genericName || "Generic name not found"
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Enter" && index === rowData.length - 1) {
      handleAddRow();
    }
  };

  const handleClearRow = (index: number) => {
    setRowData((prevRows) =>
      prevRows.map((row, i) =>
        i === index
          ? {
              route: "",
              productName: "",
              genericName: "",
              dose: "",
              doseUnit: "",
              frequency: "",
              duration: "",
              note: "",
            }
          : row
      )
    );
  };

  const bmi = weight && height ? calculateBMI(height, weight) : "";

  const vitalSigns = [
    { name: "Weight", value: weight, unit: "kg" },
    { name: "Height", value: height, unit: "cm" },
    { name: "BMI", value: bmi.toString(), unit: "" },
    { name: "Temperature", value: temperature, unit: "°C" },
    { name: "Pulse Rate", value: pulseRate, unit: "mm" },
  ];

  const handleSubmit = async () => {
    if (!prescriptionNo || !patientData || !centerData) {
      toast.error("Missing required data.");
      return;
    }

    try {
      const bmi = weight && height ? calculateBMI(height, weight) : "";

      const payload = {
        centerId: centerData._id,
        prescriptionType: "External",
        appointmentId: appointmentId,
        patientId: patientData._id,
        reasonForVisit,
        symptoms,
        labTests,
        clinicalDetails,
        advice,
        remark: remarks,
        vitalSigns: {
          weight,
          height,
          bmi,
          temperature,
          pulseRate,
        },
        medications: rowData.map((row) => ({
          route: row.route,
          productName: row.productName,
          genericName: row.genericName,
          dose: row.dose,
          doseUnit: row.doseUnit,
          frequency: row.frequency,
          duration: row.duration,
          note: row.note,
        })),
        prescriberDetails: {
          title: user?.title,
          name: user?.name,
          slmcNo: user?.slmcNo,
          digitalSignature: user?.digitalSignature,
          specialization: user?.specialization,
          remarks: user?.remarks,
        },
      };
      console.log("Update Payload", payload);;
      await updatePrescription(prescriptionNo, payload);
      toast.success("Prescription updated successfully!");
      router.push(`/prescription/${prescriptionNo}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update prescription.");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row justify-between items-center gap-4 mb-6">
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
          <h3 className="flex items-center font-semibold font-inter text-lg">
            Update Prescription
          </h3>
        </div>

        <div>
          <Button
            variant="outline"
            size="default"
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
          >
            Update
          </Button>
        </div>
      </div>

      {/* Patient & Prescription Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Section */}
        <div className="space-y-4 bg-white p-5">
          <FormField
            label="Patient Details"
            labelClassName="mb-4 font-semibold !text-blue-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <FormField
            label="Reason for visit:"
            labelClassName="font-semibold !text-blue-700"
          >
            <TextArea
              id="reasonForVisit"
              placeholder="Enter a reason"
              value={reasonForVisit}
              onChange={(e) => setReasonForVisit(e.target.value)}
            />
          </FormField>

          <FormField
            label="Symptoms:"
            labelClassName="font-semibold !text-blue-700"
          >
            <MultiDropdown
              id="symptoms"
              placeholder="Select Symptoms"
              multiple
              value={symptoms}
              options={SymptomsOptions}
              onChange={(selected) => setSymptoms(selected as string[])}
            />
          </FormField>

          <FormField
            label="Vital Signs:"
            labelClassName="mb-4 font-semibold !text-blue-700"
          >
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <InputField
                id="weight"
                type="text"
                label
                value={weight}
                labelName="Weight"
                icon="kg"
                onChange={(e) => setWeight(e.target.value)}
                showAlwaysLabel
              />
              <InputField
                id="height"
                type="text"
                label
                labelName="Height"
                icon="cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                showAlwaysLabel
              />
              <InputField
                id="bmi"
                type="text"
                label
                labelName="BMI"
                icon={<LiaCloudscale />}
                value={bmi.toString()}
                readOnly
                showAlwaysLabel
              />
              <InputField
                id="temperature"
                type="text"
                label
                value={temperature}
                labelName="Temperature"
                icon="℃"
                onChange={(e) => setTemperature(e.target.value)}
                showAlwaysLabel
              />
              <InputField
                id="pulseRate"
                type="text"
                label
                value={pulseRate}
                labelName="Pulse Rate"
                icon="mm"
                onChange={(e) => setPulseRate(e.target.value)}
                showAlwaysLabel
              />
            </div>
          </FormField>

          <FormField
            label="Clinical Details in Brief:"
            labelClassName="font-semibold !text-blue-700"
          >
            <TextArea
              id="clinicalDetails"
              placeholder="Enter clinical details"
              value={clinicalDetails}
              onChange={(e) => setClinicalDetails(e.target.value)}
            />
          </FormField>
          <FormField
            label="Lab Test (Optional):"
            labelClassName="font-semibold !text-blue-700"
          >
            <MultiDropdown
              id="labTest"
              placeholder="Select Lab Test"
              multiple
              value={labTests}
              options={LabTestsOptions}
              onChange={(selected) => setLabTests(selected as string[])}
            />
          </FormField>
          <FormField
            label="Advice (Optional):"
            labelClassName="font-semibold !text-blue-700"
          >
            <TextArea
              id="advise"
              placeholder="Enter advice"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </FormField>

          <FormField
            label="Remarks (Optional):"
            labelClassName="font-semibold !text-blue-700"
          >
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
          <LivePrescription
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
            labTests={labTests}
            vitalSigns={vitalSigns}
            clinicalDetails={clinicalDetails}
            advice={advice}
            medications={rowData}
            remark={remarks}
          />
        </div>
      </div>
      <CustomTable
        className="min-h-400 mt-6"
        columns={TreatmentMgmtColoums}
        data={rowData.map((row, index) => ({
          index: index,
          route: (
            <MultiDropdown
              id={`route-${index}`}
              width="min-w-[200px]"
              options={RouteOptions}
              value={row.route}
              onChange={(val) =>
                handleInputChange(index, "route", val as string)
              }
            />
          ),
          productName: (
            <SearchBar
              id={`productName-${index}`}
              width="md:min-w-[400px] w-full"
              placeholder="Search Product"
              value={row.productName || ""}
              onChange={(e) => handleSearchChange(e.target.value, index)}
              suggestions={products.map((p) => p.productName)}
              onSuggestionSelect={(suggestion) =>
                handleProductSuggestionSelect(suggestion, index)
              }
              handleClear={() => handleClearRow(index)}
            />
          ),
          genericName: (
            <InputField
              id={`genericName-${index}`}
              width="max-w-[280px]"
              type="text"
              value={row.genericName}
              readOnly
            />
          ),
          dose: (
            <div className="flex flex-row gap-2 items-center">
              <InputField
                id={`dose-${index}`}
                width="max-w-[120px]"
                className="text-center"
                type="number"
                value={row.dose}
                onChange={(e) =>
                  handleInputChange(index, "dose", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
              <MultiDropdown
                id={`doseUnit-${index}`}
                width="min-w-[140px]"
                options={DoseUnitOptions}
                placeholder="Unit"
                value={row.doseUnit}
                onChange={(val) =>
                  handleInputChange(index, "doseUnit", val as string)
                }
              />
            </div>
          ),
          frequency: (
            <MultiDropdown
              id={`frequency-${index}`}
              width="min-w-[200px]"
              options={FrequencyOptions}
              value={row.frequency}
              onChange={(val) =>
                handleInputChange(index, "frequency", val as string)
              }
            />
          ),
          duration: (
            <MultiDropdown
              id={`duration-${index}`}
              width="min-w-[200px]"
              options={DurationOptions}
              value={row.duration}
              onChange={(val) =>
                handleInputChange(index, "duration", val as string)
              }
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
                onClick={() => handleAddRow(index)}
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
        handlers={{
          add: (row: any) => handleAddRow(row.index),
          delete: (row: any) => handleDeleteRow(row.index),
        }}
      />

      <DeleteConfirm
        element="this item"
        isOpen={isDeleteConfirmOpen}
        onDelete={() => {
          if (deleteIndex !== null && deleteIndex > 0) {
            setRowData((prevRows) =>
              prevRows.filter((_, i) => i !== deleteIndex)
            );
          }
          setDeleteIndex(null);
          setIsDeleteConfirmOpen(false);
        }}
        onCancel={() => {
          setDeleteIndex(null);
          setIsDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
};

export default GeneratePrescriptionPage;

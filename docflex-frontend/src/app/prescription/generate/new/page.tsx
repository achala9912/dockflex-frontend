"use client";

import MultiDropdown from "@/components/Dropdown/MultiDropdown";
import FormField from "@/components/Fields/FormField";
import InputField from "@/components/InputField/InputField";
import TextArea from "@/components/InputField/TextArea";
import { Tooltip } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";

const GeneratePrescriptionPage = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-4">
          <FormField label="Patient Deatils" labelClassName="mb-4">
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <InputField
                id="patientName"
                type="text"
                label
                labelName="Name"
                width="w-full"
                readOnly
              />
              <InputField
                id="age"
                type="text"
                label
                labelName="Age"
                readOnly
                width="w-full"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 items-center mt-6">
              <InputField
                id="email"
                type="email"
                label
                labelName="Email"
                readOnly
                width="w-full"
              />
              <InputField
                id="contactNo"
                type="text"
                label
                labelName="Contact No"
                readOnly
                width="w-full"
              />
            </div>
          </FormField>

          <FormField label="Reason for visit:">
            <TextArea id="reasonForVisit" placeholder="Enter a reason" />
          </FormField>
          <FormField label="Symptoms:">
            <MultiDropdown
              id="symptoms"
              placeholder="Select Symptoms"
              multiple
              value={""}
              options={["Nausea", "Vomiting", "Runny Nose", "Dry Caough"]}
              onChange={function (value: string | string[]): void {
                throw new Error("Function not implemented.");
              }}
            />
          </FormField>
          <FormField label="Vital Signs:" labelClassName="mb-4">
            <div className="flex flex-col md:flex-row gap-2 items-center">
              <InputField
                id="weight"
                type="text"
                label
                labelName="Weight"
                icon="Kg"
              />
              <InputField
                id="height"
                type="text"
                label
                labelName="Height"
                icon="CM"
              />
              <InputField id="bmi" type="text" label labelName="BMI" readOnly />
              <InputField
                id="temprature"
                type="text"
                label
                labelName="Temaprature"
                icon="℃"
              />
              <InputField
                id="pulseRate"
                type="text"
                label
                labelName="Pulse Rate"
                icon="MM"
              />
            </div>
          </FormField>

          <FormField label="Clinical Details in Brief:">
            <TextArea
              id="clinicalDetails"
              placeholder="Enter a clinical details"
            />
          </FormField>
          <FormField label="Advice (Optional):">
            <TextArea id="advise" placeholder="Enter a advise" />
          </FormField>
          <FormField label="Remarks (Optional):">
            <TextArea id="remarks" placeholder="Enter a Remarks" />
          </FormField>
        </div>
      </div>
    </div>
  );
};

export default GeneratePrescriptionPage;

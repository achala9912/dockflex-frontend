"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { UserFormData } from "@/schemas/Accounts/UserSchema";
import FormField from "@/components/Fields/FormField";
import Dropdown from "@/components/Dropdown/Dropdown";
import InputField from "@/components/InputField/InputField";
import ImageUploader from "@/components/InputImage/ImageUploader";
import { getRoleSuggestions, Role } from "@/api/roleApi";
import { getMedicalCenterSuggestions } from "@/api/medicalCentersApi";

const titleOptions = ["Dr.", "Mr.", "Ms."].map((val) => ({
  label: val,
  value: val,
}));

const specializationOptions = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "General Practice",
  "Surgery",
  "Dermatology",
].map((val) => ({
  label: val,
  value: val,
}));

const genderOptions = ["Male", "Female", "Other"].map((val) => ({
  label: val,
  value: val,
}));

function UserForm() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<UserFormData>();

  const [roleOptions, setRoleOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [centerOptions, setCenterOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [resetImages, setResetImages] = useState(false);

  const [rolesData, setRolesData] = useState<Role[]>([]);

  const selectedRoleId = watch("role");
  const digitalSignatureValue = watch("digitalSignature"); 

  const selectedRole = rolesData.find((role) => role.roleId === selectedRoleId);
  const selectedRoleName = selectedRole?.roleName?.toLowerCase();
  const isDoctor =
    selectedRoleName === "doctor" || selectedRoleName === "doctor admin";

  useEffect(() => {
    const fetchRoleSuggestions = async () => {
      try {
        const roles = await getRoleSuggestions();
        setRolesData(roles);

        const options = roles.map((role: Role) => ({
          label: role.roleName,
          value: role.roleId,
        }));
        setRoleOptions(options);
      } catch (error) {
        console.error("Failed to fetch role suggestions:", error);
        setRoleOptions([]);
        setRolesData([]);
      }
    };
    fetchRoleSuggestions();
  }, []);

  useEffect(() => {
    const fetchMedicalCenterSuggestions = async () => {
      try {
        const centers = await getMedicalCenterSuggestions();
        const options = centers.map((center) => ({
          label: center.centerName,
          value: center._id,
        }));
        setCenterOptions(options);
      } catch (error) {
        console.error("Failed to fetch center suggestions:", error);
        setCenterOptions([]);
      }
    };
    fetchMedicalCenterSuggestions();
  }, []);

  const [prevIsDoctor, setPrevIsDoctor] = useState<boolean | null>(null);

  useEffect(() => {

    if (prevIsDoctor !== null && prevIsDoctor === true && !isDoctor) {
      setValue("slmcNo", "", { shouldValidate: true, shouldDirty: true });
      setValue("specialization", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("digitalSignature", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setResetImages(true);
    }
    setPrevIsDoctor(isDoctor);
  }, [selectedRoleId, isDoctor, setValue, prevIsDoctor]);

  useEffect(() => {
    console.log("Digital Signature Value:", digitalSignatureValue);
  }, [digitalSignatureValue]);

  return (
    <div className="space-y-6">
      {/* Medical Center & Role */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Medical Center" error={errors.centerId?.message}>
          <Controller
            name="centerId"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="centerId"
                value={field.value}
                onChange={field.onChange}
                options={centerOptions}
                placeholder="Select medical center"
              />
            )}
          />
        </FormField>

        <FormField label="Role" error={errors.role?.message}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="roleId"
                value={field.value}
                options={roleOptions}
                onChange={field.onChange}
                placeholder="Select role"
              />
            )}
          />
        </FormField>
      </div>

      {/* Name & Gender */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Name"
          error={errors.name?.message || errors.title?.message}
        >
          <div className="flex gap-2 w-full">
            <div className="min-w-32">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="title"
                    value={field.value}
                    onChange={field.onChange}
                    options={titleOptions}
                    placeholder="Title"
                  />
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="name"
                    type="text"
                    {...field}
                    placeholder="Full name"
                  />
                )}
              />
            </div>
          </div>
        </FormField>

        <FormField label="Gender" error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="gender"
                value={field.value}
                onChange={field.onChange}
                options={genderOptions}
                placeholder="Select gender..."
              />
            )}
          />
        </FormField>
      </div>

      {/* Username & Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Username" error={errors.userName?.message}>
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <InputField
                id="userName"
                type="text"
                {...field}
                placeholder="Username"
              />
            )}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <InputField
                id="email"
                type="email"
                {...field}
                placeholder="Email address"
              />
            )}
          />
        </FormField>
      </div>

      {/* Contact No */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Contact No" error={errors.contactNo?.message}>
          <Controller
            name="contactNo"
            control={control}
            render={({ field }) => (
              <InputField
                id="contactNo"
                type="text"
                {...field}
                placeholder="Phone number"
              />
            )}
          />
        </FormField>
        <FormField label="Remarks (Optional)" error={errors.remarks?.message}>
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <InputField
                id="remarks"
                type="text"
                {...field}
                placeholder="Enter remarks"
              />
            )}
          />
        </FormField>
      </div>

      {/* Doctor-specific fields */}
      {isDoctor && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="SLMC No" error={errors.slmcNo?.message}>
              <Controller
                name="slmcNo"
                control={control}
                render={({ field }) => (
                  <InputField
                    id="slmcNo"
                    type="text"
                    {...field}
                    placeholder="SLMC number"
                  />
                )}
              />
            </FormField>

            <FormField
              label="Specialization"
              error={errors.specialization?.message}
            >
              <Controller
                name="specialization"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="specialization"
                    value={field.value || ""}
                    onChange={field.onChange}
                    options={specializationOptions}
                    placeholder="Select specialization..."
                  />
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Digital Signature"
            error={errors.digitalSignature?.message}
          >
            <Controller
              name="digitalSignature"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  resetImages={resetImages}
                  setResetImages={setResetImages}
                  value={field.value || ""}
                  onChange={(url) => {
                    field.onChange(url);
                  }}
                />
              )}
            />
          </FormField>
        </>
      )}
    </div>
  );
}

export default UserForm;
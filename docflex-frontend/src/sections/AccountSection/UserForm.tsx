import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, UserFormData } from "@/schemas/Accounts/UserSchema";
import FormField from "@/components/Fields/FormField";
import Dropdown from "@/components/Dropdown/Dropdown";
import InputField from "@/components/InputField/InputField";

const titleOptions = ["Dr.", "Mr.", "Ms."].map((val) => ({
  label: val,
  value: val,
}));
const roleOptions = ["Admin", "Doctor", "Nurse"].map((val) => ({
  label: val,
  value: val,
}));
const genderOptions = ["Male", "Female", "Other"].map((val) => ({
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

function UserForm() {
  const { control } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      role: "",
      title: "",
      name: "",
      gender: "",
      userName: "",
      slmcNo: "",
      specialization: "",
      email: "",
      contactNo: "",
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
       <FormField label="Medical Center">
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="role"
              value={field.value}
              onChange={field.onChange}
              options={roleOptions}
              placeholder="Select role..."
            />
          )}
        />
      </FormField>
      <FormField label="Role">
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="role"
              value={field.value}
              onChange={field.onChange}
              options={roleOptions}
              placeholder="Select role..."
            />
          )}
        />
      </FormField>

      <FormField label="Name">
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
                <InputField id="name" type="text" {...field} className="w-full" placeholder="Full name" />
              )}
            />
          </div>
        </div>
      </FormField>

      <FormField label="Gender" error="">
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

      <FormField label="Username">
        <Controller
          name="userName"
          control={control}
          render={({ field }) => (
            <InputField id="userName" type="text" {...field} placeholder="Username" />
          )}
        />
      </FormField>

      <FormField label="SLMC No">
        <Controller
          name="slmcNo"
          control={control}
          render={({ field }) => (
            <InputField id="slmcNo" type="text" {...field} placeholder="SLMC number" />
          )}
        />
      </FormField>

      <FormField label="Specialization">
        <Controller
          name="specialization"
          control={control}
          render={({ field }) => (
            <Dropdown
              id="specialization"
              value={field.value}
              onChange={field.onChange}
              options={specializationOptions}
              placeholder="Select specialization..."
            />
          )}
        />
      </FormField>

      <FormField label="Email">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputField id="email" type="email" {...field} placeholder="Email address" />
          )}
        />
      </FormField>

      <FormField label="Contact No">
        <Controller
          name="contactNo"
          control={control}
          render={({ field }) => (
            <InputField id="contactNo" type="text" {...field} placeholder="Phone number" />
          )}
        />
      </FormField>
    </div>
  );
}

export default UserForm;
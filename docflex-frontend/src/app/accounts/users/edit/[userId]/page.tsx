"use client";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import UserForm from "@/sections/AccountSection/UserForm";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IoChevronBackOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormData, UserSchema } from "@/schemas/Accounts/UserSchema";
import { getUserById, updateUser } from "@/api/usersApi";
import { toast } from "react-toastify";

function Page() {
  const router = useRouter();
  const params = useParams();

  const userId: string | undefined = Array.isArray(params?.userId)
    ? params.userId[0]
    : params?.userId;

  const methods = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      centerId: "",
      role: "",
      title: "",
      name: "",
      gender: "",
      userName: "",
      slmcNo: "",
      specialization: "",
      email: "",
      contactNo: "",
      remarks: "",
      digitalSignature: "",
    },
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const data = await getUserById(userId);
        if (!data) {
          toast.error("User data not found");
          return;
        }

        // Map nested values for form
        const mappedData: UserFormData = {
          ...data,
          centerId: data.centerId?._id || "", // just the string id
          role: data.role?.roleId || "", // just the string id
        };

        console.log("User get by id (mapped):", mappedData);
        reset(mappedData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to load user details.");
      }
    };
    fetchUser();
  }, [userId, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      console.log("Form Submitted:", data);
      if (!userId) {
        toast.error("User ID not found");
        return;
      }
      await updateUser(userId, data); //
      toast.success("User updated successfully!");
      router.push("/accounts/users");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update user");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Tooltip content="Back" side="bottom">
          <button
            id="backButton"
            onClick={() => router.push("/accounts/users")}
            className="flex items-center gap-1 hover:text-blue-700 hover:font-bold"
          >
            <IoChevronBackOutline size={18} />
          </button>
        </Tooltip>
        <h3 className="flex items-center font-semibold font-inter">
          Update User
        </h3>
      </div>

      <div className="p-4 bg-white rounded-md shadow-sm">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <UserForm />

            <div className="flex flex-wrap justify-end gap-4 mt-6">
              <Button
                variant="outline"
                size="default"
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-semibold text-white transition bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="default"
                type="submit"
                className="px-6 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[100px]"
              >
                Update
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
}

export default Page;

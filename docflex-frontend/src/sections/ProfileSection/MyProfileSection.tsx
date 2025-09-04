"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getUserById, updateUser } from "@/api/usersApi";
import { changePassword } from "@/api/authApis";
import InputField from "@/components/InputField/InputField";
import Dropdown from "@/components/Dropdown/Dropdown";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import PasswordField from "@/components/InputField/PasswordField";
import { toast } from "react-toastify";

function MyProfileSection() {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    email: "",
    contactNo: "",
    gender: "",
    profilePicture: "",
  });

  const uploadImage = async (file: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Cloudinary error:", errorText);
      throw new Error(`Failed to upload image: ${res.statusText}`);
    }

    const data = await res.json();
    return data.secure_url;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?._id) {
        try {
          const data = await getUserById(user.userId);
          setUserData(data);
          setFormData({
            title: data.title || "",
            name: data.name || "",
            email: data.email || "",
            contactNo: data.contactNo || "",
            gender: data.gender || "",
            profilePicture: data.profilePicture || "",
          });
          setProfileImage(data.profilePicture || "/default-avatar.png");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast.error("Failed to load profile data");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show temporary preview
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setProfileImage(result);
        };
        reader.readAsDataURL(file);

        const imageUrl = await uploadImage(file);

        setProfileImage(imageUrl);
        setFormData((prev) => ({
          ...prev,
          profilePicture: imageUrl,
        }));
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast.error("Failed to upload profile image");
        setProfileImage(userData?.profilePicture || "/default-avatar.png");
      }
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      setIsSaving(true);
      await updateUser(userData.userId, formData);

      setUserData({ ...userData, ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSaving(true);
      setPasswordError("");
      await changePassword(
        userData.userName,
        passwordData.oldPassword,
        passwordData.newPassword
      );
      toast.success("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess("");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditProfileClick = () => {
    setIsEditing(true);
    setShowPasswordForm(false);
  };

  const handleChangePasswordClick = () => {
    setShowPasswordForm(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        title: userData.title || "",
        name: userData.name || "",
        email: userData.email || "",
        contactNo: userData.contactNo || "",
        gender: userData.gender || "",
        profilePicture: userData.profilePicture || "",
      });
      setProfileImage(userData.profilePicture || "/default-avatar.png");
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordForm(false);
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError("");
  };

  const titleOptions = [
    { value: "Mr.", label: "Mr." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Ms.", label: "Ms." },
    { value: "Dr.", label: "Dr." },
    { value: "Prof.", label: "Prof." },
  ];

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className=" bg-white ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Image Section */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              <Image
                src={profileImage || "/default-avatar.png"}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            {isEditing && (
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {userData?.name}
            </h2>
            <p className="text-gray-600">{userData?.role?.roleName}</p>
            <p className="text-gray-500 text-sm mt-1">
              {userData?.centerId?.centerName}
            </p>
          </div>

          <div className="mt-4 px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm font-medium text-gray-700">
              User ID: {userData?.userId}
            </span>
          </div>

          {!isEditing && !showPasswordForm && (
            <Button
              onClick={handleEditProfileClick}
              className="bg-blue-600 hover:bg-blue-700 text-white mt-6 md:w-[154px]"
            >
              Edit Profile
            </Button>
          )}

          {isEditing && (
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="border-gray-300 text-gray-700 md:w-[154px]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white md:w-[154px]"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}

          {!showPasswordForm && !isEditing && (
            <Button
              onClick={handleChangePasswordClick}
              variant="outline"
              className="mt-2 border-blue-300 text-blue-600 hover:bg-blue-50 md:min-w-[154px]"
            >
              Change Password
            </Button>
          )}

          {showPasswordForm && (
            <Button
              onClick={handleCancelPassword}
              variant="outline"
              className="mt-6 border-red-400 text-red-600 md:min-w-[154px]"
            >
              Cancel Password Change
            </Button>
          )}
        </div>

        <div className="md:col-span-2">
          {showPasswordForm && (
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Change Password
              </h3>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  {passwordSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <PasswordField
                    id="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <PasswordField
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <PasswordField
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <Button
                onClick={handlePasswordSubmit}
                disabled={isSaving}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? "Updating..." : "Update Password"}
              </Button>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                {isEditing ? (
                  <Dropdown
                    id="title"
                    value={formData.title}
                    options={titleOptions}
                    onChange={(value) =>
                      setFormData({ ...formData, title: value })
                    }
                  />
                ) : (
                  <div className="p-2 bg-white rounded border border-gray-200 min-h-10">
                    {userData?.title || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <InputField
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 bg-white rounded border border-gray-200 min-h-10">
                    {userData?.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                {isEditing ? (
                  <Dropdown
                    id="gender"
                    value={formData.gender}
                    options={genderOptions}
                    onChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  />
                ) : (
                  <div className="p-2 bg-white rounded border border-gray-200 min-h-10">
                    {userData?.gender || "Not provided"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                {isEditing ? (
                  <InputField
                    id="contactNo"
                    type="tel"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 bg-white rounded border border-gray-200 min-h-10">
                    {userData?.contactNo || "Not provided"}
                  </div>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                {isEditing ? (
                  <InputField
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="p-2 bg-white rounded border border-gray-200 min-h-10">
                    {userData?.email}
                  </div>
                )}
              </div>
            </div>

            {/* Read-only fields */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Account Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 min-h-10">
                    {userData?.userName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User Role
                  </label>
                  <div className="p-2 bg-gray-100 rounded border border-gray-200 min-h-10">
                    {userData?.role?.roleName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfileSection;

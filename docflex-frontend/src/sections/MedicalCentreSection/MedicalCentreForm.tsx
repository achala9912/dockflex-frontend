"use client";

import InputField from "@/components/InputField/InputField";
import ImageUploader, { UploadedImage } from "@/components/InputImage/ImageUploader";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CentreSchema, CentreFormData } from "@/schemas/MedicalCentres/CentreSchema";
import React, { useEffect, useState } from "react";

function MedicalCentreForm() {
    const [resetImages, setResetImages] = useState(false);

    const {
        register,
        watch,
        control,
        formState: { errors },
    } = useForm<CentreFormData>({
        resolver: zodResolver(CentreSchema),
    });

    useEffect(() => {
        const formImages = watch("image");
        if (formImages) {
            // Handle any additional form state logic if needed
        }
    }, [watch]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="centreName" className="block mb-1 text-sm font-medium text-gray-700">
                        Medical Centre Name
                    </label>
                    <InputField
                        id="centreName"
                        type="text"
                        placeholder="Enter Medical Centre Name"
                        {...register("centreName")}
                    />
                    {errors.centreName && <p className="text-red-500 text-sm">{errors.centreName.message}</p>}
                </div>

                <div>
                    <label htmlFor="regNo" className="block mb-1 text-sm font-medium text-gray-700">
                        Reg No
                    </label>
                    <InputField id="regNo" type="text" placeholder="Enter Reg No" {...register("regNo")} />
                    {errors.regNo && <p className="text-red-500 text-sm">{errors.regNo.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <InputField id="address" type="text" placeholder="Enter Address" {...register("address")} />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>

                <div>
                    <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">
                        City
                    </label>
                    <InputField id="city" type="text" placeholder="Enter City" {...register("city")} />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="contactNo" className="block mb-1 text-sm font-medium text-gray-700">
                        Contact No
                    </label>
                    <InputField id="contactNo" type="text" placeholder="Enter Contact No" {...register("contactNo")} />
                    {errors.contactNo && <p className="text-red-500 text-sm">{errors.contactNo.message}</p>}
                </div>

                <div>
                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <InputField id="email" type="email" placeholder="Enter Email" {...register("email")} />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="logoUpload" className="block mb-2 text-sm font-medium text-gray-700">
                    Logo Upload
                </label>
                <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                        <ImageUploader
                            resetImages={resetImages}
                            setResetImages={setResetImages}
                            value={Array.isArray(field.value) && field.value.length > 0 ? (field.value[0] as UploadedImage).url : ""}
                            onChange={(newImages) => {
                                const updatedImages = Array.isArray(newImages)
                                    ? newImages.map((img) => img.url)
                                    : [];
                                field.onChange(updatedImages);
                            }}
                        />
                    )}
                />
                {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
            </div>
        </div>
    );
}

export default MedicalCentreForm;

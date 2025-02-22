import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import DeleteConfirm from "../Popups/DeleteConfirm";

export interface UploadedImage {
    file?: File;
    preview: string;
    url: string;
}

interface ImageUploaderProps {
    resetImages: boolean;
    setResetImages: React.Dispatch<React.SetStateAction<boolean>>;
    value?: string;
    onChange?: (value: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    resetImages,
    setResetImages,
    value = "",
    onChange,
}) => {
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (value) {
            setSelectedImage({ preview: value, url: value });
        } else {
            setSelectedImage(null);
        }
    }, [value]);

    useEffect(() => {
        if (resetImages) {
            setSelectedImage(null);
            setResetImages(false);
        }
    }, [resetImages, setResetImages]);

    const handleAddImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setIsLoading(true);
            const file = event.target.files[0];
            const uploadedImage: UploadedImage = await uploadImage(file);
            setSelectedImage(uploadedImage);
            onChange?.(uploadedImage.url);
            setIsLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        onChange?.("");
    };

    const uploadImage = async (file: File): Promise<UploadedImage> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const previewUrl = URL.createObjectURL(file);
                resolve({ preview: previewUrl, url: previewUrl });
            }, 1500); // Simulate upload delay
        });
    };

    return (
        <div>
            {/* Large Image Preview */}
            <div className="min-h-20 rounded-md w-full h-fit p-2 mb-4 border border-gray-400 relative flex justify-center items-center bg-white">
                {isLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <p className="text-sm text-gray-500 font-semibold">Uploading...</p>
                    </div>
                ) : selectedImage ? (
                    <Image
                        src={selectedImage.preview}
                        alt="Selected Preview"
                        layout="intrinsic"
                        width={400}
                        height={250}
                        className="rounded-lg"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full rounded-lg h-auto ">
                        <p className="text-sm text-gray-500">No Image Selected</p>
                    </div>
                )}
            </div>

            {/* Thumbnail with Remove Button */}
            {selectedImage && (
                <div className="relative w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden">
                    <Image
                        src={selectedImage.preview}
                        alt="Thumbnail"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                    
                    {/* Remove Button */}
                    <button
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        onClick={() => setIsPopupOpen(true)}
                    >
                        <AiOutlineClose size={12} />
                    </button>
                </div>
            )}

            {/* Upload Button (Hidden if an image is already selected) */}
            {!selectedImage && (
                <label className="mt-3 flex items-center justify-center w-20 h-20 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer">
                    <AiOutlinePlus size={24} className="text-blue-500" />
                    <input type="file" className="hidden" onChange={handleAddImage} accept="image/*" />
                </label>
            )}

            {/* Delete Confirmation Popup */}
            {isPopupOpen && (
                <DeleteConfirm
                    element="this image"
                    onDelete={() => {
                        handleRemoveImage();
                        setIsPopupOpen(false);
                    }}
                    onCancel={() => setIsPopupOpen(false)}
                    isOpen={isPopupOpen}
                />
            )}
        </div>
    );
};

export default ImageUploader;

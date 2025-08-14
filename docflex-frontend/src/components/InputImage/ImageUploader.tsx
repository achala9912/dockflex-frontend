"use client";

import React, { useState, useEffect, useCallback } from "react";
import NextImage from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import DeleteConfirm from "../Popups/DeleteConfirm";
import { Button } from "../ui/button";

export interface UploadedImage {
  file?: File;        
  preview: string;     
  uploadedUrl?: string; 
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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropping, setCropping] = useState(false);

  // Load existing uploaded image
  useEffect(() => {
    if (value) {
      setSelectedImage({ preview: value, uploadedUrl: value });
    } else {
      setSelectedImage(null);
    }
  }, [value]);

  // Reset images
  useEffect(() => {
    if (resetImages) {
      setSelectedImage(null);
      setResetImages(false);
    }
  }, [resetImages, setResetImages]);

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({ preview: previewUrl, file });
      setCropping(true);
    }
  };

  const handleCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!selectedImage?.preview || !croppedAreaPixels) return;

    try {
      setIsLoading(true);

      // Create cropped blob from original preview image
      const croppedBlob = await getCroppedBlob(
        selectedImage.preview,
        croppedAreaPixels
      );

      // Upload to Cloudinary
      const uploadedUrl = await uploadImage(croppedBlob);

      // Save both preview and uploaded URL
      setSelectedImage((prev) =>
        prev ? { ...prev, uploadedUrl, preview: uploadedUrl } : null
      );

      onChange?.(uploadedUrl);
    } catch (err) {
      console.error("Crop or upload failed:", err);
    } finally {
      setCropping(false);
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onChange?.("");
  };

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

  return (
    <div>
      {/* Cropper Popup */}
      {cropping && selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96">
            <Cropper
              image={selectedImage.preview}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
            <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
              <div className="bg-white p-3 rounded-lg shadow-lg flex gap-4">
                <Button
                  onClick={() => setCropping(false)}
                  className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700 min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCropConfirm}
                  className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 min-w-[100px]"
                >
                  Crop
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="min-h-20 rounded-md w-full h-fit p-2 mb-4 border border-gray-400 flex justify-center items-center bg-white">
        {isLoading ? (
          <p className="text-sm text-gray-500 font-semibold">Uploading...</p>
        ) : selectedImage?.preview ? (
          <NextImage
            src={selectedImage.preview}
            alt="Selected Preview"
            width={400}
            height={250}
            className="rounded-lg"
          />
        ) : (
          <p className="text-sm text-gray-500">No Image Selected</p>
        )}
      </div>

      {/* Thumbnail + Remove */}
      {selectedImage && (
        <div className="relative w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden">
          <NextImage
            src={selectedImage.preview}
            alt="Thumbnail"
            fill
            className="object-cover rounded-md"
          />
          <button
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            onClick={() => setIsPopupOpen(true)}
          >
            <AiOutlineClose size={12} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      {!selectedImage && (
        <label className="mt-3 flex items-center justify-center w-20 h-20 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer">
          <AiOutlinePlus size={24} className="text-blue-500" />
          <input
            type="file"
            className="hidden"
            onChange={handleAddImage}
            accept="image/*"
          />
        </label>
      )}

      {/* Delete Confirmation */}
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

/* ---------- Helper functions ---------- */
async function getCroppedBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Canvas is empty");
      resolve(blob);
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!url.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

export default ImageUploader;

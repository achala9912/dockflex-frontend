import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import DeleteConfirm from "../Popups/DeleteConfirm";
import { Area } from "react-easy-crop";
import { Button } from "../ui/button";

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
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(
    null
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [cropping, setCropping] = useState(false);

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
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage({ preview: previewUrl, url: previewUrl });
      setCropping(true);
      setIsLoading(false);
    }
  };

  const handleCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    setIsLoading(true);
    const croppedImage = await getCroppedImg(
      selectedImage.preview,
      croppedAreaPixels
    );
    setSelectedImage({ preview: croppedImage, url: croppedImage });
    onChange?.(croppedImage);
    setCropping(false);
    setIsLoading(false);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onChange?.("");
  };

  return (
    <div>
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
                  className="flex-1 px-4 py-2 text-white bg-red-500 border rounded-lg shadow-sm hover:bg-red-700 min-w-[100px]"
                >
                  Cancel Crop
                </Button>
                <Button
                  onClick={handleCropConfirm}
                  className="flex-1 px-4 py-2 text-white bg-blue-500 border rounded-lg shadow-sm hover:bg-blue-700 min-w-[100px]"
                >
                  Crop Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-20 rounded-md w-full h-fit p-2 mb-4 border border-gray-400 relative flex justify-center items-center bg-white">
        {isLoading ? (
          <p className="text-sm text-gray-500 font-semibold">Uploading...</p>
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
          <p className="text-sm text-gray-500">No Image Selected</p>
        )}
      </div>

      {selectedImage && (
        <div className="relative w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden">
          <Image
            src={selectedImage.preview}
            alt="Thumbnail"
            layout="fill"
            objectFit="cover"
            className="rounded-md"
          />
          <button
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            onClick={() => setIsPopupOpen(true)}
          >
            <AiOutlineClose size={12} />
          </button>
        </div>
      )}

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

// Helper function to crop image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<string> {
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
  return new Promise<string>((resolve) => {
    canvas.toBlob(
      (blob) => blob && resolve(URL.createObjectURL(blob)),
      "image/jpeg"
    );
  });
}

// Helper function to create an image from URL
async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
}

export default ImageUploader;

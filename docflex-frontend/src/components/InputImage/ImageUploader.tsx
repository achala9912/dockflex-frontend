import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import DeleteConfirm from "@/components/Popups/DeleteConfirm";

export interface UploadedImage {
  file?: File;
  preview: string;
  url: string;
}

interface ImageUploaderProps {
  images?: UploadedImage[];
  setImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
  resetImages: boolean;
  setResetImages: React.Dispatch<React.SetStateAction<boolean>>;
  maxImages?: number;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  setImages,
  resetImages,
  setResetImages,
  maxImages = 5,
  value = "",
  onChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<UploadedImage | null>(null);

  useEffect(() => {
    if (value) {
      if (maxImages === 1 && typeof value === "string") {
        setImages([{ preview: value, url: value }]);
        setSelectedImage({ preview: value, url: value });
      } else if (Array.isArray(value)) {
        setImages(value.map((url) => ({ preview: url, url })));
        setSelectedImage(value.length > 0 ? { preview: value[0], url: value[0] } : null);
      }
    } else {
      setImages([]);
      setSelectedImage(null);
    }
  }, [value, maxImages, setImages]);

  useEffect(() => {
    if (resetImages) {
      setSelectedImage(null);
      setImages([]);
      setResetImages(false);
    }
  }, [resetImages, setImages, setResetImages]);

  const handleAddImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const uploadedImages: UploadedImage[] = await Promise.all(
        files.map(async (file) => {
          const preview = URL.createObjectURL(file);
          const url = await uploadImage(file);
          return { file, preview, url };
        })
      );

      if (maxImages === 1) {
        const newImage = uploadedImages[0];
        setImages([newImage]);
        onChange?.(newImage.url);
        setSelectedImage(newImage);
      } else {
        const newImages = [...images, ...uploadedImages];
        setImages(newImages);
        onChange?.(newImages.map((img) => img.url));
        if (!selectedImage) setSelectedImage(uploadedImages[0]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (selectedImage === images[index]) {
      setSelectedImage(updatedImages.length > 0 ? updatedImages[0] : null);
    }
    onChange?.(maxImages === 1 ? "" : updatedImages.map((img) => img.url));
  };

  const handleImageClick = (image: UploadedImage) => {
    setSelectedImage(image);
  };

  const closeConfirmationPopup = () => {
    setImageToDelete(null);
    setIsPopupOpen(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xtypbke7");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_API as string, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to upload image: ${response.statusText}`);
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  return (
    <div>
      <div className="relative rounded-md w-full h-[22rem] p-2 mb-4 border border-gray-300">
        {selectedImage ? (
          <Image src={selectedImage.preview} alt="Selected Preview" layout="fill" objectFit="cover" className="rounded-lg" />
        ) : (
          <div className="flex items-center justify-center w-full rounded-lg h-80">
            <p className="text-sm text-gray-500">No Image Selected</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap space-x-4">
        {images.map((image, index) => (
          <div key={index} className={`relative w-20 h-20 border-2 rounded-lg cursor-pointer ${selectedImage?.preview === image.preview ? "border-blue-500" : "border-gray-200"}`} onClick={() => handleImageClick(image)}>
            <Image src={image.preview} alt={`Preview ${index}`} width={80} height={80} className="rounded-lg" />
            <button className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1" onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}>
              <AiOutlineClose size={16} />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="flex items-center justify-center w-20 h-20 border-2 border-blue-500 border-dashed rounded-lg cursor-pointer">
            <AiOutlinePlus size={24} className="text-blue-500" />
            <input type="file" multiple={maxImages !== 1} className="hidden" onChange={handleAddImages} accept="image/*" />
          </label>
        )}
      </div>

      {isPopupOpen && (
        <DeleteConfirm
          element="this image"
          onDelete={() => {
            if (imageToDelete) {
              const index = images.findIndex((img) => img.preview === imageToDelete.preview);
              if (index !== -1) handleRemoveImage(index);
            }
          }}
          onCancel={closeConfirmationPopup}
          isOpen={isPopupOpen}
        />
      )}
    </div>
  );
};

export default ImageUploader;
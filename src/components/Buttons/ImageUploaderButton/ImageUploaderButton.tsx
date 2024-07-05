import { useState, useEffect } from "react";

import {
  saveImage,
  loadImageBase64,
} from "../../../shared/utils/backgroundUtils";

interface ImageUploaderProps {
  setImageSrc: (src: string | null) => void;
}

export const ImageUploaderButton = ({ setImageSrc }: ImageUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const uploadImage = async () => {
        try {
          await saveImage(selectedFile);
          const base64 = await loadImageBase64(selectedFile.name);
          if (base64) {
            setImageSrc(base64);
          }
        } catch (error) {
          console.error("Failed to upload image:", error);
        }
      };
      uploadImage();
    }
  }, [selectedFile, setImageSrc]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  return (
    <div className="relative h-[22px] min-w-24 cursor-pointer rounded border border-[#EBDCB2] bg-[#d92800] px-6 text-center text-[10px] leading-5 duration-300 hover:bg-[#EBDCB2] hover:text-[#d92800]">
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="absolute inset-0 flex cursor-pointer items-center justify-center"
      >
        Select
      </label>
    </div>
  );
};

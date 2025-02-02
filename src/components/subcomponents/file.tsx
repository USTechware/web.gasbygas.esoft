import { CheckCircleIcon, LoaderCircleIcon } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ label, fileUrl, error, setFileUrl }: {
  label?: string;
  fileUrl: string;
  error?: string;
  setFileUrl: (url: string) => void;
}) => {

  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(
    async (files: File[]) => {
      const uploadId = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_ID;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      try {
        setIsUploading(true);
        await Promise.all(
          files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset as string);
            setIsUploading(true);

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${uploadId}/upload`
              , {
              method: 'POST',
              body: formData,
            });

            const responseData = await response.json();
            const { secure_url: url } = responseData;
            return Promise.resolve(url);
          }),
        )
          .then((urls) => {
            setFileUrl(urls[0])
            setIsUploading(false);
          })
          .finally(() => setIsUploading(false));
      } catch (error) {
      } finally {
        setIsUploading(false);
      }
    },
    [setFileUrl, setIsUploading],
  );

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      upload([file])
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': [], 
      'image/jpeg': [], 
      'image/jpg': [], 
      'application/pdf': []
    },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center">
      {label && <label className="mb-2 text-sm text-gray-700 w-full text-left">{label}</label>}
      <div
        {...getRootProps()}
        className="w-full h-40 border-2 rounded-sm border-dashed border-gray-400 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 transition-all"
      >
        <input {...getInputProps()} />
        {fileUrl ? (
          <div className="relative w-32 h-32 mt-2 rounded-lg overflow-hidden flex items-center flex-col justify-center shadow-sm">
            <div className="my-4">File Attached</div>
            <CheckCircleIcon color="green" size="30px"/>
          </div>
        ) : (
          <p className="text-gray-500 text-center m-10">Click or Drag & Drop a file here.</p>
        )}
        { isUploading && <p className="text-gray-500 text-center m-10">Please wait, upload in progress...</p>}
          </div>
          {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default FileUploader;

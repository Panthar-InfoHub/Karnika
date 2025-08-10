"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";

type FileUploaderProps = {
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  autoUpload?: boolean;
  multiple?: boolean; // single or multiple mode
  onUploadComplete?: (urls: string[]) => void; // callback after upload
};



export const FileSvgDraw = ({ maxFiles }: { maxFiles: number }) => (
  <div className="flex flex-col items-center justify-center p-6 border-dashed border rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
    <div className="w-12 h-12 mb-2 p-3 bg-gray-100 rounded-lg dark:bg-gray-800">
      <Upload className="w-6 h-6 text-gray-400" />
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
      <span className="font-semibold">Click to upload</span> or drag and drop
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
      PNG, JPG, GIF up to {maxFiles} files
    </p>
  </div>
);

export default function FileUploader({
  maxFiles = 10,
  maxSizeMB = 10,
  allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  autoUpload = false,
  multiple = true,
  onUploadComplete,
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFiles = (incoming: File[]) =>
    incoming.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Unsupported file type: ${file.name}`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File is too large: ${file.name}`);
        return false;
      }
      if (files.some((f) => f.name === file.name && f.size === file.size)) return false;
      return true;
    });

  const handleSelectFiles = (selected: File[]) => {
    if (files.length + selected.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }
    const validFiles = validateFiles(selected);
    if (validFiles.length > 0) {
      const newPreviews = validFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setFiles((prev) => [...prev, ...validFiles]);
      setPreviews((prev) => [...prev, ...newPreviews]);

      if (autoUpload) {
        uploadFiles([...validFiles]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSelectFiles(Array.from(e.target.files || []));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleSelectFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setPreviews((prev) => prev.filter((p) => p.file.name !== fileName));
  };

  const uploadToCloud = async (file: File): Promise<string> => {
    // mock upload → return cloud URL

    await new Promise((res) => setTimeout(res, 800));
    return URL.createObjectURL(file);
  };

  const uploadFiles = useCallback(
    async (uploadList: File[] = files) => {
      if (uploadList.length === 0) return;
      setIsUploading(true);

      try {
        const urls = await Promise.all(uploadList.map(uploadToCloud));
        onUploadComplete?.(urls);
        if (!autoUpload) {
          // clear after manual upload
          setFiles([]);
          setPreviews([]);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [files, autoUpload, onUploadComplete]
  );

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div className="relative" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
        <label className="block">
          <input
            type="file"
            accept={allowedTypes.join(",")}
            multiple={multiple}
            className="hidden"
            onChange={handleInputChange}
            disabled={files.length >= maxFiles}
          />
          <div className={files.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}>
            <FileSvgDraw maxFiles={maxFiles} />
          </div>
        </label>
      </div>


      {/* Previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((p) => (
            <div key={p.url} className="relative w-16 h-16 border rounded overflow-hidden">
              <img src={p.url} alt={p.file.name} className="object-cover w-full h-full" />
              {!autoUpload && (
                <button
                  onClick={() => removeFile(p.file.name)}
                  className="absolute top-0 right-0 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button if manual */}
      {!autoUpload && files.length > 0 && (
        <Button onClick={() => uploadFiles()} disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" /> Upload {files.length} Files
            </>
          )}
        </Button>
      )}
    </div>
  );
}

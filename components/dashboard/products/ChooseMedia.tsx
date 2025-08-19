import React, {  useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogContent,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import FileUploader from "../FileUploader";

const ChooseMedia = ({
  setSelectedUrls,
  selectedUrls,
}: {
  setSelectedUrls: (urls: string[]) => void;
  selectedUrls: string[];
}) => {
  const [existingFiles] = useState<string[]>([
    "https://picsum.photos/id/237/200/300",
    "https://picsum.photos/id/238/200/300",
    "https://picsum.photos/id/239/200/300",
    "https://picsum.photos/id/240/200/300",
  ]);
  const [tab, setTab] = useState<"upload" | "existing">("upload");

  const handleSelectExisting = (url: string) => {
    if (selectedUrls.includes(url)) {
      setSelectedUrls(selectedUrls.filter((item) => item !== url));
      return;
    }
    setSelectedUrls([...selectedUrls, url]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Manage Files</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Files</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b pb-2">
          <Button
            variant={tab === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("upload")}
          >
            Upload
          </Button>
          <Button
            variant={tab === "existing" ? "default" : "outline"}
            size="sm"
            onClick={() => setTab("existing")}
          >
            Choose Existing
          </Button>
        </div>

        <div className="mt-4">
          {tab === "upload" && (
            <FileUploader
              maxFiles={5}
              //   autoUpload
              onUploadComplete={(urls: string[]) =>
                setSelectedUrls([...selectedUrls, ...urls])
              }
            />
          )}

          {tab === "existing" && (
            <div className="grid grid-cols-4 gap-3">
              {existingFiles.length > 0 ? (
                existingFiles.map((url) => (
                  <div
                    key={url}
                    className={`relative cursor-pointer border rounded overflow-hidden ${selectedUrls.includes(url) ? "ring-2 ring-blue-500" : ""
                      }`}
                    onClick={() => handleSelectExisting(url)}
                  >
                    <img
                      src={url}
                      alt="file"
                      className="object-cover w-full h-20"
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-4 text-center text-gray-500">
                  No existing files found
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChooseMedia;

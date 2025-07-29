import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "./progress";

export function Dropzone({
  onChange,
  className,
  fileExtension,
  progress,
  resetView,
  progressValue,
  ...props
}) {
  const fileInputRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFileInfo(null);
    setError(null);
  }, [resetView]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const uploadedFile = files[0];

    if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
      setError(`Invalid file type. Expected: .${fileExtension}`);
      return;
    }

    const fileSizeInKB = Math.round(uploadedFile.size / 1024);

    onChange((prevFiles) => [...prevFiles, ...files]);
    setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
    setError(null);
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`border-2 border-dashed bg-muted hover:border-muted-foreground/50 ${className}`}
      {...props}
    >
      <CardContent
        className="flex flex-col items-center justify-center px-2 py-4 space-y-2 text-xs"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="font-medium">
            Drag Files to Upload or{" "}
            <span
              variant="ghost"
              size="sm"
              className="text-xs font-bold cursor-pointer"
              onClick={handleButtonClick}
            >
              Click Here
            </span>
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept={`.${fileExtension}`}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
        {progress && (
          <Progress value={progressValue} className="w-[60%]" />
        )}
        {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  );
}
"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderFive } from "@/components/ui/loader";

const OUTPUT_FORMATS = [
  "pdf",
  "docx",
  "txt",
  "html",
  "jpg",
  "png",
  "webp",
  "csv",
  "xlsx",
  "json",
];

export default function UniversalConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (files: File[]) => {
    setFile(files[0] || null);
    setOutputFormat(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("outputFormat", outputFormat);

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || "Conversion failed");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.split(".")[0]}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Alert>
        <Terminal />
        <AlertTitle>Under Development</AlertTitle>
        <AlertDescription>
          We’re actively improving our conversion algorithms. Some formats may
          not work during this phase.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border border-dashed rounded-lg bg-background">
        <FileUpload onChange={handleFileUpload} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Convert to</label>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              disabled={!file}
            >
              {outputFormat
                ? outputFormat.toUpperCase()
                : "Select format"}
              <ChevronDown className="h-4 w-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-full">
            {OUTPUT_FORMATS.map((format) => (
              <DropdownMenuItem
                key={format}
                onClick={() => setOutputFormat(format)}
              >
                {format.toUpperCase()}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button
        onClick={handleConvert}
        disabled={!file || !outputFormat || loading}
        className="w-full"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <LoaderFive text="Converting..." />
          </span>
        ) : (
          "Convert & Download"
        )}
      </Button>
    </div>
  );
}

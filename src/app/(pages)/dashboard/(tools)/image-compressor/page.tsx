"use client";

import React, { useState } from "react";
import { Download, Zap, ImageIcon } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { LoaderFive } from "@/components/ui/loader";

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

export default function ImgCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSizeKB, setTargetSizeKB] = useState(500);
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFileUpload = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setFile(selected);
    setOriginalSize(selected.size);
    setCompressedImage(null);
    setCompressedSize(0);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetSizeKB", targetSizeKB.toString());

      const response = await fetch("/api/compress-image", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      setCompressedImage(blob);
      setCompressedSize(blob.size);
    } catch {
      alert("Image compression failed.");
    } finally {
      setLoading(false);
    }
  };

  const compressionRatio =
    originalSize && compressedSize
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : "0";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Image Compressor</h2>
          <p className="text-sm text-muted-foreground">
            Compress images to a specific size
          </p>
        </div>
      </div>

      {/* Upload */}
      <div className="rounded-lg border border-dashed bg-background">
        <FileUpload onChange={handleFileUpload} />
      </div>

      {/* Target size */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Target size (KB)
        </label>
        <input
          type="number"
          value={targetSizeKB}
          onChange={(e) => setTargetSizeKB(Number(e.target.value))}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Info */}
      {file && (
        <div className="rounded-md border bg-muted/30 p-4 text-sm space-y-1">
          <div className="flex justify-between">
            <span>File</span>
            <span className="font-medium truncate">{file.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Original</span>
            <span>{formatBytes(originalSize)}</span>
          </div>
          {compressedSize > 0 && (
            <>
              <div className="flex justify-between">
                <span>Compressed</span>
                <span>{formatBytes(compressedSize)}</span>
              </div>
              <div className="flex justify-between">
                <span>Reduction</span>
                <span className="font-medium">{compressionRatio}%</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Compress */}
      <div
        className={
          compressedImage
            ? "grid grid-cols-2 gap-3"
            : "w-full"
        }
      >
        {/* Compress button */}
        <button
          onClick={handleCompress}
          disabled={!file || loading}
          className={`rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium disabled:opacity-50 ${compressedImage ? "w-full" : "w-full"
            }`}
        >
          {loading ? (
            <LoaderFive text="Compressing image..." />
          ) : (
            "Compress Image"
          )}
        </button>

        {/* Download button */}
        {compressedImage && (
          <a
            href={URL.createObjectURL(compressedImage)}
            download="compressed.jpg"
            className="flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            Download
          </a>
        )}
      </div>

    </div>
  );
}

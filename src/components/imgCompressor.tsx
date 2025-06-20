"use client";
import React, { useState } from "react";
import { UploadCloud, Download, Camera, Zap, ImageIcon } from "lucide-react";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(500);
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      setPreviewUrl(URL.createObjectURL(selected));
      setCompressedImage(null);
    }
  };

  const handleCompress = async () => {
    if (!file || !targetSizeKB) return;
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
    } catch (error) {
      console.error("Compression error:", error);
      alert("Image compression failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const compressionRatio =
    originalSize && compressedSize
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="relative mt-[100px] z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-lg w-full hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Image Compressor
            </span>
          </h2>
          <p className="text-white/70 text-sm">
            Optimize your images with precision
          </p>
        </div>

        {/* Upload area */}
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-white/5 transition-all duration-300 relative overflow-hidden group">
          {previewUrl ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover w-full h-full rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                  Click to change image
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <UploadCloud className="h-12 w-12 text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-medium block mb-2">
                Drop your image here
              </span>
              <span className="text-white/60 text-sm">or click to browse</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Target size input */}
        <div className="mt-6">
          <label className="text-sm font-medium text-white/90 block mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Target File Size (KB)
          </label>
          <input
            type="number"
            value={targetSizeKB}
            onChange={(e) => setTargetSizeKB(parseInt(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none"
            placeholder="Enter size in KB"
          />
        </div>

        {/* File info */}
        {file && (
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">File:</span>
              <span className="text-white text-sm font-medium truncate ml-2">
                {file.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Original size:</span>
              <span className="text-blue-300 text-sm font-medium">
                {formatBytes(originalSize)}
              </span>
            </div>
            {compressedSize > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">
                    Compressed size:
                  </span>
                  <span className="text-green-300 text-sm font-medium">
                    {formatBytes(compressedSize)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-sm">Reduction:</span>
                  <span className="text-purple-300 text-sm font-medium">
                    {compressionRatio}%
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Compress button */}
        <button
          onClick={handleCompress}
          disabled={loading || !file}
          className={`mt-8 w-full px-6 py-4 font-semibold rounded-xl transition-all duration-300 ${
            loading || !file
              ? "bg-white/10 text-white/50 cursor-not-allowed border border-white/20"
              : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 border-none"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Compressing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Compress Image
            </div>
          )}
        </button>

        {/* Download section */}
        {compressedImage && !loading && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4 mb-4">
              <p className="text-green-300 font-semibold mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Compression Complete!
              </p>
              <p className="text-white/80 text-sm">
                Reduced by{" "}
                <span className="text-purple-300 font-medium">
                  {compressionRatio}%
                </span>
              </p>
            </div>
            <a
              href={URL.createObjectURL(compressedImage)}
              download="compressed.jpg"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 font-medium"
            >
              <Download className="w-5 h-5" />
              Download Compressed Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

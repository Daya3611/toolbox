"use client";
import React, { useState, useEffect } from "react";
import { UploadCloud, Download, FileText, Zap, Eye } from "lucide-react";
import { toast } from "sonner";

function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(2)} ${units[i]}`;
}

export default function PdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("pdf");
  const [convertedFile, setConvertedFile] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSize(selected.size);
      setConvertedFile(null);
      generateThumbnail(selected);
    }
  };

  const generateThumbnail = (file: File) => {
    const fileType = file.type;
    
    if (fileType.startsWith('image/')) {
      // For images, create a direct preview
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
    } else if (fileType === 'application/pdf') {
      // For PDFs, we'll show a PDF icon with file info
      setThumbnailUrl('pdf');
    } else if (fileType.includes('document') || fileType.includes('word')) {
      // For documents, show document icon
      setThumbnailUrl('document');
    } else if (fileType === 'text/plain') {
      // For text files, show text preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setThumbnailUrl(`text:${text.substring(0, 200)}`);
      };
      reader.readAsText(file);
    } else {
      setThumbnailUrl('unknown');
    }
  };

  const handleConvert = async () => {
  if (!file || !outputFormat) return;
  setLoading(true);

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
      toast.error(err.error || "Conversion failed");
      return;
    }

    const blob = await response.blob();
    setConvertedFile(blob);
    setConvertedSize(blob.size);
  } catch (error) {
    console.error("Conversion error:", error);
    toast.error("Something went wrong during conversion.");
  } finally {
    setLoading(false);
  }
};

const supportedFormats = [
  { value: "pdf", label: "PDF", icon: "📄" },
  { value: "docx", label: "Word Document", icon: "📝" },
  { value: "doc", label: "DOC File", icon: "📄" },
  { value: "txt", label: "Text File", icon: "📃" },
  { value: "html", label: "HTML File", icon: "🌐" },
  { value: "jpg", label: "JPEG Image", icon: "🖼️" },
  { value: "jpeg", label: "JPEG Image", icon: "🖼️" },
  { value: "png", label: "PNG Image", icon: "🖼️" },
  { value: "webp", label: "WEBP Image", icon: "🖼️" },
  { value: "tiff", label: "TIFF Image", icon: "🖼️" },
  { value: "odt", label: "ODT Document", icon: "📄" },
  { value: "rtf", label: "RTF Document", icon: "📄" },
  { value: "xlsx", label: "Excel Sheet", icon: "📊" },
  { value: "pptx", label: "PowerPoint", icon: "📽️" },
];


  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'txt': return '📃';
      case 'jpg':
      case 'jpeg':
      case 'png': return '🖼️';
      default: return '📁';
    }
  };

  const renderThumbnail = () => {
    if (!thumbnailUrl || !file) return null;

    if (thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('blob:')) {
      // Image preview
      return (
        <div className="relative group">
          <img
            src={thumbnailUrl}
            alt="File preview"
            className="w-24 h-24 object-cover rounded-xl border-2 border-white/20 shadow-lg"
          />
          <button
            onClick={() => setShowPreview(true)}
            className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <Eye className="w-6 h-6 text-white" />
          </button>
        </div>
      );
    } else if (thumbnailUrl === 'pdf') {
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-400/30 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-1">📄</div>
            <div className="text-xs text-red-300 font-medium">PDF</div>
          </div>
        </div>
      );
    } else if (thumbnailUrl === 'document') {
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-400/30 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-xs text-blue-300 font-medium">DOC</div>
          </div>
        </div>
      );
    } else if (thumbnailUrl.startsWith('text:')) {
      const text = thumbnailUrl.substring(5);
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-400/30 rounded-xl p-2 overflow-hidden relative group">
          <div className="text-xs text-green-100 leading-tight">
            {text.substring(0, 50)}...
          </div>
          <button
            onClick={() => setShowPreview(true)}
            className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          >
            <Eye className="w-6 h-6 text-white" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="w-24 h-24 bg-gradient-to-br from-gray-500/20 to-gray-600/20 border-2 border-gray-400/30 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl mb-1">📁</div>
            <div className="text-xs text-gray-300 font-medium">FILE</div>
          </div>
        </div>
      );
    }
  };

  const renderPreviewModal = () => {
    if (!showPreview || !file || !thumbnailUrl) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">File Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-white/70 hover:text-white text-2xl leading-none"
            >
              ×
            </button>
          </div>
          
          {thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('blob:') ? (
            <img
              src={thumbnailUrl}
              alt="File preview"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          ) : thumbnailUrl.startsWith('text:') ? (
            <div className="bg-gray-900/50 p-4 rounded-lg max-h-96 overflow-auto">
              <pre className="text-green-300 text-sm whitespace-pre-wrap">
                {thumbnailUrl.substring(5)}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">{getFileIcon(file.name)}</div>
              <p className="text-white/70">Preview not available for this file type</p>
            </div>
          )}
        </div>
      </div>
    );
  };

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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              PDF Converter
            </span>
          </h2>
          <p className="text-white/70 text-sm">
            Convert your files to any format
          </p>
        </div>

        {/* Upload area */}
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-white/5 transition-all duration-300 relative overflow-hidden group">
          {file ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                {renderThumbnail()}
                <div className="text-left">
                  <span className="text-white font-medium block mb-2 truncate max-w-xs">
                    {file.name}
                  </span>
                  <span className="text-white/60 text-sm">
                    {formatBytes(originalSize)}
                  </span>
                  {thumbnailUrl && (thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('blob:') || thumbnailUrl.startsWith('text:')) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setShowPreview(true);
                      }}
                      className="block mt-2 text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Preview
                    </button>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
                  Click to change file
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <UploadCloud className="h-12 w-12 text-blue-400 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white font-medium block mb-2">
                Drop your file here
              </span>
              <span className="text-white/60 text-sm">or click to browse</span>
              <div className="mt-3 text-xs text-white/50">
                Supports: PDF, DOC, DOCX, TXT, JPG, PNG
              </div>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp,.tiff,.html,.odt,.rtf,.xlsx,.pptx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Output format selection */}
        <div className="mt-6">
          <label className="text-sm font-medium text-white/90 block mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Convert to Format
          </label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none appearance-none cursor-pointer"
          >
            {supportedFormats.map((format) => (
              <option key={format.value} value={format.value} className="bg-slate-800 text-white">
                {format.icon} {format.label}
              </option>
            ))}
          </select>
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
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Convert to:</span>
              <span className="text-purple-300 text-sm font-medium uppercase">
                {outputFormat}
              </span>
            </div>
            {convertedSize > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Converted size:</span>
                <span className="text-green-300 text-sm font-medium">
                  {formatBytes(convertedSize)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Convert button */}
        <button
          onClick={handleConvert}
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
              Converting...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Convert File
            </div>
          )}
        </button>

        {/* Download section */}
        {convertedFile && !loading && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-xl p-4 mb-4">
              <p className="text-green-300 font-semibold mb-2 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Conversion Complete!
              </p>
              <p className="text-white/80 text-sm">
                Your file has been converted to{" "}
                <span className="text-purple-300 font-medium uppercase">
                  {outputFormat}
                </span>
              </p>
            </div>
            <a
              href={URL.createObjectURL(convertedFile)}
              download={`converted.${outputFormat}`}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 font-medium"
            >
              <Download className="w-5 h-5" />
              Download Converted File
            </a>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
}
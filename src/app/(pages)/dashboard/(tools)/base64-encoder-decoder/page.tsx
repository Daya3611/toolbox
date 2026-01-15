"use client";
import React, { useState } from "react";
import { Copy, RefreshCw, AlertCircle, Check } from "lucide-react";

export default function Base64EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    setCopied(false);

    try {
      if (!input.trim()) {
        setOutput("");
        return;
      }

      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError("Invalid input for Base64 decoding");
      setOutput("");
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Base64 Encoder / Decoder</h1>
          <p className="mt-2 text-white/60 text-sm">
            Encode text to Base64 or decode Base64 back to readable text
          </p>
        </div>

        {/* Notice */}
        <div className="mb-6 rounded-xl border border-white/10 bg-black px-5 py-4">
          <p className="text-sm font-medium text-white/80">Under Development</p>
          <p className="mt-1 text-sm text-white/60">
            Some edge cases may not be handled yet. Improvements are in progress.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("encode")}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
              mode === "encode"
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-black hover:bg-white/5"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
              mode === "decode"
                ? "border-white/30 bg-white/10"
                : "border-white/10 bg-black hover:bg-white/5"
            }`}
          >
            Decode
          </button>
        </div>

        {/* Editor */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Input */}
          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <p className="mb-2 text-sm text-white/70">
              {mode === "encode" ? "Plain Text" : "Base64 Input"}
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-48 w-full resize-none rounded-lg border border-white/10 bg-black p-3 text-sm outline-none focus:border-white/30"
              placeholder={
                mode === "encode"
                  ? "Enter text to encode..."
                  : "Enter Base64 string..."
              }
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-white/10 bg-black p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-white/70">Result</p>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              value={output}
              readOnly
              className="h-48 w-full resize-none rounded-lg border border-white/10 bg-black p-3 text-sm text-white/80"
              placeholder="Output will appear here..."
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleConvert}
            className="flex-1 rounded-lg border border-white/20 bg-white/10 py-3 text-sm font-medium hover:bg-white/20"
          >
            {mode === "encode" ? "Encode to Base64" : "Decode Base64"}
          </button>
          <button
            onClick={resetAll}
            className="rounded-lg border border-white/10 px-4 py-3 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

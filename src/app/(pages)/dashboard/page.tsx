"use client";
import React from "react";
import {
  Image,
  Link as LinkIcon,
  QrCode,
  FileText,
  Code,
  Hash,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

const tools = [
  {
    name: "Image Compressor",
    description: "Reduce image size without losing quality",
    href: "/dashboard/image-compressor",
    icon: Image,
  },
  {
    name: "File Converter",
    description: "Convert files between multiple formats",
    href: "/dashboard/file-converter",
    icon: FileText,
  },
  {
    name: "URL Shortener",
    description: "Create short links and track usage",
    href: "/dashboard/url-shortener",
    icon: LinkIcon,
  },
  {
    name: "QR Code Generator",
    description: "Generate QR codes for text, links, and more",
    href: "/dashboard/qr-code-generator",
    icon: QrCode,
  },
  {
    name: "Base64 Encoder / Decoder",
    description: "Encode and decode Base64 strings",
    href: "/dashboard/base64-encoder-decoder",
    icon: Code,
  },
  {
    name: "Hash Generator",
    description: "Generate secure hashes from text",
    href: "/dashboard/hash-generator",
    icon: Hash,
  },
];

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* Greeting */}
        <div className="mb-6">
          <p className="text-white/60 text-sm">Hello</p>
          <h1 className="text-2xl font-semibold">
            {fullName || "Welcome"}
          </h1>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-medium">Dashboard</h2>
          </div>
          <p className="text-white/60 text-sm">
            Access all tools from one place
          </p>
        </div>

        {/* Development Notice */}
        <div className="mb-10 rounded-xl border border-white/10 bg-black px-5 py-4">
          <p className="text-sm font-medium text-white/80">
            Platform Status
          </p>
          <p className="mt-1 text-sm text-white/60">
            Some tools and conversion algorithms are still being improved.
            A few features may not work as expected.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group rounded-2xl border border-white/10 bg-black p-6 transition hover:border-white/30"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10">
                <tool.icon className="h-5 w-5 text-white/80" />
              </div>

              <h3 className="mb-1 text-lg font-medium">
                {tool.name}
              </h3>

              <p className="mb-4 text-sm text-white/60">
                {tool.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-white/70 group-hover:text-white">
                Open Tool
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            Toolbox © 2026 • Built for productivity • Develop by <Link href="https://dayanandgawade.in"  target="_blank" rel="developer" className="text-neutral-300 hover:text-white">Dayanand Gawade - Daya3611</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

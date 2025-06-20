"use client";
import React, { useState } from "react";

function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Tools", count: 24 },
    { id: "text", name: "Text & Writing", count: 8 },
    { id: "image", name: "Image & Design", count: 6 },
    { id: "converter", name: "Converters", count: 5 },
    { id: "generator", name: "Generators", count: 3 },
    { id: "utility", name: "Utilities", count: 2 },
  ];

  const tools = [
    {
      id: 1,
      name: "Text Summarizer",
      description:
        "Quickly summarize long articles and documents with AI-powered text analysis.",
      category: "text",
      icon: "📝",
      popular: true,
      color: "from-blue-500 to-cyan-500",
      url: "tools/text-summarizer",
    },
    {
      id: 2,
      name: "QR Code Generator",
      description:
        "Create custom QR codes for URLs, text, and contact information instantly.",
      category: "generator",
      icon: "🔲",
      popular: true,
      color: "from-purple-500 to-pink-500",
      url: "tools/qr-code-generator",
    },
    {
      id: 3,
      name: "Image Compressor",
      description:
        "Reduce image file sizes without losing quality. Supports JPEG, PNG, and WebP.",
      category: "image",
      icon: "🖼️",
      popular: false,
      color: "from-green-500 to-teal-500",
      url: "tools/image-compressor",
    },
    {
      id: 4,
      name: "PDF Converter",
      description:
        "Convert documents to PDF format or extract content from existing PDFs.",
      category: "converter",
      icon: "📄",
      popular: true,
      color: "from-orange-500 to-red-500",
      url: "tools/pdf-converter",
    },
    {
      id: 5,
      name: "Password Generator",
      description:
        "Generate secure, customizable passwords with various complexity options.",
      category: "generator",
      icon: "🔐",
      popular: false,
      color: "from-indigo-500 to-purple-500",
      url: "tools/password-generator",
    },
    {
      id: 6,
      name: "Color Palette Generator",
      description:
        "Create beautiful color palettes for your design projects and websites.",
      category: "image",
      icon: "🎨",
      popular: false,
      color: "from-pink-500 to-rose-500",
      url: "tools/color-palette-generator",
    },
    {
      id: 7,
      name: "JSON Formatter",
      description:
        "Format, validate, and beautify JSON data with syntax highlighting.",
      category: "utility",
      icon: "{ }",
      popular: false,
      color: "from-cyan-500 to-blue-500",
      url: "tools/json-formatter",
    },
    {
      id: 8,
      name: "Unit Converter",
      description:
        "Convert between different units of measurement including length, weight, and temperature.",
      category: "converter",
      icon: "⚖️",
      popular: false,
      color: "from-emerald-500 to-green-500",
      url: "tools/unit-converter",
    },
    {
      id: 9,
      name: "Markdown Editor",
      description:
        "Write and preview Markdown with live rendering and export options.",
      category: "text",
      icon: "✍️",
      popular: true,
      color: "from-violet-500 to-purple-500",
      url: "tools/markdown-editor",
    },
    {
      id: 10,
      name: "URL Shortener",
      description:
        "Create short, memorable URLs with click tracking and analytics.",
      category: "utility",
      icon: "🔗",
      popular: false,
      color: "from-amber-500 to-orange-500",
      url: "tools/url-shortener",
    },
    {
      id: 11,
      name: "Hash Generator",
      description:
        "Generate MD5, SHA-1, SHA-256, and other hash values for text and files.",
      category: "generator",
      icon: "🔒",
      popular: false,
      color: "from-slate-500 to-gray-500",
      url: "tools/hash-generator",
    },
    {
      id: 12,
      name: "Base64 Encoder/Decoder",
      description:
        "Encode and decode Base64 strings with support for files and text.",
      category: "converter",
      icon: "🔄",
      popular: false,
      color: "from-teal-500 to-cyan-500",
      url: "tools/base64-encoder-decoder",
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-6 text-white/90 text-sm font-medium">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              24 Tools Available - Note: All Tools in under Beta Version
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Power
              </span>
              <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Tools
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Discover our comprehensive collection of web tools designed to
              streamline your workflow and boost productivity.
            </p>

            {/* Search bar */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60">
                🔍
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-white/90 hover:bg-white/20"
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-75">
                  ({category.count})
                </span>
              </button>
            ))}
          </div>

          {/* Tools grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Popular badge */}
                {tool.popular && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {tool.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {tool.name}
                </h3>

                <p className="text-white/70 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                {/* Action buttons */}
                <div className="flex gap-3 text-center">
                  <a href={tool.url} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-3xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105">
                    <button className="">
                      Use Tool
                    </button>
                  </a>
                  {/* <button className="px-4 py-3 border border-white/30 text-white/90 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                    ℹ️
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          {/* No results message */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No tools found
              </h3>
              <p className="text-white/70">
                Try adjusting your search or category filter
              </p>
            </div>
          )}

          {/* Load more button */}
          {filteredTools.length > 0 && (
            <div className="text-center mt-12">
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all duration-300">
                Load More Tools
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ToolsPage;

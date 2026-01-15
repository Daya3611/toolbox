"use client";
import React, { useState, useEffect } from "react";
import {
  Link,
  Copy,
  BarChart3,
  ExternalLink,
  Scissors,
  Globe,
  Calendar,
  Eye,
  MousePointer,
  Check,
  AlertCircle,
  Trash2,
  Plus,
} from "lucide-react";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  title: string;
  createdAt: string;
  clicks: number;
  isActive: boolean;
}

export default function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("shortenedUrls");
    if (saved) setShortenedUrls(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shortenedUrls", JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  const extractTitle = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Untitled Link";
    }
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/shorturl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ long_url: originalUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to shorten URL");

      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl,
        shortUrl: data.shortUrl,
        shortCode: data.shortUrl.split("/").pop() || "",
        title: title || extractTitle(originalUrl),
        createdAt: new Date().toISOString(),
        clicks: 0,
        isActive: true,
      };

      setShortenedUrls((prev) => [newUrl, ...prev]);
      setOriginalUrl("");
      setTitle("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleUrlStatus = (id: string) => {
    setShortenedUrls((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  };

  const deleteUrl = (id: string) => {
    setShortenedUrls((prev) => prev.filter((u) => u.id !== id));
  };

  const totalClicks = shortenedUrls.reduce((s, u) => s + u.clicks, 0);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black">
            <Scissors className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-semibold">URL Shortener</h1>
          <p className="mt-2 text-white/60">
            Create short links and track basic performance
          </p>
        </div>

        {/* Under Development Notice */}
        <div className="mb-8 rounded-xl border border-white/10 bg-black px-5 py-4">
          <p className="text-sm text-white/80 font-medium">Under Development</p>
          <p className="mt-1 text-sm text-white/60">
            Some features and algorithms are still being improved.
            Certain actions may not work as expected.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard icon={<Link />} label="Total Links" value={shortenedUrls.length} />
          <StatCard icon={<MousePointer />} label="Total Clicks" value={totalClicks} />
          <StatCard
            icon={<Eye />}
            label="Active Links"
            value={shortenedUrls.filter((u) => u.isActive).length}
          />
        </div>

        {/* Main */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* Create */}
          <div className="rounded-2xl border border-white/10 bg-black p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
              <Plus className="h-4 w-4" />
              Shorten New URL
            </h2>

            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com"
              className="mb-4 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
            />

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Optional title"
              className="mb-4 w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm outline-none focus:border-white/30"
            />

            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <button
              onClick={shortenUrl}
              disabled={isLoading}
              className="w-full rounded-lg border border-white/20 bg-white/10 py-3 text-sm font-medium hover:bg-white/20 disabled:opacity-50"
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </div>

          {/* List */}
          <div className="rounded-2xl border border-white/10 bg-black p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
              <BarChart3 className="h-4 w-4" />
              Your Links
            </h2>

            <div className="space-y-4 max-h-[420px] overflow-y-auto">
              {shortenedUrls.length === 0 ? (
                <p className="text-sm text-white/50">No links created yet.</p>
              ) : (
                shortenedUrls.map((url) => (
                  <div
                    key={url.id}
                    className="rounded-xl border border-white/10 bg-black p-4"
                  >
                    <div className="mb-2 flex justify-between">
                      <div>
                        <p className="font-medium">{url.title}</p>
                        <p className="text-xs text-white/50 truncate">
                          {url.originalUrl}
                        </p>
                      </div>
                      <span className="text-xs text-white/50">
                        {url.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex-1 truncate rounded-md border border-white/10 bg-black px-3 py-2 text-xs font-mono">
                        {url.shortUrl}
                      </div>
                      <button
                        onClick={() => copyToClipboard(url.shortUrl, url.id)}
                        className="rounded-md border border-white/10 p-2 hover:bg-white/10"
                      >
                        {copiedId === url.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleUrlStatus(url.id)}
                        className="flex-1 rounded-md border border-white/10 px-3 py-2 text-xs hover:bg-white/10"
                      >
                        {url.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => deleteUrl(url.id)}
                        className="rounded-md border border-red-500/30 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black p-6 text-center">
      <div className="mx-auto mb-2 w-fit text-white/70">{icon}</div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}

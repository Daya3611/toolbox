"use client"
import React, { useState, useEffect } from 'react';
import { Link, Copy, BarChart3, ExternalLink, Scissors, Globe, QrCode, Calendar, Eye, MousePointer, Smartphone, Monitor, Check, AlertCircle, Trash2, Edit3, Plus } from 'lucide-react';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  customAlias?: string;
  title: string;
  createdAt: string;
  clicks: number;
  lastClicked?: string;
  isActive: boolean;
}

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [title, setTitle] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [error, setError] = useState('');

  // Load saved URLs from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('shortenedUrls');
    if (saved) {
      setShortenedUrls(JSON.parse(saved));
    }
  }, []);

  // Save URLs to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  // Generate a random short code
  const generateShortCode = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Validate URL format
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Extract title from URL (simplified)
  const extractTitle = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return 'Unknown Site';
    }
  };

  const shortenUrl = async () => {
  if (!originalUrl.trim()) {
    setError("Please enter a URL");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    const res = await fetch("/api/shorturl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        long_url: originalUrl,
        custom_alias: customAlias || undefined,
        title: title || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to shorten URL");
    }

    const newUrl: ShortenedUrl = {
      id: Date.now().toString(),
      originalUrl,
      shortUrl: data.shortUrl,
      shortCode: data.shortUrl.split("/").pop() || "",
      customAlias: customAlias || undefined,
      title: title || extractTitle(originalUrl),
      createdAt: new Date().toISOString(),
      clicks: 0,
      isActive: true,
    };

    setShortenedUrls((prev) => [newUrl, ...prev]);
    setOriginalUrl("");
    setCustomAlias("");
    setTitle("");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};


  // Copy to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Simulate click tracking
  const trackClick = (id: string) => {
    setShortenedUrls(prev => 
      prev.map(url => 
        url.id === id 
          ? { ...url, clicks: url.clicks + 1, lastClicked: new Date().toISOString() }
          : url
      )
    );
  };

  // Delete URL
  const deleteUrl = (id: string) => {
    setShortenedUrls(prev => prev.filter(url => url.id !== id));
  };

  // Toggle URL active status
  const toggleUrlStatus = (id: string) => {
    setShortenedUrls(prev => 
      prev.map(url => 
        url.id === id ? { ...url, isActive: !url.isActive } : url
      )
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  // Calculate total clicks
  const totalClicks = shortenedUrls.reduce((sum, url) => sum + url.clicks, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              URL Shortener
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Create short, memorable links with detailed analytics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Link className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{shortenedUrls.length}</p>
            <p className="text-white/70 text-sm">Total Links</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <MousePointer className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{totalClicks}</p>
            <p className="text-white/70 text-sm">Total Clicks</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{shortenedUrls.filter(url => url.isActive).length}</p>
            <p className="text-white/70 text-sm">Active Links</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - URL Shortener */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Plus className="w-6 h-6" />
              Shorten New URL
            </h2>

            {/* URL Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Original URL *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url"
                    className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:border-indigo-400 focus:bg-white/15 transition-all duration-300 outline-none"
                  />
                </div>
              </div>

                <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Custom Alias (Optional)
                </label>
                <div className="relative">
                  <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    placeholder="Custom Alias not Work Now"
                    className="disabled w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:border-indigo-400 focus:bg-white/15 transition-all duration-300 outline-none"
                    disabled
                  />
                </div>
                <p className="text-white/50 text-xs mt-1">
                  cleanuri.com/{customAlias || 'aBc123'}
                </p>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Awesome Link"
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:border-indigo-400 focus:bg-white/15 transition-all duration-300 outline-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={shortenUrl}
                disabled={isLoading || !originalUrl.trim()}
                className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLoading || !originalUrl.trim()
                    ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/25'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Recent Links */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              Your Links
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {shortenedUrls.length === 0 ? (
                <div className="text-center py-12">
                  <Link className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">No links yet</p>
                  <p className="text-white/40 text-sm">Create your first shortened URL to get started</p>
                </div>
              ) : (
                shortenedUrls.map((url) => (
                  <div
                    key={url.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      url.isActive
                        ? 'bg-white/10 border-white/20 hover:bg-white/15'
                        : 'bg-white/5 border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{url.title}</h3>
                        <p className="text-white/50 text-sm truncate">{url.originalUrl}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        url.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {url.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 font-mono text-sm text-white truncate">
                        {url.shortUrl}
                      </div>
                      <button
                        onClick={() => copyToClipboard(url.shortUrl, url.id)}
                        className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
                      >
                        {copiedId === url.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-white/70" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(url.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MousePointer className="w-3 h-3" />
                          {url.clicks} clicks
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => trackClick(url.id)}
                        className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit
                      </button>
                      <button
                        onClick={() => toggleUrlStatus(url.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          url.isActive
                            ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300'
                            : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'
                        }`}
                      >
                        {url.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => deleteUrl(url.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Create short links with custom aliases and track their performance
          </p>
        </div>
      </div>
    </div>
  );
}

export default UrlShortener;
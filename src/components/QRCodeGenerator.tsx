"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, QrCode, Smartphone, Globe, Mail, Phone, Wifi, MessageSquare, User, MapPin, Calendar, CreditCard, RefreshCw, Palette, Settings } from 'lucide-react';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrType, setQrType] = useState('text');
  const [qrSize, setQrSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fgColor, setFgColor] = useState('#000000');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // QR Code types with their respective input fields
  const qrTypes = {
    text: { label: 'Text', icon: MessageSquare, placeholder: 'Enter your text here...' },
    url: { label: 'Website URL', icon: Globe, placeholder: 'https://example.com' },
    email: { label: 'Email', icon: Mail, placeholder: 'user@example.com' },
    phone: { label: 'Phone', icon: Phone, placeholder: '+1234567890' },
    sms: { label: 'SMS', icon: Smartphone, placeholder: 'Phone number' },
    wifi: { label: 'WiFi', icon: Wifi, placeholder: 'Network name' },
    vcard: { label: 'Contact', icon: User, placeholder: 'Contact information' },
    location: { label: 'Location', icon: MapPin, placeholder: 'Latitude,Longitude' },
    event: { label: 'Event', icon: Calendar, placeholder: 'Event details' }
  };

  // Generate QR code using a simple canvas-based approach
  const generateQRCode = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Format text based on QR type
      let formattedText = text;
      switch (qrType) {
        case 'email':
          formattedText = `mailto:${text}`;
          break;
        case 'phone':
          formattedText = `tel:${text}`;
          break;
        case 'sms':
          formattedText = `sms:${text}`;
          break;
        case 'wifi':
          // Simplified WiFi format
          formattedText = `WIFI:T:WPA;S:${text};P:password;;`;
          break;
        case 'location':
          const [lat, lng] = text.split(',');
          formattedText = `geo:${lat},${lng}`;
          break;
        case 'vcard':
          formattedText = `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nEND:VCARD`;
          break;
        case 'event':
          formattedText = `BEGIN:VEVENT\nSUMMARY:${text}\nEND:VEVENT`;
          break;
      }

      // Use QR Server API for generating QR codes
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(formattedText)}&ecc=${errorLevel}&bgcolor=${bgColor.slice(1)}&color=${fgColor.slice(1)}`;
      
      setQrCodeUrl(apiUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      const debounceTimer = setTimeout(() => {
        generateQRCode();
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setQrCodeUrl('');
    }
  }, [text, qrType, qrSize, errorLevel, bgColor, fgColor]);

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${qrType}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const clearAll = () => {
    setText('');
    setQrCodeUrl('');
    setQrType('text');
  };

  const TypeIcon = qrTypes[qrType as keyof typeof qrTypes]?.icon || MessageSquare;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-[100px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              QR Code Generator
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Create custom QR codes for any purpose
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6" />
              Configuration
            </h2>

            {/* QR Type Selection */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-3">QR Code Type</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(qrTypes).map(([key, type]) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setQrType(key)}
                      className={`p-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                        qrType === key
                          ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                          : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-3 flex items-center gap-2">
                <TypeIcon className="w-4 h-4" />
                {qrTypes[qrType as keyof typeof qrTypes]?.label} Content
              </label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={qrTypes[qrType as keyof typeof qrTypes]?.placeholder}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none resize-none min-h-[100px]"
                  rows={4}
                />
                {text && (
                  <button
                    onClick={clearAll}
                    className="absolute top-3 right-3 text-white/50 hover:text-white/80 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full mb-4 p-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:bg-white/10 transition-all duration-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Advanced Settings
              </span>
              <div className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                {/* Size */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Size: {qrSize}x{qrSize}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="32"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                {/* Error Correction */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Error Correction</label>
                  <select
                    value={errorLevel}
                    onChange={(e) => setErrorLevel(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Foreground</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - QR Code Display */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <QrCode className="w-6 h-6" />
              Generated QR Code
            </h2>

            <div className="flex flex-col items-center">
              {/* QR Code Display */}
              <div className="mb-6 p-6 bg-white rounded-2xl shadow-lg">
                {qrCodeUrl ? (
                  <div className="relative">
                    <img
                      src={qrCodeUrl}
                      alt="Generated QR Code"
                      className="max-w-full h-auto rounded-lg"
                      style={{ 
                        width: `${Math.min(qrSize, 300)}px`, 
                        height: `${Math.min(qrSize, 300)}px` 
                      }}
                    />
                    {isGenerating && (
                      <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <QrCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Enter content to generate QR code</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {qrCodeUrl && (
                <div className="flex gap-3 w-full max-w-xs">
                  <button
                    onClick={downloadQRCode}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
              )}

              {/* Info */}
              {text && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl w-full">
                  <h3 className="text-blue-300 font-medium mb-2">QR Code Info</h3>
                  <div className="text-white/70 text-sm space-y-1">
                    <p>Type: {qrTypes[qrType as keyof typeof qrTypes]?.label}</p>
                    <p>Size: {qrSize}×{qrSize}px</p>
                    <p>Error Correction: {errorLevel}</p>
                    <p>Characters: {text.length}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Generate QR codes for websites, contact info, WiFi, and more
          </p>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default QRCodeGenerator;
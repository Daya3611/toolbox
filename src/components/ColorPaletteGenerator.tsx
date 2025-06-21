"use client"
import React, { useState, useEffect } from 'react';
import { Shuffle, Copy, Download, Lock, Unlock, Palette, RefreshCw, Zap } from 'lucide-react';

function ColorPaletteGenerator() {
  const [colors, setColors] = useState<string[]>([]);
  const [lockedColors, setLockedColors] = useState<boolean[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [paletteMode, setPaletteMode] = useState('random');

  // Generate random hex color
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  };

  // Generate complementary colors
  const generateComplementaryPalette = (baseColor: string) => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const palette = [baseColor];
    
    // Complementary
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    palette.push(`#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`);
    
    // Triadic
    const h = rgbToHsl(r, g, b)[0];
    palette.push(hslToHex((h + 120) % 360, 70, 50));
    palette.push(hslToHex((h + 240) % 360, 70, 50));
    
    // Monochromatic variations
    palette.push(hslToHex(h, 70, 30));
    
    return palette;
  };

  // Generate analogous colors
  const generateAnalogousPalette = (baseColor: string) => {
    const hex = baseColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const [h, s, l] = rgbToHsl(r, g, b);
    
    return [
      hslToHex((h - 30 + 360) % 360, s, l),
      hslToHex((h - 15 + 360) % 360, s, l),
      baseColor,
      hslToHex((h + 15) % 360, s, l),
      hslToHex((h + 30) % 360, s, l)
    ];
  };

  // Helper functions for color conversion
  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h * 12) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Generate palette based on mode
  const generatePalette = () => {
    let newColors = [...colors];
    
    for (let i = 0; i < 5; i++) {
      if (!lockedColors[i]) {
        if (paletteMode === 'random') {
          newColors[i] = generateRandomColor();
        } else if (paletteMode === 'complementary') {
          const baseColor = colors.find((_, index) => lockedColors[index]) || generateRandomColor();
          const palette = generateComplementaryPalette(baseColor);
          newColors = palette;
          break;
        } else if (paletteMode === 'analogous') {
          const baseColor = colors.find((_, index) => lockedColors[index]) || generateRandomColor();
          const palette = generateAnalogousPalette(baseColor);
          newColors = palette;
          break;
        }
      }
    }
    
    setColors(newColors);
  };

  // Initialize palette
  useEffect(() => {
    const initialColors = Array(5).fill('').map(() => generateRandomColor());
    setColors(initialColors);
    setLockedColors(Array(5).fill(false));
  }, []);

  // Toggle lock on color
  const toggleLock = (index: number) => {
    const newLocked = [...lockedColors];
    newLocked[index] = !newLocked[index];
    setLockedColors(newLocked);
  };

  // Copy color to clipboard
  const copyColor = async (color: string, index: number | React.SetStateAction<null>) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  // Get text color based on background
  const getTextColor = (bgColor) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // Export palette
  const exportPalette = () => {
    const paletteData = {
      colors: colors,
      timestamp: new Date().toISOString(),
      mode: paletteMode
    };
    const dataStr = JSON.stringify(paletteData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'color-palette.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500 "></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] pt-[150px]"></div>

      <div className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-4xl w-full hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 mx-4 ">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Color Palette Generator
            </span>
          </h2>
          <p className="text-white/70 text-sm">
            Create beautiful color combinations with precision
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-white/90 block mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Color Harmony Mode
          </label>
          <select 
            value={paletteMode} 
            onChange={(e) => setPaletteMode(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none"
          >
            <option value="random">Random Colors</option>
            <option value="complementary">Complementary Harmony</option>
            <option value="analogous">Analogous Harmony</option>
          </select>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {colors.map((color, index) => (
            <div key={index} className="group relative">
              <div 
                className="h-32 rounded-2xl border-2 border-white/20 shadow-xl transition-all duration-300 transform group-hover:scale-105 cursor-pointer relative overflow-hidden hover:border-blue-400"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color, index)}
              >
                {/* Lock button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200"
                >
                  {lockedColors[index] ? (
                    <Lock size={16} style={{ color: getTextColor(color) }} />
                  ) : (
                    <Unlock size={16} style={{ color: getTextColor(color) }} />
                  )}
                </button>

                {/* Copy indicator */}
                {copiedIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="text-white font-bold text-sm">Copied!</div>
                  </div>
                )}

                {/* Color info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="text-center">
                    <div 
                      className="font-mono text-sm font-bold"
                      style={{ color: getTextColor(color) }}
                    >
                      {color.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={generatePalette}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Generate New Palette
          </button>
          
          <button
            onClick={exportPalette}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-500 hover:to-blue-500 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export Palette
          </button>
        </div>

        {/* Palette Information */}
        {colors.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-white/90 font-medium">Current Palette</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg border border-white/30 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  ></div>
                  <code className="text-white/80 font-mono text-sm bg-black/30 px-2 py-1 rounded flex-1 text-center">
                    {color.toUpperCase()}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <Lock className="w-5 h-5 text-blue-300 mx-auto mb-2" />
              <span className="text-white/90 font-medium block">Lock Colors</span>
              <span className="text-white/60">Prevent changes during generation</span>
            </div>
            <div className="text-center">
              <Copy className="w-5 h-5 text-green-300 mx-auto mb-2" />
              <span className="text-white/90 font-medium block">Copy Hex</span>
              <span className="text-white/60">Click any color to copy code</span>
            </div>
            <div className="text-center">
              <Palette className="w-5 h-5 text-purple-300 mx-auto mb-2" />
              <span className="text-white/90 font-medium block">Color Modes</span>
              <span className="text-white/60">Try different harmony types</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPaletteGenerator;
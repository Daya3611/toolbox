"use client"
import React, { useState, useEffect } from 'react';
import { Shield, Copy, RefreshCw, Check, Eye, EyeOff, Lock, Key, Zap, AlertTriangle, CheckCircle, Settings, History, Trash2, Star } from 'lucide-react';

interface GeneratedPassword {
  id: string;
  password: string;
  length: number;
  strength: 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  createdAt: string;
  isFavorite: boolean;
  settings: {
    includeUppercase: boolean;
    includeLowercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
    excludeSimilar: boolean;
  };
}

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [passwordHistory, setPasswordHistory] = useState<GeneratedPassword[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Character sets
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const similarChars = 'il1Lo0O';

  // Load password history from memory on component mount
  useEffect(() => {
    generatePassword();
  }, []);

  // Calculate password strength
  const calculateStrength = (pwd: string, settings: any): 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong' => {
    let score = 0;
    
    // Length scoring
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    
    // Character variety scoring
    if (settings.includeUppercase && /[A-Z]/.test(pwd)) score += 1;
    if (settings.includeLowercase && /[a-z]/.test(pwd)) score += 1;
    if (settings.includeNumbers && /[0-9]/.test(pwd)) score += 1;
    if (settings.includeSymbols && /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(pwd)) score += 1;
    
    // Complexity bonus
    if (pwd.length >= 20) score += 1;
    
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 5) return 'Good';
    if (score <= 6) return 'Strong';
    return 'Very Strong';
  };

  // Generate password
  const generatePassword = () => {
    let charset = '';
    
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;
    
    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    if (charset === '') {
      setPassword('Please select at least one character type');
      return;
    }
    
    let result = '';
    
    // Ensure at least one character from each selected type
    if (includeUppercase) result += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (includeLowercase) result += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (includeNumbers) result += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSymbols) result += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = result.length; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the result
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(result);
    
    // Add to history
    const newPassword: GeneratedPassword = {
      id: Date.now().toString(),
      password: result,
      length,
      strength: calculateStrength(result, {
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar
      }),
      createdAt: new Date().toISOString(),
      isFavorite: false,
      settings: {
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        excludeSimilar
      }
    };
    
    setPasswordHistory(prev => [newPassword, ...prev.slice(0, 19)]); // Keep last 20
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id || 'current');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setPasswordHistory(prev =>
      prev.map(pwd =>
        pwd.id === id ? { ...pwd, isFavorite: !pwd.isFavorite } : pwd
      )
    );
  };

  // Delete from history
  const deleteFromHistory = (id: string) => {
    setPasswordHistory(prev => prev.filter(pwd => pwd.id !== id));
  };

  // Clear all history
  const clearHistory = () => {
    setPasswordHistory([]);
  };

  // Get strength color
  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Weak': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Fair': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Good': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Strong': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'Very Strong': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const currentStrength = password && password !== 'Please select at least one character type' 
    ? calculateStrength(password, { includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar })
    : 'Weak';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-[100px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
              Password Generator
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Generate secure passwords with advanced customization
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Key className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{passwordHistory.length}</p>
            <p className="text-white/70 text-sm">Generated</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{passwordHistory.filter(p => p.isFavorite).length}</p>
            <p className="text-white/70 text-sm">Favorites</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-2xl font-bold text-white">{length}</p>
            <p className="text-white/70 text-sm">Length</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
            <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <p className={`text-2xl font-bold ${getStrengthColor(currentStrength).split(' ')[0]}`}>
              {currentStrength}
            </p>
            <p className="text-white/70 text-sm">Strength</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Password Generator */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Lock className="w-6 h-6" />
              Generate Password
            </h2>

            {/* Generated Password Display */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Generated Password
              </label>
              <div className="relative">
                <div className={`w-full bg-white/10 border-2 rounded-2xl px-4 py-4 font-mono text-lg break-all ${getStrengthColor(currentStrength).split(' ').slice(1).join(' ')}`}>
                  {isVisible ? password : '•'.repeat(password.length)}
                </div>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isVisible ? <EyeOff className="w-4 h-4 text-white/70" /> : <Eye className="w-4 h-4 text-white/70" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(password)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {copiedId === 'current' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStrengthColor(currentStrength)}`}>
                  {currentStrength}
                </div>
                <p className="text-white/50 text-sm">{password.length} characters</p>
              </div>
            </div>

            {/* Length Slider */}
            <div className="mb-6">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password Length: {length}
              </label>
              <input
                type="range"
                min="4"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((length - 4) / (128 - 4)) * 100}%, rgba(255,255,255,0.2) ${((length - 4) / (128 - 4)) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>4</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-white/80 font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Character Options
              </h3>
              
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                  <span className="text-white">Uppercase Letters (A-Z)</span>
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-transparent border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                  <span className="text-white">Lowercase Letters (a-z)</span>
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-transparent border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                  <span className="text-white">Numbers (0-9)</span>
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-transparent border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                  <span className="text-white">Symbols (!@#$%^&*)</span>
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-transparent border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </label>
                
                <label className="flex items-center justify-between p-3 bg-white/10 rounded-xl cursor-pointer hover:bg-white/15 transition-colors">
                  <span className="text-white">Exclude Similar Characters</span>
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-transparent border-2 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                  />
                </label>
              </div>
              <p className="text-white/50 text-xs">
                Excludes: i, l, 1, L, o, 0, O when enabled
              </p>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePassword}
              className="w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
            >
              <RefreshCw className="w-5 h-5" />
              Generate New Password
            </button>
          </div>

          {/* Right Panel - Password History */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <History className="w-6 h-6" />
                Password History
              </h2>
              {passwordHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {passwordHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60 text-lg mb-2">No passwords generated yet</p>
                  <p className="text-white/40 text-sm">Generate your first password to see it here</p>
                </div>
              ) : (
                passwordHistory.map((pwd) => (
                  <div
                    key={pwd.id}
                    className="p-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-white bg-white/10 rounded-lg px-3 py-2 break-all">
                          {pwd.password.length > 30 ? `${pwd.password.substring(0, 30)}...` : pwd.password}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFavorite(pwd.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          pwd.isFavorite 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-white/10 hover:bg-white/20 text-white/50'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${pwd.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/50 mb-3">
                      <div className="flex items-center gap-3">
                        <span>Length: {pwd.length}</span>
                        <span>{formatDate(pwd.createdAt)}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-lg border text-xs font-medium ${getStrengthColor(pwd.strength)}`}>
                        {pwd.strength}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(pwd.password, pwd.id)}
                        className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedId === pwd.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteFromHistory(pwd.id)}
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
            Generate secure passwords with customizable options and track your password history
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

export default PasswordGenerator;
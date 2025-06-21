"use client"
import React from 'react';
import { Github, Twitter, Mail, Heart, ArrowUp, Globe, Shield, Zap } from 'lucide-react';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-cyan-500/8 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900 to-transparent"></div>
      
      {/* Main footer content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-8">
        {/* Main footer sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-3xl font-black mb-4">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Tool
                </span>
                <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Box
                </span>
              </h3>
              <p className="text-white/70 leading-relaxed max-w-sm">
                Your all-in-one collection of powerful web tools. Simplify your workflow, boost productivity, and get things done faster.
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white/80 text-sm">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-white/80 text-sm">Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-white/80 text-sm">Web Based</span>
              </div>
            </div>
          </div>
          
          {/* Tools section */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Popular Tools
            </h4>
            <ul className="space-y-3">
              {[
                'Color Palette Generator',
                'Image Compressor',
                'Text Formatter',
                'URL Shortener',
                'Password Generator',
                'QR Code Generator'
              ].map((tool, index) => (
                <li key={index}>
                  <a href="#" className="text-white/60 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                    {tool}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company section */}
          <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Company
            </h4>
            <ul className="space-y-3">
              {[
                'About Us',
                'Privacy Policy',
                'Terms of Service',
                'Contact',
                'Blog',
                'Help Center'
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-white/60 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Newsletter section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-12 hover:bg-white/10 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Stay Updated
              </h4>
              <p className="text-white/60 text-sm">Get notified about new tools and features</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/15 transition-all duration-300 outline-none text-sm"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <div className="flex items-center gap-6">
            <p className="text-white/50 text-sm">
              © {currentYear} ToolBox. Made with{' '}
              <Heart className="w-4 h-4 text-red-400 inline mx-1" />
              By <a href="https://dayanandgawade.in">
                <span className='text-bold hover:text-blue-300'>Daya3611</span>
              </a>
            </p>
          </div>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-110"
            >
              <Github className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-110"
            >
              <Twitter className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-110"
            >
              <Mail className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
            </a>
            
            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-110 ml-2"
            >
              <ArrowUp className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
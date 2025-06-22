"use client"
import React, { useState } from 'react'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
         
          <div className="flex items-center space-x-2">
            <div className="relative">
              <a href="/">
                <div className="text-3xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Tool
                </span>
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Box
                </span>
              </div>
              </a>
              <div className="absolute -top-1 -right-12">
                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full animate-pulse">
                  Beta
                </span>
              </div>
            </div>
          </div>

          {/* Desktop  */}
          {/* <div className="hidden md:flex items-center space-x-8">
            <a href="/tools" className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-2 rounded-lg">
              Tools
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-2 rounded-lg">
              Features
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-2 rounded-lg">
              Pricing
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-2 rounded-lg">
              About
            </a>
          </div> */}

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <button className="text-white/90 hover:text-white transition-colors duration-200 font-medium px-4 py-2 hover:bg-white/10 rounded-lg">
              Sign In
            </button> */}
            <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25" onClick={() => window.location.href="/tools"}>
              <span className="relative z-10">Explore Tools</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
            </button>
          </div>

          {/* Mobile  */}
          {/* <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white/90 hover:text-white transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div> */}
        </div>

        {/* Mobile  */}
        {/* <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="pt-4 pb-2 space-y-2">
            <a href="/tools" className="block text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-3 rounded-lg">
              Tools
            </a>
            <a href="#" className="block text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-3 rounded-lg">
              Features
            </a>
            <a href="#" className="block text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-3 rounded-lg">
              Pricing
            </a>
            <a href="#" className="block text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-3 rounded-lg">
              About
            </a>
            <div className="pt-4 border-t border-white/20 space-y-2">
              <button className="block w-full text-left text-white/90 hover:text-white transition-colors duration-200 font-medium hover:bg-white/10 px-4 py-3 rounded-lg">
                Sign In
              </button>
              <button className="block w-full text-left bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-3 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300">
                Get Started
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </nav>
  )
}

export default Navbar
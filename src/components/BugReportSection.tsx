"use client"
import React, { useState } from 'react'

function BugReportSection() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    category: 'bug',
    userEmail: '',
    browserInfo: '',
    steps: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  type FormErrors = {
    title?: string
    description?: string
    userEmail?: string
    [key: string]: string | undefined
  }
  const [errors, setErrors] = useState<FormErrors>({})

  
  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN 
  const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID    

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (formData.userEmail && !/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getBrowserInfo = () => {
    return `${navigator.userAgent}\nScreen: ${screen.width}x${screen.height}\nTimezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
  }

  const formatMessage = () => {
    const timestamp = new Date().toLocaleString()
    const browserInfo = getBrowserInfo()
    
    return `🐛 NEW BUG REPORT 🐛

📋 Title: ${formData.title}

📝 Description:
${formData.description}

🔥 Severity: ${formData.severity.toUpperCase()}
📂 Category: ${formData.category}

${formData.steps ? `🔄 Steps to Reproduce:
${formData.steps}

` : ''}📧 User Email: ${formData.userEmail || 'Not provided'}

🌐 Browser Info:
${formData.browserInfo || browserInfo}

⏰ Reported: ${timestamp}

---
Sent from ToolBox Bug Reporter`
  }

  const sendToTelegram = async (message: string) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram')
    }

    return response.json()
  }

  const handleInitialSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('')
    setShowConfirmation(false)

    try {
      const message = formatMessage()
      await sendToTelegram(message)
      
      setSubmitStatus('success')
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        category: 'bug',
        userEmail: '',
        browserInfo: '',
        steps: ''
      })
    } catch (error) {
      console.error('Error sending bug report:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelSubmit = () => {
    setShowConfirmation(false)
  }

  const handleClear = () => {
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      category: 'bug',
      userEmail: '',
      browserInfo: '',
      steps: ''
    })
    setErrors({})
    setSubmitStatus('')
  }

  const fillBrowserInfo = () => {
    setFormData(prev => ({
      ...prev,
      browserInfo: getBrowserInfo()
    }))
  }

  // Confirmation Modal Component
  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 border border-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Confirm Bug Report</h2>
          <p className="text-white/70">Please review your bug report before sending</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              Title
            </h3>
            <p className="text-white/80">{formData.title}</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              Description
            </h3>
            <p className="text-white/80 whitespace-pre-wrap">{formData.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Severity
              </h3>
              <p className="text-white/80 capitalize">{formData.severity}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                Category
              </h3>
              <p className="text-white/80 capitalize">{formData.category}</p>
            </div>
          </div>

          {formData.steps && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Steps to Reproduce
              </h3>
              <p className="text-white/80 whitespace-pre-wrap">{formData.steps}</p>
            </div>
          )}

          {formData.userEmail && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Email
              </h3>
              <p className="text-white/80">{formData.userEmail}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleConfirmedSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-xl hover:from-red-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? '📤 Sending...' : '✅ Send Report'}
          </button>
          
          <button
            onClick={handleCancelSubmit}
            className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
          >
            ✏️ Edit Report
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-[100px]">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div> */}
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Confirmation Modal */}
      {showConfirmation && <ConfirmationModal />}
      
      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent drop-shadow-2xl">
              Bug
            </span>
            <span className="bg-gradient-to-r from-orange-300 via-red-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
              Report
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
            Found an issue? Help us improve by reporting bugs and errors. 
            <span className="text-orange-300 font-medium"> Your feedback matters!</span>
          </p>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-center">
            ✅ Bug report sent successfully! Thank you for helping us improve.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
            ❌ Failed to send bug report. Please check your connection and try again.
          </div>
        )}

        {/* Bug Report Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                Bug Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Brief description of the issue..."
                className={`w-full bg-white/10 border ${errors.title ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent`}
              />
              {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title}</p>}
            </div>

            {/* Severity */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                Severity
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
              >
                <option value="low" className="bg-slate-800">Low - Minor issue</option>
                <option value="medium" className="bg-slate-800">Medium - Affects functionality</option>
                <option value="high" className="bg-slate-800">High - Major problem</option>
                <option value="critical" className="bg-slate-800">Critical - App breaking</option>
              </select>
            </div>

            {/* Category */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent"
              >
                <option value="bug" className="bg-slate-800">🐛 Bug</option>
                <option value="ui" className="bg-slate-800">🎨 UI/UX Issue</option>
                <option value="performance" className="bg-slate-800">⚡ Performance</option>
                <option value="feature" className="bg-slate-800">💡 Feature Request</option>
                <option value="other" className="bg-slate-800">🔧 Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              Detailed Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the issue in detail. What happened? What did you expect to happen?"
              rows={5}
              className={`w-full bg-white/10 border ${errors.description ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none`}
            />
            {errors.description && <p className="text-red-400 text-sm mt-2">{errors.description}</p>}
          </div>

          {/* Steps to Reproduce */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <label className="block text-white font-semibold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              Steps to Reproduce (Optional)
            </label>
            <textarea
              name="steps"
              value={formData.steps}
              onChange={handleInputChange}
              placeholder="1. Go to... 2. Click on... 3. See error..."
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Email */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                Your Email (Optional)
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={`w-full bg-white/10 border ${errors.userEmail ? 'border-red-500' : 'border-white/20'} rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent`}
              />
              {errors.userEmail && <p className="text-red-400 text-sm mt-2">{errors.userEmail}</p>}
            </div>

            {/* Browser Info */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                Browser Info
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="browserInfo"
                  value={formData.browserInfo}
                  onChange={handleInputChange}
                  placeholder="Auto-detect or enter manually..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                  disabled
                  
                  required
                />
                <button
                  type="button"
                  onClick={fillBrowserInfo}
                  className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors duration-200"
                >
                  Auto
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              type="button"
              onClick={handleInitialSubmit}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-2xl hover:from-red-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
            >
              <span className="relative z-10">
                📨 Send Bug Report
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              🗑️ Clear Form
            </button>
          </div>
        </div>

        {/* Setup Instructions */}
        {/* <div className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            Setup Instructions
          </h3>
          <div className="text-white/70 text-sm space-y-2">
            <p>To enable Telegram notifications, you need to:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Create a Telegram bot via @BotFather</li>
              <li>Get your bot token and chat ID</li>
              <li>Replace TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the code</li>
              <li>Deploy with your actual credentials</li>
            </ol>
            <p className="text-orange-300 mt-3">⚠️ Currently using placeholder values - reports won't be sent until configured.</p>
          </div>
        </div> */}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Fast Response</h3>
            <p className="text-white/70 text-sm">Critical bugs are prioritized and fixed quickly</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Real-time Alerts</h3>
            <p className="text-white/70 text-sm">Instant notifications via Telegram</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Quality Focus</h3>
            <p className="text-white/70 text-sm">Every report helps improve the experience</p>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  )
}

export default BugReportSection
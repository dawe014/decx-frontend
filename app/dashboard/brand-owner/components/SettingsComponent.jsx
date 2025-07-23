'use client'
import { useState } from 'react'
import { FiUser, FiLock, FiBell, FiMail, FiGlobe, FiShield } from 'react-icons/fi'

export default function SettingsComponent() {
  const [formData, setFormData] = useState({
    name: 'Brand Owner',
    email: 'owner@brand.com',
    company: 'My Awesome Brand',
    website: 'https://mybrand.com',
    notifications: true,
    newsletter: false,
    twoFactor: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-8">
      {/* Profile Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiUser className="mr-2" /> Profile Settings
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiBell className="mr-2" /> Notification Settings
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Email Notifications</h3>
              <p className="text-sm text-slate-400">Receive email notifications for new applications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Newsletter</h3>
              <p className="text-sm text-slate-400">Receive marketing emails and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="pt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
              Save Notification Settings
            </button>
          </div>
        </form>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiShield className="mr-2" /> Security Settings
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-400">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="twoFactor"
                checked={formData.twoFactor}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Change Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white mb-3"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
            />
          </div>
          
          <div className="pt-4">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors">
              Update Security Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
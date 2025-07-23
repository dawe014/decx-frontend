'use client'
import { useState } from 'react'
import { FiShield, FiLock, FiGlobe, FiMail, FiAlertTriangle, FiSave, FiUsers } from 'react-icons/fi'

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    emailVerification: true,
    contentModeration: 'auto',
    apiRateLimit: 100,
    analyticsEnabled: true,
    defaultUserRole: 'influencer',
    dataRetentionDays: 90
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Settings saved:', settings)
      setIsSaving(false)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* System Status Card */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiShield className="mr-2 text-indigo-400" />
          System Status
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400">
              <FiLock size={18} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-400">Maintenance Mode</h3>
              <div className="mt-1 flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">
                    {settings.maintenanceMode ? 'Enabled' : 'Disabled'}
                  </span>
                </label>
              </div>
              {settings.maintenanceMode && (
                <p className="mt-1 text-xs text-yellow-400 flex items-center">
                  <FiAlertTriangle className="mr-1" />
                  System is in maintenance mode
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400">
              <FiUsers size={18} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-400">User Registration</h3>
              <div className="mt-1 flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="registrationOpen"
                    checked={settings.registrationOpen}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">
                    {settings.registrationOpen ? 'Open' : 'Closed'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400">
              <FiMail size={18} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-slate-400">Email Verification</h3>
              <div className="mt-1 flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailVerification"
                    checked={settings.emailVerification}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">
                    {settings.emailVerification ? 'Required' : 'Optional'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Moderation Settings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Content Moderation</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Moderation Level</label>
            <select
              name="contentModeration"
              value={settings.contentModeration}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-700 text-white"
            >
              <option value="none">No moderation</option>
              <option value="auto">Automatic filtering</option>
              <option value="manual">Manual review required</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Default User Role</label>
            <select
              name="defaultUserRole"
              value={settings.defaultUserRole}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-700 text-white"
            >
              <option value="influencer">Influencer</option>
              <option value="brand">Brand</option>
              <option value="agency">Agency</option>
              <option value="user">Basic User</option>
            </select>
          </div>
        </div>
      </div>

      {/* API & Data Settings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">API & Data Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">API Rate Limit (req/min)</label>
            <input
              type="number"
              name="apiRateLimit"
              value={settings.apiRateLimit}
              onChange={handleChange}
              min="1"
              max="1000"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Data Retention (days)</label>
            <input
              type="number"
              name="dataRetentionDays"
              value={settings.dataRetentionDays}
              onChange={handleChange}
              min="1"
              max="365"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-700 text-white"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="analyticsEnabled"
              checked={settings.analyticsEnabled}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-slate-300">Enable Analytics Tracking</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : (
            <>
              <FiSave className="mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default SystemSettings
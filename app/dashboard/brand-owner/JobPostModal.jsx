'use client'
import { FiX, FiDollarSign, FiGlobe, FiTag, FiMapPin, FiClock, FiCheck } from 'react-icons/fi'

export default function JobPostModal({ onClose }) {
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    niche: '',
    language: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    duration: '',
    platforms: '',
    engagementReq: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setJobData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Create New Job Post</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-indigo-600">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title*</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={jobData.title}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Niche*</label>
                    <select
                      name="niche"
                      required
                      value={jobData.niche}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Niche</option>
                      <option value="Technology">Technology</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Health & Fitness">Health & Fitness</option>
                      <option value="Travel">Travel</option>
                      <option value="Food">Food</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Language*</label>
                    <select
                      name="language"
                      required
                      value={jobData.language}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Language</option>
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={jobData.location}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Duration */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-indigo-600">Budget & Duration</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Min Budget ($)*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="budgetMin"
                        required
                        value={jobData.budgetMin}
                        onChange={handleChange}
                        className="w-full pl-10 bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Budget ($)*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="budgetMax"
                        required
                        value={jobData.budgetMax}
                        onChange={handleChange}
                        className="w-full pl-10 bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration*</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiClock className="text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="duration"
                        required
                        value={jobData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 1 month"
                        className="w-full pl-10 bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Details */}
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4 text-indigo-600">Campaign Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description*</label>
                    <textarea
                      name="description"
                      rows={3}
                      required
                      value={jobData.description}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Platforms*</label>
                    <input
                      type="text"
                      name="platforms"
                      required
                      value={jobData.platforms}
                      onChange={handleChange}
                      placeholder="e.g. Instagram, YouTube"
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Engagement Requirement</label>
                    <input
                      type="text"
                      name="engagementReq"
                      value={jobData.engagementReq}
                      onChange={handleChange}
                      placeholder="e.g. 5-7%"
                      className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <FiCheck className="mr-2" />
                  Post Job
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
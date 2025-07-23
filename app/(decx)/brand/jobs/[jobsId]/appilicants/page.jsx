// app/brand/jobs/[jobId]/applicants/page.jsx
'use client'

import { FiArrowLeft, FiUser, FiDollarSign, FiCheck, FiX, FiClock, FiUsers, FiBarChart2 } from 'react-icons/fi'
import Link from 'next/link'

export default function JobApplicants({ params }) {
  // In a real app, you would fetch this data based on params.jobId
  const job = {
    id: params.jobId,
    title: 'AI Tool Promotion',
    applicants: [
      {
        id: 101,
        name: 'Sarah Johnson',
        handle: '@techsarah',
        avatar: 'SJ',
        rate: '$750',
        proposal: 'I specialize in AI tool reviews with 50k engaged followers. I can create 3 high-quality Instagram posts and 1 YouTube short showcasing your tool.',
        status: 'pending',
        appliedDate: '2023-11-16',
        engagementRate: '7.2%',
        followers: '52K'
      },
      {
        id: 102,
        name: 'Mike Chen',
        handle: '@mikesait',
        avatar: 'MC',
        rate: '$600',
        proposal: 'As a software developer influencer, I can demonstrate practical uses of your AI tool in coding workflows. I propose 2 Instagram reels and 1 tutorial video.',
        status: 'approved',
        appliedDate: '2023-11-15',
        engagementRate: '5.8%',
        followers: '38K'
      }
    ]
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/brand/jobs" className="flex items-center text-indigo-400 hover:text-indigo-300">
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </Link>
          <h1 className="text-2xl font-bold text-white">Applications for {job.title}</h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        {/* Applicants List */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Influencer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Proposal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {job.applicants.map((applicant) => (
                  <tr key={applicant.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400 font-medium mr-3">
                          {applicant.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-white">{applicant.name}</div>
                          <div className="text-sm text-slate-400">{applicant.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300 line-clamp-2">{applicant.proposal}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center text-slate-300">
                          <FiDollarSign className="mr-1 text-indigo-400" />
                          {applicant.rate}
                        </div>
                        <div className="flex items-center text-slate-300">
                          <FiUser className="mr-1 text-indigo-400" />
                          {applicant.followers} followers
                        </div>
                        <div className="flex items-center text-slate-300">
                          <FiBarChart2 className="mr-1 text-indigo-400" />
                          {applicant.engagementRate} engagement
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {applicant.status === 'pending' && (
                          <>
                            <button className="text-green-400 hover:text-green-300 p-1">
                              <FiCheck className="h-5 w-5" />
                            </button>
                            <button className="text-red-400 hover:text-red-300 p-1">
                              <FiX className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {applicant.status === 'approved' && (
                          <span className="text-green-400">Approved</span>
                        )}
                        {applicant.status === 'rejected' && (
                          <span className="text-red-400">Rejected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {job.applicants.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-1">No applicants yet</h3>
            <p className="text-slate-500">Your job hasn't received any applications yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
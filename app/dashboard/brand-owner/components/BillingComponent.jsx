'use client'
import { useState } from 'react'
import { FiCreditCard, FiDollarSign, FiFileText, FiRefreshCw, FiCheckCircle, FiX, FiPlus } from 'react-icons/fi'

export default function BillingComponent() {
  const [activePlan, setActivePlan] = useState('pro')
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, last4: '4242', brand: 'visa', exp: '12/25', isDefault: true },
    { id: 2, last4: '3579', brand: 'mastercard', exp: '08/24', isDefault: false }
  ])
  const [invoices, setInvoices] = useState([
    { id: 'INV-2023-001', date: '2023-10-15', amount: '$99.00', status: 'paid' },
    { id: 'INV-2023-002', date: '2023-09-15', amount: '$99.00', status: 'paid' },
    { id: 'INV-2023-003', date: '2023-08-15', amount: '$99.00', status: 'paid' }
  ])

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiDollarSign className="mr-2" /> Current Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {['basic', 'pro', 'enterprise'].map((plan) => (
            <div 
              key={plan}
              onClick={() => setActivePlan(plan)}
              className={`p-5 rounded-lg border cursor-pointer transition-all ${
                activePlan === plan 
                  ? 'border-indigo-500 bg-indigo-900/20' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white capitalize">{plan}</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {plan === 'basic' && '$29/month'}
                    {plan === 'pro' && '$99/month'}
                    {plan === 'enterprise' && 'Custom pricing'}
                  </p>
                </div>
                {activePlan === plan && (
                  <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">Active</span>
                )}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {plan === 'basic' && (
                  <>
                    <li>• 5 active job posts</li>
                    <li>• Basic analytics</li>
                    <li>• Email support</li>
                  </>
                )}
                {plan === 'pro' && (
                  <>
                    <li>• 20 active job posts</li>
                    <li>• Advanced analytics</li>
                    <li>• Priority support</li>
                    <li>• API access</li>
                  </>
                )}
                {plan === 'enterprise' && (
                  <>
                    <li>• Unlimited job posts</li>
                    <li>• Dedicated account manager</li>
                    <li>• Custom reporting</li>
                    <li>• White-label options</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
        
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          Change Plan
        </button>
      </div>

      {/* Payment Methods */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiCreditCard className="mr-2" /> Payment Methods
        </h2>
        
        <div className="space-y-4 mb-6">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-700">
              <div className="flex items-center">
                <div className="w-10 h-6 bg-slate-600 rounded flex items-center justify-center mr-4">
                  {method.brand === 'visa' && <span className="text-xs font-bold">VISA</span>}
                  {method.brand === 'mastercard' && <span className="text-xs font-bold">MC</span>}
                </div>
                <div>
                  <p className="font-medium text-white">•••• •••• •••• {method.last4}</p>
                  <p className="text-sm text-slate-400">Expires {method.exp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {method.isDefault && (
                  <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded-full">Default</span>
                )}
                <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                  {method.isDefault ? '' : 'Set as default'}
                </button>
                <button className="text-slate-400 hover:text-red-400">
                  <FiX size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
          <FiPlus size={18} className="mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiFileText className="mr-2" /> Billing History
        </h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">{invoice.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{invoice.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">{invoice.amount}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-400">
                    <button className="text-indigo-400 hover:text-indigo-300">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
// components/BillingComponent.js
"use client";
import { useState, useEffect } from "react";
import { FiDollarSign, FiFileText } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";

// --- RESPONSIVE SKELETON LOADER ---
const BillingSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Current Plan Skeleton */}
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="h-6 w-1/3 bg-slate-700 rounded mb-6"></div>
      <div className="h-48 w-full bg-slate-700/30 rounded-lg"></div>
    </div>

    {/* Change Plan Skeleton */}
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="h-6 w-1/4 bg-slate-700 rounded mb-6"></div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 bg-slate-700/30 rounded-lg"></div>
        <div className="h-40 bg-slate-700/30 rounded-lg"></div>
        <div className="h-40 bg-slate-700/30 rounded-lg hidden lg:block"></div>
      </div>
    </div>

    {/* Billing History Skeleton */}
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="h-6 w-1/3 bg-slate-700 rounded mb-6"></div>
      {/* Mobile Card Skeleton */}
      <div className="space-y-4 md:hidden">
        <div className="h-20 bg-slate-700/30 rounded-lg"></div>
        <div className="h-20 bg-slate-700/30 rounded-lg"></div>
      </div>
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block h-32 bg-slate-700/30 rounded-lg"></div>
    </div>
  </div>
);

export default function BillingComponent() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [expiresAt, setExpiresAt] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState({
    plan: true,
    invoices: true,
    form: false,
  });
  const [error, setError] = useState({
    plan: null,
    invoices: null,
    form: null,
    planChange: null,
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    // Fetching logic... (remains the same)
    const fetchData = async () => {
      try {
        const planRes = await fetch("/api/billing/plan");
        if (planRes.ok) {
          const {
            currentPlan,
            subscriptionStatus,
            expiresAt,
            availablePlans,
            paymentInfo,
          } = await planRes.json();
          setCurrentPlan(currentPlan);
          setSubscriptionStatus(subscriptionStatus);
          setExpiresAt(expiresAt);
          setAvailablePlans(availablePlans);
          setFormData({
            firstName: paymentInfo?.firstName || "",
            lastName: paymentInfo?.lastName || "",
            phoneNumber: paymentInfo?.phoneNumber || "",
          });
        } else {
          throw new Error("Failed to fetch plan information");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, plan: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, plan: false }));
      }

      try {
        const invoicesRes = await fetch("/api/billing/invoices");
        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(invoicesData);
        } else {
          throw new Error("Failed to fetch invoices");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, invoices: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, invoices: false }));
      }
    };
    fetchData();
  }, []);

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    setShowPaymentForm(true);
    setError((prev) => ({ ...prev, form: null, planChange: null }));
  };
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return "First name is required";
    }
    if (!formData.phoneNumber.trim()) {
      return "Phone number is required";
    }
    if (!/^(?:\+251|0)9\d{8}$/.test(formData.phoneNumber)) {
      return "Invalid phone number (e.g., +251912345678 or 0912345678)";
    }
    return null;
  };
  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.phoneNumber.trim() &&
      /^(?:\+251|0)9\d{8}$/.test(formData.phoneNumber)
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formError = validateForm();
    if (formError) {
      setError((prev) => ({ ...prev, form: formError }));
      return;
    }

    setIsLoading((prev) => ({ ...prev, form: true }));
    try {
      const planResponse = await fetch("/api/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlanId }),
      });

      if (!planResponse.ok) {
        const errorData = await planResponse.json();
        throw new Error(errorData.error || "Failed to initiate plan update");
      }

      const planData = await planResponse.json();

      if (planData.initiatePayment) {
        const paymentResponse = await fetch("/api/billing/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlanId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
          }),
        });

        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.error || "Failed to initialize payment");
        }

        const { checkoutUrl } = await paymentResponse.json();
        window.location.href = checkoutUrl;
      } else {
        setCurrentPlan(planData.plan);
        setSubscriptionStatus("active");
        setExpiresAt(
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        );
        toast({
          title: "Plan Updated",
          description: `Your plan has been successfully updated to ${planData.plan.name}.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setError((prev) => ({ ...prev, planChange: error.message }));
    } finally {
      setIsLoading((prev) => ({ ...prev, form: false }));
      setShowPaymentForm(false);
      setSelectedPlanId(null);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, form: null }));
  };

  if (isLoading.plan || isLoading.invoices) {
    return <BillingSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">
              Enter Payment Details
            </h3>
            {error.form && (
              <div className="mb-4 p-2 bg-red-900/30 text-red-400 rounded text-sm">
                {error.form}
              </div>
            )}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                  placeholder="Enter your last name (optional)"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., +251912345678"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-500"
                  disabled={isLoading.form}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-indigo-500 text-white rounded flex items-center ${
                    isLoading.form || !isFormValid()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-indigo-600"
                  }`}
                  disabled={isLoading.form || !isFormValid()}
                >
                  {isLoading.form && (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isLoading.form ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Current Plan & Change Plan Section */}
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiDollarSign className="mr-2" /> Subscription Plan
        </h2>
        {(error.plan || error.planChange) && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
            {error.plan || error.planChange}
          </div>
        )}

        {currentPlan ? (
          <div className="mb-8 p-4 sm:p-6 bg-slate-700/30 rounded-lg border border-indigo-500/50">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
              <div>
                <h3 className="text-lg font-bold text-white capitalize">
                  {currentPlan.name}
                </h3>
                <p className="text-indigo-300 text-sm mt-1">
                  {currentPlan.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize self-start sm:self-center ${
                  subscriptionStatus === "active"
                    ? "bg-indigo-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {subscriptionStatus}
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-white">
                ETB {currentPlan.price}
              </span>
              <span className="text-slate-400 ml-1">/month</span>
            </div>
            {expiresAt && (
              <p className="text-sm text-slate-400 mt-2">
                {subscriptionStatus === "active"
                  ? `Renews on: ${new Date(expiresAt).toLocaleDateString()}`
                  : `Expired on: ${new Date(expiresAt).toLocaleDateString()}`}
              </p>
            )}
            <ul className="mt-4 space-y-2 text-sm">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-slate-700/30 rounded-lg border border-red-500/50">
            <p className="text-red-400">
              No active plan. Please select a plan below to subscribe.
            </p>
          </div>
        )}

        <h3 className="text-lg font-bold text-white mb-4">Change Plan</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {availablePlans.map((plan) => (
            <div
              key={plan._id}
              onClick={() => handlePlanSelect(plan._id)}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                currentPlan?._id === plan._id
                  ? "border-indigo-500 bg-indigo-900/20"
                  : "border-slate-700 hover:border-slate-600"
              } ${
                plan.recommended
                  ? "ring-2 ring-yellow-500 ring-offset-2 ring-offset-slate-800"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white capitalize">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {plan.description}
                  </p>
                </div>
                {currentPlan?._id === plan._id &&
                  subscriptionStatus === "active" && (
                    <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                {plan.recommended &&
                  !(
                    currentPlan?._id === plan._id &&
                    subscriptionStatus === "active"
                  ) && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  )}
              </div>
              <div className="mt-3">
                <span className="text-xl font-bold text-white">
                  ETB {plan.price}
                </span>
                <span className="text-slate-400 ml-1">/month</span>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                    {feature}
                  </li>
                ))}
                {plan.features.length > 3 && (
                  <li className="text-slate-500 text-xs">
                    +{plan.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <FiFileText className="mr-2" /> Billing History
        </h2>
        {error.invoices && (
          <div className="mb-4 p-3 bg-red-900/30 text-red-400 rounded-lg">
            {error.invoices}
          </div>
        )}

        {/* --- Mobile Card View --- */}
        <div className="space-y-4 md:hidden">
          {invoices.length === 0 ? (
            <p className="text-center text-slate-400 py-4">No invoices found</p>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice._id}
                className="bg-slate-700/50 p-4 rounded-lg border border-slate-700"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-white">
                      {invoice.invoiceId}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`capitalize text-xs px-2 py-1 rounded-full ${
                      invoice.status === "success"
                        ? "text-green-400 bg-green-900/30"
                        : "text-yellow-400 bg-yellow-900/30"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <p className="text-right text-lg font-medium text-white">
                    {invoice.amount} ETB
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Desktop Table View --- */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/10">
              <tr className="text-left text-xs font-medium text-slate-400 uppercase">
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-4 text-center text-slate-400"
                  >
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice._id} className="text-sm">
                    <td className="px-4 py-3 text-white">
                      {invoice.invoiceId}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {invoice.amount} ETB
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`capitalize text-xs px-2 py-1 rounded-full ${
                          invoice.status === "success"
                            ? "text-green-400 bg-green-900/30"
                            : "text-yellow-400 bg-yellow-900/30"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiLoader, FiCheckCircle, FiAlertTriangle, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// --- Skeleton Components for Loading State ---
const PricingCardSkeleton = () => (
  <div className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
    <div className="h-6 w-1/3 bg-slate-700 rounded-md mb-2"></div>
    <div className="h-4 w-full bg-slate-700 rounded-md mb-6"></div>
    <div className="h-10 w-1/2 bg-slate-700 rounded-md mb-6"></div>
    <div className="space-y-3 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-5 w-full bg-slate-700 rounded-md"></div>
      ))}
    </div>
    <div className="h-12 w-full bg-slate-700 rounded-lg"></div>
  </div>
);

const PricingSkeleton = () => (
  <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-10 w-1/2 bg-slate-700 rounded-md mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 w-3/4 bg-slate-700 rounded-md mx-auto animate-pulse"></div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <PricingCardSkeleton />
        <PricingCardSkeleton />
        <PricingCardSkeleton />
      </div>
    </div>
  </div>
);

// --- UI Sub-Components ---
const PricingCard = ({ plan, currentPlan, subscriptionStatus, onSelect }) => {
  const isCurrentActivePlan =
    currentPlan?._id === plan._id && subscriptionStatus === "active";
  return (
    <div
      onClick={() => !isCurrentActivePlan && onSelect(plan._id)}
      className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border-2 transition-all duration-300 flex flex-col ${
        isCurrentActivePlan
          ? "border-indigo-500 shadow-indigo-900/40"
          : "border-slate-700 hover:border-indigo-500/50 cursor-pointer hover:-translate-y-1"
      }`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
          <div className="flex gap-2">
            {plan.recommended && (
              <span className="bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Recommended
              </span>
            )}
            {isCurrentActivePlan && (
              <span className="bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Current Plan
              </span>
            )}
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-4 h-10">{plan.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-extrabold text-white">
            ${plan.price}
          </span>
          <span className="text-slate-400 ml-1.5">ETB/month</span>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-6 pb-6 mt-auto">
        <button
          className={`w-full font-bold py-3 px-4 rounded-lg transition-colors text-lg ${
            isCurrentActivePlan
              ? "bg-slate-700 text-slate-400 cursor-default"
              : plan.recommended
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-white"
          }`}
          disabled={isCurrentActivePlan}
        >
          {isCurrentActivePlan ? "Subscribed" : "Choose Plan"}
        </button>
      </div>
    </div>
  );
};

const PaymentModal = ({
  show,
  onClose,
  onSubmit,
  formData,
  handleInputChange,
  isLoading,
  error,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md w-full shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white"
          >
            <FiX size={20} />
          </button>
          <h3 className="text-xl font-bold text-white mb-4">
            Confirm Your Details
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            Please provide your details to proceed with the payment.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-900/30 text-red-300 text-sm p-3 rounded-lg flex items-start gap-2">
                <FiAlertTriangle className="mt-0.5" />
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="w-full p-2.5 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="+251912345678"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg flex items-center gap-2 transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="font-medium text-white">{q}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <FaTimes className="text-slate-400 transform rotate-45" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <p className="pt-3 mt-3 text-slate-400 text-sm border-t border-slate-700">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page Component ---
export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [expiresAt, setExpiresAt] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isLoading, setIsLoading] = useState({ page: true, form: false });
  const [error, setError] = useState({
    page: null,
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
    const fetchData = async () => {
      try {
        const [planRes, plansRes] = await Promise.all([
          fetch("/api/billing/plan"),
          fetch("/api/plans"),
        ]);
        if (planRes.ok) {
          const { currentPlan, subscriptionStatus, expiresAt, paymentInfo } =
            await planRes.json();
          setCurrentPlan(currentPlan);
          setSubscriptionStatus(subscriptionStatus);
          setExpiresAt(expiresAt);
          setFormData({
            firstName: paymentInfo?.firstName || "",
            lastName: paymentInfo?.lastName || "",
            phoneNumber: paymentInfo?.phoneNumber || "",
          });
        }
        if (plansRes.ok) {
          setAvailablePlans(await plansRes.json());
        } else {
          throw new Error("Failed to fetch available plans");
        }
      } catch (err) {
        setError((prev) => ({ ...prev, page: err.message }));
      } finally {
        setIsLoading((prev) => ({ ...prev, page: false }));
      }
    };
    fetchData();
  }, []);

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    setShowPaymentForm(true);
    setError({ page: null, form: null, planChange: null });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!/^(?:\+251|0)9\d{8}$/.test(formData.phoneNumber)) {
      setError((prev) => ({ ...prev, form: "Invalid phone number format." }));
      return;
    }
    setIsLoading((prev) => ({ ...prev, form: true }));
    try {
      const response = await fetch("/api/billing/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlanId, ...formData }),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).error || "Payment initialization failed."
        );
      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      setError((prev) => ({ ...prev, form: error.message }));
      setIsLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error.form) setError((prev) => ({ ...prev, form: null }));
  };

  if (isLoading.page) return <PricingSkeleton />;
  if (error.page)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">
        {error.page}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <PaymentModal
        show={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        onSubmit={handleFormSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        isLoading={isLoading.form}
        error={error.form}
      />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Choose the perfect plan to connect with your audience through
            authentic influencer partnerships.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {availablePlans.map((plan) => (
            <PricingCard
              key={plan._id}
              plan={plan}
              currentPlan={currentPlan}
              subscriptionStatus={subscriptionStatus}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>

        <section className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <FaqItem
              q="Can I change my plan later?"
              a="Yes, you can upgrade or downgrade your plan at any time from your account settings. Prorated charges will be applied automatically."
            />
            <FaqItem
              q="Is there a long-term contract?"
              a="No, our standard plans are billed month-to-month. You can cancel at any time without any penalty."
            />
            <FaqItem
              q="What payment methods do you accept?"
              a="We accept various payment methods including Telebirr, CBE Birr, and other local options through our secure payment gateway."
            />
            <FaqItem
              q="Do you offer custom plans for agencies?"
              a="Absolutely! We provide tailored solutions for agencies and large brands. Please contact our sales team to discuss your specific needs."
            />
          </div>
        </section>
      </div>
    </div>
  );
}

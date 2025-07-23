"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SuccessContent() {
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState();
  const [txRef, setTxRef] = useState();
  const [planId, setPlanId] = useState();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Try regular method
    let tx = searchParams.get("tx_ref");
    let plan = searchParams.get("plan_id");

    // Fallback if Chapa encoded ampersands
    if (!tx || !plan) {
      const rawSearch = window.location.search;
      const fixedSearch = rawSearch.replace(/&amp;/g, "&");
      const fixedParams = new URLSearchParams(fixedSearch);
      tx = tx || fixedParams.get("tx_ref");
      plan = plan || fixedParams.get("plan_id");
    }

    setTxRef(tx);
    setPlanId(plan);
  }, [searchParams]);

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!txRef || !planId) {
        setError("Missing transaction reference or plan ID");
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(`/api/billing/verify?txRef=${txRef}`);
        if (!response.ok) {
          throw new Error("Failed to verify transaction");
        }

        const data = await response.json();
        if (data.status === "success") {
          const updateResponse = await fetch("/api/billing/subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ planId, txRef }),
          });

          if (!updateResponse.ok) {
            throw new Error("Failed to update subscription");
          }

          setStatus("success");
          setTimeout(() => router.push("/dashboard/brand-owner/billing"), 3000);
        } else {
          throw new Error("Payment failed or is pending");
        }
      } catch (err) {
        setError(err.message || "Unknown error");
        setStatus("error");
      }
    };

    if (txRef && planId) {
      verifyTransaction();
    }
  }, [txRef, planId, router]);

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg text-center text-white">
        {status === "verifying" && (
          <p className="text-slate-300">Verifying your payment...</p>
        )}
        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-400">
              Payment Successful!
            </h2>
            <p className="text-slate-300 mt-2">
              Redirecting to billing page...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-400">Payment Error</h2>
            <p className="text-slate-300 mt-2">{error}</p>
            <button
              onClick={() => router.push("/dashboard/billing")}
              className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Back to Billing
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen bg-slate-900">
          <div className="bg-slate-800 p-8 rounded-lg shadow-lg text-center text-white">
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

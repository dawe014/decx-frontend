"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");
  const planId = searchParams.get("plan_id");

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
          setTimeout(() => router.push("/dashboard/billing"), 3000);
        } else {
          setError("Payment failed or is pending");
          setStatus("error");
        }
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };

    verifyTransaction();
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

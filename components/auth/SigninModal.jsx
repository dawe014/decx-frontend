"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Alert } from "@/components/Alert";

const SigninModal = ({ isOpen, children }) => {
  const router = useRouter();
  const [alertState, setAlertState] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signinData, setSigninData] = useState({
    email: "",
    password: "",
  });

  const handleSigninInputChange = (e) => {
    const { name, value } = e.target;
    setSigninData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSigninSubmit = async (e) => {
    e.preventDefault();

    if (!signinData.email || !signinData.password) {
      setAlertState({
        showAlert: true,
        message: "All fields are required",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await signIn("credentials", {
        redirect: false,
        email: signinData.email,
        password: signinData.password,
      });

      if (data.error) {
        setAlertState({
          showAlert: true,
          message: "Invalid email or password",
          type: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const session = await getSession();
      const userId = session?.user?.id;

      if (userId) {
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/auth/redirect-check/${userId}`);
        const responseData = await res.json();

        if (responseData.redirect) {
          setAlertState({
            showAlert: true,
            message: `Logged in successfully, redirecting...`,
            type: "success",
          });
          router.push(responseData.redirect);
        } else {
          setAlertState({
            showAlert: true,
            message: "Logged in, but no redirect path provided",
            type: "warning",
          });
          router.push("/");
        }
      } else {
        console.warn("User ID not found in session");
        setAlertState({
          showAlert: true,
          message: "Logged in, but user ID not available",
          type: "warning",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in or redirect-check error:", error);
      setAlertState({
        showAlert: true,
        message: "An error occurred during sign-in or redirection",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-8 relative border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white transition-colors text-xl focus:outline-none"
            aria-label="Close sign-in modal"
          >
            ✕
          </button>
        </div>

        {alertState?.showAlert && (
          <Alert
            message={alertState.message}
            type={alertState.type}
            onClose={() => setAlertState(null)}
            duration={5000}
          />
        )}

        {children}

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <form onSubmit={handleSigninSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={signinData.email}
            onChange={handleSigninInputChange}
            required
            placeholder="Email address"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
          />

          <input
            type="password"
            name="password"
            value={signinData.password}
            onChange={handleSigninInputChange}
            required
            placeholder="Password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 focus:ring-primary"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-300"
              >
                Remember me
              </label>
            </div>

            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            } text-white font-medium py-3 rounded-lg mt-2 transition-colors`}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SigninModal;

"use client";
import { FaArrowLeft } from "react-icons/fa";
import { Alert } from "@/components/Alert";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignupModal = ({ influencer, brand }) => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(true);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [alertState, setAlertState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    role: "",
    confirm: "",
  });

  const openSignupModal = (role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(false);
    setIsSignupModalOpen(true);
    sessionStorage.setItem("temp_role", role); // Store role temporarily
  };

  const openRole = () => {
    setIsRoleModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value, selectedRole }));
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirm) {
      setAlertState({
        showAlert: true,
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          role: selectedRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlertState({
          showAlert: true,
          message: "Signup successful",
          type: "success",
        });
        router.push("/login");
      }
      if (!res.ok) {
        setAlertState({
          showAlert: true,
          message: data.message,
          type: "error",
        });
      }
      setIsLoading(false);
    } catch (err) {
      setAlertState({
        showAlert: true,
        message: err.message,
        type: "error",
      });
    }
  };

  return (
    <>
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg p-8 relative border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Join Us</h2>
              <button
                onClick={() => router.push("/")}
                className="text-gray-400 hover:text-white transition-colors text-xl focus:outline-none"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-300">
              Choose how you'd like to join our platform.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => openSignupModal("brand")}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Join As Brand
                </button>
                <button
                  onClick={() => openSignupModal("influencer")}
                  className="flex-1 border border-primary  text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Join As Influencer
                </button>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">
                  OR
                </span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-primary hover:text-primary-light font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      //------------------------------------------------------// // Signup Form
      //------------------------------------------------------//
      {isSignupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-8 relative border border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={openRole}
                className="text-gray-400 hover:text-white transition-colors  focus:outline-none"
              >
                <FaArrowLeft size={18} className="inline" /> Role
              </button>
              <h2 className="text-xl font-bold text-white">
                Join as {selectedRole === "influencer" ? "Influencer" : "Brand"}
              </h2>
              <button
                onClick={() => router.push("/")}
                className="text-gray-400 hover:text-white transition-colors text-xl focus:outline-none"
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

            <p className="mt-2 text-sm text-gray-300">
              Please enter your email and create a password to get started.
            </p>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupInputChange}
                  required
                  placeholder="Email address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupInputChange}
                  required
                  placeholder="Create password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                  minLength={6}
                />
              </div>
              <div>
                <input
                  type="password"
                  name="confirm"
                  value={signupData.confirm}
                  onChange={handleSignupInputChange}
                  required
                  placeholder="Confirm password"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                  minLength={6}
                />
              </div>

              {isLoading ? (
                <button
                  type="button"
                  className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
                >
                  Signing up...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Sign up
                </button>
              )}
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupModal;

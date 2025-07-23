"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FiUser, FiLock } from "react-icons/fi";

export default function SettingsComponent() {
  const { data: session, update } = useSession();
  const [initialEmail, setInitialEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load session email when session is ready
  useEffect(() => {
    if (session?.user?.email) {
      setFormData((prev) => ({ ...prev, email: session.user.email }));
      setInitialEmail(session.user.email);
    }
  }, [session]);

  // --- UPDATED AND MORE ROBUST VALIDATION LOGIC ---
  const validate = (fieldValues = formData) => {
    let tempErrors = {}; // Start with a clean error object

    // 1. Validate Email
    if (!fieldValues.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(fieldValues.email)) {
      tempErrors.email = "Email is not valid.";
    }

    // 2. Check if a password change is being attempted
    const isPasswordChangeAttempted =
      fieldValues.oldPassword ||
      fieldValues.password ||
      fieldValues.confirmPassword;

    if (isPasswordChangeAttempted) {
      // If so, all password fields are now subject to validation
      if (!fieldValues.oldPassword) {
        tempErrors.oldPassword =
          "Current password is required to set a new one.";
      }

      if (!fieldValues.password) {
        tempErrors.password = "New password is required.";
      } else if (fieldValues.password.length < 8) {
        tempErrors.password =
          "New password must be at least 8 characters long.";
      }

      if (fieldValues.password !== fieldValues.confirmPassword) {
        tempErrors.confirmPassword = "New passwords do not match.";
      }
    }

    setErrors(tempErrors);

    // Returns true if the form is valid (no errors)
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update form data state immediately
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    // Validate the entire form on each change to catch interconnected errors
    validate(updatedFormData);
  };

  const hasChanges =
    formData.email !== initialEmail ||
    formData.oldPassword !== "" ||
    formData.password !== "" ||
    formData.confirmPassword !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run final, full validation before submitting
    if (!validate(formData)) {
      toast.error("Please fix the errors before saving.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      email: formData.email,
      ...(formData.password && {
        oldPassword: formData.oldPassword,
        password: formData.password,
      }),
    };

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Settings updated successfully");
        setErrors({}); // Clear errors on success
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          password: "",
          confirmPassword: "",
        }));

        if (formData.email !== session.user.email) {
          await update({ user: { email: formData.email } });
          setInitialEmail(formData.email);
        }
      } else {
        const data = await response.json();
        toast.error(
          data.error || "Failed to update settings. Please try again."
        );
      }
    } catch (error) {
      console.error("Update settings error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to generate dynamic input classes for error states
  const getInputClass = (fieldName) => {
    const baseClass =
      "w-full px-4 py-2 border rounded-lg bg-slate-900 text-white focus:outline-none";
    const errorClass = "border-red-500 focus:ring-2 focus:ring-red-500";
    const defaultClass = "border-slate-700 focus:ring-2 focus:ring-indigo-500";
    const disabledClass = "disabled:bg-slate-800 disabled:cursor-not-allowed";
    return `${baseClass} ${
      errors[fieldName] ? errorClass : defaultClass
    } ${disabledClass}`;
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiUser className="mr-2" /> Account Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={getInputClass("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <hr className="border-slate-700" />

          <h3 className="text-lg font-semibold text-white flex items-center">
            <FiLock className="mr-2" /> Change Password
          </h3>

          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Current Password
            </label>
            <input
              id="oldPassword"
              type="password"
              name="oldPassword"
              placeholder="Required to set a new password"
              value={formData.oldPassword}
              onChange={handleChange}
              className={getInputClass("oldPassword")}
            />
            {errors.oldPassword && (
              <p className="mt-1 text-sm text-red-400">{errors.oldPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              className={getInputClass("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-400 mb-1"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={!formData.password}
              className={getInputClass("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-indigo-900/50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

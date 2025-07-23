"use client";
import { useUser } from "@/context/UserContext";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FiMail,
  FiLock,
  FiUser,
  FiArrowLeft,
  FiLoader,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiCamera,
} from "react-icons/fi";
import Image from "next/image";

// Reusable Input component for our form
const InputField = ({
  id,
  label,
  type,
  value,
  onChange,
  error,
  icon: Icon,
  children,
}) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      )}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        autoComplete={id.includes("password") ? id : "off"}
        value={value}
        onChange={onChange}
        className={`block w-full rounded-md border-gray-300 bg-gray-50 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
          Icon ? "pl-10" : "pl-4"
        } ${children ? "pr-10" : "pr-4"} ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
        }`}
      />
      {children}
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);
const SecuritySettingsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900 sm:px-6 lg:px-8 animate-pulse">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-8 w-64 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </div>

        <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800">
          {/* User Info & Profile Link Skeleton */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              </div>
              <div className="h-9 w-36 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          {/* Profile Picture Skeleton */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="h-5 w-32 bg-gray-300 dark:bg-gray-700 rounded-md mb-4"></div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              <div className="h-10 w-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="p-6 space-y-6">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 bg-gray-50 p-4 rounded-b-xl dark:bg-gray-800/50">
            <div className="h-11 w-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-11 w-32 bg-blue-300 dark:bg-blue-900/50 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SecuritySettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const { user, loading: isLoading, refetchUser } = useUser();

  const [userName, setUserName] = useState("Loading...");
  const [profilePicture, setProfilePicture] = useState("/default-profile.png");

  // State for the form
  const [initialEmail, setInitialEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // State for new profile picture
  const [newProfilePictureFile, setNewProfilePictureFile] = useState(null);
  const [newProfilePicturePreview, setNewProfilePicturePreview] =
    useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        setInitialEmail(user.email);
        setUserName(user.fullName || "User");
        setProfilePicture(user.profilePictureUrl || "/default-profile.png");
        setFormData((prev) => ({ ...prev, email: user.email }));
      } else {
        router.push("/login");
      }
    }
  }, [isLoading, user, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("File is too large. Please select an image under 2MB.");
        return;
      }
      setNewProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePictureUpload = async () => {
    if (!newProfilePictureFile) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading new profile picture...");
    const formData = new FormData();
    formData.append("profileImage", newProfilePictureFile);

    try {
      const res = await fetch("/api/profile/upload", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload picture.");
      }
      const data = await res.json();

      toast.success("Profile picture updated!", { id: toastId });
      setProfilePicture(data.url); // Update UI with the new image URL from server
      setNewProfilePictureFile(null);
      setNewProfilePicturePreview(null);
      if (refetchUser) refetchUser(); // Refetch user context to get the new photo URL globally
    } catch (error) {
      toast.error(error.message || "Upload failed. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailChanged = formData.email !== initialEmail;
    const passwordChanged = formData.newPassword !== "";

    if (!emailChanged && !passwordChanged) {
      toast.info("No changes to save.");
      return false;
    }

    if (!formData.currentPassword) {
      newErrors.currentPassword =
        "Current password is required to save any changes.";
    }

    if (emailChanged && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (passwordChanged) {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "New password must be at least 8 characters.";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "New passwords do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Saving your changes...");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.newPassword,
          oldPassword: formData.currentPassword,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update settings.");
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      // If the email was changed, update the session
      if (formData.email !== initialEmail) {
        // Optionally, you can refresh the user context or session here
      }
      // Show success message
      toast.dismiss(toastId);
      toast.success("Security settings updated successfully!", {
        id: toastId,
      });

      // Update the initial state to reflect saved changes
      setInitialEmail(formData.email);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return <SecuritySettingsSkeleton />;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg dark:bg-gray-800">
          {/* User Info & Profile Link Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Signed in as
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiUser /> {userName}
                </p>
              </div>
              <button
                onClick={() => router.push("/profile")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                Update Profile <FiExternalLink />
              </button>
            </div>
          </div>

          {/* --- NEW PROFILE PICTURE SECTION --- */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h3>
            <div className="flex items-center gap-5">
              <Image
                src={newProfilePicturePreview || profilePicture}
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg, image/webp"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <FiCamera className="inline-block mr-2" />
                  Choose Picture
                </button>
                {newProfilePictureFile && (
                  <button
                    type="button"
                    onClick={handlePictureUpload}
                    disabled={isUploading}
                    className="ml-3 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isUploading ? "Saving..." : "Save Picture"}
                  </button>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your email address and password. Enter your current
                password to make any changes.
              </p>
              <InputField
                id="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={FiMail}
              />
              <hr className="dark:border-gray-600" />
              <InputField
                id="currentPassword"
                label="Current Password"
                type={showPassword.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                icon={FiLock}
              >
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword.current ? <FiEyeOff /> : <FiEye />}
                </button>
              </InputField>
              <InputField
                id="newPassword"
                label="New Password (optional)"
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                icon={FiLock}
              >
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword.new ? <FiEyeOff /> : <FiEye />}
                </button>
              </InputField>
              <InputField
                id="confirmPassword"
                label="Confirm New Password"
                type={showPassword.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={FiLock}
              >
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                </button>
              </InputField>
            </div>
            <div className="flex justify-end space-x-4 bg-gray-50 p-4 rounded-b-xl dark:bg-gray-800/50">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { toast } from "sonner";
import { FiUser, FiMapPin, FiPhone, FiMail, FiInfo } from "react-icons/fi";

export default function StepOne() {
  const router = useRouter();

  // Initialize form state with existing data or defaults
  const [formData, setFormData] = useState({
    fullName: "",
    location: { city: "", country: "" },
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle individual field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.fullName ||
      !formData.location.city ||
      !formData.location.country ||
      !formData.phone ||
      formData.bio.length < 50
    ) {
      toast.error(
        "Please fill all fields and ensure bio is at least 50 characters."
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/influencers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      router.push("/create-profile/step-2");
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <ProfileLayout step={1}>
      <div className="max-w-md mx-auto w-full animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Basic Information
          </h2>
          <p className="text-gray-400">Tell us about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <FiUser className="mr-2" /> Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <FiUser className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* Location - City & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <FiMapPin className="mr-2" /> City
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="New York"
                  value={formData.location.city}
                  onChange={(e) =>
                    handleChange("location", {
                      ...formData.location,
                      city: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <FiMapPin className="mr-2" /> Country
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="United States"
                  value={formData.location.country}
                  onChange={(e) =>
                    handleChange("location", {
                      ...formData.location,
                      country: e.target.value,
                    })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <FiMapPin className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <FiPhone className="mr-2" /> Phone Number
            </label>
            <div className="relative">
              <PhoneInput
                country={"us"}
                value={formData.phone}
                onChange={(value) => handleChange("phone", value)}
                inputClass="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                buttonClass="!bg-gray-700/50 !border-gray-600 !rounded-l-lg !text-white"
                dropdownClass="!bg-gray-800 !border-gray-700 backdrop-blur-sm"
                containerClass="phone-input-container"
                inputStyle={{ width: "100%" }}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <FiInfo className="mr-2" /> About You
            </label>
            <div className="relative">
              <textarea
                placeholder="Tell brands about yourself and your content..."
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-h-[120px]"
                value={formData.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                required
              />
              <FiInfo className="absolute left-3 top-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Minimum 50 characters ({formData.bio.length}/50)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 ${
              loading ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Next Step"}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .phone-input-container .form-control {
          height: 48px;
          width: 100% !important;
          background-color: rgba(55, 65, 81, 0.5) !important;
          border-color: #4b5563 !important;
          color: white !important;
        }
        .phone-input-container .flag-dropdown {
          background-color: rgba(55, 65, 81, 0.5) !important;
          border-color: #4b5563 !important;
        }
        .phone-input-container .selected-flag:hover {
          background-color: rgba(55, 65, 81, 0.5) !important;
        }
        .phone-input-container .country-list {
          background-color: rgba(31, 41, 55, 0.95) !important;
          border-color: #4b5563 !important;
          backdrop-filter: blur(10px);
        }
        .phone-input-container .country:hover {
          background-color: #374151 !important;
        }
        .phone-input-container .country.highlight {
          background-color: #374151 !important;
        }
      `}</style>
    </ProfileLayout>
  );
}

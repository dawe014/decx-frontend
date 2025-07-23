"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  FiPlus,
  FiX,
  FiArrowRight,
  FiDollarSign,
  FiGlobe,
} from "react-icons/fi";

// Language level options
const languageLevels = [
  "Conversational",
  "Fluent",
  "Native",
  "Beginner",
  "Intermediate",
  "Professional",
];

export default function StepThree() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [services, setServices] = useState([{ name: "", fee: "" }]);
  const [languages, setLanguages] = useState([
    { name: "", level: "Conversational" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addService = () => {
    setServices([...services, { name: "", fee: "" }]);
  };

  const removeService = (index) => {
    if (services.length > 1) {
      setServices(services.filter((_, i) => i !== index));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updated = services.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setServices(updated);
  };

  const addLanguage = () => {
    setLanguages([...languages, { name: "", level: "Conversational" }]);
  };

  const removeLanguage = (index) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const handleLanguageChange = (index, field, value) => {
    const updated = languages.map((lang, i) =>
      i === index ? { ...lang, [field]: value } : lang
    );
    setLanguages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      services.some((s) => !s.name || !s.fee) ||
      languages.some((l) => !l.name)
    ) {
      toast.error("Please complete all fields before proceeding.");
      return;
    }

    if (status !== "authenticated" || !session?.user?.id) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/influencers/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          services,
          languages,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      router.push("/create-profile/step-4");
    } catch (err) {
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileLayout step={3}>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto space-y-8"
        noValidate
      >
        {/* Services */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Services Offered
          </h2>
          {services.map((service, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Service (e.g. Instagram Post)"
                  value={service.name}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Fee in ETB"
                  value={service.fee}
                  onChange={(e) =>
                    handleServiceChange(index, "fee", e.target.value)
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2 flex justify-between">
                <button
                  type="button"
                  onClick={addService}
                  className="text-sm text-blue-500 hover:underline flex items-center"
                >
                  <FiPlus className="mr-1" /> Add Service
                </button>
                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-sm text-red-500 hover:underline flex items-center"
                  >
                    <FiX className="mr-1" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Languages Spoken
          </h2>
          {languages.map((lang, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <input
                type="text"
                placeholder="Language (e.g. English)"
                value={lang.name}
                onChange={(e) =>
                  handleLanguageChange(index, "name", e.target.value)
                }
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={lang.level}
                onChange={(e) =>
                  handleLanguageChange(index, "level", e.target.value)
                }
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-blue-500"
              >
                {languageLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <div className="md:col-span-2 flex justify-between">
                <button
                  type="button"
                  onClick={addLanguage}
                  className="text-sm text-blue-500 hover:underline flex items-center"
                >
                  <FiPlus className="mr-1" /> Add Language
                </button>
                {languages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="text-sm text-red-500 hover:underline flex items-center"
                  >
                    <FiX className="mr-1" /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={
            isLoading ||
            services.some((s) => !s.name || !s.fee) ||
            languages.some((l) => !l.name)
          }
          className={`w-full py-3 px-6 rounded-lg flex items-center justify-center ${
            services.every((s) => s.name && s.fee) &&
            languages.every((l) => l.name)
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-700 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Saving..." : "Next Step"}
          <FiArrowRight className="ml-2" />
        </button>
      </form>
    </ProfileLayout>
  );
}

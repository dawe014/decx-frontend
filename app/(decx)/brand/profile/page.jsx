"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";

const BrandProfileBuilder = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    logo: "",
    industry: "",
    website: "",
    companySize: "",
    description: "",
    contactPerson: {
      name: "",
      position: "",
      phone: "",
    },
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, logo: file })); // Add file to formData
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.industry) {
      newErrors.industry = "Industry is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && formData.logo) {
        const logoFormData = new FormData();
        logoFormData.append("logo", formData.logo);

        const logoRes = await fetch(`/api/brands/${data.brand._id}/logo`, {
          method: "PATCH",
          body: logoFormData,
        });

        if (logoRes.ok) {
          toast.success("Profile created successfully");
          router.push("/dashboard/brand-owner");
        } else {
          toast.error("Failed to upload logo");
        }
      } else {
        toast.error("Failed to create profile");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
          <div className="bg-slate-700 px-6 py-5 border-b border-slate-600">
            <h1 className="text-2xl font-bold text-white">Brand Profile</h1>
            <p className="mt-1 text-sm text-slate-300">
              Complete your brand profile to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="divide-y divide-slate-600">
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Company Name *
                  </label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    type="text"
                    className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400 ${
                      errors.companyName ? "border-red-500" : "border-slate-600"
                    }`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    {logoPreview ? (
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-700 border border-slate-600 flex justify-center items-center">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          width={500}
                          height={500}
                          className=" object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-slate-700 border border-dashed border-slate-500 flex items-center justify-center">
                        <svg
                          className="h-8 w-8 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                        <span>{logoPreview ? "Change" : "Upload"}</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Industry and Company Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-slate-700 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white ${
                      errors.industry ? "border-red-500" : "border-slate-600"
                    }`}
                  >
                    <option value="">Select industry</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="tech">Technology</option>
                    <option value="food">Food & Beverage</option>
                    <option value="health">Health & Wellness</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.industry}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Website
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 text-sm">
                    https://
                  </span>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    type="text"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="example.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                  placeholder="Tell us about your company..."
                />
              </div>
            </div>

            {/* Contact Person Section */}
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Contact Person
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Name
                  </label>
                  <input
                    name="contactPerson.name"
                    value={formData.contactPerson.name}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Position
                  </label>
                  <input
                    name="contactPerson.position"
                    value={formData.contactPerson.position}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                    placeholder="Job title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    name="contactPerson.phone"
                    value={formData.contactPerson.phone}
                    onChange={handleInputChange}
                    type="tel"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-6 py-4 bg-slate-700 border-t border-slate-600 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandProfileBuilder;

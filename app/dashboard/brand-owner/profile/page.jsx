"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- RESPONSIVE SKELETON LOADER ---
const BrandProfileSkeleton = () => (
  <div className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 animate-pulse">
    <div className="max-w-5xl mx-auto">
      <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-600">
          <div className="h-8 w-1/3 bg-slate-700 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-700 rounded mt-2"></div>
        </div>
        <div className="divide-y divide-slate-600">
          {/* Company Info Skeleton */}
          <div className="p-6 space-y-6">
            <div className="h-6 w-1/4 bg-slate-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name & Logo Skeletons */}
              <div>
                <div className="h-5 w-1/3 bg-slate-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
              </div>
              <div>
                <div className="h-5 w-1/3 bg-slate-700 rounded mb-2"></div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-700 rounded-full"></div>
                  <div className="h-10 w-24 bg-slate-700 rounded-md"></div>
                </div>
              </div>
              {/* Industry & Size Skeletons */}
              <div>
                <div className="h-5 w-1/3 bg-slate-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
              </div>
              <div>
                <div className="h-5 w-1/3 bg-slate-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
              </div>
            </div>
            {/* Website & Description Skeletons */}
            <div>
              <div className="h-5 w-1/4 bg-slate-700 rounded mb-2"></div>
              <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
            </div>
            <div>
              <div className="h-5 w-1/4 bg-slate-700 rounded mb-2"></div>
              <div className="h-24 w-full bg-slate-700 rounded-lg"></div>
            </div>
          </div>
          {/* Contact Person Skeleton */}
          <div className="p-6 space-y-6">
            <div className="h-6 w-1/4 bg-slate-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
              </div>
              <div>
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
              </div>
              <div>
                <div className="h-10 w-full bg-slate-700 rounded-lg"></div>
              </div>
            </div>
          </div>
          {/* Submit Button Skeleton */}
          <div className="px-6 py-4 bg-slate-700 border-t border-slate-600 flex justify-end">
            <div className="h-12 w-32 bg-slate-600 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BrandProfilePage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    logo: "",
    industry: "",
    website: "",
    companySize: "",
    description: "",
    contactPerson: { name: "", position: "", phone: "" },
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  // Fetch brand data
  useEffect(() => {
    if (status === "authenticated") {
      const fetchBrand = async () => {
        try {
          const res = await fetch(`/api/brands/me`);
          const { brand: data, error } = await res.json();
          if (res.ok && data) {
            setFormData({
              id: data._id || "",
              companyName: data.companyName || "",
              logo: data.logo || "",
              industry: data.industry || "",
              website: data.website || "",
              companySize: data.companySize || "",
              description: data.description || "",
              contactPerson: {
                name: data.contactPerson?.name || "",
                position: data.contactPerson?.position || "",
                phone: data.contactPerson?.phone || "",
              },
            });
            if (data.logo) setLogoPreview(data.logo);
          } else {
            toast.error(error || "Failed to fetch brand data.");
          }
        } catch (error) {
          console.error("Error fetching brand:", error);
          toast.error(
            "An unexpected error occurred while fetching your profile."
          );
        }
      };
      fetchBrand();
    }
  }, [status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB size limit
        toast.error("Logo file size should not exceed 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, logo: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (
      formData.website &&
      !/^(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(
        formData.website
      )
    ) {
      newErrors.website =
        "Please enter a valid website address (e.g., example.com)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Update brand data
      const brandRes = await fetch(`/api/brands/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          industry: formData.industry,
          website: formData.website,
          companySize: formData.companySize,
          description: formData.description,
          contactPerson: formData.contactPerson,
        }),
      });

      const brandData = await brandRes.json();

      if (brandRes.ok) {
        // Handle logo upload if a new logo is selected
        if (formData.logo instanceof File) {
          const logoFormData = new FormData();
          logoFormData.append("logo", formData.logo);

          const logoRes = await fetch(`/api/brands/${formData.id}/logo`, {
            method: "PATCH",
            body: logoFormData,
          });

          const logoData = await logoRes.json();

          if (logoRes.ok) {
            toast.success("Logo updated successfully", { duration: 4000 });
          } else {
            toast.error(logoData.error || "Failed to update logo", {
              duration: 4000,
            });
          }
        }
        toast.success("Profile updated successfully", { duration: 4000 });
        setTimeout(() => {
          router.push("/dashboard/brand-owner");
        }, 1000); // Delay redirect to ensure toast is visible
      } else {
        toast.error(brandData.error || "Failed to update profile", {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <BrandProfileSkeleton />;
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-700">
          <div className="px-6 py-5 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-white">Brand Profile</h1>
            <p className="mt-1 text-sm text-slate-300">
              View and edit your brand profile information.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="divide-y divide-slate-700">
            {/* --- COMPANY INFORMATION --- */}
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Company Name *
                  </label>
                  <input
                    id="companyName"
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
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Company Logo
                  </label>
                  {/* --- RESPONSIVE LOGO UPLOAD --- */}
                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-full object-cover bg-slate-700 border border-slate-600"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-slate-700 border border-dashed border-slate-500 flex items-center justify-center text-slate-400">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 12m-6 6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors">
                      <span>{logoPreview ? "Change Logo" : "Upload Logo"}</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleLogoChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Industry *
                  </label>
                  <select
                    id="industry"
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
                  <label
                    htmlFor="companySize"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Company Size
                  </label>
                  <select
                    id="companySize"
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
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Website
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-400 text-sm">
                    https://
                  </span>
                  <input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    type="text"
                    className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md bg-slate-700 text-white placeholder-slate-400 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
                      errors.website ? "border-red-500" : "border-slate-600"
                    }`}
                    placeholder="www.example.com"
                  />
                </div>
                {errors.website && (
                  <p className="mt-1 text-sm text-red-400">{errors.website}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                  placeholder="Tell us about your company..."
                />
              </div>
            </div>

            {/* --- CONTACT PERSON --- */}
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Contact Person
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="contactName"
                    name="contactPerson.name"
                    value={formData.contactPerson.name}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPosition"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Position
                  </label>
                  <input
                    id="contactPosition"
                    name="contactPerson.position"
                    value={formData.contactPerson.position}
                    onChange={handleInputChange}
                    type="text"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white placeholder-slate-400"
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactPhone"
                    className="block text-sm font-medium text-slate-300 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="contactPhone"
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

            {/* --- SUBMIT --- */}
            <div className="px-6 py-4 bg-slate-700/50 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-transparent font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {isSubmitting ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandProfilePage;

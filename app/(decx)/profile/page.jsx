"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  FiSave,
  FiLoader,
  FiAlertTriangle,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiUser,
  FiAward,
  FiShare2,
  FiBriefcase,
  FiCamera,
  FiEye, // Added for Preview button
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Added for navigation
import PortfolioManager from "@/components/PortfolioManager"; // Adjust path if needed

// --- Skeleton Component for Loading State ---
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-900 animate-pulse">
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 w-1/3 bg-slate-700 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-8">
                <div className="h-8 w-1/4 bg-slate-700 rounded-md mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-10 bg-slate-700 rounded-lg"></div>
                  <div className="h-10 bg-slate-700 rounded-lg"></div>
                  <div className="md:col-span-2 h-24 bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 rounded-xl p-6 sticky top-24">
              <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4"></div>
              <div className="h-6 w-3/4 bg-slate-700 rounded-md mx-auto mb-6"></div>
              <div className="h-12 w-full bg-slate-700 rounded-lg mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-1/2 bg-slate-700 rounded-md"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UI Sub-Components ---
const FormSection = ({ title, id, children }) => (
  <section
    id={id}
    className="bg-slate-800/50 rounded-xl p-6 md:p-8 scroll-mt-24"
  >
    <h2 className="text-2xl font-bold mb-6 text-indigo-400 border-b border-slate-700 pb-4">
      {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </section>
);

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-300 mb-2"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  </div>
);

const Select = ({ label, name, value, onChange, children }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-300 mb-2"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    >
      {children}
    </select>
  </div>
);

const Textarea = ({ label, name, value, onChange, placeholder, rows = 4 }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-slate-300 mb-2"
    >
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  </div>
);

const NichePill = ({ niche, isChecked, onChange }) => (
  <label
    className={`cursor-pointer px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
      isChecked
        ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/50"
        : "bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600"
    }`}
  >
    <input
      type="checkbox"
      value={niche}
      checked={isChecked}
      onChange={onChange}
      className="sr-only"
    />
    <span className="capitalize">{niche}</span>
  </label>
);

const Notification = ({ message, type, onDismiss }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
        className={`fixed top-24 right-5 p-4 rounded-lg flex items-center shadow-lg z-50 border ${
          type === "success"
            ? "bg-green-900/50 text-green-300 border-green-500/30"
            : "bg-red-900/50 text-red-300 border-red-500/30"
        }`}
      >
        {type === "success" ? (
          <FiCheckCircle className="mr-3" size={20} />
        ) : (
          <FiAlertTriangle className="mr-3" size={20} />
        )}
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="ml-4 text-xl opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

const Sidebar = ({ formData, saving, handleSubmit }) => {
  const router = useRouter(); // Added for navigation
  const navItems = [
    { id: "basic", label: "Basic Info", icon: FiUser },
    { id: "expertise", label: "Expertise", icon: FiAward },
    { id: "social", label: "Social Media", icon: FiShare2 },
    { id: "services", label: "Services & Rates", icon: FiBriefcase },
    { id: "portfolio", label: "Portfolio", icon: FiCamera },
  ];
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="sticky top-24">
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="text-center mb-6">
          <FiUser size={48} className="mx-auto text-indigo-400 mb-3" />
          <h2 className="text-xl font-bold text-white truncate">
            {formData?.fullName || "Your Profile"}
          </h2>
          <p className="text-sm text-slate-400 truncate">{formData?.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 text-lg shadow-lg shadow-indigo-900/50"
        >
          {saving ? (
            <>
              <FiLoader className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <FiSave /> Save Profile
            </>
          )}
        </button>
        {/* Added Preview Public View Button */}
        <button
          type="button"
          onClick={() => router.push("/profile/preview")}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 mt-3"
        >
          <FiEye /> Preview Public View
        </button>
        <nav className="mt-8">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-3">
            Jump to Section
          </p>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  className="flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-700/50 w-full text-left p-2 rounded-md transition-colors"
                >
                  <item.icon className="text-indigo-400" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const EditInfluencerProfilePage = () => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const NICHE_OPTIONS = [
    "fashion",
    "beauty",
    "fitness",
    "food",
    "travel",
    "tech",
    "gaming",
    "lifestyle",
    "business",
    "education",
  ];

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/influencers/me");
      if (!response.ok) throw new Error("Failed to fetch profile data.");
      const data = await response.json();
      setFormData({
        ...data.influencer,
        location: data.influencer.location || {},
        languages: data.influencer.languages || [],
        niches: data.influencer.niches || [],
        socialMedia: data.influencer.socialMedia || [],
        portfolio: data.influencer.portfolio || [],
        rates: data.influencer.rates || {},
        services: data.influencer.services || [],
      });
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const dismissNotification = () => setNotification({ message: "", type: "" });

  const handleInputChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleNestedInputChange = (section, e) =>
    setFormData((p) => ({
      ...p,
      [section]: { ...p[section], [e.target.name]: e.target.value },
    }));
  const handleDynamicListChange = (section, index, e) => {
    const list = [...formData[section]];
    list[index] = { ...list[index], [e.target.name]: e.target.value };
    setFormData((p) => ({ ...p, [section]: list }));
  };
  const addListItem = (section, newItem) =>
    setFormData((p) => ({ ...p, [section]: [...(p[section] || []), newItem] }));
  const removeListItem = (section, index) =>
    setFormData((p) => ({
      ...p,
      [section]: p[section].filter((_, i) => i !== index),
    }));
  const handleNicheChange = (e) => {
    const { value, checked } = e.target;
    const current = formData.niches || [];
    setFormData((p) => ({
      ...p,
      niches: checked
        ? [...current, value]
        : current.filter((n) => n !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    dismissNotification();
    try {
      const { portfolio, ...profileData } = formData;
      const response = await fetch("/api/influencers/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Failed to save profile."
        );
      setNotification({
        message: "Profile updated successfully!",
        type: "success",
      });
      setTimeout(dismissNotification, 4000);
    } catch (err) {
      setNotification({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!formData)
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-lg text-slate-400">
            It seems like we couldn't find your profile. Please try again later.
          </p>
          <button
            onClick={fetchProfile}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <FiLoader className="animate-spin mr-2" size={16} /> Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-20">
      <Notification
        message={notification.message}
        type={notification.type}
        onDismiss={dismissNotification}
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-white">
          Edit Your Profile
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 space-y-8">
            <FormSection title="Basic Information" id="basic">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell brands about yourself..."
                  />
                </div>
                <Input
                  label="Country"
                  name="country"
                  value={formData.location.country}
                  onChange={(e) => handleNestedInputChange("location", e)}
                />
                <Input
                  label="City"
                  name="city"
                  value={formData.location.city}
                  onChange={(e) => handleNestedInputChange("location", e)}
                />
                <Input
                  label="Timezone"
                  name="timezone"
                  value={formData.location.timezone}
                  onChange={(e) => handleNestedInputChange("location", e)}
                  placeholder="e.g., America/New_York"
                />
                <Select
                  label="Availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="available">Available</option>
                  <option value="limited">Limited</option>
                  <option value="unavailable">Not Available</option>
                </Select>
              </div>
            </FormSection>
            <FormSection title="Expertise & Languages" id="expertise">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-200">
                  Your Niches
                </h3>
                <div className="flex flex-wrap gap-3">
                  {NICHE_OPTIONS.map((n) => (
                    <NichePill
                      key={n}
                      niche={n}
                      isChecked={formData.niches.includes(n)}
                      onChange={handleNicheChange}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-200">
                  Languages You Speak
                </h3>
                <div className="space-y-4">
                  {formData.languages.map((lang, i) => (
                    <div key={i} className="flex items-end gap-4">
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <Input
                          label="Language"
                          name="name"
                          value={lang.name}
                          onChange={(e) =>
                            handleDynamicListChange("languages", i, e)
                          }
                        />
                        <Input
                          label="Proficiency"
                          name="level"
                          value={lang.level}
                          onChange={(e) =>
                            handleDynamicListChange("languages", i, e)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeListItem("languages", i)}
                        className="p-3 bg-slate-700 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-lg transition-colors flex-shrink-0"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    addListItem("languages", { name: "", level: "" })
                  }
                  className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4 gap-2"
                >
                  <FiPlus /> Add Language
                </button>
              </div>
            </FormSection>
            <FormSection title="Social Media Presence" id="social">
              <div className="space-y-4">
                {formData.socialMedia.map((account, i) => (
                  <div key={i} className="bg-slate-700/40 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label="Platform"
                        name="platform"
                        value={account.platform}
                        onChange={(e) =>
                          handleDynamicListChange("socialMedia", i, e)
                        }
                      >
                        <option>Instagram</option>
                        <option>Youtube</option>
                        <option>Tiktok</option>
                        <option>Twitter</option>
                        <option>Facebook</option>
                        <option>Linkedin</option>
                      </Select>
                      <Input
                        label="Handle"
                        name="handle"
                        value={account.handle}
                        onChange={(e) =>
                          handleDynamicListChange("socialMedia", i, e)
                        }
                        placeholder="@handle"
                      />
                      <Input
                        label="Followers"
                        name="followers"
                        type="number"
                        value={account.followers}
                        onChange={(e) =>
                          handleDynamicListChange("socialMedia", i, e)
                        }
                        placeholder="50000"
                      />
                      <Input
                        label="Profile Link"
                        name="link"
                        value={account.link}
                        onChange={(e) =>
                          handleDynamicListChange("socialMedia", i, e)
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeListItem("socialMedia", i)}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold mt-3 flex items-center gap-1"
                    >
                      <FiTrash2 size={12} /> Remove Account
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  addListItem("socialMedia", {
                    platform: "Instagram",
                    handle: "",
                    followers: 0,
                    link: "",
                  })
                }
                className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4 gap-2"
              >
                <FiPlus /> Add Social Account
              </button>
            </FormSection>
            <FormSection title="Services & Rates" id="services">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-200">
                  Standard Rates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Post Rate ($)"
                    name="postRate"
                    type="number"
                    value={formData.rates.postRate}
                    onChange={(e) => handleNestedInputChange("rates", e)}
                    placeholder="500"
                  />
                  <Input
                    label="Story Rate ($)"
                    name="storyRate"
                    type="number"
                    value={formData.rates.storyRate}
                    onChange={(e) => handleNestedInputChange("rates", e)}
                    placeholder="250"
                  />
                  <Input
                    label="Video Rate ($)"
                    name="videoRate"
                    type="number"
                    value={formData.rates.videoRate}
                    onChange={(e) => handleNestedInputChange("rates", e)}
                    placeholder="1000"
                  />
                  <Input
                    label="Collaboration Rate ($)"
                    name="collaborationRate"
                    type="number"
                    value={formData.rates.collaborationRate}
                    onChange={(e) => handleNestedInputChange("rates", e)}
                    placeholder="1500"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold my-4 text-slate-200">
                  Custom Services
                </h3>
                <div className="space-y-4">
                  {formData.services.map((service, i) => (
                    <div key={i} className="flex items-end gap-4">
                      <div className="grid grid-cols-2 gap-4 flex-grow">
                        <Input
                          label="Service Name"
                          name="name"
                          value={service.name}
                          onChange={(e) =>
                            handleDynamicListChange("services", i, e)
                          }
                        />
                        <Input
                          label="Fee ($)"
                          name="fee"
                          type="number"
                          value={service.fee}
                          onChange={(e) =>
                            handleDynamicListChange("services", i, e)
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeListItem("services", i)}
                        className="p-3 bg-slate-700 hover:bg-red-900/50 text-slate-400 hover:text-red-400 rounded-lg transition-colors flex-shrink-0"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addListItem("services", { name: "", fee: 0 })}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4 gap-2"
                >
                  <FiPlus /> Add Custom Service
                </button>
              </div>
            </FormSection>
            <FormSection title="Manage Your Portfolio" id="portfolio">
              <PortfolioManager
                existingItems={formData.portfolio}
                onDataChange={fetchProfile}
              />
            </FormSection>
          </div>
          <div className="lg:col-span-1">
            <Sidebar
              formData={formData}
              saving={saving}
              handleSubmit={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInfluencerProfilePage;

"use client";

import { useRouter } from "next/navigation";
import ProfileLayout from "@/components/ProfileLayout";
import { useState } from "react";
import { toast } from "sonner";

import {
  FiPlus,
  FiX,
  FiArrowRight,
  FiLink2,
  FiShare2,
  FiUsers,
} from "react-icons/fi";
import {
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

const socialIcons = {
  Tiktok: <FaTiktok className="text-black dark:text-white" />,
  Youtube: <FaYoutube className="text-red-600" />,
  Facebook: <FaFacebook className="text-blue-600" />,
  Twitter: <FaTwitter className="text-blue-400" />,
  Instagram: <FaInstagram className="text-pink-600" />,
  LinkedIn: <FaLinkedin className="text-blue-700" />,
  Other: <FaGlobe className="text-gray-500" />,
};

const platformOptions = [
  { value: "Tiktok", label: "TikTok" },
  { value: "Youtube", label: "YouTube" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "Twitter", label: "Twitter/X" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Other", label: "Other" },
];

const nicheOptions = [
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

export default function StepTwo() {
  const router = useRouter();
  const session = useSession();

  const [platform, setPlatform] = useState("");
  const [link, setLink] = useState("");
  const [followers, setFollowers] = useState("");
  const [socialLinks, setSocialLinks] = useState([]);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSocialLink = () => {
    if (platform && link && followers) {
      const newLinks = [
        ...socialLinks,
        {
          platform,
          link,
          followers: parseInt(followers) || 0,
        },
      ];
      setSocialLinks(newLinks);
      setPlatform("");
      setLink("");
      setFollowers("");
    }
  };

  const removeSocialLink = (index) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const handleNicheToggle = (niche) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const formatFollowers = (num) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (socialLinks.length === 0 || selectedNiches.length === 0) return;

    const dataToSend = {
      socialLinks,
      niches: selectedNiches,
    };
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/influencers/${session?.data?.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        router.push("/create-profile/step-3");
      } else {
        toast.error("Failed to submit data");
      }
      toast.success("Social profiles saved successfully");
    } catch (err) {
      toast.error("Error submitting data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProfileLayout step={2}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Social Profiles
          </h2>
          <p className="text-slate-400">
            Add your social media links and follower counts to showcase your
            audience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Add Social Link Form */}
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform
                </label>
                <select
                  title="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white"
                >
                  <option value="">Select Platform</option>
                  {platformOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Profile URL
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLink2 className="text-slate-400" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Followers
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-slate-400" />
                    </div>
                    <input
                      type="number"
                      placeholder="10000"
                      value={followers}
                      onChange={(e) => setFollowers(e.target.value)}
                      min="0"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 pl-10 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={addSocialLink}
                disabled={!platform || !link || !followers}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center disabled:bg-slate-700 disabled:text-slate-500"
              >
                <FiPlus className="mr-2" /> Add Social Profile
              </button>
            </div>
          </div>

          {/* Display Social Links */}
          <div className="space-y-3">
            {socialLinks.length > 0 ? (
              socialLinks.map((social, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-800/30 p-4 rounded-lg border border-slate-700 hover:border-indigo-500"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                      {socialIcons[social.platform] || socialIcons["Other"]}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {
                          platformOptions.find(
                            (p) => p.value === social.platform
                          )?.label
                        }
                      </p>
                      <div className="flex items-center space-x-4">
                        <a
                          href={social.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-400 hover:text-indigo-300 break-all"
                        >
                          {social.link.length > 20
                            ? `${social.link.substring(0, 20)}...`
                            : social.link}
                        </a>
                        <span className="text-sm text-slate-400 flex items-center">
                          <FiUsers className="mr-1" />{" "}
                          {formatFollowers(social.followers)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    title="remove"
                    onClick={() => removeSocialLink(index)}
                    className="text-slate-400 hover:text-red-400 p-2"
                  >
                    <FiX />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-700 rounded-lg">
                <FiShare2 className="mx-auto text-3xl text-slate-500 mb-3" />
                <p className="text-slate-400">No social profiles added yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  Add at least one platform to continue
                </p>
              </div>
            )}
          </div>

          {/* Niche Selection */}
          <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select Niches (you can choose multiple)
            </label>
            <div className="grid grid-cols-2 gap-2 capitalize">
              {nicheOptions.map((niche) => (
                <label
                  key={niche}
                  className="text-slate-300 flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    value={niche}
                    checked={selectedNiches.includes(niche)}
                    onChange={() => handleNicheToggle(niche)}
                    className="form-checkbox text-indigo-600"
                  />
                  {niche}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              socialLinks.length === 0 ||
              selectedNiches.length === 0 ||
              isSubmitting
            }
            className={`w-full py-3 px-6 rounded-lg flex items-center justify-center transition-colors ${
              socialLinks.length > 0 && selectedNiches.length > 0
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Saving..." : "Next Step"}
            <FiArrowRight className="ml-2" />
          </button>
        </form>
      </div>
    </ProfileLayout>
  );
}

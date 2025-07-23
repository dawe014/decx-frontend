"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface Location {
  city: string;
  country: string;
}

interface BasicInfo {
  fullName: string;
  location: Location;
  phone: string;
  email: string;
  bio: string;
}

interface SocialLink {
  platform: string;
  link: string;
  followers: number;
}

interface Services {
  name: string;
  fee: string;
}
interface Language {
  name: string;
  level: "Basic" | "Conversational" | "Fluent" | "Native";
}

interface ProfileData {
  basicInfo: BasicInfo;
  socialLinks: SocialLink[];
  services: Services[];
  languages: Language[];
  profileImage: String | null;

  // Add other sections as needed for future steps
  // contentDetails?: ContentDetails;
  // preferences?: Preferences;
}

interface ProfileContextType {
  profileData: ProfileData;
  updateProfileSection: (
    section: keyof ProfileData,
    data: any
  ) => Promise<void>;
  resetProfile: () => void;
  isLoading: boolean;
  error: string | null;
}

const defaultProfileData: ProfileData = {
  basicInfo: {
    fullName: "",
    location: {
      city: "",
      country: "",
    },
    phone: "",
    email: "",
    bio: "",
  },
  socialLinks: [],
  services: [],
  languages: [],
  profileImage: "",
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [profileData, setProfileData] =
    useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/influencers/${session.user.id}`);
        const data = await response.json();

        if (response.ok) {
          setProfileData(data || defaultProfileData);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Network error loading profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const updateProfileSection = async (
    section: keyof ProfileData,
    data: any
  ) => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      return;
    }

    try {
      // Optimistic UI update
      setProfileData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));

      const response = await fetch(`/api/influencers/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      // Revert optimistic update on error
      setProfileData((prev) => ({ ...prev }));
      setError(error instanceof Error ? error.message : "Update failed");
      throw error;
    }
  };

  const resetProfile = () => {
    setProfileData(defaultProfileData);
  };

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        updateProfileSection,
        resetProfile,
        isLoading,
        error,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}
export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

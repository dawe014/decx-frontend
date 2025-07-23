import { ProfileProvider } from "@/context/InfluencerProfile";

export default function RootLayout({ children }) {
  return <ProfileProvider>{children}</ProfileProvider>;
}

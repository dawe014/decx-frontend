import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SigninModal from "@/components/auth/SigninModal";
import { Alert } from "@/components/Alert";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://decx-marketing-agency-fseq.vercel.app";

    const res = await fetch(
      `${baseUrl}/api/auth/redirect-check/${session.user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch redirect path (status ${res.status})`);
    }

    const data = await res.json();

    // Validate redirect path (ensure it's relative and safe)
    if (data.redirect && data.redirect.startsWith("/")) {
      redirect(data.redirect); // This will throw NEXT_REDIRECT, which is fine
    } else {
      throw new Error("Invalid or missing redirect path");
    }
  }

  // Render login UI if no session or redirect fails
  return (
    <div>
      <SigninModal isOpen={true}>
        <GoogleSignInButton />
        <Alert />
      </SigninModal>
    </div>
  );
}

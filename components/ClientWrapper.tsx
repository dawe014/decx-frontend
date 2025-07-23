"use client";

import { useEffect } from "react";

export default function ClientWrapper() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "DECx",
      url: "https://www.decx.com",
      logo: "https://www.decx.com/logo.png",
      sameAs: [
        "https://www.facebook.com/decx",
        "https://twitter.com/decx_official",
        "https://www.instagram.com/decx_official",
      ],
    });
    document.head.appendChild(script);
  }, []);

  return null;
}

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { ScrollToTop } from "@/components/ScrollToTop";
import LandingIntro from "@/components/LandingIntro";
import { useEffect, useState } from "react";

export function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  const [checked, setChecked] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");

    if (!seen) {
      setShowIntro(true);
    }

    setChecked(true);
  }, []);

  if (!checked) return null;

  return (
    <Providers>
      <ScrollToTop />
      {showIntro && (
        <LandingIntro
          onFinish={() => {
            sessionStorage.setItem("introSeen", "true");
            setShowIntro(false);
          }}
        />
      )}

      {!showIntro && (
        <>
          {!isAdminPage && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isAdminPage && <Footer />}
        </>
      )}
    </Providers>
  );
}

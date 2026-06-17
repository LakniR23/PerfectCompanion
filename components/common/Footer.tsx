"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SubscribeForm from "@/components/common/SubscribeForm";

type FooterLink = {
  label: string;
  href: string;
  authRequired?: boolean;
};

const footerLinks: Record<string, FooterLink[]> = {
  Explore: [
    { label: "Find a Companion", href: "/find" },
    { label: "Happy Tails (Adopted)", href: "/adopted" },
    { label: "About Us", href: "/about" },
    { label: "My Profile", href: "/profile" },
  ],
  "Adopt by Pet": [
    { label: "Dogs", href: "/dogs" },
    { label: "Cats", href: "/cats" },
    { label: "Birds", href: "/birds" },
    { label: "Rabbits", href: "/rabbits" },
    { label: "Other Pets", href: "/other" },
  ],
  "Get Involved": [
    { label: "List a Pet", href: "/profile/pets/add", authRequired: true },
    { label: "Share a Story", href: "/profile/stories/add", authRequired: true },
    { label: "Manage Listings", href: "/profile/pets", authRequired: true },
  ],
};

export default function Footer() {
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  const handleLinkClick = (e: React.MouseEvent, authRequired?: boolean) => {
    if (authRequired && !user) {
      e.preventDefault();
      window.dispatchEvent(new Event("open-auth-modal"));
    }
  };

  return (
    <footer className="bg-[#2B1B22] text-white">

      {/* Newsletter */}
      <div className="bg-[#FF5C8A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/80 mb-1">
              Stay updated
            </p>
            <h3 className="text-xl font-bold">
              Get alerts when a new pet is listed
            </h3>
          </div>

          <SubscribeForm variant="footer" />
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs uppercase tracking-[0.15em] text-[#FF8FA3] mb-4">
                {heading}
              </h4>

              <ul className="space-y-2">
                {links.map(({ label, href, authRequired }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={(e) => handleLinkClick(e, authRequired)}
                      className="text-sm text-[#B58A96] hover:text-white transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between text-xs text-[#8A6672]">
          <p>© {new Date().getFullYear()} Perfect Companion</p>

          <div className="flex gap-5 mt-2 sm:mt-0">
          </div>
        </div>
      </div>
    </footer>
  );
}
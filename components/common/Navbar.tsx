"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dogs", label: "Dogs" },
  { href: "/cats", label: "Cats" },
  { href: "/birds", label: "Birds" },
  { href: "/rabbits", label: "Rabbits" },
  { href: "/other", label: "Other" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FFF7FA]/90 backdrop-blur-md border-b border-[#F3D6DF]">
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo/logo.png"
            alt="Logo"
            width={120}
            height={120}
          />

          <div className="leading-tight -ml-4">
            <span className="block font-bold text-[#2B1B22] text-base font-serif">
              Perfect
            </span>
            <span className="block text-[10px] font-semibold text-[#FF5C8A] uppercase tracking-[0.15em]">
              Companion
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="px-4 py-2 text-sm font-medium text-[#5A3B45] hover:text-[#FF5C8A] hover:bg-[#FFE4EC] rounded-lg transition"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/list-for-adoption"
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5C8A] hover:bg-[#E94C77] text-white text-sm font-semibold rounded-lg transition shadow-sm"
        >
          List for Adoption
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center text-[#5A3B45]"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#F3D6DF] bg-[#FFF7FA] px-6 py-4 flex flex-col gap-2">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 text-sm text-[#5A3B45] hover:bg-[#FFE4EC] rounded-lg"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/list-for-adoption"
            className="mt-2 px-4 py-2 bg-[#FF5C8A] text-white text-sm font-semibold rounded-lg text-center"
          >
            List for Adoption
          </Link>
        </div>
      )}
    </header>
  );
}
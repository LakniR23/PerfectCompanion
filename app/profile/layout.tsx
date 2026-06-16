"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, PawPrint, CheckCircle, BookOpen, PlusCircle, Menu, ChevronDown } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/profile", label: "Profile", icon: User, exact: true },
    { href: "/profile/pets", label: "Active Listings", icon: PawPrint, exact: true },
    { href: "/profile/pets/adopted", label: "Adopted Pets", icon: CheckCircle, exact: false },
    { href: "/profile/stories", label: "Adoption Stories", icon: BookOpen, exact: false },
    { href: "/profile/pets/add", label: "Add Pet", icon: PlusCircle, exact: false },
  ];

  return (
    <div className="min-h-screen bg-[#FFF7FA]">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Mobile Toggle */}
        <div className="lg:hidden mb-6 relative z-30">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-between w-full bg-white border border-[#F3D6DF] px-5 py-4 rounded-2xl font-bold text-[#2B1B22] shadow-sm hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <Menu className="w-5 h-5 text-[#FF5C8A]" />
              My Account Menu
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileMenuOpen ? "rotate-180" : ""}`} />
          </button>
          
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#F3D6DF] rounded-2xl p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                {links.map((link) => {
                  const isActive = link.exact
                    ? pathname === link.href
                    : pathname.startsWith(link.href);
                    
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-[#FF5C8A] text-white font-semibold"
                          : "text-[#5A3B45] hover:bg-[#FFF0F5]"
                      }`}
                    >
                      <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#FF5C8A]"}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block bg-white border border-[#F3D6DF] rounded-3xl p-6 h-fit sticky top-24">
            <h2 className="font-bold text-xl text-[#2B1B22] mb-6">
              My Account
            </h2>

            <div className="space-y-2">
              {links.map((link) => {
                const isActive = link.exact
                  ? pathname === link.href
                  : pathname.startsWith(link.href);
                  
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-[#FF5C8A] text-white font-semibold"
                        : "text-[#5A3B45] hover:bg-[#FFF0F5]"
                    }`}
                  >
                    <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#FF5C8A]"}`} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
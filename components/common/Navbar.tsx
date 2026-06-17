"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/find", label: "Find your companion" },
  { href: "/adopted", label: "Happy Tails" },
  { href: "/about", label: "About" },
];

// ── Validation helpers ──────────────────────────────────────────────────────

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v: string) => /^\d{10}$/.test(v.trim());

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500 pl-1">{msg}</p>;
}

// ── Auth Modal ──────────────────────────────────────────────────────────────

function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register-only fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Per-field validation errors
  const [regErrors, setRegErrors] = useState<RegisterErrors>({});
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});

  const handleTabSwitch = (t: "login" | "register") => {
    setTab(t);
    setServerError(null);
    setRegErrors({});
    setLoginErrors({});
  };

  // ── Register validation ────────────────────────────────────────────────

  const validateRegister = (): boolean => {
    const errs: RegisterErrors = {};

    if (!name.trim()) {
      errs.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errs.password = "Password must contain at least one letter and one number.";
    }

    if (phone && !isValidPhone(phone)) {
      errs.phone = "Phone number must contain exactly 10 digits.";
    }

    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validateRegister()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone: phone || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      onClose();
      router.push("/profile");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Login validation ───────────────────────────────────────────────────

  const validateLogin = (): boolean => {
    const errs: LoginErrors = {};

    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validateLogin()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Login failed.");
        return;
      }
      onClose();
      router.push("/profile");
      router.refresh();
    } catch {
      setServerError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input class ─────────────────────────────────────────────────

  const inputClass = (hasError?: string) =>
    `peer w-full px-4 pt-5 pb-2 rounded-xl border ${
      hasError ? "border-red-400 focus:ring-red-300" : "border-[#F3D6DF] focus:ring-[#FF5C8A]/30"
    } focus:outline-none focus:ring-2 text-sm text-[#2B1B22]`;

  const labelClass =
    "absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all \
     peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent \
     peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[92%] max-w-md rounded-3xl bg-white shadow-2xl border border-[#F3D6DF] overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b border-[#F3D6DF] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#2B1B22]">
            {tab === "login" ? "Welcome back 👋" : "Create account 🐾"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition">✕</button>
        </div>

        {/* TAB SWITCH */}
        <div className="p-5 pb-0">
          <div className="flex bg-[#FFF0F5] p-1 rounded-full">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabSwitch(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition capitalize ${
                  tab === t ? "bg-[#FF5C8A] text-white shadow" : "text-[#5A3B45]"
                }`}
              >
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>
        </div>

        {/* Server error banner */}
        {serverError && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {serverError}
          </div>
        )}

        {/* ── REGISTER FORM ── */}
        {tab === "register" && (
          <form onSubmit={handleRegister} noValidate className="p-5 space-y-4">

            {/* Full Name */}
            <div>
              <div className="relative">
                <input
                  id="reg-fullname"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setRegErrors((p) => ({ ...p, name: undefined })); }}
                  placeholder=" "
                  className={inputClass(regErrors.name)}
                />
                <label htmlFor="reg-fullname" className={labelClass}>Full Name</label>
              </div>
              <FieldError msg={regErrors.name} />
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setRegErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder=" "
                  className={inputClass(regErrors.email)}
                />
                <label htmlFor="reg-email" className={labelClass}>Email</label>
              </div>
              <FieldError msg={regErrors.email} />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setRegErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder=" "
                  className={inputClass(regErrors.password)}
                />
                <label htmlFor="reg-password" className={labelClass}>Password (min 6 characters)</label>
              </div>
              <FieldError msg={regErrors.password} />
            </div>

            {/* Phone */}
            <div>
              <div className="relative">
                <input
                  id="reg-phone"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setPhone(value);
                    setRegErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder=" "
                  maxLength={10}
                  inputMode="numeric"
                  className={inputClass(regErrors.phone)}
                />
                <label htmlFor="reg-phone" className={labelClass}>Phone (optional)</label>
              </div>
              <FieldError msg={regErrors.phone} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#FF5C8A] hover:bg-[#E94C77] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Creating account…
                </>
              ) : "Create Account"}
            </button>
          </form>
        )}

        {/* ── LOGIN FORM ── */}
        {tab === "login" && (
          <form onSubmit={handleLogin} noValidate className="p-5 space-y-4">

            {/* Email */}
            <div>
              <div className="relative">
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginErrors((p) => ({ ...p, email: undefined })); }}
                  placeholder=" "
                  className={inputClass(loginErrors.email)}
                />
                <label htmlFor="login-email" className={labelClass}>Email</label>
              </div>
              <FieldError msg={loginErrors.email} />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder=" "
                  className={inputClass(loginErrors.password)}
                />
                <label htmlFor="login-password" className={labelClass}>Password</label>
              </div>
              <FieldError msg={loginErrors.password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#FF5C8A] hover:bg-[#E94C77] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition shadow-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Navbar ──────────────────────────────────────────────────────────────────

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => { if (data.user) setUser(data.user); })
      .catch(() => {});

    const handleOpenAuth = () => setAuthOpen(true);
    window.addEventListener("open-auth-modal", handleOpenAuth);
    return () => window.removeEventListener("open-auth-modal", handleOpenAuth);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFF0F5]/95 backdrop-blur-md border-b border-[#F3D6DF]">
        <nav className="max-w-7xl mx-auto px-2 lg:px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center -gap-4">
            <Image
              src="/images/logo/logo.png"
              alt="Perfect Companion"
              width={140}
              height={140}
              className="rounded-xl object-contain"
            />
            <div className="leading-tight -ml-8">
              <span className="block text-xl font-extrabold text-[#2B1B22] tracking-tight font-serif">Perfect</span>
              <span className="block text-xl font-bold text-[#FF5C8A] uppercase tracking-[0.18em] -mt-0.5">Companion</span>
            </div>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-[#FFE4EC] group ${
                      isActive ? "text-[#FF5C8A] font-bold bg-[#FFE4EC]" : "text-[#5A3B45] hover:text-[#FF5C8A]"
                    }`}
                  >
                    {label}
                    <span className={`absolute bottom-1 left-4 right-4 h-0.5 bg-[#FF5C8A] transition-transform duration-200 rounded-full ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Profile */}
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-[#5A3B45] hover:text-[#FF5C8A] text-sm font-semibold rounded-lg hover:bg-[#FFE4EC] transition-colors duration-200"
                >
                  <span className="w-6 h-6 rounded-full bg-[#FF5C8A] text-white flex items-center justify-center text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  My Profile
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline-flex p-2 text-[#8A6672] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5C8A] hover:bg-[#E94C77] text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-sm"
              >
                List for Adoption
              </button>
            )}

            {/* Mobile toggle */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-[#5A3B45] hover:bg-[#FFE4EC] rounded-lg transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#F3D6DF] bg-[#FFF0F5] px-6 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-[#FF5C8A] bg-[#FFE4EC] font-bold" : "text-[#5A3B45] hover:text-[#FF5C8A] hover:bg-[#FFE4EC]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <div className="mt-2 pt-3 border-t border-[#F3D6DF]">
               {user ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="px-3 py-2.5 text-sm font-medium text-[#5A3B45] hover:text-[#FF5C8A] hover:bg-[#FFE4EC] rounded-lg transition-colors"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF5C8A] hover:bg-[#E94C77] text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  List for Adoption
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  );
}
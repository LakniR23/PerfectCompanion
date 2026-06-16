"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, PawPrint, CheckCircle, Loader2, CalendarDays, Mail, Phone, List } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
  _count: { pets: number };
  adoptedCount: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setUser(d.user);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-10 text-center">
        <p className="text-[#8A6672] mb-4">{error ?? "Not logged in."}</p>
        <p className="text-sm text-[#B58A96]">Please log in to view your profile.</p>
      </div>
    );
  }

  const memberYear = new Date(user.createdAt).getFullYear();
  const activeListings = user._count.pets - user.adoptedCount;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-8">
        {/* Avatar + Name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#F0A830] flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2B1B22]">{user.name}</h1>
            <p className="text-[#8A6672] text-sm mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Full Name" value={user.name} icon={<User className="w-4 h-4" />} />
          <Info label="Email" value={user.email} icon={<Mail className="w-4 h-4" />} />
          <Info label="Phone" value={user.phone ?? "—"} icon={<Phone className="w-4 h-4" />} />
          <Info
            label="Member Since"
            value={String(memberYear)}
            icon={<CalendarDays className="w-4 h-4" />}
          />
        </div>

        <Link
          href="/profile/edit"
          className="inline-flex mt-8 bg-[#FF5C8A] hover:bg-[#E94C77] text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        <StatCard
          title="Active Listings"
          value={activeListings < 0 ? 0 : activeListings}
          icon={<PawPrint className="w-6 h-6 text-[#FF5C8A]" />}
          href="/profile/pets"
        />
        <StatCard
          title="Adopted Pets"
          value={user.adoptedCount}
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          href="/profile/pets/adopted"
        />
        <StatCard
          title="Total Listings"
          value={user._count.pets}
          icon={<List className="w-6 h-6 text-[#FF5C8A]" />}
          href="/profile/pets"
        />
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <span className="mt-0.5 text-[#FF5C8A]">{icon}</span>
      )}
      <div>
        <p className="text-xs font-medium text-[#8A6672] uppercase tracking-wider">{label}</p>
        <p className="font-semibold text-[#2B1B22] mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-[#F3D6DF] rounded-3xl p-6 hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center justify-between mb-3">
        {icon}
        <span className="text-xs text-[#FF5C8A] font-medium group-hover:underline">View →</span>
      </div>
      <p className="text-3xl font-bold text-[#FF5C8A]">{value}</p>
      <p className="text-[#8A6672] mt-1 text-sm">{title}</p>
    </Link>
  );
}
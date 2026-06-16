"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setForm({
            name: d.user.name,
            email: d.user.email,
            phone: d.user.phone ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/profile"), 1000);
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#F3D6DF] rounded-3xl p-8">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#8A6672] hover:text-[#FF5C8A] mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-[#2B1B22]">Edit Profile</h1>
        <p className="text-[#8A6672] mt-2">Update your account information.</p>
      </div>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          ✓ Profile saved! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF5C8A] to-[#F0A830] flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {form.name.charAt(0).toUpperCase() || "?"}
          </div>
          <p className="text-sm text-[#8A6672]">Your avatar is auto-generated from your name initial.</p>
        </div>

        <Field
          label="Full Name"
          id="edit-name"
          type="text"
          required
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Field
          label="Email Address"
          id="edit-email"
          type="email"
          required
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label="Phone Number (optional)"
          id="edit-phone"
          type="text"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#FF5C8A] text-white font-semibold hover:bg-[#E94C77] disabled:opacity-60 transition flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="px-6 py-3 rounded-xl border border-[#F3D6DF] hover:bg-[#FFF0F5] transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="mt-10 border-t border-[#F3D6DF] pt-8">
        <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-[#8A6672] mb-4">
          Permanently delete your account and all your pet listings. This action cannot be undone.
        </p>
        <button
          onClick={async () => {
            if (confirm("Are you sure you want to delete your account? This is permanent.")) {
              try {
                const res = await fetch("/api/auth/me", { method: "DELETE" });
                if (res.ok) {
                  router.push("/");
                  router.refresh();
                } else {
                  setError("Failed to delete account.");
                }
              } catch {
                setError("Network error while deleting account.");
              }
            }
          }}
          className="px-6 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition border border-red-200"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

function Field({
  label, id, type = "text", value, onChange, required,
}: {
  label: string; id: string; type?: string;
  value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder=" "
        className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
      />
      <label htmlFor={id} className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
        {label}
      </label>
    </div>
  );
}
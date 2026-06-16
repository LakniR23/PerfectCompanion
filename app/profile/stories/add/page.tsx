"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function AddStoryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    petName: "", petType: "", location: "", story: "", imageUrl: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Provide a random fallback image if none provided for convenience in this demo
    const imgToUse = form.imageUrl.trim() || "/images/homepage/hero5.jpg";

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl: imgToUse }),
      });
      if (res.ok) {
        router.push("/profile/stories");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to create story.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#F3D6DF] rounded-3xl p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#8A6672] hover:text-[#FF5C8A] mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-bold text-[#2B1B22] mb-6">Share Adoption Story</h1>

      {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <input
            id="story-petName" required value={form.petName} onChange={e => setForm({...form, petName: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="story-petName" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Pet's Name
          </label>
        </div>
        <div className="relative">
          <input
            id="story-petType" required value={form.petType} onChange={e => setForm({...form, petType: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="story-petType" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Pet Type/Breed
          </label>
        </div>
        <div className="relative">
          <input
            id="story-location" required value={form.location} onChange={e => setForm({...form, location: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="story-location" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Location
          </label>
        </div>
        <div className="relative">
          <input
            id="story-imageUrl" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="story-imageUrl" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Image URL (Leave empty for random)
          </label>
        </div>
        <div className="relative">
          <textarea
            id="story-text" required rows={5} value={form.story} onChange={e => setForm({...form, story: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] resize-y"
          />
          <label htmlFor="story-text" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            The Story
          </label>
        </div>
        <button
          type="submit" disabled={saving}
          className="bg-[#FF5C8A] hover:bg-[#E94C77] text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Story
        </button>
      </form>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditStoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    petName: "", petType: "", location: "", story: "", imageUrl: ""
  });

  useEffect(() => {
    fetch(`/api/stories/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setForm(data);
      })
      .catch(() => setError("Failed to load story."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/profile/stories");
      } else {
        const data = await res.json();
        setError(data.error ?? "Failed to update story.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-[#FF5C8A]"/></div>;

  return (
    <div className="bg-white border border-[#F3D6DF] rounded-3xl p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#8A6672] hover:text-[#FF5C8A] mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-3xl font-bold text-[#2B1B22] mb-6">Edit Adoption Story</h1>

      {error && <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-xl text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <input
            id="edit-petName" required value={form.petName} onChange={e => setForm({...form, petName: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="edit-petName" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Pet's Name
          </label>
        </div>
        <div className="relative">
          <input
            id="edit-petType" required value={form.petType} onChange={e => setForm({...form, petType: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="edit-petType" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Pet Type/Breed
          </label>
        </div>
        <div className="relative">
          <input
            id="edit-location" required value={form.location} onChange={e => setForm({...form, location: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="edit-location" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Location
          </label>
        </div>
        <div className="relative">
          <input
            id="edit-imageUrl" required value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22]"
          />
          <label htmlFor="edit-imageUrl" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            Image URL
          </label>
        </div>
        <div className="relative">
          <textarea
            id="edit-story" required rows={5} value={form.story} onChange={e => setForm({...form, story: e.target.value})}
            placeholder=" " className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-[#F3D6DF] focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 text-[#2B1B22] resize-y"
          />
          <label htmlFor="edit-story" className="absolute left-3 -top-2 px-1 text-xs bg-white text-[#8A6672] transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#B58A96] peer-placeholder-shown:bg-transparent peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#FF5C8A] peer-focus:bg-white cursor-text">
            The Story
          </label>
        </div>
        <button
          type="submit" disabled={saving}
          className="bg-[#FF5C8A] hover:bg-[#E94C77] text-white px-8 py-3 rounded-xl font-semibold transition disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Changes
        </button>
      </form>
    </div>
  );
}

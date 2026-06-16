"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, MapPin, CheckCircle, Edit, Trash2, ArrowLeft } from "lucide-react";

type Pet = {
  id: string; name: string; species: string; breed: string | null;
  age: string | null; gender: string | null; location: string;
  description: string; adopted: boolean; createdAt: string;
  images: { id: string; imageUrl: string }[];
};

// No fallback images as per user request

export default function ProfilePetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [adopting, setAdopting] = useState(false);

  useEffect(() => {
    fetch(`/api/pets/${id}`)
      .then(async (res) => {
        const text = await res.text();
        if (!text) { setError("Empty response from server."); return; }
        const data = JSON.parse(text);
        if (data.error) setError(data.error);
        else setPet(data);
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMarkAdopted = async () => {
    if (!confirm("Mark this pet as adopted? This cannot be undone.")) return;
    setAdopting(true);
    try {
      const res = await fetch(`/api/pets/${id}/adopt`, { method: "PATCH" });
      if (res.ok) setPet((p) => p ? { ...p, adopted: true } : p);
    } finally { setAdopting(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Permanently delete this listing? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) router.push("/profile/pets");
      else setError("Failed to delete listing.");
    } finally { setDeleting(false); }
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" /></div>;
  if (error || !pet) return <div className="bg-white border border-[#F3D6DF] rounded-3xl p-10 text-center text-[#8A6672]">{error || "Pet not found."}</div>;

  const images = pet.images.map((i) => i.imageUrl);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#8A6672] hover:text-[#FF5C8A] mb-4 transition">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2B1B22]">{pet.name}</h1>
            <p className="text-[#8A6672] mt-1 capitalize">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}</p>
          </div>
          <div className="flex gap-3">
            {!pet.adopted && (
              <>
                <Link href={`/profile/pets/${pet.id}/edit`} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#F3D6DF] hover:bg-[#FFF0F5] font-semibold transition">
                  <Edit className="w-4 h-4" /> Edit
                </Link>
                <button
                  onClick={handleMarkAdopted} disabled={adopting}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FF5C8A] hover:bg-[#E94C77] disabled:opacity-60 text-white font-semibold transition"
                >
                  {adopting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Mark Adopted
                </button>
              </>
            )}
            {pet.adopted && (
              <span className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-100 text-green-700 font-semibold">
                <CheckCircle className="w-4 h-4" /> Adopted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Photos */}
      {images.length > 0 && (
        <div className="bg-white border border-[#F3D6DF] rounded-3xl p-6">
          <h2 className="font-bold text-xl text-[#2B1B22] mb-5">Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden">
                <Image src={img} alt={pet.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-6">
        <h2 className="font-bold text-xl text-[#2B1B22] mb-5">Pet Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Info label="Species" value={pet.species} />
          <Info label="Breed" value={pet.breed ?? "Mixed Breed"} />
          <Info label="Age" value={pet.age !== null ? `${pet.age} Years` : "Unknown"} />
          <Info label="Gender" value={pet.gender ?? "Unknown"} />
          <Info label="Location" value={pet.location} />
          <Info label="Status" value={pet.adopted ? "Adopted" : "Available"} />
        </div>
      </div>

      {/* Description */}
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-6">
        <h2 className="font-bold text-xl text-[#2B1B22] mb-5">Description</h2>
        <p className="text-[#5A3B45] leading-relaxed whitespace-pre-line">{pet.description}</p>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-3xl p-6">
        <h2 className="font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">Permanently remove this pet listing and all its photos.</p>
        <button
          onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold transition"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Delete Listing
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-[#8A6672] mb-1">{label}</p>
      <p className="font-semibold text-[#2B1B22] capitalize">{value}</p>
    </div>
  );
}
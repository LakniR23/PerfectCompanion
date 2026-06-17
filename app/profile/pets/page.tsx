"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, MapPin, PlusCircle, Edit, PawPrint, Trash2 } from "lucide-react";

type PetImage = { id: string; imageUrl: string };
type Pet = {
  id: string; name: string; species: string; breed: string | null;
  age: string | null; gender: string | null; location: string;
  description: string; adopted: boolean; createdAt: string;
  images: PetImage[];
};

// No fallback images as per user request

export default function MyPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adopting, setAdopting] = useState<string | null>(null);
  const [unadopting, setUnadopting] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPets = () => {
    setLoading(true);
    fetch("/api/pets/my")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setPets(d);
        else setError(d.error ?? "Could not load pets.");
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPets(); }, []);

  const handleMarkAdopted = async (id: string) => {
    if (!confirm("Mark this pet as adopted?")) return;
    setAdopting(id);
    try {
      const res = await fetch(`/api/pets/${id}/adopt`, { method: "PATCH" });
      if (res.ok) {
        setPets((prev) => prev.map((p) => p.id === id ? { ...p, adopted: true } : p));
      }
    } finally {
      setAdopting(null);
    }
  };

  const handleUnmarkAdopted = async (id: string) => {
    if (!confirm("Unmark this pet as adopted? It will be active again.")) return;
    setUnadopting(id);
    try {
      const res = await fetch(`/api/pets/${id}/unadopt`, { method: "PATCH" });
      if (res.ok) {
        setPets((prev) => prev.map((p) => p.id === id ? { ...p, adopted: false } : p));
      }
    } finally {
      setUnadopting(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/pets/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPets((prev) => prev.filter((p) => p.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  };

  const activePets = pets.filter((p) => !p.adopted);
  const adoptedPets = pets.filter((p) => p.adopted);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-[#F3D6DF] rounded-3xl p-10 text-center">
        <p className="text-[#8A6672]">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-3xl font-bold text-[#2B1B22]">My Listings</h1>
          <p className="text-[#8A6672] mt-1 text-sm">
            {activePets.length} active · {adoptedPets.length} adopted
          </p>
        </div>
        <Link
          href="/profile/pets/add"
          className="inline-flex items-center justify-center w-full sm:w-auto gap-2 bg-[#FF5C8A] hover:bg-[#E94C77] text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <PlusCircle className="w-4 h-4" /> Add Pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white border border-[#F3D6DF] rounded-3xl p-16 text-center">
          <div className="flex justify-center mb-4"><PawPrint className="w-12 h-12 text-[#FF5C8A]" /></div>
          <p className="text-[#2B1B22] font-semibold mb-2">No listings yet</p>
          <p className="text-[#8A6672] text-sm mb-6">Start by adding your first pet for adoption.</p>
          <Link
            href="/profile/pets/add"
            className="inline-flex items-center gap-2 bg-[#FF5C8A] text-white px-5 py-3 rounded-xl font-semibold"
          >
            <PlusCircle className="w-4 h-4" /> Add Your First Pet
          </Link>
        </div>
      ) : (
        <>
          {activePets.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-[#2B1B22] mb-4">Active Listings</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activePets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    adopting={adopting === pet.id}
                    deleting={deleting === pet.id}
                    onMarkAdopted={handleMarkAdopted}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {adoptedPets.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-[#2B1B22] mb-4">Adopted Pets</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {adoptedPets.map((pet) => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    unadopting={unadopting === pet.id}
                    deleting={deleting === pet.id}
                    onUnmarkAdopted={handleUnmarkAdopted}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function PetCard({
  pet, adopting, unadopting, deleting, onMarkAdopted, onUnmarkAdopted, onDelete,
}: {
  pet: Pet;
  adopting?: boolean;
  unadopting?: boolean;
  deleting?: boolean;
  onMarkAdopted?: (id: string) => void;
  onUnmarkAdopted?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const imgSrc = pet.images[0]?.imageUrl || "";

  return (
    <div className="bg-white border border-[#F3D6DF] rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        {imgSrc ? (
          <Image src={imgSrc} alt={pet.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-[#FFE4EC] flex items-center justify-center text-[#FF5C8A]">
            <PawPrint className="w-8 h-8 opacity-50" />
          </div>
        )}

        {pet.adopted && (
          <span className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Adopted
          </span>
        )}

        {/* Delete button */}
        <button
          onClick={() => onDelete?.(pet.id)}
          disabled={deleting}
          className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 disabled:opacity-60 rounded-full p-1.5 shadow transition"
        >
          {deleting
            ? <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            : <Trash2 className="w-4 h-4 text-red-500" />
          }
        </button>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-[#2B1B22]">{pet.name}</h3>
        <p className="text-sm text-[#8A6672] capitalize">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""}</p>
        <div className="flex items-center gap-1 text-xs text-[#8A6672] mt-1">
          <MapPin className="w-3 h-3 text-[#FF5C8A]" /> {pet.location}
        </div>

        {!pet.adopted && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onMarkAdopted?.(pet.id)}
              disabled={adopting}
              className="flex-1 bg-[#FF5C8A] hover:bg-[#E94C77] disabled:opacity-60 text-white py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1"
            >
              {adopting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "✓"} Mark Adopted
            </button>
            <Link
              href={`/profile/pets/${pet.id}/edit`}
              className="flex-1 border border-[#F3D6DF] hover:bg-[#FFF0F5] py-2 rounded-xl text-center text-sm font-semibold transition"
            >
              <Edit className="w-4 h-4 inline-block mr-1" /> Edit
            </Link>
          </div>
        )}

        {pet.adopted && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onUnmarkAdopted?.(pet.id)}
              disabled={unadopting}
              className="flex-1 bg-white border border-[#F3D6DF] hover:bg-[#FFF0F5] disabled:opacity-60 text-[#8A6672] py-2 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1"
            >
              {unadopting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "↺"} Undo
            </button>
            <Link
              href={`/profile/pets/${pet.id}/edit`}
              className="flex-1 border border-[#F3D6DF] hover:bg-[#FFF0F5] py-2 rounded-xl text-center text-sm font-semibold transition text-[#2B1B22]"
            >
              <Edit className="w-4 h-4 inline-block mr-1" /> Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
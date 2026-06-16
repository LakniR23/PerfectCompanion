"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, CheckCircle, Loader2 } from "lucide-react";
import AdoptedPetCard from "@/components/cards/AdoptedPetCard";

type Pet = {
  id: string; name: string; species: string; breed: string | null;
  location: string; adopted: boolean;
  images: { id: string; imageUrl: string }[];
};

// No fallback images as per user request

export default function ProfileAdoptedPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pets/my")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setPets(d.filter((p: Pet) => p.adopted));
        else setError(d.error ?? "Could not load pets.");
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, []);

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2B1B22]">Adopted Pets</h1>
          <p className="text-[#8A6672] mt-1 text-sm">Pets you have listed that found forever homes</p>
        </div>
        <span className="bg-green-100 text-green-700 font-bold text-lg px-5 py-2 rounded-2xl">
          {pets.length} total
        </span>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white border border-[#F3D6DF] rounded-3xl p-16 text-center">
          <div className="flex justify-center mb-4"><CheckCircle className="w-12 h-12 text-green-500" /></div>
          <p className="text-[#2B1B22] font-semibold mb-2">No adopted pets yet</p>
          <p className="text-[#8A6672] text-sm">Once you mark a listing as adopted it will appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet) => {
            const img = pet.images[0]?.imageUrl || "";
            return (
              <AdoptedPetCard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                breed={pet.breed}
                location={pet.location}
                image={img}
                href={`/profile/pets/${pet.id}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
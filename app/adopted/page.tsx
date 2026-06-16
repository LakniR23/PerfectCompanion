"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2, PawPrint } from "lucide-react";
import AdoptedPetCard from "@/components/cards/AdoptedPetCard";

type AdoptedPet = {
  id: string;
  name: string;
  breed: string | null;
  species: string;
  location: string;
  images: { imageUrl: string }[];
  owner: { name: string };
};

export default function AdoptedPetsPage() {
  const [pets, setPets] = useState<AdoptedPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pets?adopted=true")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPets(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7FA]">

      {/* Hero */}
      <section className="border-b border-[#F3D6DF] bg-[#FFE4EC]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#E11D48] text-sm font-semibold mb-4">
                <CheckCircle className="w-4 h-4" />
                Happy Endings
              </span>
              <h1 className="text-4xl font-bold text-[#2B1B22]">Successfully Adopted Pets</h1>
              <p className="text-[#5A3B45] mt-3 max-w-2xl">
                Celebrate the animals that found loving homes through our adoption community.
              </p>
            </div>

            <div className="bg-white px-6 py-4 rounded-2xl border border-[#F3D6DF]">
              <p className="text-xs uppercase tracking-wider text-[#8A6672]">Total Adoptions</p>
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#FF5C8A] mt-1" />
              ) : (
                <p className="text-3xl font-bold text-[#FF5C8A]">{pets.length}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
          </div>
        ) : pets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PawPrint className="w-10 h-10 text-[#FBCFE8] mb-3" />
            <p className="text-[#8A6672] font-medium">No adopted pets yet.</p>
            <p className="text-sm text-[#B09080] mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map((pet) => (
              <AdoptedPetCard
                key={pet.id}
                id={pet.id}
                name={pet.name}
                breed={pet.breed ?? pet.species}
                location={pet.location}
                owner={pet.owner?.name ?? "Unknown"}
                image={pet.images?.[0]?.imageUrl ?? ""}
                href={`/pets/${pet.id}`}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
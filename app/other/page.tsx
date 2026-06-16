"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BrowsePetCard from "@/components/cards/BrowsePetCard";

import { api, type ApiPet } from "@/lib/api";
import { ALL_PETS, LOCATIONS, AGE_GROUPS, GENDERS } from "@/data/pets";
import type { DisplayPet } from "@/types/pet";

const SPECIES   = "other" as const;
const LABEL     = "Other Pets";
const EMOJI     = "🐾";
const DESC      = "Unique companions — hamsters, guinea pigs & more — in Sri Lanka";
const HEADER_BG = "#FFF8F2";
const ACCENT    = "#C4630A";
const TAG_BG    = "#FFF8F2";
const TAG_TEXT  = "#C4630A";
// No fallback images as per user request

function getAgeGroup(age: string | null): DisplayPet["ageGroup"] {
  if (!age) return "Young";
  const lower = age.toLowerCase();
  if (lower.includes("month") || lower.includes("week") || lower.includes("day")) return "Baby";
  const num = parseInt(lower);
  if (isNaN(num)) return "Young";
  if (num <= 2) return "Young";
  if (num <= 7) return "Adult";
  return "Senior";
}

function apiToDisplay(pet: ApiPet): DisplayPet {
  return {
    id: pet.id, name: pet.name, species: pet.species,
    breed: pet.breed ?? "Mixed",
    ageLabel: pet.age || "Unknown",
    ageGroup: getAgeGroup(pet.age),
    location: pet.location, gender: pet.gender ?? "Unknown",
    tag: "Available", tagBg: TAG_BG, tagText: TAG_TEXT,
    img: pet.images?.[0]?.imageUrl || "",
    adopted: pet.adopted, isApiPet: true,
  };
}

function mockToDisplay(pet: (typeof ALL_PETS)[number]): DisplayPet {
  return {
    ...pet,
    ageLabel: pet.age,
    isApiPet: false,
    adopted: false,
  };
}


function Select({ value, setValue, options }: { value: string; setValue: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={(e) => setValue(e.target.value)} className="border px-3 py-2 rounded-xl text-sm bg-white">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function OtherPage() {
  const [search, setSearch] = useState("");
  const [ageGroup, setAgeGroup] = useState("All ages");
  const [location, setLocation] = useState("All locations");
  const [gender, setGender] = useState("Any gender");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [apiPets, setApiPets] = useState<DisplayPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.pets.list({ species: SPECIES, adopted: false })
      .then((res) => setApiPets(res.map(apiToDisplay)))
      .catch(() => setApiPets([]))
      .finally(() => setLoading(false));
  }, []);

  const allPets = useMemo(() => {
    const mock = ALL_PETS.filter((p) => p.species === SPECIES).map(mockToDisplay);
    return [...apiPets, ...mock];
  }, [apiPets]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allPets.filter((p) => {
      if (ageGroup !== "All ages" && p.ageGroup !== ageGroup) return false;
      if (location !== "All locations" && p.location !== location) return false;
      if (gender !== "Any gender" && p.gender !== gender) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.breed.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allPets, search, ageGroup, location, gender]);

  const activeFilters = (ageGroup !== "All ages" ? 1 : 0) + (location !== "All locations" ? 1 : 0) + (gender !== "Any gender" ? 1 : 0);

  function clearFilters() { setAgeGroup("All ages"); setLocation("All locations"); setGender("Any gender"); setSearch(""); }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FA]">
      <div className="border-b border-[#F0D9C8]" style={{ background: HEADER_BG }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-end">
          <div>
            <span className="text-3xl">{EMOJI}</span>
            <h1 className="text-4xl font-bold font-serif text-[#2B1B22] mt-1">{LABEL}</h1>
            <p className="text-sm text-[#5A3B45] mt-1">{DESC}</p>
          </div>
          <div className="text-right">
            {loading ? <Loader2 className="animate-spin w-6 h-6" style={{ color: ACCENT }} /> : (
              <>
                <p className="text-3xl font-bold" style={{ color: ACCENT }}>{filtered.length}</p>
                <p className="text-xs uppercase text-[#8A6672]">available pets</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-[#FFF7FA]/95 backdrop-blur border-b border-[#F0D9C8]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-white border border-[#F0D9C8] rounded-xl px-3">
            <Search className="w-4 h-4 text-[#B09080]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search other pets..." className="w-full px-2 py-2 text-sm bg-transparent outline-none" />
            {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <div className="hidden sm:flex gap-2">
            <Select value={ageGroup} setValue={setAgeGroup} options={AGE_GROUPS} />
            <Select value={location} setValue={setLocation} options={LOCATIONS} />
            <Select value={gender}   setValue={setGender}   options={GENDERS} />
            {activeFilters > 0 && <button onClick={clearFilters} className="text-sm font-semibold" style={{ color: ACCENT }}>Clear</button>}
          </div>
          <button className="sm:hidden flex items-center gap-2 border px-3 py-2 rounded-xl bg-white text-sm" onClick={() => setFiltersOpen(!filtersOpen)}>
            <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilters > 0 && `(${activeFilters})`}
          </button>
        </div>
        {filtersOpen && (
          <div className="sm:hidden px-6 pb-4 flex flex-wrap gap-2">
            <Select value={ageGroup} setValue={setAgeGroup} options={AGE_GROUPS} />
            <Select value={location} setValue={setLocation} options={LOCATIONS} />
            <Select value={gender}   setValue={setGender}   options={GENDERS} />
          </div>
        )}
      </div>

      <main className="flex-1 max-w-7xl px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin w-8 h-8" style={{ color: ACCENT }} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">{EMOJI}</span>
            <p className="text-lg font-bold text-[#2B1B22] mb-1">No pets found</p>
            <p className="text-sm text-[#8A6672] mb-6">Try adjusting your filters.</p>
            <button onClick={clearFilters} className="px-5 py-2.5 text-white text-sm font-semibold rounded-xl" style={{ background: ACCENT }}>Clear all filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">Showing <b>{filtered.length}</b> pets</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((pet) => <BrowsePetCard key={`${pet.isApiPet ? "api" : "mock"}-${pet.id}`} pet={pet} />)}
            </div>
          </>
        )}
      </main>


    </div>
  );
}

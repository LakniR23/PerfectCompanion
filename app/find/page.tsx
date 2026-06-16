"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

import BrowsePetCard from "@/components/cards/BrowsePetCard";
import { api, type ApiPet } from "@/lib/api";
import type { DisplayPet } from "@/types/pet";

/* ─────────────────────────────
   CONSTANTS
───────────────────────────── */

const LOCATIONS = [
  "All locations",
  "Ampara", "Anuradhapura", "Badulla", "Batticaloa",
  "Colombo", "Galle", "Gampaha", "Hambantota",
  "Jaffna", "Kalutara", "Kandy", "Kegalle",
  "Kilinochchi", "Kurunegala", "Mannar", "Matale",
  "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya",
  "Polonnaruwa", "Puttalam", "Ratnapura",
  "Trincomalee", "Vavuniya",
];

const AGE_GROUPS = ["All ages", "Baby", "Young", "Adult", "Senior"];
const GENDERS    = ["Any gender", "Male", "Female"];
const SPECIES    = ["All animals", "Dogs", "Cats", "Birds", "Rabbits"];

/* ─────────────────────────────
   HELPERS
───────────────────────────── */

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
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "Mixed",
    ageLabel: pet.age || "Unknown",
    ageGroup: getAgeGroup(pet.age),
    location: pet.location,
    gender: pet.gender ?? "Unknown",
    tag: "Available",
    tagBg: "#FFE4E6",
    tagText: "#BE123C",
    img: pet.images?.[0]?.imageUrl ?? "",
    adopted: pet.adopted,
    isApiPet: true,
  };
}

/* ─────────────────────────────
   PAGE
───────────────────────────── */

export default function FindPage() {
  const [search,   setSearch]   = useState("");
  const [ageGroup, setAgeGroup] = useState("All ages");
  const [location, setLocation] = useState("All locations");
  const [gender,   setGender]   = useState("Any gender");
  const [species,  setSpecies]  = useState("All animals");

  const [filtersOpen, setFiltersOpen] = useState(false);

  const [apiPets, setApiPets] = useState<DisplayPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.pets
      .list({ adopted: false })
      .then((res) => setApiPets(res.map(apiToDisplay)))
      .catch(() => setApiPets([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return apiPets.filter((p) => {
      if (species !== "All animals" && p.species !== species.toLowerCase()) return false;
      if (ageGroup !== "All ages" && p.ageGroup !== ageGroup)               return false;
      if (location !== "All locations" && p.location !== location)           return false;
      if (gender !== "Any gender" && p.gender !== gender)                   return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.breed.toLowerCase().includes(q) &&
        !p.location.toLowerCase().includes(q)
      ) return false;
      return true;
    });
  }, [apiPets, search, ageGroup, location, gender, species]);

  const activeFilters =
    (ageGroup !== "All ages"       ? 1 : 0) +
    (location !== "All locations"  ? 1 : 0) +
    (gender   !== "Any gender"     ? 1 : 0) +
    (species  !== "All animals"    ? 1 : 0);

  function clearFilters() {
    setAgeGroup("All ages");
    setLocation("All locations");
    setGender("Any gender");
    setSpecies("All animals");
    setSearch("");
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF7FA]">

      {/* HEADER */}
      <div className="border-b bg-[#FFE4EC] border-[#F3D6DF]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold font-serif">Find Animals</h1>
            <p className="text-sm text-[#5A3B45] mt-1">
              Discover pets from all species across Sri Lanka
            </p>
          </div>

          <div className="text-right">
            {loading ? (
              <Loader2 className="animate-spin w-6 h-6 text-[#FF5C8A]" />
            ) : (
              <>
                <p className="text-3xl font-bold text-[#E11D48]">{filtered.length}</p>
                <p className="text-xs uppercase text-[#8A6672]">available pets</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="sticky top-16 z-30 bg-[#FFF7FA]/90 backdrop-blur-md border-b border-[#F3D6DF] shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">

          {/* Search */}
          <div className="flex-1 flex items-center bg-white border border-[#F3D6DF] rounded-2xl px-4 py-0.5 shadow-sm focus-within:border-[#B09080] focus-within:ring-2 focus-within:ring-[#B09080]/10 transition-all duration-200 group">
            <Search className="w-5 h-5 text-[#B09080] group-focus-within:scale-105 transition-transform duration-200" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search animals..."
              className="w-full px-3 py-2.5 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-2.5 flex-wrap">
            <Select value={species}  setValue={setSpecies}  options={SPECIES}    />
            <Select value={ageGroup} setValue={setAgeGroup} options={AGE_GROUPS} />
            <Select value={location} setValue={setLocation} options={LOCATIONS}  />
            <Select value={gender}   setValue={setGender}   options={GENDERS}    />
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium text-sm transition-all duration-200 active:scale-95"
              >
                Clear
              </button>
            )}
          </div>

          {/* Mobile Toggle & Clear */}
          <div className="flex sm:hidden gap-2 w-full">
            <button
              className={`flex-1 flex items-center justify-center gap-2 border px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95 ${
                filtersOpen
                  ? "bg-[#B09080] border-[#B09080] text-white shadow-md"
                  : "bg-white border-[#F3D6DF] text-gray-700 shadow-sm hover:bg-gray-50"
              }`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFilters > 0 && (
                <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${filtersOpen ? "bg-white text-[#B09080]" : "bg-pink-100 text-pink-600"}`}>
                  {activeFilters}
                </span>
              )}
            </button>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 rounded-2xl bg-pink-50 border border-pink-200 hover:bg-pink-100 text-pink-600 font-medium text-sm transition-all duration-200 active:scale-95"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        {filtersOpen && (
          <div className="sm:hidden grid grid-cols-2 gap-2.5 px-6 pb-5 pt-1 bg-white border-b border-[#F3D6DF]">
            <Select value={species}  setValue={setSpecies}  options={SPECIES}    />
            <Select value={ageGroup} setValue={setAgeGroup} options={AGE_GROUPS} />
            <Select value={location} setValue={setLocation} options={LOCATIONS}  />
            <Select value={gender}   setValue={setGender}   options={GENDERS}    />
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="col-span-2 mt-2 px-4 py-2.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-medium text-sm transition-all duration-200 active:scale-95"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin w-8 h-8 text-[#FF5C8A]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-2xl mb-2">🐾</p>
            <p className="text-gray-500 font-medium">No animals found.</p>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-pink-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((pet) => (
              <BrowsePetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ─────────────────────────────
   SELECT
───────────────────────────── */

function Select({
  value, setValue, options,
}: {
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="px-3 py-2 rounded-xl text-sm bg-white border border-[#F3D6DF] text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#B09080]/20 focus:border-[#B09080] transition-all duration-200"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}
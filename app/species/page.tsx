import { useState, useMemo, useEffect } from "react";
import { useRoute } from "wouter";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BrowsePetCard from "@/components/cards/BrowsePetCard";
import { ALL_PETS, SPECIES_META, LOCATIONS, AGE_GROUPS, GENDERS } from "@/data/pets";
import { api, type ApiPet } from "@/lib/api";
import NotFound from "@/pages/not-found";
import type { DisplayPet } from "@/types/pets";

type Species = keyof typeof SPECIES_META;

function getAgeGroup(age: string | null): "Baby" | "Young" | "Adult" | "Senior" {
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
  const speciesColors: Record<string, { tagBg: string; tagText: string }> = {
    dogs: { tagBg: "#FFE4E6", tagText: "#BE123C" },
    cats: { tagBg: "#FCE7F3", tagText: "#C4630A" },
    birds: { tagBg: "#EAF3ED", tagText: "#3A7A50" },
    rabbits: { tagBg: "#FBCFE8", tagText: "#A04040" },
    other: { tagBg: "#FFF8F2", tagText: "#C4630A" },
  };
  // No fallback images as per user request
  const colors = speciesColors[pet.species] ?? speciesColors.dogs;
  const img = pet.images?.length > 0 ? pet.images[0].imageUrl : "";
  const ageLabel = pet.age || "Unknown";

  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "Mixed",
    ageLabel,
    ageGroup: getAgeGroup(pet.age),
    location: pet.location,
    tag: "New",
    tagBg: colors.tagBg,
    tagText: colors.tagText,
    img,
    gender: pet.gender ?? "Unknown",
    adopted: pet.adopted,
    isApiPet: true,
    ownerName: pet.owner?.name,
    ownerPhone: pet.owner?.phone ?? undefined,
    description: pet.description,
    ownerId: pet.owner?.id,
  };
}

function mockToDisplay(pet: (typeof ALL_PETS)[number]): DisplayPet {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    ageLabel: pet.age,
    ageGroup: pet.ageGroup,
    location: pet.location,
    tag: pet.tag,
    tagBg: pet.tagBg,
    tagText: pet.tagText,
    img: pet.img,
    gender: pet.gender,
    adopted: false,
    isApiPet: false,
  };
}

export default function SpeciesPage() {
  const [, params] = useRoute("/:species");
  const species = params?.species as Species;

  const [search, setSearch] = useState("");
  const [ageGroup, setAgeGroup] = useState("All ages");
  const [location, setLocation] = useState("All locations");
  const [gender, setGender] = useState("Any gender");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [apiPets, setApiPets] = useState<DisplayPet[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  const meta = SPECIES_META[species];

  useEffect(() => {
    if (!meta) return;
    setApiLoading(true);
    api.pets
      .list({ species, adopted: false })
      .then((pets) => setApiPets(pets.map(apiToDisplay)))
      .catch(() => setApiPets([]))
      .finally(() => setApiLoading(false));
  }, [species]);

  if (!meta) return <NotFound />;

  const mockPets = ALL_PETS.filter((p) => p.species === species).map(mockToDisplay);
  const allPets = [...apiPets, ...mockPets];

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

  const activeFilterCount = [
    ageGroup !== "All ages",
    location !== "All locations",
    gender !== "Any gender",
  ].filter(Boolean).length;

  function clearFilters() {
    setAgeGroup("All ages");
    setLocation("All locations");
    setGender("Any gender");
    setSearch("");
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FFF7FA" }}>
      <Navbar />

      {/* Page header */}
      <section className="border-b border-[#F3D6DF]" style={{ background: meta.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-3xl">{meta.emoji}</span>
            <h1
              className="text-3xl sm:text-4xl font-bold mt-1 font-serif"
              style={{ color: "#2B1B22", fontFamily: "'Georgia', serif" }}
            >
              {meta.label}
            </h1>
            <p className="text-sm mt-1 max-w-sm" style={{ color: "#5A3B45" }}>
              {meta.description}
            </p>
          </div>
          <div className="text-right shrink-0">
            {apiLoading ? (
              <Loader2 className="w-6 h-6 animate-spin ml-auto" style={{ color: meta.color }} />
            ) : (
              <>
                <p className="text-3xl font-bold font-serif" style={{ color: meta.color, fontFamily: "'Georgia', serif" }}>
                  {filtered.length}
                </p>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8A6672" }}>
                  {filtered.length === 1 ? "animal" : "animals"} available
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Search + filter bar */}
      <div className="sticky top-16 z-30 bg-[#FFF7FA]/95 backdrop-blur-md border-b border-[#F3D6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center bg-white border border-[#F3D6DF] rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#FF5C8A]/30 focus-within:border-[#FF5C8A]">
            <Search className="w-4 h-4 ml-3.5 text-[#B09080] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder={`Search ${meta.label.toLowerCase()} by name, breed, or city…`}
              className="flex-1 px-3 py-2.5 text-sm text-[#2B1B22] placeholder:text-[#B09080] bg-transparent focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="mr-2 text-[#B09080] hover:text-[#5A3B45]">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <FilterSelect value={ageGroup} onChange={setAgeGroup} options={AGE_GROUPS} />
            <FilterSelect value={location} onChange={setLocation} options={LOCATIONS} />
            <FilterSelect value={gender} onChange={setGender} options={GENDERS} />
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#E11D48] font-semibold hover:underline underline-offset-2 px-1"
              >
                Clear
              </button>
            )}
          </div>

          <button
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 border border-[#F3D6DF] rounded-xl bg-white text-sm font-medium text-[#5A3B45] hover:bg-[#FFE4EC] transition"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-[#FF5C8A] text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="sm:hidden border-t border-[#F3D6DF] bg-[#FFF7FA] px-4 pb-4 pt-3 flex flex-wrap gap-3">
            <FilterSelect value={ageGroup} onChange={setAgeGroup} options={AGE_GROUPS} />
            <FilterSelect value={location} onChange={setLocation} options={LOCATIONS} />
            <FilterSelect value={gender} onChange={setGender} options={GENDERS} />
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-[#E11D48] font-semibold hover:underline">
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10 w-full">
        {apiLoading && apiPets.length === 0 ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <>
            <p className="text-xs text-[#8A6672] font-medium mb-6">
              Showing <span className="font-bold text-[#2B1B22]">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "animal" : "animals"}
              {(search || activeFilterCount > 0) && " matching your search"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filtered.map((pet) => (
                <BrowsePetCard key={`${pet.isApiPet ? "api" : "mock"}-${pet.id}`} pet={pet} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function FilterSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const isActive = value !== options[0];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#FF5C8A]/30 transition cursor-pointer"
      style={{
        background: isActive ? "#FFE4EC" : "white",
        borderColor: isActive ? "#FF5C8A" : "#F3D6DF",
        color: isActive ? "#BE123C" : "#5A3B45",
        fontWeight: isActive ? 600 : 400,
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4">🐾</span>
      <h3 className="text-lg font-bold text-[#2B1B22] mb-1">No animals found</h3>
      <p className="text-sm text-[#8A6672] mb-6 max-w-xs">
        Try adjusting your search or filters to find more animals available for adoption.
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-[#FF5C8A] hover:bg-[#E94C77] text-white text-sm font-semibold rounded-xl transition"
      >
        Clear all filters
      </button>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SubscribeForm from "@/components/common/SubscribeForm";
import {
  Search, Heart, Home, Loader2, ArrowRight, Quote,
  Mail, Sparkles, PawPrint, Star, ChevronLeft, ChevronRight,
} from "lucide-react";
import StepCard from "@/components/cards/StepCard";
import BrowsePetCard from "@/components/cards/BrowsePetCard";
import { api, type ApiPet } from "@/lib/api";
import type { DisplayPet } from "@/types/pet";

// ── Types ─────────────────────────────────────────────────────────────────────

type Story = {
  id: string;
  name: string;
  petName: string;
  petType: string;
  image: string;
  story: string;
  adopter: string;
  location: string;
};

type AdoptedPet = {
  id: string;
  name: string;
  breed: string | null;
  species: string;
  images: { imageUrl: string }[];
  createdAt: string;
};

type Stats = {
  total: number;
  adopted: number;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { step: "01", title: "Browse Pets",     desc: "Explore adorable pets looking for a forever home." },
  { step: "02", title: "Connect",         desc: "Reach out to the owner and arrange a meet-and-greet." },
  { step: "03", title: "Bring Them Home", desc: "Complete the adoption and welcome your new companion." },
];

const TAG_COLORS: Record<string, { tagBg: string; tagText: string }> = {
  dogs:    { tagBg: "#FFE4E6", tagText: "#BE123C" },
  cats:    { tagBg: "#FCE7F3", tagText: "#C4630A" },
  birds:   { tagBg: "#EAF3ED", tagText: "#3A7A50" },
  rabbits: { tagBg: "#FBCFE8", tagText: "#A04040" },
  other:   { tagBg: "#FFF8F2", tagText: "#C4630A" },
};

function apiToFeatured(pet: ApiPet): DisplayPet {
  const colors = TAG_COLORS[pet.species] ?? TAG_COLORS.dogs;
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "Mixed",
    ageLabel: pet.age || "Unknown",
    ageGroup: (() => {
      if (!pet.age) return "Young";
      const lower = pet.age.toLowerCase();
      if (lower.includes("month") || lower.includes("week") || lower.includes("day")) return "Baby";
      const num = parseInt(lower);
      if (isNaN(num)) return "Young";
      if (num <= 2) return "Young";
      if (num <= 7) return "Adult";
      return "Senior";
    })(),
    location: pet.location,
    gender: pet.gender ?? "Unknown",
    tag: "",
    tagBg: colors.tagBg,
    tagText: colors.tagText,
    img: pet.images?.[0]?.imageUrl ?? "",
    adopted: pet.adopted,
    isApiPet: true,
  };
}

// ── Paw Divider ───────────────────────────────────────────────────────────────

function PawDivider() {
  return (
    <div className="flex items-center gap-3 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FBCFE8] to-transparent" />
      <span className="text-xl opacity-60">🐾</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#FBCFE8] to-transparent" />
    </div>
  );
}

// ── Stats Banner ──────────────────────────────────────────────────────────────

function StatsBanner() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    // Fetch total and adopted counts in parallel
    Promise.all([
      fetch("/api/pets").then((r) => r.json()),
      fetch("/api/pets?adopted=true").then((r) => r.json()),
    ])
      .then(([all, adopted]) => {
        setStats({
          total: Array.isArray(all) ? all.length : 0,
          adopted: Array.isArray(adopted) ? adopted.length : 0,
        });
      })
      .catch(() => {});
  }, []);

  const items = stats
    ? [
        { value: `${stats.total}+`,   icon: "🐾", label: "Pets Listed",     sublabel: "And growing every day" },
        { value: `${stats.adopted}+`, icon: "❤️", label: "Happy Adoptions", sublabel: "Loving their new companions" },
      ]
    : null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#E11D48] to-[#F0A830] py-8 my-6 rounded-2xl mx-6 lg:mx-10 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {!items ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-white/70" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            {items.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">{item.value}</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white text-lg md:text-xl font-semibold">{item.label}</div>
                    <div className="text-white/70 text-xs mt-0.5">{item.sublabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Artistic Hero Collage ─────────────────────────────────────────────────────

function ArtisticHeroCollage() {
  return (
    <div className="relative hidden lg:block h-[550px]">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#FFE4E6] opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#FBCFE8] opacity-40 blur-2xl" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 z-20">
        <Image src="/images/homepage/hero5.jpg" alt="Featured pet" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <div className="absolute top-0 left-10 w-48 h-48 rounded-2xl overflow-hidden shadow-xl rotate-[-8deg] hover:rotate-0 transition-all duration-500 z-10 border-4 border-white">
        <Image src="/images/homepage/hero6.jpg" alt="Pet" fill className="object-cover" />
      </div>
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full overflow-hidden shadow-xl rotate-[12deg] hover:rotate-0 transition-all duration-500 z-10 border-4 border-white">
        <Image src="/images/homepage/parrot.jpg" alt="Pet" fill className="object-cover" />
      </div>
      <div className="absolute bottom-10 left-20 w-36 h-36 rounded-2xl overflow-hidden shadow-xl rotate-[-5deg] hover:rotate-0 transition-all duration-500 z-10 border-4 border-white">
        <Image src="/images/homepage/rabbit.png" alt="Pet" fill className="object-cover" />
      </div>
      <div className="absolute bottom-32 right-16 w-44 h-44 rounded-full overflow-hidden shadow-xl rotate-[6deg] hover:rotate-0 transition-all duration-500 z-10 border-4 border-white">
        <Image src="/images/homepage/cat.jpg" alt="Pet" fill className="object-cover" />
      </div>
      <div className="absolute top-1/2 -left-8 w-32 h-32 rounded-2xl overflow-hidden shadow-xl rotate-[15deg] hover:rotate-0 transition-all duration-500 z-10 border-4 border-white opacity-80">
        <Image src="/images/homepage/hero7.jpg" alt="Pet" fill className="object-cover" />
      </div>
      <div className="absolute bottom-0 right-1/3 w-28 h-28 rounded-full overflow-hidden shadow-xl rotate-[-10deg] hover:rotate-0 transition-all duration-500 z-10 border-4 border-white bg-white">
        <Image src="/images/homepage/hamster.jpg" alt="Pet" fill className="object-cover" />
      </div>
      <div className="absolute top-1/4 right-1/4 animate-bounce-slow">
        <PawPrint className="w-6 h-6 text-[#F0A830] opacity-40" />
      </div>
      <div className="absolute bottom-1/3 left-1/4 animate-pulse-slow">
        <Heart className="w-5 h-5 text-[#E11D48] opacity-50 fill-[#E11D48]" />
      </div>
      <div className="absolute top-1/3 right-1/3 animate-spin-slow">
        <Star className="w-4 h-4 text-[#F0A830] opacity-40 fill-[#F0A830]" />
      </div>
    </div>
  );
}

// ── Adoption Stories ──────────────────────────────────────────────────────────

function AdoptionStoriesFeatured() {
  const [activeStory, setActiveStory] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("/api/stories?limit=5")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStories(data.map((s) => ({
            id: s.id,
            name: s.petName,
            petName: s.petName,
            petType: s.petType,
            image: s.imageUrl,
            story: s.story,
            adopter: s.user?.name ?? "Happy Adopter",
            location: s.location,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAutoPlaying && stories.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setActiveStory((prev) => (prev + 1) % stories.length);
      }, 5000);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [isAutoPlaying, stories.length]);

  const handleStoryClick = (idx: number) => {
    setActiveStory(idx);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-3">
          <Sparkles className="w-6 h-6 text-[#F0A830]" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A830] mb-2">Real Stories</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#3D1F0F] font-serif">Lives Changed by Adoption</h2>
        <p className="text-[#7A5544] mt-3 max-w-2xl mx-auto">
          Hear from families who found their perfect companion through our platform.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => handleStoryClick(idx)}
              className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ${
                activeStory === idx
                  ? "bg-white shadow-lg border-l-4 border-[#E11D48]"
                  : "bg-white/50 hover:bg-white hover:shadow-md"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={story.image} alt={story.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#3D1F0F]">{story.name}</h3>
                  <p className="text-sm text-[#7A5544]">{story.petType} • {story.location}</p>
                </div>
                <Quote className={`w-5 h-5 ${activeStory === idx ? "text-[#E11D48]" : "text-[#FBCFE8]"}`} />
              </div>
              {activeStory === idx && (
                <p className="mt-3 text-[#3D1F0F]/80 text-sm pl-[72px] animate-fadeIn">
                  {story.story}
                </p>
              )}
            </button>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
          {stories[activeStory]?.image ? (
            <Image
              src={stories[activeStory].image}
              alt={stories[activeStory].name}
              fill
              className="object-cover transition-transform duration-700 scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[#FFE4EC] flex items-center justify-center">
              <PawPrint className="w-16 h-16 text-[#FF5C8A] opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-sm font-semibold">❤️ Happy Tail</p>
            <p className="text-lg font-bold">{stories[activeStory]?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {stories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleStoryClick(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeStory === idx ? "w-8 bg-[#E11D48]" : "w-2 bg-[#FBCFE8]"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #FBCFE8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E11D48; border-radius: 10px; }
      `}</style>
    </section>
  );
}

// ── Recently Adopted Carousel ─────────────────────────────────────────────────

function RecentlyAdoptedCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [pets, setPets] = useState<AdoptedPet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pets?adopted=true&limit=12")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setPets(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isHovered || pets.length < 4) return;
    if (!container || isHovered || pets.length === 0) return;

    const scroll = () => {
      if (container && !isHovered) {
        if (container.scrollLeft <= 1) {
          container.scrollLeft = container.scrollWidth / 2;
        } else {
          container.scrollLeft -= 1.5;
        }
      }
      animationRef.current = requestAnimationFrame(scroll);
    };

    container.scrollLeft = container.scrollWidth / 2;
    animationRef.current = requestAnimationFrame(scroll);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isHovered, pets]);

  const scrollBy = (direction: "left" | "right") => {
    scrollContainerRef.current?.scrollBy({
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  // Triple for infinite loop
  const loopedPets = pets.length >= 4 ? [...pets, ...pets, ...pets] : pets;

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF5C8A]" />
        </div>
      </section>
    );
  }

  if (pets.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 sm:gap-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A830] mb-1.5">
              Happy Endings
            </p>
            <h2 className="text-3xl font-bold text-[#3D1F0F] font-serif">Recently Adopted</h2>
            <p className="text-[#7A5544] mt-1">These lucky pets have already found their forever homes.</p>
          </div>
          <Link
            href="/success-stories"
            className="text-sm text-[#E11D48] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
          >
            Share your story <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => scrollBy("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all -ml-4"
          >
            <ChevronLeft className="w-5 h-5 text-[#E11D48]" />
          </button>
          <button
            onClick={() => scrollBy("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all -mr-4"
          >
            <ChevronRight className="w-5 h-5 text-[#E11D48]" />
          </button>

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex gap-5 pb-4" style={{ width: "max-content" }}>
              {loopedPets.map((pet, i) => {
                const imgSrc = pet.images?.[0]?.imageUrl || "";
                return (
                  <div
                    key={`${pet.id}-${i}`}
                    className="w-64 flex-shrink-0 group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-square">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={pet.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FFE4EC] flex items-center justify-center">
                          <PawPrint className="w-10 h-10 text-[#FF5C8A] opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <p className="font-bold text-lg">{pet.name}</p>
                        <p className="text-xs opacity-90">{pet.breed ?? pet.species}</p>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <span className="text-xs text-[#E11D48] font-medium bg-[#FFE4E6] px-2 py-0.5 rounded-full">
                        ✓ Adopted
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

// ── Newsletter ────────────────────────────────────────────────────────────────

function Newsletter() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <div className="bg-gradient-to-br from-[#FFE4EC] to-[#FBCFE8] rounded-3xl p-8 md:p-10 text-center">
          <Mail className="w-10 h-10 text-[#E11D48] mx-auto mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold text-[#3D1F0F] font-serif mb-3">
            Stay updated with new pets
          </h3>
          <p className="text-[#7A5544] mb-6 max-w-md mx-auto">
            Get notified when new pets arrive and receive adoption tips straight to your inbox.
          </p>
          <SubscribeForm variant="home" />
          <p className="text-xs text-[#7A5544] mt-4">No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [featuredPets, setFeaturedPets] = useState<DisplayPet[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    api.pets
      .list({ adopted: false })
      .then((pets) => {
        setFeaturedPets(pets.slice(0, 4).map(apiToFeatured));
      })
      .catch(() => {})
      .finally(() => setFeaturedLoading(false));
  }, []);

  return (
    <main className="bg-[#e7b6d827]">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 70% 50%, #FFE4E6 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 10% 80%, #FBCFE8 0%, transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-16 grid lg:grid-cols-2 gap-12 items-center relative">
          <div className="max-w-lg">
            <h1
              className="text-5xl lg:text-7xl font-bold text-[#3D1F0F] leading-[1.05] mb-6 font-serif"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Find Your
              <span className="bg-gradient-to-r from-[#E11D48] to-[#F0A830] bg-clip-text text-transparent"> Perfect </span>
              <br />Companion
            </h1>
            <p className="text-[#7A5544] text-base leading-relaxed mb-8 max-w-sm">
              Give a loving pet the forever home they deserve. Browse hundreds of animals waiting for someone just like you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/find"
                className="bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold px-8 py-3 rounded-full transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                Start adopting <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="border-2 border-[#E11D48] text-[#E11D48] hover:bg-[#E11D48] hover:text-white font-semibold px-8 py-3 rounded-full transition-all"
              >
                Learn more
              </Link>
            </div>
          </div>
          <ArtisticHeroCollage />
        </div>
      </section>

      <style jsx>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse-slow  { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
        @keyframes spin-slow   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-pulse-slow  { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-spin-slow   { animation: spin-slow 8s linear infinite; }
      `}</style>

      <StatsBanner />
      <AdoptionStoriesFeatured />
      <PawDivider />

      {/* Featured Pets */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 sm:gap-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A830] mb-1.5">Available Now</p>
            <h2 className="text-3xl font-bold text-[#3D1F0F] font-serif">Meet Today's Companions</h2>
            <p className="text-[#7A5544] text-sm mt-1">These pets are ready to meet their forever family.</p>
          </div>
          <Link
            href="/browse"
            className="text-sm text-[#E11D48] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-1"
          >
            All pets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" />
          </div>
        ) : featuredPets.length === 0 ? (
          <div className="text-center py-16 text-[#8A6672]">
            <PawPrint className="w-10 h-10 mx-auto mb-3 text-[#FBCFE8]" />
            <p>No pets listed yet. Be the first to add one!</p>
            <Link href="/profile/pets/add" className="mt-4 inline-block text-[#E11D48] font-semibold hover:underline">
              Add a pet →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.map((pet) => (
              <BrowsePetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      <RecentlyAdoptedCarousel />

      {/* How it works */}
      <section className="bg-[#FFE4EC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FF5C8A] mb-2">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2B1B22] font-serif">How Adoption Works</h2>
            <p className="text-[#7A5544] mt-2">Three easy steps to finding your new best friend.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <StepCard key={i} icon={[Search, Heart, Home][i]} step={s.step} title={s.title} desc={s.desc} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
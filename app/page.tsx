"use client";

import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "../components/FavoriteButton";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Search, Heart, Home } from "lucide-react";
import StepCard from "@/components/cards/StepCard";
import PetCard from "@/components/cards/PetCard";

// ── Data ────────────────────────────────────────────────────────────────────

const categories = [
  {
    label: "Dogs",
    src: "/images/homepage/hero2.jpg",
    href: "/dogs",
    count: 142,
    bg: "#FFE4E6",
    ring: "#E11D48",
  },
  {
    label: "Cats",
    src: "/images/homepage/cat.jpg",
    href: "/cats",
    count: 98,
    bg: "#FCE7F3",
    ring: "#F0A830",
  },
  {
    label: "Birds",
    src: "/images/homepage/parrot.jpg",
    href: "/birds",
    count: 37,
    bg: "#EAF3ED",
    ring: "#8AB99A",
  },
  {
    label: "Rabbits",
    src: "/images/homepage/rabbit.png",
    href: "/rabbits",
    count: 24,
    bg: "#FBCFE8",
    ring: "#E11D48",
  },
  {
    label: "Other",
    src: "/images/homepage/hamster.jpg",
    href: "/other",
    count: 19,
    bg: "#FFF8F2",
    ring: "#F0A830",
  },
];

const featuredPets = [
  {
    id: 1,
    name: "Buddy",
    breed: "Golden Retriever",
    age: "2 yrs",
    location: "Colombo",
    tag: "Friendly",
    tagBg: "#FFE4E6",
    tagText: "#BE123C",
    img: "/pets/dog1.jpg",
  },
  {
    id: 2,
    name: "Luna",
    breed: "Siamese Mix",
    age: "1 yr",
    location: "Kandy",
    tag: "Playful",
    tagBg: "#FCE7F3",
    tagText: "#C4630A",
    img: "/pets/cat1.jpg",
  },
  {
    id: 3,
    name: "Milo",
    breed: "Beagle",
    age: "3 yrs",
    location: "Galle",
    tag: "Calm",
    tagBg: "#EAF3ED",
    tagText: "#3A7A50",
    img: "/pets/dog2.jpg",
  },
  {
    id: 4,
    name: "Cleo",
    breed: "Persian Cat",
    age: "4 yrs",
    location: "Colombo",
    tag: "Gentle",
    tagBg: "#FBCFE8",
    tagText: "#A04040",
    img: "/pets/cat2.jpg",
  },
  {
    id: 5,
    name: "Rio",
    breed: "African Grey",
    age: "5 yrs",
    location: "Negombo",
    tag: "Smart",
    tagBg: "#FCE7F3",
    tagText: "#C4630A",
    img: "/pets/bird1.jpg",
  },
  {
    id: 6,
    name: "Max",
    breed: "Labrador Mix",
    age: "6 mo",
    location: "Colombo",
    tag: "Puppy",
    tagBg: "#FFE4E6",
    tagText: "#BE123C",
    img: "/pets/dog3.jpg",
  },
  {
    id: 7,
    name: "Max",
    breed: "Labrador Mix",
    age: "6 mo",
    location: "Colombo",
    tag: "Puppy",
    tagBg: "#FFE4E6",
    tagText: "#BE123C",
    img: "/pets/dog3.jpg",
  },
  {
    id: 8,
    name: "Max",
    breed: "Labrador Mix",
    age: "6 mo",
    location: "Colombo",
    tag: "Puppy",
    tagBg: "#FFE4E6",
    tagText: "#BE123C",
    img: "/pets/dog3.jpg",
  }
];

const steps = [
  { step: "01", title: "Browse & discover",   desc: "Explore hundreds of animals from verified shelters across Sri Lanka. Filter by species, age, and location.", icon: "🔍" },
  { step: "02", title: "Meet your match",      desc: "Schedule a meet-and-greet at the shelter or a home visit. Take all the time you need to connect.",           icon: "🤝" },
  { step: "03", title: "Welcome them home",    desc: "Complete a simple application, and we'll guide you through every step to bring your companion home.",        icon: "🏠" },
];

const trustItems = [
  { value: "8,400+", label: "Happy adoptions" },
  { value: "320+",   label: "Partner shelters" },
  { value: "100%",   label: "Verified listings" },
  { value: "24/7",   label: "Adoption support"  },
];

// ── Paw divider ──────────────────────────────────────────────────────────────
function PawDivider() {
  return (
    <div className="flex items-center gap-3 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex-1 h-px bg-[#FBCFE8]" />
      <span className="text-lg opacity-40">🐾</span>
      <div className="flex-1 h-px bg-[#FBCFE8]" />
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="bg-[#e7b6d827]">

      <Navbar/>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 70% 50%, #FFE4E6 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 10% 80%, #FBCFE8 0%, transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-4 pb-20 grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Copy */}
          <div className="max-w-lg">
            

            <h1
              className="text-5xl lg:text-6xl font-bold text-[#3D1F0F] leading-[1.05] mb-6 font-serif"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Find your{" "}
              <em className="not-italic" style={{ color: "#E11D48" }}>perfect</em>
              <br />companion.
            </h1>

            <p className="text-[#7A5544] text-base leading-relaxed mb-8 max-w-sm">
              Every animal in our care deserves a loving home. Browse thousands of pets ready for adoption — and change two lives forever.
            </p>

            {/* Search */}
            <div className="flex items-center bg-white border border-[#FBCFE8] rounded-xl shadow-sm overflow-hidden mb-8 focus-within:ring-2 focus-within:ring-[#E11D48]/30 focus-within:border-[#E11D48]">
              <svg className="w-5 h-5 ml-4 text-[#B09080] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx={11} cy={11} r={8} /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by breed, name, or location…"
                className="flex-1 px-3 py-3.5 text-sm text-[#3D1F0F] placeholder:text-[#B09080] bg-transparent focus:outline-none"
              />
              <button className="m-1.5 px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-sm font-semibold rounded-lg transition-colors duration-200">
                Search
              </button>
            </div>

            
          </div>

          {/* Collage */}
          <div className="relative hidden lg:block lg:h-[480px]">

            {/* Main large image */}
            <div className="absolute left-0 top-0 w-[65%] h-[85%] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/homepage/hero5.jpg"
                alt="Dog waiting for adoption"
                fill
                className="object-cover"
              />
            </div>

            {/* Top right small image */}
            <div className="absolute right-0 top-6 w-[32%] h-[45%] rounded-2xl overflow-hidden shadow-lg border-4 border-[#FFF8F2]">
              <Image
                src="/images/homepage/hero6.jpg"
                alt="Dog waiting for adoption"
                fill
                className="object-cover"
              />
            </div>

            {/* Bottom right small image */}
            <div className="absolute right-10 bottom-0 w-[38%] h-[40%] rounded-2xl overflow-hidden shadow-lg border-4 border-[#FFF8F2]">
              <Image
                src="/images/homepage/hero7.jpg"
                alt="Dog waiting for adoption"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── Browse by species ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A830] mb-1.5">
              Browse
            </p>
            <h2
              className="text-3xl font-bold text-[#3D1F0F] font-serif"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Find by species
            </h2>
          </div>

          <Link
            href="/browse"
            className="text-sm text-[#E11D48] font-semibold hover:underline underline-offset-2"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 px-16">
          {categories.map(({ label, src, href, count, bg }) => (
            <Link key={label} href={href} className="group flex flex-col items-center">

              {/* Blob shape container */}
              <div
                className="relative w-28 h-28 md:w-32 md:h-32 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: bg,
                  borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                }}
              >
                {/* Image inside blob */}
                <div
                  className="absolute inset-2 overflow-hidden"
                  style={{
                    borderRadius: "50% 40% 60% 40% / 40% 60% 40% 60%",
                  }}
                >
                  <Image
                    src={src}
                    alt={label}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="text-center mt-3">
                <p className="text-sm font-bold text-[#3D1F0F]">{label}</p>
                <p className="text-xs text-[#B09080]">{count} available</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PawDivider />

      {/* ── Featured pets ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#F0A830] mb-1.5">
              Featured
            </p>
            <h2
              className="text-3xl font-bold text-[#3D1F0F] font-serif"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Meet today's companions
            </h2>
          </div>

          <Link
            href="/browse"
            className="text-sm text-[#E11D48] font-semibold hover:underline underline-offset-2"
          >
            All pets →
          </Link>
        </div>

        {/* CENTERED GRID */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
            {featuredPets.map((pet) => (
              <div key={pet.id} className="w-full max-w-sm">
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-[#FFE4EC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">

          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#FF5C8A] mb-2">
              The process
            </p>

            <h2 className="text-3xl font-bold text-[#2B1B22] font-serif">
              Adoption made simple
            </h2>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6">

            <StepCard
              icon={Search}
              step="01"
              title="Browse & discover"
              desc="Explore animals from verified shelters and find your perfect companion."
            />

            <StepCard
              icon={Heart}
              step="02"
              title="Meet your match"
              desc="Schedule visits and connect with the pet before adopting."
            />

            <StepCard
              icon={Home}
              step="03"
              title="Welcome them home"
              desc="Complete the process and bring your new companion home safely."
            />

          </div>

        </div>
      </section>

      <Footer/>
    </main>
  );
}
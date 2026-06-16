"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Venus, Mars } from "lucide-react";
import type { DisplayPet } from "../../types/pet";

export default function BrowsePetCard({ pet }: { pet: DisplayPet }) {
  if (!pet) return null;
  const GenderIcon = pet.gender === "Female" ? Venus : Mars;

  const genderColor =
    pet.gender === "Female"
      ? { bg: "#FCE7F3", text: "#B5006B" }
      : { bg: "#EAF3ED", text: "#1A6B3A" };

  return (
    <Link href={`/pets/${pet.id}`} className="group block">
      <div className="flex flex-col overflow-hidden border border-[#FBCFE8] bg-white hover:shadow-xl transition-all duration-300 rounded-2xl">

        {/* IMAGE */}
        <div className="relative h-48 sm:h-64 overflow-hidden">

          {pet.img ? (
            <Image
              src={pet.img}
              alt={pet.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[#FFE4EC] flex items-center justify-center text-[#FF5C8A]">
              <span className="text-5xl opacity-50">🐾</span>
            </div>
          )}

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* TAG (bottom left) */}
          <span
            className="absolute bottom-2.5 left-2.5 text-xs font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md"
            style={{ background: pet.tagBg, color: pet.tagText }}
          >
            {pet.tag}
          </span>

          {/* GENDER (top right) */}
          {pet.gender && (
            <span
              className="absolute top-2.5 right-2.5 text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: genderColor.bg, color: genderColor.text }}
            >
              <GenderIcon className="w-3 h-3" />
              {pet.gender}
            </span>
          )}

          {/* NEW + watermark (API only) */}
          {pet.isApiPet && (
            <>
              <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5C8A] text-white">
                NEW
              </span>

              <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm p-0.5 shadow-md border border-white/60">
                <Image
                  src="/images/logo/logo.png"
                  alt="logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-3 sm:p-3.5 space-y-1.5 flex flex-col flex-1">

          {/* name + age */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[#2B1B22] text-sm sm:text-base leading-tight">
              {pet.name}
            </h3>

            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-[#FFE4E6] text-[#BE123C] shrink-0">
              <Calendar className="w-3 h-3" />
              {pet.ageLabel}
            </span>
          </div>

          {/* breed */}
          <p className="text-xs text-[#6B4A55]">{pet.breed}</p>

          {/* location */}
          <div className="flex items-center gap-1 text-xs text-[#8B5A66] pt-0.5">
            <MapPin className="w-3 h-3 text-[#E11D48]" />
            {pet.location}
          </div>

        </div>
      </div>
    </Link>
  );
}
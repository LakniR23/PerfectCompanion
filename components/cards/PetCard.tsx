"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { Card } from "@/components/ui/card";

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: string;
  location: string;
  tag: string;
  tagBg: string;
  tagText: string;
  img: string;
};

export default function PetCard({ pet }: { pet: Pet }) {
  return (
    <Link href={`/pets/${pet.id}`} className="group block">
        <Card className="h-full w-56 flex flex-col overflow-hidden border border-[#FBCFE8] bg-white hover:shadow-xl transition-all duration-300 rounded-2xl">        
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={pet.img}
            alt={pet.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* gradient overlay (gives premium look) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <FavoriteButton />

          {/* Tag */}
          <span
            className="absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md"
            style={{
              background: pet.tagBg,
              color: pet.tagText,
            }}
          >
            {pet.tag}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-[#2B1B22] text-lg">
              {pet.name}
            </h3>

            <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-[#FFE4E6] text-[#BE123C]">
              <Calendar className="w-3.5 h-3.5" />
              {pet.age}
            </span>
          </div>

          <p className="text-sm text-[#6B4A55]">{pet.breed}</p>

          <div className="flex items-center gap-1 text-xs text-[#8B5A66] pt-1">
            <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
            {pet.location}
          </div>
        </div>
      </Card>
    </Link>
  );
}
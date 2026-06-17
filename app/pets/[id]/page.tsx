"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2, MapPin, Calendar, Mail, Phone, User,
  CheckCircle, ArrowLeft, Heart, Info, Clock,
} from "lucide-react";

type PetImage = { id: string; imageUrl: string };
type Owner = { id: string; name: string; email: string; phone: string | null };
type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  gender: string | null;
  location: string;
  description: string;
  adopted: boolean;
  createdAt: string;
  images: PetImage[];
  owner: Owner;
  ownerName: string | null;
  ownerContact: string | null;
};

export default function PetDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<number>(0);

  useEffect(() => {
    fetch(`/api/pets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPet(data);
        }
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF5C8A]" />
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0F5] px-6">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#F3D6DF] text-center max-w-md">
          <p className="text-[#8A6672] mb-6">{error || "Pet not found."}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#FF5C8A] hover:bg-[#E94C77] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = pet.images.map((img) => img.imageUrl);

  return (
    <div className="min-h-screen bg-[#FFF0F5] pb-24">
      {/* Top Banner & Back button */}
      <div className="sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-semibold text-[#5A3B45] hover:text-[#FF5C8A] transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Listings
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left Column: Image Gallery - STICKY */}
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-md border border-[#F3D6DF]">
              {images.length > 0 ? (
                <Image
                  src={images[activeImage]}
                  alt={pet.name}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8A6672]">
                  No image available
                </div>
              )}
              {pet.adopted && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-md flex items-center gap-1.5 border-2 border-white">
                  <CheckCircle className="w-4 h-4" /> ADOPTED
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-[#FFF0F5] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#F3D6DF] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#FF5C8A]">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImage === idx
                        ? "border-[#FF5C8A] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl lg:text-5xl font-bold text-[#2B1B22]">
                  {pet.name}
                </h1>
                <span className="text-xs font-semibold uppercase tracking-wider bg-[#FFE4EC] text-[#FF5C8A] px-3 py-1 rounded-full border border-[#F3D6DF]">
                  {pet.species}
                </span>
              </div>
              <p className="text-xl text-[#8A6672]">{pet.breed || "Mixed Breed"}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#F3D6DF] shadow-sm flex items-start gap-3">
                <div className="p-2 bg-[#FFE4EC] text-[#FF5C8A] rounded-xl shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A6672] uppercase tracking-wide">Gender</p>
                  <p className="font-bold text-[#2B1B22]">{pet.gender || "Unknown"}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F3D6DF] shadow-sm flex items-start gap-3">
                <div className="p-2 bg-[#FFE4EC] text-[#FF5C8A] rounded-xl shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A6672] uppercase tracking-wide">Age</p>
                  <p className="font-bold text-[#2B1B22]">{pet.age ?? "Unknown"}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F3D6DF] shadow-sm flex items-start gap-3">
                <div className="p-2 bg-[#FFE4EC] text-[#FF5C8A] rounded-xl shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A6672] uppercase tracking-wide">Location</p>
                  <p className="font-bold text-[#2B1B22]">{pet.location}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#F3D6DF] shadow-sm flex items-start gap-3">
                <div className="p-2 bg-[#FFE4EC] text-[#FF5C8A] rounded-xl shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#8A6672] uppercase tracking-wide">Listed On</p>
                  <p className="font-bold text-[#2B1B22]">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-3xl border border-[#F3D6DF] shadow-sm">
              <h2 className="text-lg font-bold text-[#2B1B22] mb-3">About {pet.name}</h2>
              <p className="text-[#5A3B45] leading-relaxed whitespace-pre-line">
                {pet.description}
              </p>
            </div>

            {/* Owner Info & CTA */}
            <div className="bg-gradient-to-br from-[#FFE4EC] to-[#FBCFE8] p-6 rounded-3xl shadow-sm border border-[#F3D6DF]">
              <h2 className="text-lg font-bold text-[#2B1B22] mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#FF5C8A]" /> Current Guardian
              </h2>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-[#FF5C8A]" />
                </div>
                <div>
                  <p className="font-bold text-[#2B1B22] text-lg">{pet.ownerName || pet.owner.name}</p>
                  <p className="text-sm text-[#8A6672]">Pet Parent</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                
                {pet.ownerContact ? (
                  <div className="flex items-center gap-3 text-[#5A3B45] bg-white p-3 rounded-xl hover:shadow-md transition border border-[#F3D6DF]">
                    <Phone className="w-5 h-5 text-[#FF5C8A] shrink-0" />
                    <span className="truncate">{pet.ownerContact}</span>
                  </div>
                ) : (
                  <>
                    <a href={`mailto:${pet.owner.email}`}
                      className="flex items-center gap-3 text-[#5A3B45] bg-white p-3 rounded-xl hover:shadow-md transition border border-[#F3D6DF]"
                    >
                      <Mail className="w-5 h-5 text-[#FF5C8A] shrink-0" />
                      <span className="truncate">{pet.owner.email}</span>
                    </a>

                    {pet.owner.phone && (
                      <a href={`tel:${pet.owner.phone}`}
                        className="flex items-center gap-3 text-[#5A3B45] bg-white p-3 rounded-xl hover:shadow-md transition border border-[#F3D6DF]"
                      >
                        <Phone className="w-5 h-5 text-[#FF5C8A] shrink-0" />
                        {pet.owner.phone}
                      </a>
                    )}
                  </>
                )}
              </div>

              {!pet.adopted && (
                <a 
                  href={pet.ownerContact 
                    ? (pet.ownerContact.includes('@') ? `mailto:${pet.ownerContact}?subject=Inquiry about adopting ${pet.name}` : `tel:${pet.ownerContact}`) 
                    : (pet.owner.phone ? `tel:${pet.owner.phone}` : `mailto:${pet.owner.email}?subject=Inquiry about adopting ${pet.name}`)
                  }
                  className="block w-full bg-[#FF5C8A] hover:bg-[#E94C77] text-white text-center py-4 rounded-xl font-bold text-lg shadow-md transition"
                >
                  Contact to Adopt
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
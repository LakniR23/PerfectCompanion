import Image from "next/image";
import { MapPin, CheckCircle } from "lucide-react";

type AdoptedPetCardProps = {
  id: string;
  name: string;
  breed: string | null;
  location: string;
  image: string;
  owner?: string | null;
  href?: string;
};

export default function AdoptedPetCard({
  id,
  name,
  breed,
  location,
  image,
  owner,
}: AdoptedPetCardProps) {
  return (
    <div className="h-full">
      <div className="bg-white border border-[#F3D6DF] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden flex-shrink-0">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-[#FFE4EC] flex items-center justify-center text-[#FF5C8A]">
              <span className="text-4xl opacity-50">🐾</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Adopted
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-[#2B1B22]">{name}</h3>
          <p className="text-sm text-[#8A6672] mt-1">{breed}</p>

          
        </div>
      </div>
    </div>
  );
}
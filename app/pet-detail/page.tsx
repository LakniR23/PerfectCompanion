// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// import {
// MapPin, Calendar, ArrowLeft, Phone, User, CheckCircle2, Loader2,
// ChevronLeft, ChevronRight, Venus, Mars, PawPrint, Share2,
// MessageCircle, Heart, ShieldCheck,
// } from "lucide-react";

// import Navbar from "@/components/common/Navbar";
// import Footer from "@/components/common/Footer";
// // import type { ApiPet } from "@/lib/api";
// // import { ALL_PETS, SPECIES_META } from "@/data/pets";

// type PetDisplay = {
// id: string;
// name: string;
// species: string;
// breed: string;
// ageLabel: string;
// ageGroup: string;
// gender: string;
// location: string;
// description: string;
// images: string[];
// adopted: boolean;
// ownerName: string;
// ownerPhone: string;
// isShelter: boolean;
// tag: string | null;
// tagBg: string;
// tagText: string;
// };

// const fallbackImages: Record<string, string> = {
// dogs: "/images/homepage/hero2.jpg",
// cats: "/images/homepage/cat.jpg",
// birds: "/images/homepage/parrot.jpg",
// rabbits: "/images/homepage/rabbit.png",
// other: "/images/homepage/hamster.jpg",
// };

// function getAgeLabel(age: number | null) {
// if (age === null) return "Unknown";
// if (age === 0) return "< 1 yr";
// return `${age} yr${age === 1 ? "" : "s"}`;
// }

// function getAgeGroup(age: number | null) {
// if (age === null) return "Young";
// if (age === 0) return "Baby";
// if (age <= 2) return "Young";
// if (age <= 7) return "Adult";
// return "Senior";
// }

// function fromApi(pet: ApiPet): PetDisplay {
// return {
// id: pet.id,
// name: pet.name,
// species: pet.species,
// breed: pet.breed ?? "Mixed",
// ageLabel: getAgeLabel(pet.age),
// ageGroup: getAgeGroup(pet.age),
// gender: pet.gender ?? "",
// location: pet.location,
// description: pet.description,
// images:
// pet.images.length > 0
// ? pet.images.map((i) => i.imageUrl).slice(0, 5)
// : [fallbackImages[pet.species] ?? "/images/homepage/hero2.jpg"],
// adopted: pet.adopted,
// ownerName: pet.owner?.name ?? "Pet Owner",
// ownerPhone: pet.owner?.phone ?? "",
// isShelter: false,
// tag: null,
// tagBg: "#FFE4E6",
// tagText: "#BE123C",
// };
// }

// function fromMock(id: string): PetDisplay | null {
// const numeric = parseInt(id, 10);
// const p = ALL_PETS.find((x) => x.id === numeric);
// if (!p) return null;

// return {
// id: String(p.id),
// name: p.name,
// species: p.species,
// breed: p.breed,
// ageLabel: p.age,
// ageGroup: p.ageGroup,
// gender: p.gender,
// location: p.location,
// description: `Meet ${p.name}, a ${p.breed.toLowerCase()} looking for a forever home in ${p.location}.`,
// images: [p.img],
// adopted: false,
// ownerName: "Happy Paws Shelter",
// ownerPhone: "+94 11 234 5678",
// isShelter: true,
// tag: p.tag ?? null,
// tagBg: p.tagBg ?? "#FFE4E6",
// tagText: p.tagText ?? "#BE123C",
// };
// }

// export default function PetDetailPage() {
// const params = useParams();
// const id = params?.id as string;

// const [pet, setPet] = useState<PetDisplay | null>(null);
// const [loading, setLoading] = useState(true);
// const [notFound, setNotFound] = useState(false);
// const [imgIdx, setImgIdx] = useState(0);

// useEffect(() => {
// if (!id) return;


// setLoading(true);
// setImgIdx(0);

// fetch(`/api/pets/${id}`, { credentials: "include" })
//   .then(async (r) => {
//     if (r.status === 404) {
//       const mock = fromMock(id);
//       if (mock) setPet(mock);
//       else setNotFound(true);
//       return;
//     }

//     const data = await r.json();
//     setPet(fromApi(data as ApiPet));
//   })
//   .catch(() => {
//     const mock = fromMock(id);
//     if (mock) setPet(mock);
//     else setNotFound(true);
//   })
//   .finally(() => setLoading(false));


// }, [id]);

// if (loading) {
// return ( <div className="min-h-screen flex items-center justify-center bg-[#FFF7FA]"> <Loader2 className="w-8 h-8 animate-spin text-[#FF5C8A]" /> </div>
// );
// }

// if (notFound || !pet) {
// return ( <div className="min-h-screen flex flex-col bg-[#FFF7FA]"> <Navbar /> <div className="flex-1 flex items-center justify-center text-center p-8"> <div> <h2 className="text-2xl font-bold">Pet not found</h2> <Link href="/" className="text-pink-500 mt-4 inline-block">
// Back to home </Link> </div> </div> <Footer /> </div>
// );
// }

// const speciesMeta = SPECIES_META[pet.species];
// const GenderIcon = pet.gender === "Female" ? Venus : Mars;

// return ( 
//   <div className="min-h-screen flex flex-col bg-[#FFF7FA]"> <Navbar />

//   <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
//     <Link href={`/${pet.species}`} className="text-sm text-gray-500">
//       ← Back
//     </Link>

//     <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-8">

//       {/* LEFT */}
//       <div>
//         <div className="relative rounded-2xl overflow-hidden">
//           <img
//             src={pet.images[imgIdx]}
//             className="w-full h-[400px] object-cover"
//             alt={pet.name}
//           />

//           {pet.images.length > 1 && (
//             <>
//               <button onClick={() =>
//                 setImgIdx((i) => (i - 1 + pet.images.length) % pet.images.length)
//               } className="absolute left-2 top-1/2 bg-white p-2 rounded-full">
//                 <ChevronLeft />
//               </button>

//               <button onClick={() =>
//                 setImgIdx((i) => (i + 1) % pet.images.length)
//               } className="absolute right-2 top-1/2 bg-white p-2 rounded-full">
//                 <ChevronRight />
//               </button>
//             </>
//           )}
//         </div>

//         <div className="mt-6">
//           <h1 className="text-3xl font-bold">{pet.name}</h1>
//           <p>{pet.breed}</p>
//           <p className="mt-3 text-gray-600">{pet.description}</p>
//         </div>
//       </div>

//       {/* RIGHT */}
//       <div className="bg-white p-5 rounded-xl shadow">
//         <p className="font-bold">Contact Owner</p>
//         <p className="mt-2">{pet.ownerName}</p>

//         <a
//           href={`tel:${pet.ownerPhone}`}
//           className="block mt-4 bg-pink-500 text-white text-center py-2 rounded-lg"
//         >
//           Call
//         </a>
//       </div>

//     </div>
//   </main>

//   <Footer />
// </div>
// ```

// );
// }

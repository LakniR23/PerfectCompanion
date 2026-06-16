/* ─────────────────────────────────────────────────────────────────────────────
   data/pets.ts  –  Mock pet data & shared constants
───────────────────────────────────────────────────────────────────────────── */

export type MockPet = {
  id: string;
  name: string;
  species: "dogs" | "cats" | "birds" | "rabbits" | "other";
  breed: string;
  age: string;           // display label, e.g. "2 yrs"
  ageGroup: "Baby" | "Young" | "Adult" | "Senior";
  location: string;
  gender: string;
  tag: string;
  tagBg: string;
  tagText: string;
  img: string;
};

export const ALL_PETS: MockPet[] = [
  /* ── Dogs ── */
  {
    id: "mock-d1",
    name: "Buddy",
    species: "dogs",
    breed: "Golden Retriever",
    age: "2 yrs",
    ageGroup: "Young",
    location: "Colombo",
    gender: "Male",
    tag: "Friendly",
    tagBg: "#FFE4E6",
    tagText: "#BE123C",
    img: "/images/homepage/hero2.jpg",
  },
  {
    id: "mock-d2",
    name: "Milo",
    species: "dogs",
    breed: "Beagle",
    age: "3 yrs",
    ageGroup: "Adult",
    location: "Galle",
    gender: "Male",
    tag: "Calm",
    tagBg: "#EAF3ED",
    tagText: "#3A7A50",
    img: "/images/homepage/hero5.jpg",
  },
  {
    id: "mock-d3",
    name: "Ruby",
    species: "dogs",
    breed: "Labrador Mix",
    age: "6 mo",
    ageGroup: "Baby",
    location: "Kandy",
    gender: "Female",
    tag: "Playful",
    tagBg: "#FCE7F3",
    tagText: "#C4630A",
    img: "/images/homepage/hero6.jpg",
  },
  /* ── Cats ── */
  {
    id: "mock-c1",
    name: "Luna",
    species: "cats",
    breed: "Siamese Mix",
    age: "1 yr",
    ageGroup: "Young",
    location: "Kandy",
    gender: "Female",
    tag: "Playful",
    tagBg: "#FCE7F3",
    tagText: "#C4630A",
    img: "/images/homepage/cat.jpg",
  },
  {
    id: "mock-c2",
    name: "Cleo",
    species: "cats",
    breed: "Persian Cat",
    age: "4 yrs",
    ageGroup: "Adult",
    location: "Colombo",
    gender: "Female",
    tag: "Gentle",
    tagBg: "#FBCFE8",
    tagText: "#A04040",
    img: "/images/homepage/cat.jpg",
  },
  /* ── Birds ── */
  {
    id: "mock-b1",
    name: "Rio",
    species: "birds",
    breed: "African Grey",
    age: "5 yrs",
    ageGroup: "Adult",
    location: "Gampaha",
    gender: "Male",
    tag: "Smart",
    tagBg: "#FCE7F3",
    tagText: "#C4630A",
    img: "/images/homepage/parrot.jpg",
  },
  /* ── Rabbits ── */
  {
    id: "mock-r1",
    name: "Snowy",
    species: "rabbits",
    breed: "Dutch Rabbit",
    age: "1 yr",
    ageGroup: "Young",
    location: "Colombo",
    gender: "Female",
    tag: "Cute",
    tagBg: "#FBCFE8",
    tagText: "#A04040",
    img: "/images/homepage/rabbit.png",
  },
  /* ── Other ── */
  {
    id: "mock-o1",
    name: "Hammy",
    species: "other",
    breed: "Syrian Hamster",
    age: "< 1 yr",
    ageGroup: "Baby",
    location: "Matara",
    gender: "Male",
    tag: "Tiny",
    tagBg: "#FFF8F2",
    tagText: "#C4630A",
    img: "/images/homepage/hamster.jpg",
  },
];

/* ── Species metadata ───────────────────────────────────────────────────── */

export const SPECIES_META = {
  dogs: {
    label: "Dogs",
    emoji: "🐶",
    description: "Find your perfect canine companion in Sri Lanka",
    bg: "#FFE4EC",
    color: "#E11D48",
  },
  cats: {
    label: "Cats",
    emoji: "🐱",
    description: "Discover a feline friend waiting for a loving home",
    bg: "#FCE7F3",
    color: "#C4630A",
  },
  birds: {
    label: "Birds",
    emoji: "🦜",
    description: "Feathered friends looking for their forever perch",
    bg: "#EAF3ED",
    color: "#3A7A50",
  },
  rabbits: {
    label: "Rabbits",
    emoji: "🐰",
    description: "Gentle bunnies ready to hop into your heart",
    bg: "#FBCFE8",
    color: "#A04040",
  },
  other: {
    label: "Other Pets",
    emoji: "🐾",
    description: "Unique companions — hamsters, guinea pigs & more",
    bg: "#FFF8F2",
    color: "#C4630A",
  },
} as const;

/* ── Filter constants ───────────────────────────────────────────────────── */

export const LOCATIONS = [
  "All locations",
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Galle",
  "Matara",
  "Jaffna",
  "Kurunegala",
  "Anuradhapura",
  "Ratnapura",
];

export const AGE_GROUPS = ["All ages", "Baby", "Young", "Adult", "Senior"];

export const GENDERS = ["Any gender", "Male", "Female"];

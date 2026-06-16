export const homeSeed = {
  adoptionStories: [
    {
      id: 1,
      name: "Luna & Sarah",
      petName: "Luna",
      petType: "Golden Retriever",
      image: "/images/homepage/hero5.jpg",
      story: "Luna was shy at first, but after a few weeks of patience and love, she's now the happiest dog who greets everyone with a wagging tail.",
      adopter: "Sarah M.",
      location: "Colombo",
    },
    {
      id: 2,
      name: "Oliver & The Perera Family",
      petName: "Oliver",
      petType: "Persian Cat",
      image: "/images/homepage/cat.jpg",
      story: "Oliver brought so much joy to our home. He's the king of the house and loves to cuddle during movie nights.",
      adopter: "The Perera Family",
      location: "Kandy",
    },
    {
      id: 3,
      name: "Coco & Amila",
      petName: "Coco",
      petType: "Cockatiel",
      image: "/images/homepage/parrot.jpg",
      story: "Coco learned to say 'I love you' within a month. Every morning starts with her sweet chirps and happy dances.",
      adopter: "Amila D.",
      location: "Galle",
    },
    {
      id: 4,
      name: "Max & The Wijesinghe Family",
      petName: "Max",
      petType: "Beagle",
      image: "/images/homepage/hero6.jpg",
      story: "Max was a rescue who had been waiting for 6 months. Now he's the most energetic and loving companion for our two kids.",
      adopter: "The Wijesinghe Family",
      location: "Negombo",
    },
  ],
  recentlyAdoptedPets: [
    { id: "r1", name: "Max", species: "dogs", breed: "Beagle", img: "/images/homepage/hero6.jpg", adoptedDate: "2 days ago" },
    { id: "r2", name: "Bella", species: "cats", breed: "Siamese", img: "/images/homepage/cat.jpg", adoptedDate: "3 days ago" },
    { id: "r3", name: "Charlie", species: "birds", breed: "Macaw", img: "/images/homepage/parrot.jpg", adoptedDate: "5 days ago" },
    { id: "r4", name: "Daisy", species: "rabbits", breed: "Holland Lop", img: "/images/homepage/rabbit.png", adoptedDate: "1 week ago" },
    { id: "r5", name: "Rocky", species: "dogs", breed: "Husky", img: "/images/homepage/hero2.jpg", adoptedDate: "1 week ago" },
    { id: "r6", name: "Lily", species: "cats", breed: "Persian", img: "/images/homepage/cat.jpg", adoptedDate: "2 weeks ago" },
    { id: "r7", name: "Coco", species: "birds", breed: "Cockatiel", img: "/images/homepage/parrot.jpg", adoptedDate: "2 weeks ago" },
    { id: "r8", name: "Snowy", species: "rabbits", breed: "Angora", img: "/images/homepage/rabbit.png", adoptedDate: "3 weeks ago" },
  ],
  steps: [
    { step: "01", title: "Browse & discover", desc: "Explore hundreds of animals from verified shelters across Sri Lanka. Filter by species, age, and location.", icon: "🔍" },
    { step: "02", title: "Meet your match", desc: "Schedule a meet-and-greet at the shelter or a home visit. Take all the time you need to connect.", icon: "🤝" },
    { step: "03", title: "Welcome them home", desc: "Complete a simple application, and we'll guide you through every step to bring your companion home.", icon: "🏠" },
  ],
  statItems: [
    { value: "1,280+", label: "Paws Waiting", sublabel: "pets looking for love", icon: "🐾" },
    { value: "8,420+", label: "Hearts United", sublabel: "successful adoptions", icon: "❤️" },
  ],
  heroData: {
    titlePrefix: "Find your ",
    titleHighlight: "perfect",
    titleSuffix: "companion.",
    description: "Every animal in our care deserves a loving home. Browse thousands of pets ready for adoption — and change two lives forever.",
  },
  howItWorksInfo: {
    label: "The process",
    title: "Adoption made simple",
    subtitle: "Three easy steps to find your new best friend"
  },
  featuredInfo: {
    label: "Featured",
    title: "Meet today's companions",
    subtitle: "Waiting for a loving home like yours"
  },
  adoptedInfo: {
    label: "Celebrating",
    title: "Recently adopted",
    subtitle: "These lucky pets found their forever homes ❤️"
  },
  storiesInfo: {
    label: "Happy Tails",
    title: "Real adoption stories",
    subtitle: "Every adoption creates a beautiful bond. Here are some of our favorite success stories."
  }
};

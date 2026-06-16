import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Starting to seed mock pets...");

    // Get or create a default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@example.com",
          password: "hashedpassword123",
        },
      });
    }

    const petsData = [
      // Active Pets
      {
        name: "Max",
        species: "dogs",
        breed: "Golden Retriever",
        age: "2 years",
        gender: "Male",
        location: "Colombo",
        description: "Friendly and energetic Golden Retriever. Loves to play fetch and is great with kids.",
        adopted: false,
        ownerName: "John Doe",
        ownerContact: "0771234567",
      },
      {
        name: "Bella",
        species: "cats",
        breed: "Persian",
        age: "1 year",
        gender: "Female",
        location: "Kandy",
        description: "Sweet and calm Persian cat. Enjoys lounging by the window and being brushed.",
        adopted: false,
        ownerName: "Jane Smith",
        ownerContact: "0719876543",
      },
      {
        name: "Charlie",
        species: "dogs",
        breed: "Labrador",
        age: "3 months",
        gender: "Male",
        location: "Galle",
        description: "Playful Labrador puppy. Needs a loving home with a backyard to run around.",
        adopted: false,
        ownerName: "Mike Johnson",
        ownerContact: "0751122334",
      },
      {
        name: "Lucy",
        species: "cats",
        breed: "Siamese",
        age: "3 years",
        gender: "Female",
        location: "Colombo",
        description: "Talkative and affectionate Siamese cat. Very social and loves attention.",
        adopted: false,
      },
      {
        name: "Rio",
        species: "birds",
        breed: "Macaw",
        age: "4 years",
        gender: "Male",
        location: "Negombo",
        description: "Beautiful and colorful Macaw. Can mimic a few words and is very intelligent.",
        adopted: false,
      },
      {
        name: "Snowball",
        species: "rabbits",
        breed: "Angora",
        age: "6 months",
        gender: "Female",
        location: "Nuwara Eliya",
        description: "Fluffy and gentle Angora rabbit. Perfect companion for a quiet home.",
        adopted: false,
      },
      {
        name: "Rocky",
        species: "dogs",
        breed: "German Shepherd",
        age: "1.5 years",
        gender: "Male",
        location: "Kurunegala",
        description: "Highly intelligent and loyal German Shepherd. Needs plenty of exercise.",
        adopted: false,
      },
      {
        name: "Whiskers",
        species: "cats",
        breed: "Tabby",
        age: "2 years",
        gender: "Male",
        location: "Anuradhapura",
        description: "Playful tabby who loves chasing laser pointers and napping in the sun.",
        adopted: false,
      },
      {
        name: "Tweety",
        species: "birds",
        breed: "Canary",
        age: "1 year",
        gender: "Male",
        location: "Jaffna",
        description: "Beautiful singing canary. Brightens up the room with his morning songs.",
        adopted: false,
      },
      {
        name: "Thumper",
        species: "rabbits",
        breed: "Lionhead",
        age: "8 months",
        gender: "Male",
        location: "Ratnapura",
        description: "Curious and active Lionhead rabbit with a wonderful mane.",
        adopted: false,
      },
      // Adopted Pets
      {
        name: "Buddy",
        species: "dogs",
        breed: "Beagle",
        age: "4 years",
        gender: "Male",
        location: "Kandy",
        description: "Active Beagle who loves going on walks and sniffing around.",
        adopted: true,
      },
      {
        name: "Luna",
        species: "cats",
        breed: "Maine Coon",
        age: "2 years",
        gender: "Female",
        location: "Colombo",
        description: "Large and majestic Maine Coon. Very gentle giant.",
        adopted: true,
      },
      {
        name: "Coco",
        species: "birds",
        breed: "Cockatiel",
        age: "1 year",
        gender: "Male",
        location: "Gampaha",
        description: "Happy little Cockatiel. Loves to whistle and sit on your shoulder.",
        adopted: true,
      },
      {
        name: "Milo",
        species: "dogs",
        breed: "Pug",
        age: "5 years",
        gender: "Male",
        location: "Matara",
        description: "Sweet Pug who enjoys naps and treats. Very cuddly.",
        adopted: true,
      },
      {
        name: "Oreo",
        species: "rabbits",
        breed: "Dutch",
        age: "1.5 years",
        gender: "Female",
        location: "Colombo",
        description: "Friendly Dutch rabbit. Litter trained and loves carrots.",
        adopted: true,
      },
      {
        name: "Daisy",
        species: "dogs",
        breed: "Poodle",
        age: "3 years",
        gender: "Female",
        location: "Galle",
        description: "Smart and elegant Poodle. Loves learning new tricks.",
        adopted: true,
      },
      {
        name: "Simba",
        species: "cats",
        breed: "Bengal",
        age: "2 years",
        gender: "Male",
        location: "Kandy",
        description: "Energetic and vocal Bengal cat. Extremely playful.",
        adopted: true,
      },
      {
        name: "Kiwi",
        species: "birds",
        breed: "Lovebird",
        age: "2 years",
        gender: "Female",
        location: "Negombo",
        description: "Sweet little Lovebird who enjoys being hand-fed.",
        adopted: true,
      },
      {
        name: "Barnaby",
        species: "dogs",
        breed: "Dachshund",
        age: "4 years",
        gender: "Male",
        location: "Colombo",
        description: "Loyal Dachshund who loves burrowing under blankets.",
        adopted: true,
      },
      {
        name: "Mochi",
        species: "cats",
        breed: "Scottish Fold",
        age: "1 year",
        gender: "Female",
        location: "Nuwara Eliya",
        description: "Adorable Scottish Fold who enjoys cuddles and quiet spaces.",
        adopted: true,
      }
    ];

    const storiesData = [
      {
        petName: "Max",
        petType: "Golden Retriever",
        location: "Colombo",
        story: "Max brought so much joy into our lives! He loves his daily walks at Galle Face and is the perfect companion for our children.",
        imageUrl: "/images/homepage/hero5.jpg",
      },
      {
        petName: "Luna",
        petType: "Maine Coon",
        location: "Kandy",
        story: "Luna is the most majestic cat we've ever seen. She took a few days to adjust, but now she sleeps at the foot of our bed every night.",
        imageUrl: "/images/homepage/cat.jpg",
      },
      {
        petName: "Buddy",
        petType: "Beagle",
        location: "Galle",
        story: "Buddy was very shy at first, but with a lot of treats and patience, he has blossomed into a playful and loving family member.",
        imageUrl: "/images/homepage/hero6.jpg",
      },
      {
        petName: "Coco",
        petType: "Cockatiel",
        location: "Gampaha",
        story: "Coco is an absolute delight. We were looking for a bird and this little Cockatiel has filled our home with beautiful whistling every morning.",
        imageUrl: "/images/homepage/parrot.jpg",
      },
      {
        petName: "Milo",
        petType: "Pug",
        location: "Matara",
        story: "Milo the Pug is the best! He loves napping on the couch and has settled in perfectly. We couldn't imagine life without him.",
        imageUrl: "/images/homepage/hero2.jpg",
      },
      {
        petName: "Oreo",
        petType: "Dutch Rabbit",
        location: "Colombo",
        story: "Oreo is such a smart rabbit. She was already litter-trained and gets along great with the other pets in the house.",
        imageUrl: "/images/homepage/rabbit.png",
      },
      {
        petName: "Daisy",
        petType: "Poodle",
        location: "Galle",
        story: "Daisy is so intelligent. We've been teaching her new tricks every day and she learns incredibly fast. A wonderful addition to the family!",
        imageUrl: "/images/homepage/hero5.jpg",
      },
      {
        petName: "Simba",
        petType: "Bengal Cat",
        location: "Kandy",
        story: "Simba is a ball of energy! He loves climbing to the highest shelves and playing with his toy mice for hours.",
        imageUrl: "/images/homepage/cat.jpg",
      },
      {
        petName: "Kiwi",
        petType: "Lovebird",
        location: "Negombo",
        story: "Kiwi the Lovebird has been so sweet. She loves sitting on shoulders and softly chirping while we watch TV in the evenings.",
        imageUrl: "/images/homepage/parrot.jpg",
      },
      {
        petName: "Barnaby",
        petType: "Dachshund",
        location: "Colombo",
        story: "Barnaby the Dachshund is a true burrower. If there is a blanket on the sofa, you can be sure he is sleeping underneath it!",
        imageUrl: "/images/homepage/hero6.jpg",
      }
    ];

    let petsSeeded = 0;
    for (const p of petsData) {
      await prisma.pet.create({
        data: {
          name: p.name,
          species: p.species,
          breed: p.breed,
          age: p.age,
          gender: p.gender,
          location: p.location,
          description: p.description,
          adopted: p.adopted,
          ownerName: p.ownerName,
          ownerContact: p.ownerContact,
          ownerId: user.id,
        },
      });
      petsSeeded++;
    }

    let storiesSeeded = 0;
    for (const s of storiesData) {
      await prisma.adoptionStory.create({
        data: {
          petName: s.petName,
          petType: s.petType,
          location: s.location,
          story: s.story,
          imageUrl: s.imageUrl,
          userId: user.id,
        },
      });
      storiesSeeded++;
    }

    return Response.json({ success: true, message: `Seeded ${petsSeeded} pets and ${storiesSeeded} stories successfully!` });
  } catch (error: any) {
    console.error("Seed error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

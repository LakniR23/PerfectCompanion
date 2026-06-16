import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const petSelect = {
  id: true,
  name: true,
  species: true,
  breed: true,
  age: true,
  gender: true,
  location: true,
  description: true,
  adopted: true,
  createdAt: true,
  images: { select: { id: true, imageUrl: true } },
  owner: { select: { id: true, name: true, email: true, phone: true } },
};

/** GET /api/pets/my — list the logged-in user's own pets */
export async function GET() {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const pets = await prisma.pet.findMany({
    where: { ownerId: userId },
    select: petSelect,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(pets);
}

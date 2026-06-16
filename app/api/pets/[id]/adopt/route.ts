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

/** PATCH /api/pets/[id]/adopt — toggle adopted = true (owner only) */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet) return Response.json({ error: "Pet not found." }, { status: 404 });
  if (pet.ownerId !== userId) return Response.json({ error: "Forbidden." }, { status: 403 });

  const updated = await prisma.pet.update({
    where: { id },
    data: { adopted: true },
    select: petSelect,
  });

  return Response.json(updated);
}

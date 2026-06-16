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
  ownerName: true,      
  ownerContact: true,
  images: { select: { id: true, imageUrl: true } },
  owner: { select: { id: true, name: true, email: true, phone: true } },
};

/** GET /api/pets/[id] */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id }, select: petSelect });
  if (!pet) return Response.json({ error: "Pet not found." }, { status: 404 });
  return Response.json(pet);
}

/** PATCH /api/pets/[id] */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet) return Response.json({ error: "Pet not found." }, { status: 404 });
  if (pet.ownerId !== userId) return Response.json({ error: "Forbidden." }, { status: 403 });

  const formData = await request.formData();

  const name        = formData.get("name") as string;
  const species     = formData.get("species") as string;
  const breed       = (formData.get("breed") as string) || null;
  const ageRaw      = formData.get("age") as string;
  const gender      = (formData.get("gender") as string) || null;
  const location    = formData.get("location") as string;
  const description = formData.get("description") as string;
  const ownerName    = (formData.get("ownerName") as string) || null;
  const ownerContact = (formData.get("ownerContact") as string) || null;

  // Rebuild ordered image URL list
  const orderedImageUrls: string[] = [];
  let index = 0;

  while (formData.has(`imageOrder_${index}`)) {
    const type = formData.get(`imageOrder_${index}`) as string;

    if (type === "existing") {
      const url = formData.get(`existingImage_${index}`) as string;
      orderedImageUrls.push(url);

    } else if (type === "new") {
      const file = formData.get(`newImage_${index}`) as File;
      // Validate size — 4 MB limit per image
      if (file.size > 4 * 1024 * 1024) {
        return Response.json(
          { error: `Image "${file.name}" exceeds the 4 MB limit.` },
          { status: 400 }
        );
      }
      const bytes  = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      orderedImageUrls.push(dataUrl);
    }

    index++;
  }

  // Replace all image rows for this pet with the new ordered set
  await prisma.petImage.deleteMany({ where: { petId: id } });

  const updated = await prisma.pet.update({
    where: { id },
    data: {
      name,
      species,
      breed,
      age: ageRaw || null,
      gender,
      location,
      description,
      ownerName,
      ownerContact,
      images: {
        create: orderedImageUrls.map((imageUrl) => ({ imageUrl })),
      },
    },
    select: petSelect,
  });

  return Response.json(updated);
}

/** DELETE /api/pets/[id] */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const pet = await prisma.pet.findUnique({ where: { id } });
  if (!pet) return Response.json({ error: "Pet not found." }, { status: 404 });
  if (pet.ownerId !== userId) return Response.json({ error: "Forbidden." }, { status: 403 });

  await prisma.pet.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const story = await prisma.adoptionStory.findUnique({ where: { id } });
  if (!story) return Response.json({ error: "Story not found." }, { status: 404 });
  return Response.json(story);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.adoptionStory.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Story not found." }, { status: 404 });
  if (existing.userId !== userId) return Response.json({ error: "Forbidden." }, { status: 403 });

  const body = await request.json();
  const updated = await prisma.adoptionStory.update({
    where: { id },
    data: {
      petName: body.petName,
      petType: body.petType,
      location: body.location,
      story: body.story,
      ...(body.imageUrl && { imageUrl: body.imageUrl }),
    },
  });

  return Response.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.adoptionStory.findUnique({ where: { id } });
  if (!existing) return Response.json({ error: "Story not found." }, { status: 404 });
  if (existing.userId !== userId) return Response.json({ error: "Forbidden." }, { status: 403 });

  await prisma.adoptionStory.delete({ where: { id } });
  return new Response(null, { status: 204 });
}

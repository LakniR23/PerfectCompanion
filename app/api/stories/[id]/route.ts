import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

  const formData = await request.formData();
  const petName = formData.get("petName") as string;
  const petType = formData.get("petType") as string;
  const location = formData.get("location") as string;
  const storyText = formData.get("story") as string;
  
  const file = formData.get("image") as File;
  let imageUrl: string | undefined = undefined;
  if (file && file.size > 0) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `story-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/${filename}`;
  }

  const updated = await prisma.adoptionStory.update({
    where: { id },
    data: {
      ...(petName && { petName }),
      ...(petType && { petType }),
      ...(location && { location }),
      ...(storyText && { story: storyText }),
      ...(imageUrl && { imageUrl }),
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

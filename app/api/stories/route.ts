import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const my = searchParams.get("my");

  let where = {};
  if (my === "true") {
    const userId = await getSession();
    if (!userId) return Response.json({ error: "Not authenticated" }, { status: 401 });
    where = { userId };
  }

  const stories = await prisma.adoptionStory.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { name: true } },
    },
  });

  return Response.json(stories);
}

export async function POST(request: Request) {
  const userId = await getSession();
  if (!userId) return Response.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const formData = await request.formData();
    const petName = formData.get("petName") as string;
    const petType = formData.get("petType") as string;
    const location = formData.get("location") as string;
    const story = formData.get("story") as string;
    
    let imageUrl = "/images/homepage/hero5.jpg"; // Default image

    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const ext = file.name.split(".").pop() ?? "jpg";
      const filename = `story-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/${filename}`;
    }

    if (!petName || !petType || !location || !story) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    const newStory = await prisma.adoptionStory.create({
      data: { petName, petType, location, story, imageUrl, userId },
    });

    return Response.json(newStory, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to save story." }, { status: 500 });
  }
}

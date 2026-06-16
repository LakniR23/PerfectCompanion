import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

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
    const body = await request.json();
    const { petName, petType, location, story, imageUrl } = body;

    if (!petName || !petType || !location || !story || !imageUrl) {
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

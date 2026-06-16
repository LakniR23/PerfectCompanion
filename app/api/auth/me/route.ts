import { prisma } from "@/lib/prisma";
import { getSession, clearSession } from "@/lib/session";

export async function GET() {
  const userId = await getSession();
  if (!userId) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          pets: true,
        },
      },
    },
  });

  if (!user) {
    return Response.json({ error: "User not found." }, { status: 404 });
  }

  // Count adopted pets owned by this user
  const adoptedCount = await prisma.pet.count({
    where: { ownerId: userId, adopted: true },
  });

  return Response.json({
    user: {
      ...user,
      adoptedCount,
    },
  });
}

export async function PUT(request: Request) {
  const userId = await getSession();
  if (!userId) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { name, email, phone } = await request.json() as {
    name?: string;
    email?: string;
    phone?: string;
  };

  // Check email uniqueness if changing
  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (existing) {
      return Response.json({ error: "Email already in use." }, { status: 409 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      phone: phone ?? null,
    },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  return Response.json({ user: updated });
}

export async function DELETE() {
  const userId = await getSession();
  if (!userId) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  await clearSession();

  return new Response(null, { status: 204 });
}

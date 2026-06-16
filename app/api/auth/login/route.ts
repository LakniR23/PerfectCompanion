import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await setSession(user.id);

    return Response.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error("[LOGIN]", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

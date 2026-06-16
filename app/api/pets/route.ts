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

/** GET /api/pets — list pets with optional filters */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const species = searchParams.get("species");
  const adopted = searchParams.get("adopted");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const pets = await prisma.pet.findMany({
    where: {
      ...(species ? { species } : {}),
      ...(adopted !== null ? { adopted: adopted === "true" } : {}),
    },
    select: petSelect,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return Response.json(pets);
}

/** POST /api/pets — create a new pet listing (auth required) */
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const userId = await getSession();
  if (!userId)
    return Response.json({ error: "Not authenticated." }, { status: 401 });

  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const breed = (formData.get("breed") as string) || null;
    const age = (formData.get("age") as string) || null;
    const gender = (formData.get("gender") as string) || null;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const ownerName    = (formData.get("ownerName") as string) || null;
    const ownerContact = (formData.get("ownerContact") as string) || null;

    if (!name || !species || !location || !description || !ownerName || !ownerContact)
      return Response.json({ error: "Name, species, location, and description are required." }, { status: 400 });

    // Save uploaded files to /public/uploads/
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true }); // creates dir if not exists

    const imageUrls: string[] = [];
    for (const [key, val] of formData.entries()) {
      if (key.startsWith("imageUrl_") && val instanceof File && val.size > 0) {
        const ext = val.name.split(".").pop() ?? "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const buffer = Buffer.from(await val.arrayBuffer());
        await writeFile(path.join(uploadDir, filename), buffer);
        imageUrls.push(`/uploads/${filename}`); // publicly accessible path
      }
    }

    const pet = await prisma.pet.create({
      data: {
        name, species, breed, age, gender, location, description,ownerName, ownerContact,
        ownerId: userId,
        images: imageUrls.length
          ? { create: imageUrls.map((url) => ({ imageUrl: url })) }
          : undefined,
      },
      select: petSelect,
    });

    // Notify subscribers asynchronously so we don't block the response
    (async () => {
      try {
        const subscribers = await (prisma as any).subscriber.findMany();
        if (subscribers.length > 0) {
          const { sendEmail } = await import("@/lib/email");
          const emails = subscribers.map((s) => s.email);
          await sendEmail({
            to: emails.join(", "),
            subject: `New Pet Listed: ${pet.name}!`,
            text: `A new pet named ${pet.name} (${pet.species}) is looking for a home in ${pet.location}. Check it out on Perfect Companion!`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF0F5; padding: 30px 20px; border-radius: 12px; border: 1px solid #F3D6DF;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="color: #FF5C8A; margin: 0; font-size: 28px;">Perfect Companion 🐾</h1>
                <p style="color: #8A6672; font-size: 16px; margin-top: 8px;">A new furry friend is looking for a home!</p>
              </div>
              
              <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #F3D6DF; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                <h2 style="color: #2B1B22; margin-top: 0; font-size: 24px;">Meet ${pet.name}!</h2>
                <p style="color: #5A3B45; font-size: 16px; line-height: 1.6;">
                  A lovely <strong>${pet.breed || pet.species}</strong> has just been listed in <strong>${pet.location}</strong>.
                </p>
                
                <div style="background-color: #FFF7FA; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px dashed #FF5C8A;">
                  <table style="width: 100%; color: #5A3B45; font-size: 16px;">
                    <tr>
                      <td style="padding-bottom: 10px;">📍 <strong>Location:</strong></td>
                      <td style="padding-bottom: 10px;">${pet.location}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 10px;">🎂 <strong>Age:</strong></td>
                      <td style="padding-bottom: 10px;">${pet.age || 'Unknown'}</td>
                    </tr>
                    <tr>
                      <td style="padding-bottom: 10px;">💖 <strong>Gender:</strong></td>
                      <td style="padding-bottom: 10px;">${pet.gender || 'Unknown'}</td>
                    </tr>
                  </table>
                  <p style="margin: 15px 0 0 0; font-style: italic; color: #8A6672;">"${pet.description.slice(0, 100)}${pet.description.length > 100 ? '...' : ''}"</p>
                </div>
                
                <p style="color: #5A3B45; font-size: 16px; line-height: 1.6;">
                  If you or someone you know might be the perfect match for ${pet.name}, check out their full profile on Perfect Companion!
                </p>
                
                <div style="text-align: center; margin-top: 35px;">
                  <a href="https://localhost:3000/pets/${pet.id}" style="background-color: #FF5C8A; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 100px; display: inline-block; font-size: 16px;">View Full Profile</a>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 25px; color: #B58A96; font-size: 12px;">
                <p>You received this email because you subscribed to the Perfect Companion newsletter.</p>
              </div>
            </div>
            `
          });
        }
      } catch (e) {
        console.error("Failed to notify subscribers", e);
      }
    })();

    return Response.json(pet, { status: 201 });
  } catch (err) {
    console.error("[CREATE PET]", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}

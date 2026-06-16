import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await (prisma as any).subscriber.findUnique({
      where: { email },
    });

    if (!existing) {
      await (prisma as any).subscriber.create({
        data: { email },
      });

      // Send welcome email
      await sendEmail({
        to: email,
        subject: "Welcome to Perfect Companion Newsletter! 🐾",
        text: "Thank you for subscribing! We will notify you when new pets are listed so you can find your perfect companion.",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFF0F5; padding: 30px 20px; border-radius: 12px; border: 1px solid #F3D6DF;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #FF5C8A; margin: 0; font-size: 28px;">Perfect Companion 🐾</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #F3D6DF; box-shadow: 0 4px 6px rgba(0,0,0,0.02); text-align: center;">
            <h2 style="color: #2B1B22; margin-top: 0; font-size: 24px;">Welcome to the Family!</h2>
            <p style="color: #5A3B45; font-size: 16px; line-height: 1.6;">
              Thank you for subscribing to our newsletter. You've taken the first step towards finding your perfect furry (or feathered!) friend.
            </p>
            
            <div style="background-color: #FFF7FA; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px dashed #FF5C8A;">
              <p style="color: #5A3B45; font-size: 16px; margin: 0;">
                We'll notify you <strong>immediately</strong> whenever a new pet is listed for adoption. This way, you won't miss out on your perfect companion!
              </p>
            </div>
            
            <div style="margin-top: 35px;">
              <a href="https://localhost:3000/find" style="background-color: #FF5C8A; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 100px; display: inline-block; font-size: 16px;">Browse Available Pets</a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 25px; color: #B58A96; font-size: 12px;">
            <p>You received this email because you subscribed to the Perfect Companion newsletter.</p>
          </div>
        </div>
        `
      });
    }

    return Response.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[SUBSCRIBE]", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

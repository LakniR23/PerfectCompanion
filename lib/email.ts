import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const toArray = to.split(',').map(email => email.trim());
    
    const data = await resend.emails.send({
      from: 'Perfect Companion <onboarding@resend.dev>',
      to: toArray,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    console.log("Email sent successfully via Resend:", data);
  } catch (error) {
    console.error("Error sending email via Resend:", error);
  }
}

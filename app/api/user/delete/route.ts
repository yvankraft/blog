import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.user.id;
    const userEmail = session.user.email;
    const userName = session.user.name;

    // 1. Supprimer l'utilisateur et ses posts de la base de données
    await prisma.post.deleteMany({ where: { authorId: userId } });
    await prisma.user.delete({ where: { id: userId } });

    // 2. Envoyer l'e-mail de rupture/courtoisie
    try {
      await transporter.sendMail({
        from: `"Les Talk" <${process.env.SMTP_USER}>`,
        to: userEmail,
        subject: "💔 Your Les Talk account has been deleted",
        html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deleted</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);">
      
      <tr>
        <td style="padding: 32px 32px 20px 32px;">
          <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.025em;">Les Talk</span>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 32px 40px 32px; font-size: 14px; line-height: 24px; color: #374151;">
          <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #111827;">We're sad to see you go,</p>
          
          <p style="margin: 0 0 16px 0;">This email confirms that your Les Talk account has been permanently deleted, along with all your profile data and publications.</p>
          
          <p style="margin: 0 0 24px 0;">We are truly sorry to lose you as a member of our community. If there is anything we could have done better, or if you have any feedback to help us improve, we would love to hear from you.</p>
          
          <p style="margin: 0 0 24px 0;">Changed your mind? Our doors are always open. You can create a new account at any time to start sharing and exploring fresh ideas again.</p>
          
          <p style="margin: 0;"> Best,<br><span style="font-weight: 600; color: #111827;">The Les Talk Team</span></p>
        </td>
      </tr>

      <tr>
        <td style="padding: 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; line-height: 20px; color: #6b7280;">
          <p style="margin: 0 0 12px 0;">You received this email because an account deletion request was completed for your email address.</p>
          <p style="margin: 0 0 16px 0;">
            <a href="${process.env.BETTER_AUTH_URL}/feedback" style="color: #2563eb; text-decoration: none; font-weight: 500;">Give feedback</a>
            <span style="color: #d1d5db; margin: 0 8px;">•</span>
            <a href="${process.env.BETTER_AUTH_URL}/support" style="color: #2563eb; text-decoration: none; font-weight: 500;">Contact Support</a>
          </p>
          <p style="margin: 0; color: #9ca3af;">
            © ${new Date().getFullYear()} Les Talk Inc. All rights reserved.<br>
            Mrtin Luther Straße 48, 59065 Hamm, Germany
          </p>
        </td>
      </tr>

    </table>
  </body>
  </html>
`,
      });
      console.log("Goodbye email sent to:", userEmail);
    } catch (emailError) {
      // On ne bloque pas la réponse si l'e-mail échoue après la suppression
      console.error("Failed to send goodbye email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

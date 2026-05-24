import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { reason, message } = await request.json();

    // Traduction des valeurs du select pour l'e-mail
    const reasonLabels: Record<string, string> = {
      "too-complex": "L'interface est trop compliquée",
      "missing-features": "Il manque des fonctionnalités clés",
      other: "Autre raison personnelle",
    };

    await transporter.sendMail({
      from: `"Les Talk System" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Tu reçois l'e-mail sur ta propre boîte
      subject: "📢 Nouveau Feedback Utilisateur — Les Talk",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 24px; border-radius: 12px; color: #1f2937;">
          <h2 style="color: #111827; margin-top: 0;">Un utilisateur a laissé un avis</h2>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
          <p><strong>Raison principale :</strong><br>${reasonLabels[reason] || reason}</p>
          <p><strong>Message détaillé :</strong><br>${message ? message : "<span style='color: #9ca3af;'>Aucun message laissé</span>"}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

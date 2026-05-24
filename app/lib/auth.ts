import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer"; //import de nodemailer pour l'envoi d'emails
import { prisma } from "./db";

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  appName: "Les Talk",
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("Envoi de l'email de vérification à :", user.email);
      await transporter.sendMail({
        from: `"Les Talk" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Verify your email address",
        html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
                        <h2>Welcome to Les Talk!</h2>
                        <p>Please verify your email address by clicking the link below:</p>
                        <a href="${url}" style="background: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Verify Email</a>
                        <p>If the button doesn't work, copy-paste this URL: ${url}</p>
                    </div>
                `,
      });
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        input: true, // Permet de l'envoyer depuis le client lors du signUp
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 jours
    updateAge: 60 * 60 * 24, // Mise à jour chaque jour
  },
  socialProviders: {
    // Optionnel : Tu pourras activer Google/Apple ici plus tard
  },
});

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
import { prisma } from "./db";

// Configuration du transporteur pour l'envoi d'emails avec Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Export du client d'authentification pour une utilisation côté client
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Si c'est une connexion sociale et qu'il n'a pas de username
          if (!user.username) {
            const baseUsername = user.email.split("@")[0];
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);

            // On retourne l'objet utilisateur enrichi avec le nouveau username
            return {
              data: {
                ...user,
                username: `${baseUsername}_${randomSuffix}`,
              },
              additionalFields: {
                coverImage: {
                  type: "string",
                  required: false,
                },
                username: {
                  type: "string",
                  required: false,
                },
              },
            };
          }
          // S'il a déjà un username (ex: inscription classique), on ne touche à rien
          return {
            data: user,
          };
        },
      },
    },
  },

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  appName: "Les Talk",

  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,

    onExistingUserSignUp: async ({ user }, request) => {
      await transporter.sendMail({
        to: user.email,
        subject: "Sign-up attempt with your email",
        text: "Someone tried to create an account using your email address. If this was you, try signing in instead. If not, you can safely ignore this email.",
      });
    },

    // Fonction pour envoyer l'email de réinitialisation de mot de passe
    sendResetPassword: async ({ user, url, token }, request) => {
      if (!user || !user.email) {
        throw new Error("UNKNOWN_USER");
      }
      console.log("Sending reset password email to:", user.email);
      await transporter.sendMail({
        from: `"Les Talk" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Reset your password - Les Talk",
        html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 450px; margin: 40px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
                  <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">Reset Password</h2>
                  <p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 24px;">You requested to reset your password for your Les Talk account. Click the button below to choose a new one:</p>
                  <div style="text-align: center; margin-bottom: 24px;">
                      <a href="${url}" style="background-color: #111827; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block;">Reset Password</a>
                  </div>
                  <p style="font-size: 12px; color: #6b7280; line-height: 1.5;">If you did not request this change, you can safely ignore this email.</p>
                  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                  <p style="font-size: 12px; color: #9ca3af; word-break: break-all;">If the button above doesn't work, copy and paste this URL into your browser:<br /><a href="${url}" style="color: #2563eb; text-decoration: none;">${url}</a></p>
              </div>
          `,
      });
    },

    // Fonction appelée après la réinitialisation du mot de passe
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
      try {
        await transporter.sendMail({
          from: `"Les Talk" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Votre mot de passe a été modifié - Les Talk",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 450px; margin: 40px auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 16px;">Account Security</h2>
                <p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 24px;">Hello,</p>
                <p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin-bottom: 24px;">The password for your <strong>Les Talk</strong> account has been successfully changed.</p>
                <p style="font-size: 12px; color: #6b7280; line-height: 1.5;">If you made this change, no further action is required.</p>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                <p style="font-size: 12px; color: #dc2626; line-height: 1.5; font-weight: 500;">If you did not request this change, please contact our support immediately or secure your email address.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error(
          "Erreur lors de l'envoi de l'email de confirmation :",
          emailError,
        );
      }
    },
  },

  // Configuration pour l'envoi de l'email de vérification lors de l'inscription
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
        input: true,
      },
      lastActiveAt: {
        type: "date",
        required: false,
        input: false, // Évite que l'utilisateur puisse le modifier lui-même à l'inscription
      },
    },
    // Configuration de changement d'email
    changeEmail: {
      enabled: true,
      sendVerificationEmail: async ({
        user,
        newEmail,
        url,
        token,
      }: {
        user: any;
        newEmail: string;
        url: string;
        token: string;
      }) => {
        await transporter.sendMail({
          from: `"Les Talk" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Approve email change - Les Talk",
          text: `Click the link to approve the change to ${newEmail}: ${url}`,
        });
      },
    },
  },

  // Configuration de la session
  session: {
    expiresIn: 60 * 60 * 24 * 3,
    updateAge: 60 * 60 * 24,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    tiktok: {
      clientKey: process.env.TIKTOK_CLIENT_KEY as string,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
    },
  },
});

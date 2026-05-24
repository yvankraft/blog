import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// Importe l'instance prisma depuis ton fichier de configuration
import { prisma } from "./db"; 

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
    }
});
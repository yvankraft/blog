import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Séparation en fonctions distinctes pour tes boutons
const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google", // Un seul fournisseur ici
    callbackURL: "/",
  });
};

const signInWithTiktok = async () => {
  await authClient.signIn.social({
    provider: "tiktok", // Nécessite d'avoir configuré le plugin générique dans ton backend
    callbackURL: "/",
  });
};

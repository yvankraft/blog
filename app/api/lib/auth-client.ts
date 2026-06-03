import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "/api/auth",
});

// Séparation en fonctions distinctes pour tes boutons
export const signInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google", // Un seul fournisseur ici
    callbackURL: "/",
  });
};

export const signInWithTiktok = async () => {
  await authClient.signIn.social({
    provider: "tiktok", // Nécessite d'avoir configuré le plugin générique dans ton backend
    callbackURL: "/",
  });
};

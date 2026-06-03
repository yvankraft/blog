import OnboardingSurvey from "../signup/OnboardingSurvey";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/db";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si l'utilisateur n'est pas connecté, retour au login
  if (!session || !session.user) {
    redirect("/login");
  }

  // Si l'utilisateur a déjà rempli son sondage, on l'envoie direct à l'accueil
  const hasPreferences = await prisma.userPreference.findUnique({
    where: { userId: session.user.id },
  });

  if (hasPreferences) {
    redirect("/");
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0d0e12] flex items-center justify-center p-4 antialiased">
      <OnboardingSurvey />
    </div>
  );
}

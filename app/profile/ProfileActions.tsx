"use client";

import { useState } from "react";
import { authClient } from "@/app/api/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import Modal from "../components/Modal";

export default function ProfileActions() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [requiredText, setRequiredText] = useState(""); // 👈 État pour stocker le code aléatoire
  const [step, setStep] = useState<"input" | "goodbye">("input");

  // 🎲 Fonction pour générer un code de sécurité aléatoire
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
    setLoading(false);
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationText !== requiredText) return; // 👈 Vérification avec le code dynamique

    setLoading(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        await authClient.signOut();
        setStep("goodbye");
      } else {
        alert("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRedirect = () => {
    setIsModalOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100 dark:border-gray-900">
      <button
        onClick={handleSignOut}
        disabled={loading}
        className="flex items-center justify-center gap-2 text-xs font-medium border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition text-gray-600 dark:text-gray-300 disabled:opacity-50"
      >
        <LogOut size={14} />
        Log Out
      </button>

      <button
        onClick={() => {
          setStep("input");
          setConfirmationText("");
          setRequiredText(generateRandomCode()); // 👈 Génère un nouveau code à l'ouverture
          setIsModalOpen(true);
        }}
        disabled={loading}
        className="flex items-center justify-center gap-2 text-xs font-medium border border-transparent rounded-lg px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition disabled:opacity-50 sm:ml-auto"
      >
        <Trash2 size={14} />
        Delete Account
      </button>

      <Modal
        isOpen={isModalOpen}
        title={step === "input" ? "Delete Account" : "Account Deleted"}
        onClose={
          step === "input" ? () => setIsModalOpen(false) : handleFinalRedirect
        }
      >
        {step === "input" ? (
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              This action is{" "}
              <span className="font-semibold text-red-600">permanent</span>. To
              confirm you really want to delete your account, type the security
              code{" "}
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-bold text-red-600 dark:text-red-400 text-xs tracking-wider">
                {requiredText}
              </span>{" "}
              below.
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={requiredText}
              className="w-full border-b border-gray-200 dark:border-gray-800 bg-transparent text-sm py-2 focus:outline-none focus:border-black dark:focus:border-white transition placeholder-gray-400 font-mono tracking-wider uppercase"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={confirmationText !== requiredText || loading}
                className="text-xs font-medium px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-30"
              >
                {loading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Your account has been successfully removed. We're sad to lose you
              as a user. A confirmation email has been sent to your inbox.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleFinalRedirect}
                className="text-xs font-medium px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

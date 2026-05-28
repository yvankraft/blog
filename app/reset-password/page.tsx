"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Ajoute useSearchParams
import { authClient } from "@/app/api/lib/auth-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  // Récupère le token depuis l'URL (?token=...)
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      setLoading(false);
      return;
    }

    await authClient.resetPassword(
      {
        newPassword: password,
        token: token, // Transmet explicitement le token ici
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          setSuccess(true);
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message || "Failed to reset password.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen grid items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="title text-3xl font-bold">New Password</h1>
          <p className="text-sm text-gray-500">
            Please enter your new password below.
          </p>
        </div>

        {success ? (
          <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            Your password has been reset successfully! Redirecting to login
            page...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-2 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Resetting password..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/app/api/lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    await authClient.requestPasswordReset(
      {
        email,
        redirectTo: "/reset-password",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          setSuccess(true);
          setError("");
        },
        onError: (ctx) => {
          setLoading(false);
          setSuccess(false);
          setError("This email does not match any account.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen grid items-center justify-center p-4">
      <Link href="/" className="btn-primary absolute top-10 left-4">
        /home
      </Link>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="title text-3xl font-bold">Forgot Password</h1>
          <p className="text-sm text-gray-500">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {error ? (
          <div className="p-3 text-sm text-red-600 rounded-2xl bg-red-50 border border-red-200 space-y-2">
            <p>This email does not match any account.</p>
            <Link
              href="/signup"
              className="block text-center font-medium underline text-red-700 hover:text-red-800"
            >
              create an account
            </Link>
          </div>
        ) : success ? (
          <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
            Check your email inbox! We have sent you a link to reset your
            password.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white p-2 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send reset link"}
            </button>
          </form>
        )}

        <div className="text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

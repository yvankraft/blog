"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      reason: formData.get("reason"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsModalOpen(true);
        e.currentTarget.reset();
      } else {
        alert("An error occurred while sending your feedback.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 relative">
      <div className="w-full max-w-xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 sm:text-5xl">
            Can we do better?
          </h1>
          <p className="text-gray-500 text-lg">
            Please let us know honestly why you are leaving.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Primary Reason
            </label>
            <select
              name="reason"
              className="w-full bg-gray-50 dark:bg-zinc-900 border-none ring-1 ring-gray-200 dark:ring-zinc-800 rounded-xl p-4 text-base focus:ring-2 focus:ring-black dark:focus:ring-white transition-all appearance-none"
              required
            >
              <option value="too-complex">The interface is too complex</option>
              <option value="missing-features">
                It's missing key features
              </option>
              <option value="other">Other personal reasons</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Your Message
            </label>
            <textarea
              name="message"
              rows={5}
              className="w-full bg-gray-50 dark:bg-zinc-900 border-none ring-1 ring-gray-200 dark:ring-zinc-800 rounded-xl p-4 text-base focus:ring-2 focus:ring-black dark:focus:ring-white transition-all resize-none"
              placeholder="What could we have changed to keep you?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full group flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit Feedback"}
            {!loading && (
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl p-8 max-w-md w-full text-center relative shadow-xl animate-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={32} />
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Thank you for your honesty!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Your feedback has been sent directly to our management team to
              help us improve Les Talk.
            </p>

            <button
              onClick={handleCloseModal}
              className="w-full text-xs font-semibold py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl transition hover:opacity-90"
            >
              Go back home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

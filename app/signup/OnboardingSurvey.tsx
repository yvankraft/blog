"use client";

import { useState } from "react";
import { savePreferencesAction } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

import {
  Check,
  Sparkles,
  BrainCircuit,
  Rocket,
  Palette,
  Heart,
  Globe,
  Trophy,
} from "lucide-react";

const SURVEY_CATEGORIES = [
  {
    title: "AI & Digital Creation",
    icon: <BrainCircuit size={16} className="text-purple-500" />,
    tags: [
      { id: "gen-ai", label: "Generative AI" },
      { id: "content-creation", label: "Content Creation" },
      { id: "digital-art", label: "Digital Art & Design" },
      { id: "web3-metaverse", label: "Web3 & Metaverse" },
      { id: "software-eng", label: "Software Engineering" },
    ],
  },
  {
    title: "Global Entertainment",
    icon: <Palette size={16} className="text-pink-500" />,
    tags: [
      { id: "anime-manga", label: "Anime & Manga" },
      { id: "gaming-esports", label: "Gaming & Esports" },
      { id: "global-music", label: "Global Beats (Pop, Afrobeats, K-Pop)" },
      { id: "movies-binge", label: "Cinema & Binge-Watching" },
      { id: "streaming-live", label: "Live Streaming" },
    ],
  },
  {
    title: "Business & Side Hustles",
    icon: <Rocket size={16} className="text-blue-500" />,
    tags: [
      { id: "entrepreneurship", label: "Startups & Solopreneur" },
      { id: "remote-nomad", label: "Remote Work & Nomadism" },
      { id: "finance-crypto", label: "Personal Finance & Crypto" },
      { id: "side-projects", label: "Building Side Projects" },
      { id: "marketing-growth", label: "Digital Growth" },
    ],
  },
  {
    title: "Mindset & Wellness",
    icon: <Heart size={16} className="text-red-500" />,
    tags: [
      { id: "mental-health", label: "Mental Health & Balance" },
      { id: "productivity", label: "Productivity Hacks" },
      { id: "fitness-longevity", label: "Fitness & Longevity" },
      { id: "slow-living", label: "Slow Living & Mindfulness" },
    ],
  },
  {
    title: "Gastronomy & Travel",
    icon: <Globe size={16} className="text-emerald-500" />,
    tags: [
      { id: "world-cuisine", label: "Street Food & Gastronomy" },
      { id: "hidden-gems", label: "Local Tourism & Hidden Gems" },
      { id: "cafe-culture", label: "Cafe Culture & Aesthetics" },
      { id: "eco-travel", label: "Eco-Awareness" },
    ],
  },
  {
    title: "Sports & Live Events",
    icon: <Trophy size={16} className="text-orange-500" />,
    tags: [
      { id: "football-soccer", label: "Football (Soccer)" },
      { id: "basketball-nba", label: "Basketball & NBA" },
      { id: "mma-ufc", label: "Combat Sports (MMA)" },
      { id: "live-events", label: "Live Events Debrief" },
    ],
  },
  {
    title: "🎬 Entertainment & Culture",
    tags: [
      { id: "movies-series", label: "Cinema & Series" },
      { id: "gaming", label: "Gaming & Esports" },
      { id: "anime-manga", label: "Anime & Manga" },
      { id: "music-global", label: "Global Music" },
      { id: "afrobeats-vibes", label: "African Vibes (Afrobeats, Makossa...)" },
      { id: "podcasts", label: "Podcasts & Shows" },
    ],
  },
  {
    title: "💻 Tech, Code & Design",
    tags: [
      { id: "fullstack", label: "Web Dev (React, Next.js)" },
      { id: "mobile-dev", label: "Mobile Dev (React Native)" },
      { id: "ui-ux", label: "UI/UX Design" },
      { id: "ai-data", label: "AI & Data Science" },
      { id: "cybersecurity", label: "Cybersecurity & DevOps" },
      { id: "crypto-web3", label: "Crypto & Web3" },
    ],
  },
  {
    title: "🚀 Business, Career & Mindset",
    tags: [
      { id: "entrepreneurship", label: "Startups & Business" },
      { id: "freelancing-remote", label: "Freelancing & Remote" },
      { id: "marketing-com", label: "Marketing & Growth" },
      { id: "finance-investing", label: "Finance & Real Estate" },
      { id: "personal-growth", label: "Personal Growth" },
      { id: "side-projects", label: "Side Projects" },
    ],
  },
];

export default function OnboardingSurvey() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) return;
    setIsSubmitting(true);

    const result = await savePreferencesAction({ tags: selectedTags });
    if (result.success) {
      router.push("/");
    } else {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    const result = await savePreferencesAction({ tags: [] });
    if (result.success) {
      router.push("/");
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 bg-white dark:bg-[#1c1d22] shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-orange-500/10 text-orange-500 rounded-2xl mb-3">
          <Sparkles size={24} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Personalize Your Timeline
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
          Select what drives you. We use your interests to connect you with
          relevant people and global discussions.
        </p>
      </div>

      {/* Direct Grid Display (Like Version 1) */}
      <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2">
        {SURVEY_CATEGORIES.map((category) => (
          <div key={category.title} className="space-y-2.5">
            {category.icon}
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-1.5 px-3.5 p-2 rounded-2xl text-xs font-medium border transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10"
                        : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {tag.label}
                    {isSelected && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800/40 pt-6">
        <button
          onClick={handleSubmit}
          disabled={selectedTags.length === 0 || isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 p-3 rounded-2xl text-xs font-bold text-white transition shadow-lg shadow-orange-500/10 active:scale-98"
        >
          {isSubmitting
            ? "Setting up your timeline..."
            : `Explore Les Talk (${selectedTags.length} selected)`}
        </button>

        <button
          onClick={handleSkip}
          disabled={isSubmitting}
          className="w-full text-center text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 py-1 transition active:scale-95"
        >
          Not now
        </button>
      </div>
    </div>
  );
}

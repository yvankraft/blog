"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  ArrowUpRight,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const contactMethods = [
    {
      title: "Email Support",
      description: "Get technical help. We usually respond within 24 hours.",
      icon: <Mail size={24} />,
      link: "mailto:yvanngone53@gmail.com",
      label: "yvanngone53@gmail.com",
    },
    {
      title: "Direct Feedback",
      description: "Have a feature request or an idea? Share it with us.",
      icon: <MessageSquare size={24} />,
      link: "/feedback",
      label: "Share your thoughts",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "How do I reset my password?",
      answer:
        "Since we use secure email-based authentication, you can trigger a password reset link directly from the sign-in page by clicking on 'Forgot password'.",
    },
    {
      question: "Will my data be permanently deleted if I delete my account?",
      answer:
        "Yes. When you delete your account, all your profile information, sessions, and publications (Posts) are permanently wiped from our database instantly.",
    },
    {
      question: "Can I edit a post after publishing it?",
      answer:
        "Absolutely. Go to your profile page, find the post you want to modify, and click on the 'Edit' button to update its content.",
    },
    {
      question: "How can I report inappropriate content?",
      answer:
        "If you find a post that violates our community guidelines, please contact us directly via email at yvanngone53@gmail.com with the link to the publication.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 py-12 relative">
      <div className="w-full max-w-3xl">
        {/* Navigation / Back Home Button */}
        <div className="mb-12 self-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 sm:text-6xl">
            How can we help?
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Search our frequently asked questions or get in touch with our team.
          </p>
        </div>

        {/* 1. FAQ Section */}
        <div className="mb-20 w-full">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-100 dark:border-zinc-900 pb-4 transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left py-3 font-semibold text-lg text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-black dark:text-white" : ""}`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-2"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden text-gray-500 dark:text-gray-400 text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Contact Section */}
        <div className="border-t border-gray-100 dark:border-zinc-900 pt-16 w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Still need help?
            </h2>
            <p className="text-gray-500 text-sm">
              If you couldn't find an answer above, feel free to reach out
              directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method, i) => (
              <a
                key={i}
                href={method.link}
                className="group p-6 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl hover:border-black dark:hover:border-white transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gray-50 dark:bg-zinc-900 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  {method.title}
                  <ArrowUpRight
                    size={14}
                    className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                  {method.description}
                </p>
                <span className="text-xs font-semibold text-black dark:text-white underline underline-offset-4">
                  {method.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-24 text-center text-gray-400 text-xs tracking-widest uppercase">
          Les Talk — Community Management
        </p>
      </div>
    </div>
  );
}

import { Mail, MessageSquare, ArrowUpRight } from "lucide-react";

export default function SupportPage() {
  const contactMethods = [
    {
      title: "Email",
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

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 sm:text-6xl">
            How can we help?
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Whether you want to report a bug or have a question, our management
            team is here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactMethods.map((method, i) => (
            <a
              key={i}
              href={method.link}
              className="group p-8 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900 rounded-2xl hover:border-black dark:hover:border-white transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gray-50 dark:bg-zinc-900 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                {method.title}
                <ArrowUpRight
                  size={16}
                  className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {method.description}
              </p>
              <span className="text-sm font-semibold text-black dark:text-white underline underline-offset-4">
                {method.label}
              </span>
            </a>
          ))}
        </div>

        <p className="mt-16 text-center text-gray-400 text-sm tracking-widest uppercase">
          Les Talk — Community Management
        </p>
      </div>
    </div>
  );
}

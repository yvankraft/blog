"use client";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from "next/link";

export default function page() {
  return (
    <div className="h-screen grid sm:grid-cols-5 items-center justify-center p-4 px-12 gap-8 bg-white dark:bg-black text-black dark:text-white antialiased">
      <div className="col-span-2 max-w-md w-full justify-self-center p-4">
        <Link href="/" className="btn-primary transition w-24 ">
          /home
        </Link>
        <div className="flex items-center gap-2  mb-10">
          <MessageCircle size={16} className="text-gray-400" />
          <h3 className="font-medium tracking-tight text-sm text-gray-500 dark:text-gray-400">
            Les Talk
          </h3>
        </div>

        <h1 className="font-semibold text-5xl tracking-tight mb-8 leading-tight">
          Hi,
          <br /> Welcome Back
        </h1>
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full border-b border-gray-200 dark:border-gray-800 bg-transparent text-sm py-2 focus:outline-none focus:border-black dark:focus:border-white transition duration-300 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border-b border-gray-200 dark:border-gray-800 bg-transparent text-sm py-2 focus:outline-none focus:border-black dark:focus:border-white transition duration-300 placeholder-gray-400"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 accent-black dark:accent-white rounded border-gray-200"
              />
              <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition"
            >
              Forgot Password?
            </Link>
          </div>

          <button className="w-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium py-2.5 rounded-md mt-6 hover:opacity-90 transition">
            Login
          </button>

          {/* Séparateur Minimaliste */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-100 dark:border-gray-900"></div>
            <span className="px-3 text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
              Or
            </span>
            <div className="flex-grow border-t border-gray-100 dark:border-gray-900"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/50 text-xs font-medium text-gray-600 dark:text-gray-300 transition">
              <FcGoogle className="w-4 h-4" />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 dark:border-gray-800 rounded-md bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/50 text-xs font-medium text-gray-600 dark:text-gray-300 transition">
              <FaApple className="w-4 h-4 text-black dark:text-white" />
              Apple
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          Don’t Have An Account?{" "}
          <a
            href="/signup"
            className="text-black dark:text-white font-medium hover:underline ml-1"
          >
            Register Now.
          </a>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 200, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "none" }}
        transition={{ duration: 2 }}
        whileHover={{ scale: 1.005 }}
        className="mockup-browser flex flex-col border border-gray-300 dark:border-gray-900 h-full w-full col-span-3 bg-gray-50/50 dark:bg-gray-900/10 rounded-2xl overflow-hidden relative"
      >
        <motion.div
          initial={{ opacity: 0, x: 200, filter: "blur(20px)" }}
          animate={{ opacity: 1, x: 0, filter: "none" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mockup-browser-toolbar border-b p-2 border-gray-300 dark:border-gray-900"
        >
          <div className="input dark:border-gray-800 text-xs  text-gray-400 font-mono tracking-tight bg-white dark:bg-black">
            https://yvancorps.com
          </div>
        </motion.div>

        <div className="grid h-full w-auto place-content-center pt-2">
          <div className="card bg-white dark:bg-black h-full w-[75%] mx-auto rounded-xl border border-gray-300 dark:border-gray-900 overflow-hidden">
            <figure className="opacity-95 dark:opacity-80 transition hover:opacity-100">
              <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
                className="object-cover w-full h-44"
              />
            </figure>
            <div className="card-body p-6">
              <h2 className="card-title text-base font-semibold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                Publication Title
                <motion.div
                  animate={{ scale: [1, 1.1, 0.98, 1.1, 1, 1] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.15, 0.3, 0.45, 0.6, 1],
                  }}
                  className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase bg-black dark:bg-white text-white dark:text-black rounded"
                >
                  NEW
                </motion.div>
              </h2>
              <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500 mt-1">
                Create posts to share ideas, ask technical questions, and
                connect with the community.
              </p>
              <div className="card-actions justify-end mt-4 gap-1.5">
                <div className="px-2 py-0.5 border border-gray-100 dark:border-gray-900 text-[10px] text-gray-400 dark:text-gray-500 rounded font-medium">
                  Fashion
                </div>
                <div className="px-2 py-0.5 border border-gray-100 dark:border-gray-900 text-[10px] text-gray-400 dark:text-gray-500 rounded font-medium">
                  Products
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-0 w-full px-16 pb-4 space-y-1">
          <motion.div
            initial={{ opacity: 0, x: -200, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "none" }}
            transition={{ duration: 1, delay: 1 }}
            className="chat chat-start"
          >
            <div className="chat-header text-[11px] text-gray-400 dark:text-gray-500 font-medium">
              Obi-Wan Kenobi
              <time className="text-[10px] opacity-40 ml-1.5 font-mono">
                2h ago
              </time>
            </div>
            <div className="chat-bubble text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-lg rounded-tl-none mt-0.5">
              You were the Chosen One!
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -200, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "none" }}
            transition={{ duration: 1, delay: 1.5 }}
            className="chat chat-start"
          >
            <div className="chat-header text-[11px] text-gray-400 dark:text-gray-500 font-medium">
              Obi-Wan Kenobi
              <time className="text-[10px] opacity-40 ml-1.5 font-mono">
                2h ago
              </time>
            </div>
            <div className="chat-bubble text-xs bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-lg rounded-tl-none mt-0.5">
              I loved that shoes.
            </div>
          </motion.div>
        </div>

        {/* Floating Premium Card */}
        <div className="absolute card right-6 top-36 bg-white/80 dark:bg-black/80 backdrop-blur border border-gray-100 dark:border-gray-900 w-80 rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
            Hi guest!
          </h2>
          <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500 mt-1">
            Does anyone know how to sign up for the list of...
          </p>
          <div className="flex justify-end mt-4">
            <button className="bg-black dark:bg-white text-white dark:text-black text-xs font-medium px-3 py-1.5 rounded hover:opacity-90 transition">
              Publish
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

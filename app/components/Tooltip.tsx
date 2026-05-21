"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  text: string;
}

export const Tooltip = ({ children, text }: TooltipProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute -bottom-10 z-50 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
              color: "inherit",
            }}
          >
            {text}
            {/* Petite flèche optionnelle */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-t border-l border-white/20 bg-white/10 backdrop-blur-md" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

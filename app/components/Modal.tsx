"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom"; // 👈 1. Ajout de l'import pour le portail

interface ModalProps {
  isOpen: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  overlayClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  closeButtonClassName?: string;
}

export default function Modal({
  isOpen,
  title,
  children,
  footer,
  onClose,
  // 👈 2. Ajout de backdrop-blur-md pour le flou complet de la page
  overlayClassName = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4 w-screen h-screen",
  panelClassName = "w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden",
  headerClassName = "flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4",
  titleClassName = "text-lg font-semibold text-black dark:text-white",
  bodyClassName = "px-6 py-4 text-sm text-gray-500 dark:text-gray-400",
  footerClassName = "flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800 px-6 py-4 justify-end",
  closeButtonClassName = "rounded-md p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // 👈 3. Évite les erreurs d'hydratation (SSR) avec Next.js
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null; // 👈 4. Ne pas afficher si pas monté sur le client

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 👈 5. On enveloppe simplement ton JSX existant dans le createPortal
  return createPortal(
    <div
      className={overlayClassName}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={panelClassName}>
        {title && (
          <div className={headerClassName}>
            <div className={titleClassName}>{title}</div>
            <button
              type="button"
              className={closeButtonClassName}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className={bodyClassName}>{children}</div>

        {footer && <div className={footerClassName}>{footer}</div>}
      </div>
    </div>,
    document.body, // 👈 Cible de la téléportation
  );
}

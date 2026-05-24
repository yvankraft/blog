"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react'; // ✅ Icône de fermeture propre

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
  overlayClassName = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
  panelClassName = 'w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden',
  headerClassName = 'flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-4',
  titleClassName = 'text-lg font-semibold text-black dark:text-white',
  bodyClassName = 'px-6 py-4 text-sm text-gray-500 dark:text-gray-400',
  footerClassName = 'flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800 px-6 py-4 justify-end',
  closeButtonClassName = 'rounded-md p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition',
}: ModalProps) {
  
  // ✅ 1. Gestion de la touche Échap (Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // ✅ 2. Gestion du clic extérieur (uniquement sur l'overlay)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={overlayClassName} 
      role="dialog" 
      aria-modal="true"
      onClick={handleOverlayClick} // 👈 Déclenche la fermeture si on clique sur le fond
    >
      <div className={panelClassName}>
        {/* Header conditionnel : ne s'affiche que si un titre est fourni */}
        {title && (
          <div className={headerClassName}>
            <div className={titleClassName}>{title}</div>
            <button
              type="button"
              className={closeButtonClassName}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={16} /> {/* 👈 Icône Lucide propre au lieu du signe "×" */}
            </button>
          </div>
        )}
        
        <div className={bodyClassName}>{children}</div>
        
        {footer && <div className={footerClassName}>{footer}</div>}
      </div>
    </div>
  );
}
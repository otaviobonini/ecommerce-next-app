"use client";

import { createPortal } from "react-dom";
import { ReactNode } from "react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  children: ReactNode;
  portalId: string;
  className?: string;
}

export default function Modal({
  onClose,
  isOpen,
  children,
  portalId,
  className,
}: Props) {
  if (!isOpen) return null;

  // só roda no browser: modal aberto implica interação do usuário
  const portal = document.getElementById(portalId);
  if (!portal) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-80 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`p-6 ${className ?? "bg-white rounded-lg"}`}
      >
        {children}
      </div>
    </div>,
    portal,
  );
}
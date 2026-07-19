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
      className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90dvh] w-full overflow-y-auto p-6 ${
          className ?? "bg-white rounded-lg sm:max-w-lg"
        }`}
      >
        {children}
      </div>
    </div>,
    portal,
  );
}
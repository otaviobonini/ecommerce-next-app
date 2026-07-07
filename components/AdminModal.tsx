"use client";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function AdminModal({
  children,
  onClose,
  isOpen,
}: {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    function handlePortal() {
      const getPortal = document.getElementById("admin-modal");
      setPortal(getPortal);
    }
    handlePortal();
  }, []);

  if (!portal || !isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="bg-black/50 z-50 items-center flex justify-center fixed inset-0"
        onClick={onClose}
      >
        <div className="bg-white rounded-lg   z-60 p-6 shadow-xl">
          <div className="flex" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </div>
    </>,
    portal,
  );
}

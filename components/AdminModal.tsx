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
        <div className="bg-white rounded-lg z-60 p-6 shadow-xl min-w-[320px]">
          <div
            className="flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>{children}</div>

            <div className="flex justify-end  ">
              <button
                onClick={onClose}
                className="px-4 hover:cursor-pointer py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-150 active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    portal,
  );
}

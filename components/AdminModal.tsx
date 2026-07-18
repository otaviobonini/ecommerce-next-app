"use client";
import { ReactNode } from "react";
import Modal from "./Modal";

export default function AdminModal({
  children,
  onClose,
  isOpen,
}: {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      portalId="admin-modal"
      className="bg-white rounded-lg shadow-xl min-w-[320px]"
    >
      <div className="flex flex-col gap-4">
        {children}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 hover:cursor-pointer py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-colors duration-150 active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
}

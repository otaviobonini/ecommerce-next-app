"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AuthModal({ onSuccess, onClose, isOpen }: Props) {
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    setPortal(document.getElementById("auth-modal"));
  }, []);

  if (!isOpen || !portal) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-80 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-gray-100  min-h-8/12 min-w-4/12 p-6 rounded-lg   `}
      >
        <button onClick={onClose}>Voltar</button>
        {mode === "register" ? (
          <RegisterForm
            onSuccess={onSuccess}
            onSwitchToLogin={() => setMode("login")}
          />
        ) : (
          <LoginForm
            onSuccess={onSuccess}
            onSwitchToRegister={() => setMode("register")}
          />
        )}
      </div>
    </div>,
    portal,
  );
}

"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Modal from "../Modal";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AuthModal({ onSuccess, onClose, isOpen }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      portalId="auth-modal"
      className="bg-gray-100 rounded-lg min-h-8/12 min-w-4/12"
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
    </Modal>
  );
}

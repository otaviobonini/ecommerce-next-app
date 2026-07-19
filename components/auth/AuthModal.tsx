"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Modal from "../Modal";
import Button from "../Button";

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
      className="bg-gray-100 rounded-lg sm:max-w-md"
    >
      <Button variant="ghost" onClick={onClose}>
        ← Voltar
      </Button>
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

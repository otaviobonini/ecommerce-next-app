"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faSpinner,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function LogoutButton() {
  const { logout, token, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function onSuccess() {
    setIsOpen(false);
  }

  if (isLoading) {
    return <FontAwesomeIcon icon={faSpinner}></FontAwesomeIcon>;
  }

  if (!token) {
    return (
      <>
        <button
          className="flex items-center hover:cursor-pointer gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={faUser} />
          <span className="hidden sm:inline">Login</span>
        </button>

        <AuthModal isOpen={isOpen} onSuccess={onSuccess} onClose={onSuccess} />
      </>
    );
  }

  return (
    <button
      className="hidden md:flex items-center hover:cursor-pointer gap-1"
      onClick={logout}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}

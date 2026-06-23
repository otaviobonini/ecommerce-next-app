"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function LogoutButton() {
  const { logout, token } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  function onSuccess() {
    setIsOpen(false);
  }

  if (!token) {
    return (
      <>
        <button onClick={() => setIsOpen(!isOpen)}>
          {" "}
          <FontAwesomeIcon icon={faUser}></FontAwesomeIcon> Login
        </button>
        <AuthModal
          isOpen={isOpen}
          onSuccess={onSuccess}
          onClose={onSuccess}
        ></AuthModal>
      </>
    );
  }
  return (
    <button className="" onClick={logout}>
      <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon> Logout
    </button>
  );
}

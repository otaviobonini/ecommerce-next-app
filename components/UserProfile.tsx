"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { useState } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";

export default function UserProfile() {
  const { user } = useUser();
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const userLogo = user?.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  if (!token) return null;
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:cursor-pointer relative lg:w-12 lg:h-12 h-10 w-10 text-center content-center-safe bg-purple-600 rounded-full"
      >
        {userLogo}
      </button>
        <AnimatePresence >
      {isOpen && (
      <>
        <motion.div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 hover:cursor-default  z-50 flex items-center justify-center"
    ></motion.div>
        <motion.div transition={{ duration: 0.15 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}  onClick={(e) => e.stopPropagation()} className="absolute z-60 gap-2 flex flex-col top-16 text-black right-0 bg-white shadow-lg rounded-md p-4 w-48 z-50">
          <Link onClick={() => setIsOpen(false)} href={"/addresses"}>
            Endereços
          </Link>
          <hr className="border-gray-300"></hr>
          <Link onClick={() => setIsOpen(false)} href={"/orders"}>
            Pedidos
          </Link>
          <hr className="border-gray-300"></hr>
          <Link onClick={() => setIsOpen(false)} href={"/profile"}>
            Perfil
          </Link>
          
          {user?.role === "ADMIN" && (
            <>
              <hr className="border-gray-300"></hr>
              <Link onClick={() => setIsOpen(false)} href={"/admin"}>
                Admin
              </Link>
            </>
          )}
          <hr className="border-gray-300"></hr>
          <Button onClick={() => {
            logout();
            setIsOpen(false);
          }} variant="primary" size="sm" className="bg-gray-500 hover:bg-gray-600">
            Logout <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
          </Button>
        </motion.div>
        </>
       
      )}
       </AnimatePresence>
    </div>
  );
}

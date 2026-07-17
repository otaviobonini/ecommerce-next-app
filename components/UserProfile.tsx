"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { useState } from "react";

export default function UserProfile() {
  const { user } = useUser();
  const { token } = useAuth();
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
      {isOpen && (
        <>
        <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 hover:cursor-default  z-50 flex items-center justify-center"
    ></div>
        <div onClick={(e) => e.stopPropagation()} className="absolute z-60 gap-2 flex flex-col top-16 text-black right-0 bg-white shadow-lg rounded-md p-4 w-48 z-50">
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
        </div>
        </>
      )}
    </div>
  );
}

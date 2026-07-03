"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faBoxOpen,
  faRightFromBracket,
  faChevronRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";

const statusMap = {
  PENDING: "Pendente",
  PAID: "Pago",
  ONGOING: "Em andamento",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
} as const;

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      router.push("/");
    }
  }, [user, token, router]);

  if (!token || !user) {
    return <div className="p-4">Carregando...</div>;
  }
  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const defaultAddress = user.addresses.find((a) => a.isDefault);
  const lastOrder = [...user.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return (
    <div className="gap-6 p-4 ml-auto mr-auto lg:w-3xl flex flex-col">
      <h1 className="text-3xl">Meu Perfil</h1>

      <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
        <div className="lg:w-15 lg:h-15 h-12 w-12 shrink-0 text-center content-center-safe bg-purple-600 text-white rounded-full font-semibold">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-lg">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          {user.role === "ADMIN" && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-purple-100 text-purple-700 rounded-full px-2 py-0.5">
              <FontAwesomeIcon icon={faShieldHalved} />
              Administrador
            </span>
          )}
        </div>
      </div>

      <Link
        href="/addresses"
        className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faLocationDot} className="text-purple-600" />
          <div>
            <p className="font-medium">Endereços</p>
            <p className="text-sm text-gray-500">
              {user.addresses.length === 0
                ? "Nenhum endereço cadastrado"
                : defaultAddress
                  ? `Padrão: ${defaultAddress.street}, ${defaultAddress.city}`
                  : `${user.addresses.length} endereço(s) cadastrado(s)`}
            </p>
          </div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
      </Link>

      <Link
        href="/orders"
        className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faBoxOpen} className="text-purple-600" />
          <div>
            <p className="font-medium">Pedidos</p>
            <p className="text-sm text-gray-500">
              {user.orders.length === 0
                ? "Você ainda não fez nenhum pedido"
                : `Último: #${lastOrder!.orderId} · ${statusMap[lastOrder!.status]}`}
            </p>
          </div>
        </div>
        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
      </Link>
      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 mt-2 p-3 border border-red-200 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        Sair da conta
      </button>
    </div>
  );
}

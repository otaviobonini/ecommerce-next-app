"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faTags,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useAdmin } from "../context/AdminContext";

export default function AdminPage() {
  const {
    products,
    categories,
    orders,
    loadingProducts,
    loadingCategories,
    loadingOrders,
  } = useAdmin();

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const cards = [
    {
      href: "/admin/products",
      label: "Produtos cadastrados",
      value: products.length,
      loading: loadingProducts,
      icon: faBoxOpen,
    },
    {
      href: "/admin/categories",
      label: "Categorias",
      value: categories.length,
      loading: loadingCategories,
      icon: faTags,
    },
    {
      href: "/admin/orders",
      label: "Pedidos pendentes",
      value: pendingOrders,
      loading: loadingOrders,
      icon: faReceipt,
    },
  ];

  return (
    <div className="gap-6 p-4 ml-auto mr-auto lg:w-3xl flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900">Visão geral</h1>
      <p className="mt-1 text-gray-500">
        Gerencie produtos, categorias e acompanhe os pedidos da loja.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-purple-50 p-3 text-purple-700">
                <FontAwesomeIcon icon={card.icon} className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {card.loading ? "…" : card.value}
            </p>
            <p className="mt-1 text-sm text-gray-500">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useAdmin } from "@/app/context/AdminContext";
import { getPrimaryImage } from "@/app/services/product.service";
import CreateProductForm from "@/components/admin/CreateProductForm";
import AdminModal from "@/components/AdminModal";
import {
  faTrash,
  faStar,
  faEdit,
  faAdd,
  faTentArrowTurnLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductsPage() {
  const { products, categories, loadingProducts, deleteProduct } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="gap-6 p-4 flex flex-col max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
      <div className="flex items-center">
        <Link
          className="flex items-center hover:bg-gray-400 p-2 rounded-4xl transition-colors duration-500 gap-2"
          href="/admin"
        >
          <FontAwesomeIcon icon={faTentArrowTurnLeft}></FontAwesomeIcon>Voltar
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="flex gap-2 items-center ml-auto rounded-4xl bg-blue-600 p-2 text-white hover:cursor-pointer hover:bg-blue-700 transition-colors duration-500 "
        >
          Adicionar Produto <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
      {loadingProducts ? (
        <p className="text-gray-500">Carregando...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li key={product.productId}>
              <div
                className={`relative border ${
                  product.isFeatured
                    ? "border-yellow-400 ring-1 ring-yellow-300"
                    : "border-gray-200"
                } bg-white rounded-md shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3`}
              >
                {product.isFeatured && (
                  <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                    Destaque
                  </span>
                )}

                <Image
                  className="rounded-lg object-cover w-full h-40"
                  alt={product.productName}
                  src={getPrimaryImage(product)}
                  width={200}
                  height={200}
                />

                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product.productName}
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-4">
                    {product.productDescription}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-700 border-gray-200 border-t pt-2">
                  <span className="font-semibold text-xl text-gray-900">
                    R${" "}
                    {Number(product.productPrice).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="font-medium text-gray-400">
                    Estoque: {product.stock}
                  </span>
                </div>

                <span className="text-xs text-gray-400">
                  Categoria:{" "}
                  {categories.find((c) => c.categoryId === product.categoryId)
                    ?.name || "Sem categoria"}
                </span>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => deleteProduct(product.productId)}
                    aria-label="Remover item"
                    className="flex-1 flex items-center justify-center gap-1 h-9 rounded-md border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Remover
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 h-9 rounded-md border border-blue-200 bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition-colors cursor-pointer">
                    <FontAwesomeIcon icon={faEdit} />
                    Editar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreateProductForm></CreateProductForm>
      </AdminModal>
    </div>
  );
}

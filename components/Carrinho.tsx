"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/app/context/CartContext";
import CartProduct from "./CartProduct";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import AuthModal from "./auth/AuthModal";
import { redirect, useRouter } from "next/navigation";

export default function Carrinho() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {
    items,
    totalItems,
    totalPrice,
    isOpen,
    finishCart,
    openCart,
    closeCart,
  } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  async function handleCheckout() {
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    await finishCart(token);
    router.push("/checkout");
  }
  return (
    <>
      <button onClick={openCart} className="flex gap-5 hover:cursor-pointer">
        <div className="relative">
          <FontAwesomeIcon className="h-7 w-7 mr-2" icon={faCartShopping} />

          <span className="absolute right-0 top-0 font-light -translate-y-4 translate-x-4 bg-purple-700 rounded-4xl px-2">
            {totalItems}
          </span>
        </div>
        <span className="hidden md:inline">Carrinho</span>
      </button>
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed top-0 right-0 transition-transform hover:cursor-default ease-in-out duration-200 overflow-auto z-50 h-full w-80 md:w-96 bg-white text-black shadow-2xl p-6 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={closeCart}
          aria-label="Fechar carrinho"
          className="text-white hover:cursor-pointer bg-black rounded-xl p-2 mb-2  hover:text-black transition-colors "
        >
          Fechar
        </button>
        {items.length === 0 && (
          <div>
            <h1>Adicione algum item ao carrinho para continuar</h1>
          </div>
        )}

        {items.map((item) => (
          <CartProduct
            quantity={item.quantity}
            key={item.productId}
            productId={item.productId}
            img={item.imageUrl}
            name={item.productName}
            price={item.productPrice * item.quantity}
          />
        ))}
        <p className="font-semibold text-2xl mt-8 text-center">
          Total:{" "}
          {Number(totalPrice).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </p>
        <button
          onClick={handleCheckout}
          className="hover:cursor-pointer bg-black w-full hover:bg-gray-900 text-white rounded-xl my-8 p-4"
        >
          Finalizar compra
        </button>
      </div>
      <AuthModal
        onSuccess={() => {
          setShowAuthModal(false);
          finishCart(token!);
          router.push("/checkout");
        }}
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
        }}
      ></AuthModal>
    </>
  );
}

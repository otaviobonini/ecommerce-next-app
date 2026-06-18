"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "@/app/context/CartContext";
import { useState } from "react";
import CartProduct from "./CartProduct";

export default function Carrinho() {
  const { items, totalItems } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="flex gap-5 hover:cursor-pointer"
      >
        <div className="relative">
          <FontAwesomeIcon className="h-7 w-7 mr-2" icon={faCartShopping} />

          <span className="absolute right-0 top-0 font-light -translate-y-4 translate-x-4 bg-purple-700 rounded-4xl px-2">
            {totalItems}
          </span>
        </div>
        <span className="hidden md:inline">Carrinho</span>
      </button>

      <div
        className={`fixed top-0 right-0 transition-transform ease-in-out duration-200 z-50 h-full w-100 bg-white text-black shadow-2xl p-6 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {items.map((item) => (
          <CartProduct
            quantity={item.quantity}
            key={item.productId}
            productId={item.productId.toString()}
            img={item.imageUrl}
            name={item.productName}
            price={item.productPrice}
          />
        ))}
      </div>
    </>
  );
}

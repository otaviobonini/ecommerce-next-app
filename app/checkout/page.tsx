"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { CartItemWithProduct } from "@/schemas/cart.schema";

export default function CheckoutPage() {
  const { getCartItems } = useCart();
  const { token } = useAuth();
  const [cart, setCart] = useState<CartItemWithProduct[]>([]);

  useEffect(() => {
    async function cartItem() {
      const res = await getCartItems(token!);
      setCart(res);
    }
    cartItem();
  }, [token]);

  return (
    <div className="p-8">
      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex gap-5 rounded-2xl bg-gray-300 border-1 "
        >
          <Image
            alt=""
            src={item.product.images[0].url}
            width={150}
            height={150}
          ></Image>
          <div>
            <h1>{item.product.productName}</h1>
            <p>Quantidade: {item.quantity}</p>
            <p>
              {" "}
              {Number(item.product.productPrice).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

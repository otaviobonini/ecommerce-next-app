"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items } = useCart();
  return (
    <div className="p-8">
      {items.map((item) => (
        <div key={item.productId} className="flex gap-5 rounded-2xl ">
          <Image alt="" src={item.imageUrl} width={150} height={150}></Image>
          <div>
            <h1>{item.productName}</h1>
            <p>Quantidade: {item.quantity}</p>
            <p>
              {" "}
              {item.productPrice.toLocaleString("pt-BR", {
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

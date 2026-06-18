"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface productsType {
  img: string;
  name: string;
  price: number;
  productId: string;
}

export default function CartProduct({
  img,
  name,
  price,
  productId,
  quantity,
}: productsType) {
  const { updateQuantity } = useCart();

  function handleQuantity() {
    updateQuantity(productId, 2);
  }
  return (
    <div
      id={productId}
      className="shrink-0 p-4 max-w-fit hover:border hover:shadow-md border border-transparent hover:border-gray-200 rounded-lg transition-all duration-300  flex flex-col "
    >
      <Image
        src={img}
        width={200}
        height={100}
        alt=""
        className="h-48 w-48 rounded-lg lg:h-48 lg:w-48"
      ></Image>
      <h1 className=" text-gray-400 py-4">{name}</h1>
      <h1>{quantity}</h1>
      <p className="text-xl font-bold ">R$ {price.toFixed(2)}</p>
      <div className="flex  gap-4 py-6">
        <p>Quantidade:</p>{" "}
        <button
          className="cursor-pointer"
          onClick={() => setCounter((prev) => Math.max(1, prev - 1))}
        >
          -
        </button>{" "}
        <p>{quantity}</p>{" "}
        <button className="cursor-pointer " onClick={handleQuantity}>
          +
        </button>
      </div>
    </div>
  );
}

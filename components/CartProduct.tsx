"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

interface productsType {
  img: string;
  name: string;
  price: number;
  productId: number;
  quantity: number;
}

export default function CartProduct({
  img,
  name,
  price,
  productId,
  quantity,
}: productsType) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div
      id={productId.toString()}
      className="shrink-0  p-4 max-w-fit hover:border hover:shadow-md border border-transparent hover:border-gray-200 rounded-lg transition-all duration-300  flex flex-col "
    >
      <Image
        src={img}
        width={200}
        height={100}
        alt=""
        className="h-32 w-32 rounded-lg lg:h-48 lg:w-48"
      ></Image>
      <h1 className=" text-gray-400 py-4">{name}</h1>
      <p className="text-xl font-bold ">R$ {price.toFixed(2)}</p>
      <div className="flex  gap-4 py-6">
        <button
          className="cursor-pointer"
          onClick={() => updateQuantity(productId, quantity - 1)}
        >
          -
        </button>{" "}
        <p>{quantity}</p>{" "}
        <button
          className="cursor-pointer "
          onClick={() => updateQuantity(productId, quantity + 1)}
        >
          +
        </button>
        <button
          className="hover:cursor-pointer"
          onClick={() => removeItem(productId)}
        >
          Remover
        </button>
      </div>
    </div>
  );
}

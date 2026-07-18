"use client";
import { useCart } from "@/app/context/CartContext";
import Button from "@/components/Button";
import { formatPrice } from "@/app/utils/formatPrice";
import Image from "next/image";
import { useState } from "react";

interface ProductDisplayInterface {
  productId: number;
  productName: string;
  productPrice: string;
  productDescription: string | null;
  stock: number;
  isFeatured: boolean;
  categoryId: number;
  images: {
    imageId: number;
    productId: number;
    url: string;
    isPrimary: boolean;
  }[];
}

export default function ProductDisplay({
  productId,
  productName,
  productPrice,
  productDescription = "",
  stock,
  isFeatured,
  images,
}: ProductDisplayInterface) {
  const [counter, setCounter] = useState(1);
  const { addItem, openCart } = useCart();

  function handleAddToCart() {
    addItem({
      productId,
      productName,
      productPrice: Number(productPrice),
      imageUrl: primaryImage?.url ?? "",
      quantity: counter,
    });
    openCart();
  }

  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];
  const [selectedImage, setSelectedImage] = useState(primaryImage);

  return (
    <div className="mx-auto max-w-6xl p-6 md:grid md:grid-cols-2 md:gap-16 md:p-12 md:items-start">
      {/* Coluna da esquerda — Fotos */}
      <div className="mb-12  mx-auto p-4">
        {selectedImage && (
          <div className="w-full  rounded-xl ">
            <Image
              className="w-full h-80 object-fill p-6"
              src={selectedImage.url}
              alt={productName}
              width={600}
              height={600}
            />
          </div>
        )}
        <div className="flex gap-3 mt-4">
          {images.map((image) => (
            <Image
              key={image.imageId}
              src={image.url}
              alt={productName}
              width={50}
              height={50}
              onClick={() => setSelectedImage(image)}
              className={`rounded-lg object-cover cursor-pointer ${selectedImage === image ? "border-black border-2 " : ""}`}
            />
          ))}
        </div>
      </div>
      {/* Coluna direita — informações */}
      <div className="flex flex-col p-4">
        <p className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-1">
          {isFeatured ? "Destaque" : "Novo"}
        </p>
        <h1 className="text-2xl py-1 font-semibold">{productName}</h1>
        <p className={stock > 0 ? "text-brand" : "text-red-500"}>
          {stock > 0 ? "Disponivel em estoque" : "Fora de estoque"}
        </p>

        <p className="text-gray-400 py-4">
          Preço:{" "}
          <span className="text-2xl ml-2 font-semibold text-black">
            {formatPrice(productPrice)}
          </span>
        </p>
        <div className="flex  gap-4 py-6">
          <p>Quantidade:</p>{" "}
          <button
            className="cursor-pointer"
            onClick={() => setCounter((prev) => Math.max(1, prev - 1))}
          >
            -
          </button>{" "}
          <p>{counter}</p>{" "}
          <button
            className="cursor-pointer "
            onClick={() => setCounter((prev) => Math.min(stock, prev + 1))}
          >
            +
          </button>
        </div>
        <Button size="lg" className="w-full my-8" onClick={handleAddToCart}>
          Adicionar ao carrinho
        </Button>
        <p className="font-semibold py-2">Descrição do produto</p>
        <p>{productDescription}</p>
      </div>
    </div>
  );
}

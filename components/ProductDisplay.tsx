"use client";
import Image from "next/image";
import { useState } from "react";

interface ProductDisplayInterface {
  productId: number;
  productName: string;
  productPrice: string;
  productDescription: string;
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
  productName,
  productPrice,
  productDescription,
  stock,
  isFeatured,
  images,
}: ProductDisplayInterface) {
  const [counter, setCounter] = useState(1);

  const primaryImage = images.find((image) => image.isPrimary) ?? images[0];
  const [selectedImage, setSelectedImage] = useState(primaryImage);

  return (
    <div className="p-12">
      <div className="mb-12 max-w-96 mx-auto ">
        {selectedImage && (
          <Image
            className="w-full max-w-sm max-h-48 object-contain mx-auto rounded-xl "
            src={selectedImage.url}
            alt={productName}
            width={400}
            height={400}
          />
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
              className="rounded-lg object-cover cursor-pointer"
            />
          ))}
        </div>
      </div>
      <p className="text-gray-400">Novo</p>
      <h1 className="text-2xl py-1 font-semibold">{productName}</h1>
      <p className={stock > 0 ? "text-blue-500" : "text-red-500"}>
        {stock > 0 ? "Disponivel em estoque" : "Fora de estoque"}
      </p>

      <p className="text-gray-400 py-4">
        Preço:{" "}
        <span className="text-2xl ml-2 font-semibold text-black">
          R${" "}
          {Number(productPrice).toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}
        </span>
      </p>
      <div className="flex  gap-4 py-6">
        <p>Quantidade:</p>{" "}
        <button onClick={() => setCounter((prev) => Math.max(1, prev - 1))}>
          -
        </button>{" "}
        <p>{counter}</p>{" "}
        <button onClick={() => setCounter((prev) => Math.min(stock, prev + 1))}>
          +
        </button>
      </div>
      <button className="bg-black w-full hover:bg-gray-900 text-white rounded-xl my-8 p-4">
        Adicionar ao carrinho
      </button>
      <p className="font-semibold py-2">Descrição do produto</p>
      <p>{productDescription}</p>
    </div>
  );
}

"use client";

import { useAdmin } from "@/app/context/AdminContext";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

type ImageSlot = {
  file: File | null;
  preview: string | null;
};

const EMPTY_SLOT: ImageSlot = { file: null, preview: null };

export default function CreateProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<ImageSlot[]>([]);

  const [featured, setFeatured] = useState(false);
  const {
    createProduct,
    categories,
    uploadProductImage,
    setPrimaryProductImage,
  } = useAdmin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const product = await createProduct({
      productName: name,
      productPrice: Number(price),
      stock: Number(initialStock),
      isFeatured: featured,
      productDescription: description,
      categoryId: Number(category),
    });

    for (let i = 0; i < images.length; i++) {
      const uploadedImage = await uploadProductImage(
        product.productId,
        images[i].file,
      );

      if (i === 0) {
        await setPrimaryProductImage(product.productId, uploadedImage.imageId);
      }
    }
  }
  return (
    <div className="p-8 flex flex-col">
      {" "}
      <h2 className="text-xl text-center ">Novo Produto</h2>
      <form onSubmit={handleSubmit} className="flex flex-col  gap-5 mt-5">
        <div className="relative">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder=" "
            className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
          />
          <label
            htmlFor="name"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
          >
            Nome do produto
          </label>
        </div>
        <div className="relative">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder=" "
            className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
          />
          <label
            htmlFor="description"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
          >
            Descrição
          </label>
        </div>
        <div className="relative">
          <input
            id="initialStock"
            type="number"
            value={initialStock}
            onChange={(e) => setInitialStock(e.target.value)}
            required
            placeholder=" "
            className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
          />
          <label
            htmlFor="initialStock"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
          >
            Estoque inicial
          </label>
        </div>

        <div className="relative">
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder=" "
            className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
          />
          <label
            htmlFor="price"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
          >
            Preço
          </label>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5 rounded border-gray-300 "
          />
          <label htmlFor="featured" className="text-gray-700">
            Produto destaque
          </label>
        </div>

        <select
          onChange={(e) => setCategory(e.target.value)}
          id="categories"
          value={category}
          className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
        >
          <option selected>Escolha a categoria do produto</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          disabled={images.length >= 3}
          accept=".jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setImages((prev) => [
              ...prev,
              {
                file,
                preview: URL.createObjectURL(file),
              },
            ]);
          }}
        />
        <h1>Escolha até 3 fotos para seu produto.</h1>
        <div className="flex gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-28 w-28 overflow-hidden rounded-lg border border-gray-300 bg-gray-100 shadow-sm"
            >
              <Image
                src={image.preview!}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />

              <button
                type="button"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

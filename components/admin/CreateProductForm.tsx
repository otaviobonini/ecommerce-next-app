"use client";

import { useAdmin } from "@/app/context/AdminContext";
import ErrorAlert from "@/components/ErrorAlert";

import { Product, ProductImage } from "@/schemas/product";
import Image from "next/image";
import { useEffect, useState } from "react";

type ImageSlot = {
  file: File | null;
  preview: string | null;
};

interface CreateProductFormProps {
  editingProduct?: Product | null;
  onSuccess: () => void;
}

export default function CreateProductForm({
  editingProduct,
  onSuccess,
}: CreateProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [images, setImages] = useState<ImageSlot[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>();

  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featured, setFeatured] = useState(false);

  function toggleRemoveExistingImage(imageId: number) {
    setImagesToRemove((prev) => [...prev, imageId]);
  }

  const {
    createProduct,
    categories,
    uploadProductImage,
    updateProduct,
    setPrimaryProductImage,
    deleteProductImage,
  } = useAdmin();

  useEffect(() => {
    if (!editingProduct) {
      async function resetForm() {
      setName("");
      setDescription("");
      setInitialStock("");
      setPrice("");
      setCategory(undefined);
      setFeatured(false);
      setProductImages([]);
      setImages([]);
      setImagesToRemove([]);
      return;}
      resetForm();
    }
    if (editingProduct) {
      async function populateForm() {
      const product = editingProduct;
      if (!product) return;

      setName(product.productName ?? "");
      setDescription(product.productDescription ?? "");
      setInitialStock(String(product.stock ?? ""));
      setPrice(String(product.productPrice ?? ""));
      setCategory(
        product.categoryId
          ? String(product.categoryId)
          : undefined,
      );
      setFeatured(product.isFeatured ?? false);
      setProductImages(product.images ?? []);
    }
    populateForm();
  }
  }, [editingProduct]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); // limpa o erro da tentativa anterior
    setIsSubmitting(true);

    try {
      if (!editingProduct) {
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
            images[i].file!,
          );

          if (i === 0) {
            await setPrimaryProductImage(
              product.productId,
              uploadedImage.imageId,
            );
          }
        }
      } else {
        const product = await updateProduct(editingProduct.productId, {
          productName: name,
          productPrice: Number(price),
          stock: Number(initialStock),
          isFeatured: featured,
          productDescription: description,
          categoryId: Number(category),
        });
        for (let i = 0; i < imagesToRemove.length; i++) {
          await deleteProductImage(editingProduct.productId, imagesToRemove[i]);
        }
        for (let i = 0; i < images.length; i++) {
          await uploadProductImage(product.productId, images[i].file!);
        }
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar produto");
    } finally {
      setIsSubmitting(false); // reabilita o botão com ou sem erro
    }
  }
  return (
    <div className="p-8 flex flex-col">
      {" "}
      <h2 className="text-xl text-center ">
        {editingProduct ? "Editar produto" : "Novo Produto"}
      </h2>
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
          value={category ?? ""}
          required
          className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
        >
          <option value="" disabled>
            Escolha a categoria do produto
          </option>
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
          {productImages?.map((image) => {
            const marcadaParaRemover = imagesToRemove.includes(image.imageId);
            return (
              <div
                key={image.imageId}
                className={`relative h-28 w-28 overflow-hidden rounded-lg border bg-gray-100 shadow-sm ${
                  marcadaParaRemover ? "hidden" : "border-gray-300"
                }`}
              >
                <Image
                  src={image.url}
                  alt="Imagem do produto"
                  className="object-cover w-full h-full"
                />
                {image.isPrimary && !marcadaParaRemover && (
                  <span className="absolute left-1 top-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Principal
                  </span>
                )}
                <button
                  onClick={() => toggleRemoveExistingImage(image.imageId)}
                  type="button"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            );
          })}
          {images.map((image, index) => (
            <div
              key={index}
              className="relative h-28 w-28 overflow-hidden rounded-lg border border-gray-300 bg-gray-100 shadow-sm"
            >
              <Image
                src={image.preview!}
                alt={`Preview ${index + 1}`}
                className="object-cover"
              />

              <button
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                type="button"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        <button
          type="submit"
          disabled={isSubmitting}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

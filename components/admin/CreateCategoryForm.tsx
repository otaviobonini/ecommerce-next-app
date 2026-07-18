"use client";

import { useAdmin } from "@/app/context/AdminContext";
import ErrorAlert from "@/components/ErrorAlert";
import { Category } from "@/schemas/product";
import Image from "next/image";
import {  useState } from "react";

type Image = {
  url: string;
  file: File;
};

export default function CreateCategoryForm({
  initialData,
  onSuccess,
}: {
  initialData?: Category;
  onSuccess?: () => void;
}) {
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCategory, uploadCategoryImage, editCategory } = useAdmin();
  const [name, setName] = useState(initialData?.name ?? "");
const [image, setImage] = useState<Image | undefined>(
  initialData?.categoryImage
    ? { file: null as unknown as File, url: initialData.categoryImage }
    : undefined,
);


  

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); // limpa o erro da tentativa anterior
    setIsSubmitting(true);

    try {
      if (!initialData) {
        const category = await createCategory({ name: name });
        if (image?.file) {
          await uploadCategoryImage(category.categoryId, image.file);
        }
      } else {
        const category = await editCategory(initialData.categoryId, {
          name: name,
        });
        if (image?.file) {
          await uploadCategoryImage(category.categoryId, image.file);
        }
      }
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar categoria");
    } finally {
      setIsSubmitting(false); // reabilita o botão com ou sem erro
    }
  }

  return (
    <div className="p-8 flex flex-col">
      <h2 className="text-xl text-center">Nova Categoria</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
        <div className="relative">
          <input
            id="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder=" "
            className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
          />

          <label
            htmlFor="categoryName"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
              peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
              peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
          >
            Nome da categoria
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="categoryImage"
            className="text-sm font-medium text-gray-700"
          >
            Foto da categoria
          </label>

          <input
            id="categoryImage"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setImage({
                file,
                url: URL.createObjectURL(file),
              });
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-white file:cursor-pointer hover:file:bg-gray-800"
          />
        </div>
        {image && (
          <div className="relative h-80 w-96 overflow-hidden rounded-lg border border-gray-300 bg-gray-100 shadow-sm">
            <Image
              src={image.url}
              alt="Preview da categoria"
              fill
              className="object-cover"
            />

            <button
              type="button"
              onClick={() => setImage(undefined)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        )}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-black py-3 text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}

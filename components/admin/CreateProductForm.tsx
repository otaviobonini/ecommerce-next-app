"use client";

import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";

export default function CreateProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState();
  const [featured, setFeatured] = useState(false);
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }
  function handleSubmit() {
    return;
  }
  return (
    <div>
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
        <input
          className=""
          onChange={(e) => handleImageChange(e)}
          type="file"
          accept=".jpg, .jpeg, .png"
        ></input>
        {preview ? (
          <Image
            alt="Prévia do produto"
            src={preview}
            width={400}
            height={400}
            className="rounded-md object-cover"
          />
        ) : (
          <div className="flex items-center justify-center rounded-md mx-auto bg-gray-300 h-[200px] w-[400px]">
            <FontAwesomeIcon
              icon={faPhotoFilm}
              className="text-5xl text-gray-500"
            />
          </div>
        )}
      </form>
    </div>
  );
}

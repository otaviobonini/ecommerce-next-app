"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { getProducts } from "@/app/services/product.service";
import { useEffect, useState } from "react";
import { Product } from "@/schemas/product";
import Image from "next/image";

export default function InputComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [text, setText] = useState("");
  const [filteredProductsList, setFilteredProductsList] = useState<Product[]>(
    [],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setText(value);

    if (!value.trim()) {
      setFilteredProductsList([]);
      return;
    }

    const filteredProducts = products.filter((product) =>
      product.productName.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredProductsList(filteredProducts);
  }

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data.products);
    }

    loadProducts();
  }, []);

  return (
    <>
      <div className="relative flex items-center -mt-16 lg:mt-0 ">
        <input
          id="searchbar"
          onChange={(e) => handleChange(e)}
          value={text}
          placeholder="O que está buscando?"
          className="bg-white order-2  placeholder:text-gray-500 text-black rounded-lg px-4 py-2   w-full md:w-3xl lg:w-250  "
          type="text"
        />

        <label
          htmlFor="searchbar"
          className="absolute right-3 text-purple-700 cursor-pointer"
        >
          <FontAwesomeIcon className="h-5 w-5" icon={faMagnifyingGlass} />
        </label>
      </div>
      {filteredProductsList.length !== 0 && (
        <div className="flex flex-col gap-2 z-40 w-11/12 md:w-3xl lg:w-250 absolute mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 ">
          {filteredProductsList.map((product) => (
            <div
              className="group flex items-center gap-4 p-2 rounded-lg transition-colors duration-150 hover:bg-purple-50 cursor-pointer"
              key={product.productId}
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  alt={product.productName}
                  src={product.images[0].url}
                />
              </div>
              <h1 className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                {product.productName}
              </h1>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

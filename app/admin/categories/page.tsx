"use client";

import { useAdmin } from "@/app/context/AdminContext";
import Categoria from "@/components/Categoria";
import { faEdit, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CategoriesPage() {
  const { categories } = useAdmin();
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl p-4 font-semibold">Categorias</h1>
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-24">
        {categories.map((category) => (
          <div className="relative" key={category.categoryId}>
            <div className="flex gap-4 mb-2 absolute -right-14">
              <button className="hover:cursor-pointer bg-blue-200 p-1 rounded-sm text-blue-500">
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
              </button>
              <button className="hover:cursor-pointer bg-red-200 p-1 rounded-sm text-red-500">
                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
              </button>
            </div>
            <Categoria
              categoryId={category.categoryId}
              img={category.categoryImage!}
              category={category.name}
            ></Categoria>
          </div>
        ))}
        <button
          type="button"
          className="h-32 w-32 md:h-48 md:w-48 rounded-full border-2 border-dashed border-gray-300
                     bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
                     transition-all duration-200 flex flex-col items-center justify-center
                     gap-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="text-2xl" />
          <span className="text-sm font-medium">Nova categoria</span>
        </button>
      </div>
    </div>
  );
}

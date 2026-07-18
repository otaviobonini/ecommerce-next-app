"use client";

import { useAdmin } from "@/app/context/AdminContext";
import CreateCategoryForm from "@/components/admin/CreateCategoryForm";
import AdminModal from "@/components/AdminModal";
import Categoria from "@/components/Categoria";
import ErrorAlert from "@/components/ErrorAlert";
import { Category } from "@/schemas/product";
import {
  faEdit,
  faPlus,
  faTentArrowTurnLeft,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

export default function CategoriesPage() {
  const { categories, deleteCategory } = useAdmin();
  const [initialData, setInitialData] = useState<Category | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
 async function handleDelete(categoryId: number) {
    try {
      setError(null);
      await deleteCategory(categoryId);
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Erro ao excluir categoria");
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-full max-w-3xl my-8 flex  flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          {error && <ErrorAlert onClose={() => setError(null)} message={error}></ErrorAlert>}
        <Link
          href="/admin"
          className="inline-flex items-center w-24 gap-2 hover:bg-gray-400 p-2 rounded-4xl transition-colors duration-500"
        >
          <FontAwesomeIcon icon={faTentArrowTurnLeft} />
          Voltar
        </Link>
      </div>
   
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-24">
        {categories.map((category) => (
          <div className="relative" key={category.categoryId}>
            <div className="flex gap-4 mb-2 absolute -right-14">
              <button
                onClick={() => {
                  setInitialData(category);
                  setIsOpen(true);
                }}
                className="hover:cursor-pointer bg-brand/20 p-1 rounded-sm text-brand"
              >
                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
              </button>
              <button
                onClick={() => handleDelete(category.categoryId)}
                className="hover:cursor-pointer bg-red-200 p-1 rounded-sm text-red-500"
              >
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
          onClick={() => setIsOpen(true)}
          className="h-32 w-32 md:h-48 md:w-48 rounded-full border-2 border-dashed border-gray-300
                     bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
                     transition-all duration-200 flex flex-col items-center justify-center
                     gap-2 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="text-2xl" />
          <span className="text-sm font-medium">Nova categoria</span>
        </button>
      </div>
      <AdminModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreateCategoryForm
          onSuccess={() => setIsOpen(false)}
          initialData={initialData}
        ></CreateCategoryForm>
      </AdminModal>
    </div>
  );
}

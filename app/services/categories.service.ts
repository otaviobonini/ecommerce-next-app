import { Category } from "@/schemas/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Admin routes

export async function createCategory(
  token: string,
  data: {
    name: string;
  },
): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Erro ao criar categoria: ${res.status}`);
  }
  return res.json();
}

export async function deleteCategory(
  token: string,
  categoryId: number,
): Promise<void> {
  const res = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Erro ao excluir categoria ${categoryId}: ${res.status}`);
  }
}

export async function uploadCategoryImage(
  token: string,
  categoryId: number,
  file: File,
) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/categories/${categoryId}/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Erro ao enviar imagem da categoria");
  }

  return res.json();
}

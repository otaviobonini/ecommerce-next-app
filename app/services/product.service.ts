import {
  Product,
  ProductsResponse,
  Category,
  EditProductData,
} from "../../schemas/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// GET /categories/:categoryId/products → Product[]
export async function getCategory(categoryId: number): Promise<Product[]> {
  const res = await fetch(`${API_URL}/categories/${categoryId}/products`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar produtos da categoria: ${res.status}`);
  }
  return res.json();
}

// GET /products?limit=&offset= → ProductsResponse
export async function getProducts(
  limit = 10,
  offset = 0,
): Promise<ProductsResponse> {
  const res = await fetch(
    `${API_URL}/products?limit=${limit}&offset=${offset}`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) {
    throw new Error(`Erro ao buscar produtos: ${res.status}`);
  }
  return res.json();
}

// GET /categories → Category[]  (array direto, sem envelope)
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar categorias: ${res.status}`);
  }
  return res.json();
}

// GET /product/:productId → Product
export async function getProduct(productId: number): Promise<Product> {
  const res = await fetch(`${API_URL}/product/${productId}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar produto ${productId}: ${res.status}`);
  }
  return res.json();
}

// GET /categories/featured/products → Product[]
export async function getFeaturedProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/categories/featured/products`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Erro ao buscar produtos em destaque: ${res.status}`);
  }
  return res.json();
}

/** Retorna a URL da imagem primária, ou uma imagem fallback */
export function getPrimaryImage(product: Product): string {
  const primary = product.images.find((img) => img.isPrimary);
  return (
    primary?.url ?? product.images[0]?.url ?? "https://picsum.photos/400/400"
  );
}

// Rotas de ADMIN
// POST /products → Product
export async function createProduct(
  token: string,
  data: {
    productName: string;
    productPrice: number;
    stock: number;
    productDescription?: string;
    isFeatured?: boolean;
    categoryId?: number | null;
  },
): Promise<Product> {
  const res = await fetch(`${API_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Erro ao criar produto: ${res.status}`);
  }
  return res.json();
}

export async function updateProduct(
  token: string,
  productId: number,
  data: EditProductData,
): Promise<Product> {
  const res = await fetch(`${API_URL}/product/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Erro ao atualizar produto ${productId}: ${res.status}`);
  }
  return res.json();
}

export async function deleteProduct(
  token: string,
  productId: number,
): Promise<void> {
  const res = await fetch(`${API_URL}/product/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Erro ao excluir produto ${productId}: ${res.status}`);
  }
}

export async function uploadProductImage(
  token: string,
  productId: number,
  file: File,
) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/product/${productId}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Erro ao enviar imagem");
  }

  return res.json();
}

export async function deleteProductImage(
  token: string,
  productId: number,
  imageId: number,
) {
  const res = await fetch(`${API_URL}/product/${productId}/images/${imageId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir imagem");
  }
}

export async function setPrimaryProductImage(
  token: string,
  productId: number,
  imageId: number,
) {
  const res = await fetch(
    `${API_URL}/product/${productId}/images/${imageId}/primary`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Erro ao definir imagem primária");
  }
}

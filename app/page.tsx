import Carroussel from "@/components/Carroussel";
import Categoria from "@/components/Categoria";
import Product from "@/components/ProductCard";
import Link from "next/link";
import {
  getProducts,
  getPrimaryImage,
  getCategories,
} from "@/app/services/product.service";
import type { Product as ProductData, Category } from "@/schemas/product";

export default async function HomePage() {
  // fail-soft: API fora durante o build → página builda vazia e o ISR preenche
  let products: ProductData[] = [];
  let categories: Category[] = [];
  try {
    products = (await getProducts(10, 0)).products;
    categories = await getCategories();
  } catch {}
  return (
    <div className="">
      <Carroussel></Carroussel>
      <div className=" py-12 ml-8 flex gap-10 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Categoria
            categoryId={category.categoryId}
            key={category.categoryId}
            category={category.name}
            img={category.categoryImage!}
          />
        ))}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-lg md:text-2xl font-bold ">
            Mais vendidos da loja
          </h1>{" "}
          <Link
            href="/bestseller"
            className="text-brand font-semibold hover:text-brand-dark transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <div className="flex gap-16 overflow-x-auto overflow-y-hidden scrollbar-hide ">
          {products
            .filter((product) => product.isFeatured === true)
            .map((product) => (
              <Product
                key={product.productId}
                img={getPrimaryImage(product)}
                name={product.productName}
                price={parseFloat(product.productPrice)}
                productId={String(product.productId)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

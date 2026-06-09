import Carroussel from "@/components/Carroussel";
import Categoria from "@/components/Categoria";
import Product from "@/components/ProductCard";
import Link from "next/link";
import { getProducts, getPrimaryImage, getCategories } from "@/seed";

export default async function HomePage() {
  const { products } = await getProducts(10, 0);
  const categories = await getCategories();
  return (
    <div className="">
      <Carroussel></Carroussel>
      <div className=" py-12 ml-8 flex gap-10 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Categoria
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
            href="/category/bestsellers"
            className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
          >
            Ver todos
          </Link>
        </div>
        <div className="flex gap-16 overflow-x-auto scrollbar-hide ">
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

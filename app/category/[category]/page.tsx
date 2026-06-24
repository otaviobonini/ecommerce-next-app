import ProductCard from "@/components/ProductCard";
import { getCategory, getPrimaryImage } from "@/app/services/product.service";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ categoryName?: string }>;
}) {
  const { category } = await params;
  const { categoryName } = await searchParams;

  const products = await getCategory(Number(category));

  return (
    <div>
      <div className="px-5 lg:ml-12 py-6 flex flex-col gap-1">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
          Categoria
        </span>

        <h1 className="font-bold text-4xl md:text-5xl tracking-tight">
          {categoryName ?? "Categoria"}
        </h1>

        <p className="text-sm text-gray-500">
          {products.length}{" "}
          {products.length === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </p>

        <div className="mt-2 h-[3px] w-12 rounded-full bg-primary" />
      </div>

      {products.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:p-12 lg:gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              img={getPrimaryImage(product)}
              name={product.productName}
              price={parseFloat(product.productPrice)}
              productId={String(product.productId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

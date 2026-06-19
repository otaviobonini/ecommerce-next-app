import Product from "@/components/ProductCard";
import { getProducts, getPrimaryImage } from "@/app/services/product.service";

export default async function CatalogoPage() {
  const { products } = await getProducts(100);

  return (
    <div>
      <div className="px-5 lg:ml-12 py-6 flex flex-col gap-1">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
          Coleção
        </span>
        <h1 className="font-bold text-4xl md:text-5xl tracking-tight">
          Catálogo
        </h1>
        <div className="mt-2 h-[3px] w-12 rounded-full bg-primary" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:p-12 lg:gap-4   ">
        {products.map((product) => (
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
  );
}

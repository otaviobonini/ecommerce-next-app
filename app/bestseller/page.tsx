import Product from "@/components/ProductCard";
import { getProducts, getPrimaryImage } from "@/seed";

export default async function MaisVendidosPage() {
  const { products } = await getProducts(100);

  const featuredProducts = products.filter((product) => product.isFeatured);

  return (
    <div>
      <div className="px-5 lg:ml-12 py-6 flex flex-col gap-1">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
          Destaques
        </span>

        <h1 className="font-bold text-4xl md:text-5xl tracking-tight">
          Mais Vendidos
        </h1>

        <p className="text-muted-foreground max-w-xl">
          Confira os produtos mais procurados pelos nossos clientes.
        </p>

        <div className="mt-2 h-[3px] w-12 rounded-full bg-primary" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:p-12 lg:gap-4">
        {featuredProducts.map((product) => (
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

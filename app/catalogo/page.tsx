import Product from "@/components/Product";
import { getProducts, getPrimaryImage } from "@/seed";

export default async function CatalogoPage() {
  const { products } = await getProducts(100);

  return (
    <div>
      <h1 className="px-5 py-4 font-semibold text-3xl md:text-4xl ">
        Catálogo
      </h1>
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

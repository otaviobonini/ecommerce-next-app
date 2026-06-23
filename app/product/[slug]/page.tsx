import ProductDisplay from "@/components/ProductDisplay";
import { getProduct } from "@/app/services/product.service";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(parseInt(slug));

  return (
    <div>
      <ProductDisplay {...product} categoryId={product.categoryId!} />
    </div>
  );
}

import Carroussel from "@/components/Carroussel";
import Categoria from "@/components/Categoria";
import Product from "@/components/Product";
import { products } from "@/seed";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="">
      <Carroussel></Carroussel>
      <div className="p-4 py-12 ml-12 flex gap-10 overflow-x-auto scrollbar-hide">
        <Categoria
          img="https://cdn.pixabay.com/photo/2026/05/27/04/29/04-29-48-584_1280.jpg"
          category="Gatos"
        ></Categoria>
        <Categoria
          img="https://cdn.pixabay.com/photo/2026/05/27/04/29/04-29-48-584_1280.jpg"
          category="Gatos"
        ></Categoria>
        <Categoria
          img="https://cdn.pixabay.com/photo/2026/05/27/04/29/04-29-48-584_1280.jpg"
          category="Gatos"
        ></Categoria>
        <Categoria
          img="https://cdn.pixabay.com/photo/2026/05/27/04/29/04-29-48-584_1280.jpg"
          category="Gatos"
        ></Categoria>
        <Categoria
          img="https://cdn.pixabay.com/photo/2026/05/27/04/29/04-29-48-584_1280.jpg"
          category="Gatos"
        ></Categoria>
        <Categoria
          img="https://cdn.pixabay.com/photo/2026/05/27/04/29/04-29-48-584_1280.jpg"
          category="Gatos"
        ></Categoria>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold p-4">Mais vendidos da loja</h1>{" "}
          <Link href="/category/bestsellers">Ver todos</Link>
        </div>
        <div className="flex gap-16 overflow-x-auto scrollbar-hide p-8">
          {products.map((product) => (
            <Product
              key={product.name}
              img={product.img}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

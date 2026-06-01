import Carroussel from "@/components/Carroussel";
import Categoria from "@/components/Categoria";

export default function HomePage() {
  return (
    <div className="">
      <Carroussel></Carroussel>
      <div className="p-4 flex gap-10 overflow-x-auto scrollbar-hide">
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
    </div>
  );
}

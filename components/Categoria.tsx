import Image from "next/image";
import Link from "next/link";

interface CategoriaProps {
  img: string;
  category: string;
}

export default function Categoria({ img, category }: CategoriaProps) {
  return (
    <Link
      href={`category/${category}`}
      className="gap-4 items-center shrink-0 flex flex-col"
    >
      <Image
        src={img}
        alt={category}
        width={200}
        height={200}
        className="h-24 w-24 md:h-48 md:w-48 rounded-full object-cover"
      />

      <h1 className="mt-2 text-center font-medium">{category}</h1>
    </Link>
  );
}

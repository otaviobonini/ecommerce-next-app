import Image from "next/image";
import Link from "next/link";

interface CategoriaProps {
  img: string;
  category: string;
  categoryId: number;
}

export default function Categoria({
  img,
  categoryId,
  category,
}: CategoriaProps) {
  return (
    <Link
      href={`/category/${categoryId}?categoryName=${category}`}
      className="gap-4 items-center hover:-translate-y-1
shrink-0 flex flex-col group  rounded-lg transition-all duration-300 p-4"
    >
      <Image
        src={img}
        alt={category}
        width={400}
        height={400}
        className="  h-32 w-32
  md:h-48 md:w-48
  rounded-full
  border-2
  border-gray-200
  group-hover:border-blue-600
  transition-colors
  group-hover:shadow-lg 
  object-cover"
      />

      <h1 className="mt-2 text-center font-medium">{category}</h1>
    </Link>
  );
}

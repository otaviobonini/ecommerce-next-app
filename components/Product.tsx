import Image from "next/image";
import Link from "next/link";

interface productsType {
  img: string;
  name: string;
  price: number;
}

export default function Product({ img, name, price }: productsType) {
  return (
    <Link
      href={`/product/${name}`}
      className="shrink-0 p-4 hover:scale-110 hover:border hover:shadow-md border border-transparent hover:border-gray-200 rounded-lg transition-all duration-300  flex flex-col "
    >
      <Image
        src={img}
        width={200}
        height={100}
        alt=""
        className="h-48 w-48 rounded-lg"
      ></Image>
      <h1 className=" text-gray-400 py-4">{name}</h1>
      <p className="text-xl font-bold ">R$ {price.toFixed(2)}</p>
    </Link>
  );
}

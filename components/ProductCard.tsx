import Image from "next/image";
import { formatPrice } from "@/app/utils/formatPrice";
import Link from "next/link";

interface productsType {
  img: string;
  name: string;
  price: number;
  productId: string;
}

export default function Product({ img, name, price, productId }: productsType) {
  return (
    <Link
      href={`/product/${productId}`}
      id={productId}
      className="shrink-0 group p-4 max-w-fit hover:-translate-y-1
mb-8 mt-4 border border-gray-200
  rounded-lg transition-all duration-300  flex flex-col "
    >
      <Image
        src={img}
        width={200}
        height={100}
        alt={name}
        className="md:h-48 md:w-48 w-36 h-36 group-hover:border-blue-600 border-2 border-gray-200 group-hover:shadow-lg rounded-lg lg:h-64 lg:w-64"
      ></Image>
      <h1 className=" text-gray-400 py-4">{name}</h1>
      <p className="text-xl font-bold ">{formatPrice(price)}</p>
    </Link>
  );
}

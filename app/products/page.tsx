import Link from "next/link";

export default function ProductsPage() {
  return (
    <main>
      <h1>the products</h1>

      <ul>
        <li>
          <Link href="/products/post-1">Post 1</Link>
        </li>

        <li>
          <Link href="/products/post-2">Post 2</Link>
        </li>
      </ul>
    </main>
  );
}

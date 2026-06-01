export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <main>
      <h1>the products {category}</h1>
      <p>{category}</p>
    </main>
  );
}

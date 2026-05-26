export default async function ProductPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      <h1>the products {slug}</h1>
      <p>{slug}</p>
    </main>
  );
}

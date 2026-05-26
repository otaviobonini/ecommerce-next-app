import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1>Hello world</h1>
        <p>
          <Link href="/home">Home</Link>
        </p>
      </div>
    </div>
  );
}

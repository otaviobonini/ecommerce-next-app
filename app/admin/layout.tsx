"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "ADMIN") {
      router.push("/");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null; // evita "flash" do conteúdo admin

  return <>{children}</>;
}
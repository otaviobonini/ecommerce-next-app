"use client";

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function AdminPage() {
  const { token } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!token || user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [token, user, router]);
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Pagina do administrador</p>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Gate server-side de /admin: o refreshToken é httpOnly (invisível pro JS do
// browser), mas o middleware roda no servidor e consegue lê-lo. O cookie em
// si é um UUID opaco (sem role), então a única forma de descobrir a role
// antes de servir a página é perguntar pro backend via /refresh-token — que
// já devolve um novo access token (JWT com id+role) e rotaciona o cookie.
// (/me não serve aqui: exige Authorization: Bearer, e o access token só
// existe em memória no React do cliente, nunca chega no middleware.)
export async function middleware(request: NextRequest) {
  const redirectHome = () => NextResponse.redirect(new URL("/", request.url));

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader?.includes("refreshToken=")) {
    return redirectHome();
  }

  const backendRes = await fetch(`${API_URL}/auth/admin-session`, {
    method: "POST",
    headers: { cookie: cookieHeader },
  });

  if (!backendRes.ok) {
    return redirectHome();
  }




  return NextResponse.next();

}

export const config = {
  matcher: ["/admin/:path*"],
};

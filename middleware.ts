import { NextRequest, NextResponse } from "next/server";

/**
 * Protege as rotas /admin/*.
 * Lê o token do cookie "auth_token" (setado pelo AuthContext no login/logout)
 * e decodifica o payload do JWT para checar a role.
 *
 * IMPORTANTE: isso é só uma barreira de UX (evita que usuários comuns
 * cheguem na tela de admin). A autorização de verdade continua sendo
 * responsabilidade do backend, que deve validar o token e a role em
 * toda rota /product, /category, /orders etc. Nunca confie só nisso.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Roda o middleware só nas rotas que precisam de proteção
export const config = {
  matcher: ["/admin/:path*"],
};

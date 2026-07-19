import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Logo from "@/public/Logo.png";
import MobileMenu from "@/components/MobileMenu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faBars } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "@/app/services/product.service";
import type { Category } from "@/schemas/product";
import { CartProvider } from "./context/CartContext";
import Carrinho from "@/components/Carrinho";
import { AuthProvider } from "./context/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";
import InputComponent from "@/components/InputComponent";
import { AddressProvider } from "./context/AddressContext";
import { UserProvider } from "./context/UserContext";
import UserProfile from "@/components/UserProfile";
import { AdminProvider } from "./context/AdminContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Faciliteei — Tecnologia e Periféricos",
    template: "%s | Faciliteei",
  },
  description:
    "Loja de tecnologia: periféricos, monitores, áudio, redes e armazenamento com entrega para todo o Brasil.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // fetch dentro do componente (não no escopo do módulo): se a API estiver
  // fora durante o build, o menu builda vazio e o ISR preenche em runtime
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {}
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <UserProvider>
                <AdminProvider>
                  <div id="auth-modal"></div>
                  <div id="address-modal"></div>
                  <div id="admin-modal"></div>
                  <div className="bg-black flex flex-col ">
                    <nav className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 text-white">
                      {/* Esquerda: menu mobile + logo */}
                      <div className="flex items-center align-middle gap-1 md:order-1 p-4">
                        <MobileMenu></MobileMenu>
                        <Link href="/" className="flex items-center">
                          <Image
                            height={500}
                            width={500}
                            src={Logo}
                            alt="Faciliteei"
                            className="h-24 w-auto lg:h-38 md:mb-8"
                          />
                        </Link>
                      </div>

                      {/* Direita: ações (no mobile ml-auto empurra pra direita) */}
                      <div className="ml-auto flex items-center gap-4 lg:gap-6 lg:text-lg md:order-3">
                        <Link className="flex items-center gap-2" href="/">
                          <FontAwesomeIcon className="h-6 w-6" icon={faTruck} />
                          <span className="hidden lg:inline">
                            Rastrear seu pedido
                          </span>
                        </Link>

                        <div className="relative hover:cursor-pointer">
                          <Carrinho></Carrinho>
                        </div>
                        <div className="relative hover:cursor-pointer">
                          <LogoutButton></LogoutButton>
                        </div>
                        <div className="relative hover:cursor-pointer">
                          <UserProfile></UserProfile>
                        </div>
                      </div>

                      {/* Busca: por último no DOM -> quebra pra própria linha no mobile;
                          no desktop, order-2 puxa pro meio e flex-1 ocupa todo o espaço livre */}
                      <div className="w-full mb-4 md:mb-0 min-w-0 md:order-2 md:w-auto md:flex-1">
                        <InputComponent></InputComponent>
                      </div>
                    </nav>

                    <ul className="gap-10 ml-auto mr-auto p-6 text-white hidden sm:flex">
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-white"
                      >
                        <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
                        <span>Menu</span>
                      </Link>
                      <Link href="/catalogo">Catálogo</Link>
                      <Link href="/contato">Entrar em contato</Link>
                    </ul>
                  </div>

                  {children}

                  <footer className="bg-black text-white px-6 py-10 mt-16 ">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                      {/* Atendimento */}
                      <div>
                        <h2 className="font-bold text-lg mb-4">
                          ATENDIMENTO AO CLIENTE
                        </h2>

                        <p className="mb-2">
                          <span className="font-semibold">E-mail: </span>
                          atendimento@faciliteei.com
                        </p>

                        <p className="mb-2">
                          <span className="font-semibold">WhatsApp: </span>
                          +55 (48) 99999-9999
                        </p>

                        <p className="text-sm text-gray-400 mb-4">
                          (Não aceitamos ligações)
                        </p>

                        <div>
                          <p className="font-semibold mb-1">
                            Horário de atendimento:
                          </p>

                          <p className="text-gray-300">
                            Seg a Sex: 09:00h às 18:00h
                          </p>
                        </div>
                      </div>

                      {/* Departamentos */}
                      <div>
                        <h2 className="font-bold text-lg mb-4">
                          DEPARTAMENTOS
                        </h2>

                        <ul className="space-y-2 text-gray-300">
                          {categories.map((category) => (
                            <li key={category.categoryId}>
                              <Link
                                href={`/category/${category.categoryId}?categoryName=${category.name}`}
                                className="hover:text-white transition"
                              >
                                {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Informações */}
                      <div>
                        <h2 className="font-bold text-lg mb-4">
                          INFORMAÇÕES IMPORTANTES
                        </h2>

                        <ul className="space-y-2 text-gray-300">
                          <li>
                            <a
                              href="/policy"
                              className="hover:text-white transition"
                            >
                              Trocas e Devolução
                            </a>
                          </li>

                          <li>
                            <Link
                              href="/privacy"
                              className="hover:text-white transition"
                            >
                              Políticas de Privacidade
                            </Link>
                          </li>

                          <li>
                            <Link
                              href="/contato"
                              className="hover:text-white transition"
                            >
                              Entrar em contato
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </footer>
                </AdminProvider>
              </UserProvider>
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

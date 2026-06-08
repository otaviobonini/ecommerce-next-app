import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Logo from "@/public/Logo.png";
import MobileMenu from "@/components/MobileMenu";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCartShopping,
  faBars,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "Ecommerce next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className={`${poppins.className} min-h-full flex flex-col`}>
        <div className="bg-black flex flex-col">
          <ul className="flex flex-wrap md:flex items-center gap-4 text-white ">
            <li className="ml-6 mb-8 flex items-center ">
              <MobileMenu></MobileMenu>
              <Image height={150} width={150} src={Logo} alt="Logo" />
            </li>

            <li className="order-1 w-full mb-6 mr-3 ml-3 sm:order-0 sm:mb-0 sm:w-auto">
              <div className="relative flex items-center -mt-16 lg:mt-0 ">
                <input
                  id="searchbar"
                  placeholder="O que está buscando?"
                  className="bg-white order-2  placeholder:text-gray-500 text-black rounded-lg px-4 py-2  w-full md:w-[768px]  "
                  type="search"
                />

                <label
                  htmlFor="searchbar"
                  className="absolute right-3 text-purple-700 cursor-pointer"
                >
                  <FontAwesomeIcon
                    className="h-5 w-5"
                    icon={faMagnifyingGlass}
                  />
                </label>
              </div>
            </li>

            <li className="ml-auto">
              <Link className="flex items-center gap-4 " href="/">
                <FontAwesomeIcon className="h-7 w-7" icon={faTruck} />
                <span className="hidden md:inline">Rastrear seu pedido</span>
              </Link>
            </li>

            <li className="mr-2">
              <Link
                href="/cart"
                className="flex items-center gap-4 mr-4 relative"
              >
                <div className="relative">
                  <span>
                    <FontAwesomeIcon
                      className="h-7 w-7 mr-2"
                      icon={faCartShopping}
                    />
                    <span className="absolute right-0 top-0 font-light -translate-y-4 translate-x-4 bg-purple-700 rounded-4xl px-2">
                      0
                    </span>
                  </span>
                </div>
                <span className="hidden md:inline">Carrinho</span>
              </Link>
            </li>
          </ul>

          <ul className="gap-10 ml-auto mr-auto p-6 text-white hidden sm:flex">
            <Link href="/" className="flex items-center gap-2 text-white">
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
              <h2 className="font-bold text-lg mb-4">ATENDIMENTO AO CLIENTE</h2>

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
                <p className="font-semibold mb-1">Horário de atendimento:</p>

                <p className="text-gray-300">Seg a Sex: 09:00h às 18:00h</p>
              </div>
            </div>

            {/* Departamentos */}
            <div>
              <h2 className="font-bold text-lg mb-4">DEPARTAMENTOS</h2>

              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Acessórios
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Cozinha
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Limpeza
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Mobilidade
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Segurança
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Todos os produtos
                  </a>
                </li>
              </ul>
            </div>

            {/* Informações */}
            <div>
              <h2 className="font-bold text-lg mb-4">
                INFORMAÇÕES IMPORTANTES
              </h2>

              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Trocas e Devolução
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Políticas de Privacidade
                  </a>
                </li>

                <li>
                  <a href="#" className="hover:text-white transition">
                    Entrar em contato
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

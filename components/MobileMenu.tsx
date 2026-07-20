"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose, faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import Link from "next/link";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function MobileMenu() {
  const [modalWindow, setModalWindow] = useState(false);
  return (
    <>
      <button
        className="sm:hidden"
        onClick={() => setModalWindow(!modalWindow)}
      >
        <FontAwesomeIcon
          icon={modalWindow ? faClose : faBars}
          className="w-5 h-5 sm:hidden"
        />
      </button>

      <div
        className={`fixed top-30 left-0 transition-all ease-in-out duration-200 z-50 h-full w-full bg-white text-black shadow-2xl p-6 sm:hidden ${modalWindow ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col gap-4">
          <Link onClick={() => setModalWindow(false)} href="/">
            Início
          </Link>
          <Link onClick={() => setModalWindow(false)} href="/catalogo">
            Catálogo
          </Link>
          <Link onClick={() => setModalWindow(false)} href="/contato">
            Entrar em contato
          </Link>
        </div>

        <hr className="my-5 border-gray-300" />

        <div className="flex flex-col gap-3">
          <h1 className="font-bold">PRECISA DE AJUDA?</h1>
          <Link href="tel:+5548999999999"><FontAwesomeIcon icon={faPhone} /> Telefone aqui</Link>
          <Link href="mailto:atendimento@faciliteei.com"><FontAwesomeIcon icon={faEnvelope} /> E-mail aqui</Link>
        </div>

        <hr className="my-5 border-gray-300" />

        <div className="flex flex-col gap-3">
          <h1 className="font-bold">SIGA-NOS</h1>
          <Link href="/"><FontAwesomeIcon icon={faFacebook as IconProp} /> Facebook</Link>
          <Link href="/"><FontAwesomeIcon icon={faInstagram as IconProp} /> Instagram</Link>
        </div>
      </div>
    </>
  );
}

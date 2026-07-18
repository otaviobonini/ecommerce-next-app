"use client";

import { useForm } from "react-hook-form";
import Button from "@/components/Button";

type FormData = {
  fullName: string;
  email: string;
  telephone: string;
  message: string;
};

export default function ContatoPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  console.log(errors);

  return (
    <div className="flex ">
      <form
        className="flex flex-col w-2xl rounded-2xl ml-auto mr-auto gap-4 p-4 mt-12 bg-gray-100 "
        onSubmit={handleSubmit((data) => {
          console.log(data);
          reset();
        })}
      >
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Suporte
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Entre em Contato
          </h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Preencha os dados abaixo e responderemos o mais breve possível.
          </p>
        </div>
        <label htmlFor="fullName">Insira seu nome completo</label>
        <input
          id="fullName"
          className={`border rounded-xl p-3 text-sm outline-none transition-colors focus:border-black placeholder:text-gray-300 ${
            errors.fullName ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
          {...register("fullName", { required: "Preencha seu nome completo" })}
          placeholder="João da Silva"
        />
        <p className="text-sm text-red-500">{errors.fullName?.message}</p>

        <label htmlFor="email">Insira seu email para contato</label>
        <input
          id="email"
          type="email"
          className={`border rounded-xl p-3 text-sm outline-none transition-colors focus:border-black placeholder:text-gray-300 ${
            errors.email ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
          {...register("email", { required: "Preencha seu email" })}
          placeholder="joao@email.com"
        />
        <p className="text-sm text-red-500">{errors.email?.message}</p>

        <label htmlFor="telephone">Insira seu número de telefone</label>
        <input
          id="telephone"
          type="tel"
          className={`border rounded-xl p-3 text-sm outline-none transition-colors focus:border-black placeholder:text-gray-300 ${
            errors.telephone ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
          {...register("telephone", { required: "Preencha seu telefone" })}
          placeholder="(48) 99999-0000"
        />
        <p className="text-sm text-red-500">{errors.telephone?.message}</p>

        <label htmlFor="message">
          Escreva sua mensagem para nós te ouvirmos
        </label>
        <textarea
          id="message"
          rows={4}
          className={`border rounded-xl p-3 text-sm outline-none transition-colors focus:border-black placeholder:text-gray-300 resize-none ${
            errors.message ? "border-red-400 bg-red-50" : "border-gray-200"
          }`}
          {...register("message", { required: "Escreva sua mensagem" })}
          placeholder="Como podemos te ajudar?"
        />
        <p className="text-sm text-red-500">{errors.message?.message}</p>
        <Button type="submit" className="mt-2 w-full">
          Enviar mensagem
        </Button>
      </form>
    </div>
  );
}

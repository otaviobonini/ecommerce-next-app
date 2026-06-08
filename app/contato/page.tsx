"use client";

import { useForm } from "react-hook-form";

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
        className="flex flex-col w-2xl md:shadow-2xl rounded-2xl ml-auto mr-auto gap-4 p-4 mt-12"
        onSubmit={handleSubmit((data) => {
          console.log(data);
          reset();
        })}
      >
        <h1 className="text-3xl font-bold text-center">Entre em Contato</h1>

        <p className="text-gray-500 text-center mb-4">
          Preencha os dados abaixo e responderemos o mais breve possível.
        </p>
        <label htmlFor="fullName">Insira seu nome completo</label>
        <input
          id="fullName"
          className="border rounded-lg p-2"
          {...register("fullName", {
            required: "É preciso preencher o nome completo",
          })}
          placeholder="Nome completo"
        />
        <p className="text-sm text-red-500">{errors.fullName?.message}</p>

        <label htmlFor="email">Insira seu email para contato</label>
        <input
          id="email"
          type="email"
          className="border rounded-lg p-2"
          {...register("email", {
            required: "É preciso preencher com seu email",
          })}
          placeholder="Email"
        />
        <p className="text-sm text-red-500">{errors.email?.message}</p>

        <label htmlFor="telephone">Insira seu número de telefone</label>
        <input
          id="telephone"
          type="tel"
          className="border rounded-lg p-2"
          {...register("telephone", {
            required: "É preciso preencher com seu número de telefone",
          })}
          placeholder="Número de telefone"
        />
        <p className="text-sm text-red-500">{errors.telephone?.message}</p>

        <label htmlFor="message">
          Escreva sua mensagem para nós te ouvirmos
        </label>
        <textarea
          id="message"
          className="border rounded-lg p-2"
          {...register("message", {
            required: "Escreva sua mensagem",
          })}
          placeholder="Escreva sua mensagem"
        />
        <p className="text-sm text-red-500">{errors.message?.message}</p>
        <input
          className="cursor-pointer rounded-md border border-white p-2 hover:border hover:border-gray-300 w-24 self-center"
          type="submit"
          value="Enviar"
        />
      </form>
    </div>
  );
}

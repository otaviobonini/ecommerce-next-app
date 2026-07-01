import { useAddress } from "@/app/context/AddressContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  CreateAddressInput,
  CreateAddressInputSchema,
} from "@/schemas/address.schema";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function AddressModal({ onSuccess, onClose, isOpen }: Props) {
  const { token } = useAuth();
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const { createAddress } = useAddress();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    // Lets safe parse in client before trying to send to server
    const parsed = CreateAddressInputSchema.safeParse({
      street,
      city,
      state,
      zipCode,
    } as CreateAddressInput);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      setLoading(false);
      return;
    }

    try {
      await createAddress(parsed.data, token);
      onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar endereço.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPortal(document.getElementById("address-modal"));
  }, []);
  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 z-80 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
      >
        <h2>Novo endereço</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-5">
          <div className="relative">
            <input
              id="street"
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
            />
            <label
              htmlFor="street"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
            >
              Rua
            </label>
          </div>

          <div className="relative">
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
            />
            <label
              htmlFor="city"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
            >
              Cidade
            </label>
          </div>

          <div className="relative">
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
            />
            <label
              htmlFor="state"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
            >
              Estado
            </label>
          </div>

          <div className="relative">
            <input
              id="zipCode"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              placeholder=" "
              className="peer w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:shadow-md"
            />
            <label
              htmlFor="zipCode"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-150
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-black
      peer-valid:top-0 peer-valid:-translate-y-1/2 peer-valid:text-sm"
            >
              CEP
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-black p-3 font-medium text-white transition hover:cursor-pointer hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Endereço"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 p-3 transition hover:bg-gray-100 hover:cursor-pointer"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>,
    portal,
  );
}

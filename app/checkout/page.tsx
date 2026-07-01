"use client";

import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { deleteCartItem } from "../services/cart.service";
import { useEffect, useState } from "react";
import { CartItemWithProduct } from "@/schemas/cart.schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAddress } from "../context/AddressContext";
import AddressModal from "@/components/AddressModal";
import { createOrder } from "../services/order.service";

export default function CheckoutPage() {
  const { getCartItems } = useCart();
  const { token } = useAuth();
  const [cart, setCart] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addresses, deleteAddress } = useAddress();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  async function handleDeleteItem(cartItemId: number) {
    if (!token) return;
    try {
      await deleteCartItem(cartItemId, token);
      setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao remover item");
    }
  }
  async function handleCheckout() {
    if (!token || !selectedAddressId) return;
    try {
      const { paymentLink } = await createOrder(
        { addressId: selectedAddressId },
        token,
      );
      window.location.href = paymentLink;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao finalizar compra");
    }
  }
  async function handleDeleteAddress(addressId: number) {
    if (!token) return;
    try {
      await deleteAddress(addressId, token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao remover endereço");
    }
  }
  const totalCart = cart.reduce((total, item) => {
    return total + Number(item.product.productPrice) * item.quantity;
  }, 0);

  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
      setSelectedAddressId(defaultAddr.addressId);
    }
  }, [addresses, selectedAddressId]);

  useEffect(() => {
    if (!token) return;

    async function cartItem() {
      setLoading(true);
      setError(null);
      try {
        const res = await getCartItems(token);
        setCart(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar carrinho");
      } finally {
        setLoading(false);
      }
    }
    cartItem();
  }, [token]);

  if (loading) {
    return <p className="p-8 text-gray-500">Carregando seu carrinho...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-500">{error}</p>;
  }

  if (cart.length === 0) {
    return <p className="p-8 text-gray-500">Seu carrinho está vazio.</p>;
  }

  return (
    <div className="flex flex-col p-4 lg:flex-row gap-6 lg:p-8 max-w-6xl mx-auto">
      {/* Lista de itens */}
      <div className="flex-1 flex flex-col gap-3">
        <h1 className="text-2xl font-semibold mb-2">Seu carrinho</h1>

        {cart.map((item) => (
          <div
            key={item.cartItemId}
            className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-gray-100 border border-gray-200"
          >
            <div className="w-[88px] h-[88px] rounded-md bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                alt={item.product.productName}
                src={item.product.images[0]?.url ?? "/placeholder.png"}
                width={88}
                height={88}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <h2 className="text-base font-medium">
                {item.product.productName}
              </h2>
              <p className="text-sm text-gray-500">
                Quantidade: {item.quantity}
              </p>
              <p className="text-sm text-gray-400">
                Unidade:{" "}
                {Number(item.product.productPrice).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <button
              onClick={() => handleDeleteItem(item.cartItemId)}
              aria-label="Remover item"
              className="flex items-center ml-auto sm:ml-0  gap-1.5 px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors cursor-pointer self-start"
            >
              <FontAwesomeIcon icon={faTrash} className="text-xs" />
              Remover
            </button>
            <div className="flex items-end">
              <p className="text-lg font-medium text-green-600">
                {(
                  item.quantity * Number(item.product.productPrice)
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Endereços */}
      <div className="lg:w-[600px] flex flex-col gap-4 p-5 rounded-2xl bg-gray-100 border border-gray-200 h-fit lg:sticky lg:top-8">
        <h2 className="text-xl font-semibold">
          Escolha seu endereço para entrega
        </h2>
        <div className="flex justify-between items-baseline border-t border-gray-200 pt-3">
          {addresses.length === 0 ? (
            <p className="text-sm text-gray-500">
              Você ainda não tem endereços cadastrados.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {addresses.map((address) => (
                <label
                  key={address.addressId}
                  className={`flex flex-col relative gap-0.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAddressId === address.addressId
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === address.addressId}
                      onChange={() => setSelectedAddressId(address.addressId)}
                    />
                    <span className="text-sm font-medium">
                      {address.street}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-6">
                    {address.city} - {address.state}, {address.zipCode}
                  </span>
                  <button
                    onClick={() => handleDeleteAddress(address.addressId)}
                    aria-label="Remover item"
                    className="flex items-center absolute top-1 right-1 sm:ml-0  gap-1.5 px-1 py-1 rounded-md border border-red-200 bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors cursor-pointer self-start"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                  </button>
                </label>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="w-full bg-green-600 hover:bg-green-800 text-white py-3 rounded-full transition-colors duration-300 cursor-pointer"
        >
          Adicionar endereço
        </button>
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSuccess={() => {
            setIsAddressModalOpen(false);
          }}
        />
      </div>
      {/* Resumo */}
      <div className="lg:w-[500px] flex flex-col gap-4 p-5 rounded-2xl bg-gray-100 border border-gray-200 h-fit lg:sticky lg:top-8">
        <h2 className="text-xl font-semibold">Resumo</h2>
        <div className="flex justify-between items-baseline border-t border-gray-200 pt-3">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-2xl font-semibold text-green-600">
            {totalCart.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-purple-600 hover:bg-purple-800 text-white py-3 rounded-full transition-colors duration-300 cursor-pointer"
        >
          Continuar para pagamento
        </button>
      </div>
    </div>
  );
}

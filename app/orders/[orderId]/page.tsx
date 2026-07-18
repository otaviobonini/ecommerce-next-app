"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { getOrderById } from "@/app/services/order.service";
import { getProduct } from "@/app/services/product.service";
import { Order, OrderItem } from "@/schemas/order.schema";
import { Product } from "@/schemas/product";

type OrderItemWithProduct = OrderItem & { product: Product | null };

const STATUS_LABELS: Record<Order["status"], string> = {
  PENDING: "Pagamento pendente",
  PAID: "Pago",
  ONGOING: "Em preparação",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function OrderStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const searchParams = useSearchParams();
  // O Stripe redireciona pra cá com ?status=success ou ?status=cancelled
  const stripeStatus = searchParams.get("status");

  const { token, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !token) return;

    async function load(currentToken: string) {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderById(Number(orderId), currentToken);
        setOrder(data);

        // A API não retorna o produto junto do item do pedido, então
        // buscamos cada produto à parte só pra exibir nome/imagem.
        const withProducts = await Promise.all(
          data.orderItems.map(async (item): Promise<OrderItemWithProduct> => {
            try {
              const product = await getProduct(item.productId);
              return { ...item, product };
            } catch {
              return { ...item, product: null };
            }
          }),
        );
        setItems(withProducts);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao carregar pedido");
      } finally {
        setLoading(false);
      }
    }

    load(token);
  }, [orderId, token, authLoading]);

  if (!authLoading && !token) {
  return <p>Você precisa estar logado para ver este pedido.</p>;
}
  if (loading) {
    return <p className="p-8 text-gray-500">Carregando seu pedido...</p>;
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center flex flex-col gap-4">
        <p className="text-red-500">{error}</p>
        <Link href="/" className="text-purple-600 hover:underline">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  if (!order) return null;

  const wasCancelledAtStripe = stripeStatus === "cancelled";

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8 flex flex-col gap-6">
      {wasCancelledAtStripe ? (
        <div className="rounded-2xl bg-yellow-50  p-6 text-center">
          <h1 className="text-2xl font-semibold text-yellow-700 mb-2">
            Pagamento cancelado
          </h1>
          <p className="text-yellow-700">
            Você cancelou o pagamento antes de concluir. O pedido #
            {order.orderId} não foi cobrado.
          </p>
        </div>
      ) : order.status === "PAID" ? (
        <div className="rounded-2xl bg-green-50 0 p-6 text-center">
          <h1 className="text-2xl font-semibold text-green-700 mb-2">
            Pedido confirmado!
          </h1>
          <p className="text-green-700">
            Recebemos seu pagamento. Pedido #{order.orderId}.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-blue-50  p-6 text-center">
          <h1 className="text-2xl font-semibold text-blue-700 mb-2">
            Confirmando seu pagamento...
          </h1>
          <p className="text-blue-700">
            Assim que o Stripe confirmar, o status do pedido #{order.orderId}{" "}
            atualiza automaticamente. Pode levar alguns segundos.
          </p>
        </div>
      )}

      <div className="rounded-2xl bg-gray-100  p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Resumo do pedido</h2>
          <span className="text-sm px-3 py-1 rounded-full bg-white border border-gray-300">
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.orderItemId}
              className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-200"
            >
              <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.product?.images[0]?.url && (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.productName}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {item.product?.productName ?? `Produto #${item.productId}`}
                </p>
                <p className="text-sm text-gray-500">
                  Quantidade: {item.quantity}
                </p>
              </div>
              <p className="font-medium text-green-600">
                {formatBRL(item.quantity * Number(item.priceAtTime))}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-baseline border-t border-gray-200 pt-3">
          <span className="text-sm text-gray-500">Total</span>
          <span className="text-2xl font-semibold text-green-600">
            {formatBRL(Number(order.total))}
          </span>
        </div>
      </div>

      <Link
        href="/"
        className="text-center bg-black hover:bg-gray-900 text-white py-3 rounded-full transition-colors"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}

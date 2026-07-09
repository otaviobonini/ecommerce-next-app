"use client";

import { useAdmin } from "@/app/context/AdminContext";
import Image from "next/image";

export default function OrdersPage() {
  const { orders } = useAdmin();

  const statusMap = {
    PENDING: "Pendente",
    PAID: "Pago",
    ONGOING: "Em andamento",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  } as const;

  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    ONGOING: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-purple-100 text-purple-800",
    CANCELLED: "bg-red-100 text-red-800",
  } as const;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="mb-8 text-3xl font-bold">Pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      ) : (
        <div className="flex w-full max-w-5xl flex-col gap-8">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-md"
            >
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    Pedido #{order.orderId}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${statusStyles[order.status]}`}
                  >
                    {statusMap[order.status]}
                  </span>

                  <p className="mt-2 text-sm text-gray-500">
                    <strong>Cliente:</strong> {order.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.address.street}, {order.address.city} -{" "}
                    {order.address.state}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold">
                    R$ {Number(order.total).toFixed(2)}
                  </p>

                  <p className="text-sm text-gray-500">
                    {order.orderItems.length}{" "}
                    {order.orderItems.length === 1 ? "item" : "itens"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex items-center justify-between border-t pt-4"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.productName}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />

                      <div>
                        <p className="font-medium">
                          {item.product.productName}
                        </p>

                        <p className="text-sm text-gray-500">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-medium">
                      R$ {Number(item.priceAtTime).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

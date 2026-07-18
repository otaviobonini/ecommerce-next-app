"use client";

import Image from "next/image";
import { formatPrice } from "@/app/utils/formatPrice";
import { useUser } from "../context/UserContext";

export default function OrdersPage() {
  const { user } = useUser();

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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl mb-8">Meus Pedidos</h1>
      {user?.orders.length === 0 ? (
        <p>Você não possui pedidos.</p>
      ) : (
        <div className="flex flex-col     gap-12">
          {user?.orders.map((order) => (
            <div
              key={order.orderId}
              className="border border-gray-200 shadow-2xl max-w-5xl md:w-4xl bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold mb-2">Pedido #{order.orderId}</p>
                  <span
                    className={`rounded-full px-2 py-1 text-sm ${statusStyles[order.status]}`}
                  >
                    {statusMap[order.status]}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {order.address.street}, {order.address.city} -{" "}
                    {order.address.state}
                  </p>
                </div>

                <p className="font-bold">{formatPrice(order.total)}</p>
              </div>

              <div className="flex flex-col gap-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item.orderItemId}
                    className="flex justify-between items-center border-t-2 border-gray-200 pt-3"
                  >
                    <Image
                      className="rounded-lg"
                      src={item.product.images[0].url}
                      alt={item.product.productName}
                      width={100}
                      height={100}
                    />
                    <div>
                      <p className="font-medium">{item.product.productName}</p>

                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantity}
                      </p>
                    </div>

                    <p>{formatPrice(item.priceAtTime)}</p>
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

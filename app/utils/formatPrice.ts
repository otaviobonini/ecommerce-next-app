/** Formata qualquer valor monetário no padrão brasileiro: R$ 1.350,00 */
export function formatPrice(value: number | string): string {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

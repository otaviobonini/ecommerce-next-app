import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Product from "./ProductCard";

describe("ProductCard", () => {
  it("Deve renderizar nome, preço, imagem e link do produto", () => {
    render(
      <Product img="/Image1.png" name="Produto 1" price={100} productId="1" />,
    );
    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.00")).toBeInTheDocument();
    expect(screen.getByAltText("")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/product/1");
  });
});

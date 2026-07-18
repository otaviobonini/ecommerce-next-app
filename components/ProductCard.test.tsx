import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Product from "./ProductCard";

describe("ProductCard", () => {
  it("Deve renderizar nome, preço, imagem e link do produto", () => {
    render(
      <Product img="/Image1.png" name="Produto 1" price={100} productId="1" />,
    );
    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    // regex com \s*: o Intl separa "R$" do número com non-breaking space,
    // e a Testing Library normaliza espaços do DOM — regex cobre os dois
    expect(screen.getByText(/R\$\s*100,00/)).toBeInTheDocument();
    expect(screen.getByAltText("")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/product/1");
  });
});

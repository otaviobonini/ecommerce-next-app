import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "brand" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const base =
  "rounded-xl font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base",
};

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-gray-800",
  brand: "bg-brand text-white hover:bg-brand-dark",
  secondary:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
  danger:
    "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
  ghost: "text-gray-600 hover:bg-gray-100",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}

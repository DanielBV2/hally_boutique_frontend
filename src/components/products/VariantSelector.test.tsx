import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { VariantSelector } from "@/components/products/VariantSelector";
import type { ProductVariant } from "@/types/product";

// Matriz realista: S+Azul y M+Azul con stock, M+Rojo sin stock, L+Rojo con
// stock. S+Rojo y L+Azul no existen como combinación.
const variants: ProductVariant[] = [
  { id: "v1", size: "S", color: "Azul", stock: 10, price: 85000, inStock: true },
  { id: "v2", size: "M", color: "Azul", stock: 8, price: 85000, inStock: true },
  { id: "v3", size: "M", color: "Rojo", stock: 0, price: 85000, inStock: false },
  { id: "v4", size: "L", color: "Rojo", stock: 5, price: 85000, inStock: true },
];

function setup() {
  const onSelect = vi.fn();
  render(<VariantSelector variants={variants} onSelect={onSelect} />);
  return { onSelect };
}

afterEach(() => {
  cleanup();
});

describe("VariantSelector", () => {
  it("llama a onSelect con la variante correcta al combinar talla y color existentes", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup();

    await user.click(screen.getByRole("button", { name: "M" }));
    await user.click(screen.getByRole("button", { name: "Azul" }));

    expect(onSelect).toHaveBeenLastCalledWith(variants[1]);
    expect(screen.getByRole("button", { name: "M" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Azul" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("muestra el mensaje de combinación inexistente cuando la selección deja de combinar", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { rerender } = render(
      <VariantSelector variants={variants} onSelect={onSelect} />,
    );

    await user.click(screen.getByRole("button", { name: "M" }));
    await user.click(screen.getByRole("button", { name: "Rojo" }));

    // M+Rojo existe en el set original, así que aún no hay mensaje.
    expect(onSelect).toHaveBeenLastCalledWith(variants[2]);
    expect(screen.queryByText("Esta combinación no está disponible")).toBeNull();

    // Las variantes cambian (p. ej. el admin las edita) y M+Rojo desaparece.
    // La selección queda huérfana: el componente la resuelve como null internamente
    // y muestra el mensaje. Al seleccionar una combinación inexistente no se vuelve
    // a llamar a onSelect con una variante.
    rerender(
      <VariantSelector
        variants={variants.filter((v) => v.id !== variants[2].id)}
        onSelect={onSelect}
      />,
    );

    expect(
      screen.getByText("Esta combinación no está disponible"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Sin stock disponible en esta combinación"),
    ).toBeNull();
    expect(onSelect).toHaveBeenLastCalledWith(variants[2]);
  });

  it("muestra el mensaje de sin stock cuando la combinación existe pero no hay stock", async () => {
    const user = userEvent.setup();
    const { onSelect } = setup();

    await user.click(screen.getByRole("button", { name: "M" }));
    await user.click(screen.getByRole("button", { name: "Rojo" }));

    expect(
      screen.getByText("Sin stock disponible en esta combinación"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Esta combinación no está disponible")).toBeNull();
    expect(onSelect).toHaveBeenLastCalledWith(variants[2]);
  });

  it("deshabilita los colores que no combinan con la talla seleccionada", async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getByRole("button", { name: "Azul" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Rojo" })).not.toBeDisabled();

    await user.click(screen.getByRole("button", { name: "S" }));

    expect(screen.getByRole("button", { name: "Azul" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Rojo" })).toBeDisabled();
  });

  it("deshabilita las tallas que no combinan con el color seleccionado", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole("button", { name: "Rojo" }));

    expect(screen.getByRole("button", { name: "S" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "M" })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "L" })).not.toBeDisabled();
  });
});
import { describe, expect, it } from "vitest";

import {
  formatAddressLine,
  formatCOP,
  formatDate,
  formatShortDate,
} from "@/lib/format";

describe("formatCOP", () => {
  it("formatea montos en pesos colombianos sin decimales", () => {
    expect(formatCOP(50000)).toBe("$\u00A050.000");
    expect(formatCOP(1000000)).toBe("$\u00A01.000.000");
  });

  it("maneja el cero correctamente", () => {
    expect(formatCOP(0)).toBe("$\u00A00");
  });

  it("nunca produce decimales ni centavos", () => {
    expect(formatCOP(50000)).not.toContain(",");
    expect(formatCOP(1234567.89)).not.toContain(",");
  });
});

describe("formatDate", () => {
  it("formatea una fecha en español (día, mes largo, año)", () => {
    expect(formatDate("2024-05-15T12:00:00")).toBe("15 de mayo de 2024");
  });

  it("acepta tanto string ISO como Date object", () => {
    expect(formatDate(new Date("2024-05-15T12:00:00"))).toBe(
      formatDate("2024-05-15T12:00:00"),
    );
  });
});

describe("formatShortDate", () => {
  it("formatea una fecha en español (día, mes corto, año)", () => {
    expect(formatShortDate("2024-05-15T12:00:00")).toBe("15 de may de 2024");
  });
});

describe("formatAddressLine", () => {
  const full = {
    line1: "Calle 123",
    line2: "Apto 4B",
    city: "Medellín",
    state: "Antioquia",
    postalCode: "050001",
  };

  it("arma la línea completa con todos los campos", () => {
    expect(formatAddressLine(full)).toBe(
      "Calle 123, Apto 4B, Medellín, Antioquia, 050001",
    );
  });

  it("omite line2 y postalCode undefined sin comas huérfanas ni 'undefined'", () => {
    const input = {
      line1: "Calle 123",
      city: "Medellín",
      state: "Antioquia",
    };
    const output = formatAddressLine(input);
    expect(output).toBe("Calle 123, Medellín, Antioquia");
    expect(output).not.toContain("undefined");
  });

  it("omite line2 y postalCode null sin comas huérfanas", () => {
    expect(
      formatAddressLine({
        line1: "Calle 123",
        line2: null,
        city: "Medellín",
        state: "Antioquia",
        postalCode: null,
      }),
    ).toBe("Calle 123, Medellín, Antioquia");
  });

  it("omite strings vacíos como si no existieran", () => {
    expect(
      formatAddressLine({
        line1: "Calle 123",
        line2: "",
        city: "Medellín",
        state: "Antioquia",
        postalCode: "",
      }),
    ).toBe("Calle 123, Medellín, Antioquia");
  });
});
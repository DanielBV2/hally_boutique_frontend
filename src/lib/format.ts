const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(amount: number): string {
  return copFormatter.format(amount);
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAddressLine(input: {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
}): string {
  return [
    input.line1,
    input.line2,
    `${input.city}, ${input.state}`,
    input.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
}

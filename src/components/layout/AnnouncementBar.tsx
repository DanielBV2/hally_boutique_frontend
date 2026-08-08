"use client";

const FREE_SHIPPING_THRESHOLD = 150000;

const thresholdFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function AnnouncementBar() {
  return (
    <div className="bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
      Envío gratis en compras superiores a{" "}
      {thresholdFormatter.format(FREE_SHIPPING_THRESHOLD)}
    </div>
  );
}

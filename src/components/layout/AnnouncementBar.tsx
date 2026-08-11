"use client";

const FREE_SHIPPING_THRESHOLD = 150000;

const thresholdFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function AnnouncementBar() {
  const message = `Envío gratis en compras superiores a ${thresholdFormatter.format(
    FREE_SHIPPING_THRESHOLD
  )}`;

  return (
    <div className="overflow-hidden bg-primary py-2 text-center text-sm font-medium text-primary-foreground">
      <div className="animate-marquee flex w-max whitespace-nowrap">
        <p className="px-6">{message}</p>
        <p className="px-6" aria-hidden="true">
          {message}
        </p>
      </div>
    </div>
  );
}

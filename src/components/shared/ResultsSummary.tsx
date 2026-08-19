export function ResultsSummary({
  page,
  limit,
  total,
  label,
}: {
  page: number;
  limit: number;
  total: number;
  label: string;
}) {
  if (total === 0) return null;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return (
    <p className="text-sm text-muted-foreground">
      Mostrando {start}–{end} de {total} {label}
    </p>
  );
}

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: {lastUpdated}
      </p>
      <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-muted-foreground [&>section>h2]:mb-1 [&>section>h2]:text-base [&>section>h2]:font-semibold [&>section>h2]:text-foreground [&>section>p]:mt-2">
        {children}
      </div>
    </main>
  );
}

import { Header } from "@/components/layout/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </>
  );
}

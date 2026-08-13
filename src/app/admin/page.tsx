import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const sections = [
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Métricas de ventas, pedidos y stock",
  },
  {
    icon: ShoppingCart,
    title: "Órdenes",
    description: "Gestionar pedidos y progresión de estados",
  },
  {
    icon: Package,
    title: "Productos",
    description: "Catálogo, variantes e imágenes",
  },
  {
    icon: Tags,
    title: "Categorías",
    description: "Organización del catálogo",
  },
  {
    icon: Users,
    title: "Usuarios",
    description: "Clientes registrados",
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Panel de administración
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido al panel de administración de Hally Boutique.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="size-4 text-muted-foreground" />
                {section.title}
              </CardTitle>
              <CardDescription>
                {section.description} — próximamente
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

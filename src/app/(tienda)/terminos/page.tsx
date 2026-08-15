import { LegalPage } from "@/components/shared/LegalPage";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Términos y condiciones · Hally Boutique",
  description:
    "Términos y condiciones de compra de Hally Boutique: pedidos, pagos, envíos y devoluciones.",
  path: "/terminos",
});

export default function TerminosPage() {
  return (
    <LegalPage title="Términos y condiciones" lastUpdated="15 de agosto de 2026">
      <section>
        <h2>1. Aceptación de los términos</h2>
        <p>
          Al utilizar esta tienda en línea estás aceptando estos términos y
          condiciones. Si tienes dudas sobre alguno de ellos, puedes escribirnos
          por WhatsApp antes de realizar tu pedido.
        </p>
      </section>

      <section>
        <h2>2. Productos y precios</h2>
        <p>
          Los precios están expresados en pesos colombianos (COP) e incluyen
          impuestos, salvo que se indique lo contrario. La disponibilidad de
          tallas y colores se muestra en cada producto y puede cambiar sin
          previo aviso. Nos reservamos el derecho de modificar precios en
          cualquier momento, sin que esto afecte pedidos ya confirmados.
        </p>
      </section>

      <section>
        <h2>3. Pedidos y pagos</h2>
        <p>
          El carrito de compras requiere crear una cuenta. Al confirmar tu
          pedido aceptas pagar el total indicado, que incluye el costo de envío
          seleccionado. Los pagos se procesan a través de Wompi (PSE y tarjetas
          de crédito/débito). Podemos rechazar o cancelar un pedido si
          detectamos inconsistencias en los datos de pago o falta de stock.
        </p>
      </section>

      <section>
        <h2>4. Envíos y entregas</h2>
        <p>
          El costo y los tiempos de entrega dependen del destino y se muestran
          durante el checkout. Una vez despachado tu pedido recibirás la guía de
          envío por tu correo. Hally Boutique no se hace responsable por retrasos
          ocasionados por la transportadora o por datos de entrega incorrectos.
        </p>
      </section>

      <section>
        <h2>5. Cambios y devoluciones</h2>
        <p>
          Aceptamos cambios y devoluciones dentro de los 30 días siguientes a la
          entrega, siempre que el producto esté sin uso, con sus etiquetas
          originales y en su empaque. Para iniciar el proceso escríbenos por
          WhatsApp indicando el número de tu pedido.
        </p>
      </section>

      <section>
        <h2>6. Propiedad intelectual</h2>
        <p>
          Las imágenes, textos, logos y demás contenidos de este sitio son
          propiedad de Hally Boutique y no pueden reproducirse sin autorización
          previa.
        </p>
      </section>

      <section>
        <h2>7. Limitación de responsabilidad</h2>
        <p>
          Hally Boutique no será responsable por daños indirectos derivados del
          uso de este sitio. Nuestra responsabilidad total frente a un pedido no
          excederá el monto pagado por el mismo.
        </p>
      </section>

      <section>
        <h2>8. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia.
          Cualquier controversia será sometida a los tribunales competentes de
          Colombia.
        </p>
      </section>
    </LegalPage>
  );
}

import { LegalPage } from "@/components/shared/LegalPage";
import { pageSeo } from "@/lib/seo";

export const metadata = pageSeo({
  title: "Política de privacidad · Hally Boutique",
  description:
    "Política de privacidad de Hally Boutique: qué datos recopilamos, cómo los usamos y los derechos que tienes.",
  path: "/privacidad",
});

export default function PrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad" lastUpdated="15 de agosto de 2026">
      <section>
        <h2>1. Responsable del tratamiento</h2>
        <p>
          Hally Boutique es responsable del tratamiento de los datos personales
          que recopilamos a través de esta tienda en línea. Si tienes preguntas
          sobre esta política, puedes escribirnos por WhatsApp.
        </p>
      </section>

      <section>
        <h2>2. Datos que recopilamos</h2>
        <p>
          Recopilamos los datos necesarios para procesar tus pedidos: nombre,
          correo electrónico, teléfono, dirección de entrega e información de
          pago. También recopilamos información básica de uso del sitio para
          mejorar la experiencia (por ejemplo, páginas visitadas).
        </p>
      </section>

      <section>
        <h2>3. Finalidad y base legal</h2>
        <p>
          Usamos tus datos para gestionar tu cuenta, procesar y entregar tus
          pedidos, comunicarte el estado de los mismos y enviarte información
          comercial solo si lo autorizaste. El tratamiento se realiza con tu
          consentimiento y para ejecutar el contrato de compra.
        </p>
      </section>

      <section>
        <h2>4. Compartición de datos</h2>
        <p>
          Compartimos tus datos únicamente con los proveedores necesarios para
          operar la tienda: procesadores de pago (Wompi), transportadoras y
          servicios de correo electrónico. Estos proveedores solo pueden tratar
          tus datos para prestar el servicio contratado.
        </p>
      </section>

      <section>
        <h2>5. Seguridad</h2>
        <p>
          Tus datos se transmiten de forma cifrada y los almacenamos con medidas
          de seguridad razonables. Las contraseñas se guardan de forma segura y
          nunca se comparten con terceros.
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          Este sitio utiliza cookies para mantener tu sesión activa, recordar los
          productos de tu carrito y medir el uso de la página. Puedes configurar
          tu navegador para rechazarlas, aunque algunas funciones podrían no
          funcionar correctamente.
        </p>
      </section>

      <section>
        <h2>7. Tus derechos</h2>
        <p>
          De acuerdo con la Ley 1581 de 2012 puedes conocer, actualizar,
          rectificar y solicitar la eliminación de tus datos personales, así como
          revocar tu autorización, escribiéndonos por WhatsApp. Atenderemos tu
          solicitud dentro de los plazos legales.
        </p>
      </section>

      <section>
        <h2>8. Vigencia</h2>
        <p>
          Conservamos tus datos mientras mantengas tu cuenta activa o mientras la
          ley lo requiera. Esta política puede actualizarse periódicamente;
          publicaremos los cambios en esta página.
        </p>
      </section>
    </LegalPage>
  );
}

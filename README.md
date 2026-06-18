# Web Application - Fruitlogix
**URL de Producción:** https://fruitlogixweb.web.app/dashboard

Plataforma integral para la gestión de la cadena de suministro agrícola...

**Developer Team:** DevsTeam  
**Product Name:** Fruitlogix

### Members of the startup:
* Contreras Granados, Johan Alexis (u202423752)
* Chavez Bardales, Esteban Eduardo (u20241b761)
* Evangelista Ygnacio, Sergio Joaquín (u202211295)
* Jaime Forcelledo, Gonzalo Alexander (u202319329)
* Palomino Vilcañaupa, Daril Johan (u202317338)

---

## Requisitos Previos
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* npm o yarn

## Instalación y Ejecución Local

1. **Clonar el repositorio y entrar al directorio:**
   ```bash
   git clone <tu-url-del-repo>
   cd <nombre-de-tu-carpeta-frontend>
Instalar las dependencias:

Bash
npm install
Configurar Variables de Entorno:
Crea un archivo llamado .env.development (y .env.production para despliegues) en la raíz del proyecto. Asegúrate de colocar las URLs planas sin comillas ni enlaces Markdown:

Fragmento de código
VITE_API_ORDERS=[https://fruitlogix-platform.onrender.com/api/v1/orders](https://fruitlogix-platform.onrender.com/api/v1/orders)
VITE_API_INVOICES=[https://fruitlogix-platform.onrender.com/api/v1/invoices](https://fruitlogix-platform.onrender.com/api/v1/invoices)
VITE_API_PAYMENT_TRANSACTIONS=[https://fruitlogix-platform.onrender.com/api/v1/payment-transactions](https://fruitlogix-platform.onrender.com/api/v1/payment-transactions)
# Añadir el resto de endpoints aquí...
Ejecutar el servidor de desarrollo local:

Bash
npm run dev

Guía de Prueba del Flujo Principal (Core Business)
Para entender y evaluar el Core Business de Fruitlogix, es necesario simular el flujo de la cadena de suministro interactuando con los tres tipos de usuarios principales de la plataforma. Sigue estos pasos en orden:

# Paso 1: El Cliente Comercial (El inicio de la demanda)
Regístrate en la plataforma creando una cuenta nueva (ej. cliente@test.com).

Selecciona el rol de Cliente Comercial.

Navega al catálogo de productos, selecciona las frutas que deseas comprar y agrégalas a tu pedido.

Confirma el pedido y realiza el pago simulado. (Puedes usar la tarjeta de prueba: 4111 1111 1111 1111, con cualquier fecha futura y CVV 123).

# Paso 2: El Distribuidor (La gestión y logística)
Cierra sesión y crea una nueva cuenta con otro correo (ej. distribuidor@test.com).

Selecciona el rol de Distribuidor.

Dirígete a la sección Payment Management para verificar que la factura (Invoice) del Cliente Comercial se ha generado y pagado correctamente.

Dirígete a la sección Orders para visualizar el pedido pendiente.

Asigna ese pedido a un Productor disponible en la red.

(Opcional) Inicia un chat con el Productor para coordinar los detalles de la entrega.

# Paso 3: El Productor (La oferta y preparación)
Cierra sesión y crea una tercera cuenta (ej. productor@test.com).

Selecciona el rol de Productor.

Revisa la bandeja de pedidos asignados a tu cuenta.

Cambia el estado del pedido a "En Preparación" (para notificar al Distribuidor que el proceso de cosecha, separación o empaque ha comenzado).

(Opcional) Responde el chat del Distribuidor para confirmar la recepción del encargo.
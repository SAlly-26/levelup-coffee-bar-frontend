# Explicación del proyecto Level Up Coffee Bar

## 1. Descripción general

Level Up Coffee Bar es una aplicación web académica para una cafetería temática
que combina café, snacks, juegos de mesa y actividades de comunidad. La
aplicación permite navegar por el catálogo, buscar productos, armar un carrito,
registrarse, simular una compra y administrar los datos desde un panel local.

El proyecto funciona como una aplicación frontend. No tiene un backend ni una
base de datos remota: los datos de la demostración se guardan en el navegador
mediante `localStorage` y la sesión activa se guarda en `sessionStorage`.
Por este motivo, los usuarios, productos, pedidos y mensajes pertenecen al
navegador y al origen desde el que se abrió la aplicación.

## 2. Tecnologías utilizadas

- **React 18**: construcción de la interfaz mediante componentes reutilizables.
- **React Router 6**: navegación entre páginas sin recargar el documento.
- **Vite 6**: servidor de desarrollo y herramienta de compilación.
- **Bootstrap 5**: clases y controles base para formularios y diseño adaptable.
- **Lucide React**: iconos utilizados en la navegación y las acciones.
- **JavaScript moderno (ES modules)**: lógica del catálogo, persistencia y
  validaciones.
- **Jasmine y Karma**: herramientas incluidas para las pruebas del proyecto.

Las dependencias y los comandos disponibles están definidos en
[`package.json`](../package.json).

## 3. Cómo se inicia

Desde la carpeta raíz del proyecto:

```bash
npm ci
npm run dev
```

Después se abre la dirección mostrada por Vite, normalmente
`http://127.0.0.1:5173`.

Para generar y revisar una compilación de producción:

```bash
npm run build
npm run preview
```

El archivo [`index.html`](../index.html) es el punto de entrada HTML, pero no
debe abrirse directamente con doble clic. Vite carga allí
[`src/main.jsx`](../src/main.jsx), que monta la aplicación React.

## 4. Estructura y responsabilidad de los archivos

### Entrada y navegación

- [`src/main.jsx`](../src/main.jsx) importa React, Bootstrap y los estilos
  propios. También configura `HashRouter`, el `Provider` global, el encabezado,
  el pie de página y todas las rutas.
- Las rutas usan el formato `/#/ruta`. Esto permite publicar el proyecto en un
  hosting estático sin configurar reglas especiales para el servidor.
- Las rutas antiguas, como `/index.html`, `/tienda.html` o `/admin.html`, se
  redirigen a sus nuevas rutas React para conservar compatibilidad con enlaces
  de la versión anterior.
- [`src/components.jsx`](../src/components.jsx) contiene piezas compartidas:
  encabezado, pie, títulos, tarjetas de producto, campos de formulario,
  selector de cantidades, mensajes de error y estados vacíos.

### Datos iniciales y sucursales

- [`src/products.js`](../src/products.js) define los 11 productos iniciales.
  Cada producto tiene identificador, nombre, categoría, precio, imagen,
  descripción, stock, descuento y tipo (`juego` o `cafe`).
- [`src/locations.js`](../src/locations.js) concentra las sucursales, horarios,
  teléfonos, enlaces y mapas. De esta forma, esos datos se pueden cambiar en un
  solo lugar.
- [`public/img/`](../public/img/) contiene las imágenes utilizadas por la
  interfaz. Las rutas se referencian como `/img/nombre.png`.

### Persistencia y reglas del negocio

- [`src/database.js`](../src/database.js) funciona como una capa de datos local.
  Inicializa las colecciones, lee y escribe el almacenamiento, y expone
  operaciones CRUD (`create`, `get`, `list`, `update` y `remove`).
- La clave de almacenamiento principal es `levelup.database.v2`. Allí se
  guardan productos, categorías, usuarios, pedidos, mensajes, reservas y
  carrito.
- Los registros nuevos reciben un identificador con `crypto.randomUUID()`.
- `price()` calcula el precio final aplicando el descuento y redondeando al
  peso. `money()` formatea los valores como pesos chilenos.
- `validRun()` valida el RUN chileno utilizando su dígito verificador.
- `passwordHash()` genera un resumen SHA-256 con una sal por usuario. Esto evita
  guardar la contraseña directamente, aunque no convierte esta demostración en
  un sistema de autenticación para producción.

### Estado global

- [`src/store.jsx`](../src/store.jsx) crea el contexto global de la tienda.
- Expone el usuario activo, inicio y cierre de sesión, la acción para añadir
  productos al carrito, avisos temporales y una versión que fuerza la
  actualización de las vistas.
- Después de escribir datos, la capa local dispara el evento `levelup:update`.
  Además, el contexto escucha el evento `storage`, lo que permite reflejar
  cambios realizados desde otra pestaña del mismo origen.
- La sesión se identifica mediante `sessionStorage` con la clave
  `levelup.user`, por lo que cerrar la pestaña termina la sesión, mientras que
  los datos persistentes pueden permanecer en el navegador.

### Páginas para clientes

[`src/pages.jsx`](../src/pages.jsx) reúne las vistas principales:

- Inicio y presentación del negocio.
- Catálogo de juegos, menú de café y snacks, categorías y ofertas.
- Búsqueda por nombre o descripción, filtro por categoría y orden por nombre o
  precio.
- Detalle de producto.
- Carrito con cantidades, eliminación de líneas y cálculo del subtotal.
- Checkout con retiro en sucursal o despacho.
- Resultado de pago aprobado o rechazado.
- Registro, inicio de sesión, perfil e historial de compras.
- Eventos, contacto, términos y condiciones.

[`src/editorial.jsx`](../src/editorial.jsx) contiene las páginas informativas
“Nosotros” y el blog con sus artículos.

## 5. Flujo de funcionamiento de una compra

1. El usuario entra a `/tienda` o `/menu`.
2. [`ProductCard`](../src/components.jsx) muestra cada producto y permite
   añadirlo al carrito.
3. La acción `add()` de [`src/store.jsx`](../src/store.jsx) comprueba que la
   cantidad solicitada no supere el stock disponible y guarda el carrito local.
4. La página `/carrito` permite cambiar cantidades o eliminar productos.
5. En `/checkout`, el usuario selecciona despacho o retiro y completa sus
   datos.
6. `db.checkout()` vuelve a comprobar el carrito y el stock antes de confirmar.
   Esta segunda comprobación evita comprar una cantidad inválida si el stock
   cambió mientras el carrito estaba abierto.
7. Se calcula el subtotal y el despacho:
   - retiro: gratis;
   - despacho: `$3.990`;
   - despacho gratis cuando el subtotal es igual o superior a `$50.000`.
8. Se crea un pedido con copia de los productos, precios, cliente, modalidad,
   sucursal, totales y estado.
9. Se descuenta el stock y se vacía el carrito en la misma escritura local.
10. El comprobante queda disponible en el historial del usuario y en el panel
    administrativo.

Los pedidos guardan una copia de sus productos y precios. Por eso, modificar o
eliminar un producto del catálogo no altera los comprobantes históricos.

## 6. Acceso y panel administrativo

El panel está implementado en [`src/admin.jsx`](../src/admin.jsx).

La primera vez que se visita `/admin`, si no existe un administrador local, se
muestra un formulario para crear uno. La contraseña de demostración debe tener
al menos 8 caracteres, una mayúscula y un número.

Después de iniciar sesión con una cuenta cuyo rol sea `admin`, el panel permite:

- Ver un resumen de productos, usuarios, pedidos y ventas.
- Crear, editar y eliminar productos.
- Crear, editar y eliminar categorías.
- Administrar usuarios y sus roles.
- Consultar órdenes y comprobantes.
- Revisar el stock crítico.
- Generar reportes y exportarlos a CSV.
- Revisar mensajes de contacto y reservas.

Se incorporaron protecciones de negocio importantes:

- No se puede eliminar una categoría que todavía tenga productos asociados.
- Al renombrar una categoría, se actualizan sus productos.
- Un administrador no puede eliminarse ni quitarse su propio rol.
- El cambio de una orden a “Cancelado” la excluye de los reportes de ventas,
  pero no repone automáticamente el stock.

Este acceso es solamente una simulación frontend. La validación definitiva de
usuarios, permisos y contraseñas debería realizarse en un backend en una
versión productiva.

## 7. Cambios realizados y cómo se implementaron

### Migración a una aplicación React

La estructura se reorganizó desde una página HTML estática hacia componentes
React. En lugar de duplicar documentos HTML para cada sección, las vistas se
renderizan según la ruta actual. Esto permite reutilizar tarjetas, formularios,
encabezado, pie de página y mensajes.

La migración se conectó en [`src/main.jsx`](../src/main.jsx) mediante
`createRoot()` y un árbol compuesto por `ErrorBoundary`, `HashRouter`,
`Provider` y `App`.

### Separación de responsabilidades

La lógica se dividió por propósito:

- componentes visuales compartidos en `components.jsx`;
- páginas y flujos de cliente en `pages.jsx`;
- administración en `admin.jsx`;
- contenido editorial en `editorial.jsx`;
- datos iniciales en `products.js` y `locations.js`;
- reglas y persistencia en `database.js`;
- estado transversal en `store.jsx`;
- estilos en `styles.css`.

Esta división facilita modificar una parte sin mezclarla con el resto de la
aplicación.

### Catálogo dinámico

El catálogo dejó de ser contenido repetido y pasó a generarse desde
`seedProducts`. Las tarjetas reciben un producto mediante props, calculan el
precio final y deshabilitan el botón cuando el stock es cero. La vista de
catálogo aplica búsqueda, filtros y ordenamiento sobre los datos actuales.

### Carrito y checkout

El carrito se implementó como una colección persistida en la base local. Las
acciones de añadir, cambiar cantidades y eliminar líneas actualizan el mismo
origen de datos, y el contexto React provoca que la interfaz se redibuje.

La compra se centralizó en `db.checkout()` para mantener juntas las
validaciones, el cálculo de totales, el descuento de stock, la creación del
pedido y la limpieza del carrito.

### Registro y sesión local

Se agregaron formularios para registro e ingreso. El registro valida campos,
RUN y confirmación de contraseña. La contraseña se resume con SHA-256 y una sal
aleatoria antes de guardarse. El identificador del usuario se mantiene en
`sessionStorage` y el resto de sus datos se consulta desde la base local.

### Diseño visual y accesibilidad

[`src/styles.css`](../src/styles.css) incorpora la identidad visual con tonos
oscuros, verde lima, tipografías, tarjetas, banners, navegación responsive,
estados de foco, adaptación móvil y estilos de impresión. Bootstrap aporta
componentes base, mientras que los estilos propios definen la identidad de
Level Up Coffee Bar.

También se incorporaron etiquetas de formulario, textos alternativos para
imágenes, `aria-label`, estados `aria-live`, enlace para saltar al contenido,
foco visible y un `ErrorBoundary` para mostrar un error comprensible si ocurre
una excepción durante el renderizado.

### Compatibilidad con la versión anterior

Las rutas antiguas con extensión `.html` no se eliminaron sin reemplazo:
[`src/main.jsx`](../src/main.jsx) las redirige a las rutas equivalentes de
React. Esto permite mantener enlaces existentes mientras se usa la nueva
arquitectura.

## 8. Pruebas y validación

El repositorio incluye especificaciones en [`tests/`](../tests/) para validar,
entre otros aspectos:

- cálculo de precios y descuentos;
- validación de RUN;
- renderizado del catálogo y tarjetas;
- mensajes de error;
- selector y botones de cantidad;
- eventos del carrito;
- formularios;
- registro.

La configuración se encuentra en [`karma.conf.cjs`](../karma.conf.cjs) y
[`spec/support/jasmine.mjs`](../spec/support/jasmine.mjs). El documento
[`Test-Pendientes.md`](./Test-Pendientes.md) registra las pruebas pendientes y
la información que todavía debe completarse para una entrega formal, como
resultados reales, navegador, fecha y cobertura.

La compilación principal se puede comprobar con:

```bash
npm run build
```

## 9. Limitaciones actuales

- No existe backend ni base de datos remota.
- Las compras y pagos son simulados; no se realizan cobros reales.
- Las cuentas y pedidos solamente existen en el navegador donde fueron creados.
- `localStorage` no ofrece transacciones entre varias pestañas concurrentes.
- El resumen SHA-256 implementado es demostrativo; un sistema real debe usar
  autenticación del servidor y una función de derivación de claves adecuada.
- Los mapas de las sucursales requieren conexión a internet.
- Para reiniciar completamente la demostración hay que borrar los datos del
  sitio desde las herramientas del navegador. Esto elimina usuarios, carrito,
  pedidos y demás información local.

## 10. Resumen del resultado

El proyecto evolucionó desde una presentación de cafetería basada en HTML hacia
una SPA React organizada por componentes y rutas. Se conservaron la marca, los
productos y las imágenes, y se agregaron funcionalidades de tienda, carrito,
registro, checkout, contenido editorial y administración. La persistencia local
permite demostrar el flujo completo sin servidor, mientras que la separación de
archivos facilita que el equipo pueda continuar incorporando un backend real en
el futuro.

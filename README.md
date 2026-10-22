# Level Up Coffee Bar · React

Proyecto académico de cafetería gamer: catálogo de juegos, café y snacks, carrito persistente, compra simulada, cuentas y panel de administración. La aplicación funciona como frontend con datos locales en el navegador.

## Iniciar

Requisitos: Node.js 20.19+ o 22.12+ y npm. Abre una terminal dentro de la carpeta que contiene este README y `package.json`:

```sh
npm ci
npm run dev
```

También puedes abrir `INICIAR.cmd` en Windows. Si ya existe `node_modules`, basta con `npm run dev`.

Abre la dirección que imprime Vite, normalmente http://127.0.0.1:5173. No abras `index.html` con doble clic. Las rutas usan `#/` para permitir navegación en hosting estático.

## Administrador de ejemplo

La aplicación incorpora automáticamente esta cuenta al cargar los datos:

| Campo | Valor |
|---|---|
| Nombre | Admin Demo |
| Correo | `admin@levelup.test` |
| Contraseña | `DemoCafe2026` |
| Rol | `admin` |

1. Inicia el proyecto.
2. Abre `http://127.0.0.1:5173/#/login?next=/admin`, ajustando el puerto si corresponde.
3. Ingresa con el correo y la contraseña de la tabla.
4. Se abre el panel administrativo. También puedes entrar a `/#/admin` después de iniciar sesión.

La cuenta se crea tanto en una base nueva como, una sola vez, en bases anteriores. La migración conserva productos, usuarios, carrito, pedidos, mensajes y reservas. Si ya hay una cuenta con el mismo correo o ID, se conserva sin cambiar su contraseña ni rol; en ese caso usa su acceso anterior o edítala desde otra cuenta administradora.

La marca `demoAdminSeeded` evita recrear la cuenta después de eliminarla desde la administración. Si cambias su contraseña, debes usar la nueva. El formulario de alta inicial de administrador sigue disponible cuando no hay administradores; normalmente no será necesario con la cuenta de ejemplo.

**La cuenta tiene credenciales públicas y sirve solo para la presentación.** El acceso es una simulación de frontend: roles y datos están controlados por el navegador. Las contraseñas se guardan como SHA-256 de una sal y la contraseña, pero esto no sustituye autenticación, autorización ni derivación de contraseñas de un servidor real. La cuenta de ejemplo tiene una sal fija para reproducir su resumen inicial; los usuarios creados desde los formularios reciben una sal aleatoria.

## Base de datos local y sesión

No hay MySQL, backend ni archivo de base de datos. `src/database.js` implementa el acceso a un objeto JSON guardado en el navegador:

| Almacenamiento | Clave | Contenido |
|---|---|---|
| `localStorage` | `levelup.database.v2` | Productos, categorías, usuarios, pedidos, mensajes, reservas, carrito y marca de inicialización del admin |
| `sessionStorage` | `levelup.user` | ID del usuario de la sesión |

Para inspeccionarlo: F12 → Application/Aplicación → Local Storage → origen de la app → `levelup.database.v2`. La clave se inicializa al cargar los datos por primera vez.

Para listar cuentas sin mostrar los resúmenes de contraseña, ejecuta en la consola del navegador:

```js
console.table(
  JSON.parse(localStorage.getItem('levelup.database.v2') || '{"users":[]}')
    .users.map(({ nombre, correo, role }) => ({ nombre, correo, role }))
);
```

Los datos son distintos por navegador, perfil, dominio y puerto. `localhost` y `127.0.0.1` no comparten almacenamiento. El servidor de preview suele usar otro puerto y tendrá otra base local. Cerrar sesión conserva los datos y el carrito, que se comparte entre las cuentas de ese mismo origen.

Para restablecer la demo, respalda primero el valor completo de la clave. Estos comandos **eliminan toda la base local y el historial**, y recrean el catálogo y admin iniciales:

```js
localStorage.removeItem('levelup.database.v2');
sessionStorage.removeItem('levelup.user');
location.reload();
```

## Funciones incluidas

- Inicio, tienda, cafetería, categorías, ofertas y detalle de producto.
- Búsqueda por nombre/descripción, filtro por categoría y orden por nombre o precio.
- Carrito persistente, cantidades, eliminación y validación de stock.
- Registro con RUN chileno, confirmación de contraseña, inicio y cierre de sesión.
- Perfil editable, datos de entrega e historial de compras del usuario.
- Checkout como invitado o usuario, retiro en sucursal o envío y pago simulado aprobado/rechazado.
- Pedidos con comprobante imprimible y copia histórica de productos y precios.
- Administración: resumen, CRUD de productos/categorías/usuarios, historial, pedidos, stock crítico, reportes y exportación CSV.
- Formulario de contacto y solicitudes de reservas con estados administrables.
- Nosotros, blog, artículos, dos sucursales y mapas de Google.
- Diseño adaptable, navegación móvil, campos etiquetados, foco visible y estados vacíos/errores.

No hay cobros reales, correos salientes ni sincronización entre equipos. Los mensajes y reservas solo se guardan localmente.

## Estructura del código

| Archivo | Responsabilidad |
|---|---|
| `src/main.jsx` | Entrada, contexto y rutas con HashRouter |
| `src/products.js` | Los 11 productos iniciales, stock y descuentos |
| `src/database.js` | Inicialización del admin demo, migración, CRUD, persistencia, compra, precios, RUN y hash |
| `src/store.jsx` | Contexto React, sesión, carrito, avisos y actualización de vistas |
| `src/components.jsx` | Cabecera, pie, tarjetas, campos, cantidades y componentes compartidos |
| `src/pages.jsx` | Tienda, cuenta, carrito, compra, comprobantes, comunidad y contacto |
| `src/admin.jsx` | Panel, formularios de gestión, validaciones y reportes |
| `src/editorial.jsx` | Nosotros, blog y artículos |
| `src/locations.js` | Direcciones, teléfonos, horarios y enlaces de mapas |
| `src/ubicaciones.jsx` | Componente Locations para mostrar sucursales |
| `src/styles.css` | Estilos propios, adaptación móvil e impresión |
| `public/img/` | Imágenes locales del catálogo y páginas |
| `tests/` | Pruebas Jasmine de lógica y componentes |
| `karma.conf.cjs` | Ejecución de pruebas en ChromeHeadless con esbuild |

Tecnologías declaradas: React 18.3.1, React Router 6.30.6, Bootstrap 5.3.8, Lucide React 0.468.0 y Vite 6.4.4. Las versiones de herramientas de pruebas están en `package.json` y las versiones resueltas en `package-lock.json`.

## Cambios habituales para la presentación

- Texto del inicio: `Home` en `src/pages.jsx`.
- Color principal: variable `--lime` al principio de `src/styles.css`.
- Tarjeta de producto: `ProductCard` en `src/components.jsx`.
- Productos de una base existente: Admin → Productos. Editar `products.js` solo cambia los datos iniciales de una base nueva.
- Nueva imagen: copiar a `public/img/` y usar `/img/nombre.png`. Escribir la ruta en el admin no sube un archivo.
- Sucursales: `src/locations.js`. Si cambias ubicación, actualiza dirección, `mapEmbed` y `mapUrl`; si cambias teléfono, actualiza `phone` y `tel`.
- Regla de envío: está en `Checkout` de `src/pages.jsx` y en `checkout` de `src/database.js`. Cambia ambas y los textos informativos para mantener consistencia.
- Stock crítico: busca `stock <= 5` y el texto del umbral en `src/admin.jsx`.

Los mapas y fuentes de Google necesitan internet; las fuentes tienen alternativas del sistema. React, Bootstrap, iconos e imágenes se sirven desde el proyecto.

## Reglas de la compra

- Precios en CLP; descuentos por unidad redondeados al peso.
- Retiro gratuito. Envío $3.990, gratis desde $50.000 de productos.
- Stock crítico: 5 unidades o menos.
- Agregar al carrito no descuenta stock; una compra aprobada sí.
- Pago rechazado: no crea pedidos, no descuenta existencias y conserva el carrito.
- Pago aprobado: vuelve a validar stock, crea el pedido, descuenta existencias y vacía el carrito en una sola escritura de la base.
- Los pedidos conservan una copia de sus productos y precios: editar o eliminar el catálogo no modifica sus comprobantes.
- Cancelar un pedido lo excluye de las ventas reportadas, pero no repone stock. La reposición se hace desde Productos.
- No se eliminan categorías con productos sin reasignarlos antes.
- Un administrador no puede eliminar su propia cuenta ni quitarse su rol.
- Las ventas del resumen incluyen envío; las ventas por categoría suman productos. El CSV incluye todos los pedidos, también cancelados.

Hay eventos React y sincronización entre pestañas del mismo origen mediante `storage`, pero no transacciones para compras concurrentes ni restricciones de seguridad de servidor.

## Pruebas y compilación

Existen 12 archivos de pruebas con 36 casos iniciales: RUN, precio, catálogo, errores, props de producto/cantidad, agregar productos, formularios, búsqueda, eventos de cantidad, carrito y registro.

```sh
npx karma start karma.conf.cjs --single-run
```

Karma usa Jasmine, esbuild y ChromeHeadless. Necesita Chrome instalado y disponible; si no lo encuentra, configura `CHROME_BIN` con la ruta de tu instalación. No hay script `npm test`. Estas pruebas de componentes requieren navegador/DOM; ejecutar Jasmine directamente no sustituye el flujo de Karma.

Para generar y revisar la entrega:

```sh
npm run build
npm run preview
```

La compilación genera `dist/`. Para cambios en vivo usa `npm run dev`; preview requiere recompilar después de editar código. No hay instrumentación de cobertura configurada en Karma; no declarar porcentajes sin medirlos.

Registra resultados reales, navegador y fecha antes de presentar. Una compilación correcta no demuestra por sí sola que todas las pruebas pasaron.

## Recorrido sugerido de demostración

1. Mostrar catálogo, búsqueda, filtros y detalle.
2. Agregar al carrito y recargar para demostrar persistencia.
3. Simular pago rechazado y después aprobado.
4. Mostrar comprobante y stock actualizado.
5. Entrar con el admin de ejemplo y editar un producto.
6. Revisar pedidos, reportes, mensajes y reservas.
7. Mostrar `ProductCard` → `add` en store → `setCart` en database → evento de actualización → React.
8. Enseñar `Checkout` → `db.checkout`, base local y una prueba de precios.

## Documentación y alcance

En `docs/` se incluyen `ERS_Level_Up_Coffee_Bar_V2.docx` y `Test-Pendientes.md`. Este último contiene notas del equipo; contrasta los resultados pendientes con una ejecución real.

El proyecto no incluye backend ni publica automáticamente un repositorio o sitio. Completar integrantes, sección, docente, datos reales del negocio y revisión de permisos de imágenes antes de entregar. Para producción se necesita persistencia de servidor, autenticación y autorización reales, control de concurrencia y una integración de pagos.

# Level Up Coffee Bar · Entrega II

Migración de la base HTML a React con Bootstrap, conservando marca, productos, nombres e imágenes originales. Incluye una renovación visual en verde lima, tonos oscuros y tipografía legible.

## Iniciar el proyecto

Requisitos: Node.js 20.19+ o 22.12+ y npm. Abre una terminal **dentro de esta carpeta**:

```sh
npm ci
npm run dev
```

Abre la dirección que imprime Vite, normalmente http://127.0.0.1:5173. No abras index.html con doble clic.

Para la versión de entrega:

```sh
npm run build
npm run preview
```

La carpeta `dist/` contiene la compilación. Las rutas usan `#/` para permitir navegación en hosting estático sin reglas especiales del servidor. Al usar otro puerto, navegador o dominio se obtiene un almacenamiento local diferente.

## Acceso administrativo

Entra a `/#/admin`. Si no hay administrador, aparece el formulario para crear la primera cuenta local. Define un nombre, correo y contraseña de demostración (8 caracteres, mayúscula y número). Después podrás iniciar sesión en `/#/login`. No hay contraseñas universales ni cuentas preinstaladas en el ZIP.

Este acceso es una **simulación de frontend**: el navegador controla los datos y roles. No proporciona seguridad de servidor. Las claves se resumen con SHA-256 y una sal por usuario para evitar almacenarlas literalmente, pero eso no reemplaza un sistema de autenticación real ni una función de derivación de contraseñas para producción.

## Funciones incluidas

- Inicio, tienda, cafetería, categorías, ofertas, detalle de producto, nosotros, blog y dos artículos.
- Búsqueda, filtros por categoría y orden por nombre o precio.
- Carrito persistente, cantidades, eliminación de líneas y validación de existencias.
- Registro con RUN chileno, validación de contraseña y confirmación, inicio y cierre de sesión.
- Perfil editable, datos de entrega e historial de compras del usuario.
- Checkout con datos autocompletados desde el perfil, retiro o envío y pago de demostración aprobado/rechazado.
- Pedidos con comprobante imprimible y copia de precios/productos al momento de comprar.
- Administración: resumen, CRUD de productos, categorías y usuarios; historial de compras; órdenes y comprobantes; stock crítico; reportes y exportación CSV; mensajes y reservas.
- Formulario de contacto y solicitudes de reservas guardados en la base local.
- Bootstrap instalado localmente, diseño adaptable, navegación móvil, etiquetas de formularios, foco visible y estados vacíos/errores.

## Estructura

### Sucursales y mapas

La vista `/#/contacto` conserva las dos ubicaciones, teléfonos, mapas de Google y horario de la página original. El menú “Visítanos”, el inicio y el pie enlazan esta sección. El checkout permite elegir sucursal de retiro y la dirección elegida queda registrada en el comprobante.

Para cambiar direcciones, teléfonos o mapas, editar **`src/locations.js`**. El componente **`src/BranchLocations.jsx`** los muestra de forma adaptable a móviles. `mapEmbed` es la URL del iframe de Google Maps y `mapUrl` el enlace del botón “Cómo llegar”; ambos se conservaron del HTML original. Los mapas requieren internet. No se agregó una clave de API ni dependencias.

| Archivo              | Responsabilidad                                                                      |
| -------------------- | ------------------------------------------------------------------------------------ |
| `src/seed.js`        | Fuente inicial JS: los 11 productos originales, más stock y descuentos demostrativos |
| `src/database.js`    | CRUD y persistencia, validación RUN, cálculo de precios y operación de compra        |
| `src/store.jsx`      | Contexto React, sincronización de cambios, sesión, carrito y avisos                  |
| `src/components.jsx` | Cabecera, pie, tarjetas, campos, cantidades y componentes compartidos                |
| `src/pages.jsx`      | Vistas de tienda, cuenta, compra, comunidad y contacto                               |
| `src/admin.jsx`      | Administración y formularios de gestión                                              |
| `src/editorial.jsx`  | Nosotros, blog y artículos                                                           |
| `src/main.jsx`       | Entrada y rutas                                                                      |
| `src/styles.css`     | Identidad visual, adaptación a tamaños e impresión                                   |
| `public/img/`        | Imágenes conservadas del proyecto base                                               |

## Reglas de la demostración

Precios en CLP. Envío $3.990; gratis desde $50.000 de productos. Retiro gratuito. Los descuentos se aplican por unidad, redondeados al peso. Stock crítico: 5 unidades o menos. Un pago rechazado conserva el carrito y no crea pedidos. Una compra aprobada vuelve a comprobar el stock, crea el pedido, descuenta existencias y vacía el carrito en una única escritura de la base.

El cambio administrativo a Cancelado excluye el pedido de las ventas reportadas, pero **no repone stock**: ajustar desde Productos si corresponde. El catálogo se puede eliminar sin afectar los comprobantes históricos porque cada pedido guarda una copia de sus ítems. Las categorías con productos no se pueden eliminar; primero se deben reasignar los productos. Un administrador no puede eliminarse ni quitarse su propio rol.

Los datos se guardan en `localStorage`, clave `levelup.database.v2`. La sesión está en `sessionStorage`, clave `levelup.user`. No hay servidor, cobros reales, correo saliente ni sincronización entre dispositivos. Existe actualización mediante eventos React y el evento de almacenamiento entre pestañas del mismo origen; no hay transacciones entre pestañas concurrentes. Para reiniciar, borrar el almacenamiento del sitio desde las herramientas del navegador (se pierde todo el historial local).

Las fuentes web tienen alternativas del sistema si no hay internet. Bootstrap, React, iconos e imágenes se sirven desde el propio proyecto.

## Documentos y pendientes de entrega

Revisar `docs/ERS-v2.md`, `docs/MATRIZ-REQUISITOS.md`, `docs/GUIA-PRESENTACION.md` y `docs/COBERTURA-PENDIENTE.md`.

**Jasmine y Karma no están configurados, y no hay pruebas unitarias creadas ni resultados de cobertura**, por indicación del equipo. Las verificaciones de compilación y recorridos de navegador no sustituyen ese trabajo.

El ZIP original no incluía backend. La integración real frontend/backend mencionada al final de la pauta queda fuera de esta demostración y debe realizarse con el backend del equipo si el docente la exige. El enlace público de GitHub debe ser creado o actualizado por el equipo en su repositorio; este trabajo no publica ni modifica cuentas externas. Completar integrantes, sección, docente y datos reales del negocio antes de entregar. Verificar también permisos de las imágenes originales.


# Especificación de requisitos de software · Versión 2.0

**Proyecto:** Level Up Coffee Bar  
**Asignatura:** DSY1104 · Evaluación Parcial 2  
**Fecha:** 19 de octubre de 2026  
**Estado:** Propuesta implementada de frontend; revisión y aprobación pendientes del equipo.  
**Integrantes / sección / docente:** Completar por el equipo.

## 1. Propósito

Transformar la tienda HTML existente en una aplicación React que reúna la venta demostrativa de juegos, la carta de cafetería y la participación de una comunidad gamer. Mejorar navegación, legibilidad y experiencia móvil, e incorporar gestión administrativa y persistencia simulada.

## 2. Alcance y exclusiones

**Actualización de tienda física:** Se restituyen las dos sucursales del proyecto base, con dirección, teléfono, horario y mapa integrado. El visitante puede abrir indicaciones en Google Maps y el comprador puede elegir sucursal para retiro gratuito. El pedido conserva el nombre y la dirección seleccionados para su comprobante. Estos datos se mantienen en `src/locations.js`.

Se implementan componentes React reutilizables, rutas, fuente de datos JavaScript con CRUD, persistencia local, Bootstrap y flujos de compra, cuenta y administración. Se conservan los 11 productos y las imágenes de la base, con stock inicial de 20 unidades y descuentos de ejemplo en tres productos.

Por solicitud expresa del equipo se excluyen la configuración Jasmine/Karma y la escritura/ejecución de sus pruebas. No se declara cobertura. El archivo entregado no contenía un backend: no se implementan pagos reales, autenticación de servidor, correos, base remota ni conexión con un backend desconocido. La presentación con integración real mencionada en la pauta debe coordinarse con el docente y el backend del equipo.

## 3. Actores

| Actor               | Capacidades                                                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Visitante           | Navegar, filtrar, ver detalles, gestionar carrito, comprar como invitado, registrarse, contactar y solicitar reservas |
| Cliente             | Capacidades del visitante, más iniciar/cerrar sesión, editar perfil y consultar compras asociadas                     |
| Administrador local | Gestionar productos, categorías, usuarios, pedidos, reportes, mensajes y reservas                                     |

Los roles son una simulación de interfaz; el almacenamiento del cliente es editable por quien controla el navegador.

## 4. Requisitos funcionales y aceptación

| ID    | Requisito               | Criterio de aceptación                                                                              |
| ----- | ----------------------- | --------------------------------------------------------------------------------------------------- |
| RF-01 | Navegación React        | Cada vista tiene una ruta y es alcanzable mediante enlaces; hay tratamiento de rutas inexistentes   |
| RF-02 | Catálogo                | Se listan productos con imagen, categoría, precio y disponibilidad                                  |
| RF-03 | Búsqueda y filtros      | Nombre/descripción, categoría y orden actualizan los productos sin recargar el documento            |
| RF-04 | Categorías y ofertas    | Existen vistas dedicadas; ofertas contiene únicamente productos con descuento                       |
| RF-05 | Detalles                | Cada producto tiene descripción, precio, stock, selector de cantidad y sugerencias                  |
| RF-06 | Carrito persistente     | Agregar, cambiar cantidad y eliminar se reflejan en la interfaz y sobreviven una recarga            |
| RF-07 | Registro                | Rechaza RUN inválido, correo duplicado, claves débiles y confirmación desigual                      |
| RF-08 | Sesión                  | Solo credenciales coincidentes permiten entrar; salir elimina la sesión local                       |
| RF-09 | Perfil                  | Se pueden editar nombre, teléfono, dirección y comuna; checkout precarga esos datos                 |
| RF-10 | Entrega                 | Permite retiro gratis o envío; exige dirección, comuna y región para despacho                       |
| RF-11 | Pago simulado           | Aprobación genera pedido; rechazo muestra error recuperable y conserva el carrito                   |
| RF-12 | Confirmación            | Presenta identificador, fecha, cliente, productos, cantidades, entrega, total y estado              |
| RF-13 | Comprobante e historial | Se puede imprimir; clientes ven compras asociadas y admin puede abrir cualquier comprobante local   |
| RF-14 | CRUD de productos       | Admin crea, consulta, modifica y elimina; cambios aparecen en catálogo                              |
| RF-15 | CRUD de categorías      | No permite duplicados ni eliminar categorías usadas; renombrar actualiza productos asociados        |
| RF-16 | CRUD de usuarios        | Permite crear, editar, consultar y eliminar; protege autoeliminación/autodegradación administrativa |
| RF-17 | Stock                   | La compra valida disponibilidad y descuenta; listado crítico incluye stock menor o igual a 5        |
| RF-18 | Órdenes                 | Admin consulta pedidos y cambia su estado sin alterar el comprobante original de productos/precios  |
| RF-19 | Reportes                | Muestra totales, ticket promedio, ventas por categoría y permite exportar pedidos CSV               |
| RF-20 | Comunidad/contacto      | Guarda solicitudes y consultas; admin puede revisar y actualizar sus estados                        |
| RF-21 | Contenido institucional | Nosotros, blog y artículos amplían las vistas públicas del diagrama                                 |

## 5. Requisitos no funcionales

| ID     | Requisito                       | Implementación                                                                                             |
| ------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| RNF-01 | Adaptación visual               | Bootstrap 5.3.8 y CSS con puntos de adaptación de 1100, 850 y 540 px                                       |
| RNF-02 | Accesibilidad básica            | Encabezados, etiquetas, navegación por teclado, enlace de salto, foco visible, avisos y errores anunciados |
| RNF-03 | Separación de responsabilidades | Datos, estado, componentes compartidos y vistas en módulos diferentes                                      |
| RNF-04 | Persistencia                    | Escrituras controladas y mensajes por fallos de almacenamiento; esquema local V2                           |
| RNF-05 | Consistencia comercial          | Totales calculados desde el catálogo actual al confirmar; pedidos conservan instantáneas                   |
| RNF-06 | Reproducibilidad                | Dependencias fijadas mediante package-lock y compilación Vite                                              |
| RNF-07 | Privacidad de demostración      | No solicitar tarjetas; avisar que no se deben ingresar datos reales                                        |

## 6. Reglas del negocio

1. Moneda CLP; descuento por unidad y redondeo al peso.
2. Stock inicial de ejemplo: 20 por producto; compra de unidades enteras positivas sin superar existencias.
3. Despacho $3.990 o gratuito cuando subtotal >= $50.000; retiro $0.
4. Un rechazo de pago no genera pedido ni descuenta stock.
5. Cancelar cambia el estado y excluye la venta del resumen; reposición de stock manual.
6. Reservas son solicitudes, no garantizan cupos ni fechas.
7. Categorías no se eliminan si contienen productos.

## 7. Modelo de datos

| Entidad   | Campos principales                                                                              |
| --------- | ----------------------------------------------------------------------------------------------- |
| Producto  | id, nombre, categoria, tipo, precio, descuento, stock, imagen, descripcion                      |
| Categoría | id, nombre                                                                                      |
| Usuario   | id, nombre, correo, run, role, salt, password resumida, telefono, direccion, comuna             |
| Carrito   | id del producto, quantity                                                                       |
| Pedido    | id, number, date, userId opcional, customer, delivery, items, subtotal, shipping, total, status |
| Mensaje   | id, nombre, correo, mensaje, date, status                                                       |
| Reserva   | id, nombre, correo, personas, event, userId, date, status                                       |

Los datos se guardan juntos bajo `levelup.database.v2`. Las funciones list/get/create/update/remove actúan sobre colecciones; checkout realiza la compra en una única escritura. La aplicación reacciona a eventos de actualización sin recargar. Esto no equivale a una base transaccional multiusuario.

## 8. Casos de uso principales

**CU-01 Compra:** Explorar catálogo → detalle → agregar → carrito → checkout → datos/entrega → simular pago → comprobante. Alternativas: stock cambiado, validación incompleta o pago rechazado; mostrar mensaje o permitir reintento.

**CU-02 Administración:** Crear administrador inicial o iniciar sesión → seleccionar módulo → crear/editar/consultar/eliminar → persistir → reflejar cambio. Alternativas: categoría ocupada, datos inválidos o falta de permisos de escritura; informar y conservar el formulario.

**CU-03 Cliente:** Registrarse → iniciar sesión → completar perfil → comprar con datos precargados → revisar historial. Alternativas: RUN, correo o contraseña inválidos; informar antes de guardar.

## 9. Dependencias, riesgos y pendientes

Node/npm para desarrollo; navegador moderno con Web Crypto en localhost o HTTPS para registro; almacenamiento habilitado. Las fuentes usan internet con respaldo local del sistema. El frontend local no protege datos contra manipulación, no sincroniza dispositivos y no resuelve escrituras simultáneas entre pestañas.

Pendiente del equipo: identificación académica, pruebas y cobertura con Jasmine/Karma, repositorio público, conexión al backend real si aplica, datos operativos reales y aprobación del ERS. La guía de exposición está preparada para una presentación de 15 minutos con 5 de preguntas.

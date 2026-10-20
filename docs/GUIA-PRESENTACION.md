# Guía de presentación · 15 minutos + 5 de preguntas

## Preparación

1. Instalar con npm ci e iniciar con npm run dev.
2. Usar un navegador limpio, crear la primera cuenta administrativa en /#/admin y anotar las credenciales propias de demostración.
3. Crear una cuenta cliente ficticia, completar dirección y revisar el flujo de compra.
4. Preparar el repositorio del equipo con commits verdaderos; no atribuir cambios no realizados a integrantes.
5. Completar ERS, pruebas y documento de cobertura con sus evidencias reales.

## Recorrido sugerido

| Tiempo    | Demostración                                                                              |
| --------- | ----------------------------------------------------------------------------------------- |
| 0–2 min   | Problema, identidad del negocio, base HTML y objetivo de migración                        |
| 2–5 min   | Inicio adaptable; categorías, búsqueda, orden, detalle y ofertas                          |
| 5–8 min   | Cliente, perfil, carrito, checkout precargado; rechazo y luego aprobación                 |
| 8–11 min  | Admin: crear/editar un producto, revisar categorías/usuarios, pedido, comprobante y stock |
| 11–13 min | Reportes/CSV; arquitectura React, Context, base JS y persistencia                         |
| 13–15 min | ERS y pruebas que ustedes implementen; limitaciones y siguientes pasos                    |

## Preguntas que cada integrante debe poder responder

- ¿Qué hacen las props de ProductCard y Quantity?
- ¿Qué estado vive en una vista y cuál se comparte en Provider?
- ¿Cómo se propaga una escritura del CRUD a la interfaz?
- ¿Por qué un pedido guarda una copia de los productos y precios?
- ¿Qué cambia al pasar de localStorage a un backend?
- ¿Por qué el acceso administrativo del navegador no es seguridad real?
- ¿Qué validaciones se hacen en checkout y qué sucede si cambia el stock?
- ¿Cómo comprobaron renderizado, props, estado y eventos con sus pruebas?
- ¿Qué commits y módulos trabajó cada integrante?

## Antes de entregar

- Completar integrantes, sección y docente en el ERS.
- Configurar y desarrollar Jasmine/Karma por cuenta del equipo, como solicitaron.
- Completar la cobertura con resultados reales.
- Confirmar con docente si la exposición exige backend real y conectarlo si corresponde.
- Confirmar dirección, horarios y contactos reales; no hay datos inventados del negocio.
- Subir al repositorio público del equipo sin node_modules, datos personales o credenciales.
- Entregar el enlace GitHub, el ZIP, el ERS revisado y la cobertura final.

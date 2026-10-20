# Verificaciones realizadas

Fecha: 19 de octubre de 2026. Proyecto probado en vista previa local, con datos ficticios. Estos resultados **no son pruebas Jasmine/Karma ni un informe de cobertura unitaria**.

| Verificación                  | Resultado observado                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Compilación Vite              | Finaliza sin errores; genera dist con fuentes e imágenes                                                      |
| Carrito                       | Añadir Catan refleja una unidad y subtotal de $39.990                                                         |
| Pago rechazado                | Abre la vista de error y mantiene una unidad en carrito                                                       |
| Reintento/aprobación          | Genera comprobante con producto, cantidad y total; carrito queda en cero                                      |
| Stock de la compra            | En administración Catan pasa de 20 a 19                                                                       |
| Alta inicial de administrador | Permite crear cuenta ficticia y abre resumen con métricas                                                     |
| Edición de producto           | Cambiar stock a 5 se guarda y aparece en listado de stock crítico                                             |
| Búsqueda                      | Buscar Catan muestra una coincidencia                                                                         |
| Menú móvil                    | Se abre y cierra; al elegir vista se cierra                                                                   |
| Registro                      | RUN de ejemplo válido, confirmación y datos ficticios crean perfil                                            |
| Perfil                        | Muestra nombre, dirección y comuna ingresados                                                                 |
| Diseño                        | Inspección en escritorio y viewport móvil; inicio sin imágenes rotas ni desborde horizontal en medición móvil |
| Recursos de imagen            | No faltan rutas estáticas referenciadas                                                                       |

La revisión de navegador fue sobre desarrollo local. No se ha verificado un despliegue remoto, otros navegadores, concurrencia entre pestañas ni integración con backend. El ZIP no contiene el almacenamiento ni las cuentas utilizadas para estas verificaciones.

# Documento de testing · Pendiente del equipo

**Estado:** Sin pruebas Jasmine/Karma implementadas ni ejecutadas.  
**Motivo:** El equipo solicitó hacerse cargo de ese trabajo.  
**Cobertura:** No medida. No interpretar las verificaciones de compilación o de interfaz como cobertura unitaria.

## Matriz para completar después de sus pruebas

| ID   | Componente / lógica | Caso                                                         | Resultado | Evidencia |
| ---- | ------------------- | ------------------------------------------------------------ | --------- | --------- |
| T-01 | ProductCard         | Renderizar nombre, imagen, categoría y precio desde props    | Pendiente | Pendiente |
| T-02 | ProductCard         | Llamar agregar al pulsar; deshabilitar si stock=0            | Pendiente | Pendiente |
| T-03 | Quantity            | Aumentar/disminuir dentro de límites                         | Pendiente | Pendiente |
| T-04 | Catálogo            | Búsqueda, filtros, orden y estado sin coincidencias          | Pendiente | Pendiente |
| T-05 | Registro            | RUN, correo duplicado, clave y confirmación inválidos        | Pendiente | Pendiente |
| T-06 | ErrorMessage        | Renderizado condicional de errores                           | Pendiente | Pendiente |
| T-07 | Carrito             | Agregar existente, eliminar, persistir y limitar por stock   | Pendiente | Pendiente |
| T-08 | Checkout            | Autocompletar, requerir dirección y calcular envío           | Pendiente | Pendiente |
| T-09 | Compra              | Aprobar genera pedido, descuenta stock y limpia carrito      | Pendiente | Pendiente |
| T-10 | Pago rechazado      | Conserva carrito, no genera pedido y permite reintento       | Pendiente | Pendiente |
| T-11 | CRUD                | Crear, leer, actualizar y eliminar en almacenamiento aislado | Pendiente | Pendiente |
| T-12 | Categorías          | Rechazar eliminación ocupada y renombrar productos           | Pendiente | Pendiente |
| T-13 | Reportes            | Totales, exclusión de cancelados y stock crítico             | Pendiente | Pendiente |
| T-14 | Persistencia        | Fallo de escritura y contenido inválido generan error        | Pendiente | Pendiente |
| T-15 | Roles               | Cliente sin panel; admin no puede autoeliminarse             | Pendiente | Pendiente |

## Información que deben incorporar

- Versiones utilizadas de Jasmine, Karma y herramientas de React.
- Comando de ejecución, navegador y fecha.
- Resultados reales: aprobadas/fallidas, capturas y correcciones.
- Porcentajes reales de cobertura si configuran instrumentación.
- Límites conocidos y conclusiones del equipo.

Usar datos y almacenamiento aislados por prueba. Los componentes de rutas necesitan router y Provider. Los módulos de datos necesitan simular localStorage, eventos y Web Crypto cuando el entorno no los incluya. No usar cuentas, pedidos ni datos reales.

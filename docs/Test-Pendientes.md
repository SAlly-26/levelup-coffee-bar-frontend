# Documento de testing · Tests Pendientes


| N.º | Grupo y archivo sugerido | Tipo | Las tres especificaciones |

| Todo se ejecuta con estos comandos:
| npx karma start karma.conf.cjs
| npx jasmine

|---|---|---|---|
| **1 ✅** | **RUN** — `run.spec.js` | Validación de lógica | 1- Acepta RUN válido. 2- Rechaza verificador incorrecto. 3- Rechaza texto como `"hola"`. |

| **2 ✅** | **Precio** — `precio.spec.js` | Validación de lógica | 1- Mantiene el precio sin descuento. 2- Aplica el porcentaje correctamente. 3- Redondea el resultado al peso. |

| **3 ✅** | **Listado de productos** — `catalogo.spec.js` | Renderizado correcto | 1- Renderiza tantos productos como contiene el conjunto de prueba. 2- Muestra los nombres de todos esos productos. 3- Muestra el estado vacío si no hay productos. |

| **4 ✅** | **Mensaje de error** — `error.spec.js` | Renderizado condicional | 1- Muestra el mensaje cuando existe un error. 2- No muestra una alerta cuando el mensaje está vacío. 3- Actualiza el texto al recibir otro error. |

| **5 ✅** | **Datos de una tarjeta** — `producto-props.spec.js` | Props | 1- Muestra el nombre recibido. 2- Usa la imagen y el texto alternativo correspondientes. 3- Muestra el precio calculado del producto recibido. |

| **6 ✅** | **Selector de cantidad** — `cantidad-props.spec.js` | Props y renderizado condicional | 1- Muestra el valor recibido. 2- Deshabilita disminuir cuando el valor es 1. 3- Deshabilita aumentar cuando alcanza el máximo recibido. |

| **7** | **Botón de agregar producto** — `agregar-evento.spec.js` | Props y eventos | 1- Tiene una etiqueta que identifica el producto. 2- Al pulsarlo, llama a la función de agregar con el producto correcto. 3- Sin stock, está deshabilitado y no llama a esa función. |

| **8** | **Edición de un formulario** — `formulario-state.spec.js` | State | 1- Empieza con los campos vacíos. 2- Escribir un nombre actualiza ese campo. 3- Escribir un correo actualiza ese campo sin borrar el nombre. |

| **9** | **Búsqueda del catálogo** — `busqueda-state.spec.js` | State e interacción | 1- Escribir un nombre filtra los resultados. 2- Una búsqueda sin coincidencias muestra el mensaje correspondiente. 3- Borrar la búsqueda recupera el listado inicial. |

| **10** | **Botones de cantidad** — `cantidad-eventos.spec.js` | Eventos | 1- Pulsar aumentar llama a `onChange` con el valor siguiente. 2- Pulsar disminuir llama a `onChange` con el valor anterior. 3- Pulsar aumentar estando en el máximo no llama a `onChange`. |

| **11** | **Acciones del carrito** — `carrito-eventos.spec.js` | Eventos y actualización de interfaz | 1- Aumentar una cantidad actualiza el subtotal. 2- Eliminar una línea hace desaparecer ese producto. 3- Eliminar la última línea muestra el carrito vacío. |

| **12** | **Formulario de registro** — `registro.spec.js` | Eventos y renderizado condicional | 1- Enviar con RUN inválido muestra su error. 2- Enviar con contraseñas diferentes muestra su error. 3- Enviar datos válidos crea el usuario y continúa al perfil. |

## Información que deben incorporar

- Versiones utilizadas de Jasmine, Karma y herramientas de React.
- Comando de ejecución, navegador y fecha.
- Resultados reales: aprobadas/fallidas, capturas y correcciones.
- Porcentajes reales de cobertura si configuran instrumentación.
- Límites conocidos y conclusiones del equipo.

Usar datos y almacenamiento aislados por prueba. Los componentes de rutas necesitan router y Provider. Los módulos de datos necesitan simular localStorage, eventos y Web Crypto cuando el entorno no los incluya. No usar cuentas, pedidos ni datos reales.

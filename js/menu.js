// ================================================
// MENÚ DE CAFÉ Y SNACKS — Level Up Coffee Bar
// ================================================

const productosMenu = [
    {
        id: 101,
        nombre: 'Radiant Espresso',
        categoria: 'Café',
        precio: 3990,
        imagen: 'img/espresso.png',
        descripcion: 'Boost de energía instantáneo. Ideal antes de una partida clasificatoria.'
    },
    {
        id: 102,
        nombre: 'Capuchino Trifuerza',
        categoria: 'Café',
        precio: 5990,
        imagen: 'img/capuchino.png',
        descripcion: 'Equilibrio perfecto entre espresso, leche vaporizada y espuma de leyenda.'
    },
    {
        id: 103,
        nombre: 'Latte AFK',
        categoria: 'Café',
        precio: 4990,
        imagen: 'img/latte.png',
        descripcion: 'Suave y reconfortante. Perfecto para un descanso fuera del teclado.'
    },
    {
        id: 104,
        nombre: 'Poción de Vida',
        categoria: 'Pociones',
        precio: 6990,
        imagen: 'img/pociondevida.png',
        descripcion: 'Bebida frutal energizante de color rojo intenso. Restaura +100 de HP.'
    },
    {
        id: 105,
        nombre: 'Cold Brew Jungla',
        categoria: 'Pociones',
        precio: 8990,
        imagen: 'img/coldbrewjungla.png',
        descripcion: 'Extracción en frío con toque herbal para no perder la concentración.'
    },
    {
        id: 106,
        nombre: 'Muffin de Maná',
        categoria: 'Snacks',
        precio: 3490,
        imagen: 'img/muffindemana.png',
        descripcion: 'Bizcocho con arándanos y chispas de chocolate. Restaura +50 de MP.'
    },
    {
        id: 107,
        nombre: 'Sandwich GG WP',
        categoria: 'Snacks',
        precio: 5990,
        imagen: 'img/sandwich.png',
        descripcion: 'Pan ciabatta con jamón, queso fundido y aderezo especial del chef.'
    }
];

// Cambiar la cantidad en el selector (+ / -)
function cambiarCantidad(id, cambio) {
    const span = document.getElementById(`cantidad-${id}`);
    if (!span) return;
    let cantidad = parseInt(span.textContent) || 1;
    cantidad += cambio;
    if (cantidad < 1) cantidad = 1;
    span.textContent = cantidad;
}

// Agregar producto al carrito en localStorage
function agregarAlCarrito(id) {
    const producto = productosMenu.find(p => p.id === id);
    if (!producto) return;

    const span = document.getElementById(`cantidad-${id}`);
    const cantidad = span ? parseInt(span.textContent) || 1 : 1;

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const yaExiste = carrito.find(item => item.id === id);

    if (yaExiste) {
        yaExiste.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarBadge(carrito);

    // Reiniciar contador visual a 1
    if (span) span.textContent = '1';

    alert(`Se han añadido ${cantidad} unidad(es) de "${producto.nombre}" al carrito.`);
}

// Actualizar el número del carrito en la barra de navegación
function actualizarBadge(carrito) {
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = totalItems;
}

// Al cargar la página, inicializar el badge del carrito
document.addEventListener('DOMContentLoaded', function () {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarBadge(carritoGuardado);
});

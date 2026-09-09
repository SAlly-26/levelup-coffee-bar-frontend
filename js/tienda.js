const productos = [
    {
        id: 1,
        nombre: 'Catan (Juego Base)',
        categoria: 'Estrategia',
        precio: 39990,
        imagen: 'img/catan.png',
        descripcion: 'El clásico juego de mesa de comercio y construcción. Construye carreteras, pueblos y ciudades mientras negocias con otros jugadores para obtener recursos.',
    },
    {
        id: 2,
        nombre: 'Booster Pack Pokemon TCG',
        categoria: 'TCG',
        precio: 4990,
        imagen: 'img/cartaspokemon.png',
        descripcion: 'Un paquete de refuerzo del juego de cartas coleccionables Pokémon. Contiene cartas aleatorias que pueden incluir Pokémon, entrenadores y energías.',
    },
    {
        id: 3,
        nombre: 'Set de Dados D&D "Nebulosa"',
        categoria: 'Rol',
        precio: 12990,
        imagen: 'img/dados.png',
        descripcion: 'Un conjunto de dados poliédricos para juegos de rol, con un diseño de nebulosa en colores vibrantes. Incluye dados de 4, 6, 8, 10, 12 y 20 caras.',
    },
    {
        id: 4,
        nombre: 'Exploding Kittens',
        categoria: 'Cartas',
        precio: 19990,
        imagen: 'img/kittens.png',
        descripcion: 'Un juego de cartas donde los gatos explotan. Los jugadores deben evitar los gatos explosivos mientras intentan sobrevivir.',
    }
];

function mostrarProductos() {
    const contenedor = document.getElementById('contenedor-productos');

    contenedor.innerHTML = productos.map(producto => `
        <div class="col-sm-6 col-lg-3">
            <div class="card-producto">

                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>

                <div class="producto-body">
                    <span class="badge-categoria cat-${producto.categoria.toLowerCase()}">
                        ${producto.categoria}
                    </span>
                    <p class="producto-nombre">${producto.nombre}</p>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <p class="producto-precio">$${producto.precio.toLocaleString('es-CL')}</p>

                    <div class="d-flex align-items-center gap-2 mt-2">
                        <div class="control-cantidad">
                            <button class="btn-cantidad" onclick="cambiarCantidad(${producto.id}, -1)">−</button>
                            <span class="numero-cantidad" id="cantidad-${producto.id}">1</span>
                            <button class="btn-cantidad" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                        </div>
                        <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                            Añadir al carrito
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `).join('');
}

function cambiarCantidad(id, cambio) {
    const span = document.getElementById(`cantidad-${id}`);
    let cantidad = parseInt(span.textContent);

    cantidad += cambio;

    if (cantidad < 1) cantidad = 1;

    span.textContent = cantidad;
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).textContent);
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const yaExiste = carrito.find(item => item.id === id);

    if (yaExiste) {
        yaExiste.cantidad += cantidad;
    } else {
        carrito.push({
            id:        producto.id,
            nombre:    producto.nombre,
            categoria: producto.categoria,
            precio:    producto.precio,
            imagen:    producto.imagen,
            cantidad:  cantidad
        });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarBadge(carrito);
    alert(`Se han añadido ${cantidad} unidad(es) de "${producto.nombre}" al carrito.`);
}

function actualizarBadge(carrito) {
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = totalItems;
}

document.addEventListener('DOMContentLoaded', function () {
    mostrarProductos();
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarBadge(carritoGuardado);
});

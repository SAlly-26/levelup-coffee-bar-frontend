let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function actualizarCarrito() {
    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = totalItems;
    }
}

function actualizarTotales() {
    const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    document.getElementById('subtotal').textContent = '$' + total.toLocaleString('es-CL');
    document.getElementById('total').textContent    = '$' + total.toLocaleString('es-CL');
}

function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

function mostrarCarrito() {
    const lista        = document.getElementById('lista-carrito');
    const vistaCarrito = document.getElementById('vista-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');

    if (carrito.length === 0) {
        vistaCarrito.classList.add('d-none');
        carritoVacio.classList.remove('d-none');
        actualizarCarrito();
        return;
    }

    vistaCarrito.classList.remove('d-none');
    carritoVacio.classList.add('d-none');

    lista.innerHTML = carrito.map(item => `
        <div class="card-item">
            <img src="${item.imagen}" alt="${item.nombre}"
                 style="width:75px; height:75px; object-fit:cover; border-radius:8px; flex-shrink:0;">
            <div class="item-info">
                <p class="item-nombre">${item.nombre}</p>
                <p class="item-categoria">${item.categoria}</p>
                <p class="item-precio-unit">$${item.precio.toLocaleString('es-CL')} c/u</p>
            </div>
            <div class="item-derecha">
                <span class="item-subtotal">$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                <small style="color:#888">Cantidad: ${item.cantidad}</small>
                <button class="btn-eliminar" onclick="eliminarProducto(${item.id})">
                    Eliminar 🗑️
                </button>
            </div>
        </div>
    `).join('');

    actualizarTotales();
    actualizarCarrito();
}

function finalizarCompra() {
    if (carrito.length === 0) return;
    alert('¡Compra realizada con éxito! Gracias por tu pedido 🎉');
    vaciarCarrito();
}

document.addEventListener('DOMContentLoaded', function () {
    mostrarCarrito();
});

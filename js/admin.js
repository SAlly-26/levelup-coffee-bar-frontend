// ================================================
// BLOQUE 1 — Mostrar el panel seleccionado
// ================================================
function mostrarPanel(nombre, boton) {

    // Ocultamos todos los paneles
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    // Quitamos el "active" de todos los botones
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostramos el panel pedido
    document.getElementById('panel-' + nombre).classList.add('active');

    // Marcamos el botón activo (solo si viene de un click)
    if (boton) boton.classList.add('active');
}

// ================================================
// BLOQUE 2 — Cargar inventario desde localStorage
// ================================================
function cargarInventario() {
    const catalogo   = JSON.parse(localStorage.getItem('catalogo')) || [];
    const contenedor = document.getElementById('admin-lista-productos');

    if (catalogo.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12">
                <p style="color:#888">No hay productos en el catálogo aún.</p>
            </div>`;
        return;
    }

    contenedor.innerHTML = catalogo.map(producto => `
        <div class="col-sm-6 col-lg-3">
            <div class="content-card">
                <p style="font-size:2rem; margin-bottom:0.5rem">🎲</p>
                <p class="fw-bold mb-1">${producto.nombre}</p>
                <p style="font-size:0.8rem; color:#888">
                    ${producto.categoria} — Stock: ${producto.stock}<br>
                    <span style="color:#00E5FF; font-weight:800">
                        $${Number(producto.precio).toLocaleString('es-CL')}
                    </span>
                </p>
            </div>
        </div>
    `).join('');
}

// ================================================
// BLOQUE 3 — Validar y agregar producto
// ================================================
function agregarProducto() {

    const nombre      = document.getElementById('admin-nombre').value.trim();
    const categoria   = document.getElementById('admin-categoria').value;
    const precioVal   = document.getElementById('admin-precio').value;
    const stockVal    = document.getElementById('admin-stock').value;
    const imagen      = document.getElementById('admin-imagen').value.trim();
    const descripcion = document.getElementById('admin-descripcion').value.trim();

    let valido = true;

    if (nombre === '') {
        mostrarError('err-nombre', 'admin-nombre', 'El nombre es obligatorio.');
        valido = false;
    } else {
        limpiarError('err-nombre', 'admin-nombre');
    }

    if (categoria === '') {
        mostrarError('err-categoria', 'admin-categoria', 'Selecciona una categoría.');
        valido = false;
    } else {
        limpiarError('err-categoria', 'admin-categoria');
    }

    if (precioVal === '' || isNaN(precioVal) || Number(precioVal) <= 0) {
        mostrarError('err-precio', 'admin-precio', 'El precio debe ser un número mayor a 0.');
        valido = false;
    } else {
        limpiarError('err-precio', 'admin-precio');
    }

    if (stockVal === '' || isNaN(stockVal) || !Number.isInteger(Number(stockVal)) || Number(stockVal) < 0) {
        mostrarError('err-stock', 'admin-stock', 'El stock debe ser un número entero (sin decimales).');
        valido = false;
    } else {
        limpiarError('err-stock', 'admin-stock');
    }

    if (descripcion === '') {
        mostrarError('err-descripcion', 'admin-descripcion', 'La descripción es obligatoria.');
        valido = false;
    } else {
        limpiarError('err-descripcion', 'admin-descripcion');
    }

    if (!valido) return;

    const nuevoProducto = {
        id:          Date.now(),
        nombre:      nombre,
        categoria:   categoria,
        precio:      Number(precioVal),
        stock:       Number(stockVal),
        imagen:      imagen || 'img/default.png',
        descripcion: descripcion
    };

    const catalogo = JSON.parse(localStorage.getItem('catalogo')) || [];
    catalogo.push(nuevoProducto);
    localStorage.setItem('catalogo', JSON.stringify(catalogo));

    alert(`✅ "${nombre}" agregado al catálogo con éxito.`);
    limpiarFormulario();

    // Volvemos al inventario y marcamos su botón
    const btnInventario = document.querySelector('.admin-nav-btn');
    mostrarPanel('inventario', btnInventario);
    cargarInventario();
}

// ================================================
// BLOQUE 4 — Funciones auxiliares
// ================================================
function mostrarError(idError, idInput, mensaje) {
    document.getElementById(idError).textContent = mensaje;
    document.getElementById(idInput).classList.add('invalido');
}

function limpiarError(idError, idInput) {
    document.getElementById(idError).textContent = '';
    document.getElementById(idInput).classList.remove('invalido');
}

function limpiarFormulario() {
    document.getElementById('admin-nombre').value      = '';
    document.getElementById('admin-categoria').value   = '';
    document.getElementById('admin-precio').value      = '';
    document.getElementById('admin-stock').value       = '';
    document.getElementById('admin-imagen').value      = '';
    document.getElementById('admin-descripcion').value = '';
}

// ================================================
// BLOQUE 5 — Tabla de usuarios y arranque
// ================================================
const usuariosMock = [
    { nombre: 'Administrador', correo: 'admin@levelup.cl', run: '12.345.678-9', rol: 'admin' },
    { nombre: 'Ana García',    correo: 'ana@gmail.com',    run: '9.876.543-2',  rol: 'user'  },
    { nombre: 'Carlos López',  correo: 'carlos@gmail.com', run: '11.223.344-5', rol: 'user'  },
];

function cargarUsuarios() {
    const tbody = document.getElementById('admin-lista-usuarios');

    tbody.innerHTML = usuariosMock.map((usuario, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.run}</td>
            <td>
                <span class="badge-${usuario.rol}">
                    ${usuario.rol === 'admin' ? 'Admin' : 'Usuario'}
                </span>
            </td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function () {
    cargarInventario();
    cargarUsuarios();
});

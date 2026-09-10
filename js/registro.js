function validarRUN(run) {

    run = run.replace(/\./g, '').replace(/-/g, '').toUpperCase();

    if (run.length < 8 || run.length > 9) return false;

    const cuerpo = run.slice(0, -1);
    const dvIngresado = run.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;

    let suma   = 0;
    let factor = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma   += parseInt(cuerpo[i]) * factor;
        factor  = factor === 7 ? 2 : factor + 1;
    }

    const resto = suma % 11;
    let dvCalculado;

    if      (resto === 0)  dvCalculado = '0';
    else if (resto === 1)  dvCalculado = 'K';
    else                   dvCalculado = String(11 - resto);

    return dvIngresado === dvCalculado;
}

function validarPassword(pass) {

    // Mínimo 8 caracteres
    if (pass.length < 8) {
        return 'Debe tener al menos 8 caracteres.';
    }

    if (!/[A-Z]/.test(pass)) {
        return 'Debe incluir al menos una letra mayúscula.';
    }

    if (!/[0-9]/.test(pass)) {
        return 'Debe incluir al menos un número.';
    }

    return ''; 
}

function registrarUsuario() {

    const nombre    = document.getElementById('reg-nombre').value.trim();
    const correo    = document.getElementById('reg-correo').value.trim();
    const run       = document.getElementById('reg-run').value.trim();
    const password  = document.getElementById('reg-password').value;
    const confirmar = document.getElementById('reg-confirmar').value;
    const terminos  = document.getElementById('reg-terminos').checked;

    let valido = true;

    if (nombre.length < 3) {
        setError('err-reg-nombre', 'reg-nombre', 'Ingresa tu nombre completo.');
        valido = false;
    } else {
        setOk('err-reg-nombre', 'reg-nombre');
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        setError('err-reg-correo', 'reg-correo', 'Ingresa un correo válido.');
        valido = false;
    } else {
        setOk('err-reg-correo', 'reg-correo');
    }

    if (!validarRUN(run)) {
        setError('err-reg-run', 'reg-run', 'El RUN ingresado no es válido.');
        valido = false;
    } else {
        setOk('err-reg-run', 'reg-run');
    }

    const errorPass = validarPassword(password);
    if (errorPass !== '') {
        setError('err-reg-password', 'reg-password', errorPass);
        valido = false;
    } else {
        setOk('err-reg-password', 'reg-password');
    }

    if (password !== confirmar) {
        setError('err-reg-confirmar', 'reg-confirmar', 'Las contraseñas no coinciden.');
        valido = false;
    } else if (confirmar !== '') {
        setOk('err-reg-confirmar', 'reg-confirmar');
    }

    if (!terminos) {
        document.getElementById('err-reg-terminos').textContent = 'Debes aceptar los términos.';
        valido = false;
    } else {
        document.getElementById('err-reg-terminos').textContent = '';
    }

    if (!valido) return;

    document.querySelector('.registro-seccion').classList.add('d-none');
    document.getElementById('registro-exitoso').classList.remove('d-none');
}

function setError(idError, idInput, mensaje) {
    document.getElementById(idError).textContent = mensaje;
    document.getElementById(idInput).classList.add('invalido');
    document.getElementById(idInput).classList.remove('valido');
}

function setOk(idError, idInput) {
    document.getElementById(idError).textContent = '';
    document.getElementById(idInput).classList.remove('invalido');
    document.getElementById(idInput).classList.add('valido');
}

document.addEventListener('DOMContentLoaded', function () {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total   = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const badge   = document.getElementById('cart-badge');
    if (badge) badge.textContent = total;
});
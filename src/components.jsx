import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Coffee,
  ShoppingBag,
  ArrowUpRight,
  Menu,
  X,
  Gamepad2,
  Minus,
  Plus,
} from "lucide-react";
import { db, money, price } from "./database";
import { useShop } from "./store";
export function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useShop();
  const location = useLocation();
  React.useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const count = db.list("cart").reduce((s, p) => s + p.quantity, 0);
  return (
    <>
      <div className="topline">
        BUEN CAFÉ. BUENAS PARTIDAS. <span>Envío gratis desde $50.000</span>
      </div>
      <header>
        <div className="container nav-shell">
          <Link to="/" className="brand">
            <Coffee size={29} />
            <span>
              LEVEL UP<small>COFFEE & PLAY</small>
            </span>
          </Link>
          <button
            className="icon-button mobile-toggle"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            className={open ? "navigation open" : "navigation"}
            aria-label="Navegación principal"
          >
            {[
              ["/tienda", "Tienda"],
              ["/menu", "Café & snacks"],
              ["/categorias", "Categorías"],
              ["/ofertas", "Ofertas"],
              ["/eventos", "Comunidad"],
            ].map(([to, text]) => (
              <NavLink key={to} to={to}>
                {text}
              </NavLink>
            ))}
            {user ? (
              <>
                <NavLink to="/perfil">{user.nombre.split(" ")[0]}</NavLink>
                {user.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
                <button className="text-button" onClick={logout}>
                  Salir
                </button>
              </>
            ) : (
              <NavLink to="/login">Ingresar</NavLink>
            )}
          </nav>
          <Link
            to="/carrito"
            className="cart-link"
            aria-label={`Carrito, ${count} productos`}
          >
            <ShoppingBag size={20} />
            <span>{count}</span>
          </Link>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/">
              <Coffee />
              <span>
                LEVEL UP<small>COFFEE & PLAY</small>
              </span>
            </Link>
            <p>
              Tu próxima partida empieza aquí.
              <br />
              Café, juegos y una buena compañía.
            </p>
          </div>
          <div>
            <b>Explora</b>
            <Link to="/tienda">Tienda de juegos</Link>
            <Link to="/menu">Nuestra cafetería</Link>
            <Link to="/eventos">Comunidad & eventos</Link>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/blog">Blog</Link>
          </div>
          <div>
            <b>Estamos para ayudarte</b>
            <Link to="/contacto">Contáctanos</Link>
            <Link to="/perfil">Mis compras</Link>
            <Link to="/terminos">Términos y privacidad</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Level Up Coffee Bar</span>
          <span>Proyecto académico · Compras simuladas</span>
        </div>
      </div>
    </footer>
  );
}
export function PageTitle({ eyebrow, title, children }) {
  return (
    <div className="page-title">
      <div className="eyebrow">{eyebrow || "LEVEL UP / EXPLORA"}</div>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
export function Empty({
  title = "Todavía no hay nada por aquí",
  text = "Explora y encuentra tu próximo favorito.",
  to = "/tienda",
  action = "Explorar tienda",
}) {
  return (
    <div className="empty">
      <Gamepad2 size={44} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="btn btn-lime" to={to}>
        {action} <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
export function Quantity({ value, onChange, max = 99 }) {
  return (
    <div className="quantity">
      <button
        aria-label="Disminuir cantidad"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label="Aumentar cantidad"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function ProductCard({ product: p }) {
  const { add } = useShop();
  return (
    <article className="product-card">
      <Link to={"/producto/" + p.id} className="product-image">
        <img src={p.imagen} alt={p.nombre} loading="lazy" />
        {p.descuento > 0 && <span className="discount">−{p.descuento}%</span>}
        <span className="image-arrow">
          <ArrowUpRight size={22} />
        </span>
      </Link>
      <div className="product-info">
        <span className="eyebrow">{p.categoria}</span>
        <Link className="product-name" to={"/producto/" + p.id}>
          {p.nombre}
        </Link>
        <div className="product-bottom">
          <div>
            <strong>{money(price(p))}</strong>
            {p.descuento > 0 && <del>{money(p.precio)}</del>}
          </div>
          <button
            className="add-button"
            aria-label={"Añadir " + p.nombre}
            onClick={() => add(p)}
            disabled={!p.stock}
          >
            {p.stock ? <Plus size={20} /> : "Agotado"}
          </button>
        </div>
      </div>
    </article>
  );
}
export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = true,
  minLength,
  maxLength,
  ...props
}) {
  return (
    <label className="field">
      {label}
      <input
        className="form-control"
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        {...props}
      />
    </label>
  );
}
export function ErrorMessage({ message }) {
  return message ? (
    <div className="alert alert-danger" role="alert">
      {message}
    </div>
  ) : null;
}
export class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    return this.state.error ? (
      <main className="container section">
        <h1>No pudimos cargar la página</h1>
        <p role="alert">{this.state.error.message}</p>
        <button className="btn btn-lime" onClick={() => location.reload()}>
          Volver a intentar
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}

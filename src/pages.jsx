import React, { useState } from "react";
import { Locations } from "./ubicaciones";
import { branches, openingHours } from "./locations";
import { imageUrl } from "./imageUrl";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Truck,
  Coffee,
  Gamepad2,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { db, money, price, passwordHash, validRun } from "./database";
import { useShop } from "./store";
import {
  PageTitle,
  ProductCard,
  Empty,
  Quantity,
  Field,
  ErrorMessage,
} from "./components";

export function Home() {
  const products = db.list("products");
  return (
    <>
      <section className="hero">
        <div
          className="hero-photo"
          style={{
            "--hero-image": `url("${imageUrl("/img/nosotros1.png")}")`,
          }}
        />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="live-dot" /> TU PUNTO DE ENCUENTRO
          </div>
          <h1>
            Buen café.
            <br />
            Grandes partidas.
            <br />
            <em>Tu siguiente nivel.</em>
          </h1>
          <p>
            Desconéctate del mundo. Conéctate con tu equipo.
            <br />
            Café de especialidad y juegos que reúnen.
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/tienda" className="btn btn-lime">
              Encuentra tu próximo juego <ArrowUpRight size={19} />
            </Link>
            <Link to="/menu" className="btn btn-glass">
              Ver la carta <Coffee size={18} />
            </Link>
          </div>
          <div className="hero-foot">
            <span>01 / COFFEE & PLAY</span>
            <span>Una mesa. Mil historias.</span>
          </div>
        </div>
        <div className="hero-sticker">
          <Gamepad2 size={32} />
          <span>
            LA VIDA ES MEJOR
            <br />
            <b>EN COOPERATIVO.</b>
          </span>
        </div>
      </section>
      <div className="benefit-bar">
        <div className="container">
          <span>
            <Coffee /> Café con personalidad
          </span>
          <span>
            <Gamepad2 /> Juegos para cada equipo
          </span>
          <span>
            <Truck /> Envío gratis desde $50.000
          </span>
          <span>
            <ShieldCheck /> Retiro en cafetería
          </span>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ELIGE TU AVENTURA</div>
            <h2>¿Qué jugamos hoy?</h2>
          </div>
          <Link to="/categorias">
            Todas las categorías <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="category-tiles">
          {[
            [
              "Juegos de mesa",
              "Estrategia, risas y una revancha.",
              "catan.png",
              "/tienda",
            ],
            [
              "Café & pociones",
              "Recarga tu energía, a tu manera.",
              "latte.png",
              "/menu",
            ],
            [
              "Algo para compartir",
              "El mejor power-up de la mesa.",
              "sandwich.png",
              "/menu?categoria=Snacks",
            ],
          ].map(([title, text, img, to], i) => (
            <Link to={to} className={"category-tile tile-" + i} key={title}>
              <div>
                <small>0{i + 1} / EXPLORA</small>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="circle-arrow">
                  <ArrowUpRight />
                </span>
              </div>
              <img src={imageUrl("/img/" + img)} alt="" />
            </Link>
          ))}
        </div>
      </section>
      <section className="container section pt-0">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EL LOOT MÁS BUSCADO</div>
            <h2>Favoritos de la comunidad</h2>
          </div>
          <Link to="/tienda">
            Ver todos <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.tipo === "juego")
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="community-banner container">
        <img src={imageUrl("/img/nosotros2.png")} alt="Un espacio para reunirse y jugar" />
        <div>
          <div className="eyebrow">AQUÍ TODOS TIENEN UN LUGAR</div>
          <h2>
            Las mejores conexiones
            <br />
            se hacen en una mesa.
          </h2>
          <p>
            Ven por un café. Quédate por otra partida.
            <br />
            Descubre encuentros para compartir lo que te gusta.
          </p>
          <Link className="btn btn-lime" to="/eventos">
            Conoce la comunidad <ArrowUpRight size={18} />
          </Link>
          <Link className="d-block mt-3" to="/contacto">
            Visita nuestras sucursales ↗
          </Link>
        </div>
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">UN EXTRA PARA TU PARTIDA</div>
            <h2>Ofertas que suben de nivel</h2>
          </div>
          <Link to="/ofertas">
            Ver ofertas <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.descuento > 0)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </>
  );
}

export function Catalog({ mode = "tienda" }) {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("nombre");
  const query = params.get("q") || "",
    category = params.get("categoria") || "";
  let products = db
    .list("products")
    .filter((p) =>
      mode === "ofertas"
        ? p.descuento > 0
        : mode === "menu"
          ? p.tipo === "cafe"
          : p.tipo === "juego",
    );
  const categories = [...new Set(products.map((p) => p.categoria))];
  products = products.filter(
    (p) =>
      (!category || p.categoria === category) &&
      `${p.nombre} ${p.descripcion}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  products.sort((a, b) =>
    sort === "menor"
      ? price(a) - price(b)
      : sort === "mayor"
        ? price(b) - price(a)
        : a.nombre.localeCompare(b.nombre),
  );
  function filter(k, v) {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    setParams(next, { replace: true });
  }
  return (
    <main className="container section">
      <PageTitle
        title={
          mode === "menu"
            ? "Recarga tu energía."
            : mode === "ofertas"
              ? "Más juego. Menos precio."
              : "Tu próxima gran partida."
        }
      >
        {mode === "menu"
          ? "Café de especialidad, pociones y algo rico para compartir."
          : "Encuentra algo nuevo para llevar a tu mesa."}
      </PageTitle>
      <div className="catalog-toolbar">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Buscar productos"
            placeholder="Busca tu próximo favorito…"
            value={query}
            onChange={(e) => filter("q", e.target.value)}
          />
        </label>
        <label>
          Ordenar{" "}
          <select
            className="form-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="nombre">Nombre A–Z</option>
            <option value="menor">Menor precio</option>
            <option value="mayor">Mayor precio</option>
          </select>
        </label>
      </div>
      <div className="filter-chips">
        <button
          className={!category ? "selected" : ""}
          onClick={() => filter("categoria", "")}
        >
          Todos
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => filter("categoria", c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="muted">{products.length} productos encontrados</p>
      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <Empty
          title="No encontramos coincidencias"
          text="Intenta con otro nombre o categoría."
          to={"/" + mode}
          action="Limpiar búsqueda"
        />
      )}
    </main>
  );
}
export function Categories() {
  const products = db.list("products");
  return (
    <main className="container section">
      <PageTitle title="Un universo por descubrir.">
        Encuentra tu estilo de juego o tu próxima pausa favorita.
      </PageTitle>
      <div className="category-grid">
        {db.list("categories").map((c) => {
          const items = products.filter((p) => p.categoria === c.nombre);
          return (
            <Link
              className="category-box"
              to={`/${items[0]?.tipo === "cafe" ? "menu" : "tienda"}?categoria=${encodeURIComponent(c.nombre)}`}
              key={c.id}
            >
              {items[0] && (
                <img src={imageUrl(items[0].imagen)} alt="" />
              )}
              <div>
                <h2>{c.nombre}</h2>
                <span>
                  {items.length} productos <ArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
export function Detail() {
  const { id } = useParams(),
    p = db.get("products", id);
  const [quantity, setQuantity] = useState(1);
  const { add } = useShop();
  if (!p)
    return (
      <main className="container section">
        <Empty title="Producto no encontrado" />
      </main>
    );
  return (
    <main className="container section">
      <Link to={p.tipo === "cafe" ? "/menu" : "/tienda"} className="muted">
        ← Volver al catálogo
      </Link>
      <div className="detail-grid">
        <div className="detail-image">
          <img src={imageUrl(p.imagen)} alt={p.nombre} />
        </div>
        <div>
          <div className="eyebrow">{p.categoria} / LEVEL UP</div>
          <h1>{p.nombre}</h1>
          <p className="detail-price">
            {money(price(p))} {p.descuento > 0 && <del>{money(p.precio)}</del>}
          </p>
          <p>{p.descripcion}</p>
          <p className={p.stock ? "stock" : "text-danger"}>
            {p.stock
              ? `${p.stock} disponibles · Listos para tu próxima partida`
              : "Agotado por ahora"}
          </p>
          <div className="d-flex gap-3 flex-wrap">
            <Quantity value={quantity} onChange={setQuantity} max={p.stock} />
            <button
              className="btn btn-lime"
              disabled={!p.stock}
              onClick={() => add(p, quantity)}
            >
              Añadir al carrito <ArrowRight size={18} />
            </button>
          </div>
          <div className="detail-notes">
            <p>
              <Truck size={18} /> Envío $3.990 · Gratis desde $50.000
            </p>
            <p>
              <Coffee size={18} /> Retiro gratis en cafetería
            </p>
            <small>
              Imágenes referenciales.
            </small>
          </div>
        </div>
      </div>
      <h2>También te puede gustar</h2>
      <div className="product-grid mt-4">
        {db
          .list("products")
          .filter((x) => x.tipo === p.tipo && x.id !== p.id)
          .slice(0, 4)
          .map((x) => (
            <ProductCard key={x.id} product={x} />
          ))}
      </div>
    </main>
  );
}

export function Cart() {
  const { setNotice } = useShop();
  const lines = db.list("cart"),
    products = db.list("products");
  const items = lines.map((l) => ({
    ...l,
    product: products.find((p) => p.id === l.id),
  }));
  const total = items.reduce(
    (s, l) => s + (l.product ? price(l.product) * l.quantity : 0),
    0,
  );
  function change(id, quantity) {
    try {
      db.setCart(lines.map((l) => (l.id === id ? { ...l, quantity } : l)));
    } catch (e) {
      setNotice(e.message);
    }
  }
  return (
    <main className="container section">
      <PageTitle title="Tu próximo buen momento.">
        Revisa tu selección antes de continuar.
      </PageTitle>
      {!lines.length ? (
        <Empty title="Tu carrito está esperando una aventura" />
      ) : (
        <div className="checkout-grid">
          <div>
            {items.map((l) => (
              <article className="cart-row" key={l.id}>
                {l.product ? (
                  <>
                    <Link to={"/producto/" + l.id}>
                      <img
                        src={imageUrl(l.product.imagen)}
                        alt={l.product.nombre}
                      />
                    </Link>
                    <div className="flex-grow-1">
                      <small className="eyebrow">{l.product.categoria}</small>
                      <h3>
                        <Link to={"/producto/" + l.id}>{l.product.nombre}</Link>
                      </h3>
                      <p>{money(price(l.product))}</p>
                      {l.quantity > l.product.stock && (
                        <p className="text-danger">
                          Stock actual: {l.product.stock}. Ajusta la cantidad.
                        </p>
                      )}
                      <Quantity
                        value={l.quantity}
                        onChange={(q) => change(l.id, q)}
                        max={l.product.stock}
                      />
                    </div>
                    <strong>{money(price(l.product) * l.quantity)}</strong>
                  </>
                ) : (
                  <p>Este producto ya no está disponible.</p>
                )}
                <button
                  className="icon-button"
                  aria-label="Eliminar del carrito"
                  onClick={() => {
                    try {
                      db.setCart(lines.filter((x) => x.id !== l.id));
                    } catch (e) {
                      setNotice(e.message);
                    }
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
            <Link to="/tienda" className="d-inline-block mt-4">
              ← Seguir explorando
            </Link>
          </div>
          <aside className="summary">
            <h2>Resumen de tu pedido</h2>
            <p>
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </p>
            <p>
              <span>Entrega</span>
              <span>En el siguiente paso</span>
            </p>
            <hr />
            <p>
              <b>Total de productos</b>
              <strong>{money(total)}</strong>
            </p>
            <Link className="btn btn-lime w-100" to="/checkout">
              Continuar al checkout <ArrowRight size={18} />
            </Link>
            <small>
              Retiro gratis o despacho por $3.990.
              <br />
              Envío gratis desde $50.000.
            </small>
          </aside>
        </div>
      )}
    </main>
  );
}

export function Checkout() {
  const { user } = useShop(),
    navigate = useNavigate();
  const [delivery, setDelivery] = useState("retiro"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const lines = db.list("cart"),
    products = db.list("products");
  const subtotal = lines.reduce(
      (s, l) =>
        s +
        (products.find((p) => p.id === l.id)
          ? price(products.find((p) => p.id === l.id)) * l.quantity
          : 0),
      0,
    ),
    shipping = delivery === "retiro" || subtotal >= 50000 ? 0 : 3990;
  function submit(e) {
    e.preventDefault();
    setError("");
    const form = Object.fromEntries(new FormData(e.currentTarget));
    if (
      !form.nombre.trim() ||
      !form.telefono.trim() ||
      (delivery === "envio" && (!form.direccion.trim() || !form.comuna.trim()))
    ) {
      setError("Completa los datos sin dejar campos en blanco.");
      return;
    }
    setBusy(true);
    try {
      if (form.payment === "rechazo") {
        navigate("/pago-error");
        return;
      }
      const order = db.checkout(form, delivery, user?.id || null);
      navigate("/compra-exitosa/" + order.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }
  if (!lines.length)
    return (
      <main className="container section">
        <Empty title="Agrega productos antes de continuar" />
      </main>
    );
  return (
    <main className="container section">
      <PageTitle
        eyebrow="CARRITO / ENTREGA / CONFIRMACIÓN"
        title="Ya casi es tuyo."
      >
        Completa los datos de entrega. Este pago es una simulación.
      </PageTitle>
      <form onSubmit={submit} className="checkout-grid">
        <div className="panel">
          <h2>01. Tus datos</h2>
          {!user && (
            <p>
              ¿Ya tienes cuenta?{" "}
              <Link to="/login?next=/checkout">Ingresa para autocompletar</Link>
            </p>
          )}
          <div className="form-grid">
            <Field
              label="Nombre completo"
              name="nombre"
              defaultValue={user?.nombre}
              minLength={3}
              autoComplete="name"
            />
            <Field
              label="Correo electrónico"
              name="correo"
              type="email"
              defaultValue={user?.correo}
              autoComplete="email"
            />
            <Field
              label="Teléfono"
              name="telefono"
              type="tel"
              pattern="[+0-9 ()-]{8,18}"
              defaultValue={user?.telefono}
              autoComplete="tel"
            />
          </div>
          <h2 className="mt-4">02. ¿Cómo lo recibes?</h2>
          <label className="choice">
            <input
              type="radio"
              checked={delivery === "retiro"}
              onChange={() => setDelivery("retiro")}
            />{" "}
            Retiro en cafetería · Gratis
          </label>
          <label className="choice">
            <input
              type="radio"
              checked={delivery === "envio"}
              onChange={() => setDelivery("envio")}
            />{" "}
            Envío a domicilio · {money(subtotal >= 50000 ? 0 : 3990)}
          </label>
          {delivery === "envio" ? (
            <div className="form-grid">
              <Field
                label="Dirección y número"
                name="direccion"
                defaultValue={user?.direccion}
                autoComplete="street-address"
              />
              <Field label="Comuna" name="comuna" defaultValue={user?.comuna} />
              <Field
                label="Región"
                name="region"
                defaultValue="Metropolitana"
              />
            </div>
          ) : (
            <>
              <label className="field">
                Sucursal de retiro
                <select className="form-select" name="sucursal" required>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.address}
                    </option>
                  ))}
                </select>
              </label>
              <p className="muted">
                Retiro sin costo. Horario de atención: {openingHours}. Te
                avisaremos cuando el pedido esté listo.
              </p>
            </>
          )}
          <h2 className="mt-4">03. Elegir simulacion</h2>
          <label className="field">
            Resultado de la simulación
            <select className="form-select" name="payment">
              <option value="exito">Simular pago aprobado</option>
              <option value="rechazo">Simular pago rechazado</option>
            </select>
          </label>
          <label className="choice">
            <input type="checkbox" required /> Acepto los{" "}
            <Link to="/terminos">términos</Link> y entiendo que es una compra
            simulada, por lo tanto no se solicitarán tarjetas ni se realizarán cobros reales.
          </label>
          <ErrorMessage message={error} />
        </div>
        <aside className="summary">
          <h2>Tu selección</h2>
          {lines.map((l) => (
            <p key={l.id}>
              <span>
                {products.find((p) => p.id === l.id)?.nombre || "No disponible"}{" "}
                ×{l.quantity}
              </span>
            </p>
          ))}
          <hr />
          <p>
            <span>Productos</span>
            <b>{money(subtotal)}</b>
          </p>
          <p>
            <span>Entrega</span>
            <b>{money(shipping)}</b>
          </p>
          <p className="total">
            <span>Total</span>
            <b>{money(subtotal + shipping)}</b>
          </p>
          <button className="btn btn-lime w-100" disabled={busy}>
            {busy ? "Procesando…" : "Confirmar compra simulada"}{" "}
            <ArrowRight size={18} />
          </button>
          <small>No se solicitarán tarjetas ni se realizarán cobros.</small>
        </aside>
      </form>
    </main>
  );
}
export function Receipt({ order }) {
  return (
    <div className="panel receipt">
      <div className="d-flex justify-content-between flex-wrap">
        <div>
          <div className="eyebrow">COMPROBANTE DEMOSTRATIVO</div>
          <h2>{order.number}</h2>
        </div>
        <p>{new Date(order.date).toLocaleString("es-CL")}</p>
      </div>
      <p>
        {order.customer.nombre} · {order.customer.correo}
      </p>
      <p>
        {order.delivery === "retiro"
          ? order.pickupBranch
            ? `Retiro en ${order.pickupBranch.name} · ${order.pickupBranch.address}`
            : "Retiro en cafetería"
          : `${order.customer.direccion}, ${order.customer.comuna}, ${order.customer.region}`}
      </p>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.quantity}</td>
                <td>{money(p.unitPrice * p.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>Entrega: {money(order.shipping)}</p>
      <h3>Total: {money(order.total)}</h3>
      <p>Estado: {order.status} · Sin validez tributaria</p>
      <button
        className="btn btn-outline-light no-print"
        onClick={() => window.print()}
      >
        Imprimir comprobante
      </button>
    </div>
  );
}
export function PaymentResult({ failed = false }) {
  const { id } = useParams(),
    order = db.get("orders", id);
  if (!failed && !order)
    return (
      <main className="container section">
        <Empty title="Comprobante no encontrado" />
      </main>
    );
  return (
    <main className="container section">
      <div className="result-heading">
        {failed ? (
          <XCircle size={56} color="#ff9e91" />
        ) : (
          <CheckCircle2 size={56} color="#c6f56e" />
        )}
        <PageTitle
          title={
            failed
              ? "El pago no se completó."
              : "¡Una nueva aventura confirmada!"
          }
        >
          {failed
            ? "Tu carrito sigue guardado. Puedes volver a intentarlo sin perder tu selección."
            : "Guardamos tu pedido y actualizamos el stock. Gracias por jugar con nosotros."}
        </PageTitle>
        <Link className="btn btn-lime" to={failed ? "/checkout" : "/tienda"}>
          {failed ? "Volver a intentar" : "Seguir explorando"}{" "}
          <ArrowUpRight size={18} />
        </Link>
      </div>
      {order && !failed && <Receipt order={order} />}
    </main>
  );
}

export function Auth({ register = false }) {
  const { login } = useShop(),
    navigate = useNavigate(),
    [params] = useSearchParams();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget));
    f.correo = f.correo.trim().toLowerCase();
    try {
      const users = db.list("users");
      let user = users.find((u) => u.correo === f.correo);
      if (register) {
        if (!f.nombre.trim() || f.nombre.trim().length < 3)
          throw Error("Ingresa tu nombre completo.");
        if (!validRun(f.run)) throw Error("El RUN no es válido.");
        if (!/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(f.password))
          throw Error("Usa al menos 8 caracteres, una mayúscula y un número.");
        if (f.password !== f.confirm)
          throw Error("Las contraseñas no coinciden.");
        if (user) throw Error("Ese correo ya está registrado.");
        const salt = crypto.randomUUID();
        user = db.create("users", {
          nombre: f.nombre.trim(),
          correo: f.correo,
          run: f.run,
          role: "cliente",
          salt,
          password: await passwordHash(f.password, salt),
          direccion: f.direccion.trim(),
          comuna: f.comuna.trim(),
          telefono: f.telefono.trim(),
        });
      } else if (
        !user ||
        user.password !== (await passwordHash(f.password, user.salt))
      )
        throw Error("Correo o contraseña incorrectos.");
      login(user.id);
      const next = params.get("next");
      navigate(
        next?.startsWith("/") && !next.startsWith("//") ? next : "/perfil",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="container section auth-layout">
      <div>
        <div className="eyebrow">TU EQUIPO TE ESPERA</div>
        <h1>
          {register
            ? "Cada gran partida empieza contigo."
            : "Qué bueno verte de vuelta."}
        </h1>
        <p>
          Guarda tus datos, revisa tus pedidos y prepárate para el siguiente
          nivel.
        </p>
        <img
          src={imageUrl("/img/cafegamer.png")}
          alt="Café con espíritu gamer"
        />
      </div>
      <form className="panel" onSubmit={submit}>
        <h2>{register ? "Crea tu cuenta" : "Ingresa a Level Up"}</h2>
        {register && (
          <>
            <Field
              label="Nombre completo"
              name="nombre"
              minLength={3}
              autoComplete="name"
            />
            <Field label="RUN" name="run" placeholder="12.345.678-5" />
          </>
        )}
        <Field
          label="Correo electrónico"
          name="correo"
          type="email"
          autoComplete="email"
        />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          minLength={8}
          autoComplete={register ? "new-password" : "current-password"}
        />
        {register && (
          <>
            <small>Al menos 8 caracteres, una mayúscula y un número.</small>
            <Field
              label="Confirma la contraseña"
              name="confirm"
              type="password"
              minLength={8}
              autoComplete="new-password"
            />
            <Field
              label="Teléfono (opcional)"
              name="telefono"
              required={false}
            />
            <Field
              label="Dirección (opcional)"
              name="direccion"
              required={false}
            />
            <Field label="Comuna (opcional)" name="comuna" required={false} />
            <label className="choice">
              <input type="checkbox" required /> Acepto los{" "}
              <Link to="/terminos">términos y privacidad</Link>.
            </label>
          </>
        )}
        <ErrorMessage message={error} />
        <button className="btn btn-lime w-100 mt-3" disabled={busy}>
          {busy ? "Un momento…" : register ? "Crear mi cuenta" : "Ingresar"}{" "}
          <ArrowRight size={18} />
        </button>
        <p className="mt-4">
          {register ? "¿Ya eres parte del equipo?" : "¿Primera vez por aquí?"}{" "}
          <Link
            to={
              (register ? "/login" : "/registro") +
              (params.get("next")
                ? "?next=" + encodeURIComponent(params.get("next"))
                : "")
            }
          >
            {register ? "Ingresa" : "Crea una cuenta"}
          </Link>
        </p>
      </form>
    </main>
  );
}

export function Profile() {
  const { user, setNotice } = useShop(),
    [error, setError] = useState("");
  if (!user)
    return (
      <main className="container section">
        <Empty
          title="Tu espacio en Level Up"
          text="Ingresa para ver tu perfil y tu historial de compras."
          to="/login"
          action="Ingresar"
        />
      </main>
    );
  function save(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (f.nombre.trim().length < 3) throw Error("Ingresa un nombre válido.");
      db.update("users", user.id, f);
      setNotice("Perfil actualizado.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  const orders = db.list("orders").filter((o) => o.userId === user.id);
  return (
    <main className="container section">
      <PageTitle title={`Tu espacio, ${user.nombre.split(" ")[0]}.`}>
        Datos guardados para tu próxima visita.
      </PageTitle>
      <form className="panel mb-5" onSubmit={save}>
        <h2>Mi perfil</h2>
        <div className="form-grid">
          <Field
            label="Nombre completo"
            name="nombre"
            defaultValue={user.nombre}
            minLength={3}
          />
          <Field
            label="Teléfono"
            name="telefono"
            defaultValue={user.telefono}
            required={false}
          />
          <Field
            label="Dirección"
            name="direccion"
            defaultValue={user.direccion}
            required={false}
          />
          <Field
            label="Comuna"
            name="comuna"
            defaultValue={user.comuna}
            required={false}
          />
        </div>
        <ErrorMessage message={error} />
        <button className="btn btn-lime">Guardar cambios</button>
      </form>
      <h2 className="mb-4">Mis compras</h2>
      {orders.length ? (
        orders
          .slice()
          .reverse()
          .map((o) => <Receipt key={o.id} order={o} />)
      ) : (
        <Empty title="Tu primera aventura está por comenzar" />
      )}
    </main>
  );
}

const events = [
  {
    id: "mesa",
    title: "Noche de juegos de mesa",
    image: "catan.png",
    tag: "ESTRATEGIA & AMIGOS",
    text: "Aprende un juego nuevo o trae tu favorito. Hay lugar para todos.",
  },
  {
    id: "tcg",
    title: "Encuentro Pokémon TCG",
    image: "cartaspokemon.png",
    tag: "CARTAS & COMUNIDAD",
    text: "Comparte tu colección y encuentra a tu próximo rival.",
  },
  {
    id: "coop",
    title: "Tarde de cooperativos",
    image: "overcooked.png",
    tag: "UN EQUIPO, UNA MISIÓN",
    text: "Reúne a tu grupo y enfrenten juntos un nuevo desafío.",
  },
];
export function Events() {
  const { user, setNotice } = useShop();
  const [selected, setSelected] = useState(""),
    [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));
      if (!f.nombre.trim()) throw Error("Ingresa tu nombre.");
      db.create("reservations", {
        ...f,
        event: selected,
        userId: user?.id || null,
        date: new Date().toISOString(),
        status: "Por confirmar",
      });
      setSelected("");
      setNotice(
        "Solicitud guardada. La reserva queda pendiente de confirmación.",
      );
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <main className="container section">
      <PageTitle title="Encuentra a tu equipo.">
        Propuestas de encuentros de nuestra comunidad. Solicita una reserva y
        coordinaremos fecha y disponibilidad.
      </PageTitle>
      <div className="events-grid">
        {events.map((e) => (
          <article className="event-card" key={e.id}>
            <img src={imageUrl("/img/" + e.image)} alt={e.title} />
            <div>
              <div className="eyebrow">{e.tag}</div>
              <h2>{e.title}</h2>
              <p>{e.text}</p>
              <small>Fecha y cupos por confirmar</small>
              <button
                className="btn btn-outline-light mt-3"
                onClick={() => {
                  setSelected(e.id);
                  setError("");
                }}
              >
                Solicitar reserva <ArrowUpRight size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {selected && (
        <form className="panel mt-4" onSubmit={submit}>
          <h2>Reserva · {events.find((e) => e.id === selected)?.title}</h2>
          <div className="form-grid">
            <Field
              label="Tu nombre"
              name="nombre"
              defaultValue={user?.nombre}
            />
            <Field
              label="Correo"
              name="correo"
              type="email"
              defaultValue={user?.correo}
            />
            <Field
              label="Personas"
              name="personas"
              type="number"
              min="1"
              max="12"
              defaultValue="2"
            />
          </div>
          <ErrorMessage message={error} />
          <button className="btn btn-lime">Enviar solicitud</button>{" "}
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => setSelected("")}
          >
            Cancelar
          </button>
        </form>
      )}
    </main>
  );
}
export function Contact() {
  const { user, setNotice } = useShop();
  const [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));
      if (f.nombre.trim().length < 3 || f.mensaje.trim().length < 10)
        throw Error(
          "Escribe tu nombre y un mensaje de al menos 10 caracteres.",
        );
      db.create("messages", {
        ...f,
        date: new Date().toISOString(),
        status: "Nuevo",
      });
      e.currentTarget.reset();
      setError("");
      setNotice(
        "Mensaje enviado. Gracias por contactarnos!!!",
      );
    } catch (err) {
      setError(err.message);
    }
  }
  return (
    <main className="container section">
      <PageTitle
        eyebrow="TIENDA FÍSICA / CAFETERÍA / CONTACTO"
        title="Tu próxima partida tiene lugar."
      >
        Encuéntranos en Santiago y Ñuñoa. Ven por un café, descubre un juego y
        quédate a compartir.
      </PageTitle>
      <Locations />
      <section
        className="contact-form-section"
        aria-label="Formulario de contacto"
      >
        <div className="page-title">
          <div className="eyebrow">HABLEMOS</div>
          <h2>Conversemos entre partidas.</h2>
          <p>Cuéntanos tu idea, consulta o propuesta para la comunidad.</p>
        </div>
        <div className="checkout-grid">
          <form className="panel" onSubmit={submit}>
            <Field
              label="Nombre"
              name="nombre"
              defaultValue={user?.nombre}
              minLength={3}
            />
            <Field
              label="Correo"
              name="correo"
              type="email"
              defaultValue={user?.correo}
            />
            <label className="field">
              Tu mensaje
              <textarea
                className="form-control"
                name="mensaje"
                rows="6"
                required
                minLength={10}
              />
            </label>
            <ErrorMessage message={error} />
            <button className="btn btn-lime">
              Enviar mensaje <ArrowUpRight size={18} />
            </button>
          </form>
          <aside className="summary">
            <h2>Una mesa para tus ideas</h2>
            <p>
              ¿Un encuentro de tu comunidad? ¿Una consulta sobre juegos? Te
              escuchamos.
            </p>
            <small>
              Para hablar directamente con una sucursal, usa los teléfonos
              indicados junto a los mapas.
            </small>
          </aside>
        </div>
      </section>
    </main>
  );
}
export function Terms() {
  return (
    <main className="container section prose">
      <PageTitle title="Términos y privacidad" />
      <h2>Demostración académica</h2>
      <p>
        Level Up Coffee Bar es un prototipo de frontend. Los pedidos, pagos,
        reservas y mensajes son simulados. No se realizan cobros, envíos,
        reservas confirmadas ni comunicaciones externas.
      </p>
      <h2>Datos en tu navegador</h2>
      <p>
        El catálogo, carrito, perfiles, mensajes y pedidos se guardan en
        localStorage de este navegador. La sesión se guarda en sessionStorage.
        No se comparten entre equipos. No ingreses datos personales reales ni
        contraseñas reutilizadas.
      </p>
      <h2>Productos y entrega</h2>
      <p>
        Precios en pesos chilenos. Retiro gratis y envío simulado de $3.990;
        gratis desde $50.000. Disponibilidad sujeta al stock local. Las imágenes
        son referenciales.
      </p>
      <h2>Control de datos</h2>
      <p>
        Puedes borrar los datos del sitio desde los ajustes de almacenamiento de
        tu navegador. Esto también elimina el historial local. La autenticación
        y el rol administrativo son demostrativos; se requiere un servidor para
        un uso real.
      </p>
    </main>
  );
}

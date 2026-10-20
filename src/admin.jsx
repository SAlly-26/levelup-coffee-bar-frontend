import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit3,
  Trash2,
  Download,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { db, money, price, passwordHash, validRun } from "./database";
import { useShop } from "./store";
import { PageTitle, Empty, Field, ErrorMessage } from "./components";
import { Receipt } from "./pages";
const tabs = [
  ["dashboard", "Resumen"],
  ["products", "Productos"],
  ["categories", "Categorías"],
  ["users", "Usuarios"],
  ["orders", "Órdenes y comprobantes"],
  ["critical", "Stock crítico"],
  ["reports", "Reportes"],
  ["messages", "Mensajes"],
  ["reservations", "Reservas"],
];
export function AdminSetup() {
  const { login, setNotice } = useShop();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (db.list("users").some((u) => u.role === "admin"))
    return (
      <Empty
        title="Acceso administrativo"
        text="Ingresa con una cuenta administradora para continuar."
        to="/login?next=/admin"
        action="Ingresar"
      />
    );
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const f = Object.fromEntries(new FormData(e.currentTarget));
      if (f.nombre.trim().length < 3) throw Error("Ingresa un nombre válido.");
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(f.password))
        throw Error("Usa 8 caracteres, una mayúscula y un número.");
      if (
        db.list("users").some((u) => u.correo === f.correo.trim().toLowerCase())
      )
        throw Error(
          "El correo ya está registrado. Usa otro correo para la cuenta administradora.",
        );
      const salt = crypto.randomUUID();
      const user = db.create("users", {
        nombre: f.nombre.trim(),
        correo: f.correo.trim().toLowerCase(),
        role: "admin",
        salt,
        password: await passwordHash(f.password, salt),
      });
      login(user.id);
      setNotice("Cuenta administradora local creada.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="setup panel">
      <h2>Prepara tu demostración</h2>
      <p>
        Este navegador aún no tiene administrador. Crea la cuenta inicial para
        gestionar el proyecto. El acceso es local y demostrativo.
      </p>
      <form onSubmit={submit}>
        <Field label="Nombre" name="nombre" minLength={3} />
        <Field label="Correo" name="correo" type="email" />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          minLength={8}
        />
        <small>8 caracteres, una mayúscula y un número.</small>
        <ErrorMessage message={error} />
        <button className="btn btn-lime mt-3" disabled={busy}>
          Crear administrador local
        </button>
      </form>
    </div>
  );
}
export function Admin() {
  const { user, setNotice } = useShop();
  const [tab, setTab] = useState("dashboard"),
    [editing, setEditing] = useState(null),
    [error, setError] = useState(""),
    [search, setSearch] = useState(""),
    [selectedOrder, setSelectedOrder] = useState(null),
    [userHistory, setUserHistory] = useState(null);
  const products = db.list("products"),
    categories = db.list("categories"),
    users = db.list("users"),
    orders = db.list("orders");
  const revenue = orders
    .filter((o) => o.status !== "Cancelado")
    .reduce((s, o) => s + o.total, 0);
  if (user?.role !== "admin")
    return (
      <main className="container section">
        <PageTitle title="Administración" />
        <AdminSetup />
      </main>
    );
  function select(id) {
    setTab(id);
    setEditing(null);
    setError("");
    setSearch("");
    setSelectedOrder(null);
    setUserHistory(null);
  }
  function edit(item = {}) {
    setEditing(item);
    setError("");
  }
  async function save(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      let record = { ...f };
      if (tab === "products") {
        for (const k of ["precio", "stock", "descuento"])
          record[k] = Number(f[k]);
        if (
          !record.nombre.trim() ||
          !record.descripcion.trim() ||
          !Number.isInteger(record.precio) ||
          record.precio < 1 ||
          !Number.isInteger(record.stock) ||
          record.stock < 0 ||
          record.descuento < 0 ||
          record.descuento > 90
        )
          throw Error("Revisa nombre, precio, stock y descuento.");
        if (!/^\/img\/[a-zA-Z0-9._-]+$/.test(record.imagen))
          throw Error("Usa una ruta local válida, por ejemplo /img/catan.png.");
        if (!categories.some((c) => c.nombre === record.categoria))
          throw Error("Selecciona una categoría válida.");
      }
      if (tab === "categories") {
        record.nombre = record.nombre.trim();
        if (!record.nombre) throw Error("Ingresa el nombre.");
        if (
          categories.some(
            (c) =>
              c.id !== editing.id &&
              c.nombre.toLowerCase() === record.nombre.toLowerCase(),
          )
        )
          throw Error("Esa categoría ya existe.");
      }
      if (tab === "users") {
        record.correo = record.correo.trim().toLowerCase();
        record.nombre = record.nombre.trim();
        if (record.nombre.length < 3) throw Error("Nombre demasiado corto.");
        if (record.run && !validRun(record.run))
          throw Error("El RUN no es válido.");
        if (
          users.some((u) => u.id !== editing.id && u.correo === record.correo)
        )
          throw Error("Ese correo ya está registrado.");
        if (editing.id === user.id && record.role !== "admin")
          throw Error("No puedes quitarte tu propio acceso administrativo.");
        if (f.newPassword) {
          if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(f.newPassword))
            throw Error("Contraseña: 8 caracteres, una mayúscula y un número.");
          record.salt = crypto.randomUUID();
          record.password = await passwordHash(f.newPassword, record.salt);
        } else if (!editing.id)
          throw Error("Define la contraseña del usuario nuevo.");
        delete record.newPassword;
      }
      if (editing.id) {
        if (tab === "categories" && record.nombre !== editing.nombre) {
          for (const p of products.filter(
            (p) => p.categoria === editing.nombre,
          ))
            db.update("products", p.id, { categoria: record.nombre });
        }
        db.update(tab, editing.id, record);
      } else db.create(tab, record);
      setEditing(null);
      setNotice("Cambios guardados.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
  function remove(item) {
    try {
      if (
        tab === "categories" &&
        products.some((p) => p.categoria === item.nombre)
      )
        throw Error("Reasigna los productos antes de eliminar esta categoría.");
      if (tab === "users" && item.id === user.id)
        throw Error("No puedes eliminar tu propia cuenta.");
      if (
        !window.confirm(
          `¿Eliminar ${item.nombre}? Esta acción no se puede deshacer.`,
        )
      )
        return;
      db.remove(tab, item.id);
      setNotice("Registro eliminado.");
    } catch (err) {
      setError(err.message);
    }
  }
  function exportReport() {
    const rows = [
      ["Pedido", "Fecha", "Cliente", "Estado", "Total CLP"],
      ...orders.map((o) => [
        o.number,
        o.date,
        o.customer.nombre,
        o.status,
        o.total,
      ]),
    ];
    const csv =
      "\uFEFF" +
      rows
        .map((row) =>
          row
            .map(
              (v) =>
                '"' +
                String(v)
                  .replace(/"/g, '""')
                  .replace(/^[=+@-]/, "'") +
                '"',
            )
            .join(";"),
        )
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "levelup-reporte-pedidos.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  const metrics = (
    <div className="metrics">
      {[
        [Package, "Productos", products.length],
        [ShoppingBag, "Pedidos", orders.length],
        [Users, "Usuarios", users.length],
        [BarChart3, "Ventas simuladas", money(revenue)],
      ].map(([Icon, label, value]) => (
        <div className="metric" key={label}>
          <Icon size={22} />
          <small>{label}</small>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
  const actions = (item) => (
    <div className="d-flex gap-2">
      <button
        className="icon-button"
        aria-label={"Editar " + item.nombre}
        onClick={() => edit(item)}
      >
        <Edit3 size={17} />
      </button>
      <button
        className="icon-button"
        aria-label={"Eliminar " + item.nombre}
        onClick={() => remove(item)}
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
  return (
    <main className="container section">
      <PageTitle
        eyebrow="LEVEL UP / CENTRO DE CONTROL"
        title="Todo listo para el siguiente nivel."
      >
        Gestiona el catálogo y las operaciones de tu cafetería.
      </PageTitle>
      <div className="admin-grid">
        <aside className="admin-nav">
          {tabs.map(([id, label]) => (
            <button
              className={tab === id ? "selected" : ""}
              key={id}
              onClick={() => select(id)}
            >
              {label}
            </button>
          ))}
          <Link to="/perfil">Mi perfil ↗</Link>
        </aside>
        <section className="admin-content">
          <div className="section-heading">
            <h2>{tabs.find((t) => t[0] === tab)[1]}</h2>
            {["products", "categories", "users"].includes(tab) && (
              <button className="btn btn-lime" onClick={() => edit()}>
                <Plus size={18} /> Crear{" "}
                {tab === "products"
                  ? "producto"
                  : tab === "users"
                    ? "usuario"
                    : "categoría"}
              </button>
            )}
          </div>
          <ErrorMessage message={error} />
          {["dashboard", "reports"].includes(tab) && (
            <>
              {metrics}
              <div className="panel mt-4">
                <h3>Tu operación, de un vistazo</h3>
                <p>
                  <AlertTriangle size={18} />{" "}
                  {products.filter((p) => p.stock <= 5).length} productos con
                  stock crítico (5 unidades o menos).
                </p>
                <p>
                  {
                    db.list("messages").filter((m) => m.status === "Nuevo")
                      .length
                  }{" "}
                  mensajes sin revisar ·{" "}
                  {
                    db
                      .list("reservations")
                      .filter((m) => m.status === "Por confirmar").length
                  }{" "}
                  reservas pendientes.
                </p>
                <p>
                  Ticket promedio:{" "}
                  {money(
                    orders.filter((o) => o.status !== "Cancelado").length
                      ? revenue /
                          orders.filter((o) => o.status !== "Cancelado").length
                      : 0,
                  )}
                </p>
                <button
                  className="btn btn-outline-light"
                  onClick={exportReport}
                >
                  <Download size={18} /> Exportar pedidos CSV
                </button>
              </div>
              <div className="panel mt-4">
                <h3>Ventas por categoría</h3>
                {categories.map((c) => {
                  const sum = orders
                    .filter((o) => o.status !== "Cancelado")
                    .reduce(
                      (s, o) =>
                        s +
                        o.items
                          .filter((p) => p.categoria === c.nombre)
                          .reduce((v, p) => v + p.quantity * p.unitPrice, 0),
                      0,
                    );
                  return (
                    <div className="report-line" key={c.id}>
                      <span>{c.nombre}</span>
                      <div>
                        <div
                          style={{
                            width: (revenue ? (sum / revenue) * 100 : 0) + "%",
                          }}
                        />
                      </div>
                      <strong>{money(sum)}</strong>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {editing && (
            <form
              className="panel mb-4"
              onSubmit={save}
              key={editing.id || "new"}
            >
              <h3>{editing.id ? "Editar registro" : "Nuevo registro"}</h3>
              <div className="form-grid">
                <Field
                  label="Nombre"
                  name="nombre"
                  defaultValue={editing.nombre}
                  minLength={tab === "categories" ? 1 : 3}
                />
                {tab === "products" && (
                  <>
                    <label className="field">
                      Categoría
                      <select
                        className="form-select"
                        required
                        name="categoria"
                        defaultValue={
                          editing.categoria || categories[0]?.nombre
                        }
                      >
                        {categories.map((c) => (
                          <option key={c.id}>{c.nombre}</option>
                        ))}
                      </select>
                    </label>
                    <label className="field">
                      Tipo
                      <select
                        className="form-select"
                        name="tipo"
                        defaultValue={editing.tipo || "juego"}
                      >
                        <option value="juego">Juego</option>
                        <option value="cafe">Café / snacks</option>
                      </select>
                    </label>
                    <Field
                      label="Precio CLP"
                      name="precio"
                      type="number"
                      min="1"
                      step="1"
                      defaultValue={editing.precio}
                    />
                    <Field
                      label="Stock"
                      name="stock"
                      type="number"
                      min="0"
                      step="1"
                      defaultValue={editing.stock ?? 0}
                    />
                    <Field
                      label="Descuento %"
                      name="descuento"
                      type="number"
                      min="0"
                      max="90"
                      defaultValue={editing.descuento ?? 0}
                    />
                    <Field
                      label="Imagen (ruta local)"
                      name="imagen"
                      defaultValue={editing.imagen || "/img/catan.png"}
                    />
                    <label className="field">
                      Descripción
                      <textarea
                        className="form-control"
                        name="descripcion"
                        required
                        defaultValue={editing.descripcion}
                      />
                    </label>
                  </>
                )}
                {tab === "users" && (
                  <>
                    <Field
                      label="Correo"
                      name="correo"
                      type="email"
                      defaultValue={editing.correo}
                    />
                    <Field
                      label="RUN (opcional)"
                      name="run"
                      defaultValue={editing.run}
                      required={false}
                    />
                    <label className="field">
                      Rol
                      <select
                        className="form-select"
                        name="role"
                        defaultValue={editing.role || "cliente"}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </label>
                    <Field
                      label={
                        editing.id
                          ? "Nueva contraseña (opcional)"
                          : "Contraseña"
                      }
                      name="newPassword"
                      type="password"
                      minLength={8}
                      required={!editing.id}
                    />
                    <Field
                      label="Dirección"
                      name="direccion"
                      defaultValue={editing.direccion}
                      required={false}
                    />
                    <Field
                      label="Comuna"
                      name="comuna"
                      defaultValue={editing.comuna}
                      required={false}
                    />
                    <Field
                      label="Teléfono"
                      name="telefono"
                      defaultValue={editing.telefono}
                      required={false}
                    />
                  </>
                )}
              </div>
              <ErrorMessage message={error} />
              <button className="btn btn-lime">Guardar</button>{" "}
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </button>
            </form>
          )}
          {["products", "categories", "users", "critical"].includes(tab) && (
            <>
              <input
                className="form-control mb-3"
                placeholder="Buscar por nombre…"
                aria-label="Buscar registros"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>
                        {tab === "categories"
                          ? "Productos"
                          : tab === "users"
                            ? "Correo / rol"
                            : "Precio"}
                      </th>
                      <th>
                        {["products", "critical"].includes(tab)
                          ? "Stock"
                          : "Acciones"}
                      </th>
                      {["products", "critical", "users"].includes(tab) && (
                        <th>Acciones</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(tab === "categories"
                      ? categories
                      : tab === "users"
                        ? users
                        : tab === "critical"
                          ? products.filter((p) => p.stock <= 5)
                          : products
                    )
                      .filter((p) =>
                        p.nombre.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((item) => (
                        <tr key={item.id}>
                          <td>
                            {tab === "products" || tab === "critical" ? (
                              <Link to={"/producto/" + item.id}>
                                {item.nombre}
                              </Link>
                            ) : (
                              item.nombre
                            )}
                          </td>
                          <td>
                            {tab === "categories"
                              ? products.filter(
                                  (p) => p.categoria === item.nombre,
                                ).length
                              : tab === "users"
                                ? `${item.correo} / ${item.role}`
                                : money(price(item))}
                          </td>
                          {["products", "critical"].includes(tab) && (
                            <td>
                              <span
                                className={
                                  item.stock <= 5 ? "text-warning" : ""
                                }
                              >
                                {item.stock}
                              </span>
                            </td>
                          )}
                          <td>
                            {tab === "critical" ? (
                              <button
                                className="btn btn-outline-light btn-sm"
                                onClick={() => {
                                  setTab("products");
                                  edit(item);
                                }}
                              >
                                Reponer
                              </button>
                            ) : (
                              actions(item)
                            )}
                          </td>
                          {tab === "users" && (
                            <td>
                              <button
                                className="text-button"
                                onClick={() => setUserHistory(item)}
                              >
                                Ver compras
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {tab === "critical" && !products.some((p) => p.stock <= 5) && (
                <p className="muted">
                  Todo en orden: no hay productos con stock crítico.
                </p>
              )}
            </>
          )}
          {tab === "orders" && (
            <>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Comprobante</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .slice()
                      .reverse()
                      .map((o) => (
                        <tr key={o.id}>
                          <td>{o.number}</td>
                          <td>{o.customer.nombre}</td>
                          <td>{money(o.total)}</td>
                          <td>
                            <select
                              aria-label={"Estado de " + o.number}
                              className="form-select"
                              value={o.status}
                              onChange={(e) => {
                                try {
                                  db.update("orders", o.id, {
                                    status: e.target.value,
                                  });
                                  setNotice("Estado actualizado.");
                                } catch (err) {
                                  setError(err.message);
                                }
                              }}
                            >
                              {[
                                "Confirmado",
                                "En preparación",
                                "Listo para retiro",
                                "Enviado",
                                "Entregado",
                                "Cancelado",
                              ].map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              className="text-button"
                              onClick={() => setSelectedOrder(o.id)}
                            >
                              Ver resumen
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!orders.length && (
                <p className="muted">
                  Todavía no hay pedidos. Realiza una compra simulada para ver
                  el flujo completo.
                </p>
              )}
              <small>
                Cancelar un pedido cambia su estado y lo excluye de ventas; no
                repone existencias automáticamente. Ajusta el stock desde
                Productos si corresponde.
              </small>
              {selectedOrder && (
                <Receipt order={db.get("orders", selectedOrder)} />
              )}
            </>
          )}
          {userHistory && (
            <div className="mt-4">
              <h3>Compras de {userHistory.nombre}</h3>
              {orders.filter((o) => o.userId === userHistory.id).length ? (
                orders
                  .filter((o) => o.userId === userHistory.id)
                  .map((o) => <Receipt key={o.id} order={o} />)
              ) : (
                <p>Sin compras registradas.</p>
              )}
            </div>
          )}
          {["messages", "reservations"].includes(tab) && (
            <>
              {db
                .list(tab)
                .slice()
                .reverse()
                .map((m) => (
                  <article className="panel mb-3" key={m.id}>
                    <h3>{m.nombre}</h3>
                    <p>
                      {m.correo} · {new Date(m.date).toLocaleString("es-CL")}
                    </p>
                    <p>
                      {m.mensaje ||
                        `Encuentro: ${m.event} · Personas: ${m.personas}`}
                    </p>
                    <label className="field">
                      Estado
                      <select
                        className="form-select"
                        value={m.status}
                        onChange={(e) => {
                          try {
                            db.update(tab, m.id, { status: e.target.value });
                          } catch (err) {
                            setError(err.message);
                          }
                        }}
                      >
                        {(tab === "messages"
                          ? ["Nuevo", "Revisado"]
                          : ["Por confirmar", "Confirmada", "Cancelada"]
                        ).map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  </article>
                ))}
              {!db.list(tab).length && (
                <p className="muted">Sin registros por ahora.</p>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

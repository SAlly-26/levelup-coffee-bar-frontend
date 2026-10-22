import { price } from "../src/database.js"
describe("Calculo de precio", () => {
    it("Mantiene el precio base sin descuenteo", () => {
        const producto = {
            precio: 10000,
            descuento: 0,
        };
        const resultado = price(producto);
        expect(resultado).toBe(10000);
    });

    it("Precio con descuento aplicado", () => {
        const producto = {
            precio: 10000,
            descuento: 20,
        };
        const resultado = price(producto);
        expect(resultado).toBe(8000);
    });

    it("Redondea/aproxima el precio si es decimal", () => {
        const producto = {
            precio: 9999,
            descuento: 15,
        };
        const resultado = price(producto);
        expect(resultado).toBe(8499);
    });
});
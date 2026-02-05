// --- TASK 1: Creación del objeto de productos ---
const productos = {
    p1: { id: 1, nombre: "Laptop", precio: 1200 },
    p2: { id: 2, nombre: "Celular", precio: 1400 },
    p3: { id: 3, nombre: "Ipad", precio: 2000 }
};

// --- TASK 2: Uso de Set en JavaScript ---
// Creamos un Set con números repetidos
const listaNumeros = new Set([10, 20, 20, 30, 40, 40, 50]);

console.log("--- Contenido del Set (sin duplicados) ---");
console.log(listaNumeros);

// Agregando un nuevo número
listaNumeros.add(60);

// Verificando si existe un número (devuelve true/false)
const existeElTreinta = listaNumeros.has(30);
console.log(`¿Existe el número 30?: ${existeElTreinta}`);

// Eliminando un número
listaNumeros.delete(10);

// --- TASK 3: Creación de un Map ---
// Relaciona Categoría (Clave) con Nombre del Producto (Valor)
const categoriasProductos = new Map();

categoriasProductos.set("Computación", productos.p1.nombre);
categoriasProductos.set("Telefonía", productos.p2.nombre);
categoriasProductos.set("Tablets", productos.p3.nombre);

// --- TASK 4: Iteración sobre las estructuras ---

console.log("\n--- Iterando Objeto con for...in ---");
for (let llave in productos) {
    console.log(`Clave: ${llave} -> Producto: ${productos[llave].nombre}, Precio: ${productos[llave].precio}`);
}

console.log("\n--- Iterando Set con for...of ---");
for (let num of listaNumeros) {
    console.log(`Valor del Set: ${num}`);
}

console.log("\n--- Iterando Map con forEach ---");
categoriasProductos.forEach((valor, clave) => {
    console.log(`Categoría: ${clave} | Producto: ${valor}`);
});

// --- TASK 5: Validación y Pruebas ---

function validarProductos(obj) {
    console.log("\n--- Validando Productos ---");
    for (let p in obj) {
        const item = obj[p];
        // Verificamos que tenga ID, nombre (string) y precio (número positivo)
        if (item.id && typeof item.nombre === "string" && typeof item.precio === "number" && item.precio > 0) {
            console.log(`✅ Producto ${item.nombre} es válido.`);
        } else {
            console.log(`❌ Error: El producto con ID ${item.id} tiene datos inválidos.`);
        }
    }
}

// Ejecución de pruebas finales
validarProductos(productos);

console.log("\n--- RESUMEN FINAL ---");
console.log("Objeto completo:", productos);
console.log("Valores únicos (Set):", [...listaNumeros]); // Convertido a array para ver mejor
console.log("Mapa de categorías:", Object.fromEntries(categoriasProductos));
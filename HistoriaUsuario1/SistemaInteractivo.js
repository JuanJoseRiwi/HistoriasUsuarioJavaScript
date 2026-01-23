// ==========================================
// TASK 1: Configuración inicial
// ==========================================
// Este archivo pide datos al usuario y decide qué mensaje mostrar.

// ==========================================
// TASK 2: Entrada de datos del usuario
// ==========================================

// Usamos prompt para abrir una ventanita y pedir el nombre
// Guardamos el resultado en una variable llamada 'nombre'
let nombre = prompt("¿Cómo te llamas?");

// Pedimos la edad y la guardamos en 'edadIngresada'
let edadIngresada = prompt("¿Cuántos años tienes?");

// ==========================================
// TASK 3: Validación de la edad
// ==========================================

// El navegador recibe el número como texto, así que lo convertimos a número real
let edad = Number(edadIngresada);

// isNaN significa "¿No es un número?" (is Not a Number)
// Si el usuario escribió letras, isNaN(edad) será verdadero (true)
if (isNaN(edad)) {
    // Si no es un número, mostramos el error en rojo en la consola
    console.error("Error: Por favor, ingresa una edad válida en números.");
} 

// ==========================================
// TASK 4: Condicionales y mensajes dinámicos
// ==========================================
else {
    // Si el código llega aquí, es porque la edad SÍ es un número válido.

    if (edad < 18) {
        // Si tiene menos de 18 años
        alert("Hola " + nombre + ", eres menor de edad. ¡Sigue aprendiendo!");
        console.log("Hola " + nombre + ", eres menor de edad.");
    } 
    else {
        // Si tiene 18 o más años
        alert("Hola " + nombre + ", eres mayor de edad. ¡Prepárate para grandes oportunidades!");
        console.log("Hola " + nombre + ", eres mayor de edad.");
    }
}
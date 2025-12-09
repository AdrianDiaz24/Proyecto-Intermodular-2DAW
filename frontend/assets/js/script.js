
// Calculadora para ver si documenta

/**
 * Suma dos números.
 * @param {number} a - Primer número.
 * @param {number} b - Segundo número.
 * @returns {number} La suma de ambos números.
 */
export function sumar(a, b) {
    return a + b;
}

/**
 * Calcula el promedio de una lista de números.
 * @param {number[]} lista - Lista de valores numéricos.
 * @returns {number} El promedio calculado.
 */
export function promedio(lista) {
    const total = lista.reduce((a, b) => a + b, 0);
    return total / lista.length;
}

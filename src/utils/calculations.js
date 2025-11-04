// src/utils/calculations.js

/**
 * Valida los datos de entrada según el modelo seleccionado
 * @param {number} lambda - Tasa de llegada
 * @param {number} mu - Tasa de servicio
 * @param {number} s - Número de servidores (solo para M/M/S)
 * @param {string} modelo - Tipo de modelo ('MM1' o 'MMS')
 * @returns {object} - { valido: boolean, mensaje: string }
 */
export const validarEntradas = (lambda, mu, s, modelo) => {
  if (!lambda || !mu || lambda <= 0 || mu <= 0) {
    return { valido: false, mensaje: 'Lambda y Mu deben ser números positivos' };
  }

  if (modelo === 'MMS') {
    if (!s || s <= 0 || !Number.isInteger(Number(s))) {
      return { valido: false, mensaje: 'El número de servidores debe ser un entero positivo' };
    }
    if (lambda >= s * mu) {
      return { valido: false, mensaje: 'El sistema es inestable: λ debe ser menor que s*μ' };
    }
  } else {
    if (lambda >= mu) {
      return { valido: false, mensaje: 'El sistema es inestable: λ debe ser menor que μ' };
    }
  }

  return { valido: true, mensaje: '' };
};

/**
 * Calcula métricas para modelo M/M/1
 * @param {number} lambda - Tasa de llegada
 * @param {number} mu - Tasa de servicio
 * @returns {object} - Objeto con todas las métricas calculadas
 */
export const calcularMM1 = (lambda, mu) => {
  const rho = lambda / mu;
  const P0 = 1 - rho;
  const L = lambda / (mu - lambda);
  const Lq = (lambda * lambda) / (mu * (mu - lambda));
  const W = 1 / (mu - lambda);
  const Wq = lambda / (mu * (mu - lambda));

  return {
    rho: rho.toFixed(6),
    P0: P0.toFixed(6),
    L: L.toFixed(6),
    Lq: Lq.toFixed(6),
    W: W.toFixed(6),
    Wq: Wq.toFixed(6),
    ecuaciones: {
      rho: 'ρ = λ/μ',
      P0: 'P₀ = 1 - ρ',
      L: 'L = λ/(μ - λ)',
      Lq: 'Lq = λ²/[μ(μ - λ)]',
      W: 'W = 1/(μ - λ)',
      Wq: 'Wq = λ/[μ(μ - λ)]'
    },
    descripciones: {
      rho: 'Probabilidad de hallar el sistema ocupado',
      P0: 'Probabilidad de hallar el sistema vacío',
      L: 'Número esperado de clientes en el sistema',
      Lq: 'Número esperado de clientes en la cola',
      W: 'Tiempo esperado de un cliente en el sistema',
      Wq: 'Tiempo esperado de un cliente en la cola'
    }
  };
};

/**
 * Calcula P0 para modelo M/M/S
 * @param {number} lambda - Tasa de llegada
 * @param {number} mu - Tasa de servicio
 * @param {number} s - Número de servidores
 * @returns {number} - Probabilidad de sistema vacío
 */
const calcularP0_MMS = (lambda, mu, s) => {
  const rho = lambda / mu;
  let sumatoria = 0;

  // Primera sumatoria: n = 0 hasta s-1
  for (let n = 0; n < s; n++) {
    sumatoria += Math.pow(rho, n) / factorial(n);
  }

  // Segundo término
  const termino2 = Math.pow(rho, s) / (factorial(s) * (1 - rho / s));

  const P0 = 1 / (sumatoria + termino2);
  return P0;
};

/**
 * Calcula factorial de un número
 * @param {number} n
 * @returns {number}
 */
const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;
};

/**
 * Calcula métricas para modelo M/M/S
 * @param {number} lambda - Tasa de llegada
 * @param {number} mu - Tasa de servicio
 * @param {number} s - Número de servidores
 * @returns {object} - Objeto con todas las métricas calculadas
 */
export const calcularMMS = (lambda, mu, s) => {
  const rho = lambda / mu;
  const rho_s = lambda / (s * mu);
  const P0 = calcularP0_MMS(lambda, mu, s);

  // Lq usando fórmula de Erlang C
  const numerador = Math.pow(rho, s) * rho_s;
  const denominador = factorial(s) * Math.pow(1 - rho_s, 2);
  const Lq = (numerador / denominador) * P0;

  const L = Lq + rho;
  const Wq = Lq / lambda;
  const W = Wq + (1 / mu);

  return {
    rho: rho_s.toFixed(6),
    P0: P0.toFixed(6),
    L: L.toFixed(6),
    Lq: Lq.toFixed(6),
    W: W.toFixed(6),
    Wq: Wq.toFixed(6),
    s: s,
    ecuaciones: {
      rho: 'ρ = λ/(s*μ)',
      P0: 'P₀ = 1/[Σ(λ/μ)ⁿ/n! + (λ/μ)ˢ/(s!(1-ρ))]',
      Lq: 'Lq = [(λ/μ)ˢ * ρ * P₀]/[s!(1-ρ)²]',
      L: 'L = Lq + λ/μ',
      W: 'W = L/λ',
      Wq: 'Wq = Lq/λ'
    },
    descripciones: {
      rho: 'Probabilidad de hallar el sistema ocupado',
      P0: 'Probabilidad de hallar el sistema vacío',
      L: 'Número esperado de clientes en el sistema',
      Lq: 'Número esperado de clientes en la cola',
      W: 'Tiempo esperado de un cliente en el sistema',
      Wq: 'Tiempo esperado de un cliente en la cola'
    }
  };
};
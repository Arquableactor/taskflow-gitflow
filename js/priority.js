// Prioridades de las tareas y orden del listado

export const PRIORIDADES = {
  ALTA: 'alta',
  MEDIA: 'media',
  BAJA: 'baja'
};

export const PRIORIDAD_POR_DEFECTO = PRIORIDADES.MEDIA;

// Mayor peso aparece primero en el listado
const PESOS = {
  [PRIORIDADES.ALTA]: 3,
  [PRIORIDADES.MEDIA]: 2,
  [PRIORIDADES.BAJA]: 1
};

// Las tareas guardadas antes de esta mejora no tienen prioridad: se tratan como media
export function normalizarPrioridad(valor) {
  return Object.hasOwn(PESOS, valor) ? valor : PRIORIDAD_POR_DEFECTO;
}

// sort es estable: las tareas con igual prioridad conservan su orden original
export function ordenarPorPrioridad(tareas) {
  return [...tareas].sort(
    (a, b) => PESOS[normalizarPrioridad(b.prioridad)] - PESOS[normalizarPrioridad(a.prioridad)]
  );
}

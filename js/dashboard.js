import { FILTROS, filtrarTareas } from './filters.js';

export function contarPendientes(tareas) {
  return filtrarTareas(tareas, FILTROS.PENDIENTES).length;
}

export function contarCompletadas(tareas) {
  return filtrarTareas(tareas, FILTROS.COMPLETADAS).length;
}

// Porcentaje entero de tareas completadas; 0 si no hay tareas para no dividir entre cero.
// Se redondea hacia abajo para que solo muestre 100% cuando todas esten completadas.
export function porcentajeAvance(tareas) {
  if (tareas.length === 0) return 0;
  return Math.floor((contarCompletadas(tareas) / tareas.length) * 100);
}

// Resumen del listado: total, pendientes, completadas y porcentaje de avance
export function resumirTareas(tareas) {
  return {
    total: tareas.length,
    pendientes: contarPendientes(tareas),
    completadas: contarCompletadas(tareas),
    porcentaje: porcentajeAvance(tareas)
  };
}

import { FILTROS, filtrarTareas } from './filters.js';

// Resumen basico del listado: total, pendientes y completadas
export function resumirTareas(tareas) {
  const completadas = filtrarTareas(tareas, FILTROS.COMPLETADAS).length;

  return {
    total: tareas.length,
    pendientes: tareas.length - completadas,
    completadas
  };
}

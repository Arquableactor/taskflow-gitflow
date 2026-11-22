// Filtros del listado segun el estado de la tarea

export const FILTROS = {
  TODAS: 'todas',
  PENDIENTES: 'pendientes',
  COMPLETADAS: 'completadas'
};

// Siempre devuelve un arreglo nuevo para no modificar la lista original
export function filtrarTareas(tareas, filtro) {
  if (filtro === FILTROS.PENDIENTES) return tareas.filter((tarea) => !tarea.completada);
  if (filtro === FILTROS.COMPLETADAS) return tareas.filter((tarea) => tarea.completada);
  return [...tareas];
}

// Guarda y recupera la lista de tareas en localStorage

export const CLAVE_TAREAS = 'taskflow.tareas';

// El parametro almacen permite usar un objeto falso en las pruebas de Node
export function cargarTareas(almacen = globalThis.localStorage) {
  const texto = almacen.getItem(CLAVE_TAREAS);
  if (texto === null) return [];

  try {
    const datos = JSON.parse(texto);
    return Array.isArray(datos) ? datos : [];
  } catch {
    // Si alguien edito o corrompio los datos, la app arranca vacia en lugar de romperse
    return [];
  }
}

export function guardarTareas(tareas, almacen = globalThis.localStorage) {
  almacen.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
}

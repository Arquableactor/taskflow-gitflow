// Busqueda de tareas por titulo y descripcion

// Minusculas y sin acentos: 'Exposición' -> 'exposicion'.
// NFD separa cada letra de su acento y la expresion elimina los acentos sueltos.
export function normalizarTexto(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// Devuelve un arreglo nuevo; las tareas originales no se modifican
export function buscarTareas(tareas, texto) {
  const busqueda = normalizarTexto(texto).trim();
  if (busqueda === '') return [...tareas];

  return tareas.filter((tarea) =>
    [tarea.titulo, tarea.descripcion].some((campo) => normalizarTexto(campo).includes(busqueda))
  );
}

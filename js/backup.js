import { validarTarea } from './validation.js';
import { normalizarPrioridad } from './priority.js';

// Exportar e importar las tareas como un arreglo JSON

export function exportarJSON(tareas) {
  return JSON.stringify(tareas, null, 2);
}

// Convierte un elemento del archivo en una tarea del CRUD, o null si no es valido.
// Solo copia los campos conocidos; cualquier otro campo del archivo se ignora.
function convertirTarea(item) {
  if (typeof item !== 'object' || item === null || Array.isArray(item)) return null;
  if (typeof item.id !== 'string' || item.id.trim() === '') return null;
  if (typeof item.titulo !== 'string') return null;
  if (![item.descripcion, item.fecha].every((campo) => campo == null || typeof campo === 'string')) return null;

  const { valida, datos } = validarTarea(item);
  if (!valida) return null;

  return {
    id: item.id,
    ...datos,
    prioridad: normalizarPrioridad(item.prioridad),
    completada: item.completada === true
  };
}

// Devuelve { tareas, descartadas }. Lanza un Error con un mensaje para el usuario si el archivo no sirve.
export function importarJSON(texto) {
  let datos;
  try {
    // JSON.parse solo lee datos; nunca ejecuta codigo como lo haria eval
    datos = JSON.parse(texto);
  } catch {
    throw new Error('El archivo no contiene JSON válido.');
  }

  if (!Array.isArray(datos)) {
    throw new Error('El archivo no tiene una lista de tareas.');
  }

  const ids = new Set();
  const tareas = [];
  for (const item of datos) {
    const tarea = convertirTarea(item);
    // Si un id se repite se conserva la primera tarea
    if (tarea && !ids.has(tarea.id)) {
      ids.add(tarea.id);
      tareas.push(tarea);
    }
  }

  // Evita reemplazar las tareas guardadas por una lista vacia
  if (tareas.length === 0) {
    throw new Error('El archivo no contiene tareas válidas.');
  }

  return { tareas, descartadas: datos.length - tareas.length };
}

import { formatearFecha } from './dates.js';

// Genera el HTML del listado como texto para poder probarlo en Node sin navegador

export const MENSAJE_SIN_TAREAS = 'No hay tareas para mostrar.';

const CARACTERES_HTML = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Todo texto escrito por el usuario pasa por aqui antes de ir a innerHTML
export function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (caracter) => CARACTERES_HTML[caracter]);
}

export function crearFilaTarea(tarea) {
  const titulo = escaparHTML(tarea.titulo);
  const fecha = formatearFecha(tarea.fecha);
  const clases = tarea.completada ? 'tarea tarea--completada' : 'tarea';

  return `
    <li class="${clases}" data-id="${escaparHTML(tarea.id)}">
      <input type="checkbox" class="tarea__check" data-accion="completar"
        aria-label="Marcar como completada: ${titulo}"${tarea.completada ? ' checked' : ''}>
      <div class="tarea__contenido">
        <p class="tarea__titulo">${titulo}</p>
        ${tarea.descripcion ? `<p class="tarea__descripcion">${escaparHTML(tarea.descripcion)}</p>` : ''}
        ${fecha ? `<time class="tarea__fecha" datetime="${escaparHTML(tarea.fecha)}">${fecha}</time>` : ''}
      </div>
      <div class="tarea__acciones">
        <button type="button" class="boton boton--texto" data-accion="editar" aria-label="Editar: ${titulo}">Editar</button>
        <button type="button" class="boton boton--texto boton--peligro" data-accion="eliminar" aria-label="Eliminar: ${titulo}">Eliminar</button>
      </div>
    </li>`;
}

export function renderizarListado(tareas) {
  if (tareas.length === 0) {
    return `<li class="lista-vacia">${MENSAJE_SIN_TAREAS}</li>`;
  }
  return tareas.map(crearFilaTarea).join('');
}

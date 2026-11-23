import { formatearFecha } from './dates.js';
import { normalizarPrioridad } from './priority.js';

// Genera el HTML del listado como texto para poder probarlo en Node sin navegador

export const MENSAJE_SIN_TAREAS = 'Todavía no tienes tareas. Agrega la primera con el formulario.';

// Explica por que el listado quedo vacio: no hay tareas, el filtro no tiene resultados o la busqueda no coincide
export function mensajeListaVacia({ total, enFiltro, filtro, busqueda }) {
  if (total === 0) return MENSAJE_SIN_TAREAS;
  if (enFiltro === 0) return `No hay tareas ${filtro}.`;
  return `Ninguna tarea coincide con «${busqueda.trim()}».`;
}

const CARACTERES_HTML = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

// Todo texto escrito por el usuario pasa por aqui antes de ir a innerHTML
export function escaparHTML(texto) {
  return String(texto).replace(/[&<>"']/g, (caracter) => CARACTERES_HTML[caracter]);
}

export function crearFilaTarea(tarea) {
  const titulo = escaparHTML(tarea.titulo);
  const fecha = formatearFecha(tarea.fecha);
  const prioridad = normalizarPrioridad(tarea.prioridad);
  const clases = tarea.completada ? 'tarea tarea--completada' : 'tarea';

  return `
    <li class="${clases}" data-id="${escaparHTML(tarea.id)}">
      <input type="checkbox" class="tarea__check" data-accion="completar"
        aria-label="Marcar como completada: ${titulo}"${tarea.completada ? ' checked' : ''}>
      <div class="tarea__contenido">
        <p class="tarea__titulo">${titulo}</p>
        ${tarea.descripcion ? `<p class="tarea__descripcion">${escaparHTML(tarea.descripcion)}</p>` : ''}
        <div class="tarea__meta">
          <span class="prioridad prioridad--${prioridad}">Prioridad ${prioridad}</span>
          ${fecha ? `<time class="tarea__fecha" datetime="${escaparHTML(tarea.fecha)}">${fecha}</time>` : ''}
        </div>
      </div>
      <div class="tarea__acciones">
        <button type="button" class="boton boton--texto" data-accion="editar" aria-label="Editar: ${titulo}">Editar</button>
        <button type="button" class="boton boton--texto boton--peligro" data-accion="eliminar" aria-label="Eliminar: ${titulo}">Eliminar</button>
      </div>
    </li>`;
}

// El mensaje se escapa porque puede incluir el texto que el usuario busco
export function renderizarListado(tareas, mensajeVacio = MENSAJE_SIN_TAREAS) {
  if (tareas.length === 0) {
    return `<li class="lista-vacia">${escaparHTML(mensajeVacio)}</li>`;
  }
  return tareas.map(crearFilaTarea).join('');
}

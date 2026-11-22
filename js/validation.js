import { esFechaValida } from './dates.js';

export const MAX_TITULO = 100;
export const MAX_DESCRIPCION = 500;

// Limpia los datos del formulario y devuelve los errores encontrados por campo
export function validarTarea(entrada = {}) {
  const datos = {
    titulo: String(entrada.titulo ?? '').trim(),
    descripcion: String(entrada.descripcion ?? '').trim(),
    fecha: String(entrada.fecha ?? '').trim()
  };
  const errores = {};

  if (datos.titulo === '') {
    errores.titulo = 'El título es obligatorio.';
  } else if (datos.titulo.length > MAX_TITULO) {
    errores.titulo = `El título no puede tener más de ${MAX_TITULO} caracteres.`;
  }

  if (datos.descripcion.length > MAX_DESCRIPCION) {
    errores.descripcion = `La descripción no puede tener más de ${MAX_DESCRIPCION} caracteres.`;
  }

  if (datos.fecha !== '' && !esFechaValida(datos.fecha)) {
    errores.fecha = 'La fecha no es válida.';
  }

  return { valida: Object.keys(errores).length === 0, datos, errores };
}

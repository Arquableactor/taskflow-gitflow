// Las fechas se manejan como texto 'AAAA-MM-DD', el mismo formato de <input type="date">.
// No se usa new Date('AAAA-MM-DD') porque lo interpreta en UTC y en RD mostraria el dia anterior.

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const FORMATO_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;

export function esFechaValida(texto) {
  const partes = FORMATO_FECHA.exec(texto);
  if (!partes) return false;

  const [anio, mes, dia] = partes.slice(1).map(Number);
  // Date.UTC corrige los dias imposibles (30 feb pasa a 2 mar); si algo cambia, la fecha no existe
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
}

// '2026-11-25' -> '25 nov 2026'
export function formatearFecha(texto) {
  if (!esFechaValida(texto)) return '';

  const [anio, mes, dia] = texto.split('-').map(Number);
  return `${dia} ${MESES[mes - 1]} ${anio}`;
}

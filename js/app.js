import { cargarTareas, guardarTareas } from './storage.js';
import { MAX_DESCRIPCION, MAX_TITULO, validarTarea } from './validation.js';
import { FILTROS, filtrarTareas } from './filters.js';
import { resumirTareas } from './dashboard.js';
import { mensajeListaVacia, renderizarListado } from './task-view.js';
import { PRIORIDAD_POR_DEFECTO, normalizarPrioridad, ordenarPorPrioridad } from './priority.js';
import { buscarTareas } from './search.js';
import { exportarJSON, importarJSON } from './backup.js';

// Un respaldo de miles de tareas pesa mucho menos; esto evita congelar la pagina con archivos enormes
const TAMANO_MAXIMO_ARCHIVO = 1_000_000;

// Referencias a la interfaz
const formulario = document.querySelector('#formulario-tarea');
const campos = {
  titulo: formulario.elements.titulo,
  descripcion: formulario.elements.descripcion,
  fecha: formulario.elements.fecha
};
// Fuera de "campos" porque el select no puede tener errores de validacion
const campoPrioridad = formulario.elements.prioridad;
const tituloFormulario = document.querySelector('#titulo-formulario');
const botonGuardar = document.querySelector('#boton-guardar');
const botonCancelar = document.querySelector('#boton-cancelar');
const lista = document.querySelector('#lista-tareas');
const botonesFiltro = document.querySelectorAll('[data-filtro]');
const campoBusqueda = document.querySelector('#busqueda');
const aviso = document.querySelector('#aviso');
const contadores = {
  total: document.querySelector('#contador-total'),
  pendientes: document.querySelector('#contador-pendientes'),
  completadas: document.querySelector('#contador-completadas'),
  porcentaje: document.querySelector('#porcentaje-avance')
};
const barraAvance = document.querySelector('#barra-avance');
const botonExportar = document.querySelector('#boton-exportar');
const botonImportar = document.querySelector('#boton-importar');
const campoArchivo = document.querySelector('#archivo-importar');
const mensajeRespaldo = document.querySelector('#mensaje-respaldo');

// Estado de la aplicacion
let tareas = cargarTareas();
let filtroActual = FILTROS.TODAS;
let idEditando = null;

// Los limites salen de validation.js para no repetirlos en el HTML
campos.titulo.maxLength = MAX_TITULO;
campos.descripcion.maxLength = MAX_DESCRIPCION;

function mostrar() {
  // Primero el filtro de estado, luego la busqueda y al final el orden por prioridad
  const enFiltro = filtrarTareas(tareas, filtroActual);
  const visibles = buscarTareas(enFiltro, campoBusqueda.value);
  const mensajeVacio = mensajeListaVacia({
    total: tareas.length,
    enFiltro: enFiltro.length,
    filtro: filtroActual,
    busqueda: campoBusqueda.value
  });
  lista.innerHTML = renderizarListado(ordenarPorPrioridad(visibles), mensajeVacio);

  const resumen = resumirTareas(tareas);
  contadores.total.textContent = resumen.total;
  contadores.pendientes.textContent = resumen.pendientes;
  contadores.completadas.textContent = resumen.completadas;
  contadores.porcentaje.textContent = `${resumen.porcentaje}%`;
  barraAvance.value = resumen.porcentaje;

  botonesFiltro.forEach((boton) => {
    boton.setAttribute('aria-pressed', String(boton.dataset.filtro === filtroActual));
  });
}

function guardarYMostrar() {
  try {
    guardarTareas(tareas);
    aviso.hidden = true;
  } catch {
    aviso.textContent = 'No se pudieron guardar los cambios en este navegador. Se perderán al recargar la página.';
    aviso.hidden = false;
  }
  mostrar();
}

function mostrarErrores(errores) {
  let primerCampoConError = null;

  for (const [nombre, campo] of Object.entries(campos)) {
    const mensaje = errores[nombre] ?? '';
    document.querySelector(`#error-${nombre}`).textContent = mensaje;
    campo.setAttribute('aria-invalid', String(mensaje !== ''));
    if (mensaje && !primerCampoConError) primerCampoConError = campo;
  }

  primerCampoConError?.focus();
}

function reiniciarFormulario() {
  idEditando = null;
  formulario.reset();
  // El valor por defecto sale de priority.js y no depende del atributo selected del HTML
  campoPrioridad.value = PRIORIDAD_POR_DEFECTO;
  mostrarErrores({});
  tituloFormulario.textContent = 'Nueva tarea';
  botonGuardar.textContent = 'Agregar tarea';
  botonCancelar.hidden = true;
}

function empezarEdicion(tarea) {
  idEditando = tarea.id;
  campos.titulo.value = tarea.titulo;
  campos.descripcion.value = tarea.descripcion;
  campos.fecha.value = tarea.fecha;
  campoPrioridad.value = normalizarPrioridad(tarea.prioridad);
  mostrarErrores({});
  tituloFormulario.textContent = 'Editar tarea';
  botonGuardar.textContent = 'Guardar cambios';
  botonCancelar.hidden = false;
  campos.titulo.focus();
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const { valida, datos, errores } = validarTarea({
    titulo: campos.titulo.value,
    descripcion: campos.descripcion.value,
    fecha: campos.fecha.value
  });
  mostrarErrores(errores);
  if (!valida) return;

  const prioridad = normalizarPrioridad(campoPrioridad.value);

  if (idEditando) {
    tareas = tareas.map((tarea) => (tarea.id === idEditando ? { ...tarea, ...datos, prioridad } : tarea));
  } else {
    tareas = [{ id: crypto.randomUUID(), ...datos, prioridad, completada: false }, ...tareas];
  }

  reiniciarFormulario();
  guardarYMostrar();
  // Listo para escribir la siguiente tarea sin volver a hacer clic en el titulo
  campos.titulo.focus();
});

botonCancelar.addEventListener('click', reiniciarFormulario);

// Un solo listener para todas las filas, aunque el listado se vuelva a dibujar
lista.addEventListener('click', (evento) => {
  const control = evento.target.closest('[data-accion]');
  if (!control) return;

  const id = control.closest('[data-id]').dataset.id;
  const tarea = tareas.find((t) => t.id === id);
  if (!tarea) return;

  switch (control.dataset.accion) {
    case 'completar':
      tareas = tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t));
      guardarYMostrar();
      // Al redibujar se pierde el foco; se devuelve a la casilla para quien usa teclado
      lista.querySelector(`[data-id="${CSS.escape(id)}"] .tarea__check`)?.focus();
      break;
    case 'editar':
      empezarEdicion(tarea);
      break;
    case 'eliminar':
      if (!confirm(`¿Eliminar la tarea "${tarea.titulo}"?`)) return;
      tareas = tareas.filter((t) => t.id !== id);
      if (idEditando === id) reiniciarFormulario();
      guardarYMostrar();
      break;
  }
});

botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    filtroActual = boton.dataset.filtro;
    mostrar();
  });
});

// Los resultados se actualizan con cada letra que se escribe o se borra
campoBusqueda.addEventListener('input', mostrar);

function avisarRespaldo(texto, esError = false) {
  mensajeRespaldo.textContent = texto;
  mensajeRespaldo.classList.toggle('respaldo__mensaje--error', esError);
}

botonExportar.addEventListener('click', () => {
  if (tareas.length === 0) {
    avisarRespaldo('No hay tareas para exportar.', true);
    return;
  }

  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(new Blob([exportarJSON(tareas)], { type: 'application/json' }));
  enlace.download = 'taskflow-tareas.json';
  enlace.click();
  // Se libera la URL temporal cuando el navegador ya inicio la descarga
  setTimeout(() => URL.revokeObjectURL(enlace.href), 0);
  avisarRespaldo(`Tareas exportadas: ${tareas.length}.`);
});

// El input de archivo esta oculto; este boton lo abre para tener un control accesible y con estilo propio
botonImportar.addEventListener('click', () => campoArchivo.click());

campoArchivo.addEventListener('change', async () => {
  const archivo = campoArchivo.files[0];
  // Se limpia para que elegir otra vez el mismo archivo vuelva a disparar "change"
  campoArchivo.value = '';
  if (!archivo) return;

  try {
    if (archivo.size > TAMANO_MAXIMO_ARCHIVO) throw new Error('El archivo es demasiado grande.');

    const { tareas: importadas, descartadas } = importarJSON(await archivo.text());
    const reemplazar = tareas.length === 0 ||
      confirm(`Se reemplazarán tus ${tareas.length} tareas actuales por las ${importadas.length} del archivo. ¿Continuar?`);
    if (!reemplazar) {
      avisarRespaldo('Importación cancelada. Tus tareas no cambiaron.');
      return;
    }

    tareas = importadas;
    // La tarea que se estaba editando puede no existir en el archivo importado
    reiniciarFormulario();
    guardarYMostrar();
    avisarRespaldo(`Tareas importadas: ${importadas.length}.` +
      (descartadas > 0 ? ` Descartadas por inválidas o repetidas: ${descartadas}.` : ''));
  } catch (error) {
    avisarRespaldo(error.message, true);
  }
});

mostrar();

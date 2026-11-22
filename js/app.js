import { cargarTareas, guardarTareas } from './storage.js';
import { MAX_DESCRIPCION, MAX_TITULO, validarTarea } from './validation.js';
import { FILTROS, filtrarTareas } from './filters.js';
import { resumirTareas } from './dashboard.js';
import { renderizarListado } from './task-view.js';
import { normalizarPrioridad, ordenarPorPrioridad } from './priority.js';

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
const aviso = document.querySelector('#aviso');
const contadores = {
  total: document.querySelector('#contador-total'),
  pendientes: document.querySelector('#contador-pendientes'),
  completadas: document.querySelector('#contador-completadas')
};

// Estado de la aplicacion
let tareas = cargarTareas();
let filtroActual = FILTROS.TODAS;
let idEditando = null;

// Los limites salen de validation.js para no repetirlos en el HTML
campos.titulo.maxLength = MAX_TITULO;
campos.descripcion.maxLength = MAX_DESCRIPCION;

function mostrar() {
  lista.innerHTML = renderizarListado(ordenarPorPrioridad(filtrarTareas(tareas, filtroActual)));

  const resumen = resumirTareas(tareas);
  contadores.total.textContent = resumen.total;
  contadores.pendientes.textContent = resumen.pendientes;
  contadores.completadas.textContent = resumen.completadas;

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

mostrar();

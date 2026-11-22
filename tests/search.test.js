import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buscarTareas, normalizarTexto } from '../js/search.js';

const tareas = [
  { id: '1', titulo: 'Preparar exposición', descripcion: 'Diapositivas de Git Flow' },
  { id: '2', titulo: 'Estudiar Matemáticas', descripcion: '' },
  { id: '3', titulo: 'Comprar cuaderno', descripcion: 'Papelería del ITLA' }
];

const ids = (lista) => lista.map((tarea) => tarea.id);

test('normaliza el texto a minusculas y sin acentos', () => {
  assert.equal(normalizarTexto('Exposición ÁÉÍÓÚ Ü'), 'exposicion aeiou u');
  // La ñ se trata como n para que funcione aunque el teclado no la tenga
  assert.equal(normalizarTexto('Mañana'), 'manana');
  assert.equal(normalizarTexto(undefined), '');
});

test('encuentra coincidencias parciales', () => {
  assert.deepEqual(ids(buscarTareas(tareas, 'cuad')), ['3']);
  assert.deepEqual(ids(buscarTareas(tareas, 'ar')), ['1', '2', '3']);
});

test('ignora mayusculas', () => {
  assert.deepEqual(ids(buscarTareas(tareas, 'ESTUDIAR')), ['2']);
  assert.deepEqual(ids(buscarTareas(tareas, 'git flow')), ['1']);
});

test('ignora acentos en la busqueda y en las tareas', () => {
  assert.deepEqual(ids(buscarTareas(tareas, 'exposicion')), ['1']);
  assert.deepEqual(ids(buscarTareas(tareas, 'matemáticas')), ['2']);
  assert.deepEqual(ids(buscarTareas(tareas, 'MATEMATICAS')), ['2']);
});

test('tambien busca en la descripcion', () => {
  assert.deepEqual(ids(buscarTareas(tareas, 'papeleria')), ['3']);
});

test('no mezcla el final del titulo con el inicio de la descripcion', () => {
  assert.deepEqual(buscarTareas(tareas, 'exposicion diapositivas'), []);
});

test('una busqueda vacia o con solo espacios devuelve todas las tareas', () => {
  assert.deepEqual(ids(buscarTareas(tareas, '')), ['1', '2', '3']);
  assert.deepEqual(ids(buscarTareas(tareas, '   ')), ['1', '2', '3']);
  assert.notEqual(buscarTareas(tareas, ''), tareas);
});

test('devuelve una lista vacia si nada coincide', () => {
  assert.deepEqual(buscarTareas(tareas, 'biologia'), []);
});

test('no modifica las tareas originales', () => {
  const copia = structuredClone(tareas);

  buscarTareas(tareas, 'exposicion');

  assert.deepEqual(tareas, copia);
});

test('funciona con tareas sin descripcion guardada', () => {
  assert.deepEqual(ids(buscarTareas([{ id: 'x', titulo: 'Leer' }], 'leer')), ['x']);
});

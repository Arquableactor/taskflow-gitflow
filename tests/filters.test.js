import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FILTROS, filtrarTareas } from '../js/filters.js';

const tareas = [
  { id: '1', titulo: 'Comprar cuadernos', completada: false },
  { id: '2', titulo: 'Leer capitulo 4', completada: true },
  { id: '3', titulo: 'Practicar Git', completada: false }
];

const ids = (lista) => lista.map((tarea) => tarea.id);

test('el filtro todas devuelve todas las tareas en el mismo orden', () => {
  assert.deepEqual(ids(filtrarTareas(tareas, FILTROS.TODAS)), ['1', '2', '3']);
});

test('el filtro pendientes devuelve solo las no completadas', () => {
  assert.deepEqual(ids(filtrarTareas(tareas, FILTROS.PENDIENTES)), ['1', '3']);
});

test('el filtro completadas devuelve solo las completadas', () => {
  assert.deepEqual(ids(filtrarTareas(tareas, FILTROS.COMPLETADAS)), ['2']);
});

test('un filtro desconocido se comporta como todas', () => {
  assert.deepEqual(ids(filtrarTareas(tareas, 'otro')), ['1', '2', '3']);
});

test('devuelve un arreglo nuevo sin modificar el original', () => {
  const copia = structuredClone(tareas);
  const resultado = filtrarTareas(tareas, FILTROS.TODAS);

  assert.notEqual(resultado, tareas);
  assert.deepEqual(tareas, copia);
});

test('una lista vacia da resultados vacios', () => {
  for (const filtro of Object.values(FILTROS)) {
    assert.deepEqual(filtrarTareas([], filtro), []);
  }
});

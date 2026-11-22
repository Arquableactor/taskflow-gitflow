import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRIORIDADES, PRIORIDAD_POR_DEFECTO, normalizarPrioridad, ordenarPorPrioridad } from '../js/priority.js';

const ids = (lista) => lista.map((tarea) => tarea.id);

test('ordena de prioridad alta a baja', () => {
  const tareas = [
    { id: 'b', prioridad: 'baja' },
    { id: 'a', prioridad: 'alta' },
    { id: 'm', prioridad: 'media' }
  ];

  assert.deepEqual(ids(ordenarPorPrioridad(tareas)), ['a', 'm', 'b']);
});

test('mantiene el orden original entre tareas con igual prioridad', () => {
  const tareas = [
    { id: 'm1', prioridad: 'media' },
    { id: 'a1', prioridad: 'alta' },
    { id: 'm2', prioridad: 'media' },
    { id: 'a2', prioridad: 'alta' },
    { id: 'm3', prioridad: 'media' }
  ];

  assert.deepEqual(ids(ordenarPorPrioridad(tareas)), ['a1', 'a2', 'm1', 'm2', 'm3']);
});

test('la prioridad por defecto es media', () => {
  assert.equal(PRIORIDAD_POR_DEFECTO, PRIORIDADES.MEDIA);
  assert.equal(normalizarPrioridad(undefined), 'media');
  assert.equal(normalizarPrioridad('urgente'), 'media');
  assert.equal(normalizarPrioridad('toString'), 'media');
  assert.equal(normalizarPrioridad('alta'), 'alta');
});

test('una tarea sin prioridad se ordena como media', () => {
  const tareas = [
    { id: 'baja', prioridad: 'baja' },
    { id: 'vieja' },
    { id: 'alta', prioridad: 'alta' }
  ];

  assert.deepEqual(ids(ordenarPorPrioridad(tareas)), ['alta', 'vieja', 'baja']);
});

test('no modifica el arreglo original', () => {
  const tareas = [
    { id: '1', prioridad: 'baja' },
    { id: '2', prioridad: 'alta' }
  ];
  const copia = structuredClone(tareas);

  const resultado = ordenarPorPrioridad(tareas);

  assert.notEqual(resultado, tareas);
  assert.deepEqual(tareas, copia);
});

test('una lista vacia devuelve una lista vacia', () => {
  assert.deepEqual(ordenarPorPrioridad([]), []);
});

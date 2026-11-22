import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resumirTareas } from '../js/dashboard.js';

test('el resumen de una lista vacia es todo cero', () => {
  assert.deepEqual(resumirTareas([]), { total: 0, pendientes: 0, completadas: 0 });
});

test('cuenta total, pendientes y completadas', () => {
  const tareas = [
    { id: '1', completada: false },
    { id: '2', completada: true },
    { id: '3', completada: false },
    { id: '4', completada: true },
    { id: '5', completada: false }
  ];

  assert.deepEqual(resumirTareas(tareas), { total: 5, pendientes: 3, completadas: 2 });
});

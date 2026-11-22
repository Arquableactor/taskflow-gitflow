import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contarCompletadas, contarPendientes, porcentajeAvance, resumirTareas } from '../js/dashboard.js';

// Crea una lista con la cantidad indicada de tareas completadas y pendientes
function crearTareas(completadas, pendientes) {
  return [
    ...Array.from({ length: completadas }, (_, i) => ({ id: `c${i}`, completada: true })),
    ...Array.from({ length: pendientes }, (_, i) => ({ id: `p${i}`, completada: false }))
  ];
}

test('una lista vacia no tiene pendientes, completadas ni avance', () => {
  assert.equal(contarPendientes([]), 0);
  assert.equal(contarCompletadas([]), 0);
  assert.equal(porcentajeAvance([]), 0);
  assert.deepEqual(resumirTareas([]), { total: 0, pendientes: 0, completadas: 0, porcentaje: 0 });
});

test('con todas las tareas completadas el avance es 100', () => {
  const tareas = crearTareas(4, 0);

  assert.equal(contarPendientes(tareas), 0);
  assert.equal(contarCompletadas(tareas), 4);
  assert.equal(porcentajeAvance(tareas), 100);
});

test('sin tareas completadas el avance es 0', () => {
  const tareas = crearTareas(0, 3);

  assert.equal(contarPendientes(tareas), 3);
  assert.equal(porcentajeAvance(tareas), 0);
});

test('cuenta una mezcla de estados', () => {
  const tareas = [
    { id: '1', completada: false },
    { id: '2', completada: true },
    { id: '3', completada: false },
    { id: '4', completada: true },
    { id: '5', completada: false }
  ];

  assert.equal(contarPendientes(tareas), 3);
  assert.equal(contarCompletadas(tareas), 2);
  assert.equal(porcentajeAvance(tareas), 40);
  assert.deepEqual(resumirTareas(tareas), { total: 5, pendientes: 3, completadas: 2, porcentaje: 40 });
});

test('el porcentaje es un entero redondeado hacia abajo', () => {
  assert.equal(porcentajeAvance(crearTareas(1, 2)), 33);
  assert.equal(porcentajeAvance(crearTareas(2, 1)), 66);
});

test('no muestra 100 mientras quede alguna tarea pendiente', () => {
  assert.equal(porcentajeAvance(crearTareas(199, 1)), 99);
});

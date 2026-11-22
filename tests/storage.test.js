import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CLAVE_TAREAS, cargarTareas, guardarTareas } from '../js/storage.js';

// Imita la API de localStorage para probar sin navegador
function crearAlmacenFalso(inicial = {}) {
  const datos = new Map(Object.entries(inicial));
  return {
    getItem: (clave) => (datos.has(clave) ? datos.get(clave) : null),
    setItem: (clave, valor) => datos.set(clave, String(valor))
  };
}

test('devuelve una lista vacia si no hay tareas guardadas', () => {
  assert.deepEqual(cargarTareas(crearAlmacenFalso()), []);
});

test('guarda y recupera las mismas tareas', () => {
  const almacen = crearAlmacenFalso();
  const tareas = [
    { id: '1', titulo: 'Estudiar Git Flow', descripcion: '', fecha: '2026-11-25', completada: false },
    { id: '2', titulo: 'Entregar tarea', descripcion: 'Programacion III', fecha: '', completada: true }
  ];

  guardarTareas(tareas, almacen);

  assert.deepEqual(cargarTareas(almacen), tareas);
});

test('guarda las tareas como JSON bajo la clave del proyecto', () => {
  const almacen = crearAlmacenFalso();

  guardarTareas([{ id: '1' }], almacen);

  assert.equal(almacen.getItem(CLAVE_TAREAS), '[{"id":"1"}]');
});

test('devuelve una lista vacia si los datos guardados estan corruptos', () => {
  const almacen = crearAlmacenFalso({ [CLAVE_TAREAS]: '{esto no es json' });

  assert.deepEqual(cargarTareas(almacen), []);
});

test('devuelve una lista vacia si lo guardado no es un arreglo', () => {
  const almacen = crearAlmacenFalso({ [CLAVE_TAREAS]: '{"id":"1"}' });

  assert.deepEqual(cargarTareas(almacen), []);
});

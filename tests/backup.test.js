import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { exportarJSON, importarJSON } from '../js/backup.js';

const tareas = [
  { id: 'a1', titulo: 'Preparar exposición', descripcion: 'Git Flow', fecha: '2026-11-28', prioridad: 'alta', completada: false },
  { id: 'b2', titulo: 'Comprar cuaderno', descripcion: '', fecha: '', prioridad: 'baja', completada: true }
];

const valida = { id: 'ok', titulo: 'Tarea valida', descripcion: '', fecha: '', prioridad: 'media', completada: false };

test('exporta un JSON valido con todas las tareas', () => {
  const texto = exportarJSON(tareas);

  assert.deepEqual(JSON.parse(texto), tareas);
});

test('restaura exactamente las tareas exportadas', () => {
  const resultado = importarJSON(exportarJSON(tareas));

  assert.deepEqual(resultado, { tareas, descartadas: 0 });
});

test('rechaza un JSON malformado', () => {
  assert.throws(() => importarJSON('[{"id": "a1",'), { message: 'El archivo no contiene JSON válido.' });
  assert.throws(() => importarJSON(''), { message: 'El archivo no contiene JSON válido.' });
});

test('rechaza un JSON que no es una lista de tareas', () => {
  for (const texto of ['{"tareas": []}', '"hola"', '42', 'null']) {
    assert.throws(() => importarJSON(texto), { message: 'El archivo no tiene una lista de tareas.' });
  }
});

test('descarta las entradas invalidas y cuenta cuantas fueron', () => {
  const archivo = [
    valida,
    null,
    'texto',
    [],
    { titulo: 'Sin id' },
    { id: '', titulo: 'Id vacio' },
    { id: 'n1', titulo: 123 },
    { id: 'n2', titulo: '   ' },
    { id: 'n3', titulo: 'Fecha imposible', fecha: '2026-02-30' },
    { id: 'n4', titulo: 'Descripcion rara', descripcion: { texto: 'x' } },
    { id: 'n5', titulo: 'a'.repeat(101) }
  ];

  const resultado = importarJSON(JSON.stringify(archivo));

  assert.deepEqual(resultado.tareas, [valida]);
  assert.equal(resultado.descartadas, 10);
});

test('evita identificadores duplicados conservando la primera tarea', () => {
  const archivo = [valida, { ...valida, titulo: 'Copia con el mismo id' }];

  const resultado = importarJSON(JSON.stringify(archivo));

  assert.deepEqual(resultado.tareas, [valida]);
  assert.equal(resultado.descartadas, 1);
});

test('conserva solo los campos del CRUD y normaliza sus valores', () => {
  const archivo = [{ id: 'x', titulo: '  Leer  ', prioridad: 'urgente', completada: 'si', extra: 'se ignora' }];

  const { tareas: importadas } = importarJSON(JSON.stringify(archivo));

  assert.deepEqual(importadas, [
    { id: 'x', titulo: 'Leer', descripcion: '', fecha: '', prioridad: 'media', completada: false }
  ]);
});

test('rechaza un archivo sin ninguna tarea valida para no borrar los datos guardados', () => {
  assert.throws(() => importarJSON('[]'), { message: 'El archivo no contiene tareas válidas.' });
  assert.throws(() => importarJSON('[{"titulo": "sin id"}]'), { message: 'El archivo no contiene tareas válidas.' });
});

test('el modulo no usa eval ni Function para leer el archivo', () => {
  const codigo = readFileSync(new URL('../js/backup.js', import.meta.url), 'utf8');

  assert.ok(!/\beval\s*\(/.test(codigo));
  assert.ok(!/new Function/.test(codigo));
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_DESCRIPCION, MAX_TITULO, validarTarea } from '../js/validation.js';

test('acepta una tarea que solo tiene titulo', () => {
  const resultado = validarTarea({ titulo: 'Estudiar', descripcion: '', fecha: '' });

  assert.equal(resultado.valida, true);
  assert.deepEqual(resultado.errores, {});
  assert.deepEqual(resultado.datos, { titulo: 'Estudiar', descripcion: '', fecha: '' });
});

test('quita los espacios al inicio y al final', () => {
  const { datos } = validarTarea({ titulo: '  Estudiar  ', descripcion: ' Capitulo 3 ', fecha: '' });

  assert.equal(datos.titulo, 'Estudiar');
  assert.equal(datos.descripcion, 'Capitulo 3');
});

test('rechaza un titulo vacio o con solo espacios', () => {
  assert.equal(validarTarea({ titulo: '' }).errores.titulo, 'El título es obligatorio.');
  assert.equal(validarTarea({ titulo: '    ' }).errores.titulo, 'El título es obligatorio.');
  assert.equal(validarTarea({}).valida, false);
});

test('respeta el largo maximo del titulo', () => {
  assert.equal(validarTarea({ titulo: 'a'.repeat(MAX_TITULO) }).valida, true);
  assert.equal(validarTarea({ titulo: 'a'.repeat(MAX_TITULO + 1) }).valida, false);
});

test('rechaza una descripcion demasiado larga', () => {
  const resultado = validarTarea({ titulo: 'Leer', descripcion: 'a'.repeat(MAX_DESCRIPCION + 1) });

  assert.equal(resultado.valida, false);
  assert.ok(resultado.errores.descripcion);
});

test('acepta una fecha valida y rechaza una que no existe', () => {
  assert.equal(validarTarea({ titulo: 'Leer', fecha: '2026-11-25' }).valida, true);
  assert.equal(validarTarea({ titulo: 'Leer', fecha: '2026-02-30' }).errores.fecha, 'La fecha no es válida.');
});

test('reporta todos los errores a la vez', () => {
  const { errores } = validarTarea({ titulo: '', descripcion: 'a'.repeat(MAX_DESCRIPCION + 1), fecha: 'ayer' });

  assert.deepEqual(Object.keys(errores).sort(), ['descripcion', 'fecha', 'titulo']);
});

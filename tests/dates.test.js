import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esFechaValida, formatearFecha } from '../js/dates.js';

test('acepta fechas reales en formato AAAA-MM-DD', () => {
  assert.equal(esFechaValida('2026-11-25'), true);
  assert.equal(esFechaValida('2028-02-29'), true); // 2028 es bisiesto
});

test('rechaza fechas que no existen', () => {
  assert.equal(esFechaValida('2026-02-29'), false);
  assert.equal(esFechaValida('2026-02-30'), false);
  assert.equal(esFechaValida('2026-13-01'), false);
  assert.equal(esFechaValida('2026-04-31'), false);
});

test('rechaza textos con otro formato', () => {
  assert.equal(esFechaValida(''), false);
  assert.equal(esFechaValida('25/11/2026'), false);
  assert.equal(esFechaValida('2026-1-5'), false);
  assert.equal(esFechaValida('manana'), false);
});

test('formatea la fecha de forma legible', () => {
  assert.equal(formatearFecha('2026-11-25'), '25 nov 2026');
  assert.equal(formatearFecha('2026-05-03'), '3 may 2026');
});

test('no retrocede un dia por la zona horaria', () => {
  // Con new Date('2026-01-01') en RD se mostraria 31 dic 2025
  assert.equal(formatearFecha('2026-01-01'), '1 ene 2026');
});

test('devuelve texto vacio si no hay fecha o no es valida', () => {
  assert.equal(formatearFecha(''), '');
  assert.equal(formatearFecha('2026-02-30'), '');
});

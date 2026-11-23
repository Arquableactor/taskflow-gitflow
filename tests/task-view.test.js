import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  MENSAJE_SIN_TAREAS,
  crearFilaTarea,
  escaparHTML,
  mensajeListaVacia,
  renderizarListado
} from '../js/task-view.js';

const tarea = {
  id: 'abc-1',
  titulo: 'Estudiar Git Flow',
  descripcion: 'Leer sobre ramas feature',
  fecha: '2026-11-25',
  completada: false
};

test('escapa los caracteres especiales de HTML', () => {
  assert.equal(escaparHTML('<b>"Hola" & \'adios\'</b>'), '&lt;b&gt;&quot;Hola&quot; &amp; &#39;adios&#39;&lt;/b&gt;');
});

test('la fila muestra titulo, descripcion, fecha legible e id', () => {
  const html = crearFilaTarea(tarea);

  assert.ok(html.includes('data-id="abc-1"'));
  assert.ok(html.includes('>Estudiar Git Flow</p>'));
  assert.ok(html.includes('>Leer sobre ramas feature</p>'));
  assert.ok(html.includes('<time class="tarea__fecha" datetime="2026-11-25">25 nov 2026</time>'));
});

test('la fila muestra la etiqueta de prioridad', () => {
  const html = crearFilaTarea({ ...tarea, prioridad: 'alta' });

  assert.ok(html.includes('<span class="prioridad prioridad--alta">Prioridad alta</span>'));
});

test('una tarea sin prioridad o con un valor invalido se muestra como media', () => {
  assert.ok(crearFilaTarea(tarea).includes('prioridad--media">Prioridad media<'));
  assert.ok(crearFilaTarea({ ...tarea, prioridad: '"><script>' }).includes('prioridad--media">Prioridad media<'));
});

test('la fila omite descripcion y fecha cuando estan vacias', () => {
  const html = crearFilaTarea({ ...tarea, descripcion: '', fecha: '' });

  assert.ok(!html.includes('tarea__descripcion'));
  assert.ok(!html.includes('<time'));
});

test('una tarea pendiente no aparece marcada', () => {
  const html = crearFilaTarea(tarea);

  assert.ok(html.includes('class="tarea"'));
  assert.ok(!html.includes(' checked'));
});

test('una tarea completada lleva la clase y la casilla marcada', () => {
  const html = crearFilaTarea({ ...tarea, completada: true });

  assert.ok(html.includes('class="tarea tarea--completada"'));
  assert.ok(html.includes(' checked'));
});

test('el texto del usuario no se interpreta como HTML', () => {
  const html = crearFilaTarea({ ...tarea, titulo: '<img src=x onerror=alert(1)>', descripcion: '<script>x</script>' });

  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
});

test('el listado muestra una fila por tarea', () => {
  const html = renderizarListado([tarea, { ...tarea, id: 'abc-2' }]);

  assert.equal(html.match(/<li class="tarea/g).length, 2);
  assert.ok(!html.includes(MENSAJE_SIN_TAREAS));
});

test('el listado vacio muestra el mensaje de sin tareas', () => {
  assert.equal(renderizarListado([]), `<li class="lista-vacia">${MENSAJE_SIN_TAREAS}</li>`);
});

test('sin tareas guardadas invita a crear la primera', () => {
  assert.equal(
    mensajeListaVacia({ total: 0, enFiltro: 0, filtro: 'todas', busqueda: '' }),
    'Todavía no tienes tareas. Agrega la primera con el formulario.'
  );
  // Aunque haya filtro o busqueda activos, lo importante es que no existen tareas
  assert.equal(mensajeListaVacia({ total: 0, enFiltro: 0, filtro: 'pendientes', busqueda: 'git' }), MENSAJE_SIN_TAREAS);
});

test('un filtro sin resultados lo indica segun el filtro', () => {
  assert.equal(mensajeListaVacia({ total: 3, enFiltro: 0, filtro: 'pendientes', busqueda: '' }), 'No hay tareas pendientes.');
  assert.equal(mensajeListaVacia({ total: 3, enFiltro: 0, filtro: 'completadas', busqueda: '' }), 'No hay tareas completadas.');
});

test('si el filtro ya esta vacio, se informa el filtro y no la busqueda', () => {
  assert.equal(mensajeListaVacia({ total: 3, enFiltro: 0, filtro: 'completadas', busqueda: 'git' }), 'No hay tareas completadas.');
});

test('una busqueda sin resultados muestra el texto buscado', () => {
  assert.equal(
    mensajeListaVacia({ total: 3, enFiltro: 2, filtro: 'todas', busqueda: '  biologia ' }),
    'Ninguna tarea coincide con «biologia».'
  );
});

test('el listado vacio muestra el mensaje recibido escapado', () => {
  const mensaje = mensajeListaVacia({ total: 1, enFiltro: 1, filtro: 'todas', busqueda: '<img src=x>' });

  assert.equal(renderizarListado([], mensaje), '<li class="lista-vacia">Ninguna tarea coincide con «&lt;img src=x&gt;».</li>');
});

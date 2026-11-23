# TaskFlow

Aplicación web para gestionar tareas, hecha con HTML, CSS y JavaScript vanilla. Las tareas se guardan en el navegador con `localStorage`, sin servidor de datos ni dependencias externas.

## Funcionalidades

- **Crear tareas** con título obligatorio, descripción opcional, fecha opcional y prioridad (alta, media o baja).
- **Listar** las tareas ordenadas por prioridad, con la fecha en formato legible (por ejemplo, `25 nov 2026`).
- **Editar** una tarea desde el mismo formulario.
- **Eliminar** una tarea, con confirmación previa.
- **Completar** una tarea o volver a marcarla como pendiente.
- **Filtrar** por todas, pendientes o completadas.
- **Buscar** por título o descripción, sin distinguir mayúsculas ni acentos.
- **Resumen** con el total, las pendientes, las completadas y el porcentaje de avance.
- **Exportar e importar** las tareas en un archivo JSON, con validación del archivo y confirmación antes de reemplazar los datos.
- **Mensajes claros** cuando la lista está vacía: sin tareas, filtro sin resultados o búsqueda sin resultados.
- **Validación** del formulario: título obligatorio, límites de largo y fechas reales.

## Tecnologías

| Uso | Tecnología |
|---|---|
| Interfaz | HTML5 y CSS3 |
| Lógica | JavaScript vanilla con módulos ES |
| Almacenamiento | `localStorage` del navegador |
| Servidor de desarrollo | Node.js con el módulo nativo `node:http` |
| Pruebas | `node:test` y `node:assert`, incluidos en Node.js |
| Control de versiones | Git, GitHub y GitHub CLI, con Git Flow |

## Requisitos

- Node.js 20 o superior.
- No hay dependencias que instalar: no hace falta `npm install`.

## Ejecutar el proyecto

```bash
npm run dev
```

Abre `http://localhost:3000` en el navegador. Para usar otro puerto: `PORT=3001 npm run dev`.

La aplicación usa módulos ES, por eso debe abrirse desde el servidor y no con doble clic sobre `index.html` (`file://`).

## Ejecutar las pruebas

```bash
npm test
```

Ejecuta las 70 pruebas de los módulos de `js/` (almacenamiento, validación, fechas, filtros, resumen, vista, prioridad, búsqueda y respaldo).

## Estructura de carpetas

```text
taskflow-gitflow/
├── index.html            # Página única de la aplicación
├── server.js             # Servidor HTTP de desarrollo (npm run dev)
├── package.json          # Scripts dev y test, sin dependencias
├── css/
│   └── styles.css        # Estilos organizados por secciones
├── js/
│   ├── app.js            # Conecta la interfaz con los módulos
│   ├── backup.js         # Exportar e importar JSON
│   ├── dashboard.js      # Conteos y porcentaje de avance
│   ├── dates.js          # Validación y formato de fechas
│   ├── filters.js        # Filtros por estado
│   ├── priority.js       # Prioridades y orden del listado
│   ├── search.js         # Búsqueda sin mayúsculas ni acentos
│   ├── storage.js        # Lectura y escritura en localStorage
│   ├── task-view.js      # HTML del listado y mensajes de lista vacía
│   └── validation.js     # Validación del formulario
├── tests/                # Una prueba por módulo (*.test.js)
├── docs/
│   └── GIT_FLOW.md       # Flujo de ramas y Pull Requests del proyecto
├── LICENSE
└── README.md
```

## Ramas

| Rama | Función |
|---|---|
| `main` | Producción estable. Solo recibe cambios desde `qa` mediante Pull Request. |
| `develop` | Integración de funcionalidades. Recibe las ramas `feature/` y `hotfix/`. |
| `qa` | Validación antes de producción. Recibe cambios desde `develop`. |
| `feature/task-priority` | Prioridad de tareas. |
| `feature/task-search` | Búsqueda de tareas. |
| `feature/task-counter` | Resumen de progreso. |
| `feature/export-import` | Exportar e importar JSON. |
| `hotfix/empty-state` | Corrección del estado vacío y del formulario. |

## Flujo Git Flow

Cada cambio recorre tres Pull Requests, siempre fusionados con merge commit:

```text
feature/task-priority ──┐
feature/task-search ────┤
feature/task-counter ───┼──PR──► develop ──PR──► qa ──PR──► main
feature/export-import ──┤
hotfix/empty-state ─────┘
```

El detalle de cada rama, las reglas de integración y la tabla de los 15 Pull Requests están en [docs/GIT_FLOW.md](docs/GIT_FLOW.md).

## Licencia

[MIT](LICENSE)

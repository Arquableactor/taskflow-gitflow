# Git Flow en TaskFlow

Este documento explica cómo se organizaron las ramas de TaskFlow, cómo se integró cada cambio y qué Pull Requests se hicieron.

## Qué es Git Flow

Git Flow es una forma de organizar las ramas de un repositorio. Separa el código en producción del código en desarrollo y define por dónde pasa cada cambio antes de publicarse. Así cada etapa (desarrollo, validación y producción) tiene su propia rama, y el historial muestra cuándo y cómo entró cada funcionalidad.

## Ramas y su función

### `main`

Código en producción. Solo recibe cambios desde `qa` mediante Pull Request, y siempre contiene una versión estable de la aplicación.

### `develop`

Rama de integración, equivalente a la rama `dev`/`developer` del enunciado académico. Las ramas de trabajo nacen de `develop` y vuelven a ella cuando su cambio está terminado.

### `qa`

Rama de validación entre `develop` y `main`. Cada mejora pasa por `qa` antes de llegar a producción; ahí se vuelven a ejecutar las pruebas sobre el código integrado.

### `feature/`

Una rama por funcionalidad nueva. Nace de `develop`, contiene solo el trabajo de esa funcionalidad y se integra en `develop` mediante Pull Request. Ramas usadas: `feature/task-priority`, `feature/task-search`, `feature/task-counter` y `feature/export-import`.

### `hotfix/`

Rama para corregir un error. **En Git Flow clásico, un hotfix de producción nace de `main`** y se fusiona directamente en `main` y en `develop`, para corregir producción sin esperar al siguiente ciclo.

En este proyecto, `hotfix/empty-state` es una **adaptación académica**: nace de `develop` y recorre `develop → qa → main` como las funcionalidades, para que el quinto ciclo también tenga sus tres Pull Requests.

### `release/`

En Git Flow clásico, una rama `release/` se crea desde `develop` para preparar una versión: se estabiliza, se corrigen detalles y luego se fusiona en `main` y en `develop`.

En este proyecto **no se crearon ramas `release/`**. Su papel lo cumple la rama permanente `qa`: recibe lo integrado en `develop`, se valida y después pasa a `main`. Los títulos de los Pull Requests hacia `qa` y `main` usan el prefijo `release:` porque representan esa promoción de versión.

## Política de integración

- Después de la línea base, **ningún cambio se integró en `main`, `develop` o `qa` con `git merge` local**. Toda integración se hizo con un Pull Request en GitHub.
- Cada Pull Request se fusionó con **merge commit** (`gh pr merge NUMERO --merge`). No se usó squash, rebase ni push forzado.
- No se borró ninguna rama después de fusionarla.
- No se hizo back-merge de `main` hacia `develop`.
- Antes de cada Pull Request hacia `qa` o `main` se actualizó la rama de origen y se ejecutó `npm test`.
- Un ciclo no empezaba hasta que el anterior había llegado a `main`.

## Por qué merge commits

Un merge commit tiene dos padres: el último commit de la rama de destino y el último de la rama que se integra. Por eso:

- El historial muestra exactamente qué entró con cada Pull Request (`Merge pull request #N from ...`).
- Los commits originales de cada rama se conservan con sus hashes; no se reescriben como con rebase ni se comprimen como con squash.
- `git log --graph` deja ver el recorrido `feature → develop → qa → main` de cada mejora.

## Convenciones de mensajes de commit

Se usa el formato `tipo: descripcion`, en español y sin acentos:

| Tipo | Uso | Ejemplo en este repositorio |
|---|---|---|
| `chore:` | Configuración del proyecto | `chore: inicializar proyecto TaskFlow` |
| `feat:` | Funcionalidad nueva | `feat: agregar prioridades a las tareas` |
| `fix:` | Corrección de un error | `fix: corregir estado vacio de tareas` |
| `docs:` | Solo documentación | `docs: documentar Git Flow y tabla de pull requests` |

Los Pull Requests hacia `qa` y `main` usan el prefijo `release:` en el título, por ejemplo `release: validar busqueda de tareas en qa`.

## Línea base

Antes de crear `develop` y `qa` se construyó la primera versión del CRUD directamente en `main`. Fue una etapa de arranque (bootstrap), sin Pull Requests, porque todavía no existían las ramas de integración:

| Commit | Mensaje |
|---|---|
| `848bb59` | Initial commit (creado por GitHub con el README vacío) |
| `eeefeb7` | chore: inicializar proyecto TaskFlow |
| `a6731dc` | feat: agregar almacenamiento de tareas en localStorage |
| `30c507a` | feat: agregar validacion y manejo de fechas |
| `cb2dfa5` | feat: agregar filtros y resumen de tareas |
| `716d36c` | feat: agregar vista del listado de tareas |
| `767251a` | feat: agregar interfaz CRUD de TaskFlow |

Después se crearon `develop` y `qa` desde `main`, las tres apuntando al commit `767251a`. Desde ese momento todo cambio pasó por Pull Requests.

## Los cinco ciclos

Cada ciclo partió de `develop` actualizada y terminó en `main` antes de empezar el siguiente.

| Ciclo | Rama | Commit de trabajo | Cambio | Pull Requests |
|---|---|---|---|---|
| 1 | `feature/task-priority` | `461ac6b` | Prioridad alta, media o baja; listado ordenado por prioridad | #1, #2, #3 |
| 2 | `feature/task-search` | `760a51e` | Buscador sin distinguir mayúsculas ni acentos | #4, #5, #6 |
| 3 | `feature/task-counter` | `f5eb16d` | Conteos y porcentaje de avance en el resumen | #7, #8, #9 |
| 4 | `feature/export-import` | `1d15c80` | Exportar e importar las tareas en JSON | #10, #11, #12 |
| 5 | `hotfix/empty-state` | `21e5edf` | Mensajes de lista vacía y formulario listo tras guardar | #13, #14, #15 |

En cada ciclo:

1. Se actualizó `develop` y se creó la rama de trabajo.
2. Se desarrolló el cambio con sus pruebas y se hizo el commit.
3. **PR rama de trabajo → `develop`**, fusionado con merge commit.
4. **PR `develop` → `qa`**, fusionado después de ejecutar las pruebas sobre `develop`.
5. **PR `qa` → `main`**, fusionado después de ejecutar las pruebas sobre `qa`.

## Pull Requests

Datos consultados en GitHub con `gh pr list --state all`.

| PR | Título | Origen | Destino | Estado | Merge commit |
|---|---|---|---|---|---|
| [#1](https://github.com/Arquableactor/taskflow-gitflow/pull/1) | feat: agregar prioridades a las tareas | `feature/task-priority` | `develop` | Fusionado | `2c4950c` |
| [#2](https://github.com/Arquableactor/taskflow-gitflow/pull/2) | release: validar prioridades de tareas en qa | `develop` | `qa` | Fusionado | `e9ef035` |
| [#3](https://github.com/Arquableactor/taskflow-gitflow/pull/3) | release: publicar prioridades de tareas en main | `qa` | `main` | Fusionado | `a623e6b` |
| [#4](https://github.com/Arquableactor/taskflow-gitflow/pull/4) | feat: agregar busqueda de tareas | `feature/task-search` | `develop` | Fusionado | `4bde449` |
| [#5](https://github.com/Arquableactor/taskflow-gitflow/pull/5) | release: validar busqueda de tareas en qa | `develop` | `qa` | Fusionado | `84e88e0` |
| [#6](https://github.com/Arquableactor/taskflow-gitflow/pull/6) | release: publicar busqueda de tareas en main | `qa` | `main` | Fusionado | `2be9b73` |
| [#7](https://github.com/Arquableactor/taskflow-gitflow/pull/7) | feat: agregar resumen de progreso | `feature/task-counter` | `develop` | Fusionado | `4b43b6a` |
| [#8](https://github.com/Arquableactor/taskflow-gitflow/pull/8) | release: validar resumen de progreso en qa | `develop` | `qa` | Fusionado | `83fa01b` |
| [#9](https://github.com/Arquableactor/taskflow-gitflow/pull/9) | release: publicar resumen de progreso en main | `qa` | `main` | Fusionado | `4573c8b` |
| [#10](https://github.com/Arquableactor/taskflow-gitflow/pull/10) | feat: agregar exportacion e importacion JSON | `feature/export-import` | `develop` | Fusionado | `74ef006` |
| [#11](https://github.com/Arquableactor/taskflow-gitflow/pull/11) | release: validar exportacion e importacion JSON en qa | `develop` | `qa` | Fusionado | `34e704a` |
| [#12](https://github.com/Arquableactor/taskflow-gitflow/pull/12) | release: publicar exportacion e importacion JSON en main | `qa` | `main` | Fusionado | `cb855ed` |
| [#13](https://github.com/Arquableactor/taskflow-gitflow/pull/13) | fix: corregir estado vacio de tareas | `hotfix/empty-state` | `develop` | Fusionado | `3f00fce` |
| [#14](https://github.com/Arquableactor/taskflow-gitflow/pull/14) | release: validar correccion del estado vacio en qa | `develop` | `qa` | Fusionado | `4f35e8d` |
| [#15](https://github.com/Arquableactor/taskflow-gitflow/pull/15) | release: publicar correccion del estado vacio y documentacion en main | `qa` | `main` | Fusionado (ver nota) | Se genera al fusionar |

Resumen: 5 Pull Requests hacia `develop`, 5 hacia `qa` y 5 hacia `main`; 15 en total.

**Nota sobre el PR #15.** Este documento viaja dentro del PR #15, así que se escribió con ese PR todavía abierto. La tabla registra su estado final, porque el PR se fusionó justo después de incorporar este documento. Su merge commit se puede consultar en GitHub o con `git log --oneline -1 main`.

## Excepción documental en `qa`

La tabla anterior necesita el número real del último Pull Request, y ese número solo existe después de crearlo. Para no abrir un PR #16 solo para la documentación, se siguió este orden:

1. Se fusionaron el PR #13 (hacia `develop`) y el PR #14 (hacia `qa`).
2. Se creó el PR #15 de `qa` hacia `main`, sin fusionarlo.
3. Se consultaron en GitHub los números y datos reales de los 15 Pull Requests.
4. Se hizo **un único commit de documentación directamente en `qa`** (este archivo y el README) y se publicó, sin ningún merge local.
5. El PR #15, que estaba abierto, incorporó ese commit automáticamente.
6. Se volvieron a ejecutar las pruebas y se fusionó el PR #15 en GitHub.

Esta excepción es solo para documentación; ninguna funcionalidad se integró directamente en `qa`.

**Consecuencia:** como no se hace back-merge, `develop` no tiene este commit de documentación ni los merge commits que se crearon en `qa` y `main`. El código de la aplicación es el mismo en las tres ramas; la diferencia está solo en `README.md` y `docs/GIT_FLOW.md`.

## Cómo verificarlo

```bash
gh pr list --state all --limit 50 --json number,title,headRefName,baseRefName,state,mergedAt
git fetch origin
git branch -a
git log --all --graph --oneline --decorate
npm test
```

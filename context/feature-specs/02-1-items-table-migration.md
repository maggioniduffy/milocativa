# Sub-prompt: Migrar `items` a tablas separadas por subtipo

## Contexto (leer primero, en este orden)

1. `AGENTS.md`
2. `context/architecture-context.md`
3. `context/code-standards.md`
4. `context/ai-workflow-rules.md`
5. `context/progress-tracker.md`
6. Las migraciones existentes en `supabase/migrations/0001` a `0010` (especialmente la que crea `items`) — necesitás ver las columnas reales hoy antes de tocar nada.

## Situación actual

La tabla `items` ya está migrada y en uso como **tabla única con discriminador** `item_kind` (`estate` | `machinery` | `service` | `parking_spot`), con todas las columnas de todos los subtipos convivan en la misma fila (muchas quedan NULL según el tipo). Hay datos reales cargados (al menos "Torre Añelo" y sus unidades relacionadas).

## Objetivo

Pasar a un patrón de **herencia por tabla de clase** (class-table inheritance):

- `items` queda como tabla compartida, con **solo** las columnas comunes: `id`, `category_id`, `title`, `description`, `base_price`, `price_unit`, `status`, `item_kind` (se mantiene el discriminador — sirve para saber a qué tabla de subtipo hacer join sin adivinar).
- Nuevas tablas, cada una con `item_id` como FK única a `items.id` (relación 1:1) y solo sus columnas propias:
  - `estates` (`area`, `bedrooms`, `address`)
  - `machinery` (`brand`, `model`, `year`)
  - `services` (`service_type`, `duration`)
  - `parking_spots` (revisar en la migración actual qué columnas tiene hoy `parking_spot` y replicarlas acá — no están documentadas en el modelo de dominio original, así que confirmalas contra el schema real, no contra el mermaid)

## Alcance de este sub-prompt

1. Inspeccionar el schema real actual de `items` (vía las migraciones aplicadas, no asumas columnas).
2. Escribir una nueva migración (`0011_split_items_by_subtype.sql` o el número que corresponda) que:
   - Cree las 4 tablas nuevas con sus columnas y FK a `items.id` (`ON DELETE CASCADE`).
   - Migre los datos existentes: para cada fila de `items`, insertar en la tabla de subtipo correspondiente según `item_kind`, tomando los valores de las columnas viejas.
   - Elimine de `items` las columnas que quedaron redundantes (las que ahora viven en las tablas de subtipo).
   - Replique en las tablas nuevas el mismo patrón de RLS y grants que ya existe para `items` (lectura pública para listings publicados, escritura solo admin) — revisá `architecture-context.md` para el patrón exacto de policies usado.
3. Regenerar/actualizar los tipos de TypeScript que dependan del schema de Supabase (si el proyecto los genera vía CLI, correlo; si son manuales, actualizalos).
4. Buscar en el código (`grep`) usos de las columnas movidas (ej. referencias a `items.area`, `items.brand`, etc.) y listarlos en tu resumen final — **no hace falta arreglarlos en este sub-prompt** (el panel admin que viene después es el primer consumidor real), pero si encontrás algo que se rompería en build, avisá explícitamente.
5. Actualizar `context/architecture-context.md` en la sección que describe el schema de `items`, para que refleje el nuevo modelo (tabla compartida + subtipos).
6. Actualizar `context/progress-tracker.md`: mover esta migración a completada y anotar el nuevo conteo de tablas.

## No hacer

- No toques la estructura de `buildings`, `categories`, `availability`, `listings`, `rentals` ni `rental_items` — solo pueden requerir revisión de sus FKs a `items.id`, que debería seguir siendo válida sin cambios porque `items.id` no se mueve.
- No construyas ninguna UI en este sub-prompt (eso es el sub-prompt 2).
- No borres datos sin haberlos migrado primero a la tabla de subtipo correspondiente — la migración de datos y el drop de columnas van en el mismo archivo pero el INSERT tiene que ejecutarse antes del DROP.
- No cambies el webhook de Clerk (`/api/webhooks/clerk`) — no toca `items`.

## Checklist de auto-verificación

- [ ] Las 4 tablas nuevas existen con FK 1:1 a `items.id` y RLS habilitado.
- [ ] Los datos que ya estaban en `items` (Torre Añelo y lo que corresponda) siguen accesibles, ahora repartidos entre `items` + su tabla de subtipo — verificado con una query real, no solo asumido.
- [ ] Las policies nuevas replican el mismo criterio admin/público que las existentes (comparalas explícitamente, no las reinventes).
- [ ] Los grants explícitos de Postgres están puestos en las tablas nuevas, igual que en las demás.
- [ ] `architecture-context.md` y `progress-tracker.md` quedaron actualizados.
- [ ] Diste la lista de archivos de código que quedan pendientes de actualizar por el cambio de schema (para el sub-prompt 2).

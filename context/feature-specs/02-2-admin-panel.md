# Sub-prompt: Panel Admin — Sección Listados (crear y publicar)

## Depende de

Sub-prompt 1 (`01-fase1-migracion-items-subtipo.md`) ya aplicado. Confirmá que las tablas `estates`, `machinery`, `services`, `parking_spots` existen antes de arrancar.

## Contexto (leer primero, en este orden)

1. `AGENTS.md`
2. `context/architecture-context.md` (ya actualizado con el nuevo schema)
3. `context/ui-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/progress-tracker.md`
7. `src/proxy.ts` (para ver cómo está gateado `/admin` hoy)

## Situación actual

`/admin` existe como ruta protegida por rol en `proxy.ts` pero sin contenido propio. El resto del panel (Inbox, Alquileres) todavía no se construye — este sub-prompt es **solo la sección Listados**.

## Objetivo

Que un admin pueda, desde `/admin`, crear un item nuevo (de cualquier subtipo), completar sus datos específicos, y publicarlo o dejarlo como borrador — sin tocar la base de datos a mano.

## Alcance de este sub-prompt

1. **Layout base de `/admin`**: rail de navegación a la izquierda (Inbox, Listados, Alquileres — los últimos dos como placeholders deshabilitados o "próximamente", ya que no se construyen en este sub-prompt) + área de contenido, según el patrón de `ui-context.md`.
2. **Vista de lista** (`/admin/listados` o la ruta que corresponda): tabla con todos los items existentes — título, categoría, `item_kind`, precio, estado de publicación. Datos reales desde Supabase, no placeholder.
3. **Formulario de creación/edición**:
   - Selección de subtipo (`estate` / `machinery` / `service` / `parking_spot`) que determina qué campos adicionales se muestran.
   - Campos comunes (título, descripción, precio, unidad de precio, categoría) + campos propios del subtipo elegido.
   - Al guardar: crea la fila en `items` y la fila correspondiente en la tabla de subtipo, en una sola operación (transacción o RPC — ver qué convención ya usa el proyecto en `architecture-context.md`).
   - Toggle de publicación que crea/actualiza la fila en `listings` (publicado/borrador, destacado si aplica).
4. Copy en español, viviendo en archivos de contenido/diccionario — no hardcodeado en los componentes, según `ui-context.md`.
5. Componentes de `shadcn/ui`, tokens de color y radios definidos en `ui-context.md` (nada de hex hardcodeado ni clases Tailwind crudas).
6. Responsive mobile-first según las reglas de `ui-context.md`.
7. Actualizar `context/progress-tracker.md`: marcar Listados del panel admin como implementado, y anotar qué queda (Inbox, Alquileres).

## No hacer

- No construyas Inbox ni Alquileres en este sub-prompt — solo Listados.
- No implementes todavía subida de imágenes a Supabase Storage si complica el alcance — dejá un campo de URL simple o un stub, y anotalo como pendiente en tu resumen final.
- No toques `/catalogo` ni `/catalogo/[id]` — siguen con datos placeholder por ahora, eso es un sub-prompt aparte.
- No agregues lógica de negocio de alquileres (`rentals`) — este sub-prompt es solo catálogo/listings.
- No relajes el chequeo de rol admin existente en `proxy.ts` ni las RLS policies para "simplificar" el formulario.

## Checklist de auto-verificación

- [ ] Un admin autenticado puede crear un item de cada uno de los 4 subtipos y verlo reflejado en la tabla de listado.
- [ ] Un usuario sin rol admin no puede acceder a `/admin/listados` (verificado, no asumido — probá con un usuario `user`).
- [ ] El toggle de publicación efectivamente cambia el estado en `listings`.
- [ ] Todo el copy visible está en español y viene de archivos de contenido, no hardcodeado.
- [ ] La UI respeta los tokens de color/tipografía/radios de `ui-context.md` — sin hex ni clases Tailwind crudas.
- [ ] Mobile-first: probado (o al menos revisado) a 360px sin overflow horizontal.
- [ ] `progress-tracker.md` actualizado.

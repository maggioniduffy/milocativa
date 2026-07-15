# Sub-prompt: Sheet de creación/edición de items en Listados

## Depende de

Sub-prompts 1 y 2 ya implementados. Este sub-prompt asume que:

- Las tablas de subtipo (`estates`, `machinery`, `services`, `parking_spots`) existen.
- La vista de lista de `/admin/listados` ya muestra items reales.
- La Server Action de guardado (creación atómica de `items` + subtipo, validación con `zod`, forward del JWT de Clerk) ya existe del sub-prompt 2.

Si al revisar el código alguna de estas tres cosas falta o quedó a medias, decilo en tu resumen final antes de seguir — no lo reconstruyas por tu cuenta sin avisar.

## Contexto (leer primero, en este orden)

1. `AGENTS.md`
2. `context/architecture-context.md`
3. `context/ui-context.md`
4. `context/code-standards.md`
5. El código ya implementado de `/admin/listados` (vista de lista + la Server Action existente) — leelo antes de escribir nada nuevo, para reusar tipos y validaciones ya definidas en vez de duplicarlos.

## Situación actual

La vista de lista de Listados existe y muestra items reales, pero no hay ningún elemento de UI para crear uno nuevo — falta el formulario en sí.

## Objetivo

Un botón "Nuevo item" en la vista de lista que abre un **sheet lateral** (panel deslizante, no modal centrado) con el formulario completo de creación. El mismo sheet se reusa para edición (abierto desde una fila existente de la tabla).

## Alcance de este sub-prompt

1. **Trigger**: botón "Nuevo item" (icono `Plus` de Lucide + texto) en la cabecera de la vista de lista de Listados, siguiendo los patrones de botón de `ui-context.md`.
2. **Sheet**: usar el componente `Sheet` de shadcn/ui, deslizando desde la derecha, `rounded-3xl` en el borde visible si aplica según el patrón de overlays de `ui-context.md`. Ancho suficiente para el formulario en desktop; full-width en mobile.
3. **Contenido del formulario, dentro del sheet**:
   - Selector de subtipo primero (`estate` / `machinery` / `service` / `parking_spot`) — al cambiar, el resto del formulario re-renderiza mostrando solo los campos correspondientes.
   - Campos comunes: título, descripción, categoría (select poblado desde `categories`), precio base, unidad de precio.
   - Campos específicos por subtipo (área/dormitorios/dirección para estate; marca/modelo/año para machinery; tipo de servicio/duración para service; los campos que definiste para parking_spot en el sub-prompt 1).
   - Toggle de publicación (borrador vs. publicado) al pie del form.
   - Botones de acción: "Guardar" (o "Publicar" si el toggle está activo) y "Cancelar" — cerrar el sheet sin perder cambios accidentalmente si hay campos tocados (confirmación simple si hay dirty state).
4. **Validación en cliente**: usar el mismo esquema de `zod` por subtipo que ya existe en la Server Action (importado, no reescrito) para dar feedback inline antes de enviar.
5. **Conexión con la Server Action existente**: el submit del form llama directamente a la Server Action ya implementada — no crear una nueva. Mostrar estado de carga en el botón de guardar mientras corre, y error legible si falla (usar lo que ya devuelve la action).
6. **Modo edición**: la misma sheet, pre-poblada, cuando se abre desde una fila de la tabla (click en la fila o un botón de "Editar" por fila) — reusar el mismo componente de formulario, solo cambia si hace `insert` o `update` (esto probablemente ya lo resuelve la Server Action existente si está bien diseñada; si no, marcalo como pendiente en el resumen).
7. Copy en español desde archivos de contenido, no hardcodeado.
8. Actualizar `context/progress-tracker.md`: marcar el form de creación/edición como completo.

## No hacer

- No reescribas la Server Action de guardado si ya funciona — conectate a ella. Si le falta algo puntual (ej. no soporta `update`, solo `insert`), extendela con el mínimo cambio necesario y decilo explícitamente en el resumen, no la reemplaces entera.
- No uses un modal centrado — el pedido específico es sheet lateral deslizante.
- No agregues subida de imágenes en este sub-prompt salvo que ya esté resuelta en otro lado — si hace falta un campo, dejalo como URL simple (ya estaba marcado como pendiente en el sub-prompt 2).
- No toques la vista de lista más allá de agregar el botón trigger y (si corresponde) la acción de "Editar" por fila.

## Checklist de auto-verificación

- [ ] El botón "Nuevo item" abre el sheet vacío y funcional.
- [ ] Cambiar el subtipo en el form re-renderiza los campos correctos sin perder los campos comunes ya completados.
- [ ] Guardar un item de cada subtipo funciona end-to-end (aparece en la lista después).
- [ ] Editar un item existente pre-completa el sheet correctamente y guarda los cambios (no crea un duplicado).
- [ ] Los errores de validación se muestran inline, en español, sin que el usuario tenga que adivinar qué campo falló.
- [ ] El sheet es usable en mobile (360px) sin overflow horizontal.
- [ ] `progress-tracker.md` actualizado.

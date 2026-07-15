-- Support for the admin panel's create/edit item form (first consumer of the
-- 0011 class-table-inheritance split).
--
-- 1) `save_item_with_subtype`: writes the `items` row and its 1:1 subtype row
--    atomically (a Supabase JS client can't open a multi-statement
--    transaction, so the two writes live in one function). SECURITY INVOKER:
--    the function runs under the caller's own JWT, so the existing admin-only
--    RLS policies on items/estates/machinery/services/parking_spots are the
--    real authorization — a non-admin call fails on the first insert.
--
-- 2) Seed the three base categories (one per categories.item_type). The
--    catalog taxonomy was defined in 0004 but never seeded, and the admin
--    form needs real categories to assign. ParkingSpot deliberately has no
--    category (see 0004).

create or replace function save_item_with_subtype(
  p_item_id uuid,
  p_item jsonb,
  p_subtype jsonb
) returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_id uuid;
  v_kind text;
begin
  if p_item_id is null then
    insert into items (item_kind, title, description, base_price, price_unit, status, category_id)
    values (
      p_item ->> 'item_kind',
      p_item ->> 'title',
      nullif(p_item ->> 'description', ''),
      nullif(p_item ->> 'base_price', '')::numeric,
      nullif(p_item ->> 'price_unit', ''),
      coalesce(nullif(p_item ->> 'status', ''), 'draft'),
      nullif(p_item ->> 'category_id', '')::uuid
    )
    returning id, item_kind into v_id, v_kind;
  else
    -- item_kind is intentionally not updatable: changing the subtype of an
    -- existing item would strand its subtype row.
    update items
    set title = p_item ->> 'title',
        description = nullif(p_item ->> 'description', ''),
        base_price = nullif(p_item ->> 'base_price', '')::numeric,
        price_unit = nullif(p_item ->> 'price_unit', ''),
        status = coalesce(nullif(p_item ->> 'status', ''), status),
        category_id = nullif(p_item ->> 'category_id', '')::uuid
    where id = p_item_id
    returning id, item_kind into v_id, v_kind;

    if v_id is null then
      raise exception 'item % not found or not writable', p_item_id;
    end if;
  end if;

  case v_kind
    when 'estate' then
      insert into estates (item_id, area, bedrooms, address, location, condition, latitude, longitude, building_id)
      values (
        v_id,
        nullif(p_subtype ->> 'area', '')::numeric,
        nullif(p_subtype ->> 'bedrooms', '')::integer,
        nullif(p_subtype ->> 'address', ''),
        nullif(p_subtype ->> 'location', ''),
        nullif(p_subtype ->> 'condition', ''),
        nullif(p_subtype ->> 'latitude', '')::double precision,
        nullif(p_subtype ->> 'longitude', '')::double precision,
        nullif(p_subtype ->> 'building_id', '')::uuid
      )
      on conflict (item_id) do update set
        area = excluded.area,
        bedrooms = excluded.bedrooms,
        address = excluded.address,
        location = excluded.location,
        condition = excluded.condition,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        building_id = excluded.building_id;
    when 'machinery' then
      insert into machinery (item_id, brand, model, year, location, condition)
      values (
        v_id,
        nullif(p_subtype ->> 'brand', ''),
        nullif(p_subtype ->> 'model', ''),
        nullif(p_subtype ->> 'year', '')::integer,
        nullif(p_subtype ->> 'location', ''),
        nullif(p_subtype ->> 'condition', '')
      )
      on conflict (item_id) do update set
        brand = excluded.brand,
        model = excluded.model,
        year = excluded.year,
        location = excluded.location,
        condition = excluded.condition;
    when 'service' then
      insert into services (item_id, service_type, duration)
      values (
        v_id,
        nullif(p_subtype ->> 'service_type', ''),
        nullif(p_subtype ->> 'duration', '')
      )
      on conflict (item_id) do update set
        service_type = excluded.service_type,
        duration = excluded.duration;
    when 'parking_spot' then
      insert into parking_spots (item_id, spot_number, location, condition, building_id)
      values (
        v_id,
        nullif(p_subtype ->> 'spot_number', ''),
        nullif(p_subtype ->> 'location', ''),
        nullif(p_subtype ->> 'condition', ''),
        nullif(p_subtype ->> 'building_id', '')::uuid
      )
      on conflict (item_id) do update set
        spot_number = excluded.spot_number,
        location = excluded.location,
        condition = excluded.condition,
        building_id = excluded.building_id;
    else
      raise exception 'unknown item_kind %', v_kind;
  end case;

  return v_id;
end;
$$;

-- Callable only by real API roles; anon calls would fail on RLS anyway, but
-- there is no anonymous use case, so don't expose it at all.
revoke execute on function save_item_with_subtype(uuid, jsonb, jsonb) from public, anon;
grant execute on function save_item_with_subtype(uuid, jsonb, jsonb) to authenticated, service_role;

insert into categories (name, slug, item_type)
values
  ('Inmuebles', 'inmuebles', 'estate'),
  ('Maquinarias', 'maquinarias', 'machinery'),
  ('Servicios', 'servicios', 'service')
on conflict (slug) do nothing;

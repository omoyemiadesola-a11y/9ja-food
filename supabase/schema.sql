-- Run this script in Supabase SQL Editor.
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.foods (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  price numeric(10,2) not null,
  image_url text,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when lower(new.email) = '9jafoodsucres@gmail.com' then 'admin' else 'user' end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.foods enable row level security;
alter table public.locations enable row level security;
alter table public.orders enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.verify_local_admin_token(p_token text)
returns boolean
language sql
stable
as $$
  select p_token = 'LOCAL_ADMIN_9JA_TOKEN_CHANGE_ME';
$$;

create or replace function public.admin_upsert_food(
  p_token text,
  p_id uuid,
  p_name text,
  p_description text,
  p_price numeric,
  p_image_url text,
  p_category text
)
returns public.foods
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.foods;
begin
  if not public.verify_local_admin_token(p_token) then
    raise exception 'Invalid admin token';
  end if;

  if p_id is null then
    insert into public.foods (name, description, price, image_url, category)
    values (p_name, p_description, p_price, p_image_url, p_category)
    returning * into v_row;
  else
    update public.foods
    set
      name = p_name,
      description = p_description,
      price = p_price,
      image_url = p_image_url,
      category = p_category,
      updated_at = now()
    where id = p_id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

create or replace function public.admin_delete_food(p_token text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.verify_local_admin_token(p_token) then
    raise exception 'Invalid admin token';
  end if;

  delete from public.foods where id = p_id;
end;
$$;

create or replace function public.admin_upsert_location(
  p_token text,
  p_id uuid,
  p_name text,
  p_address text,
  p_latitude double precision,
  p_longitude double precision,
  p_image_url text
)
returns public.locations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.locations;
begin
  if not public.verify_local_admin_token(p_token) then
    raise exception 'Invalid admin token';
  end if;

  if p_id is null then
    insert into public.locations (name, address, latitude, longitude, image_url)
    values (p_name, p_address, p_latitude, p_longitude, p_image_url)
    returning * into v_row;
  else
    update public.locations
    set
      name = p_name,
      address = p_address,
      latitude = p_latitude,
      longitude = p_longitude,
      image_url = p_image_url,
      updated_at = now()
    where id = p_id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

create or replace function public.admin_delete_location(p_token text, p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.verify_local_admin_token(p_token) then
    raise exception 'Invalid admin token';
  end if;

  delete from public.locations where id = p_id;
end;
$$;

grant execute on function public.admin_upsert_food(text, uuid, text, text, numeric, text, text) to anon, authenticated;
grant execute on function public.admin_delete_food(text, uuid) to anon, authenticated;
grant execute on function public.admin_upsert_location(text, uuid, text, text, double precision, double precision, text) to anon, authenticated;
grant execute on function public.admin_delete_location(text, uuid) to anon, authenticated;

-- Profiles policies.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

-- Foods policies.
drop policy if exists "Public can view foods" on public.foods;
create policy "Public can view foods"
  on public.foods for select
  using (true);

drop policy if exists "Admin can mutate foods" on public.foods;
create policy "Admin can mutate foods"
  on public.foods for all
  using (public.is_admin())
  with check (public.is_admin());

-- Locations policies.
drop policy if exists "Public can view locations" on public.locations;
create policy "Public can view locations"
  on public.locations for select
  using (true);

drop policy if exists "Admin can mutate locations" on public.locations;
create policy "Admin can mutate locations"
  on public.locations for all
  using (public.is_admin())
  with check (public.is_admin());

-- Orders policies.
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders"
  on public.orders for insert
  with check (user_id = auth.uid());

drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

-- Storage setup.
insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('location-images', 'location-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read food images" on storage.objects;
create policy "Public read food images"
  on storage.objects for select
  using (bucket_id = 'food-images');

drop policy if exists "Admin write food images" on storage.objects;
create policy "Admin write food images"
  on storage.objects for all
  using (
    bucket_id = 'food-images'
    and (public.is_admin() or auth.role() = 'anon')
    and lower(name) ~ '\\.(png|jpg|jpeg|pdf)$'
  )
  with check (
    bucket_id = 'food-images'
    and (public.is_admin() or auth.role() = 'anon')
    and lower(name) ~ '\\.(png|jpg|jpeg|pdf)$'
  );

drop policy if exists "Public read location images" on storage.objects;
create policy "Public read location images"
  on storage.objects for select
  using (bucket_id = 'location-images');

drop policy if exists "Admin write location images" on storage.objects;
create policy "Admin write location images"
  on storage.objects for all
  using (
    bucket_id = 'location-images'
    and (public.is_admin() or auth.role() = 'anon')
    and lower(name) ~ '\\.(png|jpg|jpeg|pdf)$'
  )
  with check (
    bucket_id = 'location-images'
    and (public.is_admin() or auth.role() = 'anon')
    and lower(name) ~ '\\.(png|jpg|jpeg|pdf)$'
  );

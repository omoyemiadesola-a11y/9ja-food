create extension if not exists "uuid-ossp";

-- =========================================================
-- TABLES
-- =========================================================

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
  status text not null default 'pending' check (
    status in ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_foods_updated_at on public.foods;
create trigger set_foods_updated_at
before update on public.foods
for each row execute procedure public.set_updated_at();

drop trigger if exists set_locations_updated_at on public.locations;
create trigger set_locations_updated_at
before update on public.locations
for each row execute procedure public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

-- =========================================================
-- AUTO PROFILE CREATION
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case
      when lower(new.email) = '9jafoodsucres@gmail.com' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    role = case
      when lower(new.email) = '9jafoodsucres@gmail.com' then 'admin'
      else public.profiles.role
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =========================================================
-- ADMIN HELPER FUNCTION
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.foods enable row level security;
alter table public.locations enable row level security;
alter table public.orders enable row level security;

-- =========================================================
-- DROP OLD POLICIES
-- =========================================================

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Public can view foods" on public.foods;
drop policy if exists "Admin can mutate foods" on public.foods;

drop policy if exists "Public can view locations" on public.locations;
drop policy if exists "Admin can mutate locations" on public.locations;

drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can insert own orders" on public.orders;
drop policy if exists "Admin can update orders" on public.orders;

-- =========================================================
-- PROFILES POLICIES
-- =========================================================

create policy "Users can view own profile or admin can view all"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- =========================================================
-- FOODS POLICIES
-- =========================================================

create policy "Public can view foods"
on public.foods
for select
to public
using (true);

create policy "Only admins can insert foods"
on public.foods
for insert
to authenticated
with check (public.is_admin());

create policy "Only admins can update foods"
on public.foods
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Only admins can delete foods"
on public.foods
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- LOCATIONS POLICIES
-- =========================================================

create policy "Public can view locations"
on public.locations
for select
to public
using (true);

create policy "Only admins can insert locations"
on public.locations
for insert
to authenticated
with check (public.is_admin());

create policy "Only admins can update locations"
on public.locations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Only admins can delete locations"
on public.locations
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- ORDERS POLICIES
-- =========================================================

create policy "Users can view own orders or admin can view all"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "Users can insert own orders"
on public.orders
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Admins can update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- STORAGE BUCKETS
-- =========================================================

insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('location-images', 'location-images', true)
on conflict (id) do nothing;

-- Drop old storage policies
drop policy if exists "Public read food images" on storage.objects;
drop policy if exists "Admin write food images" on storage.objects;
drop policy if exists "Public read location images" on storage.objects;
drop policy if exists "Admin write location images" on storage.objects;

-- Food images policies
create policy "Public read food images"
on storage.objects
for select
to public
using (bucket_id = 'food-images');

create policy "Admins write food images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'food-images'
  and public.is_admin()
  and lower(name) ~ '\.(png|jpg|jpeg|pdf|webp)$'
);

create policy "Admins update food images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'food-images'
  and public.is_admin()
)
with check (
  bucket_id = 'food-images'
  and public.is_admin()
  and lower(name) ~ '\.(png|jpg|jpeg|pdf|webp)$'
);

create policy "Admins delete food images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'food-images'
  and public.is_admin()
);

-- Location images policies
create policy "Public read location images"
on storage.objects
for select
to public
using (bucket_id = 'location-images');

create policy "Admins write location images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'location-images'
  and public.is_admin()
  and lower(name) ~ '\.(png|jpg|jpeg|pdf|webp)$'
);

create policy "Admins update location images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'location-images'
  and public.is_admin()
)
with check (
  bucket_id = 'location-images'
  and public.is_admin()
  and lower(name) ~ '\.(png|jpg|jpeg|pdf|webp)$'
);

create policy "Admins delete location images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'location-images'
  and public.is_admin()
);

-- =========================================================
-- MAKE SURE THE MAIN ADMIN ACCOUNT IS REALLY ADMIN
-- =========================================================

insert into public.profiles (id, full_name, role)
select id, coalesce(raw_user_meta_data->>'full_name', ''), 'admin'
from auth.users
where lower(email) = '9jafoodsucres@gmail.com'
on conflict (id) do update set
  role = 'admin',
  updated_at = now();
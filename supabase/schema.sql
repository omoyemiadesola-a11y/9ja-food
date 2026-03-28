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

create policy "Public read food images"
  on storage.objects for select
  using (bucket_id = 'food-images');

create policy "Admin write food images"
  on storage.objects for all
  using (bucket_id = 'food-images' and public.is_admin())
  with check (bucket_id = 'food-images' and public.is_admin());

create policy "Public read location images"
  on storage.objects for select
  using (bucket_id = 'location-images');

create policy "Admin write location images"
  on storage.objects for all
  using (bucket_id = 'location-images' and public.is_admin())
  with check (bucket_id = 'location-images' and public.is_admin());

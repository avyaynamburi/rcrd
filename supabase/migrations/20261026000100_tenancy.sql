-- ACC-01: read-only tenancy foundation. Provisioning writes remain closed until
-- an audited action/RPC exists. Never grant application roles direct mutations.
create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique,
  name text not null check (length(btrim(name)) between 1 and 200),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  external_source text,
  external_id text,
  constraint organisation_self_scope check (org_id = id),
  unique (org_id, id)
);

create table public.centers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(org_id),
  name text not null check (length(btrim(name)) between 1 and 200),
  timezone text not null default 'Asia/Kolkata',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  external_source text,
  external_id text,
  unique (org_id, id)
);

create table public.operatories (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(org_id),
  center_id uuid not null,
  name text not null check (length(btrim(name)) between 1 and 200),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  external_source text,
  external_id text,
  foreign key (org_id, center_id) references public.centers(org_id, id),
  unique (org_id, center_id, id)
);

-- Exactly one organisation per identity for now. Neither JWT user metadata nor
-- a client-supplied organisation selects the tenant. No platform bypass exists.
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(org_id),
  user_id uuid not null unique references auth.users(id),
  login_enabled boolean not null default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  external_source text,
  external_id text,
  unique (org_id, id)
);

create table public.center_grants (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(org_id),
  center_id uuid not null,
  membership_id uuid not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  external_source text,
  external_id text,
  foreign key (org_id, center_id) references public.centers(org_id, id),
  foreign key (org_id, membership_id) references public.memberships(org_id, id),
  unique (org_id, membership_id, center_id)
);

create index operatories_center_idx on public.operatories(org_id, center_id);
create index center_grants_center_idx on public.center_grants(org_id, center_id);

-- Definer helpers read through RLS without recursion, with fixed object names
-- and no dynamic SQL. Their only identity input is auth.uid().
create function public.auth_org_id() returns uuid
language sql stable security definer set search_path = ''
as $$
  select m.org_id from public.memberships m
  join public.organisations o on o.org_id = m.org_id
  where m.user_id = auth.uid() and m.login_enabled
    and m.deleted_at is null and o.deleted_at is null
$$;

create function public.can_access_center(target_center_id uuid) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.center_grants g
    join public.memberships m on m.id = g.membership_id and m.org_id = g.org_id
    join public.centers c on c.id = g.center_id and c.org_id = g.org_id
    where m.user_id = auth.uid() and m.login_enabled
      and m.org_id = public.auth_org_id() and g.center_id = target_center_id
      and m.deleted_at is null and g.deleted_at is null and c.deleted_at is null
  )
$$;

revoke all on function public.auth_org_id() from public, anon;
revoke all on function public.can_access_center(uuid) from public, anon;
grant execute on function public.auth_org_id() to authenticated;
grant execute on function public.can_access_center(uuid) to authenticated;

alter table public.organisations enable row level security;
alter table public.centers enable row level security;
alter table public.operatories enable row level security;
alter table public.memberships enable row level security;
alter table public.center_grants enable row level security;

revoke all on public.organisations, public.centers, public.operatories,
  public.memberships, public.center_grants from public, anon, authenticated, service_role;
grant select on public.organisations, public.centers, public.operatories,
  public.memberships, public.center_grants to authenticated;

create policy organisations_read on public.organisations for select to authenticated
using (org_id = (select public.auth_org_id()) and deleted_at is null);
create policy centers_read on public.centers for select to authenticated
using (org_id = (select public.auth_org_id()) and public.can_access_center(id) and deleted_at is null);
create policy operatories_read on public.operatories for select to authenticated
using (org_id = (select public.auth_org_id()) and public.can_access_center(center_id) and deleted_at is null);
create policy memberships_read on public.memberships for select to authenticated
using (org_id = (select public.auth_org_id()) and user_id = (select auth.uid()) and deleted_at is null);
create policy center_grants_read on public.center_grants for select to authenticated
using (org_id = (select public.auth_org_id()) and public.can_access_center(center_id)
  and membership_id in (select id from public.memberships) and deleted_at is null);

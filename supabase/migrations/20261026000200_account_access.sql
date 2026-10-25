-- ACC-02/03. Owner capability is trusted database provisioning, never JWT metadata.
-- ACC-04/06 will map this capability into the complete role/permission model.
alter table public.memberships add column is_owner boolean not null default false;
alter table public.memberships add column mobile_access_enabled boolean not null default true;

create table public.access_audit (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations(org_id),
  center_id uuid,
  actor_id uuid not null references auth.users(id),
  area text not null default 'accounts',
  action text not null,
  record_id uuid not null,
  before_data jsonb,
  after_data jsonb,
  source text not null default 'ui' check (source in ('ui','ai','import','system','support')),
  created_at timestamptz not null default now(),
  foreign key (org_id, center_id) references public.centers(org_id, id)
);
alter table public.access_audit enable row level security;
revoke all on public.access_audit from public, anon, authenticated, service_role;

create function public.can_manage_logins() returns boolean
language sql volatile security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m
    where m.user_id = auth.uid() and m.org_id = public.auth_org_id()
      and m.is_owner and m.login_enabled and m.deleted_at is null)
$$;
revoke all on function public.can_manage_logins() from public, anon;
grant execute on function public.can_manage_logins() to authenticated;

create function public.list_login_accounts()
returns table (id uuid, email text, login_enabled boolean, mobile_access_enabled boolean, is_owner boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  return query select m.id, u.email::text, m.login_enabled, m.mobile_access_enabled, m.is_owner
    from public.memberships m join auth.users u on u.id = m.user_id
    where m.org_id = public.auth_org_id() and m.deleted_at is null order by m.created_at, m.id;
end
$$;
revoke all on function public.list_login_accounts() from public, anon;
grant execute on function public.list_login_accounts() to authenticated;

create function public.set_login_access(target_membership_id uuid, enabled boolean, mobile_enabled boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare target public.memberships; actor_org uuid;
begin
  if enabled is null or mobile_enabled is null or not public.can_manage_logins() then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  actor_org := public.auth_org_id();
  -- Serialize access changes across the org. Do not let concurrent owners disable each other.
  perform 1 from public.organisations where org_id = actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  select * into target from public.memberships
    where id = target_membership_id and org_id = actor_org and deleted_at is null for update;
  if not found or target.user_id = auth.uid() then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  update public.memberships set login_enabled = enabled, mobile_access_enabled = mobile_enabled,
    updated_by = auth.uid(), updated_at = now() where id = target.id;
  insert into public.access_audit (org_id, actor_id, action, record_id, before_data, after_data)
    values (actor_org, auth.uid(), 'set_login_access', target.id,
      jsonb_build_object('login_enabled', target.login_enabled, 'mobile_access_enabled', target.mobile_access_enabled),
      jsonb_build_object('login_enabled', enabled, 'mobile_access_enabled', mobile_enabled));
end
$$;
revoke all on function public.set_login_access(uuid, boolean, boolean) from public, anon;
grant execute on function public.set_login_access(uuid, boolean, boolean) to authenticated;

-- Authenticated direct membership writes remain revoked. Audit has no update/delete grant.

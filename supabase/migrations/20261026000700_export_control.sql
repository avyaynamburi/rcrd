-- ACC-10: export restriction is independent of record read permissions.
alter table public.memberships add column export_disabled boolean not null default false;
create function public.list_export_disabled()
returns table(id uuid, export_disabled boolean)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode='42501'; end if;
  return query select m.id,m.export_disabled from public.memberships m where m.org_id=public.auth_org_id() and m.deleted_at is null;
end $$;
create function public.set_export_disabled(target_membership_id uuid, disabled boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare target public.memberships; actor_org uuid;
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode='42501'; end if;
  if disabled is null then raise exception 'invalid export restriction'; end if;
  actor_org := public.auth_org_id();
  perform 1 from public.organisations where org_id=actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode='42501'; end if;
  select * into target from public.memberships where id=target_membership_id and org_id=actor_org and deleted_at is null for update;
  if not found or target.is_owner or target.user_id=auth.uid() then raise exception 'permission denied' using errcode='42501'; end if;
  update public.memberships set export_disabled=disabled,updated_by=auth.uid(),updated_at=now() where id=target.id;
  insert into public.access_audit(org_id,actor_id,action,record_id,before_data,after_data)
  values(actor_org,auth.uid(),'set_export_disabled',target.id,jsonb_build_object('export_disabled',target.export_disabled),jsonb_build_object('export_disabled',disabled));
end $$;

create function public.can_export()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.memberships m
    where m.org_id=public.auth_org_id() and m.user_id=auth.uid()
      and m.login_enabled and m.deleted_at is null and not m.export_disabled);
$$;
revoke all on function public.list_export_disabled() from public,anon;
revoke all on function public.set_export_disabled(uuid,boolean) from public,anon;
revoke all on function public.can_export() from public,anon;
grant execute on function public.list_export_disabled() to authenticated;
grant execute on function public.set_export_disabled(uuid,boolean) to authenticated;
grant execute on function public.can_export() to authenticated;

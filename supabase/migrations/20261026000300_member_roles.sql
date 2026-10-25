-- ACC-04. Platform staff roles are never tenant-assignable.
alter table public.memberships add column base_role text not null default 'staff'
  check (base_role in ('owner','owner_doctor','doctor','staff','accountant'));
alter table public.memberships add column role_tags text[] not null default '{}'
  check (role_tags <@ array['consultant','orthodontist','tele_caller','marketing','accountant']::text[]
    and array_position(role_tags, null) is null and cardinality(role_tags) <= 5);
update public.memberships set base_role = 'owner' where is_owner;
alter table public.memberships add constraint membership_owner_role_consistent
  check (is_owner = (base_role in ('owner','owner_doctor')));

create function public.list_member_roles()
returns table (id uuid, base_role text, role_tags text[])
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  return query select m.id, m.base_role, m.role_tags from public.memberships m
    where m.org_id = public.auth_org_id() and m.deleted_at is null;
end
$$;
revoke all on function public.list_member_roles() from public, anon;
grant execute on function public.list_member_roles() to authenticated;

create function public.set_member_role(target_membership_id uuid, new_role text, new_tags text[])
returns void language plpgsql security definer set search_path = '' as $$
declare target public.memberships; actor_org uuid;
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  if new_role is null or new_role not in ('owner','owner_doctor','doctor','staff','accountant')
    or new_tags is null or not (new_tags <@ array['consultant','orthodontist','tele_caller','marketing','accountant']::text[])
    or array_position(new_tags, null) is not null or cardinality(new_tags) > 5
    or cardinality(new_tags) <> (select count(distinct tag) from unnest(new_tags) tag) then
    raise exception 'invalid role or tags' using errcode = '22023';
  end if;
  actor_org := public.auth_org_id();
  perform 1 from public.organisations where org_id = actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  select * into target from public.memberships
    where id = target_membership_id and org_id = actor_org and deleted_at is null for update;
  if not found or target.user_id = auth.uid() then raise exception 'permission denied' using errcode = '42501'; end if;
  update public.memberships set base_role = new_role, role_tags = new_tags,
    is_owner = new_role in ('owner','owner_doctor'), updated_by = auth.uid(), updated_at = now()
    where id = target.id;
  insert into public.access_audit (org_id, actor_id, action, record_id, before_data, after_data)
    values (actor_org, auth.uid(), 'set_member_role', target.id,
      jsonb_build_object('base_role', target.base_role, 'role_tags', target.role_tags),
      jsonb_build_object('base_role', new_role, 'role_tags', new_tags));
end
$$;
revoke all on function public.set_member_role(uuid, text, text[]) from public, anon;
grant execute on function public.set_member_role(uuid, text, text[]) to authenticated;

-- ACC-18: retain identity and all historical references; deny app access through
-- the existing live membership predicates. Only audited RPCs can change state.
create function public.list_deleted_people() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', m.id, 'email', u.email, 'base_role', m.base_role, 'deleted_at', m.deleted_at
  ) order by m.deleted_at desc, m.id)
  from public.memberships m join auth.users u on u.id = m.user_id
  where m.org_id = public.auth_org_id() and m.deleted_at is not null), '[]'::jsonb);
end
$$;
revoke all on function public.list_deleted_people() from public, anon;
grant execute on function public.list_deleted_people() to authenticated;

create function public.set_person_deleted(target_membership_id uuid, deleted boolean)
returns void language plpgsql security definer set search_path = '' as $$
declare target public.memberships; actor_org uuid; new_deleted_at timestamptz;
begin
  if deleted is null or not public.can_manage_logins() then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  actor_org := public.auth_org_id();
  -- Same organisation lock as role/login edits: concurrent owners cannot
  -- remove each other's authority or restore while another owner is deleting.
  perform 1 from public.organisations where org_id = actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  select * into target from public.memberships
    where id = target_membership_id and org_id = actor_org for update;
  if not found or target.user_id = auth.uid()
    or (deleted and target.deleted_at is not null)
    or (not deleted and target.deleted_at is null) then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  new_deleted_at := case when deleted then now() else null end;
  -- Restore never silently enables login. An owner reviews access separately.
  update public.memberships set deleted_at = new_deleted_at, login_enabled = false,
    updated_at = now(), updated_by = auth.uid() where id = target.id;
  insert into public.access_audit(org_id, actor_id, action, record_id, before_data, after_data)
    values (actor_org, auth.uid(), case when deleted then 'delete_person' else 'restore_person' end,
      target.id, jsonb_build_object('deleted_at', target.deleted_at, 'login_enabled', target.login_enabled),
      jsonb_build_object('deleted_at', new_deleted_at, 'login_enabled', false));
end
$$;
revoke all on function public.set_person_deleted(uuid, boolean) from public, anon;
grant execute on function public.set_person_deleted(uuid, boolean) to authenticated;

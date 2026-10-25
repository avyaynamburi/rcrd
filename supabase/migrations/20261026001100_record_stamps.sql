-- ACC-13: expose only row provenance to the existing owner-only Team screen.
create function public.list_member_stamps() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', m.id,
    'created_by', creator.email,
    'created_at', m.created_at,
    'updated_by', updater.email,
    'updated_at', m.updated_at
  ) order by m.created_at, m.id)
  from public.memberships m
  left join auth.users creator on creator.id = m.created_by and exists (
    select 1 from public.memberships c where c.user_id = creator.id and c.org_id = m.org_id
  )
  left join auth.users updater on updater.id = m.updated_by and exists (
    select 1 from public.memberships u where u.user_id = updater.id and u.org_id = m.org_id
  )
  where m.org_id = public.auth_org_id() and m.deleted_at is null), '[]'::jsonb);
end
$$;
revoke all on function public.list_member_stamps() from public, anon;
grant execute on function public.list_member_stamps() to authenticated;

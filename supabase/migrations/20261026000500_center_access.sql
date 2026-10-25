-- ACC-08: owner-managed branch grants. All changes and audit are atomic.
create function public.list_center_access()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  return jsonb_build_object(
    'centers', coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name) order by c.name,c.id) from public.centers c where c.org_id=public.auth_org_id() and c.deleted_at is null),'[]'::jsonb),
    'grants', coalesce((select jsonb_agg(jsonb_build_object('membershipId',g.membership_id,'centerId',g.center_id)) from public.center_grants g join public.centers c on c.id=g.center_id and c.org_id=g.org_id where g.org_id=public.auth_org_id() and g.deleted_at is null and c.deleted_at is null),'[]'::jsonb));
end $$;
create function public.set_member_centers(target_membership_id uuid, center_ids uuid[])
returns void language plpgsql security definer set search_path = '' as $$
declare actor_org uuid; target public.memberships; previous_ids uuid[];
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  actor_org := public.auth_org_id();
  perform 1 from public.organisations where org_id=actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  select * into target from public.memberships where id=target_membership_id and org_id=actor_org and deleted_at is null for update;
  if not found or target.user_id=auth.uid() then raise exception 'permission denied' using errcode = '42501'; end if;
  if center_ids is null or cardinality(center_ids)>1000 or exists(select 1 from unnest(center_ids) x where x is null) or cardinality(center_ids)<>(select count(distinct x) from unnest(center_ids) x) then raise exception 'invalid centers'; end if;
  -- Lock selected centers so a simultaneous archival cannot grant stale access.
  perform 1 from public.centers where org_id=actor_org and id=any(center_ids) and deleted_at is null order by id for update;
  if cardinality(center_ids)<>(select count(*) from public.centers where org_id=actor_org and id=any(center_ids) and deleted_at is null) then raise exception 'permission denied' using errcode = '42501'; end if;
  select coalesce(array_agg(center_id order by center_id),'{}'::uuid[]) into previous_ids from public.center_grants where org_id=actor_org and membership_id=target.id and deleted_at is null;
  update public.center_grants set deleted_at=now(),updated_at=now(),updated_by=auth.uid() where org_id=actor_org and membership_id=target.id and deleted_at is null and not(center_id=any(center_ids));
  insert into public.center_grants(org_id,center_id,membership_id,created_by,updated_by)
  select actor_org,x,target.id,auth.uid(),auth.uid() from unnest(center_ids) x
  on conflict(org_id,membership_id,center_id) do update set deleted_at=null,updated_at=now(),updated_by=auth.uid();
  insert into public.access_audit(org_id,actor_id,action,record_id,before_data,after_data)
  values(actor_org,auth.uid(),'set_member_centers',target.id,jsonb_build_object('center_ids',previous_ids),jsonb_build_object('center_ids',center_ids));
end $$;
revoke all on function public.list_center_access() from public,anon;
revoke all on function public.set_member_centers(uuid,uuid[]) from public,anon;
grant execute on function public.list_center_access() to authenticated;
grant execute on function public.set_member_centers(uuid,uuid[]) to authenticated;

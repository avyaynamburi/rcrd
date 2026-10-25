-- ACC-09: visibility is independent of edit permissions and branch access.
alter table public.memberships add column appointment_visibility text not null default 'all'
  check (appointment_visibility in ('all','own'));
create function public.list_appointment_visibility()
returns table(id uuid, appointment_visibility text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode='42501'; end if;
  return query select m.id,m.appointment_visibility from public.memberships m where m.org_id=public.auth_org_id() and m.deleted_at is null;
end $$;
create function public.set_appointment_visibility(target_membership_id uuid, visibility text)
returns void language plpgsql security definer set search_path = '' as $$
declare target public.memberships; actor_org uuid;
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode='42501'; end if;
  if visibility is null or visibility not in ('all','own') then raise exception 'invalid visibility'; end if;
  actor_org := public.auth_org_id();
  perform 1 from public.organisations where org_id=actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode='42501'; end if;
  select * into target from public.memberships where id=target_membership_id and org_id=actor_org and deleted_at is null for update;
  if not found or target.is_owner or target.user_id=auth.uid() then raise exception 'permission denied' using errcode='42501'; end if;
  update public.memberships set appointment_visibility=visibility,updated_by=auth.uid(),updated_at=now() where id=target.id;
  insert into public.access_audit(org_id,actor_id,action,record_id,before_data,after_data)
  values(actor_org,auth.uid(),'set_appointment_visibility',target.id,jsonb_build_object('appointment_visibility',target.appointment_visibility),jsonb_build_object('appointment_visibility',visibility));
end $$;
-- doctor_user_id is the assigned doctor's Auth identity, never the record creator.
-- Future appointment SELECT policies must call this for rows and count sources.
create function public.can_see_appointment(appointment_org_id uuid, appointment_center_id uuid, doctor_user_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select appointment_org_id=public.auth_org_id()
    and public.can_access_center(appointment_center_id)
    and exists(select 1 from public.centers c where c.id=appointment_center_id and c.org_id=appointment_org_id and c.deleted_at is null)
    and exists(select 1 from public.memberships m where m.org_id=appointment_org_id and m.user_id=auth.uid() and m.login_enabled and m.deleted_at is null and (m.appointment_visibility='all' or (m.appointment_visibility='own' and doctor_user_id=m.user_id)));
$$;
revoke all on function public.list_appointment_visibility() from public,anon;
revoke all on function public.set_appointment_visibility(uuid,text) from public,anon;
revoke all on function public.can_see_appointment(uuid,uuid,uuid) from public,anon;
grant execute on function public.list_appointment_visibility() to authenticated;
grant execute on function public.set_appointment_visibility(uuid,text) to authenticated;
grant execute on function public.can_see_appointment(uuid,uuid,uuid) to authenticated;

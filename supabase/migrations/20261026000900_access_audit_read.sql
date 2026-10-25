-- ACC-12: read-only owner access; no application update/delete grants.
grant select on public.access_audit to authenticated;
create policy access_audit_owner_read on public.access_audit for select to authenticated
using (org_id = (select public.auth_org_id()) and public.can_manage_logins()
  and (center_id is null or public.can_access_center(center_id)));
create index access_audit_org_time on public.access_audit(org_id, created_at desc, id desc);

-- Export is a privileged operation and must itself leave an immutable event.
create function public.record_audit_export(export_format text, page_number integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() or not public.can_export() then
    raise exception 'permission denied' using errcode = '42501';
  end if;
  if export_format not in ('xlsx','pdf') or export_format is null
      or page_number is null or page_number < 1 or page_number > 100000 then
    raise exception 'invalid export';
  end if;
  insert into public.access_audit(org_id,actor_id,area,action,record_id,after_data)
    values(public.auth_org_id(),auth.uid(),'access_audit','export',auth.uid(),
      jsonb_build_object('format',export_format,'page',page_number));
end
$$;
revoke all on function public.record_audit_export(text,integer) from public, anon;
grant execute on function public.record_audit_export(text,integer) to authenticated;

-- GoTrue owns authentication writes. Mirror attributable provider events without
-- passwords, tokens, identifiers or raw auth payloads. Unknown identities have no
-- trusted clinic and remain in the provider's authentication log only.
create function public.capture_auth_activity() returns trigger
language plpgsql security definer set search_path = '' as $$
declare event_action text; actor uuid;
begin
  event_action := new.payload->>'action';
  if event_action is null or event_action = 'token_refreshed' then return new; end if;
  if (new.payload->>'actor_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    actor := (new.payload->>'actor_id')::uuid;
  end if;
  -- Failed login events can contain a username but no authenticated actor.
  -- Resolve only a known verified auth identity for attribution, never authorization.
  if actor is null or not exists(select 1 from auth.users where id = actor) then
    select u.id into actor from auth.users u
      where (u.email = new.payload->>'actor_username' and u.email_confirmed_at is not null)
         or (u.phone = new.payload->>'actor_username' and u.phone_confirmed_at is not null)
      limit 1;
  end if;
  insert into public.access_audit(org_id,actor_id,area,action,record_id,source)
    select m.org_id,m.user_id,'authentication', 'auth_' || left(event_action,80),m.id,'system'
      from public.memberships m where m.user_id = actor;
  return new;
end
$$;
revoke all on function public.capture_auth_activity() from public, anon, authenticated;
create trigger capture_clinic_auth_activity after insert on auth.audit_log_entries
for each row execute function public.capture_auth_activity();

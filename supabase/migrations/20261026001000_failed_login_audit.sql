-- ACC-12: trusted password verification outcome; never expose to application RPC callers.
create function public.audit_password_verification(event jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if event->'valid' = 'false'::jsonb then
    insert into public.access_audit(org_id,actor_id,area,action,record_id,source)
      select m.org_id,m.user_id,'authentication','auth_login_failed',m.id,'system'
      from public.memberships m where m.user_id = (event->>'user_id')::uuid;
  end if;
  -- Auditing never changes the provider's password or session decision.
  return jsonb_build_object('decision','continue');
end
$$;
revoke all on function public.audit_password_verification(jsonb) from public, anon, authenticated, service_role;
grant usage on schema public to supabase_auth_admin;
grant execute on function public.audit_password_verification(jsonb) to supabase_auth_admin;

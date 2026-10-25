-- ACC-06: owner-managed overrides. Direct membership writes remain revoked.
alter table public.memberships add column access_grid jsonb;
create function public.set_member_access(target_membership_id uuid, new_grid jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare target public.memberships; actor_org uuid; area text; action text; cell jsonb;
  areas text[] := array['patient','appointment','treatment_settings','clinical_notes','treatment_plan','treatment_done','prescription','files','charting','billing','receipts','credit_notes','expenses','accounting','inventory','lab','tasks','crm','messaging','reports','settings','nabh','membership','ai','access_audit','users','ai_settings','import','patient_merge','plan_purchases'];
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  if new_grid is null or jsonb_typeof(new_grid) <> 'object' then raise exception 'invalid grid'; end if;
  if (select count(*) from jsonb_object_keys(new_grid)) <> cardinality(areas) then raise exception 'invalid areas'; end if;
  foreach area in array areas loop
    if jsonb_typeof(new_grid->area) is distinct from 'object' then raise exception 'invalid area'; end if;
    if (select count(*) from jsonb_object_keys(new_grid->area)) <> 4 then raise exception 'invalid actions'; end if;
    foreach action in array array['entry','edit','delete','report'] loop
      cell := new_grid->area->action;
      if jsonb_typeof(cell) is distinct from 'object' then raise exception 'invalid cell'; end if;
      if (select count(*) from jsonb_object_keys(cell)) <> 2
        or jsonb_typeof(cell->'day') is distinct from 'string'
        or (cell->>'day') not in ('any','same','none')
        or jsonb_typeof(cell->'others') is distinct from 'boolean' then raise exception 'invalid cell'; end if;
    end loop;
  end loop;
  actor_org := public.auth_org_id();
  perform 1 from public.organisations where org_id = actor_org for update;
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  select * into target from public.memberships where id = target_membership_id and org_id = actor_org and deleted_at is null for update;
  if not found or target.user_id = auth.uid() or target.is_owner then raise exception 'permission denied' using errcode = '42501'; end if;
  update public.memberships set access_grid = new_grid, updated_by = auth.uid(), updated_at = now() where id = target.id;
  insert into public.access_audit(org_id, actor_id, action, record_id, before_data, after_data)
  values(actor_org, auth.uid(), 'set_member_access', target.id, jsonb_build_object('access_grid',target.access_grid), jsonb_build_object('access_grid',new_grid));
end
$$;
revoke all on function public.set_member_access(uuid,jsonb) from public, anon;
grant execute on function public.set_member_access(uuid,jsonb) to authenticated;
-- Owner-only listing uses the same tenant and active-membership filter as role management.
create function public.list_member_access()
returns table(id uuid, access_grid jsonb)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.can_manage_logins() then raise exception 'permission denied' using errcode = '42501'; end if;
  return query select m.id,m.access_grid from public.memberships m where m.org_id = public.auth_org_id() and m.deleted_at is null;
end
$$;
revoke all on function public.list_member_access() from public, anon;
grant execute on function public.list_member_access() to authenticated;

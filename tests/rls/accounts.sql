begin;
create extension if not exists pgtap with schema extensions;
select extensions.no_plan();
insert into auth.users (id, email) values
 ('00000000-0000-4000-8000-000000000001', 'owner-a@example.invalid'),
 ('00000000-0000-4000-8000-000000000002', 'staff-a@example.invalid'),
 ('00000000-0000-4000-8000-000000000003', 'owner-b@example.invalid');
insert into public.organisations (id, org_id, name) values
 ('10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Synthetic A'),
 ('10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Synthetic B');
insert into public.memberships (id, org_id, user_id, login_enabled, is_owner, base_role) values
 ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', true, true, 'owner'),
 ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', true, false, 'staff'),
 ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', true, true, 'owner');


-- ACC-10: restrictions are organization-isolated, audited, and checked fresh.
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select extensions.is((select count(*)::integer from public.list_export_disabled()),2,'Export list isolates org');
select extensions.lives_ok($$select public.set_export_disabled('30000000-0000-4000-8000-000000000002',true)$$,'Owner disables export');
select extensions.throws_ok($$select public.set_export_disabled('30000000-0000-4000-8000-000000000003',true)$$,'42501',null,'Foreign restriction denied');
select extensions.throws_ok($$select public.set_export_disabled('30000000-0000-4000-8000-000000000001',true)$$,'42501',null,'Owner export protected');
select extensions.throws_ok($$select public.set_export_disabled('30000000-0000-4000-8000-000000000002',null)$$,'P0001',null,'Null restriction rejected');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.ok(not public.can_export(),'Restricted staff denied exports');
select extensions.throws_ok('select public.list_export_disabled()','42501',null,'Staff cannot enumerate export settings');
select extensions.throws_ok($$select public.set_export_disabled('30000000-0000-4000-8000-000000000002',false)$$,'42501',null,'Staff cannot restore own exports');
reset role;
select extensions.is((select count(*)::integer from public.access_audit where action='set_export_disabled'),1,'Restriction is audited');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select public.set_export_disabled('30000000-0000-4000-8000-000000000002',false);
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.ok(public.can_export(),'Restored staff can export authorized records');
reset role;
-- ACC-09: audited scope settings and fail-closed appointment predicate.
insert into public.centers(id,org_id,name) values
 ('20000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000001','Visibility branch');
insert into public.center_grants(org_id,center_id,membership_id) values
 ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000009','30000000-0000-4000-8000-000000000002');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select extensions.is((select count(*)::integer from public.list_appointment_visibility()),2,'Visibility list isolates organisation');
select extensions.lives_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000002','own')$$,'Owner sets own-only scope');
select extensions.throws_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000003','own')$$,'42501',null,'Cross-org visibility write rejected');
select extensions.throws_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000001','own')$$,'42501',null,'Owner scope protected');
select extensions.throws_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000002',null)$$,'P0001',null,'Null scope rejected');
select extensions.throws_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000002','bad')$$,'P0001',null,'Invalid scope rejected');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.ok(public.can_see_appointment('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000009',auth.uid()),'Own assigned appointment visible');
select extensions.ok(not public.can_see_appointment('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000009','00000000-0000-4000-8000-000000000001'),'Another doctor hidden');
select extensions.ok(not public.can_see_appointment('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000009',null),'Unassigned hidden for own-only');
select extensions.ok(not public.can_see_appointment('10000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000009',auth.uid()),'Foreign org hidden');
select extensions.ok(not public.can_see_appointment('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',auth.uid()),'Ungranted center hidden');
select extensions.throws_ok('select public.list_appointment_visibility()','42501',null,'Staff cannot list scope settings');
select extensions.throws_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000002','all')$$,'42501',null,'Staff cannot widen scope');
reset role;
select extensions.is((select count(*)::integer from public.access_audit where action='set_appointment_visibility'),1,'Successful scope write audited once');
select extensions.is((select before_data->>'appointment_visibility' from public.access_audit where action='set_appointment_visibility'),'all','Audit captures previous scope');
select extensions.is((select after_data->>'appointment_visibility' from public.access_audit where action='set_appointment_visibility'),'own','Audit captures new scope');
update public.memberships set appointment_visibility='all' where id='30000000-0000-4000-8000-000000000002';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.ok(public.can_see_appointment('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000009',null),'All scope includes unassigned');
reset role;
-- Remove this fixture before existing branch-count assertions.
delete from public.access_audit where action='set_appointment_visibility';
delete from public.center_grants where center_id='20000000-0000-4000-8000-000000000009';
delete from public.centers where id='20000000-0000-4000-8000-000000000009';

-- ACC-08 synthetic branch grants and immediate revocation.
insert into public.centers(id,org_id,name) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Synthetic branch A'),
 ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','Synthetic branch B');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select extensions.is(jsonb_array_length(public.list_center_access()->'centers'),1,'Owner lists only own clinic centers');
select extensions.lives_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000002',array['20000000-0000-4000-8000-000000000001']::uuid[])$$,'Owner grants center');
select extensions.throws_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000002',array['20000000-0000-4000-8000-000000000002']::uuid[])$$,'42501',null,'Cross-org center rejected');
select extensions.throws_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000003','{}')$$,'42501',null,'Cross-org member rejected');
select extensions.throws_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000001','{}')$$,'42501',null,'Self change rejected');
select extensions.throws_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000002',null)$$,'P0001',null,'Null set rejected');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.ok(public.can_access_center('20000000-0000-4000-8000-000000000001'),'Granted branch visible');
select extensions.is((select count(*)::integer from public.centers),1,'Only granted branch visible');
select extensions.throws_ok('select public.list_center_access()','42501',null,'Staff cannot list all grants');
select extensions.throws_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000002','{}')$$,'42501',null,'Staff cannot change grants');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select public.set_member_centers('30000000-0000-4000-8000-000000000002','{}');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.ok(not public.can_access_center('20000000-0000-4000-8000-000000000001'),'Revocation immediate');
select extensions.is((select count(*)::integer from public.centers),0,'No grants means no branch data');
reset role;
select extensions.ok(exists(select 1 from public.center_grants where deleted_at is not null),'Grant soft deleted');
select extensions.is((select count(*)::integer from public.access_audit where action='set_member_centers'),2,'Only successful changes audited');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select public.set_member_centers('30000000-0000-4000-8000-000000000002',array['20000000-0000-4000-8000-000000000001']::uuid[]);
reset role;
select extensions.is((select count(*)::integer from public.center_grants),1,'Regrant restores existing grant');
update public.centers set deleted_at=now() where id='20000000-0000-4000-8000-000000000001';
set local role authenticated;
select extensions.throws_ok($$select public.set_member_centers('30000000-0000-4000-8000-000000000002',array['20000000-0000-4000-8000-000000000001']::uuid[])$$,'42501',null,'Archived branch rejected');
reset role;

delete from public.access_audit where action='set_member_centers';

-- ACC-06 uses only synthetic members. The fixture contains every permission area.
create temp table test_grid as select jsonb_object_agg(area, jsonb_build_object(
  'entry',jsonb_build_object('day','same','others',true),
  'edit',jsonb_build_object('day','same','others',false),
  'delete',jsonb_build_object('day','none','others',false),
  'report',jsonb_build_object('day','none','others',false))) as grid
from unnest(array['patient','appointment','treatment_settings','clinical_notes','treatment_plan','treatment_done','prescription','files','charting','billing','receipts','credit_notes','expenses','accounting','inventory','lab','tasks','crm','messaging','reports','settings','nabh','membership','ai','access_audit','users','ai_settings','import','patient_merge','plan_purchases']) area;
grant select on test_grid to authenticated;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select extensions.lives_ok($$select public.set_member_access('30000000-0000-4000-8000-000000000002',(select grid from test_grid))$$, 'Owner saves full grid');
select extensions.is((select access_grid from public.list_member_access() where id='30000000-0000-4000-8000-000000000002'), (select grid from test_grid), 'Grid persists');
reset role;
select extensions.ok(exists(select 1 from public.access_audit where action='set_member_access'), 'Grid save audited');
delete from public.access_audit where action='set_member_access';
set local role authenticated;
select extensions.throws_ok($$select public.set_member_access('30000000-0000-4000-8000-000000000003',(select grid from test_grid))$$, '42501', null, 'Cross-org save denied');
select extensions.throws_ok($$select public.set_member_access('30000000-0000-4000-8000-000000000001',(select grid from test_grid))$$, '42501', null, 'Self-owner save denied');
select extensions.throws_ok($$select public.set_member_access('30000000-0000-4000-8000-000000000002','{}')$$, 'P0001', null, 'Incomplete grid denied');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.throws_ok($$select public.set_member_access('30000000-0000-4000-8000-000000000002',(select grid from test_grid))$$, '42501', null, 'Staff cannot change access');
select extensions.throws_ok('select * from public.list_member_access()', '42501', null, 'Staff cannot list access grids');
reset role;
select extensions.ok(not has_table_privilege(r, 'access_audit', p), r || ' cannot ' || p || ' audit')
from unnest(array['anon','authenticated','service_role']) r
cross join unnest(array['INSERT','UPDATE','DELETE','TRUNCATE']) p;
select extensions.ok((select relrowsecurity from pg_class where oid = 'public.access_audit'::regclass), 'Audit enables RLS');
set local role anon;
select extensions.throws_ok('select * from public.list_login_accounts()', '42501', null, 'Anonymous cannot list accounts');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000002', false, false)$$, '42501', null, 'Anonymous cannot manage accounts');
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002","user_metadata":{"is_owner":true}}', true);
select extensions.ok(not public.can_manage_logins(), 'JWT cannot grant owner capability');
select extensions.throws_ok('select * from public.list_login_accounts()', '42501', null, 'Staff cannot list accounts');
select extensions.throws_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000001', 'staff', '{}')$$, '42501', null, 'Staff cannot assign roles');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000003', false, false)$$, '42501', null, 'Staff cannot manage accounts');
select extensions.throws_ok('update public.memberships set is_owner = true', '42501', null, 'No direct owner escalation');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001"}', true);
select extensions.is((select count(*)::int from public.list_login_accounts()), 2, 'Owner lists only own organisation');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000003', false, false)$$, '42501', null, 'Owner cannot change other organisation');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000001', false, false)$$, '42501', null, 'Owner cannot disable own access');

select extensions.is((select count(*)::int from public.list_member_roles()), 2, 'Roles list stays within organisation');
select extensions.throws_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000003', 'doctor', '{}')$$, '42501', null, 'Cross-org role change denied');
select extensions.throws_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000001', 'staff', '{}')$$, '42501', null, 'Self role change denied');
select extensions.throws_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000002', 'platform_admin', '{}')$$, '22023', null, 'Clinic cannot assign platform admin');
select extensions.throws_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000002', 'staff', '{consultant,consultant}')$$, '22023', null, 'Duplicate tags rejected');
select extensions.lives_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000002', 'owner_doctor', '{consultant,orthodontist}')$$, 'Owner assigns role and tags');
reset role;
select extensions.ok((select is_owner and base_role = 'owner_doctor' and role_tags = array['consultant','orthodontist'] from public.memberships where id = '30000000-0000-4000-8000-000000000002'), 'Owner capability follows role');
select extensions.is((select count(*)::int from public.access_audit where action = 'set_member_role'), 1, 'Role change audited once');
delete from public.access_audit where action = 'set_member_role';
update public.memberships set is_owner = false, base_role = 'staff', role_tags = '{}' where id = '30000000-0000-4000-8000-000000000002';
set local role authenticated;
select extensions.lives_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000002', false, false)$$, 'Owner can disable staff login/mobile');
reset role;
select extensions.is((select login_enabled from public.memberships where id = '30000000-0000-4000-8000-000000000002'), false, 'Login change persists');
select extensions.is((select mobile_access_enabled from public.memberships where id = '30000000-0000-4000-8000-000000000002'), false, 'Mobile change persists');
select extensions.is((select count(*)::int from public.access_audit), 1, 'Only successful change appended an audit');
select extensions.is((select before_data->>'login_enabled' from public.access_audit), 'true', 'Audit captures old state');
select extensions.is((select after_data->>'login_enabled' from public.access_audit), 'false', 'Audit captures new state');
select extensions.is((select actor_id from public.access_audit), '00000000-0000-4000-8000-000000000001'::uuid, 'Audit uses trusted actor');
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000002"}', true);
select extensions.is(public.auth_org_id(), null::uuid, 'Existing disabled identity loses all organisation access');
select extensions.is((select count(*)::int from public.organisations), 0, 'Disabled existing session cannot read org');
reset role;

-- Force an audit error to prove the membership update rolls back in the same transaction.
create function public.reject_test_audit() returns trigger language plpgsql as $$begin raise exception 'synthetic audit failure'; end$$;
create trigger reject_test_audit before insert on public.access_audit for each row execute function public.reject_test_audit();
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001"}', true);
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000002', true, true)$$, 'P0001', 'synthetic audit failure', 'Audit failure aborts the write');
reset role;
select extensions.is((select login_enabled from public.memberships where id = '30000000-0000-4000-8000-000000000002'), false, 'Failed audit rolls back login update');
set local role authenticated;
select extensions.throws_ok($$select public.set_member_role('30000000-0000-4000-8000-000000000002', 'doctor', '{consultant}')$$, 'P0001', 'synthetic audit failure', 'Audit failure aborts role and tags');
reset role;
select extensions.is((select base_role from public.memberships where id = '30000000-0000-4000-8000-000000000002'), 'staff', 'Failed role audit rolls back base role');
select extensions.is((select cardinality(role_tags) from public.memberships where id = '30000000-0000-4000-8000-000000000002'), 0, 'Failed role audit rolls back tags');
set local role authenticated;
select extensions.throws_ok($$select public.set_member_access('30000000-0000-4000-8000-000000000002',jsonb_set((select grid from test_grid),'{billing,edit,day}','"any"'))$$, 'P0001', 'synthetic audit failure', 'Audit failure aborts access grid save');
reset role;
select extensions.is((select access_grid from public.memberships where id='30000000-0000-4000-8000-000000000002'),(select grid from test_grid),'Failed access audit rolls back grid');
set local role authenticated;
select extensions.throws_ok($$select public.set_appointment_visibility('30000000-0000-4000-8000-000000000002','own')$$,'P0001','synthetic audit failure','Audit failure aborts visibility update');
reset role;
select extensions.is((select appointment_visibility from public.memberships where id='30000000-0000-4000-8000-000000000002'),'all','Failed audit rolls back visibility');
set local role authenticated;
select extensions.throws_ok($$select public.set_export_disabled('30000000-0000-4000-8000-000000000002',true)$$,'P0001','synthetic audit failure','Export audit failure aborts write');
reset role;
select extensions.ok(not (select export_disabled from public.memberships where id='30000000-0000-4000-8000-000000000002'),'Export restriction rolls back on audit failure');
drop trigger reject_test_audit on public.access_audit;
update public.memberships set deleted_at = now() where id = '30000000-0000-4000-8000-000000000002';
set local role authenticated;
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000002', true, true)$$, '42501', null, 'Deleted accounts cannot be enabled');
reset role;
update public.memberships set login_enabled = false where is_owner;
set local role authenticated;
select extensions.ok(not public.can_manage_logins(), 'Disabled owner has no capability');
select extensions.throws_ok('select * from public.list_login_accounts()', '42501', null, 'Disabled owner cannot list accounts');
reset role;
select extensions.finish();
rollback;

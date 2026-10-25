-- Synthetic fixtures only. Run with: supabase test db tests/rls/tenancy.sql
begin;
create extension if not exists pgtap with schema extensions;
select extensions.no_plan();

insert into auth.users (id) values
 ('00000000-0000-0000-0000-000000000001'),
 ('00000000-0000-0000-0000-000000000002'),
 ('00000000-0000-0000-0000-000000000003');
insert into public.organisations (id, org_id, name) values
 ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Synthetic clinic A'),
 ('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Synthetic clinic B');
insert into public.centers (id, org_id, name) values
 ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Synthetic branch A1'),
 ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Synthetic branch A2'),
 ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Synthetic branch B1');
insert into public.operatories (org_id, center_id, name)
 select org_id, id, 'Synthetic chair' from public.centers;
insert into public.memberships (id, org_id, user_id, login_enabled) values
 ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', true),
 ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', true),
 ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', false);
insert into public.center_grants (org_id, center_id, membership_id) values
 ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001'),
 ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002'),
 ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003');

select extensions.throws_ok($$insert into public.operatories (org_id, center_id, name) values
 ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 'Forged chair')$$,
 '23503', null, 'Composite key rejects cross-org center');
select extensions.throws_ok($$insert into public.center_grants (org_id, center_id, membership_id) values
 ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002')$$,
 '23503', null, 'Composite key rejects cross-org membership');

-- Verify every direct mutation grant, including privileged API role, is closed.
select extensions.ok(not has_table_privilege(r, t, p), r || ' cannot ' || p || ' ' || t)
from unnest(array['anon','authenticated','service_role']) r
cross join unnest(array['organisations','centers','operatories','memberships','center_grants']) t
cross join unnest(array['INSERT','UPDATE','DELETE','TRUNCATE']) p;

set local role anon;
select extensions.throws_ok('select * from public.organisations', '42501', null, 'Anonymous reads denied');
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001","user_metadata":{"org_id":"10000000-0000-0000-0000-000000000002"}}', true);
select extensions.is(public.auth_org_id(), '10000000-0000-0000-0000-000000000001'::uuid, 'JWT metadata cannot select tenant');
select extensions.is((select count(*)::int from public.organisations), 1, 'Only own organisation');
select extensions.is((select count(*)::int from public.centers), 1, 'Only granted center');
select extensions.is((select count(*)::int from public.operatories), 1, 'Only granted center chair');
select extensions.is((select count(*)::int from public.memberships), 1, 'Only own membership');
select extensions.is((select count(*)::int from public.center_grants), 1, 'Only own active grant');
select extensions.ok(not public.can_access_center('20000000-0000-0000-0000-000000000002'), 'Other branch denied');
select extensions.ok(not public.can_access_center('20000000-0000-0000-0000-000000000003'), 'Other tenant denied');
select extensions.throws_ok($$update public.memberships set login_enabled = true$$, '42501', null, 'No direct privilege escalation');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000002"}', true);
select extensions.is((select name from public.organisations), 'Synthetic clinic B', 'Other identity resolves its own tenant');
select extensions.is((select count(*)::int from public.centers), 1, 'Other identity only sees its branch');
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000003"}', true);
select extensions.is(public.auth_org_id(), null::uuid, 'Disabled login has no organisation');
select extensions.is((select count(*)::int from public.operatories), 0, 'Disabled login cannot read chairs');
select set_config('request.jwt.claims', '{}', true);
select extensions.is((select count(*)::int from public.organisations), 0, 'Missing identity fails closed');
reset role;

update public.center_grants set deleted_at = now()
 where membership_id = '30000000-0000-0000-0000-000000000001';
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-000000000001"}', true);
select extensions.is((select count(*)::int from public.centers), 0, 'Revoked grant hides center');
select extensions.is((select count(*)::int from public.operatories), 0, 'Revoked grant hides chairs');
reset role;
update public.center_grants set deleted_at = null;
update public.centers set deleted_at = now() where id = '20000000-0000-0000-0000-000000000001';
set local role authenticated;
select extensions.is((select count(*)::int from public.operatories), 0, 'Deleted parent center hides chairs');
reset role;
update public.organisations set deleted_at = now() where id = '10000000-0000-0000-0000-000000000001';
set local role authenticated;
select extensions.is(public.auth_org_id(), null::uuid, 'Deleted organisation fails closed');
select extensions.is((select count(*)::int from public.memberships), 0, 'Deleted organisation hides membership');
reset role;
select extensions.finish();
rollback;

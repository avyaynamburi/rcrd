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
insert into public.memberships (id, org_id, user_id, login_enabled, is_owner) values
 ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', true, true),
 ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000002', true, false),
 ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000003', true, true);

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
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000003', false, false)$$, '42501', null, 'Staff cannot manage accounts');
select extensions.throws_ok('update public.memberships set is_owner = true', '42501', null, 'No direct owner escalation');

select set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000000001"}', true);
select extensions.is((select count(*)::int from public.list_login_accounts()), 2, 'Owner lists only own organisation');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000003', false, false)$$, '42501', null, 'Owner cannot change other organisation');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000001', false, false)$$, '42501', null, 'Owner cannot disable own access');
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

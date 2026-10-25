begin;
create extension if not exists pgtap with schema extensions;
select extensions.no_plan();
insert into auth.users(id,email) values
 ('00000000-0000-4000-8000-000000000001','synthetic-owner-a@example.invalid'),
 ('00000000-0000-4000-8000-000000000002','synthetic-doctor-a@example.invalid'),
 ('00000000-0000-4000-8000-000000000003','synthetic-owner-b@example.invalid');
insert into public.organisations(id,org_id,name) values
 ('10000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Synthetic A'),
 ('10000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002','Synthetic B');
insert into public.memberships(id,org_id,user_id,login_enabled,is_owner,base_role) values
 ('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001',true,true,'owner'),
 ('30000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002',true,false,'doctor'),
 ('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000003',true,true,'owner');
insert into public.centers(id,org_id,name) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Synthetic branch');
insert into public.center_grants(org_id,center_id,membership_id) values
 ('10000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000002');
set local role anon;
select extensions.throws_ok('select public.list_deleted_people()','42501',null,'Anonymous cannot read deleted people');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',true)$$,'42501',null,'Anonymous cannot delete');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000002"}',true);
select extensions.throws_ok('select public.list_deleted_people()','42501',null,'Doctor cannot read deleted people');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000001',true)$$,'42501',null,'Doctor cannot delete owner');
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000001"}',true);
select extensions.is(public.list_deleted_people(),'[]'::jsonb,'Empty list distinct from failure');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000001',true)$$,'42501',null,'Self deletion denied');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000003',true)$$,'42501',null,'Cross-org deletion denied');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',null)$$,'42501',null,'Null deletion denied');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',false)$$,'42501',null,'Active account cannot be restored');
select extensions.lives_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',true)$$,'Owner deletes doctor');
select extensions.is(jsonb_array_length(public.list_deleted_people()),1,'Deleted doctor listed');
select extensions.is(public.list_deleted_people()->0->>'email','synthetic-doctor-a@example.invalid','Deleted identity retained');
select extensions.is((select count(*)::int from public.list_login_accounts()),1,'Deleted doctor absent from active list');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',true)$$,'42501',null,'Repeated delete denied');
select extensions.throws_ok($$select public.set_login_access('30000000-0000-4000-8000-000000000002',true,true)$$,'42501',null,'Deleted login cannot be enabled');
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000003"}',true);
select extensions.is(public.list_deleted_people(),'[]'::jsonb,'Other org cannot see deleted doctor');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',false)$$,'42501',null,'Cross-org restore denied');
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000002"}',true);
select extensions.is(public.auth_org_id(),null::uuid,'Existing deleted session loses org immediately');
select extensions.ok(not public.can_access_center('20000000-0000-4000-8000-000000000001'),'Existing deleted session loses branch');
select extensions.is((select count(*)::int from public.centers),0,'Deleted session cannot read branch records');
select extensions.throws_ok('select public.list_deleted_people()','42501',null,'Deleted session cannot list deleted people');
reset role;
select extensions.is((select count(*)::int from public.memberships),3,'No identity rows removed');
select extensions.is((select count(*)::int from public.center_grants where deleted_at is null),1,'Historical branch grants retained');
select extensions.is((select count(*)::int from public.access_audit where action='delete_person'),1,'Deletion audited once');
select extensions.ok((select before_data->>'login_enabled'='true' and after_data->>'login_enabled'='false' and after_data->>'deleted_at' is not null from public.access_audit where action='delete_person'),'Audit captures deletion transition');
-- Transaction rollback on audit failure, for restore and delete.
create function public.reject_person_audit() returns trigger language plpgsql as $$begin raise exception 'synthetic audit failure'; end$$;
create trigger reject_person_audit before insert on public.access_audit for each row execute function public.reject_person_audit();
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000001"}',true);
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',false)$$,'P0001','synthetic audit failure','Failed audit aborts restore');
reset role;
select extensions.ok((select deleted_at is not null from public.memberships where id='30000000-0000-4000-8000-000000000002'),'Failed restore retains deletion');
drop trigger reject_person_audit on public.access_audit;
set local role authenticated;
select extensions.lives_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',false)$$,'Owner restores');
select extensions.is(public.list_deleted_people(),'[]'::jsonb,'Restored account leaves deleted list');
reset role;
select extensions.ok((select deleted_at is null and not login_enabled and base_role='doctor' from public.memberships where id='30000000-0000-4000-8000-000000000002'),'Restore keeps role but login stays disabled');
select extensions.is((select count(*)::int from public.access_audit where action='restore_person'),1,'Restore audited once');
create trigger reject_person_audit before insert on public.access_audit for each row execute function public.reject_person_audit();
set local role authenticated;
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',true)$$,'P0001','synthetic audit failure','Failed audit aborts delete');
reset role;
select extensions.ok((select deleted_at is null from public.memberships where id='30000000-0000-4000-8000-000000000002'),'Failed delete leaves account active');
drop trigger reject_person_audit on public.access_audit;
-- Other owners may be deleted, but never the acting owner.
update public.memberships set is_owner=true,base_role='owner',login_enabled=true where id='30000000-0000-4000-8000-000000000002';
set local role authenticated;
select extensions.lives_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000002',true)$$,'Owner can delete another owner');
select extensions.ok(public.can_manage_logins(),'An active acting owner remains');
select set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000002"}',true);
select extensions.ok(not public.can_manage_logins(),'Deleted owner loses capability');
select extensions.throws_ok($$select public.set_person_deleted('30000000-0000-4000-8000-000000000001',true)$$,'42501',null,'Deleted owner cannot delete another owner');
reset role;
select extensions.finish();
rollback;

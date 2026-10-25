import { PersonDeletion } from "./person-deletion";
import {
  type DeletedPerson,
  isDoctorOrOwner,
} from "@/lib/permissions/deleted-people";
import { en } from "@/lib/i18n/en";

export function DeletedPeople({
  people,
  failed,
}: {
  people: DeletedPerson[];
  failed: boolean;
}) {
  return (
    <div className="space-y-5">
      {[true, false].map((doctors) => {
        const title = doctors ? en.people.doctors : en.people.staff;
        const rows = people.filter(
          (person) => isDoctorOrOwner(person.base_role) === doctors,
        );
        return (
          <section
            key={title}
            aria-label={title}
            className="space-y-3 border-t border-border pt-4"
          >
            <h2 className="font-semibold">{title}</h2>
            {failed ? (
              <p role="alert">{en.people.loadFailed}</p>
            ) : rows.length ? (
              rows.map((person) => (
                <article
                  key={person.id}
                  aria-label={person.email ?? person.id}
                  className="space-y-2 rounded border border-border p-4"
                >
                  <h3 className="break-all font-semibold">
                    {person.email ?? en.auth.account}
                  </h3>
                  <p>{en.roles.names[person.base_role]}</p>
                  <PersonDeletion
                    id={person.id}
                    label={person.email ?? en.auth.account}
                    deleted
                  />
                </article>
              ))
            ) : (
              <p>{en.people.empty}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

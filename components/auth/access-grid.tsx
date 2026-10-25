"use client";
import { useRef, useState } from "react";
import {
  type AccessGrid as Grid,
  gridAreas,
  gridActions,
} from "@/lib/permissions/access-grid";
import { saveAccessGrid } from "@/lib/actions/access-grid";
import { useConnection } from "@/components/shell/connection-provider";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";
export function AccessGrid({
  id,
  initial,
  protectedOwner,
}: {
  id: string;
  initial: Grid;
  protectedOwner: boolean;
}) {
  const [grid, setGrid] = useState(initial);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const busy = useRef(false);
  const online = useConnection() === "online";
  const t = en.accessGrid;
  return (
    <details className="border-t border-border pt-3">
      <summary className="cursor-pointer font-semibold">{t.title}</summary>
      <p>{t.note}</p>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy.current || protectedOwner || !online) return;
          busy.current = true;
          setPending(true);
          setMessage("");
          try {
            setMessage(
              (await saveAccessGrid({ membershipId: id, grid })).message,
            );
          } catch {
            setMessage(t.failed);
          } finally {
            busy.current = false;
            setPending(false);
          }
        }}
      >
        <fieldset disabled={pending || protectedOwner || !online}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">{t.title}</caption>
              <thead>
                <tr>
                  <th>{t.area}</th>
                  {gridActions.map((action) => (
                    <th key={action}>{t[action]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gridAreas.map((area, index) => (
                  <tr key={area} className="border-t border-border">
                    <th scope="row" className="p-2 text-left">
                      {t.areas[index]}
                    </th>
                    {gridActions.map((action) => (
                      <td key={action} className="p-2">
                        <select
                          aria-label={`${t.areas[index]}: ${t[action]}`}
                          value={grid[area][action].day}
                          className="rounded border border-border bg-white p-2"
                          onChange={(event) =>
                            setGrid({
                              ...grid,
                              [area]: {
                                ...grid[area],
                                [action]: {
                                  ...grid[area][action],
                                  day: event.target.value as
                                    "any" | "same" | "none",
                                },
                              },
                            })
                          }
                        >
                          {(["any", "same", "none"] as const).map((day) => (
                            <option key={day} value={day}>
                              {t[day]}
                            </option>
                          ))}
                        </select>
                        {(action === "edit" || action === "delete") && (
                          <label className="mt-1 block text-xs">
                            <input
                              type="checkbox"
                              checked={grid[area][action].others}
                              onChange={(event) =>
                                setGrid({
                                  ...grid,
                                  [area]: {
                                    ...grid[area],
                                    [action]: {
                                      ...grid[area][action],
                                      others: event.target.checked,
                                    },
                                  },
                                })
                              }
                            />{" "}
                            {t.others}
                          </label>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button type="submit">{pending ? t.pending : t.save}</Button>
        </fieldset>
        {protectedOwner && <p>{t.protected}</p>}
        {message && <p role="status">{message}</p>}
      </form>
    </details>
  );
}

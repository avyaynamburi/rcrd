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
type AccessGridProps = {
  id: string;
  initial: Grid;
  protectedOwner: boolean;
  sources: { id: string; label: string; grid: Grid }[];
};

export function AccessGrid({
  id,
  initial,
  protectedOwner,
  sources,
}: AccessGridProps) {
  const serverVersion = JSON.stringify([id, initial, protectedOwner]);
  const [previousVersion, setPreviousVersion] = useState(serverVersion);
  const [grid, setGrid] = useState(initial);
  // Revalidation can change role defaults without changing the member ID.
  // Reset before rendering stale grants, but preserve edits on unrelated refreshes.
  if (previousVersion !== serverVersion) {
    setPreviousVersion(serverVersion);
    setGrid(initial);
  }
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
          <label className="mb-3 flex flex-wrap items-center justify-end gap-2">
            {t.copyFrom}
            <select
              aria-label={t.copyFrom}
              className="rounded border border-border bg-white p-2"
              value=""
              disabled={!sources.some((source) => source.id !== id)}
              onChange={(event) => {
                const source = sources.find(
                  (item) => item.id === event.target.value && item.id !== id,
                );
                if (source) {
                  setGrid(structuredClone(source.grid));
                  setMessage(t.copied);
                }
              }}
            >
              <option value="">{t.chooseSource}</option>
              {sources
                .filter((source) => source.id !== id)
                .map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.label}
                  </option>
                ))}
            </select>
          </label>
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

"use client";
import { useRef, useState } from "react";
import {
  clinicRoles,
  roleTags,
  type roleSchema,
} from "@/lib/permissions/roles";
import type { z } from "zod";
import { setMemberRole } from "@/lib/actions/roles";
import { useConnection } from "@/components/shell/connection-provider";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";

export function MemberRole({
  id,
  initialRole,
  initialTags,
  self,
}: {
  id: string;
  initialRole: z.infer<typeof roleSchema>;
  initialTags: (typeof roleTags)[number][];
  self: boolean;
}) {
  const [role, setRole] = useState(initialRole);
  const [tags, setTags] = useState(initialTags);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const submitting = useRef(false);
  const online = useConnection() === "online";
  return (
    <form
      className="space-y-3 border-t border-border pt-3"
      onSubmit={async (event) => {
        event.preventDefault();
        if (submitting.current || self || !online) return;
        submitting.current = true;
        setPending(true);
        setMessage("");
        try {
          const result = await setMemberRole({ membershipId: id, role, tags });
          setMessage(result.message);
        } catch {
          setMessage(en.roles.failed);
        } finally {
          submitting.current = false;
          setPending(false);
        }
      }}
    >
      <fieldset disabled={self || pending || !online} className="space-y-3">
        <legend className="font-semibold">{en.roles.title}</legend>
        <label className="flex items-center gap-3">
          {en.roles.base}
          <select
            className="rounded border border-border bg-white p-2"
            value={role}
            onChange={(event) => setRole(event.target.value as typeof role)}
          >
            {clinicRoles.map((value) => (
              <option key={value} value={value}>
                {en.roles.names[value]}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>{en.roles.tags}</legend>
          <div className="flex flex-wrap gap-4">
            {roleTags.map((tag) => (
              <label key={tag}>
                <input
                  type="checkbox"
                  checked={tags.includes(tag)}
                  onChange={(event) =>
                    setTags(
                      event.target.checked
                        ? [...tags, tag]
                        : tags.filter((value) => value !== tag),
                    )
                  }
                />{" "}
                {en.roles.tagNames[tag]}
              </label>
            ))}
          </div>
        </fieldset>
        <Button type="submit">
          {pending ? en.roles.pending : en.roles.save}
        </Button>
      </fieldset>
      {self && <p>{en.roles.self}</p>}
      {message && <p role="status">{message}</p>}
    </form>
  );
}

"use client";
import { useRef, useState } from "react";
import { setLoginAccess, requestPasswordReset } from "@/lib/actions/auth";
import { useConnection } from "@/components/shell/connection-provider";
import { en } from "@/lib/i18n/en";
import { Button } from "@/components/ui/button";

export function AccountAccess({
  account,
  self,
}: {
  account: {
    id: string;
    email: string | null;
    login_enabled: boolean;
    mobile_access_enabled: boolean;
  };
  self: boolean;
}) {
  const [enabled, setEnabled] = useState(account.login_enabled);
  const [mobile, setMobile] = useState(account.mobile_access_enabled);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const online = useConnection() === "online";
  async function run(reset: boolean) {
    if (submitting.current || !online) return;
    submitting.current = true;
    setPending(true);
    setMessage("");
    try {
      const result = await (reset
        ? requestPasswordReset({ email: account.email })
        : setLoginAccess({
            membershipId: account.id,
            enabled,
            mobileEnabled: mobile,
          }));
      setMessage(result.message);
    } catch {
      setMessage(en.auth.unavailable);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return (
    <section
      className="space-y-3 rounded border border-border p-4"
      aria-label={account.email ?? account.id}
    >
      <h2 className="font-semibold">{account.email ?? en.auth.account}</h2>
      <form
        className="flex flex-wrap items-center gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void run(false);
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={enabled}
            disabled={self || pending}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          {en.auth.enabled}
        </label>
        <label>
          <input
            type="checkbox"
            checked={mobile}
            disabled={self || pending}
            onChange={(e) => setMobile(e.target.checked)}
          />{" "}
          {en.auth.mobile}
        </label>
        <Button type="submit" disabled={self || pending || !online}>
          {pending ? en.auth.pending : en.auth.saveAccess}
        </Button>
      </form>
      {self && <p>{en.auth.ownAccess}</p>}
      <p>{en.auth.resetExplain}</p>
      <Button
        type="button"
        variant="outline"
        disabled={!account.email || pending || !online}
        onClick={() => void run(true)}
      >
        {en.auth.resetOther}
      </Button>
      {message && <p role="status">{message}</p>}
    </section>
  );
}

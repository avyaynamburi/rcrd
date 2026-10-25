"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en } from "@/lib/i18n/en";
import { HelpLink } from "@/components/blocks/help-drawer";

export type Connection = "checking" | "online" | "offline";
const ConnectionContext = createContext<Connection>("checking");
export function useConnection() {
  return useContext(ConnectionContext);
}

export function ConnectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connection, setConnection] = useState<Connection>("checking");
  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function check() {
      controller?.abort();
      if (!navigator.onLine) {
        setConnection("offline");
        return;
      }
      const current = new AbortController();
      controller = current;
      try {
        const response = await fetch("/api/health", {
          cache: "no-store",
          signal: AbortSignal.any([current.signal, AbortSignal.timeout(5000)]),
        });
        if (active && !current.signal.aborted)
          setConnection(response.ok ? "online" : "offline");
      } catch {
        if (active && !current.signal.aborted) setConnection("offline");
      }
    }
    function offline() {
      controller?.abort();
      setConnection("offline");
    }
    void check();
    const interval = setInterval(() => void check(), 30000);
    window.addEventListener("online", check);
    window.addEventListener("offline", offline);
    return () => {
      active = false;
      controller?.abort();
      clearInterval(interval);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", offline);
    };
  }, []);
  return (
    <ConnectionContext.Provider value={connection}>
      <div
        onSubmitCapture={(event) => {
          if (
            connection !== "online" &&
            (event.target as HTMLFormElement).method !== "dialog"
          ) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        {children}
      </div>
    </ConnectionContext.Provider>
  );
}

export function OfflineBanner() {
  const connection = useConnection();
  if (connection !== "offline") return null;
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 border-b border-border bg-warning-surface px-4 py-3 text-sm"
    >
      <p>{en.offlineMessage}</p>
      <HelpLink helpKey="offline" />
    </div>
  );
}

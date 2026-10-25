"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { en } from "@/lib/i18n/en";

export function UpdateNotice() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [failed, setFailed] = useState(false);
  const [applying, setApplying] = useState(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    let disposed = false;
    let registration: ServiceWorkerRegistration | undefined;
    let installing: ServiceWorker | null = null;
    const check = () => {
      if (!disposed && navigator.serviceWorker.controller) {
        setWaiting(registration?.waiting ?? null);
      }
    };
    const found = () => {
      installing?.removeEventListener("statechange", check);
      installing = registration?.installing ?? null;
      installing?.addEventListener("statechange", check);
    };
    const refresh = () => {
      void registration?.update().catch(() => {
        // Offline checks are retried when the window regains focus.
      });
    };
    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((value) => {
        if (disposed) return;
        registration = value;
        check();
        found();
        registration.addEventListener("updatefound", found);
        window.addEventListener("focus", refresh);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    return () => {
      disposed = true;
      registration?.removeEventListener("updatefound", found);
      installing?.removeEventListener("statechange", check);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  // A new worker becoming active must never reload a page with unsaved work.
  // The user reloads separately after finishing their current task.
  if (failed)
    return (
      <p role="status" className="p-3">
        {en.pwaFailed}
      </p>
    );
  if (!waiting && !applying) return null;
  return (
    <aside aria-label={en.pwaTitle} className="border-b bg-secondary p-3">
      <p role="status">{applying ? en.pwaActivated : en.pwaReady}</p>
      {!applying && (
        <Button
          className="mt-2"
          onClick={() => {
            waiting?.postMessage({ type: "ACTIVATE_UPDATE" });
            setApplying(true);
          }}
        >
          {en.pwaApply}
        </Button>
      )}
    </aside>
  );
}

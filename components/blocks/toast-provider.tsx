"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { en } from "@/lib/i18n/en";

export type ToastInput = { kind: "success" | "error"; message: string };
type Toast = ToastInput & { id: number };
const ToastContext = createContext<((input: ToastInput) => void) | null>(null);

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast requires ToastProvider");
  return notify;
}

export function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastInput;
  onDismiss: () => void;
}) {
  const Icon = toast.kind === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div className={`toast-message toast-${toast.kind}`}>
      <Icon size={20} aria-hidden="true" className="shrink-0" />
      <p role={toast.kind === "error" ? "alert" : "status"} aria-atomic="true">
        <strong>{en.toast[toast.kind]}: </strong>
        {toast.message}
      </p>
      <button
        type="button"
        aria-label={en.toast.dismiss}
        onClick={onDismiss}
        className="ml-auto shrink-0 rounded p-1"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach(clearTimeout);
      activeTimers.clear();
    };
  }, []);
  function dismiss(id: number) {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }
  function notify(input: ToastInput) {
    if (!input.message.trim()) return;
    const id = ++nextId.current;
    setToasts((current) => [...current, { ...input, id }]);
    // Errors remain until acknowledged. Successes also remain while read/hovered.
    if (input.kind === "success") {
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 8000),
      );
    }
  }
  return (
    <ToastContext.Provider value={notify}>
      {children}
      <section className="toast-region" aria-label={en.toast.notifications}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onMouseEnter={() => {
              clearTimeout(timers.current.get(toast.id));
              timers.current.delete(toast.id);
            }}
            onFocusCapture={() => {
              clearTimeout(timers.current.get(toast.id));
              timers.current.delete(toast.id);
            }}
          >
            <ToastMessage toast={toast} onDismiss={() => dismiss(toast.id)} />
          </div>
        ))}
      </section>
    </ToastContext.Provider>
  );
}

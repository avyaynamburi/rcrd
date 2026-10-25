import { en } from "@/lib/i18n/en";

export type RecordStamps = {
  created_by: string | null;
  created_at: string;
  updated_by: string | null;
  updated_at: string;
};

export function stampDate(value: string, timeZone = "Asia/Kolkata") {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return en.stamps.unknownDate;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  }).format(date);
}

export function stampUser(id: string | null, users: Record<string, string>) {
  return id
    ? Object.hasOwn(users, id)
      ? users[id]
      : id
    : en.stamps.unknownUser;
}

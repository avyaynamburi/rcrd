import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Synthetic fixtures only. No database connection, credentials or imports.
export function createDemoSeed() {
  const id = (kind: number, index: number) =>
    `00000000-0000-4000-8000-${String(kind).padStart(4, "0")}${String(index).padStart(8, "0")}`;
  const orgId = id(1, 1);
  const centers = ["Demo North", "Demo South"].map((name, index) => ({
    id: id(2, index + 1),
    org_id: orgId,
    name,
    timezone: "Asia/Kolkata",
  }));
  const people = Array.from({ length: 8 }, (_, index) => ({
    id: id(3, index + 1),
    org_id: orgId,
    display_name: `${index < 5 ? "Demo Doctor" : "Demo Staff"} ${index < 5 ? index + 1 : index - 4}`,
    role: index < 5 ? ("doctor" as const) : ("staff" as const),
    center_ids: [centers[index % centers.length].id],
    login_enabled: false,
  }));
  const patients = Array.from({ length: 12 }, (_, index) => ({
    id: id(4, index + 1),
    org_id: orgId,
    center_id: centers[index % centers.length].id,
    display_name: `Synthetic Patient ${String(index + 1).padStart(2, "0")}`,
    external_source: "synthetic-demo",
    external_id: `patient-${index + 1}`,
    consent: { messaging: false, ai: false, portal: false },
  }));
  return {
    fixture_version: 1,
    synthetic: true,
    organisation: { id: orgId, org_id: orgId, name: "Rcrd Synthetic Demo" },
    centers,
    people,
    patients,
  };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(JSON.stringify(createDemoSeed(), null, 2));
}

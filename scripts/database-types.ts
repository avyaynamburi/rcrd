import { spawnSync } from "node:child_process";
import { renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function checkedTypes(result: {
  status: number | null;
  stdout: string;
}): string {
  if (result.status !== 0 || !result.stdout.includes("export type Json =")) {
    throw new Error(
      "Type generation failed. Start local Supabase with npm run db:start, then retry. Existing types have been preserved.",
    );
  }
  return result.stdout;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const result = spawnSync(
    process.platform === "win32" ? "supabase.cmd" : "supabase",
    ["gen", "types", "typescript", "--local", "--schema", "public"],
    { encoding: "utf8", shell: process.platform === "win32" },
  );
  try {
    const types = checkedTypes(result);
    const target = resolve("lib/supabase/database.types.ts");
    writeFileSync(`${target}.tmp`, types);
    renameSync(`${target}.tmp`, target);
    console.log("Updated lib/supabase/database.types.ts");
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "Type generation failed.",
    );
    process.exitCode = 1;
  }
}

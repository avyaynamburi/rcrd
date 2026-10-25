export function readOpenGroups(
  raw: string | null,
  titles: readonly string[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(value)
      ? value.filter(
          (id): id is string => typeof id === "string" && titles.includes(id),
        )
      : [];
  } catch {
    return [];
  }
}

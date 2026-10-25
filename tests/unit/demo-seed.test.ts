import { describe, expect, it } from "vitest";
import { createDemoSeed } from "../../scripts/demo-seed";

describe("synthetic demo seed", () => {
  it("reproduces stable IDs without random or clock-dependent values", () => {
    expect(createDemoSeed()).toEqual(createDemoSeed());
    const seed = createDemoSeed();
    const records = [
      seed.organisation,
      ...seed.centers,
      ...seed.people,
      ...seed.patients,
    ];
    expect(new Set(records.map((row) => row.id)).size).toBe(records.length);
    for (const row of records) {
      expect(row.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      );
      expect(row.org_id).toBe(seed.organisation.id);
    }
  });

  it("provides two centers, five doctors, three staff and patients at both centers", () => {
    const seed = createDemoSeed();
    expect(seed.centers).toHaveLength(2);
    expect(
      seed.people.filter((person) => person.role === "doctor"),
    ).toHaveLength(5);
    expect(
      seed.people.filter((person) => person.role === "staff"),
    ).toHaveLength(3);
    expect(seed.patients).toHaveLength(12);
    const centers = new Set(seed.centers.map((center) => center.id));
    for (const person of seed.people) {
      expect(person.center_ids.every((id) => centers.has(id))).toBe(true);
      expect(person.login_enabled).toBe(false);
    }
    expect(new Set(seed.patients.map((patient) => patient.center_id))).toEqual(
      centers,
    );
    for (const patient of seed.patients) {
      expect(patient.consent).toEqual({
        messaging: false,
        ai: false,
        portal: false,
      });
      expect(patient.external_source).toBe("synthetic-demo");
    }
  });
});

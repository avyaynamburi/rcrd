import { z } from "zod";

export const passwordSchema = z.string().min(12).max(128);
export const loginSchema = z
  .object({
    identifier: z.string().trim().min(1).max(254),
    password: z.string().min(1).max(128),
  })
  .strict();
export const recoverySchema = z.object({ email: z.email().max(254) }).strict();
export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .strict()
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
  });
export const loginAccessSchema = z
  .object({
    membershipId: z.uuid(),
    enabled: z.boolean(),
    mobileEnabled: z.boolean(),
  })
  .strict();

/** Indian local mobile numbers get the country prefix; international numbers require +. */
export function loginIdentity(
  identifier: string,
): { email: string } | { phone: string } | null {
  if (z.email().safeParse(identifier).success) return { email: identifier };
  const compact = identifier.replace(/[\s()-]/g, "");
  const phone = /^[6-9]\d{9}$/.test(compact) ? `+91${compact}` : compact;
  return /^\+[1-9]\d{7,14}$/.test(phone) ? { phone } : null;
}

export function isMobileDevice(userAgent: string) {
  return /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(userAgent);
}

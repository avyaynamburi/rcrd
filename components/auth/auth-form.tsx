"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  signIn,
  requestPasswordReset,
  changePassword,
} from "@/lib/actions/auth";
import { en } from "@/lib/i18n/en";
import { useConnection } from "@/components/shell/connection-provider";
import { Button } from "@/components/ui/button";
import { HelpLink } from "@/components/blocks/help-drawer";

type Fields = {
  identifier: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export function AuthForm({
  mode,
  configured,
  invalidLink = false,
}: {
  mode: "login" | "recovery" | "password";
  configured: boolean;
  invalidLink?: boolean;
}) {
  const {
    register,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm<Fields>();
  const [message, setMessage] = useState(
    invalidLink ? en.auth.resetInvalid : "",
  );
  const [success, setSuccess] = useState(false);
  const submitting = useRef(false);
  const connection = useConnection();
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    await handleSubmit(async (fields) => {
      if (submitting.current || connection !== "online") return;
      submitting.current = true;
      setMessage("");
      setSuccess(false);
      try {
        const result = await (mode === "login"
          ? signIn({ identifier: fields.identifier, password: fields.password })
          : mode === "recovery"
            ? requestPasswordReset({ email: fields.email })
            : changePassword({
                password: fields.password,
                confirmPassword: fields.confirmPassword,
              }));
        setMessage(result.message);
        setSuccess(Boolean(result.success));
        if (mode === "password" && result.success) {
          resetField("password");
          resetField("confirmPassword");
        }
      } catch {
        setMessage(en.auth.unavailable);
      } finally {
        submitting.current = false;
      }
    })(event);
  };
  const inputClass =
    "mt-1 block w-full rounded border border-border bg-background px-3 py-2";
  return (
    <main id="main" className="mx-auto w-full max-w-md space-y-5 px-6 py-10">
      <p className="text-2xl font-semibold text-primary">{en.appName}</p>
      <h1 className="text-xl font-semibold">
        {mode === "login"
          ? en.auth.login
          : mode === "recovery"
            ? en.auth.recovery
            : en.auth.change}
      </h1>
      <p>{en.auth.noShared}</p>
      {!configured && <p role="status">{en.auth.unavailable}</p>}
      <form onSubmit={submit} className="space-y-4">
        {mode === "login" && (
          <label className="block">
            {en.auth.identifier}
            <input
              className={inputClass}
              autoComplete="username"
              required
              maxLength={254}
              {...register("identifier")}
            />
          </label>
        )}
        {mode === "recovery" ? (
          <label className="block">
            {en.auth.email}
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              {...register("email")}
            />
          </label>
        ) : (
          <label className="block">
            {mode === "login" ? en.auth.password : en.auth.newPassword}
            <input
              className={inputClass}
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={mode === "password" ? 12 : 1}
              maxLength={128}
              {...register("password")}
            />
          </label>
        )}
        {mode === "password" && (
          <label className="block">
            {en.auth.confirmPassword}
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              required
              maxLength={128}
              {...register("confirmPassword")}
            />
          </label>
        )}
        {message && <p role={success ? "status" : "alert"}>{message}</p>}
        <Button
          type="submit"
          disabled={!configured || isSubmitting || connection !== "online"}
        >
          {isSubmitting
            ? en.auth.pending
            : mode === "login"
              ? en.auth.login
              : mode === "recovery"
                ? en.auth.sendLink
                : en.auth.savePassword}
        </Button>
      </form>
      <div className="flex flex-wrap gap-4">
        <Link
          className="underline"
          href={mode === "login" ? "/forgot-password" : "/login"}
        >
          {mode === "login" ? en.auth.forgot : en.auth.back}
        </Link>
        <HelpLink helpKey="accounts" />
      </div>
    </main>
  );
}

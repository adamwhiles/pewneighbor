"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { churchRegistrationSchema, type ChurchRegistrationInput } from "@/lib/validation/schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { isFreeEmailDomain } from "@/lib/utils";

export default function ChurchRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChurchRegistrationInput>({
    resolver: zodResolver(churchRegistrationSchema) as unknown as Resolver<ChurchRegistrationInput>,
  });

  const adminEmail = watch("adminEmail") ?? "";
  const isPersonalEmail = adminEmail.includes("@") && isFreeEmailDomain(adminEmail);

  async function onSubmit(data: ChurchRegistrationInput) {
    setError(null);
    try {
      const res = await fetch("/api/churches/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <Card className="w-full max-w-lg text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-bold text-slate-900">
              Application received!
            </h2>
            <p className="text-slate-600">
              Thank you for registering your church. We&apos;ll review your
              application and send your join code to the email you provided
              within 1-2 business days.
            </p>
            <Link href="/">
              <Button variant="outline" className="mt-4">
                Back to home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Image src="/logo.svg" alt="PewNeighbor" width={36} height={36} />
                  <span className="text-xl font-bold text-navy-800">PewNeighbor</span>
      </Link>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Register your church</CardTitle>
          <CardDescription>
            Once approved, you&apos;ll receive a unique join code to share with
            your congregation. Free for up to 75 members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <Input
              label="Church name"
              placeholder="Grace Community Church"
              error={errors.name?.message}
              required
              {...register("name")}
            />

            <Input
              label="Denomination (optional)"
              placeholder="e.g. Baptist, Methodist, Non-denominational"
              error={errors.denomination?.message}
              {...register("denomination")}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Nashville"
                error={errors.city?.message}
                required
                {...register("city")}
              />
              <Input
                label="State / Province"
                placeholder="TN"
                error={errors.stateProvince?.message}
                {...register("stateProvince")}
              />
            </div>

            <Input
              label="Church website (optional)"
              type="url"
              placeholder="https://gracecommunitychurch.org"
              error={errors.websiteUrl?.message}
              {...register("websiteUrl")}
            />

            <div className="space-y-1.5">
              <Input
                label="Admin email address"
                type="email"
                placeholder="pastor@gracecommunitychurch.org"
                error={errors.adminEmail?.message}
                required
                hint="Use your church email address if possible — it helps us verify your church."
                {...register("adminEmail")}
              />
              {isPersonalEmail && (
                <p className="text-xs text-amber-600">
                  ⚠️ Personal email addresses may slow verification. A church
                  email helps us approve your application faster.
                </p>
              )}
            </div>

            <div className="rounded-lg bg-navy-50 p-4 text-sm text-navy-800">
              <p className="font-medium mb-1">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1 text-navy-700">
                <li>We review your application (1-2 business days)</li>
                <li>You receive a unique 8-character join code by email</li>
                <li>Share the code with your congregation</li>
                <li>Members sign up and start connecting!</li>
              </ol>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              size="lg"
              className="w-full"
            >
              Submit application
            </Button>

            <p className="text-center text-xs text-slate-500">
              By registering, you agree to our{" "}
              <Link href="/terms" className="underline">Terms of Service</Link>{" "}
              and confirm this is a legitimate church community.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

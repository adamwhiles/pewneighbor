"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from "@/lib/validation/schemas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const STEPS = ["join-code", "basics", "interests", "preferences"] as const;
type Step = (typeof STEPS)[number];

const INTERESTS_BY_CATEGORY: Record<string, string[]> = {
  "Outdoors": ["Hiking", "Camping", "Gardening", "Cycling", "Running", "Fishing", "Rock Climbing"],
  "Arts & Creativity": ["Painting", "Photography", "Writing", "Crafts & DIY", "Music (Playing)", "Music (Listening)", "Singing / Choir"],
  "Food & Drink": ["Cooking", "Baking", "Coffee", "Trying New Restaurants", "Wine & Cheese"],
  "Games & Entertainment": ["Board Games", "Video Games", "Card Games", "Trivia", "Puzzles", "Movies", "TV Shows", "Escape Rooms"],
  "Faith & Spiritual": ["Bible Study", "Prayer Groups", "Worship Music", "Theology & Books", "Serving / Volunteering", "Missions"],
  "Fitness & Wellness": ["Gym / Weightlifting", "Yoga", "Team Sports", "Martial Arts", "Swimming"],
  "Learning & Growth": ["Reading", "Podcasts", "History", "Science & Technology", "Personal Finance", "Languages"],
  "Family & Community": ["Parenting", "Fostering / Adoption", "Community Service", "Mentoring"],
  "Travel & Adventure": ["Travel", "Road Trips", "Backpacking"],
};

const ALL_INTERESTS = Object.values(INTERESTS_BY_CATEGORY).flat();

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("join-code");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema) as unknown as Resolver<ProfileInput>,
    defaultValues: {
      isCouple: false,
      availability: [],
      interestIds: [],
    },
  });

  type AvailabilityOption = "weekends" | "weekday_evenings" | "flexible";

  const isCouple = watch("isCouple");
  const aboutMe = watch("aboutMe") ?? "";
  const availability = (watch("availability") ?? []) as AvailabilityOption[];

  function toggleInterest(label: string) {
    const next = selectedInterests.includes(label)
      ? selectedInterests.filter((i) => i !== label)
      : selectedInterests.length < 15
      ? [...selectedInterests, label]
      : selectedInterests;
    setSelectedInterests(next);
    setValue("interestIds", next); // temporarily storing labels; server resolves to UUIDs
  }

  function toggleAvailability(value: AvailabilityOption) {
    const next: AvailabilityOption[] = availability.includes(value)
      ? availability.filter((v) => v !== value)
      : [...availability, value];
    setValue("availability", next);
  }

  async function goNext() {
    const stepFields: Record<Step, (keyof ProfileInput)[]> = {
      "join-code": ["joinCode"],
      "basics": ["displayName", "ageRange", "gender"],
      "interests": ["interestIds"],
      "preferences": ["lookingFor", "availability"],
    };
    const valid = await trigger(stepFields[step]);
    if (!valid) return;

    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1]);
    }
  }

  async function onSubmit(data: ProfileInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, interestLabels: selectedInterests }),
      });

      if (!res.ok) {
        const body = await res.json();
        setServerError(body.error ?? "Something went wrong.");
        return;
      }

      router.push("/discover");
    } catch {
      setServerError("Network error. Please try again.");
    }
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* Progress bar */}
      <div className="mb-8 w-full max-w-lg">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Step {stepIndex + 1} of {STEPS.length}</span>
          <span>{Math.round(((stepIndex + 1) / STEPS.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-navy-700 transition-all"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        {/* Step 1: Join code */}
        {step === "join-code" && (
          <Card>
            <CardHeader>
              <CardTitle>Enter your church join code</CardTitle>
              <CardDescription>
                Ask your church admin for the 8-character code to join your
                church community on PewNeighbor.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input
                label="Join code"
                placeholder="e.g. AB3K7MNP"
                maxLength={8}
                className="text-center text-lg font-mono tracking-widest uppercase"
                error={errors.joinCode?.message}
                {...register("joinCode", {
                  setValueAs: (v) => v?.toUpperCase().trim(),
                })}
              />
              <p className="text-sm text-slate-500">
                Don&apos;t have a code? Your church may need to{" "}
                <a href="/churches/register" className="text-navy-700 underline">
                  register first
                </a>
                .
              </p>
              <Button type="button" onClick={goNext} size="lg" className="w-full">
                Continue →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Basics */}
        {step === "basics" && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us about yourself</CardTitle>
              <CardDescription>
                This info is only visible to members of your church.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                <input
                  type="checkbox"
                  id="isCouple"
                  className="h-4 w-4 rounded"
                  {...register("isCouple")}
                />
                <label htmlFor="isCouple" className="text-sm font-medium text-slate-700">
                  We&apos;re a couple looking for couple-friends
                </label>
              </div>

              <Input
                label={isCouple ? "Your names (e.g. John & Sarah)" : "Your first name"}
                placeholder={isCouple ? "John & Sarah" : "Sarah"}
                error={errors.displayName?.message}
                required
                {...register("displayName")}
              />

              {isCouple && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                      Your age range <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
                      {...register("ageRange")}
                    >
                      <option value="">Select...</option>
                      {["18-25", "26-35", "36-45", "46-55", "55+"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {errors.ageRange && <p className="text-xs text-red-600">{errors.ageRange.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Partner&apos;s age range</label>
                    <select
                      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-600 focus:outline-none"
                      {...register("partnerAgeRange")}
                    >
                      <option value="">Select...</option>
                      {["18-25", "26-35", "36-45", "46-55", "55+"].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {!isCouple && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Age range <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
                    {...register("ageRange")}
                  >
                    <option value="">Select your age range...</option>
                    {["18-25", "26-35", "36-45", "46-55", "55+"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.ageRange && <p className="text-xs text-red-600">{errors.ageRange.message}</p>}
                </div>
              )}

              {!isCouple && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-600/20"
                    {...register("gender")}
                  >
                    <option value="">Select...</option>
                    <option value="man">Man</option>
                    <option value="woman">Woman</option>
                    <option value="nonbinary">Non-binary</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="text-xs text-red-600">{errors.gender.message}</p>}
                </div>
              )}

              <Textarea
                label="About me (optional)"
                placeholder="A little about yourself, what you enjoy, what you're looking for in a friend..."
                rows={4}
                maxChars={500}
                charCount={aboutMe.length}
                {...register("aboutMe")}
              />

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("join-code")} className="flex-1">
                  ← Back
                </Button>
                <Button type="button" onClick={goNext} className="flex-1">
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Interests */}
        {step === "interests" && (
          <Card>
            <CardHeader>
              <CardTitle>What are your interests?</CardTitle>
              <CardDescription>
                Select up to 15. These help match you with like-minded friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {errors.interestIds && (
                <p className="text-sm text-red-600">{errors.interestIds.message}</p>
              )}
              <p className="text-sm text-slate-500">
                {selectedInterests.length}/15 selected
              </p>
              {Object.entries(INTERESTS_BY_CATEGORY).map(([category, items]) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                          selectedInterests.includes(item)
                            ? "border-navy-700 bg-navy-700 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-navy-300 hover:bg-navy-50",
                          selectedInterests.length >= 15 && !selectedInterests.includes(item) && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStep("basics")} className="flex-1">
                  ← Back
                </Button>
                <Button type="button" onClick={goNext} className="flex-1">
                  Continue →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preferences */}
        {step === "preferences" && (
          <Card>
            <CardHeader>
              <CardTitle>Almost done!</CardTitle>
              <CardDescription>
                Tell us what kind of friendship you&apos;re looking for.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {serverError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  I&apos;m looking for... <span className="text-red-500">*</span>
                </label>
                {[
                  { value: "individual", label: "Individual friend(s)", desc: "Looking for 1-on-1 friendships" },
                  { value: "couple", label: "Couple friends", desc: "We're a couple looking for other couples to hang out with" },
                  { value: "both", label: "Both", desc: "Open to any kind of friendship" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                      watch("lookingFor") === option.value
                        ? "border-navy-600 bg-navy-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="mt-0.5"
                      {...register("lookingFor")}
                    />
                    <div>
                      <p className="font-medium text-slate-900">{option.label}</p>
                      <p className="text-sm text-slate-500">{option.desc}</p>
                    </div>
                  </label>
                ))}
                {errors.lookingFor && <p className="text-xs text-red-600">{errors.lookingFor.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  When are you generally available? <span className="text-red-500">*</span>
                </label>
                {([
                  { value: "weekends", label: "Weekends" },
                  { value: "weekday_evenings", label: "Weekday evenings" },
                  { value: "flexible", label: "Flexible / varies" },
                ] as const).map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      availability.includes(option.value)
                        ? "border-navy-600 bg-navy-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={availability.includes(option.value)}
                      onChange={() => toggleAvailability(option.value as AvailabilityOption)}
                      className="h-4 w-4 rounded"
                    />
                    <span className="font-medium text-slate-900">{option.label}</span>
                  </label>
                ))}
                {errors.availability && <p className="text-xs text-red-600">{errors.availability.message}</p>}
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep("interests")} className="flex-1">
                  ← Back
                </Button>
                <Button type="submit" loading={isSubmitting} className="flex-1">
                  Create my profile ✓
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

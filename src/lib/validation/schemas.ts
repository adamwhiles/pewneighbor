import { z } from "zod";

// ─── Church Registration ───────────────────────────────────────────────────────

export const churchRegistrationSchema = z.object({
  name: z.string().min(2, "Church name is required").max(100),
  denomination: z.string().max(100).optional(),
  city: z.string().min(1, "City is required").max(100),
  stateProvince: z.string().max(100).optional(),
  country: z.string().length(2).default("US"),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  adminEmail: z.string().email("Please enter a valid email address"),
  adminEmailDomain: z.string().optional(), // derived from email
});

export type ChurchRegistrationInput = z.infer<typeof churchRegistrationSchema>;

// ─── User Profile ─────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must be 50 characters or less"),
  ageRange: z.enum(["18-25", "26-35", "36-45", "46-55", "55+"]),
  gender: z.enum(["man", "woman", "nonbinary", "prefer_not_to_say"]),
  aboutMe: z
    .string()
    .max(500, "About me must be 500 characters or less")
    .optional(),
  lookingFor: z.enum(["individual", "couple", "both"]),
  availability: z
    .array(z.enum(["weekends", "weekday_evenings", "flexible"]))
    .min(1, "Select at least one availability option"),
  isCouple: z.boolean().default(false),
  partnerName: z.string().max(50).optional(),
  partnerAgeRange: z
    .enum(["18-25", "26-35", "36-45", "46-55", "55+"])
    .optional(),
  interestIds: z
    .array(z.string().uuid())
    .min(1, "Select at least one interest")
    .max(15, "Select up to 15 interests"),
  joinCode: z.string().length(8, "Join code must be 8 characters"),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// ─── Meetup Suggestion ────────────────────────────────────────────────────────

export const meetupSuggestionSchema = z.object({
  connectionId: z.string().uuid(),
  suggestedActivity: z.string().max(200).optional(),
  suggestedDateRange: z.string().max(200).optional(),
  suggestedLocation: z.string().max(200).optional(),
});

export type MeetupSuggestionInput = z.infer<typeof meetupSuggestionSchema>;

// ─── Report ───────────────────────────────────────────────────────────────────

export const reportSchema = z.object({
  reportedProfileId: z.string().uuid(),
  reportedMessageId: z.string().uuid().optional(),
  reason: z.enum([
    "harassment",
    "inappropriate_content",
    "spam",
    "other",
  ]),
  detail: z.string().max(1000).optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;

// ─── Message ──────────────────────────────────────────────────────────────────

export const messageSchema = z.object({
  connectionId: z.string().uuid(),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message must be 2000 characters or less"),
});

export type MessageInput = z.infer<typeof messageSchema>;

import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  primaryKey,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const orgStatusEnum = pgEnum("org_status", [
  "pending",
  "active",
  "suspended",
]);

export const memberRoleEnum = pgEnum("member_role", ["member", "admin"]);

export const memberStatusEnum = pgEnum("member_status", [
  "active",
  "suspended",
]);

export const ageRangeEnum = pgEnum("age_range", [
  "18-25",
  "26-35",
  "36-45",
  "46-55",
  "55+",
]);

export const genderEnum = pgEnum("gender", [
  "man",
  "woman",
  "nonbinary",
  "prefer_not_to_say",
]);

export const lookingForEnum = pgEnum("looking_for", [
  "individual",
  "couple",
  "both",
]);

export const waveStatusEnum = pgEnum("wave_status", [
  "pending",
  "accepted",
  "declined",
]);

export const connectionStatusEnum = pgEnum("connection_status", [
  "active",
  "archived",
]);

export const meetupStatusEnum = pgEnum("meetup_status", [
  "pending",
  "accepted",
  "declined",
  "expired",
]);

export const reportReasonEnum = pgEnum("report_reason", [
  "harassment",
  "inappropriate_content",
  "spam",
  "other",
]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "reviewed",
  "resolved",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "seed",
  "community",
  "parish",
]);

// ─── Organizations (Churches) ─────────────────────────────────────────────────

export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    denomination: text("denomination"),
    city: text("city").notNull(),
    stateProvince: text("state_province"),
    country: text("country").notNull().default("US"),
    websiteUrl: text("website_url"),
    logoBlobKey: text("logo_blob_key"),
    joinCode: text("join_code").notNull().unique(),
    adminEmail: text("admin_email").notNull(),
    status: orgStatusEnum("status").notNull().default("pending"),
    subscriptionTier: subscriptionTierEnum("subscription_tier")
      .notNull()
      .default("seed"),
    memberLimit: integer("member_limit").notNull().default(75),
    verificationNotes: text("verification_notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("org_status_idx").on(t.status)]
);

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  name: text("name"), // required by Auth.js adapter
  image: text("image"), // required by Auth.js adapter
  isAppAdmin: boolean("is_app_admin").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

// ─── Auth.js Required Tables ──────────────────────────────────────────────────

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })]
);

// ─── Organization Members ─────────────────────────────────────────────────────

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("member"),
    status: memberStatusEnum("status").notNull().default("active"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("org_member_unique").on(t.userId, t.organizationId),
    index("org_members_org_idx").on(t.organizationId, t.status),
  ]
);

// ─── Interests (predefined list) ──────────────────────────────────────────────

export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: text("label").notNull().unique(),
  category: text("category").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    // Display info
    displayName: text("display_name").notNull(),
    ageRange: ageRangeEnum("age_range").notNull(),
    gender: genderEnum("gender").notNull(),
    aboutMe: text("about_me"),
    // Matching preferences
    lookingFor: lookingForEnum("looking_for").notNull(),
    availability: text("availability").array().notNull().default([]),
    // Couple mode
    isCouple: boolean("is_couple").notNull().default(false),
    partnerName: text("partner_name"), // e.g. "John & Sarah"
    partnerAgeRange: ageRangeEnum("partner_age_range"),
    // Photo (private blob key)
    photoBlobKey: text("photo_blob_key"),
    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("profiles_org_idx").on(t.organizationId)]
);

// ─── Profile Interests ────────────────────────────────────────────────────────

export const profileInterests = pgTable(
  "profile_interests",
  {
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    interestId: uuid("interest_id")
      .notNull()
      .references(() => interests.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.profileId, t.interestId] })]
);

// ─── Waves ────────────────────────────────────────────────────────────────────

export const waves = pgTable(
  "waves",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    status: waveStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("wave_unique").on(t.senderId, t.recipientId),
    index("waves_recipient_idx").on(t.recipientId, t.status),
    index("waves_org_idx").on(t.organizationId),
  ]
);

// ─── Connections ──────────────────────────────────────────────────────────────

export const connections = pgTable("connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  initiatingWaveId: uuid("initiating_wave_id").references(() => waves.id, {
    onDelete: "set null",
  }),
  status: connectionStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const connectionMembers = pgTable(
  "connection_members",
  {
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    profileId: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.connectionId, t.profileId] })]
);

// ─── Messages ─────────────────────────────────────────────────────────────────

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => connections.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    // Encrypted content — application-level AES-256-GCM
    ciphertext: text("ciphertext").notNull(),
    iv: text("iv").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [index("messages_connection_idx").on(t.connectionId, t.createdAt)]
);

// ─── Meetup Suggestions ───────────────────────────────────────────────────────

export const meetupSuggestions = pgTable("meetup_suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  connectionId: uuid("connection_id")
    .notNull()
    .references(() => connections.id, { onDelete: "cascade" }),
  proposerId: uuid("proposer_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  suggestedActivity: text("suggested_activity"),
  suggestedDateRange: text("suggested_date_range"),
  suggestedLocation: text("suggested_location"),
  status: meetupStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reporterId: uuid("reporter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reportedProfileId: uuid("reported_profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  reportedMessageId: uuid("reported_message_id").references(() => messages.id, {
    onDelete: "set null",
  }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  reason: reportReasonEnum("reason").notNull(),
  detail: text("detail"),
  status: reportStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Blocks ───────────────────────────────────────────────────────────────────

export const blocks = pgTable(
  "blocks",
  {
    blockerId: uuid("blocker_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    blockedId: uuid("blocked_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.blockerId, t.blockedId] })]
);

// ─── Notification Preferences ─────────────────────────────────────────────────

export const notificationPreferences = pgTable("notification_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  waveReceived: boolean("wave_received").notNull().default(true),
  connectionMade: boolean("connection_made").notNull().default(true),
  messageDigest: boolean("message_digest").notNull().default(true),
  meetupSuggested: boolean("meetup_suggested").notNull().default(true),
});

// ─── Auth Rate Limiting ───────────────────────────────────────────────────────

export const authRateLimits = pgTable("auth_rate_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  attempts: integer("attempts").notNull().default(1),
  windowStart: timestamp("window_start", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  profiles: many(profiles),
  waves: many(waves),
  connections: many(connections),
  reports: many(reports),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  memberships: many(organizationMembers),
  notificationPreferences: one(notificationPreferences, {
    fields: [users.id],
    references: [notificationPreferences.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, { fields: [profiles.userId], references: [users.id] }),
  organization: one(organizations, {
    fields: [profiles.organizationId],
    references: [organizations.id],
  }),
  interests: many(profileInterests),
  sentWaves: many(waves, { relationName: "sentWaves" }),
  receivedWaves: many(waves, { relationName: "receivedWaves" }),
  connections: many(connectionMembers),
}));

export const wavesRelations = relations(waves, ({ one }) => ({
  sender: one(profiles, {
    fields: [waves.senderId],
    references: [profiles.id],
    relationName: "sentWaves",
  }),
  recipient: one(profiles, {
    fields: [waves.recipientId],
    references: [profiles.id],
    relationName: "receivedWaves",
  }),
  organization: one(organizations, {
    fields: [waves.organizationId],
    references: [organizations.id],
  }),
}));

export const connectionsRelations = relations(connections, ({ many, one }) => ({
  members: many(connectionMembers),
  messages: many(messages),
  meetupSuggestions: many(meetupSuggestions),
  initiatingWave: one(waves, {
    fields: [connections.initiatingWaveId],
    references: [waves.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  connection: one(connections, {
    fields: [messages.connectionId],
    references: [connections.id],
  }),
  sender: one(profiles, {
    fields: [messages.senderId],
    references: [profiles.id],
  }),
}));

export const profileInterestsRelations = relations(profileInterests, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileInterests.profileId],
    references: [profiles.id],
  }),
  interest: one(interests, {
    fields: [profileInterests.interestId],
    references: [interests.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  reporter: one(users, { fields: [reports.reporterId], references: [users.id] }),
  reportedProfile: one(profiles, { fields: [reports.reportedProfileId], references: [profiles.id] }),
  organization: one(organizations, { fields: [reports.organizationId], references: [organizations.id] }),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  user: one(users, { fields: [organizationMembers.userId], references: [users.id] }),
  organization: one(organizations, { fields: [organizationMembers.organizationId], references: [organizations.id] }),
}));

export const connectionMembersRelations = relations(connectionMembers, ({ one }) => ({
  connection: one(connections, {
    fields: [connectionMembers.connectionId],
    references: [connections.id],
  }),
  profile: one(profiles, {
    fields: [connectionMembers.profileId],
    references: [profiles.id],
  }),
}));

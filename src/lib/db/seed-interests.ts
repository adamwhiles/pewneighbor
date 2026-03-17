/**
 * Seed script for the interests table.
 * Run once after initial migration: npx tsx src/lib/db/seed-interests.ts
 */
import { db } from "./index";
import { interests } from "./schema";

const INTERESTS = [
  // Outdoors
  { label: "Hiking", category: "Outdoors" },
  { label: "Camping", category: "Outdoors" },
  { label: "Gardening", category: "Outdoors" },
  { label: "Cycling", category: "Outdoors" },
  { label: "Running", category: "Outdoors" },
  { label: "Fishing", category: "Outdoors" },
  { label: "Rock Climbing", category: "Outdoors" },
  // Arts & Creativity
  { label: "Painting", category: "Arts & Creativity" },
  { label: "Photography", category: "Arts & Creativity" },
  { label: "Writing", category: "Arts & Creativity" },
  { label: "Crafts & DIY", category: "Arts & Creativity" },
  { label: "Music (Playing)", category: "Arts & Creativity" },
  { label: "Music (Listening)", category: "Arts & Creativity" },
  { label: "Singing / Choir", category: "Arts & Creativity" },
  { label: "Drawing", category: "Arts & Creativity" },
  // Food & Drink
  { label: "Cooking", category: "Food & Drink" },
  { label: "Baking", category: "Food & Drink" },
  { label: "Coffee", category: "Food & Drink" },
  { label: "Trying New Restaurants", category: "Food & Drink" },
  { label: "Wine & Cheese", category: "Food & Drink" },
  // Games & Entertainment
  { label: "Board Games", category: "Games & Entertainment" },
  { label: "Video Games", category: "Games & Entertainment" },
  { label: "Card Games", category: "Games & Entertainment" },
  { label: "Trivia", category: "Games & Entertainment" },
  { label: "Puzzles", category: "Games & Entertainment" },
  { label: "Movies", category: "Games & Entertainment" },
  { label: "TV Shows", category: "Games & Entertainment" },
  { label: "Escape Rooms", category: "Games & Entertainment" },
  // Faith & Spiritual
  { label: "Bible Study", category: "Faith & Spiritual" },
  { label: "Prayer Groups", category: "Faith & Spiritual" },
  { label: "Worship Music", category: "Faith & Spiritual" },
  { label: "Theology & Books", category: "Faith & Spiritual" },
  { label: "Serving / Volunteering", category: "Faith & Spiritual" },
  { label: "Missions", category: "Faith & Spiritual" },
  // Fitness & Wellness
  { label: "Gym / Weightlifting", category: "Fitness & Wellness" },
  { label: "Yoga", category: "Fitness & Wellness" },
  { label: "Team Sports", category: "Fitness & Wellness" },
  { label: "Martial Arts", category: "Fitness & Wellness" },
  { label: "Swimming", category: "Fitness & Wellness" },
  // Learning & Growth
  { label: "Reading", category: "Learning & Growth" },
  { label: "Podcasts", category: "Learning & Growth" },
  { label: "History", category: "Learning & Growth" },
  { label: "Science & Technology", category: "Learning & Growth" },
  { label: "Personal Finance", category: "Learning & Growth" },
  { label: "Languages", category: "Learning & Growth" },
  // Family & Community
  { label: "Parenting", category: "Family & Community" },
  { label: "Fostering / Adoption", category: "Family & Community" },
  { label: "Community Service", category: "Family & Community" },
  { label: "Mentoring", category: "Family & Community" },
  // Travel & Adventure
  { label: "Travel", category: "Travel & Adventure" },
  { label: "Road Trips", category: "Travel & Adventure" },
  { label: "Backpacking", category: "Travel & Adventure" },
];

async function seed() {
  console.log("Seeding interests...");
  await db
    .insert(interests)
    .values(
      INTERESTS.map((i, idx) => ({
        label: i.label,
        category: i.category,
        sortOrder: idx,
      }))
    )
    .onConflictDoNothing();
  console.log(`Seeded ${INTERESTS.length} interests.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

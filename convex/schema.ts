import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  // Public profile linked 1:1 to the Better Auth user.
  // The auth user table lives in the betterAuth component; we keep our own
  // table here for username + leaderboard preferences + avatar seed.
  userProfile: defineTable({
    userId: v.string(), // Better Auth user id (string from component)
    username: v.string(), // public handle, 3-20 chars [a-z0-9_]
    avatarSeed: v.string(), // DiceBear seed
    joinedAt: v.number(),
    usernameChangedAt: v.number(),
    isPublic: v.boolean(), // appears in /leaderboard
  })
    .index('by_user', ['userId'])
    .index('by_username', ['username']),

  // One row per (user, lesson). Append-only quizAttempts.
  lessonProgress: defineTable({
    userId: v.string(),
    lessonId: v.string(), // "m01_l01"
    moduleId: v.string(), // "m01" — denormalized for module-level queries
    moduleVersion: v.number(), // module.version at completion time
    status: v.union(v.literal('in_progress'), v.literal('completed')),
    quizAttempts: v.array(
      v.object({
        quizIndex: v.number(),
        selectedOptionIndex: v.number(),
        correct: v.boolean(),
        attemptedAt: v.number(),
      }),
    ),
    firstAttemptCorrect: v.array(v.boolean()), // per quizIndex; true → +5 bonus earned
    completedAt: v.union(v.number(), v.null()),
    pointsAwarded: v.number(), // total points granted for this lesson
  })
    .index('by_user_lesson', ['userId', 'lessonId'])
    .index('by_user_module', ['userId', 'moduleId'])
    .index('by_user_status', ['userId', 'status']),

  // Spaced-repetition mastery state, one row per (user, concept). Drives the
  // "Repaso de hoy" queue and the mastery indicators. Scheduling follows the
  // SM-2 algorithm (the one behind Anki/SuperMemo) — see convex/mastery.ts.
  // Concept *content* (name, summary, review exercise) lives in the client
  // course data; this table stores only per-user scheduling.
  conceptMastery: defineTable({
    userId: v.string(),
    conceptId: v.string(), // e.g. "m02-functions-return"
    repetitions: v.number(), // consecutive successful recalls (SM-2 n)
    easeFactor: v.number(), // SM-2 EF, starts at 2.5, floor 1.3
    intervalDays: v.number(), // current spacing interval
    dueAt: v.number(), // next review timestamp (ms)
    masteredAt: v.number(), // first time reached mastery (quality >= 3)
    lastReviewedAt: v.number(),
    lapses: v.number(), // times forgotten (quality < 3 after mastery)
  })
    .index('by_user', ['userId'])
    .index('by_user_concept', ['userId', 'conceptId'])
    .index('by_user_due', ['userId', 'dueAt']),

  // User-saved Rust playground snippets. Each row is one named snippet
  // belonging to a user. Names are unique per user (case-insensitive) — the
  // mutation enforces this and overwrites duplicates. There's no version
  // history: the last save wins.
  playgroundSnippets: defineTable({
    userId: v.string(),
    name: v.string(),           // user-given label, 1-40 chars
    nameLower: v.string(),      // denormalized lowercase for dedupe lookups
    code: v.string(),           // Rust source
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_namelower', ['userId', 'nameLower']),

  // Materialized aggregate per user; updated atomically when a lesson is completed.
  scores: defineTable({
    userId: v.string(),
    totalPoints: v.number(),
    lessonsCompleted: v.number(),
    reachedCurrentScoreAt: v.number(), // tiebreaker: who reached this score first
    isPublic: v.boolean(), // denormalized from userProfile for fast top-10 filter
  })
    .index('by_user', ['userId'])
    // Top 10 query: filter by isPublic, order by totalPoints desc, tiebreak by reachedCurrentScoreAt asc.
    // Convex indexes order ascending; we limit and reverse in memory for the final ordering.
    .index('by_public_points', ['isPublic', 'totalPoints']),
})

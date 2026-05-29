import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { authComponent } from './auth'

const DAY_MS = 24 * 60 * 60 * 1000
const DEFAULT_EASE = 2.5
const MIN_EASE = 1.3

// ─── SM-2 ─────────────────────────────────────────────────────────────────────
//
// The spaced-repetition scheduler behind Anki/SuperMemo. Given the previous
// state and a recall "quality" (0-5), it returns the next interval and ease.
//   quality 5 = perfect (solved alone, first try)
//   quality 4 = solved with a hint / minor stumble
//   quality 3 = solved but with effort / multiple attempts
//   quality < 3 = failed → the concept lapses and resets to a short interval
//
// Concepts you find easy drift to longer and longer intervals (days → weeks →
// months); ones you struggle with come back fast. That's what fights the
// forgetting curve.
type Sm2State = {
  repetitions: number
  easeFactor: number
  intervalDays: number
}

function sm2(prev: Sm2State, quality: number): Sm2State {
  let { repetitions, easeFactor, intervalDays } = prev

  if (quality < 3) {
    // Lapse: start the spacing ladder over, but keep (slightly reduced) ease.
    repetitions = 0
    intervalDays = 1
  } else {
    if (repetitions === 0) intervalDays = 1
    else if (repetitions === 1) intervalDays = 6
    else intervalDays = Math.round(intervalDays * easeFactor)
    repetitions += 1
  }

  // Ease update (standard SM-2 formula), floored at 1.3.
  easeFactor =
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE

  return { repetitions, easeFactor, intervalDays }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

// Record a practice/review attempt for a concept. Called when a faded exercise
// or a challenge is solved (during a lesson) and during review sessions.
export const recordPractice = mutation({
  args: {
    conceptId: v.string(),
    quality: v.number(), // 0-5
  },
  handler: async (ctx, { conceptId, quality }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    const q = Math.max(0, Math.min(5, Math.round(quality)))
    const now = Date.now()

    const existing = await ctx.db
      .query('conceptMastery')
      .withIndex('by_user_concept', (qi) =>
        qi.eq('userId', authUser._id).eq('conceptId', conceptId),
      )
      .unique()

    if (!existing) {
      const next = sm2(
        { repetitions: 0, easeFactor: DEFAULT_EASE, intervalDays: 0 },
        q,
      )
      await ctx.db.insert('conceptMastery', {
        userId: authUser._id,
        conceptId,
        repetitions: next.repetitions,
        easeFactor: next.easeFactor,
        intervalDays: next.intervalDays,
        dueAt: now + next.intervalDays * DAY_MS,
        masteredAt: q >= 3 ? now : 0,
        lastReviewedAt: now,
        lapses: 0,
      })
      return { mastered: q >= 3, dueInDays: next.intervalDays }
    }

    const next = sm2(
      {
        repetitions: existing.repetitions,
        easeFactor: existing.easeFactor,
        intervalDays: existing.intervalDays,
      },
      q,
    )
    const lapsed = q < 3 && existing.masteredAt > 0
    await ctx.db.patch(existing._id, {
      repetitions: next.repetitions,
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      dueAt: now + next.intervalDays * DAY_MS,
      masteredAt: existing.masteredAt > 0 ? existing.masteredAt : q >= 3 ? now : 0,
      lastReviewedAt: now,
      lapses: lapsed ? existing.lapses + 1 : existing.lapses,
    })
    return { mastered: existing.masteredAt > 0 || q >= 3, dueInDays: next.intervalDays }
  },
})

// ─── Queries ──────────────────────────────────────────────────────────────────
//
// IMPORTANT: queries must be deterministic — no `Date.now()` here. We return
// the raw mastery rows (including `dueAt`) and let the CLIENT decide what's
// "due now" against its own clock. This also makes the result fully reactive
// and cacheable.

// Full mastery map for the current user: conceptId → state. The single source
// of truth used by both the review session and the dashboard.
export const getMyMastery = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return []
    const rows = await ctx.db
      .query('conceptMastery')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .collect()
    return rows.map((r) => ({
      conceptId: r.conceptId,
      mastered: r.masteredAt > 0,
      repetitions: r.repetitions,
      intervalDays: r.intervalDays,
      dueAt: r.dueAt,
      lapses: r.lapses,
    }))
  },
})

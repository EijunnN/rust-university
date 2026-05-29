import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { authComponent } from './auth'

const POINTS_PER_LESSON = 10
const POINTS_PER_FIRST_TRY_QUIZ = 5

const quizAttemptValidator = v.object({
  quizIndex: v.number(),
  selectedOptionIndex: v.number(),
  correct: v.boolean(),
  attemptedAt: v.number(),
})

export const getMyCompletedLessonIds = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return [] as string[]
    const rows = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user_status', (q) =>
        q.eq('userId', authUser._id).eq('status', 'completed'),
      )
      .collect()
    return rows.map((r) => r.lessonId)
  },
})

export const getMyProgressByModule = query({
  args: { moduleId: v.string() },
  handler: async (ctx, { moduleId }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return []
    return ctx.db
      .query('lessonProgress')
      .withIndex('by_user_module', (q) =>
        q.eq('userId', authUser._id).eq('moduleId', moduleId),
      )
      .collect()
  },
})

export const getMyLessonProgress = query({
  args: { lessonId: v.string() },
  handler: async (ctx, { lessonId }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return null
    return ctx.db
      .query('lessonProgress')
      .withIndex('by_user_lesson', (q) =>
        q.eq('userId', authUser._id).eq('lessonId', lessonId),
      )
      .unique()
  },
})

export const getMyScore = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return null
    return ctx.db
      .query('scores')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
  },
})

export const completeLesson = mutation({
  args: {
    lessonId: v.string(),
    moduleId: v.string(),
    moduleVersion: v.number(),
    totalQuizzesInLesson: v.number(),
    quizAttempts: v.array(quizAttemptValidator),
  },
  handler: async (
    ctx,
    { lessonId, moduleId, moduleVersion, totalQuizzesInLesson, quizAttempts },
  ) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    // Server-side validation: all quizzes must be answered correctly to complete.
    if (totalQuizzesInLesson > 0) {
      const correctByQuiz = new Map<number, boolean>()
      for (const a of quizAttempts) {
        if (a.correct) correctByQuiz.set(a.quizIndex, true)
      }
      for (let i = 0; i < totalQuizzesInLesson; i++) {
        if (!correctByQuiz.has(i)) {
          throw new Error('Faltan quizzes por responder correctamente.')
        }
      }
    }

    // Existing row?
    const existing = await ctx.db
      .query('lessonProgress')
      .withIndex('by_user_lesson', (q) =>
        q.eq('userId', authUser._id).eq('lessonId', lessonId),
      )
      .unique()

    // If already completed, do nothing (no re-grant of points).
    if (existing?.status === 'completed') return { alreadyCompleted: true, pointsAwarded: 0 }

    // Compute firstAttemptCorrect: by quizIndex, true if first attempt for that quiz was correct.
    const firstAttemptCorrect: boolean[] = []
    for (let i = 0; i < totalQuizzesInLesson; i++) {
      const attemptsForQuiz = quizAttempts
        .filter((a) => a.quizIndex === i)
        .sort((a, b) => a.attemptedAt - b.attemptedAt)
      firstAttemptCorrect[i] = attemptsForQuiz[0]?.correct === true
    }

    // Points: +10 per lesson + 5 per first-try-correct quiz.
    const quizBonus =
      firstAttemptCorrect.filter(Boolean).length * POINTS_PER_FIRST_TRY_QUIZ
    const pointsAwarded = POINTS_PER_LESSON + quizBonus

    const now = Date.now()

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: 'completed',
        moduleVersion,
        quizAttempts,
        firstAttemptCorrect,
        completedAt: now,
        pointsAwarded,
      })
    } else {
      await ctx.db.insert('lessonProgress', {
        userId: authUser._id,
        lessonId,
        moduleId,
        moduleVersion,
        status: 'completed',
        quizAttempts,
        firstAttemptCorrect,
        completedAt: now,
        pointsAwarded,
      })
    }

    // Update scores
    const score = await ctx.db
      .query('scores')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()

    const profile = await ctx.db
      .query('userProfile')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    const isPublic = profile?.isPublic ?? true

    let previousPosition: number | null = null
    let newPosition: number | null = null

    if (score) {
      previousPosition = await computeGlobalPosition(
        ctx,
        score.totalPoints,
        score.reachedCurrentScoreAt,
      )
      const newTotal = score.totalPoints + pointsAwarded
      await ctx.db.patch(score._id, {
        totalPoints: newTotal,
        lessonsCompleted: score.lessonsCompleted + 1,
        reachedCurrentScoreAt: now,
        isPublic,
      })
      newPosition = await computeGlobalPosition(ctx, newTotal, now)
    } else {
      await ctx.db.insert('scores', {
        userId: authUser._id,
        totalPoints: pointsAwarded,
        lessonsCompleted: 1,
        reachedCurrentScoreAt: now,
        isPublic,
      })
      newPosition = await computeGlobalPosition(ctx, pointsAwarded, now)
    }

    return {
      alreadyCompleted: false,
      pointsAwarded,
      quizBonus,
      previousPosition,
      newPosition,
    }
  },
})

// Count how many public users have strictly more points, plus those with same
// points but reached them earlier.
async function computeGlobalPosition(
  ctx: any,
  totalPoints: number,
  reachedAt: number,
): Promise<number> {
  const allPublic = await ctx.db
    .query('scores')
    .withIndex('by_public_points', (q: any) => q.eq('isPublic', true))
    .collect()
  let ahead = 0
  for (const s of allPublic) {
    if (s.totalPoints > totalPoints) ahead++
    else if (
      s.totalPoints === totalPoints &&
      s.reachedCurrentScoreAt < reachedAt
    )
      ahead++
  }
  return ahead + 1
}

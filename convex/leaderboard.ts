import { query } from './_generated/server'
import { authComponent } from './auth'

export const top10 = query({
  args: {},
  handler: async (ctx) => {
    const publicScores = await ctx.db
      .query('scores')
      .withIndex('by_public_points', (q) => q.eq('isPublic', true))
      .collect()

    // Sort by totalPoints desc, then by reachedCurrentScoreAt asc (earlier wins ties)
    const sorted = publicScores
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
        return a.reachedCurrentScoreAt - b.reachedCurrentScoreAt
      })
      .slice(0, 10)

    // Hydrate with userProfile data
    const profiles = await Promise.all(
      sorted.map((s) =>
        ctx.db
          .query('userProfile')
          .withIndex('by_user', (q) => q.eq('userId', s.userId))
          .unique(),
      ),
    )

    return sorted.map((s, i) => {
      const p = profiles[i]
      return {
        rank: i + 1,
        userId: s.userId,
        username: p?.username ?? 'desconocido',
        avatarSeed: p?.avatarSeed ?? 'unknown',
        totalPoints: s.totalPoints,
        lessonsCompleted: s.lessonsCompleted,
      }
    })
  },
})

export const myPosition = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return null
    const myScore = await ctx.db
      .query('scores')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    if (!myScore) return null

    // Position is computed only against public users; if user is private
    // we still tell them their hypothetical position.
    const allPublic = await ctx.db
      .query('scores')
      .withIndex('by_public_points', (q) => q.eq('isPublic', true))
      .collect()

    let ahead = 0
    for (const s of allPublic) {
      if (s.userId === myScore.userId) continue
      if (s.totalPoints > myScore.totalPoints) ahead++
      else if (
        s.totalPoints === myScore.totalPoints &&
        s.reachedCurrentScoreAt < myScore.reachedCurrentScoreAt
      )
        ahead++
    }

    return {
      position: ahead + 1,
      totalPoints: myScore.totalPoints,
      lessonsCompleted: myScore.lessonsCompleted,
      totalPublicUsers: allPublic.length,
    }
  },
})

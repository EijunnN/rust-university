import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { authComponent } from './auth'

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/
const USERNAME_CHANGE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function randomSeed() {
  return Math.random().toString(36).slice(2, 12)
}

export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return null
    const profile = await ctx.db
      .query('userProfile')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    return profile
      ? {
          ...profile,
          email: authUser.email,
        }
      : null
  },
})

export const isUsernameAvailable = query({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    if (!USERNAME_REGEX.test(username)) return false
    const existing = await ctx.db
      .query('userProfile')
      .withIndex('by_username', (q) => q.eq('username', username))
      .unique()
    return existing === null
  },
})

export const createProfile = mutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    // Idempotent: if THIS user already has a profile, just return it instead
    // of throwing. This is called right after signUp, where a reactive auth
    // guard may redirect mid-flight; a re-run (or a re-signup) must not surface
    // a spurious "ya tienes un perfil" error. Creating a profile you already
    // have is a no-op, not a failure.
    const existing = await ctx.db
      .query('userProfile')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    if (existing) {
      return { username: existing.username, avatarSeed: existing.avatarSeed }
    }

    const normalized = username.toLowerCase().trim()
    if (!USERNAME_REGEX.test(normalized)) {
      throw new Error(
        'El nombre de usuario debe tener 3-20 caracteres y solo letras minúsculas, números y guion bajo.',
      )
    }

    // Username already taken by someone else?
    const taken = await ctx.db
      .query('userProfile')
      .withIndex('by_username', (q) => q.eq('username', normalized))
      .unique()
    if (taken) throw new Error('Ese nombre de usuario ya está en uso.')

    const now = Date.now()
    const avatarSeed = randomSeed()

    await ctx.db.insert('userProfile', {
      userId: authUser._id,
      username: normalized,
      avatarSeed,
      joinedAt: now,
      usernameChangedAt: now,
      isPublic: true,
    })

    // Initialize scores row
    await ctx.db.insert('scores', {
      userId: authUser._id,
      totalPoints: 0,
      lessonsCompleted: 0,
      reachedCurrentScoreAt: now,
      isPublic: true,
    })

    return { username: normalized, avatarSeed }
  },
})

export const updateUsername = mutation({
  args: { username: v.string() },
  handler: async (ctx, { username }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    const normalized = username.toLowerCase().trim()
    if (!USERNAME_REGEX.test(normalized)) {
      throw new Error('Formato de nombre de usuario inválido.')
    }

    const profile = await ctx.db
      .query('userProfile')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    if (!profile) throw new Error('No tienes un perfil aún.')

    if (profile.username === normalized) return profile

    const sinceLastChange = Date.now() - profile.usernameChangedAt
    if (sinceLastChange < USERNAME_CHANGE_COOLDOWN_MS) {
      const daysLeft = Math.ceil(
        (USERNAME_CHANGE_COOLDOWN_MS - sinceLastChange) / (24 * 60 * 60 * 1000),
      )
      throw new Error(`Puedes cambiar tu username en ${daysLeft} día(s).`)
    }

    const taken = await ctx.db
      .query('userProfile')
      .withIndex('by_username', (q) => q.eq('username', normalized))
      .unique()
    if (taken) throw new Error('Ese nombre de usuario ya está en uso.')

    await ctx.db.patch(profile._id, {
      username: normalized,
      usernameChangedAt: Date.now(),
    })
    return { ...profile, username: normalized }
  },
})

export const setLeaderboardVisibility = mutation({
  args: { isPublic: v.boolean() },
  handler: async (ctx, { isPublic }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    const profile = await ctx.db
      .query('userProfile')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    if (!profile) throw new Error('No tienes un perfil aún.')

    await ctx.db.patch(profile._id, { isPublic })

    const score = await ctx.db
      .query('scores')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    if (score) await ctx.db.patch(score._id, { isPublic })

    return { isPublic }
  },
})

export const regenerateAvatar = mutation({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    const profile = await ctx.db
      .query('userProfile')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .unique()
    if (!profile) throw new Error('No tienes un perfil aún.')

    const avatarSeed = randomSeed()
    await ctx.db.patch(profile._id, { avatarSeed })
    return { avatarSeed }
  },
})

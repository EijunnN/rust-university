import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { authComponent } from './auth'

const MAX_NAME = 40
const MAX_CODE = 50_000      // ~50 KB per snippet — generous; the editor isn't an IDE
const MAX_SNIPPETS_PER_USER = 100

// List all snippets for the current user, most recently updated first.
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) return []
    const rows = await ctx.db
      .query('playgroundSnippets')
      .withIndex('by_user', (q) => q.eq('userId', authUser._id))
      .collect()
    // Sort in-memory: most recent first. Cheap at ≤100 rows per user.
    return rows
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((r) => ({
        id: r._id,
        name: r.name,
        code: r.code,
        updatedAt: r.updatedAt,
      }))
  },
})

// Upsert by name (case-insensitive) OR by id when one is provided.
//
// Behaviour:
//   - If `id` is given and belongs to the user → update that row (rename + code).
//     If the new name collides with ANOTHER row, that other row is deleted
//     and merged in (user's choice — overwrite intent is the same).
//   - If `id` is null → look up by nameLower; if a match exists, overwrite it.
//     Otherwise insert a new row.
export const save = mutation({
  args: {
    id: v.union(v.id('playgroundSnippets'), v.null()),
    name: v.string(),
    code: v.string(),
  },
  handler: async (ctx, { id, name, code }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    const trimmed = name.trim()
    if (!trimmed) throw new Error('El nombre no puede estar vacío')
    if (trimmed.length > MAX_NAME)
      throw new Error(`Nombre demasiado largo (máx ${MAX_NAME})`)
    if (code.length > MAX_CODE)
      throw new Error('El código excede el límite permitido')

    const nameLower = trimmed.toLowerCase()
    const now = Date.now()

    // Resolve the target row.
    let target = id
      ? await ctx.db.get(id)
      : null
    if (id && (!target || target.userId !== authUser._id)) {
      // Defensive: id passed but doesn't belong to caller — treat as new save.
      target = null
    }

    // Is there a different row with the same name? (collision case)
    const nameOwner = await ctx.db
      .query('playgroundSnippets')
      .withIndex('by_user_namelower', (q) =>
        q.eq('userId', authUser._id).eq('nameLower', nameLower),
      )
      .unique()

    // Case A: updating an existing row.
    if (target) {
      // If a DIFFERENT row already owns this name, drop it (overwrite merge).
      if (nameOwner && nameOwner._id !== target._id) {
        await ctx.db.delete(nameOwner._id)
      }
      await ctx.db.patch(target._id, {
        name: trimmed,
        nameLower,
        code,
        updatedAt: now,
      })
      return { id: target._id, name: trimmed }
    }

    // Case B: no id — overwrite by name if it exists.
    if (nameOwner) {
      await ctx.db.patch(nameOwner._id, {
        name: trimmed,
        nameLower,
        code,
        updatedAt: now,
      })
      return { id: nameOwner._id, name: trimmed }
    }

    // Case C: new insert. Enforce the per-user cap to avoid runaway storage.
    const count = (
      await ctx.db
        .query('playgroundSnippets')
        .withIndex('by_user', (q) => q.eq('userId', authUser._id))
        .collect()
    ).length
    if (count >= MAX_SNIPPETS_PER_USER) {
      throw new Error(
        `Has alcanzado el máximo de ${MAX_SNIPPETS_PER_USER} snippets. Elimina alguno antes de guardar otro.`,
      )
    }

    const newId = await ctx.db.insert('playgroundSnippets', {
      userId: authUser._id,
      name: trimmed,
      nameLower,
      code,
      updatedAt: now,
    })
    return { id: newId, name: trimmed }
  },
})

export const remove = mutation({
  args: { id: v.id('playgroundSnippets') },
  handler: async (ctx, { id }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')
    const row = await ctx.db.get(id)
    if (!row) return { ok: false }
    if (row.userId !== authUser._id) throw new Error('No autorizado')
    await ctx.db.delete(id)
    return { ok: true }
  },
})

// One-shot migration: ingest snippets that the user accumulated in
// localStorage during the pre-Convex period. Idempotent — name collisions
// merge by overwrite. The client deletes its localStorage copy after this
// resolves successfully.
export const importMany = mutation({
  args: {
    snippets: v.array(
      v.object({
        name: v.string(),
        code: v.string(),
        updatedAt: v.number(),
      }),
    ),
  },
  handler: async (ctx, { snippets }) => {
    const authUser = await authComponent.getAuthUser(ctx)
    if (!authUser) throw new Error('No autenticado')

    let imported = 0
    for (const s of snippets) {
      const name = s.name.trim()
      if (!name || name.length > MAX_NAME) continue
      if (s.code.length > MAX_CODE) continue
      const nameLower = name.toLowerCase()

      const existing = await ctx.db
        .query('playgroundSnippets')
        .withIndex('by_user_namelower', (q) =>
          q.eq('userId', authUser._id).eq('nameLower', nameLower),
        )
        .unique()

      if (existing) {
        // Keep whichever is newer.
        if (s.updatedAt > existing.updatedAt) {
          await ctx.db.patch(existing._id, {
            code: s.code,
            updatedAt: s.updatedAt,
          })
        }
      } else {
        await ctx.db.insert('playgroundSnippets', {
          userId: authUser._id,
          name,
          nameLower,
          code: s.code,
          updatedAt: s.updatedAt,
        })
        imported++
      }
    }
    return { imported }
  },
})

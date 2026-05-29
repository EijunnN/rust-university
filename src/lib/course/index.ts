import type { Lesson, Module } from './types'
import {
  getAllLessonIdsInOrder,
  getModuleMetaBySlug,
  moduleMeta,
} from './meta'

export * from './types'
export * from './meta'

type ModuleLoader = () => Promise<{ default: Module }>

const moduleLoaders: Record<string, ModuleLoader> = {
  m01_introduction: () => import('./modules/m01-introduction'),
  m02_fundamentals: () => import('./modules/m02-fundamentals'),
  m03_ownership: () => import('./modules/m03-ownership'),
  m04_structs_enums: () => import('./modules/m04-structs-enums'),
  m05_collections_errors: () => import('./modules/m05-collections-errors'),
  // m06-m12 archived: drafts pending re-write. To re-enable: add loader here
  // and append the module to `moduleMeta` in meta.ts.
}

export async function loadModule(slug: string): Promise<Module | null> {
  const loader = moduleLoaders[slug]
  if (!loader) return null
  const mod = await loader()
  return mod.default
}

export async function loadLesson(
  moduleSlug: string,
  lessonId: string,
): Promise<{ module: Module; lesson: Lesson } | null> {
  const module = await loadModule(moduleSlug)
  if (!module) return null
  const lesson = module.lessons.find((l) => l.id === lessonId)
  if (!lesson) return null
  return { module, lesson }
}

export function isLessonUnlocked(
  lessonId: string,
  completedLessonIds: ReadonlySet<string>,
): boolean {
  const order = getAllLessonIdsInOrder()
  const index = order.indexOf(lessonId)
  if (index === -1) return false
  if (index === 0) return true
  for (let i = 0; i < index; i++) {
    if (!completedLessonIds.has(order[i]!)) return false
  }
  return true
}

export function getNextLessonId(currentLessonId: string): string | null {
  const order = getAllLessonIdsInOrder()
  const index = order.indexOf(currentLessonId)
  if (index === -1 || index === order.length - 1) return null
  return order[index + 1] ?? null
}

export function getPreviousLessonId(currentLessonId: string): string | null {
  const order = getAllLessonIdsInOrder()
  const index = order.indexOf(currentLessonId)
  if (index <= 0) return null
  return order[index - 1] ?? null
}

export function getModuleIdFromLessonId(lessonId: string): string | null {
  // lessonId format: m01_l01 → moduleId: m01
  const match = lessonId.match(/^(m\d+)_/)
  return match?.[1] ?? null
}

export function getModuleSlugFromLessonId(lessonId: string): string | null {
  const moduleId = getModuleIdFromLessonId(lessonId)
  if (!moduleId) return null
  const meta = moduleMeta.find((m) => m.id === moduleId)
  return meta?.slug ?? null
}

export function isLastLessonOfModule(lessonId: string): boolean {
  const slug = getModuleSlugFromLessonId(lessonId)
  if (!slug) return false
  const meta = getModuleMetaBySlug(slug)
  if (!meta) return false
  const lastLesson = meta.lessons[meta.lessons.length - 1]
  return lastLesson?.id === lessonId
}

export function getNextModuleSlug(currentModuleSlug: string): string | null {
  const currentMeta = getModuleMetaBySlug(currentModuleSlug)
  if (!currentMeta) return null
  const nextMeta = moduleMeta.find((m) => m.order === currentMeta.order + 1)
  return nextMeta?.slug ?? null
}

export function getFirstUnlockedNextLessonId(
  completedLessonIds: ReadonlySet<string>,
): string {
  const order = getAllLessonIdsInOrder()
  for (const id of order) {
    if (!completedLessonIds.has(id)) return id
  }
  return order[0]!
}

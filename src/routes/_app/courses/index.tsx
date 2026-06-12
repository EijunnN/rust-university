import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react'
import { Badge } from '#/components/ui/badge'
import { Progress } from '#/components/ui/progress'
import { moduleMeta } from '#/lib/course/meta'
import { getAllLessonIdsInOrder } from '#/lib/course/meta'
import { api } from '../../../../convex/_generated/api'

export const Route = createFileRoute('/_app/courses/')({
  component: CoursesPage,
})

function CoursesPage() {
  const completedQuery = useQuery(
    convexQuery(api.progress.getMyCompletedLessonIds, {}),
  )
  const completed = new Set(completedQuery.data ?? [])
  const allLessons = getAllLessonIdsInOrder()

  // Find first non-completed lesson (the "current" position)
  const nextLessonId = allLessons.find((id) => !completed.has(id))

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          Tus cursos
        </h1>
        <p className="mt-2 text-muted-foreground">
          {completed.size} de {allLessons.length} lecciones completadas. Las
          lecciones se desbloquean en orden.
        </p>
        <div className="mt-4 max-w-md">
          <Progress
            value={(completed.size / allLessons.length) * 100}
            className="h-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {moduleMeta.map((m) => {
          const moduleCompleted = m.lessons.filter((l) => completed.has(l.id))
          const allDone = moduleCompleted.length === m.lessonCount
          const hasStarted = moduleCompleted.length > 0
          // Module is unlocked if all lessons of previous modules are completed.
          const previousModules = moduleMeta.filter((p) => p.order < m.order)
          const previousLessons = previousModules.flatMap((p) =>
            p.lessons.map((l) => l.id),
          )
          const previousAllDone = previousLessons.every((id) =>
            completed.has(id),
          )
          const isUnlocked = m.order === 1 || previousAllDone

          const firstLessonId = m.lessons[0]?.id
          // If module already started, link to next uncompleted lesson; else first lesson.
          const targetLessonId = m.lessons.find((l) => !completed.has(l.id))?.id
            ?? firstLessonId
          const isCurrent = nextLessonId
            ? m.lessons.some((l) => l.id === nextLessonId)
            : false

          return (
            <ModuleCard
              key={m.id}
              moduleId={m.id}
              icon={m.icon}
              order={m.order}
              title={m.title}
              description={m.description}
              lessonCount={m.lessonCount}
              estimatedMinutes={m.estimatedMinutes}
              completedCount={moduleCompleted.length}
              allDone={allDone}
              hasStarted={hasStarted}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              targetSlug={m.slug}
              targetLessonId={targetLessonId ?? ''}
            />
          )
        })}
      </div>
    </div>
  )
}

function ModuleCard({
  icon,
  order,
  title,
  description,
  lessonCount,
  estimatedMinutes,
  completedCount,
  allDone,
  hasStarted,
  isUnlocked,
  isCurrent,
  targetSlug,
  targetLessonId,
}: {
  moduleId: string
  icon: string
  order: number
  title: string
  description: string
  lessonCount: number
  estimatedMinutes: number
  completedCount: number
  allDone: boolean
  hasStarted: boolean
  isUnlocked: boolean
  isCurrent: boolean
  targetSlug: string
  targetLessonId: string
}) {
  const progress = (completedCount / lessonCount) * 100

  const card = (
    <div
      className={`group h-full rounded-lg border bg-card p-5 transition-all ${
        !isUnlocked
          ? 'opacity-60'
          : isCurrent
            ? 'border-primary/60 ring-1 ring-primary/30'
            : 'hover:border-primary/40 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-3xl flex-shrink-0">{icon}</span>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Módulo {order}</div>
            <h3 className="font-semibold truncate">{title}</h3>
          </div>
        </div>
        {allDone ? (
          <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
        ) : !isUnlocked ? (
          <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : null}
      </div>

      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
        {description}
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {completedCount}/{lessonCount} lecciones · ~{estimatedMinutes} min
          </span>
          {isCurrent && (
            <Badge variant="default" className="text-[10px] h-5">
              En curso
            </Badge>
          )}
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {isUnlocked && (
        <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          {allDone
            ? 'Revisar módulo'
            : hasStarted
              ? 'Continuar'
              : 'Empezar'}
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  )

  if (!isUnlocked || !targetLessonId) {
    return card
  }
  return (
    <Link
      to="/courses/$moduleSlug/lesson/$lessonId"
      params={{ moduleSlug: targetSlug, lessonId: targetLessonId }}
      className="block"
    >
      {card}
    </Link>
  )
}

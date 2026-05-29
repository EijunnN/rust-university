import { useEffect, useMemo } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { ArrowRight, BookOpen, Trophy } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { getModuleMetaBySlug, getNextModuleSlug } from '#/lib/course'
import { api } from '../../../../../convex/_generated/api'

export const Route = createFileRoute('/_app/courses/$moduleSlug/complete')({
  loader: ({ params }) => {
    const meta = getModuleMetaBySlug(params.moduleSlug)
    if (!meta) throw notFound()
    return { meta }
  },
  component: ModuleCompletePage,
})

function ModuleCompletePage() {
  const { meta } = Route.useLoaderData()
  const params = Route.useParams()

  const moduleProgress = useQuery(
    convexQuery(api.progress.getMyProgressByModule, { moduleId: meta.id }),
  )
  const myPos = useQuery(convexQuery(api.leaderboard.myPosition, {}))

  const stats = useMemo(() => {
    const rows = moduleProgress.data ?? []
    const completed = rows.filter((r) => r.status === 'completed')
    const totalPoints = completed.reduce(
      (acc, r) => acc + (r.pointsAwarded ?? 0),
      0,
    )
    const perfectQuizzes = completed.reduce(
      (acc, r) => acc + r.firstAttemptCorrect.filter(Boolean).length,
      0,
    )
    const totalQuizzes = completed.reduce(
      (acc, r) => acc + r.firstAttemptCorrect.length,
      0,
    )
    return {
      lessonsDone: completed.length,
      totalPoints,
      perfectQuizzes,
      totalQuizzes,
    }
  }, [moduleProgress.data])

  // Confetti on mount
  useEffect(() => {
    let cancelled = false
    void (async () => {
      const { default: confetti } = await import('canvas-confetti')
      if (cancelled) return
      const burst = (origin: { x: number; y: number }) =>
        confetti({
          particleCount: 80,
          spread: 70,
          origin,
          colors: ['#f59e0b', '#fb923c', '#10b981', '#3b82f6'],
        })
      burst({ x: 0.2, y: 0.4 })
      setTimeout(() => burst({ x: 0.8, y: 0.4 }), 250)
      setTimeout(() => burst({ x: 0.5, y: 0.5 }), 500)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const nextModuleSlug = getNextModuleSlug(params.moduleSlug)
  const nextModule = nextModuleSlug ? getModuleMetaBySlug(nextModuleSlug) : null

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 max-w-2xl text-center">
      <div className="text-6xl mb-6 animate-bounce">{meta.icon}</div>

      <div className="text-sm uppercase tracking-wider text-primary font-semibold mb-2">
        Módulo completado
      </div>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
        {meta.title}
      </h1>
      <p className="mt-4 text-muted-foreground">
        Has terminado el módulo {meta.order} del curso. Sigue así.
      </p>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <Stat
          icon={<Trophy className="h-4 w-4" />}
          value={`+${stats.totalPoints}`}
          label="puntos"
        />
        <Stat
          icon={<BookOpen className="h-4 w-4" />}
          value={`${stats.lessonsDone}`}
          label="lecciones"
        />
        <Stat
          icon={<Trophy className="h-4 w-4" />}
          value={
            stats.totalQuizzes > 0
              ? `${stats.perfectQuizzes}/${stats.totalQuizzes}`
              : '—'
          }
          label="quizzes perfectos"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {myPos.data && (
        <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
          <Trophy className="h-4 w-4 text-primary" />
          Estás en el puesto <strong>#{myPos.data.position}</strong> del ranking
        </div>
      )}

      <div className="mt-12 flex flex-col sm:flex-row gap-3 justify-center">
        {nextModule ? (
          <Button asChild size="lg" className="text-base">
            <Link
              to="/courses/$moduleSlug/lesson/$lessonId"
              params={{
                moduleSlug: nextModule.slug,
                lessonId: nextModule.lessons[0]!.id,
              }}
            >
              {nextModule.icon} Siguiente módulo: {nextModule.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="text-base">
            <Link to="/me">Ver mi progreso</Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <Link to="/courses">Volver al catálogo</Link>
        </Button>
      </div>
    </div>
  )
}

function Stat({
  icon,
  value,
  label,
  className,
}: {
  icon: React.ReactNode
  value: string
  label: string
  className?: string
}) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${className ?? ''}`}>
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

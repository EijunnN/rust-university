import { Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Settings,
  Trophy,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Progress } from '#/components/ui/progress'
import { Skeleton } from '#/components/ui/skeleton'
import { UserAvatar } from '#/components/user-avatar'
import { moduleMeta, getAllLessonIdsInOrder } from '#/lib/course/meta'
import { getFirstUnlockedNextLessonId, getModuleSlugFromLessonId } from '#/lib/course'
import { api } from '../../../../convex/_generated/api'

export const Route = createFileRoute('/_app/me/')({
  component: MePage,
})

function MePage() {
  const profile = useQuery(convexQuery(api.profile.getMyProfile, {}))
  const completed = useQuery(convexQuery(api.progress.getMyCompletedLessonIds, {}))
  const score = useQuery(convexQuery(api.progress.getMyScore, {}))
  const position = useQuery(convexQuery(api.leaderboard.myPosition, {}))
  const mastery = useQuery(convexQuery(api.mastery.getMyMastery, {}))
  const now = Date.now()
  const dueNow = (mastery.data ?? []).filter(
    (m) => m.mastered && m.dueAt <= now,
  ).length

  const completedSet = new Set(completed.data ?? [])
  const allLessons = getAllLessonIdsInOrder()
  const overallProgress = (completedSet.size / allLessons.length) * 100

  const nextLessonId = completed.data
    ? getFirstUnlockedNextLessonId(completedSet)
    : null
  const nextModuleSlug = nextLessonId
    ? getModuleSlugFromLessonId(nextLessonId)
    : null

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-10">
        {profile.data ? (
          <UserAvatar
            seed={profile.data.avatarSeed}
            username={profile.data.username}
            size="xl"
          />
        ) : (
          <Skeleton className="size-20 rounded-full" />
        )}
        <div className="flex-1 text-center sm:text-left">
          {profile.data ? (
            <>
              <h1 className="font-serif text-3xl font-bold">
                @{profile.data.username}
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile.data.email}
              </p>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-56" />
            </>
          )}
          <Button asChild variant="outline" size="sm" className="mt-3">
            <Link to="/me/settings">
              <Settings className="mr-2 h-3.5 w-3.5" />
              Configuración
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Puntos totales"
          value={score.data?.totalPoints ?? 0}
          loading={score.isLoading}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="Lecciones completadas"
          value={`${completedSet.size}/${allLessons.length}`}
          loading={completed.isLoading}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5" />}
          label="Posición global"
          value={position.data ? `#${position.data.position}` : '—'}
          loading={position.isLoading}
          subtitle={
            position.data
              ? `de ${position.data.totalPublicUsers} públicos`
              : undefined
          }
        />
      </div>

      {/* Repaso de hoy — spaced repetition queue */}
      {dueNow > 0 && (
        <div className="mb-6 rounded-lg border border-primary/40 bg-primary/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary flex-shrink-0">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Repaso de hoy</h2>
            <p className="text-sm text-muted-foreground">
              Tienes {dueNow} concepto{dueNow === 1 ? '' : 's'} listos para
              repasar. Refuérzalos antes de que se enfríen.
            </p>
          </div>
          <Button asChild className="sm:flex-shrink-0">
            <Link to="/repaso">
              Repasar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* Continue learning */}
      {nextLessonId && nextModuleSlug && completedSet.size < allLessons.length && (
        <div className="mb-10 rounded-lg border bg-gradient-to-br from-primary/10 to-transparent p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Continuar
            </div>
            <h2 className="font-semibold text-lg mt-1">Sigue donde quedaste</h2>
            <p className="text-sm text-muted-foreground">
              Tu próxima lección desbloqueada está lista.
            </p>
          </div>
          <Button asChild className="sm:flex-shrink-0">
            <Link
              to="/courses/$moduleSlug/lesson/$lessonId"
              params={{ moduleSlug: nextModuleSlug, lessonId: nextLessonId }}
            >
              Continuar <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}

      {completedSet.size === allLessons.length && (
        <div className="mb-10 rounded-lg border border-success/30 bg-success/5 p-6 text-center">
          <div className="text-4xl mb-2">🦀</div>
          <h2 className="font-serif text-xl font-bold">
            ¡Terminaste todo el curso!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Eres oficialmente un Rustacean. Repasa cualquier lección cuando
            quieras.
          </p>
        </div>
      )}

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Progreso general</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* Per-module progress */}
      <h2 className="font-semibold mt-10 mb-4">Progreso por módulo</h2>
      <div className="space-y-3">
        {moduleMeta.map((m) => {
          const moduleCompleted = m.lessons.filter((l) =>
            completedSet.has(l.id),
          ).length
          const pct = (moduleCompleted / m.lessonCount) * 100
          return (
            <div key={m.id} className="rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {moduleCompleted}/{m.lessonCount} lecciones
                  </div>
                </div>
                <div className="text-sm tabular-nums text-muted-foreground">
                  {Math.round(pct)}%
                </div>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  loading,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  loading?: boolean
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-3">
        {icon}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {loading ? (
        <Skeleton className="h-8 w-20 mt-1" />
      ) : (
        <div className="text-2xl sm:text-3xl font-bold tabular-nums mt-1">
          {value}
        </div>
      )}
      {subtitle && (
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      )}
    </div>
  )
}

import { Link } from '@tanstack/react-router'
import { ArrowLeft, CheckCircle2, Lock, PlayCircle } from 'lucide-react'
import { Progress } from '#/components/ui/progress'
import type { ModuleMeta } from '#/lib/course/types'
import { cn } from '#/lib/utils'

export function LessonSidebar({
  meta,
  currentLessonId,
  completedLessonIds,
  onNavigate,
}: {
  meta: ModuleMeta
  currentLessonId: string
  completedLessonIds: ReadonlySet<string>
  onNavigate?: () => void
}) {
  const completedCount = meta.lessons.filter((l) =>
    completedLessonIds.has(l.id),
  ).length
  const progress = (completedCount / meta.lessons.length) * 100

  return (
    <aside className="h-full flex flex-col">
      <div className="p-4 sm:p-5 border-b">
        <Link
          to="/courses"
          onClick={onNavigate}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="h-3 w-3" /> Todos los cursos
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta.icon}</span>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Módulo {meta.order}
            </div>
            <h2 className="font-semibold text-sm leading-tight truncate">
              {meta.title}
            </h2>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-1.5">
          {completedCount}/{meta.lessonCount} lecciones
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {meta.lessons.map((l, idx) => {
          const isCurrent = l.id === currentLessonId
          const isCompleted = completedLessonIds.has(l.id)
          // Lesson is unlocked if previous lesson in this module is completed
          // OR it's the first lesson of the module.
          const previousLesson = meta.lessons[idx - 1]
          const isUnlocked =
            idx === 0 ||
            (previousLesson ? completedLessonIds.has(previousLesson.id) : false) ||
            isCompleted

          const content = (
            <div
              className={cn(
                'flex items-start gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                isCurrent && 'bg-primary/10 text-primary font-medium',
                !isCurrent && isUnlocked && 'hover:bg-accent',
                !isUnlocked && 'opacity-50',
              )}
            >
              <span className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : isCurrent ? (
                  <PlayCircle className="h-4 w-4 text-primary" />
                ) : !isUnlocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
                )}
              </span>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Lección {l.order}
                </div>
                <div className="leading-tight">{l.title}</div>
              </div>
            </div>
          )

          if (!isUnlocked) return <div key={l.id}>{content}</div>
          return (
            <Link
              key={l.id}
              to="/courses/$moduleSlug/lesson/$lessonId"
              params={{ moduleSlug: meta.slug, lessonId: l.id }}
              onClick={onNavigate}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {content}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

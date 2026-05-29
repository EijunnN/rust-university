import { Fragment, useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Eye,
  PartyPopper,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Skeleton } from '#/components/ui/skeleton'
import { RunnableCode } from '#/components/course/runnable-code'
import { getConcepts, type Concept } from '#/lib/course/concepts'
import type { VerifyResult } from '#/lib/rust-playground'
import { api } from '../../../convex/_generated/api'

export const Route = createFileRoute('/_app/repaso')({
  component: RepasoPage,
})

function RepasoPage() {
  const masteryQuery = useQuery(convexQuery(api.mastery.getMyMastery, {}))

  // Snapshot the due concepts ONCE when the query first settles (success or
  // error), so recording reviews — which pushes dueAt into the future and
  // would shrink the live query — doesn't reorder or drop cards mid-session.
  // `null` = not snapshotted yet; an array (possibly empty) = ready.
  const [session, setSession] = useState<Concept[] | null>(null)

  useEffect(() => {
    if (session !== null) return // already snapshotted
    if (masteryQuery.isLoading) return // wait for the first settle
    // On success: filter to due-now. On error: data is undefined → empty.
    const rows = masteryQuery.data ?? []
    const now = Date.now()
    const dueIds = rows
      .filter((r) => r.mastered && r.dueAt <= now)
      .sort((a, b) => a.dueAt - b.dueAt)
      .map((r) => r.conceptId)
    setSession(getConcepts(dueIds))
  }, [masteryQuery.isLoading, masteryQuery.data, session])

  // Skeleton only while we genuinely don't have a snapshot yet.
  if (session === null) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-2xl">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (session.length === 0) {
    return <EmptyState />
  }

  return <ReviewSession concepts={session} />
}

function EmptyState() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-2xl text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success mb-4">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="font-serif text-2xl font-bold">
        No tienes nada por repasar
      </h1>
      <p className="text-muted-foreground mt-2">
        Tu memoria está al día. A medida que domines conceptos en las lecciones,
        aparecerán aquí justo antes de que estés por olvidarlos.
      </p>
      <Button asChild className="mt-6">
        <Link to="/courses">
          Seguir aprendiendo <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}

function ReviewSession({ concepts }: { concepts: Concept[] }) {
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  const total = concepts.length
  const concept = concepts[index]!

  const goNext = () => {
    if (index + 1 >= total) setFinished(true)
    else setIndex((i) => i + 1)
  }

  if (finished) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 max-w-2xl text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold">¡Repaso completado! 🎉</h1>
        <p className="text-muted-foreground mt-2">
          Repasaste {total} concepto{total === 1 ? '' : 's'}. Cada repaso
          empuja el siguiente más lejos en el tiempo — así es como lo aprendido
          se vuelve permanente.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button asChild variant="outline">
            <Link to="/me">Ver mi progreso</Link>
          </Button>
          <Button asChild>
            <Link to="/courses">
              Seguir aprendiendo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 max-w-2xl">
      <div className="flex items-center gap-2 mb-1 text-primary">
        <BrainCircuit className="h-5 w-5" />
        <span className="text-xs uppercase tracking-wider font-semibold">
          Repaso de hoy
        </span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">
          Recuerda este concepto
        </h1>
        <span className="text-sm text-muted-foreground tabular-nums">
          {index + 1} / {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-muted mb-8 overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <ReviewCard
        key={concept.id}
        concept={concept}
        onDone={goNext}
        isLast={index + 1 >= total}
      />
    </div>
  )
}

function ReviewCard({
  concept,
  onDone,
  isLast,
}: {
  concept: Concept
  onDone: () => void
  isLast: boolean
}) {
  const [attempts, setAttempts] = useState(0)
  const [passed, setPassed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // recordPractice is fired by the parent via a mutation hook; we pass quality
  // by importing the hook here for locality.
  const recordPractice = useReviewRecorder()

  const finish = (quality: number) => {
    recordPractice(concept.id, quality)
    onDone()
  }

  const handleVerified = (result: VerifyResult) => {
    const n = attempts + 1
    setAttempts(n)
    if (result.passed && !passed) {
      setPassed(true)
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b bg-muted/30">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          {concept.name}
        </div>
      </div>

      <div className="p-5 space-y-4">
        <InlineMarkdown
          text={concept.review.prompt}
          className="prose prose-sm dark:prose-invert max-w-none"
        />

        <RunnableCode
          initialCode={concept.review.starterCode}
          tests={concept.review.tests}
          onVerified={handleVerified}
        />

        {revealed && (
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Solución
            </div>
            <pre className="rounded-lg border bg-muted/40 p-3 text-xs font-mono overflow-x-auto whitespace-pre">
              {concept.review.solution}
            </pre>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {passed ? (
            <Button onClick={() => finish(attempts <= 1 ? 5 : 4)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              {isLast ? 'Terminar repaso' : 'Siguiente concepto'}
            </Button>
          ) : (
            <>
              {!revealed && (
                <Button
                  variant="outline"
                  onClick={() => setRevealed(true)}
                  disabled={attempts === 0}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {attempts === 0 ? 'Inténtalo primero' : 'No me sale, ver solución'}
                </Button>
              )}
              {revealed && (
                <Button variant="outline" onClick={() => finish(2)}>
                  {isLast ? 'Terminar repaso' : 'Siguiente concepto'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── helpers ────────────────────────────────────────────────────────────────

// Returns a fire-and-forget recorder for review outcomes.
function useReviewRecorder() {
  const m = useMutation({
    mutationFn: useConvexMutation(api.mastery.recordPractice),
  })
  return (conceptId: string, quality: number) => {
    m.mutate({ conceptId, quality })
  }
}

// Minimal inline markdown: **bold**, `code`, and paragraph breaks. Enough for
// short review prompts without dragging the full Shiki pipeline to the client.
function InlineMarkdown({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const paragraphs = text.split(/\n\n+/)
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i}>{renderInline(p)}</p>
      ))}
    </div>
  )
}

function renderInline(text: string) {
  // Split on `code` and **bold** while keeping delimiters.
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return tokens.map((tok, i) => {
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1 py-0.5 text-[0.85em] font-mono"
        >
          {tok.slice(1, -1)}
        </code>
      )
    }
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={i}>{tok.slice(2, -2)}</strong>
    }
    return <Fragment key={i}>{tok}</Fragment>
  })
}

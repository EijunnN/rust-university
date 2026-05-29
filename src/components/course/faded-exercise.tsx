import { useRef, useState } from 'react'
import type { Root } from 'hast'
import { useMutation } from '@tanstack/react-query'
import { useConvexMutation } from '@convex-dev/react-query'
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { RunnableCode } from '#/components/course/runnable-code'
import { MarkdownContent } from '#/components/course/markdown-content'
import type { FadedExerciseBlock, FadedStageKind } from '#/lib/course/types'
import type { VerifyResult } from '#/lib/rust-playground'
import { api } from '../../../convex/_generated/api'

const STAGE_LABEL: Record<FadedStageKind, string> = {
  worked: 'Ejemplo resuelto',
  faded: 'Completa los huecos',
  solo: 'Hazlo tú solo',
}

// Faded-scaffolding exercise. Support is withdrawn one stage at a time:
//   worked  → read a fully solved example
//   faded   → fill the holes (verified)
//   solo    → write it alone (verified → records mastery)
export function FadedExercise({
  block,
  introHast,
  stageInstructionsHast,
  stageCodeHtml,
  solutionHtml,
}: {
  block: FadedExerciseBlock
  introHast?: Root
  stageInstructionsHast: Root[]
  stageCodeHtml: string[]
  solutionHtml: string
}) {
  const [stageIdx, setStageIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [soloAttempts, setSoloAttempts] = useState(0)
  const recorded = useRef(false)

  const recordPractice = useMutation({
    mutationFn: useConvexMutation(api.mastery.recordPractice),
  })

  const stage = block.stages[stageIdx]!
  const isLast = stageIdx === block.stages.length - 1

  const advance = () => {
    if (isLast) {
      setDone(true)
    } else {
      setStageIdx((i) => i + 1)
    }
  }

  const handleVerified = (result: VerifyResult) => {
    if (!result.passed) {
      if (stage.kind === 'solo') setSoloAttempts((n) => n + 1)
      return
    }
    if (stage.kind === 'solo') {
      const n = soloAttempts + 1
      setSoloAttempts(n)
      if (!recorded.current && block.conceptId) {
        recorded.current = true
        // First-try solo = full mastery; with retries, still solid.
        recordPractice.mutate({
          conceptId: block.conceptId,
          quality: n === 1 ? 5 : 4,
        })
      }
    }
    advance()
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-3 border-b border-primary/20 bg-primary/5 flex items-center gap-2">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Layers className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
            Práctica guiada
          </div>
          <div className="text-sm font-semibold truncate">{block.title}</div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {introHast && (
          <MarkdownContent
            hast={introHast}
            className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
          />
        )}

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {block.stages.map((s, i) => {
            const state =
              done || i < stageIdx ? 'done' : i === stageIdx ? 'active' : 'todo'
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    state === 'done'
                      ? 'bg-success/15 text-success'
                      : state === 'active'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {state === 'done' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <span className="tabular-nums">{i + 1}</span>
                  )}
                  <span className="hidden sm:inline">{STAGE_LABEL[s.kind]}</span>
                </div>
                {i < block.stages.length - 1 && (
                  <div className="h-px flex-1 bg-border" />
                )}
              </div>
            )
          })}
        </div>

        {done ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-success/30 bg-success/5 p-4 flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">
                  ¡Lo hiciste tú solo! 🎉
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Este concepto quedó registrado. Te lo traeremos de vuelta para
                  repaso antes de que lo olvides.
                </p>
              </div>
            </div>
            <details className="group">
              <summary className="cursor-pointer text-xs uppercase tracking-wider text-muted-foreground font-semibold list-none">
                Ver una solución de referencia
              </summary>
              <div
                className="mt-2 rounded-lg overflow-hidden border border-success/30 [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-3 [&_pre]:overflow-x-auto [&_pre]:text-sm"
                dangerouslySetInnerHTML={{ __html: solutionHtml }}
              />
            </details>
          </div>
        ) : (
          <>
            {/* Stage instructions */}
            <MarkdownContent
              hast={stageInstructionsHast[stageIdx]!}
              className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
            />

            {stage.kind === 'worked' ? (
              <>
                {/* Read-only worked example */}
                <div
                  className="rounded-lg overflow-hidden border [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-3 [&_pre]:overflow-x-auto [&_pre]:text-sm"
                  dangerouslySetInnerHTML={{ __html: stageCodeHtml[stageIdx]! }}
                />
                <Button onClick={advance} className="w-full sm:w-auto">
                  Entendido, siguiente <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <RunnableCode
                key={stageIdx}
                initialCode={stage.code}
                staticHtml={stageCodeHtml[stageIdx]}
                tests={block.tests}
                onVerified={handleVerified}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

import { useRef, useState } from 'react'
import type { Root } from 'hast'
import { useMutation } from '@tanstack/react-query'
import { useConvexMutation } from '@convex-dev/react-query'
import { Lightbulb, Sparkles, Target } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { RunnableCode } from '#/components/course/runnable-code'
import { MarkdownContent } from '#/components/course/markdown-content'
import type { ChallengeBlock as ChallengeBlockType } from '#/lib/course/types'
import type { VerifyResult } from '#/lib/rust-playground'
import { api } from '../../../convex/_generated/api'

// Productive-failure block. The learner faces the problem BEFORE the theory,
// attempts it (and usually fails — that's the point), then unlocks the
// explanation, which now lands much deeper.
export function ChallengeBlock({
  block,
  promptHast,
  revealHast,
  starterHtml,
  solutionHtml,
}: {
  block: ChallengeBlockType
  promptHast: Root
  revealHast: Root
  starterHtml: string
  solutionHtml: string
}) {
  const [attempts, setAttempts] = useState(0)
  const [passed, setPassed] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const recorded = useRef(false)

  const recordPractice = useMutation({
    mutationFn: useConvexMutation(api.mastery.recordPractice),
  })

  const record = (quality: number) => {
    if (recorded.current || !block.conceptId) return
    recorded.current = true
    recordPractice.mutate({ conceptId: block.conceptId, quality })
  }

  const handleVerified = (result: VerifyResult) => {
    const n = attempts + 1
    setAttempts(n)
    if (result.passed && !passed) {
      setPassed(true)
      // Solving it BEFORE revealing earns full marks; after, partial.
      record(revealed ? 3 : n === 1 ? 5 : 4)
    }
  }

  const handleReveal = () => {
    setRevealed(true)
    // Engaging with the struggle counts even if they didn't crack it.
    if (!passed) record(2)
  }

  return (
    <div className="rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 overflow-hidden">
      <div className="px-5 sm:px-6 py-3 border-b border-primary/20 flex items-center gap-2">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Target className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
            Reto · inténtalo antes de leer
          </div>
          <div className="text-sm font-semibold truncate">{block.title}</div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        <MarkdownContent
          hast={promptHast}
          className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
        />

        <div className="rounded-md bg-muted/40 border border-border/60 px-3 py-2 text-xs text-muted-foreground flex items-start gap-2">
          <Lightbulb className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-warning" />
          <span>
            No pasa nada si no te sale — <strong>intentarlo primero</strong> es
            justamente lo que hace que la explicación se entienda mucho mejor
            después. Dale a <strong>Verificar</strong> cuando quieras probar.
          </span>
        </div>

        <RunnableCode
          initialCode={block.starterCode}
          staticHtml={starterHtml}
          tests={block.tests}
          onVerified={handleVerified}
        />

        {/* Reveal gate */}
        {!revealed ? (
          <Button
            variant={passed ? 'default' : 'outline'}
            onClick={handleReveal}
            disabled={attempts === 0 && !passed}
            className="w-full sm:w-auto"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {passed
              ? '¡Lo lograste! Ver la explicación'
              : attempts === 0
                ? 'Inténtalo al menos una vez'
                : 'Ver la explicación'}
          </Button>
        ) : (
          <div className="space-y-3 rounded-lg border border-primary/20 bg-background p-4">
            <div className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Lo que acabas de descubrir
            </div>
            <MarkdownContent
              hast={revealHast}
              className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
            />
            <div>
              <div className="text-xs uppercase tracking-wider text-success font-semibold mb-2">
                Una solución
              </div>
              <div
                className="rounded-lg overflow-hidden border border-success/30 [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-3 [&_pre]:overflow-x-auto [&_pre]:text-sm"
                dangerouslySetInnerHTML={{ __html: solutionHtml }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

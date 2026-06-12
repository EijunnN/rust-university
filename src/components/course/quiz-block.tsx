import { useState } from 'react'
import { Check, Eye, Lightbulb, X } from 'lucide-react'
import type { Root } from 'hast'
import { Button } from '#/components/ui/button'
import { MarkdownContent } from '#/components/course/markdown-content'
import type { QuizBlock as QuizBlockType } from '#/lib/course/types'
import { cn } from '#/lib/utils'

export type QuizAttempt = {
  quizIndex: number
  selectedOptionIndex: number
  correct: boolean
  attemptedAt: number
}

// Tras este número de fallos ofrecemos revelar la respuesta: a esta altura el
// alumno ya está adivinando por descarte, no aprendiendo. Mejor mostrar la
// correcta CON su explicación y seguir adelante.
const REVEAL_AFTER_FAILS = 2

export function QuizBlock({
  block,
  quizIndex,
  onAttempt,
  alreadyAnsweredCorrectly,
  explanationHast,
}: {
  block: QuizBlockType
  quizIndex: number
  onAttempt: (attempt: QuizAttempt) => void
  alreadyAnsweredCorrectly?: boolean
  explanationHast?: Root
}) {
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set())
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const isResolved = correctIndex !== null || alreadyAnsweredCorrectly

  const handleClick = (i: number) => {
    if (isResolved || wrongIndices.has(i)) return
    const isCorrect = block.options[i]?.correct === true
    const attempt: QuizAttempt = {
      quizIndex,
      selectedOptionIndex: i,
      correct: isCorrect,
      attemptedAt: Date.now(),
    }
    onAttempt(attempt)
    if (isCorrect) {
      setCorrectIndex(i)
    } else {
      setWrongIndices((prev) => new Set([...prev, i]))
    }
  }

  const handleReveal = () => {
    const idx = block.options.findIndex((o) => o.correct)
    if (idx === -1) return
    setRevealed(true)
    setCorrectIndex(idx)
    // Cuenta como resuelto (para poder completar la lección) pero llega tras
    // ≥2 fallos registrados, así que nunca otorga el bonus de primer intento.
    onAttempt({
      quizIndex,
      selectedOptionIndex: idx,
      correct: true,
      attemptedAt: Date.now(),
    })
  }

  const canReveal =
    !isResolved && wrongIndices.size >= REVEAL_AFTER_FAILS

  return (
    <div className="rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="rounded-full bg-primary/10 text-primary text-sm font-semibold size-7 inline-flex items-center justify-center flex-shrink-0"
        >
          ?
        </span>
        <h4 className="font-semibold leading-snug">{block.question}</h4>
      </div>

      <ul className="mt-4 space-y-2">
        {block.options.map((opt, i) => {
          const isWrong = wrongIndices.has(i)
          const isCorrect = correctIndex === i
          const isDisabled = isResolved || isWrong

          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleClick(i)}
                disabled={isDisabled}
                aria-label={`Opción ${i + 1}: ${opt.text}${
                  isCorrect ? ' (correcta)' : isWrong ? ' (incorrecta)' : ''
                }`}
                className={cn(
                  'w-full text-left rounded-md border px-4 py-3 text-sm transition-colors flex items-center gap-3',
                  isCorrect &&
                    'border-success/60 bg-success/10 text-foreground',
                  isWrong && 'border-destructive/40 bg-destructive/5 opacity-60',
                  !isCorrect &&
                    !isWrong &&
                    !isDisabled &&
                    'hover:border-primary/40 hover:bg-accent',
                  isResolved && !isCorrect && 'opacity-50 cursor-not-allowed',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex-shrink-0 size-5 rounded-full border flex items-center justify-center',
                    isCorrect && 'border-success bg-success text-white',
                    isWrong && 'border-destructive bg-destructive text-white',
                  )}
                >
                  {isCorrect && <Check className="h-3 w-3" />}
                  {isWrong && <X className="h-3 w-3" />}
                </span>
                <span className="flex-1">{opt.text}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div aria-live="polite">
        {isResolved && correctIndex !== null && (
          <p
            className={cn(
              'mt-4 text-sm flex items-center gap-1.5',
              revealed ? 'text-muted-foreground' : 'text-success',
            )}
          >
            <Check className="h-4 w-4" />
            {revealed
              ? 'Esta era la respuesta. Léela con calma antes de seguir.'
              : '¡Correcto!'}
          </p>
        )}
        {!isResolved && wrongIndices.size > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            No es esa — descarta y vuelve a pensar qué pregunta exactamente el
            enunciado.
          </p>
        )}
      </div>

      {canReveal && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReveal}
          className="mt-3"
        >
          <Eye className="mr-2 h-3.5 w-3.5" />
          Mostrar la respuesta
        </Button>
      )}

      {/* El porqué: convierte el quiz de evaluación en enseñanza. */}
      {isResolved && correctIndex !== null && explanationHast && (
        <div className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3 flex gap-2">
          <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
          <MarkdownContent
            hast={explanationHast}
            className="prose prose-sm dark:prose-invert max-w-none flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
          />
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { QuizBlock as QuizBlockType } from '#/lib/course/types'
import { cn } from '#/lib/utils'

export type QuizAttempt = {
  quizIndex: number
  selectedOptionIndex: number
  correct: boolean
  attemptedAt: number
}

export function QuizBlock({
  block,
  quizIndex,
  onAttempt,
  alreadyAnsweredCorrectly,
}: {
  block: QuizBlockType
  quizIndex: number
  onAttempt: (attempt: QuizAttempt) => void
  alreadyAnsweredCorrectly?: boolean
}) {
  const [wrongIndices, setWrongIndices] = useState<Set<number>>(new Set())
  const [correctIndex, setCorrectIndex] = useState<number | null>(null)

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

  return (
    <div className="rounded-lg border bg-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="rounded-full bg-primary/10 text-primary text-sm font-semibold size-7 inline-flex items-center justify-center flex-shrink-0">
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

      {isResolved && correctIndex !== null && (
        <p className="mt-4 text-sm text-success flex items-center gap-1.5">
          <Check className="h-4 w-4" />
          ¡Correcto!
        </p>
      )}
      {!isResolved && wrongIndices.size > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Sigue intentando.
        </p>
      )}
    </div>
  )
}

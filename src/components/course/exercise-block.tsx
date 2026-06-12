import { useState } from 'react'
import { Code2, Eye, Lightbulb } from 'lucide-react'
import type { Root } from 'hast'
import { Button } from '#/components/ui/button'
import { RunnableCode } from '#/components/course/runnable-code'
import { MarkdownContent } from '#/components/course/markdown-content'
import type { ExerciseBlock as ExerciseBlockType } from '#/lib/course/types'

export function ExerciseBlock({
  block,
  promptHast,
  starterHtml,
  solutionHtml,
  explanationHast,
  hintsHast,
  persistKey,
}: {
  block: ExerciseBlockType
  // Prose-y content goes through HAST so it picks up glossary terms etc.
  promptHast: Root
  explanationHast?: Root
  hintsHast?: Root[]
  // Code blocks stay as static highlighted HTML — Shiki's output IS the point.
  starterHtml: string
  solutionHtml: string
  // El código del alumno sobrevive recargas y navegación (clave de localStorage).
  persistKey?: string
}) {
  const [hintsShown, setHintsShown] = useState(0)
  const [solutionRevealed, setSolutionRevealed] = useState(false)

  const totalHints = hintsHast?.length ?? 0

  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-3 border-b border-primary/20 bg-primary/5 flex items-center gap-2">
        <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Code2 className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">
            Ejercicio práctico
          </div>
          <div className="text-sm font-semibold truncate">{block.title}</div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Prompt */}
        <MarkdownContent
          hast={promptHast}
          className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
        />

        {/* Starter code — editable + ejecutable si es Rust */}
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
            Tu código (modifícalo y ejecútalo)
          </div>
          {block.language === 'rust' ? (
            <RunnableCode
              initialCode={block.starterCode}
              staticHtml={starterHtml}
              persistKey={persistKey}
              testMode={block.testMode}
            />
          ) : (
            <div
              className="rounded-lg overflow-hidden border [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-3 [&_pre]:overflow-x-auto [&_pre]:text-sm"
              dangerouslySetInnerHTML={{ __html: starterHtml }}
            />
          )}
        </div>

        {/* Hints */}
        {totalHints > 0 && (
          <div className="space-y-2">
            {Array.from({ length: hintsShown }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex gap-2 text-sm"
              >
                <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0 text-warning" />
                <MarkdownContent
                  hast={hintsHast![i]!}
                  className="prose prose-sm dark:prose-invert max-w-none flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
                />
              </div>
            ))}
            {hintsShown < totalHints && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHintsShown((h) => h + 1)}
              >
                <Lightbulb className="mr-2 h-3.5 w-3.5" />
                Mostrar pista {hintsShown + 1} de {totalHints}
              </Button>
            )}
          </div>
        )}

        {/* Solution */}
        {!solutionRevealed ? (
          <Button
            variant="default"
            onClick={() => setSolutionRevealed(true)}
            className="w-full sm:w-auto"
          >
            <Eye className="mr-2 h-4 w-4" />
            Mostrar solución
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-success font-semibold">
              Solución
            </div>
            <div
              className="rounded-lg overflow-hidden border border-success/30 [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-3 [&_pre]:overflow-x-auto [&_pre]:text-sm"
              dangerouslySetInnerHTML={{ __html: solutionHtml }}
            />
            {explanationHast && (
              <MarkdownContent
                hast={explanationHast}
                className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

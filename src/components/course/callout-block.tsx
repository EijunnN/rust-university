import { Info, Lightbulb, AlertTriangle } from 'lucide-react'
import type { Root } from 'hast'
import type { CalloutBlock as CalloutBlockType } from '#/lib/course/types'
import { cn } from '#/lib/utils'
import { MarkdownContent } from './markdown-content'

const STYLE = {
  info: {
    icon: Info,
    box: 'border-info/30 bg-info/5',
    iconBox: 'bg-info/10 text-info',
  },
  warning: {
    icon: AlertTriangle,
    box: 'border-warning/40 bg-warning/10',
    iconBox: 'bg-warning/20 text-warning-foreground',
  },
  tip: {
    icon: Lightbulb,
    box: 'border-success/30 bg-success/5',
    iconBox: 'bg-success/10 text-success',
  },
} as const

export function CalloutBlock({
  variant,
  hast,
}: {
  variant: CalloutBlockType['variant']
  hast: Root
}) {
  const s = STYLE[variant]
  const Icon = s.icon
  return (
    <div className={cn('rounded-lg border p-4 sm:p-5 flex gap-3', s.box)}>
      <div
        className={cn(
          'flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md',
          s.iconBox,
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <MarkdownContent
        hast={hast}
        className="prose prose-sm dark:prose-invert max-w-none flex-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
      />
    </div>
  )
}

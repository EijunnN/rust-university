import { useRef, useState, type ReactNode } from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { findGlossaryEntry } from '#/lib/course/glossary'

// Interactive technical-term highlight rendered inside lesson markdown.
//
// Why Popover (controlled) instead of Tooltip or HoverCard:
//   - Popover handles click/tap natively (key requirement for mobile)
//   - Controlling `open` lets us ALSO open on hover (desktop niceness)
//     without losing the click behaviour
//   - All a11y (Escape, focus return, outside click, ARIA) comes free
//
// The rehype-glossary plugin emits <glossary-term data-id="..."> which
// hast-util-to-jsx-runtime maps to this component in markdown-content.tsx.
export function GlossaryTerm({
  'data-id': id,
  children,
}: {
  'data-id'?: string
  children?: ReactNode
}) {
  const entry = id ? findGlossaryEntry(id) : undefined
  const [open, setOpen] = useState(false)
  // Tiny grace period before closing on mouse leave, so the user can move
  // the cursor from the term to the popover content without it flickering shut.
  const closeTimer = useRef<number | null>(null)

  // Unknown id (defensive): just render the children plainly so the lesson
  // still reads correctly even if the glossary data drifts out of sync.
  if (!entry) return <>{children}</>

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <span
          className="glossary-term"
          tabIndex={0}
          aria-label={`Definición: ${entry.labels[0]}`}
          onMouseEnter={() => {
            cancelClose()
            setOpen(true)
          }}
          onMouseLeave={scheduleClose}
        >
          {children}
        </span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={12}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className="z-50 max-w-[20rem] rounded-lg border border-border bg-popover px-3.5 py-2.5 text-sm leading-relaxed text-popover-foreground shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1">
            {entry.labels[0]}
          </div>
          <div className="text-popover-foreground/95">{entry.short}</div>
          <PopoverPrimitive.Arrow className="fill-popover stroke-border" width={12} height={6} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

import { Lightbulb } from 'lucide-react'
import type { FirstPrinciplesBlock as FPBlock } from '#/lib/course/types'

export function FirstPrinciplesBlock({ block }: { block: FPBlock }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5 sm:p-6">
      <div className="flex items-center gap-2 text-primary mb-3">
        <Lightbulb className="h-4 w-4" />
        <span className="text-xs font-semibold tracking-wide uppercase">
          Primeros principios
        </span>
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-semibold leading-tight">
        {block.title}
      </h3>
      <dl className="mt-5 space-y-4 text-[0.95rem]">
        <Pair label="Problema" text={block.problem} />
        <Pair label="Modelo mental" text={block.mentalModel} />
        <Pair label="Ejemplo concreto" text={block.concreteExample} />
        <Pair label="Recuerda" text={block.remember} emphasis />
      </dl>
    </div>
  )
}

function Pair({
  label,
  text,
  emphasis,
}: {
  label: string
  text: string
  emphasis?: boolean
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </dt>
      <dd
        className={
          emphasis
            ? 'mt-1 font-medium text-foreground'
            : 'mt-1 text-foreground/90'
        }
      >
        {text}
      </dd>
    </div>
  )
}

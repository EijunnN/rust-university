import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Code2, Trophy, Zap } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { moduleMeta } from '#/lib/course/meta'

export const Route = createFileRoute('/_marketing/')({
  component: Landing,
})

function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">
              🦀 Curso 1 de la Universidad · En español · LatAm
            </Badge>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              Fundamentos de{' '}
              <span className="text-primary">Rust</span>.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Los cimientos sólidos del lenguaje, sin atajos. Variables,
              ownership, tipos, colecciones e iteradores — explicados desde el
              porqué, no desde la sintaxis.
            </p>
            <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
              Después de este curso vendrán: Cargo &amp; Módulos · Traits &amp;
              Generics · Errores &amp; Testing · I/O · Async · Performance. Aún
              en preparación — preferimos retrasar antes que enseñar a medias.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="text-base">
                <Link to="/signup">
                  Empezar gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <Link to="/signin">Ya tengo cuenta</Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {moduleMeta.length}
                </span>
                <span>módulos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {moduleMeta.reduce((acc, m) => acc + m.lessonCount, 0)}
                </span>
                <span>lecciones</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {moduleMeta.reduce((acc, m) => acc + m.estimatedMinutes, 0)}
                  m
                </span>
                <span>de contenido</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center">
          ¿Por qué esta universidad?
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
          No otro tutorial reciclado. Una ruta pensada para que Rust deje
          de sentirse imposible.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<Code2 className="h-6 w-6" />}
            title="Primero el porqué"
            text="Cada lección abre explicando el problema que Rust intenta resolver. No memorizas sintaxis: entiendes decisiones."
          />
          <Feature
            icon={<Zap className="h-6 w-6" />}
            title="Quizzes que cuentan"
            text="Tienes que entender para avanzar. Cada quiz acertado al primer intento te da puntos bonus."
          />
          <Feature
            icon={<Trophy className="h-6 w-6" />}
            title="Ranking en vivo"
            text="Compite con la comunidad. Sube de puesto cada vez que terminas una lección. Quien llegó primero, gana en empates."
          />
        </div>
      </section>

      {/* Modules preview */}
      <section className="border-t border-border/40 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-center">
            El recorrido del curso
          </h2>
          <p className="mt-4 text-center text-muted-foreground max-w-2xl mx-auto">
            {moduleMeta.length} módulos en orden estricto. Desde tu primer{' '}
            <code>println!</code> hasta dominar ownership, colecciones e
            iteradores.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {moduleMeta.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">
                      Módulo {m.order}
                    </div>
                    <h3 className="font-semibold truncate">{m.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {m.description}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {m.lessonCount} lecciones · ~{m.estimatedMinutes} min
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/signup">
                Empezar el curso
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}

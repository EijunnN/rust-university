import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_marketing')({
  component: MarketingLayout,
})

function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="text-xl">🦀</span>
            <span className="hidden sm:inline">Universidad de Rust</span>
            <span className="sm:hidden">Rust UNI</span>
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link to="/signin">Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Empezar gratis</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Universidad de Rust. Construido en Latinoamérica.</p>
      </footer>
    </div>
  )
}

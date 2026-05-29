import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context }) => {
    if (context.isAuthenticated) {
      throw redirect({ to: '/courses' })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="text-xl">🦀</span>
            <span>Universidad de Rust</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

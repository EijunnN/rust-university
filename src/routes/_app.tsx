import { useState } from 'react'
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import {
  BrainCircuit,
  LogOut,
  Menu,
  Settings,
  Trophy,
  User as UserIcon,
} from 'lucide-react'
import { PlaygroundDrawer } from '#/components/course/playground-drawer'
import { Toaster } from '#/components/ui/sonner'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import { Skeleton } from '#/components/ui/skeleton'
import { ThemeToggle } from '#/components/theme-toggle'
import { UserAvatar } from '#/components/user-avatar'
import { api } from '../../convex/_generated/api'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/signin' })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PlaygroundDrawer />
      <Toaster richColors closeButton position="bottom-right" />
    </div>
  )
}

function AppHeader() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { data: profile, isLoading } = useQuery(convexQuery(api.profile.getMyProfile, {}))

  const handleSignOut = async () => {
    await authClient.signOut()
    if (typeof window !== 'undefined') window.location.href = '/signin'
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile menu trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b p-4 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <span className="text-xl">🦀</span>
                  Universidad de Rust
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-4 gap-1">
                <Link
                  to="/courses"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  Cursos
                </Link>
                <Link
                  to="/repaso"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  Repaso
                </Link>
                <Link
                  to="/leaderboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  Ranking
                </Link>
                <Link
                  to="/me"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  Mi perfil
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/courses" className="flex items-center gap-2 font-bold">
            <span className="text-xl">🦀</span>
            <span className="hidden sm:inline">Universidad de Rust</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            <Link
              to="/courses"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              activeProps={{ className: 'text-foreground bg-accent' }}
            >
              Cursos
            </Link>
            <Link
              to="/repaso"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
              activeProps={{ className: 'text-foreground bg-accent' }}
            >
              <BrainCircuit className="h-4 w-4" />
              Repaso
            </Link>
            <Link
              to="/leaderboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1.5"
              activeProps={{ className: 'text-foreground bg-accent' }}
            >
              <Trophy className="h-4 w-4" />
              Ranking
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isLoading ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full p-0"
                  aria-label="Menú de usuario"
                >
                  <UserAvatar
                    seed={profile.avatarSeed}
                    username={profile.username}
                    size="md"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <span className="font-medium">@{profile.username}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {profile.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: '/me' })}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Mi perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: '/me/settings' })}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to="/signup">Completa tu perfil</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

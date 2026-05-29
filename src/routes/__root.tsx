/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { createServerFn } from '@tanstack/react-start'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { authClient } from '#/lib/auth-client'
import { getToken } from '#/lib/auth-server'
import { ThemeProvider, THEME_INIT_SCRIPT } from '#/lib/theme'
import { Button } from '#/components/ui/button'
import appCss from '#/styles.css?url'

const getAuth = createServerFn({ method: 'GET' }).handler(async () => {
  return await getToken()
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Fundamentos de Rust — Universidad de Rust' },
      {
        name: 'description',
        content:
          'Curso de Fundamentos de Rust en español: variables, ownership, tipos, colecciones e iteradores. Aprendido a fondo, no a medias.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth()
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }
    return { isAuthenticated: !!token, token }
  },
  component: RootComponent,
  notFoundComponent: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-4">🦀</div>
        <h1 className="font-serif text-3xl font-bold tracking-tight mb-2">
          Página no encontrada
        </h1>
        <p className="text-muted-foreground mb-6">
          La URL que buscas no existe o se movió. Volvé al inicio para seguir aprendiendo Rust.
        </p>
        <Button asChild>
          <Link to="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  )
}

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  return (
    <QueryClientProvider client={context.queryClient}>
      <ConvexBetterAuthProvider
        client={context.convexQueryClient.convexClient}
        authClient={authClient}
        initialToken={context.token}
      >
        <ThemeProvider>
          <RootDocument>
            <Outlet />
          </RootDocument>
        </ThemeProvider>
      </ConvexBetterAuthProvider>
    </QueryClientProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Anti-FOUC: runs synchronously before paint so the .dark class is
            applied before any styled element renders. Must live in <head>:
            React 19 warns about sync <script> elsewhere. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

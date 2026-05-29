import { convexBetterAuthReactStart } from '@convex-dev/better-auth/react-start'

// VITE_* env vars are inlined by Vite at build time into `import.meta.env`.
// This works both in dev (Node-based Vite) and prod (Cloudflare Workers runtime),
// where `process.env` is not natively available.
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL as string | undefined

if (!convexUrl) throw new Error('VITE_CONVEX_URL is not defined')
if (!convexSiteUrl) throw new Error('VITE_CONVEX_SITE_URL is not defined')

export const {
  handler,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthReactStart({
  convexUrl,
  convexSiteUrl,
})

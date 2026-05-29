import { betterAuth } from 'better-auth/minimal'
import { createClient, type GenericCtx } from '@convex-dev/better-auth'
import { convex } from '@convex-dev/better-auth/plugins'
import authConfig from './auth.config'
import { components } from './_generated/api'
import { query } from './_generated/server'
import type { DataModel } from './_generated/dataModel'

const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000'

// Build the trusted origins list explicitly. Includes:
//  - SITE_URL (what we configured)
//  - The same URL with the opposite protocol (CF Workers proxies internal
//    requests as http even when serving https — header reconstruction can
//    end up with http://...)
//  - Wildcards for both .workers.dev and localhost (any port) just in case
//  - Plain localhost for local dev
function withProtocolVariants(url: string): string[] {
  if (url.startsWith('https://')) {
    return [url, 'http://' + url.slice('https://'.length)]
  }
  if (url.startsWith('http://')) {
    return [url, 'https://' + url.slice('http://'.length)]
  }
  return [url]
}

const trustedOrigins = [
  ...withProtocolVariants(siteUrl),
  'http://localhost:3000',
  'http://localhost:5173',
  'https://*.workers.dev',
  'http://*.workers.dev',
]

export const authComponent = createClient<DataModel>(components.betterAuth)

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      // Email infrastructure is out of scope: no custom domain, no transactional
      // email provider. Stubs log to server console so an admin can recover
      // accounts manually if needed. Don't expose any "we sent you an email"
      // copy in the UI — we don't, in fact, send anything.
      sendResetPassword: async ({ user, url }) => {
        console.log('[reset password requested]', user.email, '→', url)
      },
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        console.log('[verify email requested]', user.email, '→', url)
      },
    },
    plugins: [convex({ authConfig })],
  })
}

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await authComponent.getAuthUser(ctx)
  },
})

import { useEffect, useRef, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { Check, Loader2, X } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { authClient } from '#/lib/auth-client'
import { api } from '../../../convex/_generated/api'

export const Route = createFileRoute('/_auth/signup')({
  component: SignUpPage,
})

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/

function SignUpPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [debouncedUsername, setDebouncedUsername] = useState('')
  // Once Better Auth has created the account + session, a retry (e.g. after a
  // username collision) must NOT call signUp.email again — it would fail with
  // "user already exists". We just re-run the profile step instead.
  const accountCreated = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedUsername(username), 300)
    return () => clearTimeout(t)
  }, [username])

  const usernameNormalized = debouncedUsername.toLowerCase().trim()
  const usernameValid = USERNAME_REGEX.test(usernameNormalized)
  const usernameAvailability = useQuery({
    ...convexQuery(api.profile.isUsernameAvailable, {
      username: usernameNormalized,
    }),
    enabled: usernameValid,
  })

  const createProfile = useMutation({
    mutationFn: useConvexMutation(api.profile.createProfile),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const normalized = username.toLowerCase().trim()
    if (!USERNAME_REGEX.test(normalized)) {
      setError(
        'Username: 3-20 caracteres, sólo letras minúsculas, números y guion bajo.',
      )
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setLoading(true)

    // 1) Better Auth signup — skipped on a retry where the account already
    //    exists from a previous submit. On success this also creates the
    //    session, so the user is authenticated from here on.
    if (!accountCreated.current) {
      const signUpResult = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: normalized,
      })

      if (signUpResult.error) {
        setLoading(false)
        const code = signUpResult.error.code ?? ''
        const msg = signUpResult.error.message ?? ''
        // Friendlier message for the most common case: email already registered.
        if (
          code.toUpperCase().includes('EXIST') ||
          /exist|already|registrad/i.test(msg)
        ) {
          setError(
            'Ese email ya tiene una cuenta. Inicia sesión en lugar de registrarte.',
          )
        } else {
          setError(msg || 'No se pudo crear la cuenta.')
        }
        return
      }
      accountCreated.current = true
    }

    // 2) Create the Convex profile. Idempotent server-side: if a profile
    //    already exists for this user it returns it instead of throwing, so a
    //    re-run never produces a spurious "ya existe" error. A genuine failure
    //    (e.g. username taken by someone else in a race) is shown so the user
    //    can pick another name and resubmit — which skips signUp this time.
    try {
      await createProfile.mutateAsync({ username: normalized })
    } catch (err) {
      setLoading(false)
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear tu perfil. Prueba otro nombre de usuario.',
      )
      return
    }

    // 3) Reload so the SSR root sees the new session.
    if (typeof window !== 'undefined') {
      window.location.href = '/courses'
    } else {
      navigate({ to: '/courses' })
    }
  }

  const showAvailability = usernameValid && debouncedUsername.length > 0
  const isAvailable = usernameAvailability.data === true
  const isUnavailable = usernameAvailability.data === false

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-serif">Crea tu cuenta</CardTitle>
        <CardDescription>
          Empieza a aprender Rust. Gratis, en español.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nombre de usuario</Label>
            <div className="relative">
              <Input
                id="username"
                required
                autoComplete="username"
                placeholder="tu_handle"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                disabled={loading}
                aria-describedby="username-help"
                className="pr-9"
              />
              {showAvailability && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {usernameAvailability.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  ) : isAvailable ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : isUnavailable ? (
                    <X className="h-4 w-4 text-destructive" />
                  ) : null}
                </div>
              )}
            </div>
            <p
              id="username-help"
              className="text-xs text-muted-foreground"
            >
              3-20 caracteres. Sólo minúsculas, números y _. Aparece en el
              ranking.
            </p>
            {showAvailability && isUnavailable && (
              <p className="text-xs text-destructive">
                Ese nombre ya está en uso.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (showAvailability && isUnavailable)}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear cuenta'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link to="/signin" className="text-primary font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

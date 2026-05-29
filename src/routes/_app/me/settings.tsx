import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
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
import { Skeleton } from '#/components/ui/skeleton'
import { UserAvatar } from '#/components/user-avatar'
import { api } from '../../../../convex/_generated/api'

export const Route = createFileRoute('/_app/me/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const profile = useQuery(convexQuery(api.profile.getMyProfile, {}))
  const [newUsername, setNewUsername] = useState('')

  const updateUsername = useMutation({
    mutationFn: useConvexMutation(api.profile.updateUsername),
  })
  const setVisibility = useMutation({
    mutationFn: useConvexMutation(api.profile.setLeaderboardVisibility),
  })
  const regenerateAvatar = useMutation({
    mutationFn: useConvexMutation(api.profile.regenerateAvatar),
  })

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUsername.mutateAsync({ username: newUsername })
      toast.success('Nombre de usuario actualizado')
      setNewUsername('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar')
    }
  }

  const handleVisibility = async (isPublic: boolean) => {
    try {
      await setVisibility.mutateAsync({ isPublic })
      toast.success(
        isPublic
          ? 'Tu progreso ahora es público en el ranking'
          : 'Tu progreso es privado',
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error')
    }
  }

  const handleRegenerateAvatar = async () => {
    try {
      await regenerateAvatar.mutateAsync({})
      toast.success('Nuevo avatar generado')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
      <Link
        to="/me"
        className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mi perfil
      </Link>

      <h1 className="font-serif text-3xl font-bold mb-8">Configuración</h1>

      {/* Avatar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>
            Generado automáticamente. Puedes regenerarlo cuando quieras.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          {profile.data ? (
            <UserAvatar
              seed={profile.data.avatarSeed}
              username={profile.data.username}
              size="xl"
            />
          ) : (
            <Skeleton className="size-20 rounded-full" />
          )}
          <Button
            variant="outline"
            onClick={handleRegenerateAvatar}
            disabled={regenerateAvatar.isPending}
          >
            {regenerateAvatar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerar
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Username */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nombre de usuario</CardTitle>
          <CardDescription>
            Tu identidad pública en el ranking. Puedes cambiarlo cada 30 días.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username actual</Label>
              {profile.data ? (
                <div className="text-lg font-medium">@{profile.data.username}</div>
              ) : (
                <Skeleton className="h-7 w-32" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-username">Nuevo username</Label>
              <Input
                id="new-username"
                placeholder="nuevo_handle"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                disabled={updateUsername.isPending}
              />
              <p className="text-xs text-muted-foreground">
                3-20 caracteres. Sólo minúsculas, números y _.
              </p>
            </div>
            <Button
              type="submit"
              disabled={!newUsername || updateUsername.isPending}
            >
              {updateUsername.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Cambiar username'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Leaderboard visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Privacidad del ranking</CardTitle>
          <CardDescription>
            Decide si tu progreso aparece en el ranking público.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile.data ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-medium">
                  {profile.data.isPublic ? 'Público' : 'Privado'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {profile.data.isPublic
                    ? 'Apareces en /leaderboard junto con tu username y puntos.'
                    : 'No apareces en el ranking. Sigues ganando puntos.'}
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleVisibility(!profile.data!.isPublic)}
                disabled={setVisibility.isPending}
              >
                {setVisibility.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : profile.data.isPublic ? (
                  'Hacer privado'
                ) : (
                  'Hacer público'
                )}
              </Button>
            </div>
          ) : (
            <Skeleton className="h-16" />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

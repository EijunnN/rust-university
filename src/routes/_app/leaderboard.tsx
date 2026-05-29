import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Trophy, Medal, Award } from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { Badge } from '#/components/ui/badge'
import { UserAvatar } from '#/components/user-avatar'
import { api } from '../../../convex/_generated/api'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_app/leaderboard')({
  component: LeaderboardPage,
})

function LeaderboardPage() {
  const top10 = useQuery(convexQuery(api.leaderboard.top10, {}))
  const myPos = useQuery(convexQuery(api.leaderboard.myPosition, {}))
  const myProfile = useQuery(convexQuery(api.profile.getMyProfile, {}))

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
      <header className="mb-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
          <Trophy className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
          Ranking
        </h1>
        <p className="mt-2 text-muted-foreground">
          Los 10 estudiantes con más puntos. Empates por quien llegó primero.
        </p>
      </header>

      {/* My position summary */}
      {myPos.data && myProfile.data && (
        <div className="mb-6 rounded-lg border bg-card p-4 flex items-center gap-3">
          <UserAvatar
            seed={myProfile.data.avatarSeed}
            username={myProfile.data.username}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              Estás en el puesto{' '}
              <strong className="text-foreground">
                #{myPos.data.position}
              </strong>{' '}
              de {myPos.data.totalPublicUsers} estudiantes públicos
            </div>
            <div className="text-xs text-muted-foreground">
              {myPos.data.totalPoints} puntos · {myPos.data.lessonsCompleted}{' '}
              lecciones
            </div>
          </div>
        </div>
      )}

      {/* Top 10 */}
      <div className="rounded-lg border bg-card divide-y">
        {top10.isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : top10.data && top10.data.length > 0 ? (
          top10.data.map((row) => {
            const isMe = myProfile.data?.username === row.username
            return (
              <div
                key={row.userId}
                className={cn(
                  'p-4 flex items-center gap-3 transition-colors',
                  isMe && 'bg-primary/5',
                )}
              >
                <RankBadge rank={row.rank} />
                <UserAvatar
                  seed={row.avatarSeed}
                  username={row.username}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    @{row.username}
                    {isMe && (
                      <Badge variant="outline" className="ml-2 text-[10px] h-4">
                        tú
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {row.lessonsCompleted} lecciones
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold tabular-nums">
                    {row.totalPoints}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    puntos
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Aún no hay estudiantes en el ranking. ¡Sé el primero!
          </div>
        )}
      </div>
    </div>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="size-7 inline-flex items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
        <Trophy className="h-4 w-4" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="size-7 inline-flex items-center justify-center rounded-full bg-gray-400/10 text-gray-400">
        <Medal className="h-4 w-4" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="size-7 inline-flex items-center justify-center rounded-full bg-amber-700/10 text-amber-700 dark:text-amber-500">
        <Award className="h-4 w-4" />
      </div>
    )
  }
  return (
    <div className="size-7 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-medium tabular-nums">
      {rank}
    </div>
  )
}

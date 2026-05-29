import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { cn } from '#/lib/utils'

type Size = 'sm' | 'md' | 'lg' | 'xl'

const SIZE: Record<Size, string> = {
  sm: 'size-6 text-xs',
  md: 'size-9 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-20 text-2xl',
}

const PIXEL: Record<Size, number> = { sm: 24, md: 36, lg: 48, xl: 80 }

export function UserAvatar({
  seed,
  username,
  size = 'md',
  className,
}: {
  seed: string
  username?: string
  size?: Size
  className?: string
}) {
  const px = PIXEL[size]
  const src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
    seed,
  )}&size=${px * 2}`
  const initials =
    (username ?? '?')
      .slice(0, 2)
      .toUpperCase()
  return (
    <Avatar className={cn(SIZE[size], className)}>
      <AvatarImage src={src} alt={username ? `Avatar de ${username}` : 'Avatar'} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

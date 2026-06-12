import { useEffect, useRef, useState } from 'react'
import {
  Check,
  ChevronDown,
  Cloud,
  FilePlus,
  FlaskConical,
  Loader2,
  Save,
  Trash2,
} from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convexQuery, useConvexMutation } from '@convex-dev/react-query'
import { toast } from 'sonner'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  RunnableCode,
  type RunnableCodeHandle,
} from '#/components/course/runnable-code'
import { api } from '../../../convex/_generated/api'
import type { Id } from '../../../convex/_generated/dataModel'

const DEFAULT_CODE = `// Playground: experimenta con Rust sin perder la lección.
// Los snippets que guardes se sincronizan con tu cuenta.

fn main() {
    let nombre = "Rustacean";
    println!("Hola, {}!", nombre);
}
`

const MAX_NAME_LENGTH = 40

// Legacy localStorage key used before snippets moved to Convex. We read it
// once on mount, push everything to the server, then delete it.
const LEGACY_LOCALSTORAGE_KEY = 'rust-uni-playground-snippets'

type Snippet = {
  id: Id<'playgroundSnippets'>
  name: string
  code: string
  updatedAt: number
}

// ─── Componente ──────────────────────────────────────────────────────────────

export function PlaygroundDrawer() {
  const editorRef = useRef<RunnableCodeHandle>(null)
  const [open, setOpen] = useState(false)

  // Snippets live in Convex now. The query auto-subscribes and refreshes
  // on any mutation.
  const snippetsQuery = useQuery(convexQuery(api.playground.listMine, {}))
  const snippets: Snippet[] = (snippetsQuery.data ?? []) as Snippet[]

  const saveMutation = useMutation({
    mutationFn: useConvexMutation(api.playground.save),
  })
  const removeMutation = useMutation({
    mutationFn: useConvexMutation(api.playground.remove),
  })
  const importMutation = useMutation({
    mutationFn: useConvexMutation(api.playground.importMany),
  })

  // Which snippet is currently loaded in the editor (null = draft).
  const [activeId, setActiveId] = useState<Id<'playgroundSnippets'> | null>(
    null,
  )

  // Save dialog state.
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveName, setSaveName] = useState('')

  const activeSnippet =
    activeId != null ? snippets.find((s) => s.id === activeId) ?? null : null

  // ─── One-shot migration from old localStorage snippets ───────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (snippetsQuery.isLoading) return  // wait until we know what's in Convex
    const raw = window.localStorage.getItem(LEGACY_LOCALSTORAGE_KEY)
    if (!raw) return
    let legacy: Array<{ name: string; code: string; updatedAt: number }> = []
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) throw new Error('not array')
      legacy = parsed
        .filter(
          (s) =>
            s &&
            typeof s.name === 'string' &&
            typeof s.code === 'string' &&
            typeof s.updatedAt === 'number',
        )
        .map((s) => ({ name: s.name, code: s.code, updatedAt: s.updatedAt }))
    } catch {
      // Malformed — just drop it.
      window.localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY)
      return
    }
    if (legacy.length === 0) {
      window.localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY)
      return
    }
    importMutation
      .mutateAsync({ snippets: legacy })
      .then((res) => {
        window.localStorage.removeItem(LEGACY_LOCALSTORAGE_KEY)
        if (res.imported > 0) {
          toast.success(
            `${res.imported} snippet${res.imported === 1 ? '' : 's'} migrado${res.imported === 1 ? '' : 's'} a tu cuenta`,
          )
        }
      })
      .catch(() => {
        // Leave localStorage in place to retry next mount.
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetsQuery.isLoading])

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleLoad = (id: Id<'playgroundSnippets'>) => {
    const s = snippets.find((x) => x.id === id)
    if (!s) return
    editorRef.current?.setCode(s.code)
    setActiveId(id)
    toast.success(`"${s.name}" cargado`)
  }

  const handleNewDraft = () => {
    editorRef.current?.setCode(DEFAULT_CODE)
    setActiveId(null)
  }

  const openSaveDialog = () => {
    setSaveName(activeSnippet?.name ?? '')
    setSaveDialogOpen(true)
  }

  const handleSaveConfirm = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const name = saveName.trim()
    if (!name) {
      toast.error('Necesitas darle un nombre')
      return
    }
    if (name.length > MAX_NAME_LENGTH) {
      toast.error(`Nombre demasiado largo (máx ${MAX_NAME_LENGTH})`)
      return
    }
    const code = editorRef.current?.getCode() ?? ''
    try {
      const res = await saveMutation.mutateAsync({
        id: activeId,
        name,
        code,
      })
      setActiveId(res.id)
      setSaveDialogOpen(false)
      toast.success(`"${res.name}" guardado`)
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo guardar',
      )
    }
  }

  const handleDelete = async () => {
    if (!activeSnippet) return
    const target = activeSnippet
    try {
      await removeMutation.mutateAsync({ id: target.id })
      setActiveId(null)
      toast.success(`"${target.name}" eliminado`, {
        action: {
          label: 'Deshacer',
          onClick: async () => {
            try {
              const res = await saveMutation.mutateAsync({
                id: null,
                name: target.name,
                code: target.code,
              })
              setActiveId(res.id)
            } catch (err) {
              toast.error(
                err instanceof Error
                  ? err.message
                  : 'No se pudo restaurar',
              )
            }
          },
        },
      })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo eliminar',
      )
    }
  }

  const isLoadingSnippets = snippetsQuery.isLoading
  const isSaving = saveMutation.isPending
  const isDeleting = removeMutation.isPending

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        {/* FAB */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  // max() con safe-area: en iPhones con notch/barra dinámica el
                  // FAB sube lo necesario para no quedar bajo la UI del sistema.
                  className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-40 rounded-full size-14 shadow-lg hover:shadow-xl transition-shadow"
                  aria-label="Abrir playground"
                >
                  <FlaskConical className="size-6" />
                </Button>
              </SheetTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Playground · prueba código</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col gap-0"
        >
          <SheetHeader className="border-b px-4 py-3 text-left flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              Playground
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <Cloud className="h-3 w-3" />
                Sincronizado
              </span>
            </SheetTitle>
            <SheetDescription className="text-xs">
              Tus snippets viven en tu cuenta — los ves en cualquier dispositivo
              donde inicies sesión.
            </SheetDescription>
          </SheetHeader>

          {/* Toolbar de snippets */}
          <div className="flex-shrink-0 border-b px-4 py-2.5 flex items-center gap-2">
            {/* Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 gap-1.5 min-w-0 max-w-[55%] justify-start"
                  disabled={isLoadingSnippets}
                >
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {activeSnippet ? 'Snippet' : 'Borrador'}
                  </span>
                  <span className="text-xs truncate">
                    {activeSnippet?.name ?? 'Sin guardar'}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-auto opacity-60 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-h-96 overflow-y-auto">
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Mis snippets
                </DropdownMenuLabel>
                {isLoadingSnippets ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground inline-flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Cargando…
                  </div>
                ) : snippets.length === 0 ? (
                  <div className="px-2 py-3 text-xs text-muted-foreground text-center">
                    No tienes nada guardado todavía.
                    <br />
                    Escribe código y usa <strong>Guardar</strong>.
                  </div>
                ) : (
                  snippets.map((s) => (
                    <DropdownMenuItem
                      key={s.id}
                      onClick={() => handleLoad(s.id)}
                      className="flex items-center gap-2"
                    >
                      {activeId === s.id ? (
                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      ) : (
                        <span className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <span className="truncate flex-1">{s.name}</span>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNewDraft}>
                  <FilePlus className="h-3.5 w-3.5 mr-2" />
                  Nuevo borrador
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Acciones */}
            <div className="ml-auto flex items-center gap-1">
              {activeSnippet && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  aria-label={`Eliminar ${activeSnippet.name}`}
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              )}
              <Button
                variant="default"
                size="sm"
                onClick={openSaveDialog}
                disabled={isSaving}
                className="h-8 px-3"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                )}
                {activeSnippet ? 'Guardar' : 'Guardar como…'}
              </Button>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-y-auto p-4">
            <RunnableCode
              ref={editorRef}
              initialCode={DEFAULT_CODE}
              persistKey="playground"
              minHeight="320px"
            />

            <p className="mt-4 text-[11px] text-muted-foreground">
              💡 Tu código en vivo se conserva en este navegador para que no lo
              pierdas si recargas. Para que quede asociado a tu cuenta y lo
              veas en otros dispositivos, dale un nombre con{' '}
              <strong>Guardar</strong>.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog: nombrar el snippet */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeSnippet ? 'Guardar cambios' : 'Guardar snippet'}
            </DialogTitle>
            <DialogDescription>
              {activeSnippet
                ? 'Actualiza el código guardado o cambia el nombre.'
                : 'Dale un nombre para reconocerlo después. Lo verás en cualquier dispositivo donde inicies sesión.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveConfirm} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="snippet-name">Nombre</Label>
              <Input
                id="snippet-name"
                autoFocus
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Ej. prueba de iteradores"
                maxLength={MAX_NAME_LENGTH}
                disabled={isSaving}
              />
              <div className="text-[10px] text-muted-foreground">
                Si ya tienes uno con este nombre, lo sobrescribimos.
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSaveDialogOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!saveName.trim() || isSaving}>
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                )}
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

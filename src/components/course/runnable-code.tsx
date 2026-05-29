import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import {
  bracketMatching,
  defaultHighlightStyle,
  syntaxHighlighting,
  indentOnInput,
} from '@codemirror/language'
import { rust } from '@codemirror/lang-rust'
import { oneDark } from '@codemirror/theme-one-dark'
import { CheckCircle2, Loader2, Play, RotateCcw, XCircle } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { executeRust, verifyRust, type VerifyResult } from '#/lib/rust-playground'
import { useTheme } from '#/lib/theme'

type Status = 'idle' | 'running' | 'done' | 'error'

export type RunnableCodeHandle = {
  setCode: (code: string) => void
  getCode: () => string
}

type Props = {
  initialCode: string
  // Pre-rendered shiki HTML for SSR / pre-mount. Component shows this while
  // CodeMirror hasn't mounted yet to avoid layout shift.
  staticHtml?: string
  className?: string
  // If set, the editor saves to localStorage under this key and restores on mount.
  persistKey?: string
  // Minimum editor height (e.g. '320px'). Default lets the editor size to content.
  minHeight?: string
  // Verification mode: when a test harness is provided, a "Verificar" button
  // appears. It appends `tests` to the learner's code, runs it, and reports
  // whether all assertions pass. `onVerified` fires with the classified result.
  tests?: string
  onVerified?: (result: VerifyResult) => void
}

export const RunnableCode = forwardRef<RunnableCodeHandle, Props>(function RunnableCode(
  { initialCode, staticHtml, className, persistKey, minHeight, tests, onVerified },
  ref,
) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  const themeCompartment = useRef(new Compartment()).current
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null)

  const storageKey = persistKey ? `rust-uni-code:${persistKey}` : null

  // Initialize CodeMirror on mount (client only).
  useEffect(() => {
    if (!hostRef.current) return

    // Restore from localStorage if persistKey set.
    let startDoc = initialCode
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored !== null) startDoc = stored
      } catch {}
    }

    const persistExt = storageKey
      ? EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            try {
              localStorage.setItem(storageKey, u.state.doc.toString())
            } catch {}
          }
        })
      : []

    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: startDoc,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          history(),
          indentOnInput(),
          bracketMatching(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          rust(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          themeCompartment.of(resolvedTheme === 'dark' ? oneDark : []),
          EditorView.theme({
            '&': { fontSize: '0.85rem' },
            '.cm-content': { fontFamily: 'var(--font-mono)' },
            '.cm-gutters': { fontFamily: 'var(--font-mono)' },
            ...(minHeight ? { '.cm-scroller': { minHeight } } : {}),
          }),
          persistExt,
        ],
      }),
    })
    viewRef.current = view
    setMounted(true)
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Swap theme when toggled at runtime.
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({
      effects: themeCompartment.reconfigure(
        resolvedTheme === 'dark' ? oneDark : [],
      ),
    })
  }, [resolvedTheme, themeCompartment])

  // Imperative handle: lets parent replace the editor content programmatically
  // (e.g., when loading a snippet in the playground).
  useImperativeHandle(
    ref,
    () => ({
      setCode(code) {
        const view = viewRef.current
        if (!view) return
        view.dispatch({
          changes: { from: 0, to: view.state.doc.length, insert: code },
        })
      },
      getCode() {
        return viewRef.current?.state.doc.toString() ?? ''
      },
    }),
    [],
  )

  const handleRun = useCallback(async () => {
    const view = viewRef.current
    if (!view) return
    const code = view.state.doc.toString()
    setStatus('running')
    setStdout('')
    setStderr('')
    setErrorMessage(null)
    setVerifyResult(null)
    try {
      const result = await executeRust({ code })
      setStdout(result.stdout)
      setStderr(result.stderr)
      setStatus(result.success ? 'done' : 'error')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error desconocido')
      setStatus('error')
    }
  }, [])

  const handleVerify = useCallback(async () => {
    const view = viewRef.current
    if (!view || !tests) return
    const code = view.state.doc.toString()
    setStatus('running')
    setStdout('')
    setStderr('')
    setErrorMessage(null)
    setVerifyResult(null)
    try {
      const result = await verifyRust(code, tests)
      setVerifyResult(result)
      setStdout(result.stdout)
      setStderr(result.stderr)
      setStatus(result.passed ? 'done' : 'error')
      onVerified?.(result)
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error desconocido')
      setStatus('error')
    }
  }, [tests, onVerified])

  const handleReset = useCallback(() => {
    const view = viewRef.current
    if (!view) return
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: initialCode },
    })
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey)
      } catch {}
    }
    setStdout('')
    setStderr('')
    setErrorMessage(null)
    setVerifyResult(null)
    setStatus('idle')
  }, [initialCode, storageKey])

  return (
    <div className={`rounded-lg border overflow-hidden bg-card ${className ?? ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b bg-muted/30">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          Rust · editable
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={status === 'running'}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button
            variant={tests ? 'outline' : 'default'}
            size="sm"
            onClick={handleRun}
            disabled={status === 'running'}
            className="h-7 px-3 text-xs"
          >
            {status === 'running' ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1 fill-current" />
                Ejecutar
              </>
            )}
          </Button>
          {tests && (
            <Button
              size="sm"
              onClick={handleVerify}
              disabled={status === 'running'}
              className="h-7 px-3 text-xs"
            >
              {status === 'running' ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              )}
              Verificar
            </Button>
          )}
        </div>
      </div>

      {/* Editor host. Before mount, show shiki readonly via staticHtml. */}
      <div className="relative">
        {!mounted && staticHtml && (
          <div
            className="[&_pre]:m-0 [&_pre]:px-3 [&_pre]:py-3 [&_pre]:overflow-x-auto [&_pre]:text-sm"
            dangerouslySetInnerHTML={{ __html: staticHtml }}
          />
        )}
        <div
          ref={hostRef}
          className={mounted ? '[&_.cm-editor]:max-h-[480px]' : 'sr-only'}
        />
      </div>

      {/* Verification verdict banner */}
      {verifyResult && (
        <div
          className={`border-t px-3 py-2.5 flex items-start gap-2 text-sm ${
            verifyResult.passed
              ? 'bg-success/10 text-success-foreground'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {verifyResult.passed ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-success" />
          ) : (
            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          )}
          <span className={verifyResult.passed ? 'text-foreground' : ''}>
            {verifyResult.message}
          </span>
        </div>
      )}

      {/* Output */}
      {(status === 'done' || status === 'error' || stdout || stderr || errorMessage) && (
        <div className="border-t bg-muted/20 px-3 py-3 space-y-2">
          {errorMessage && (
            <div className="text-xs text-destructive font-mono whitespace-pre-wrap">
              {errorMessage}
            </div>
          )}
          {stdout && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-success font-semibold mb-1">
                stdout
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/90">
                {stdout}
              </pre>
            </div>
          )}
          {stderr && (
            <div>
              <div
                className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${
                  status === 'error' ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {status === 'error' ? 'error' : 'stderr (info de compilación)'}
              </div>
              <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80">
                {stderr}
              </pre>
            </div>
          )}
          {status === 'done' && !stdout && !stderr && (
            <div className="text-xs text-muted-foreground">
              El programa terminó sin imprimir nada.
            </div>
          )}
        </div>
      )}
    </div>
  )
})

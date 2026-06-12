// Thin wrapper around play.rust-lang.org's public execute API.
// CORS is open for any origin; no auth needed.
// Docs: https://github.com/rust-lang/rust-playground

export type RustChannel = 'stable' | 'beta' | 'nightly'
export type RustMode = 'debug' | 'release'
export type RustEdition = '2015' | '2018' | '2021' | '2024'

export type ExecuteRequest = {
  code: string
  channel?: RustChannel
  mode?: RustMode
  edition?: RustEdition
  tests?: boolean
  backtrace?: boolean
}

export type ExecuteResponse = {
  success: boolean
  stdout: string
  stderr: string
}

const ENDPOINT = 'https://play.rust-lang.org/execute'

const MAX_ATTEMPTS = 3
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function executeRust(req: ExecuteRequest): Promise<ExecuteResponse> {
  const runTests = req.tests ?? false
  const body = {
    channel: req.channel ?? 'stable',
    mode: req.mode ?? 'debug',
    edition: req.edition ?? '2021',
    // Con tests, el playground compila como lib y corre `cargo test`
    // (no hace falta fn main; corre las funciones #[test]).
    crateType: runTests ? ('lib' as const) : ('bin' as const),
    tests: runTests,
    code: req.code,
    backtrace: req.backtrace ?? false,
  }

  // play.rust-lang.org is a free public service that occasionally returns 5xx
  // or drops connections under load. Those are transient, so retry with a short
  // backoff before surfacing an error. 4xx (our fault) fails fast.
  let lastError: Error | null = null
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let res: Response
    try {
      res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      // Network / CORS hiccup — transient.
      lastError = new Error(
        'No se pudo conectar con Rust Playground. Revisa tu conexión e intenta de nuevo.',
      )
      if (attempt < MAX_ATTEMPTS) {
        await delay(500 * attempt)
        continue
      }
      throw lastError
    }

    if (res.ok) return res.json()

    if (res.status >= 500 && attempt < MAX_ATTEMPTS) {
      // Transient server error — wait and retry.
      lastError = new Error(`Rust Playground respondió ${res.status}.`)
      await delay(500 * attempt)
      continue
    }

    throw new Error(
      res.status >= 500
        ? 'El servidor de Rust Playground está teniendo problemas (500). Espera unos segundos y vuelve a intentarlo.'
        : `Rust Playground respondió ${res.status}. Intenta de nuevo en unos segundos.`,
    )
  }

  throw lastError ?? new Error('No se pudo ejecutar el código.')
}

// ─── Auto-verification ─────────────────────────────────────────────────────────
//
// Used by faded exercises and productive-failure challenges to check that the
// learner's code actually works — not just "here's the solution, trust me".
//
// Contract: the learner implements one or more FUNCTIONS (no `fn main`). We
// append a test harness (`tests`) that calls those functions with assertions
// and prints a sentinel on success. We run the combined program and classify
// the outcome so the UI can give precise feedback.

const VERIFY_SENTINEL = '__ALL_TESTS_PASSED__'

export type VerifyKind = 'passed' | 'test-failed' | 'compile-error' | 'error'

export type VerifyResult = {
  passed: boolean
  kind: VerifyKind
  // Human-friendly, Spanish message for the learner.
  message: string
  // Raw streams (sentinel stripped from stdout) for the details panel.
  stdout: string
  stderr: string
}

function stripSentinel(stdout: string): string {
  return stdout
    .split('\n')
    .filter((line) => !line.includes(VERIFY_SENTINEL))
    .join('\n')
    .trimEnd()
}

// Pull the assertion message out of a panic, e.g.
//   thread 'main' panicked at src/main.rs:7:5:
//   doble(2) deberia ser 4
function extractAssertMessage(stderr: string): string | null {
  const m = stderr.match(/panicked at[^\n]*\n\s*(.+)/)
  if (m && m[1]) return m[1].trim()
  // assert_eq! prints "left == right" diagnostics; surface the first line.
  const left = stderr.match(/assertion `?(?:left == right|failed)`?[^\n]*/)
  return left ? left[0] : null
}

export async function verifyRust(
  userCode: string,
  tests: string,
): Promise<VerifyResult> {
  const code = `${userCode}\n\n// ── pruebas automáticas ──\n${tests}`
  const res = await executeRust({ code, backtrace: false })

  if (res.success && res.stdout.includes(VERIFY_SENTINEL)) {
    return {
      passed: true,
      kind: 'passed',
      message: '¡Correcto! Tu solución pasa todas las pruebas. 🎉',
      stdout: stripSentinel(res.stdout),
      stderr: res.stderr,
    }
  }

  const stderr = res.stderr
  const looksLikePanic = /panicked|assertion/i.test(stderr)
  const looksLikeCompileError = /error\[E\d+\]|error:/.test(stderr) && !looksLikePanic

  if (looksLikeCompileError) {
    return {
      passed: false,
      kind: 'compile-error',
      message:
        'Tu código no compila todavía. Mira el error abajo — Rust te dice exactamente qué falta.',
      stdout: stripSentinel(res.stdout),
      stderr,
    }
  }

  if (looksLikePanic) {
    const assertMsg = extractAssertMessage(stderr)
    return {
      passed: false,
      kind: 'test-failed',
      message: assertMsg
        ? `Compila, pero una prueba falló: ${assertMsg}`
        : 'Compila, pero no pasó todas las pruebas. Revisa los casos.',
      stdout: stripSentinel(res.stdout),
      stderr,
    }
  }

  return {
    passed: false,
    kind: 'error',
    message: 'No se pudo verificar. Intenta de nuevo.',
    stdout: stripSentinel(res.stdout),
    stderr,
  }
}

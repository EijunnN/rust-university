// Verifica TODO el código Rust del curso contra play.rust-lang.org.
//
// Qué comprueba:
//   - code blocks con runnable:true  → deben compilar y ejecutar sin error
//   - challenge.solution + tests     → deben imprimir __ALL_TESTS_PASSED__
//   - faded-exercise.solution + tests→ ídem
//   - exercise.solution (con main)   → debe compilar y ejecutar sin error
//   - concepts.ts review.solution    → deben imprimir __ALL_TESTS_PASSED__
//
// Uso:  bun run scripts/verify-course.ts [m03 m06 ...]
//   Sin argumentos verifica todos los módulos activos + concepts.
//
// Un ejercicio roto destruye la confianza del alumno; este script corre antes
// de publicar cualquier cambio de contenido.

import type { Block, Lesson, Module } from '../src/lib/course/types'
import { CONCEPTS } from '../src/lib/course/concepts'

const SENTINEL = '__ALL_TESTS_PASSED__'
const ENDPOINT = 'https://play.rust-lang.org/execute'
const CONCURRENCY = 3

type Item = {
  id: string // ej: m03_l02/challenge "Antes de leer..."
  kind: 'runnable' | 'challenge' | 'faded' | 'exercise' | 'concept'
  code: string
  expectSentinel: boolean
  // Ejecutar con cargo test (lib + #[test]) — bloques/ejercicios de testing.
  testMode?: boolean
}

type Failure = {
  item: Item
  reason: string
  stderr: string
}

async function loadModules(only: string[]): Promise<Module[]> {
  const loaders: Record<string, () => Promise<{ default: Module }>> = {
    m01: () => import('../src/lib/course/modules/m01-introduction'),
    m02: () => import('../src/lib/course/modules/m02-fundamentals'),
    m03: () => import('../src/lib/course/modules/m03-ownership'),
    m04: () => import('../src/lib/course/modules/m04-structs-enums'),
    m05: () => import('../src/lib/course/modules/m05-collections-errors'),
    m06: () => import('../src/lib/course/modules/m06-traits-generics').catch(() => import('../src/lib/course/modules/m06-under-the-hood')),
    m07: () => import('../src/lib/course/modules/m07-errors-testing'),
  }
  const ids = only.length > 0 ? only : ['m01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07']
  const mods: Module[] = []
  for (const id of ids) {
    const loader = loaders[id]
    if (!loader) {
      console.warn(`! módulo desconocido: ${id}`)
      continue
    }
    mods.push((await loader()).default)
  }
  return mods
}

function collectItems(modules: Module[], includeConcepts: boolean): Item[] {
  const items: Item[] = []
  for (const mod of modules) {
    for (const lesson of mod.lessons as Lesson[]) {
      for (const block of lesson.blocks as Block[]) {
        const at = `${lesson.id}`
        if (block.type === 'code' && block.runnable && block.language === 'rust') {
          items.push({
            id: `${at}/code "${block.code.slice(0, 40).replace(/\n/g, ' ')}…"`,
            kind: 'runnable',
            code: block.code,
            expectSentinel: false,
            testMode: block.testMode,
          })
        } else if (block.type === 'challenge') {
          items.push({
            id: `${at}/challenge "${block.title}"`,
            kind: 'challenge',
            code: `${block.solution}\n\n${block.tests}`,
            expectSentinel: true,
          })
        } else if (block.type === 'faded-exercise') {
          items.push({
            id: `${at}/faded "${block.title}"`,
            kind: 'faded',
            code: `${block.solution}\n\n${block.tests}`,
            expectSentinel: true,
          })
        } else if (block.type === 'exercise' && block.language === 'rust') {
          if (!block.testMode && !/fn\s+main\s*\(/.test(block.solution)) {
            console.warn(`! ${at}/exercise "${block.title}": solución sin fn main, omitida`)
            continue
          }
          items.push({
            id: `${at}/exercise "${block.title}"`,
            kind: 'exercise',
            code: block.solution,
            expectSentinel: false,
            testMode: block.testMode,
          })
        }
      }
    }
  }
  if (includeConcepts) {
    for (const c of CONCEPTS) {
      items.push({
        id: `concepts/${c.id}`,
        kind: 'concept',
        code: `${c.review.solution}\n\n${c.review.tests}`,
        expectSentinel: true,
      })
    }
  }
  return items
}

async function execute(
  code: string,
  testMode = false,
): Promise<{ success: boolean; stdout: string; stderr: string }> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'stable',
          mode: 'debug',
          edition: '2021',
          crateType: testMode ? 'lib' : 'bin',
          tests: testMode,
          code,
          backtrace: false,
        }),
      })
      if (res.ok) return (await res.json()) as { success: boolean; stdout: string; stderr: string }
      if (res.status < 500) throw new Error(`HTTP ${res.status}`)
    } catch (e) {
      if (attempt === 4) throw e
    }
    await new Promise((r) => setTimeout(r, 1500 * attempt))
  }
  throw new Error('unreachable')
}

function check(item: Item, res: { success: boolean; stdout: string; stderr: string }): Failure | null {
  // "warning:" en stderr es aceptable; "error" no.
  if (item.expectSentinel) {
    if (res.success && res.stdout.includes(SENTINEL)) return null
    return {
      item,
      reason: res.success ? 'corrió pero sin sentinel (¿tests no imprimen el sentinel?)' : 'la solución NO pasa sus propios tests',
      stderr: res.stderr,
    }
  }
  if (item.testMode) {
    // cargo test: exige éxito + el resumen "test result: ok" en stdout.
    if (res.success && /test result: ok/.test(res.stdout)) return null
    return {
      item,
      reason: res.success
        ? 'corrió pero sin "test result: ok" (¿no hay #[test]?)'
        : 'los tests no compilan o fallan',
      stderr: res.stderr,
    }
  }
  if (res.success) return null
  return { item, reason: 'no compila o panickea', stderr: res.stderr }
}

async function main() {
  const only = process.argv.slice(2)
  const modules = await loadModules(only)
  const includeConcepts = only.length === 0 || only.includes('concepts')
  const items = collectItems(modules, includeConcepts)
  console.log(`Verificando ${items.length} fragmentos de código Rust (concurrencia ${CONCURRENCY})...\n`)

  const failures: Failure[] = []
  let done = 0
  const queue = [...items]

  async function worker() {
    while (queue.length > 0) {
      const item = queue.shift()
      if (!item) break
      try {
        const res = await execute(item.code, item.testMode ?? false)
        const fail = check(item, res)
        done++
        if (fail) {
          failures.push(fail)
          console.log(`✗ [${done}/${items.length}] ${item.id} — ${fail.reason}`)
        } else {
          console.log(`✓ [${done}/${items.length}] ${item.id}`)
        }
      } catch (e) {
        done++
        failures.push({ item, reason: `error de red/API: ${e}`, stderr: '' })
        console.log(`! [${done}/${items.length}] ${item.id} — error de red`)
      }
      // Pausa corta para no castigar al servicio público.
      await new Promise((r) => setTimeout(r, 400))
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  console.log(`\n${'─'.repeat(60)}`)
  if (failures.length === 0) {
    console.log(`TODO OK: ${items.length}/${items.length} fragmentos verificados.`)
  } else {
    console.log(`FALLOS: ${failures.length} de ${items.length}\n`)
    for (const f of failures) {
      console.log(`✗ ${f.item.id}`)
      console.log(`  motivo: ${f.reason}`)
      const firstError = f.stderr
        .split('\n')
        .filter((l) => /error|panicked/.test(l))
        .slice(0, 4)
        .join('\n  ')
      if (firstError) console.log(`  ${firstError}`)
      console.log()
    }
    process.exit(1)
  }
}

main()

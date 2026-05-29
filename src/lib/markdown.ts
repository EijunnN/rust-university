import { unified, type Processor } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import rehypeStringify from 'rehype-stringify'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type { Root } from 'hast'
import { rehypeGlossary } from './rehype-glossary'

// Cloudflare Workers (the SSR runtime in this project) blocks dynamic WASM
// instantiation. Shiki's default highlighter loads Oniguruma (WASM), which
// fails at runtime. We build the highlighter manually with the JS regex
// engine — a drop-in replacement that covers all our languages.
//
// We also avoid the bundled `shiki` package (which pulls Oniguruma as a side
// effect even if you don't call it) by importing from `shiki/core`.

const LANGS = [
  'rust',
  'toml',
  'bash',
  'shell',
  'python',
  'javascript',
  'typescript',
  'c',
  'cpp',
  'java',
  'json',
  'text',
] as const

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter(): Promise<HighlighterCore> {
  if (highlighterPromise) return highlighterPromise
  highlighterPromise = createHighlighterCore({
    themes: [
      import('@shikijs/themes/one-light'),
      import('@shikijs/themes/one-dark-pro'),
    ],
    langs: [
      import('@shikijs/langs/rust'),
      import('@shikijs/langs/toml'),
      import('@shikijs/langs/bash'),
      import('@shikijs/langs/python'),
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/c'),
      import('@shikijs/langs/cpp'),
      import('@shikijs/langs/java'),
      import('@shikijs/langs/json'),
    ],
    engine: createJavaScriptRegexEngine(),
  })
  return highlighterPromise
}

// Two processors: one ends in HAST (for client-side React rendering with
// custom components like <glossary-term>), one ends in HTML string (for
// content where we don't need interactive components — e.g. code blocks
// rendered as static highlighted HTML).
//
// We avoid pinning the Processor generic types — unified's compile-result
// generic is finicky when the pipeline ends mid-stage (HAST, not string).

type StringProc = Processor<Root, Root, Root, Root, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let hastProcessorPromise: Promise<any> | null = null
let stringProcessorPromise: Promise<StringProc> | null = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildHastProcessor(): Promise<any> {
  const highlighter = await getHighlighter()
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShikiFromHighlighter, highlighter, {
      themes: { light: 'one-light', dark: 'one-dark-pro' },
      defaultColor: false,
    })
    // Glosario inline: emite <glossary-term data-id="..."> que el cliente
    // mapea a un componente React (Radix Popover). Va DESPUÉS de Shiki para
    // no tocar los <code>/<pre> ya tokenizados.
    .use(rehypeGlossary)
}

async function buildStringProcessor(): Promise<StringProc> {
  const highlighter = await getHighlighter()
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeShikiFromHighlighter, highlighter, {
      themes: { light: 'one-light', dark: 'one-dark-pro' },
      defaultColor: false,
    })
    .use(rehypeStringify, { allowDangerousHtml: true }) as unknown as StringProc
}

// Renders markdown to a HAST tree. Use this for content that should support
// interactive elements (glossary terms). The HAST tree is JSON-serializable
// and crosses the SSR→client boundary fine via TanStack Start's loader.
export async function renderMarkdownToHast(md: string): Promise<Root> {
  if (!hastProcessorPromise) hastProcessorPromise = buildHastProcessor()
  const processor = await hastProcessorPromise
  const mdAst = processor.parse(md)
  const hast = await processor.run(mdAst)
  return hast as Root
}

// Renders markdown to an HTML string. Use this for content that's purely
// static (e.g. code blocks where Shiki output is the whole point). No
// glossary processing here — terms wouldn't be interactive anyway.
export async function renderMarkdown(md: string): Promise<string> {
  if (!stringProcessorPromise) stringProcessorPromise = buildStringProcessor()
  const processor = await stringProcessorPromise
  const file = await processor.process(md)
  return String(file)
}

export async function renderCodeBlock(
  code: string,
  language: string,
): Promise<string> {
  const safeLang = (LANGS as readonly string[]).includes(language)
    ? language
    : 'text'
  const md = '```' + safeLang + '\n' + code + '\n```'
  return renderMarkdown(md)
}

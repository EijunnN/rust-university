import type { Root, Element, ElementContent, Text } from 'hast'
import { GLOSSARY, type GlossaryEntry } from './course/glossary'

// Tags whose text should NEVER be touched. Code blocks must stay byte-exact
// (Shiki has already tokenised them anyway), links shouldn't get a competing
// affordance, and headings would look noisy with dotted underlines.
const SKIP_TAGS = new Set([
  'code',
  'pre',
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'script',
  'style',
])

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildMatcher(entries: GlossaryEntry[]): {
  pattern: RegExp
  labelToId: Map<string, string>
} {
  const labelToId = new Map<string, string>()
  const labels: string[] = []
  for (const e of entries) {
    for (const l of e.labels) {
      labelToId.set(l.toLowerCase(), e.id)
      labels.push(l)
    }
  }
  // Longest first so "data race" matches before "data" would (if ever added).
  labels.sort((a, b) => b.length - a.length)
  // Unicode-aware word boundaries: don't match inside other words.
  // (?<!\p{L}\p{N}_) and (?!\p{L}\p{N}_) handle accented Spanish chars properly.
  const pattern = new RegExp(
    '(?<![\\p{L}\\p{N}_])(?:' +
      labels.map(escapeRegex).join('|') +
      ')(?![\\p{L}\\p{N}_])',
    'giu',
  )
  return { pattern, labelToId }
}

// Build once at module load — cheap and the list is static.
const { pattern: GLOSSARY_PATTERN, labelToId: LABEL_TO_ID } = buildMatcher(
  GLOSSARY,
)

// Custom HAST element. On the client, hast-util-to-jsx-runtime maps the
// `glossary-term` tag name to a real React component (Radix Popover trigger)
// instead of a plain <span>. The data-id attribute carries the lookup key.
function makeTermSpan(matchedText: string, id: string): Element {
  return {
    type: 'element',
    tagName: 'glossary-term',
    properties: { 'data-id': id },
    children: [{ type: 'text', value: matchedText }],
  }
}

// Splits a text node into a mix of text + term spans based on regex matches.
// Returns null if there were no matches (so the caller can leave the node intact).
function splitTextNode(node: Text, seen: Set<string>): ElementContent[] | null {
  const value = node.value
  // Reset regex state — global regexes are stateful.
  GLOSSARY_PATTERN.lastIndex = 0
  const out: ElementContent[] = []
  let cursor = 0
  let matched = false
  for (const m of value.matchAll(GLOSSARY_PATTERN)) {
    const matchText = m[0]
    if (m.index === undefined) continue
    const id = LABEL_TO_ID.get(matchText.toLowerCase())
    if (!id) continue
    // Within a single text node, only mark the first occurrence per term.
    // Multiple underlines of the same word in one paragraph is just noise.
    if (seen.has(id)) continue
    seen.add(id)
    matched = true
    if (m.index > cursor) {
      out.push({ type: 'text', value: value.slice(cursor, m.index) })
    }
    out.push(makeTermSpan(matchText, id))
    cursor = m.index + matchText.length
  }
  if (!matched) return null
  if (cursor < value.length) {
    out.push({ type: 'text', value: value.slice(cursor) })
  }
  return out
}

function walk(parent: Element | Root, ancestorSkip: boolean): void {
  // Iterate in reverse so we can splice replacements without skipping nodes.
  // For each child:
  //   - element: recurse (or skip subtree if its tag is in SKIP_TAGS)
  //   - text:    try to split into text/term-span fragments
  //   - other:   leave as-is (Doctype, Comment, Raw)
  const children = parent.children as Array<Element | Text | unknown>
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i] as Element | Text | { type: string }
    if (child.type === 'element') {
      const el = child as Element
      const tag = el.tagName.toLowerCase()
      if (!ancestorSkip && !SKIP_TAGS.has(tag)) walk(el, false)
    } else if (child.type === 'text' && !ancestorSkip) {
      const seen = new Set<string>()
      const replaced = splitTextNode(child as Text, seen)
      if (replaced) {
        // Splice in the new fragments where the text node was.
        ;(parent.children as Array<unknown>).splice(i, 1, ...replaced)
      }
    }
  }
}

// Rehype plugin: wraps glossary term mentions in <span class="glossary-term" data-term="id">.
// Place this AFTER syntax highlighting so it doesn't touch <code>/<pre> contents.
export function rehypeGlossary() {
  return function transformer(tree: Root): void {
    walk(tree, false)
  }
}

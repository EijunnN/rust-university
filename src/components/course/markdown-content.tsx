import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import type { Root } from 'hast'
import { GlossaryTerm } from './glossary-term'

// Renders a HAST tree as React, substituting the custom <glossary-term> tag
// with an actual React component (Radix Popover). Standard tags (p, code,
// span with Shiki styles, etc.) pass through as-is.
//
// HAST is what comes out of `renderMarkdownToHast` in src/lib/markdown.ts —
// a plain JSON-serializable object tree, safe to ship from the SSR loader to
// the client without re-parsing.
export function MarkdownContent({
  hast,
  className,
}: {
  hast: Root
  className?: string
}) {
  const tree = toJsxRuntime(hast, {
    Fragment,
    jsx,
    jsxs,
    components: {
      // Custom element interception: <glossary-term data-id="..."> becomes
      // an interactive popover-backed React component.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      'glossary-term': GlossaryTerm as any,
    },
    // Allow our custom tag name through without complaints.
    passNode: false,
  })
  return <div className={className}>{tree}</div>
}

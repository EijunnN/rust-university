import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import type { Root } from "hast";
import type { CalloutBlock as CalloutBlockType } from "#/lib/course/types";
import { cn } from "#/lib/utils";
import { MarkdownContent } from "./markdown-content";

const STYLE = {
	info: {
		icon: Info,
		box: "border-info/30 bg-info/5",
		iconBox: "bg-info/10 text-info",
	},
	warning: {
		icon: AlertTriangle,
		box: "border-warning/40 bg-warning/10",
		iconBox: "bg-warning/20 text-warning-foreground",
	},
	tip: {
		icon: Lightbulb,
		box: "border-success/30 bg-success/5",
		iconBox: "bg-success/10 text-success",
	},
} as const;

export function CalloutBlock({
	variant,
	hast,
	showLegend,
	pyjsHast,
}: {
	variant: CalloutBlockType["variant"];
	hast: Root;
	// Solo true en la primera "ficha de anatomía" de la lección: pinta la
	// leyenda del receptor una vez, de-enfatizada (el loader la quita del cuerpo
	// de las 21 fichas para no repetirla).
	showLegend?: boolean;
	// HAST de la fila "Trampa Py/JS" que el loader extrajo de la ficha. Si
	// viene, se pinta plegada en un <details> "Si vienes de Python/JS".
	pyjsHast?: Root;
}) {
	const s = STYLE[variant];
	const Icon = s.icon;
	return (
		<div className={cn("rounded-lg border p-4 sm:p-5 flex gap-3", s.box)}>
			<div
				className={cn(
					"flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md",
					s.iconBox,
				)}
			>
				<Icon className="h-4 w-4" />
			</div>
			<div className="flex-1 min-w-0">
				<MarkdownContent
					hast={hast}
					className="prose prose-sm dark:prose-invert max-w-none cl-prose prose-headings:font-serif [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
				/>
				{pyjsHast && (
					<details className="anatomy-pyjs">
						<summary>Si vienes de Python/JS</summary>
						<MarkdownContent
							hast={pyjsHast}
							className="prose prose-sm dark:prose-invert max-w-none [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
						/>
					</details>
				)}
				{showLegend && (
					<div className="anatomy-legend">
						Cómo leer el receptor: <code>self</code> = se lo come ·{" "}
						<code>{"&self"}</code> = lo mira y te da algo nuevo ·{" "}
						<code>{"&mut self"}</code> = lo cambia en sitio.
					</div>
				)}
			</div>
		</div>
	);
}

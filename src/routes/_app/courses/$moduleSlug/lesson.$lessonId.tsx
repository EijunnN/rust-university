import { useMemo, useState } from "react";
import {
	Link,
	createFileRoute,
	notFound,
	useNavigate,
} from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BookOpen, Check, Loader2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "#/components/ui/sheet";
import {
	loadModule,
	getNextLessonId,
	getPreviousLessonId,
	isLastLessonOfModule,
	getModuleMetaBySlug,
	getAllLessonIdsInOrder,
} from "#/lib/course";
import { renderMarkdownToHast, renderCodeBlock } from "#/lib/markdown";
import { LessonSidebar } from "#/components/course/lesson-sidebar";
import { CalloutBlock } from "#/components/course/callout-block";
import { ChallengeBlock } from "#/components/course/challenge-block";
import { ExerciseBlock } from "#/components/course/exercise-block";
import { FadedExercise } from "#/components/course/faded-exercise";
import { FirstPrinciplesBlock } from "#/components/course/first-principles-block";
import { MarkdownContent } from "#/components/course/markdown-content";
import { QuizBlock, type QuizAttempt } from "#/components/course/quiz-block";
import { RunnableCode } from "#/components/course/runnable-code";
import type { Root as HastRoot } from "hast";
import type {
	Block,
	CalloutBlock as CalloutBlockType,
	ChallengeBlock as ChallengeBlockType,
	CodeBlock as CodeBlockType,
	ExerciseBlock as ExerciseBlockType,
	FadedExerciseBlock as FadedExerciseBlockType,
	FirstPrinciplesBlock as FPBlock,
	Lesson,
	Module,
	QuizBlock as QuizBlockType,
	TextBlock as TextBlockType,
} from "#/lib/course/types";
import { api } from "../../../../../convex/_generated/api";

type RenderedExercise = ExerciseBlockType & {
	promptHast: HastRoot;
	starterHtml: string;
	solutionHtml: string;
	explanationHast?: HastRoot;
	hintsHast?: HastRoot[];
};

type RenderedChallenge = ChallengeBlockType & {
	promptHast: HastRoot;
	revealHast: HastRoot;
	hintsHast?: HastRoot[];
	starterHtml: string;
	solutionHtml: string;
};

type RenderedFaded = FadedExerciseBlockType & {
	introHast?: HastRoot;
	stageInstructionsHast: HastRoot[];
	stageCodeHtml: string[];
	solutionHtml: string;
};

type RenderedBlock =
	| (TextBlockType & { hast: HastRoot })
	| (CodeBlockType & { html: string })
	| (CalloutBlockType & {
			hast: HastRoot;
			showLegend?: boolean;
			pyjsHast?: HastRoot;
	  })
	| FPBlock
	| (QuizBlockType & { quizIndex: number; explanationHast?: HastRoot })
	| RenderedExercise
	| RenderedChallenge
	| RenderedFaded;

type LoaderData = {
	module: Module;
	lesson: Lesson;
	blocks: RenderedBlock[];
	prevLessonId: string | null;
	nextLessonId: string | null;
	isLastInModule: boolean;
};

export const Route = createFileRoute(
	"/_app/courses/$moduleSlug/lesson/$lessonId",
)({
	// Sin esto, navegar entre lecciones NO desmonta LessonPage (mismo route,
	// distinto param) y React conserva el estado de los bloques interactivos:
	// retos verificados, quizzes respondidos y el contenido de CodeMirror de
	// la lección anterior se filtran a la nueva.
	remountDeps: ({ params }) => params,
	loader: async ({ params }): Promise<LoaderData> => {
		const module = await loadModule(params.moduleSlug);
		if (!module) throw notFound();
		const lesson = module.lessons.find((l) => l.id === params.lessonId);
		if (!lesson) throw notFound();

		let quizCounter = 0;
		// El pie-leyenda "Lee el receptor: self/&self/&mut self" está escrito
		// literal en las 21 fichas de anatomía (m02–m05). Lo separamos del cuerpo
		// y lo mostramos UNA sola vez por lección (en la primera ficha),
		// de-enfatizado — el dato sigue intacto en el contenido fuente.
		const FICHA_RE = /Lee el receptor:/;
		const LEGEND_RE = /\n*>\s*Lee el receptor:[^\n]*\n?/;
		// Saca la fila "Trampa Py/JS" de las fichas clave/valor de 2 columnas a
		// un <details> colapsable; las fichas multi-método (5 columnas, con la
		// Trampa como última columna) no matchean y la mantienen en su sitio.
		const PYJS_ROW_RE =
			/^\|\s*\**\s*Trampa Py\/JS\s*\**\s*\|\s*(.+?)\s*\|[^\n]*$/m;
		const firstFichaIdx = lesson.blocks.findIndex(
			(b) => b.type === "callout" && FICHA_RE.test(b.body),
		);
		const rendered = await Promise.all(
			lesson.blocks.map(
				async (b: Block, idx: number): Promise<RenderedBlock> => {
					switch (b.type) {
						case "text":
							return { ...b, hast: await renderMarkdownToHast(b.body) };
						case "callout": {
							if (FICHA_RE.test(b.body)) {
								let body = b.body
									.replace(LEGEND_RE, "")
									.replace(/\n{3,}/g, "\n\n")
									.trimEnd();
								const pyjsMatch = body.match(PYJS_ROW_RE);
								let pyjsHast: HastRoot | undefined;
								if (pyjsMatch) {
									pyjsHast = await renderMarkdownToHast(pyjsMatch[1]);
									body = body
										.replace(PYJS_ROW_RE, "")
										.replace(/\n{3,}/g, "\n\n")
										.trimEnd();
								}
								return {
									...b,
									body,
									hast: await renderMarkdownToHast(body),
									showLegend: idx === firstFichaIdx,
									pyjsHast,
								};
							}
							return { ...b, hast: await renderMarkdownToHast(b.body) };
						}
						case "code":
							return { ...b, html: await renderCodeBlock(b.code, b.language) };
						case "first-principles":
							return b;
						case "quiz":
							return {
								...b,
								quizIndex: quizCounter++,
								explanationHast: b.explanation
									? await renderMarkdownToHast(b.explanation)
									: undefined,
							};
						case "exercise": {
							const [promptHast, starterHtml, solutionHtml, explanationHast] =
								await Promise.all([
									renderMarkdownToHast(b.prompt),
									renderCodeBlock(b.starterCode, b.language),
									renderCodeBlock(b.solution, b.language),
									b.explanation
										? renderMarkdownToHast(b.explanation)
										: Promise.resolve(undefined),
								]);
							const hintsHast = b.hints
								? await Promise.all(b.hints.map((h) => renderMarkdownToHast(h)))
								: undefined;
							return {
								...b,
								promptHast,
								starterHtml,
								solutionHtml,
								explanationHast,
								hintsHast,
							};
						}
						case "challenge": {
							const [promptHast, revealHast, starterHtml, solutionHtml] =
								await Promise.all([
									renderMarkdownToHast(b.prompt),
									renderMarkdownToHast(b.reveal),
									renderCodeBlock(b.starterCode, "rust"),
									renderCodeBlock(b.solution, "rust"),
								]);
							const hintsHast = b.hints
								? await Promise.all(b.hints.map((h) => renderMarkdownToHast(h)))
								: undefined;
							return {
								...b,
								promptHast,
								revealHast,
								hintsHast,
								starterHtml,
								solutionHtml,
							};
						}
						case "faded-exercise": {
							const [
								introHast,
								stageInstructionsHast,
								stageCodeHtml,
								solutionHtml,
							] = await Promise.all([
								b.intro
									? renderMarkdownToHast(b.intro)
									: Promise.resolve(undefined),
								Promise.all(
									b.stages.map((s) => renderMarkdownToHast(s.instructions)),
								),
								Promise.all(
									b.stages.map((s) => renderCodeBlock(s.code, "rust")),
								),
								renderCodeBlock(b.solution, "rust"),
							]);
							return {
								...b,
								introHast,
								stageInstructionsHast,
								stageCodeHtml,
								solutionHtml,
							};
						}
					}
				},
			),
		);

		return {
			module,
			lesson,
			blocks: rendered,
			prevLessonId: getPreviousLessonId(params.lessonId),
			nextLessonId: getNextLessonId(params.lessonId),
			isLastInModule: isLastLessonOfModule(params.lessonId),
		};
	},
	component: LessonPage,
	notFoundComponent: () => (
		<div className="container mx-auto px-4 py-16 text-center">
			<h1 className="text-2xl font-bold">Lección no encontrada</h1>
			<p className="mt-2 text-muted-foreground">
				Verifica el enlace o vuelve al catálogo.
			</p>
			<Button asChild className="mt-6">
				<Link to="/courses">Ir al catálogo</Link>
			</Button>
		</div>
	),
});

function LessonPage() {
	const data = Route.useLoaderData();
	const { module, lesson, blocks, prevLessonId, nextLessonId, isLastInModule } =
		data;
	const params = Route.useParams();
	const navigate = useNavigate();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const meta = useMemo(
		() => getModuleMetaBySlug(params.moduleSlug),
		[params.moduleSlug],
	);

	const completedQuery = useQuery(
		convexQuery(api.progress.getMyCompletedLessonIds, {}),
	);
	const completedSet = useMemo(
		() => new Set(completedQuery.data ?? []),
		[completedQuery.data],
	);

	const existingProgress = useQuery(
		convexQuery(api.progress.getMyLessonProgress, { lessonId: lesson.id }),
	);

	const completeMutation = useMutation({
		mutationFn: useConvexMutation(api.progress.completeLesson),
	});

	// Quiz state
	const totalQuizzes = useMemo(
		() => blocks.filter((b) => b.type === "quiz").length,
		[blocks],
	);
	const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
	const correctQuizSet = useMemo(() => {
		const s = new Set<number>();
		for (const a of attempts) if (a.correct) s.add(a.quizIndex);
		return s;
	}, [attempts]);

	const alreadyCompleted = existingProgress.data?.status === "completed";
	const allQuizzesPassed =
		totalQuizzes === 0 || correctQuizSet.size === totalQuizzes;
	const canComplete = allQuizzesPassed && !alreadyCompleted;

	const handleComplete = async () => {
		if (!canComplete) return;
		try {
			const result = await completeMutation.mutateAsync({
				lessonId: lesson.id,
				moduleId: module.id,
				moduleVersion: module.version,
				totalQuizzesInLesson: totalQuizzes,
				quizAttempts: attempts,
			});

			if (!result.alreadyCompleted) {
				toast.success(`¡Lección completada! +${result.pointsAwarded} puntos`, {
					description:
						(result.quizBonus ?? 0) > 0
							? `Incluye +${result.quizBonus} bonus por quizzes acertados.`
							: undefined,
				});
			}

			if (isLastInModule) {
				navigate({
					to: "/courses/$moduleSlug/complete",
					params: { moduleSlug: module.slug },
				});
			} else if (nextLessonId) {
				const allLessons = getAllLessonIdsInOrder();
				const nextIdx = allLessons.indexOf(nextLessonId);
				const nextLesson = module.lessons.find((l) => l.id === nextLessonId);
				if (nextLesson) {
					// Next lesson is in the same module
					navigate({
						to: "/courses/$moduleSlug/lesson/$lessonId",
						params: { moduleSlug: module.slug, lessonId: nextLessonId },
					});
				} else if (nextIdx !== -1) {
					// Next lesson is in the next module — find its slug.
					// We rely on lesson id prefix (m02_l01 → m02) to map.
					const nextModuleId = nextLessonId.split("_")[0];
					if (nextModuleId) {
						// Lazy: link to /courses for the user to pick (defensive fallback).
						navigate({ to: "/courses" });
					}
				}
			} else {
				navigate({ to: "/courses" });
			}
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "No se pudo completar la lección",
			);
		}
	};

	if (!meta) {
		return (
			<div className="container mx-auto px-4 py-16 text-center">
				Módulo no encontrado.
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-screen-2xl grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_280px] min-h-[calc(100vh-3.5rem)]">
			{/* Desktop sidebar */}
			<div className="hidden lg:block border-r border-border/40 sticky top-14 self-start max-h-[calc(100vh-3.5rem)]">
				<LessonSidebar
					meta={meta}
					currentLessonId={lesson.id}
					completedLessonIds={completedSet}
				/>
			</div>

			{/* Mobile drawer trigger */}
			<div className="lg:hidden border-b border-border/40 px-4 py-3 sticky top-14 bg-background z-30">
				<Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
					<SheetTrigger asChild>
						<Button variant="outline" size="sm" className="gap-2">
							<BookOpen className="h-4 w-4" />
							Lecciones del módulo
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-[85vw] max-w-80 p-0">
						<LessonSidebar
							meta={meta}
							currentLessonId={lesson.id}
							completedLessonIds={completedSet}
							onNavigate={() => setDrawerOpen(false)}
						/>
					</SheetContent>
				</Sheet>
			</div>

			<main className="px-4 sm:px-6 py-8 sm:py-10 max-w-3xl mx-auto w-full">
				{/* Breadcrumbs */}
				<nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1 flex-wrap">
					<Link to="/courses" className="hover:text-foreground">
						Cursos
					</Link>
					<span>/</span>
					<span>{meta.title}</span>
					<span>/</span>
					<span className="text-foreground font-medium">
						Lección {lesson.order}
					</span>
				</nav>

				<header className="mb-8">
					<div className="text-xs uppercase tracking-wider text-muted-foreground">
						Módulo {meta.order} · Lección {lesson.order}
					</div>
					<h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mt-1">
						{lesson.title}
					</h1>
				</header>

				<article className="space-y-6">
					{blocks.map((b, i) => {
						switch (b.type) {
							case "text":
								return (
									<MarkdownContent
										key={i}
										hast={b.hast}
										className="prose prose-zinc dark:prose-invert max-w-[68ch] mx-auto prose-headings:font-serif prose-pre:p-0 prose-pre:bg-transparent prose-pre:my-0 prose-code:before:content-none prose-code:after:content-none"
									/>
								);
							case "code":
								if (b.runnable && b.language === "rust") {
									return (
										<RunnableCode
											key={i}
											initialCode={b.code}
											staticHtml={b.html}
											testMode={b.testMode}
										/>
									);
								}
								return (
									<div
										key={i}
										className="rounded-lg overflow-hidden border [&_pre]:m-0 [&_pre]:px-4 [&_pre]:py-4 [&_pre]:overflow-x-auto [&_pre]:text-sm"
										dangerouslySetInnerHTML={{ __html: b.html }}
									/>
								);
							case "callout":
								return (
									<CalloutBlock
										key={i}
										variant={b.variant}
										hast={b.hast}
										showLegend={b.showLegend}
										pyjsHast={b.pyjsHast}
									/>
								);
							case "first-principles":
								return <FirstPrinciplesBlock key={i} block={b} />;
							case "quiz":
								return (
									<QuizBlock
										key={i}
										block={b}
										quizIndex={b.quizIndex}
										alreadyAnsweredCorrectly={alreadyCompleted}
										explanationHast={b.explanationHast}
										onAttempt={(a) => setAttempts((prev) => [...prev, a])}
									/>
								);
							case "exercise":
								return (
									<ExerciseBlock
										key={i}
										block={b}
										promptHast={b.promptHast}
										starterHtml={b.starterHtml}
										solutionHtml={b.solutionHtml}
										explanationHast={b.explanationHast}
										hintsHast={b.hintsHast}
										persistKey={`${lesson.id}-ex${i}`}
									/>
								);
							case "challenge":
								return (
									<ChallengeBlock
										key={i}
										block={b}
										promptHast={b.promptHast}
										revealHast={b.revealHast}
										hintsHast={b.hintsHast}
										starterHtml={b.starterHtml}
										solutionHtml={b.solutionHtml}
										persistKey={`${lesson.id}-ch${i}`}
									/>
								);
							case "faded-exercise":
								return (
									<FadedExercise
										key={i}
										block={b}
										introHast={b.introHast}
										stageInstructionsHast={b.stageInstructionsHast}
										stageCodeHtml={b.stageCodeHtml}
										solutionHtml={b.solutionHtml}
										persistKey={`${lesson.id}-fd${i}`}
									/>
								);
						}
					})}
				</article>

				{/* Bottom CTA */}
				<div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
					<Button
						asChild={!!prevLessonId}
						variant="outline"
						disabled={!prevLessonId}
						className="sm:w-auto"
					>
						{prevLessonId ? (
							<Link
								to="/courses/$moduleSlug/lesson/$lessonId"
								params={{ moduleSlug: module.slug, lessonId: prevLessonId }}
							>
								<ArrowLeft className="mr-2 h-4 w-4" /> Anterior
							</Link>
						) : (
							<span>
								<ArrowLeft className="mr-2 h-4 w-4" /> Anterior
							</span>
						)}
					</Button>

					<div className="flex-1 sm:max-w-md">
						{alreadyCompleted ? (
							<Button
								disabled={!nextLessonId}
								onClick={() => {
									if (isLastInModule) {
										navigate({
											to: "/courses/$moduleSlug/complete",
											params: { moduleSlug: module.slug },
										});
									} else if (nextLessonId) {
										const inModule = module.lessons.find(
											(l) => l.id === nextLessonId,
										);
										if (inModule) {
											navigate({
												to: "/courses/$moduleSlug/lesson/$lessonId",
												params: {
													moduleSlug: module.slug,
													lessonId: nextLessonId,
												},
											});
										} else {
											navigate({ to: "/courses" });
										}
									}
								}}
								className="w-full"
							>
								Siguiente <ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						) : (
							<Button
								onClick={handleComplete}
								disabled={!canComplete || completeMutation.isPending}
								className="w-full"
							>
								{completeMutation.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : totalQuizzes > 0 && !allQuizzesPassed ? (
									`Quizzes: ${correctQuizSet.size}/${totalQuizzes} — responde los que faltan`
								) : (
									<>
										<Check className="mr-2 h-4 w-4" />
										{totalQuizzes === 0
											? "Marcar como leída"
											: "Completar lección"}
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}

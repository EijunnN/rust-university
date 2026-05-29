export type CalloutVariant = 'info' | 'warning' | 'tip'

export type CodeLanguage =
  | 'rust'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'c'
  | 'cpp'
  | 'java'
  | 'bash'
  | 'toml'
  | 'json'
  | 'text'

export type TextBlock = {
  type: 'text'
  body: string
}

export type CodeBlock = {
  type: 'code'
  language: CodeLanguage
  code: string
  runnable: boolean
}

export type CalloutBlock = {
  type: 'callout'
  variant: CalloutVariant
  body: string
}

export type FirstPrinciplesBlock = {
  type: 'first-principles'
  title: string
  problem: string
  mentalModel: string
  concreteExample: string
  remember: string
}

export type QuizOption = {
  text: string
  correct: boolean
}

export type QuizBlock = {
  type: 'quiz'
  question: string
  options: QuizOption[]
}

// Practical coding exercise. MVP flow: user reads prompt + starter, then
// reveals the solution. Future: run + auto-check via Rust Playground API.
export type ExerciseBlock = {
  type: 'exercise'
  title: string
  prompt: string                     // markdown — what to do and why
  starterCode: string                // initial Rust code (may be incomplete or with TODO)
  solution: string                   // canonical working solution
  language: CodeLanguage             // usually 'rust'
  hints?: string[]                   // markdown hints, revealed progressively
  explanation?: string               // markdown explanation after the solution
}

// Productive failure (Kapur): present a problem the learner can't solve YET,
// BEFORE the theory. They attempt it, struggle productively, and only then
// does the `reveal` explain the concept — which lands far deeper because the
// brain already searched for where to put it.
export type ChallengeBlock = {
  type: 'challenge'
  conceptId?: string
  title: string
  prompt: string // markdown — the problem, shown before any teaching
  starterCode: string // function stub (no `fn main`)
  tests: string // verification harness with asserts + success sentinel
  solution: string
  reveal: string // markdown — the teaching moment, unlocked after an attempt
}

// Faded scaffolding (worked → faded → solo). The support is withdrawn stage by
// stage: first a fully worked example, then one with holes to fill, then a
// blank you complete alone. Each codeable stage is auto-verified.
export type FadedStageKind = 'worked' | 'faded' | 'solo'

export type FadedStage = {
  kind: FadedStageKind
  instructions: string // markdown
  code: string // worked = full solution; faded = with holes; solo = signature only
}

export type FadedExerciseBlock = {
  type: 'faded-exercise'
  conceptId: string
  title: string
  intro?: string // markdown
  stages: FadedStage[]
  tests: string // harness for the faded/solo stages
  solution: string
}

export type Block =
  | TextBlock
  | CodeBlock
  | CalloutBlock
  | FirstPrinciplesBlock
  | QuizBlock
  | ExerciseBlock
  | ChallengeBlock
  | FadedExerciseBlock

export type Lesson = {
  id: string
  moduleId: string
  moduleSlug: string
  order: number
  title: string
  blocks: Block[]
}

export type LessonRef = {
  id: string
  order: number
  title: string
}

export type Module = {
  id: string
  slug: string
  order: number
  version: number
  icon: string
  title: string
  description: string
  lessons: Lesson[]
}

export type ModuleMeta = {
  id: string
  slug: string
  order: number
  version: number
  icon: string
  title: string
  description: string
  lessonCount: number
  estimatedMinutes: number
  lessons: LessonRef[]
}

export type CourseData = {
  modules: Module[]
  lessons: Lesson[]
}

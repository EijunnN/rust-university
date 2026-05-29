import type { ModuleMeta } from './types'

// Note: m06-m12 exist as files but are NOT in the active catalog yet.
// They were drafts; will be re-written in depth before being added back.
// To re-enable, append them to this array and to `moduleLoaders` in index.ts.
export const moduleMeta: ModuleMeta[] = [
  {
    id: 'm01',
    slug: 'm01_introduction',
    order: 1,
    version: 1,
    icon: '🚀',
    title: 'Introducción a Rust',
    description:
      'Descubre qué es Rust, por qué es especial y prepara tu entorno de desarrollo.',
    lessonCount: 3,
    estimatedMinutes: 25,
    lessons: [
      { id: 'm01_l01', order: 1, title: '¿Qué es Rust?' },
      { id: 'm01_l02', order: 2, title: 'Instalación y configuración' },
      { id: 'm01_l03', order: 3, title: '¡Hola, Mundo!' },
    ],
  },
  {
    id: 'm02',
    slug: 'm02_fundamentals',
    order: 2,
    version: 1,
    icon: '📦',
    title: 'Fundamentos de Rust',
    description:
      'Aprende las bases: variables, tipos de datos, funciones y flujo de control.',
    lessonCount: 4,
    estimatedMinutes: 45,
    lessons: [
      { id: 'm02_l01', order: 1, title: 'Variables y Mutabilidad' },
      { id: 'm02_l02', order: 2, title: 'Tipos de Datos' },
      { id: 'm02_l03', order: 3, title: 'Funciones' },
      { id: 'm02_l04', order: 4, title: 'Flujo de Control' },
    ],
  },
  {
    id: 'm03',
    slug: 'm03_ownership',
    order: 3,
    version: 1,
    icon: '🔑',
    title: 'Ownership y Borrowing',
    description:
      'El corazón de Rust: comprende el sistema de ownership, referencias, borrowing y slices que hacen a Rust único.',
    lessonCount: 6,
    estimatedMinutes: 75,
    lessons: [
      { id: 'm03_l01', order: 1, title: 'Ownership: qué es y por qué importa' },
      { id: 'm03_l02', order: 2, title: 'Move: cómo se transfiere el ownership' },
      { id: 'm03_l03', order: 3, title: 'Copy, Clone y ownership en funciones' },
      { id: 'm03_l04', order: 4, title: 'Referencias y Borrowing' },
      { id: 'm03_l05', order: 5, title: 'Slices' },
      { id: 'm03_l06', order: 6, title: 'Introducción a Lifetimes' },
    ],
  },
  {
    id: 'm04',
    slug: 'm04_structs_enums',
    order: 4,
    version: 1,
    icon: '🧱',
    title: 'Structs, Enums y Pattern Matching',
    description:
      'Crea tipos de datos personalizados con structs y enums. Domina el pattern matching y descubre Option y Result.',
    lessonCount: 4,
    estimatedMinutes: 60,
    lessons: [
      { id: 'm04_l01', order: 1, title: 'Structs: tus propios tipos' },
      { id: 'm04_l02', order: 2, title: 'Métodos e Implementaciones' },
      { id: 'm04_l03', order: 3, title: 'Enums y Pattern Matching' },
      { id: 'm04_l04', order: 4, title: 'Option y Result' },
    ],
  },
  {
    id: 'm05',
    slug: 'm05_collections_errors',
    order: 5,
    version: 1,
    icon: '📚',
    title: 'Colecciones y Strings',
    description:
      'Domina Vec, String y HashMap: las colecciones fundamentales de Rust. Aprende closures e iteradores.',
    lessonCount: 5,
    estimatedMinutes: 70,
    lessons: [
      { id: 'm05_l01', order: 1, title: 'Vectores (Vec)' },
      { id: 'm05_l02', order: 2, title: 'Strings a fondo' },
      { id: 'm05_l03', order: 3, title: 'HashMaps' },
      { id: 'm05_l04', order: 4, title: 'Closures: funciones anónimas' },
      { id: 'm05_l05', order: 5, title: 'Iteradores' },
    ],
  },
]

export function getModuleMetaBySlug(slug: string): ModuleMeta | undefined {
  return moduleMeta.find((m) => m.slug === slug)
}

export function getModuleMetaById(id: string): ModuleMeta | undefined {
  return moduleMeta.find((m) => m.id === id)
}

export function getTotalLessonCount(): number {
  return moduleMeta.reduce((acc, m) => acc + m.lessonCount, 0)
}

export function getAllLessonIdsInOrder(): string[] {
  return moduleMeta.flatMap((m) => m.lessons.map((l) => l.id))
}

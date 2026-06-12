import type { ModuleMeta } from './types'

// ─── Roadmap del curso (de 0 a profesional) ──────────────────────────────────
// Activos: m01-m07. Los archivos m06-under-the-hood y m08-m12 (drafts viejos)
// son borradores archivados (NO están en el catálogo) y se reescribirán en
// profundidad antes de activarse. Plan de contenido pendiente, en orden:
//   m08  Módulos, Cargo y PROYECTO INTEGRADOR CLI (estilo minigrep: aplica
//        m03-m07 en un programa real de 200+ líneas)
//   m09  Smart pointers (Box, Rc, RefCell) + patrones de ownership avanzado
//   m10  Concurrencia (threads, Arc, Mutex, channels)
//   m11  Async/await + tokio (el grueso del Rust laboral: backend/infra)
//   m12  Ecosistema y siguientes pasos (crates clave, cómo leer código ajeno,
//        contribuir a open source)
// Para activar un módulo: entrada aquí + loader en `moduleLoaders` (index.ts).
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
    version: 2,
    icon: '🧱',
    title: 'Structs, Enums y Pattern Matching',
    description:
      'Crea tipos de datos personalizados con structs y enums. Domina el pattern matching y descubre Option y Result.',
    lessonCount: 5,
    estimatedMinutes: 75,
    lessons: [
      { id: 'm04_l01', order: 1, title: 'Structs: tus propios tipos' },
      { id: 'm04_l02', order: 2, title: 'Métodos e Implementaciones' },
      { id: 'm04_l03', order: 3, title: 'Enums y Pattern Matching' },
      { id: 'm04_l04', order: 4, title: 'Option: la ausencia explícita' },
      { id: 'm04_l05', order: 5, title: 'Result y el operador ?' },
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
  {
    id: 'm06',
    slug: 'm06_traits_generics',
    order: 6,
    version: 1,
    icon: '🧬',
    title: 'Traits y Generics',
    description:
      'El vocabulario compartido de Rust: escribe código que funciona para muchos tipos y define capacidades que cualquier tipo puede implementar.',
    lessonCount: 5,
    estimatedMinutes: 95,
    lessons: [
      { id: 'm06_l01', order: 1, title: 'Generics: una función, muchos tipos' },
      { id: 'm06_l02', order: 2, title: 'Traits: definir comportamiento compartido' },
      { id: 'm06_l03', order: 3, title: 'Trait bounds: exigir capacidades' },
      { id: 'm06_l04', order: 4, title: 'Traits estándar y derive' },
      { id: 'm06_l05', order: 5, title: 'Polimorfismo: impl Trait y dyn Trait' },
    ],
  },
  {
    id: 'm07',
    slug: 'm07_errors_testing',
    order: 7,
    version: 1,
    icon: '🛡️',
    title: 'Errores profesionales y Testing',
    description:
      'Diseña errores que se manejan solos y escribe tests que te dejan dormir tranquilo: panic vs Result, tipos de error propios, el operador ? a fondo, y cargo test.',
    lessonCount: 5,
    estimatedMinutes: 100,
    lessons: [
      { id: 'm07_l01', order: 1, title: 'panic! o Result: la decisión que define tu API' },
      { id: 'm07_l02', order: 2, title: 'Tus propios tipos de error' },
      { id: 'm07_l03', order: 3, title: 'El operador ? a fondo' },
      { id: 'm07_l04', order: 4, title: 'Tests: tu red de seguridad' },
      { id: 'm07_l05', order: 5, title: 'Organización de tests y el ciclo TDD' },
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

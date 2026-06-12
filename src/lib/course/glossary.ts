// Glosario inline para el curso. Las menciones de estos términos en el
// contenido (texto markdown) se subrayan automáticamente; al hacer hover
// o tap, se muestra la definición corta. Ver `rehype-glossary.ts` para
// el matching y `glossary-host.tsx` para el render.
//
// Reglas:
//   - `id` debe ser kebab-case y único.
//   - `labels` lista TODAS las formas en que el término puede aparecer
//     (singular/plural, ES/EN, con/sin acento). El match es case-insensitive
//     y respeta límites de palabra. Cuanto más larga la etiqueta, mayor
//     prioridad — útil para evitar que "data" coma "data race".
//   - `short` es 1-3 frases. Mantenlo conciso: es un tooltip, no un artículo.
//     Habla como un humano que está al lado del estudiante.

export type GlossaryEntry = {
  id: string
  labels: string[]
  short: string
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'null-pointer',
    labels: ['null pointer', 'null pointers', 'puntero nulo', 'punteros nulos'],
    short:
      'Una variable que “apunta a nada”. Si tu programa intenta leerla, suele caerse. Rust no te deja crearlas: si una referencia existe, está garantizado que apunta a algo válido.',
  },
  {
    id: 'buffer-overflow',
    labels: [
      'buffer overflow',
      'buffer overflows',
      'desbordamiento de búfer',
      'desbordamiento de buffer',
    ],
    short:
      'Escribir más datos de los que caben en un espacio reservado de memoria. En C/C++ esto pisa memoria de otros datos y es la raíz de muchas vulnerabilidades. Rust verifica los límites por ti.',
  },
  {
    id: 'data-race',
    labels: ['data race', 'data races', 'condición de carrera', 'condiciones de carrera', 'carrera de datos'],
    short:
      'Cuando dos partes del programa leen y escriben el mismo dato a la vez y el resultado depende de cuál llegue primero. Produce bugs raros y difíciles de reproducir. Rust impide muchas de estas situaciones al compilar.',
  },
  {
    id: 'compilador',
    labels: ['compilador', 'compiler'],
    short:
      'Programa que traduce el código que tú escribes (texto) a instrucciones que entiende la máquina. El compilador de Rust se llama `rustc` y también revisa errores antes de generar el ejecutable.',
  },
  {
    id: 'compilacion',
    labels: ['compilación', 'compilacion', 'tiempo de compilación', 'tiempo de compilacion'],
    short:
      'El momento en que el compilador procesa tu código y lo convierte en un ejecutable. “En tiempo de compilación” significa que el error o chequeo ocurre *antes* de correr el programa, no mientras lo ejecutas.',
  },
  {
    id: 'garbage-collector',
    labels: [
      'garbage collector',
      'garbage collection',
      'recolector de basura',
      'gc',
    ],
    short:
      'Componente que vive dentro del programa y, cada cierto tiempo, busca memoria que ya nadie usa para liberarla. Java, Python o Go lo tienen. Rust no: libera memoria automáticamente al compilar, sin pausas en tiempo de ejecución.',
  },
  {
    id: 'concurrencia',
    labels: [
      'concurrencia',
      'concurrente',
      'concurrentes',
      'programación concurrente',
      'programacion concurrente',
    ],
    short:
      'Cuando un programa hace varias cosas “al mismo tiempo” (por ejemplo, responder a muchos usuarios a la vez). Es poderoso pero peligroso si dos tareas tocan el mismo dato. Rust hace esto más seguro a nivel de tipos.',
  },
  {
    id: 'codigo-maquina',
    labels: ['código máquina', 'codigo maquina', 'código de máquina', 'machine code'],
    short:
      'Las instrucciones reales que ejecuta el procesador (CPU): unos y ceros. Tu Rust se traduce a esto cuando compilas. Por eso los programas son rápidos: no hay traducción intermedia mientras corren.',
  },
  {
    id: 'runtime',
    labels: ['runtime', 'tiempo de ejecución', 'tiempo de ejecucion'],
    short:
      'El “runtime” (tiempo de ejecución) es lo que ocurre mientras tu programa está corriendo. También se llama así al código extra que algunos lenguajes incluyen para administrar el programa (Java, Go). Rust tiene un runtime mínimo.',
  },
  {
    id: 'macro',
    labels: ['macro', 'macros'],
    short:
      'En Rust, una macro es código que escribe código por ti en tiempo de compilación. Se reconoce por el `!` al final del nombre, como `println!`. No es una función: tiene reglas más flexibles para sus argumentos.',
  },
  {
    id: 'cargo',
    labels: ['cargo'],
    short:
      'La herramienta oficial que organiza tus proyectos de Rust: descarga librerías, compila, corre tests y publica. Es el equivalente a `npm` en JavaScript o `pip` en Python, pero también arma el binario final.',
  },
  {
    id: 'crate',
    labels: ['crate', 'crates'],
    short:
      'Una unidad de código Rust que se compila junta. Tu proyecto es un crate; cada librería que instalas con Cargo también lo es. En otros lenguajes les dirías “paquete” o “módulo top-level”.',
  },
  {
    id: 'rustc',
    labels: ['rustc'],
    short:
      'El compilador oficial de Rust. Convierte tu código en un ejecutable. Normalmente no lo llamas directo; lo invoca Cargo por ti.',
  },
  {
    id: 'rustup',
    labels: ['rustup'],
    short:
      'El instalador y gestor de versiones de Rust. Con él puedes tener varias versiones del compilador instaladas y cambiar entre ellas.',
  },
  {
    id: 'stack',
    labels: ['stack', 'pila'],
    short:
      'Zona de memoria muy rápida donde viven las variables locales de una función. Crece y se libera automáticamente al entrar/salir de funciones. Tamaño conocido en compilación.',
  },
  {
    id: 'heap',
    labels: ['heap', 'montón', 'monton'],
    short:
      'Zona de memoria para datos cuyo tamaño no se conoce hasta ejecutar (por ejemplo, un texto que pidió el usuario). Es más flexible que el stack, pero también más lento de gestionar.',
  },
  {
    id: 'ownership',
    labels: ['ownership', 'posesión', 'propiedad de datos'],
    short:
      'La idea central de Rust: cada dato tiene un único “dueño”, y cuando ese dueño sale de scope, el dato se libera. Es lo que permite a Rust no necesitar garbage collector.',
  },
  {
    id: 'borrow',
    labels: ['borrow', 'borrowing', 'préstamo', 'prestamo'],
    short:
      'Tomar prestada una referencia a un dato sin volverte su dueño. Puedes tener muchas referencias para leer, o una sola para modificar. Esto evita data races al compilar.',
  },
  {
    id: 'borrow-checker',
    labels: ['borrow checker', 'verificador de préstamos', 'verificador de prestamos'],
    short:
      'La parte del compilador que revisa quién toma prestados los datos, cuándo y cómo. Si las reglas no se cumplen, no te deja compilar. Es la “magia” detrás de la seguridad de memoria.',
  },
  {
    id: 'lifetime',
    labels: ['lifetime', 'lifetimes', 'tiempo de vida'],
    short:
      'Cuánto tiempo es válido un dato o una referencia. Rust usa anotaciones de lifetime para asegurar que ninguna referencia sobreviva al dato al que apunta (referencias colgantes).',
  },
  {
    id: 'trait',
    labels: ['trait', 'traits'],
    short:
      'Un conjunto de funciones que un tipo se compromete a implementar. Parecido a una interface en otros lenguajes: define qué puede hacer un tipo, no cómo lo guarda.',
  },
  {
    id: 'panic',
    labels: ['panic', 'panics', 'panicked'],
    short:
      'Cuando un programa Rust encuentra un error grave del que no puede recuperarse, “entra en pánico”: imprime un mensaje y aborta. Se evita devolviendo `Result` o `Option` cuando el error es esperable.',
  },
  {
    id: 'string-literal',
    labels: ['string literal', 'string literals', 'literal de cadena', 'literal de string'],
    short:
      'Un texto fijo escrito directamente en tu código, entre comillas dobles: `"Hola"`. En Rust su tipo es `&str`, vive incrustado en el ejecutable y no se puede modificar.',
  },
  {
    id: 'lenguaje-de-sistemas',
    labels: ['lenguaje de sistemas', 'systems language', 'systems programming'],
    short:
      'Un lenguaje pensado para escribir las piezas más cercanas al hardware: sistemas operativos, drivers, motores de bases de datos, navegadores. Necesita ser rápido y predecible. C, C++ y Rust son ejemplos.',
  },
  {
    id: 'rendimiento',
    labels: ['rendimiento', 'performance'],
    short:
      'Qué tan rápido (y con cuánta memoria) corre un programa. En Rust, el rendimiento es comparable a C/C++ porque no hay capas intermedias en ejecución.',
  },
  {
    id: 'seguridad-de-memoria',
    labels: ['seguridad de memoria', 'memory safety'],
    short:
      'Garantía de que el programa no leerá ni escribirá memoria que no le corresponde. Los lenguajes con seguridad de memoria evitan crashes y vulnerabilidades comunes (null pointers, buffer overflows).',
  },
  {
    id: 'move',
    labels: ['move', 'moves', 'movido', 'se mueve', 'mover el ownership'],
    short:
      'Transferir el ownership de un valor a otra variable o función. Después del move, la variable original deja de ser válida — así Rust garantiza que cada dato tenga un solo dueño y se libere una sola vez.',
  },
  {
    id: 'copy',
    labels: ['trait copy', 'tipos copy', 'es copy'],
    short:
      'Habilidad de un tipo de duplicarse automáticamente al asignarlo o pasarlo a una función, en vez de moverse. La tienen los tipos pequeños del stack: números, `bool`, `char`. `String` y `Vec` NO la tienen.',
  },
  {
    id: 'clone',
    labels: ['clone()', '.clone()', 'clonar'],
    short:
      'Copia explícita y profunda de un dato. Para tipos con memoria en el heap (como `String`), `.clone()` reserva memoria nueva y duplica el contenido. Rust te obliga a escribirlo para que el costo sea visible.',
  },
  {
    id: 'referencia',
    labels: ['referencia', 'referencias', 'reference', 'references'],
    short:
      'Un “préstamo” de un dato: te deja leerlo (`&T`) o modificarlo (`&mut T`) sin volverte su dueño. Se crea con `&`. El compilador garantiza que ninguna referencia apunte a un dato ya liberado.',
  },
  {
    id: 'slice',
    labels: ['slice', 'slices', 'string slice'],
    short:
      'Una “ventana” a una porción contigua de datos existentes — no copia nada, solo guarda puntero y longitud. `&str` es un slice de texto; `&[i32]` es un slice de números. Depende de que el dato original siga vivo.',
  },
  {
    id: 'pattern-matching',
    labels: ['pattern matching', 'match exhaustivo'],
    short:
      'Comparar un valor contra “formas” posibles (patrones) y ejecutar código según cuál calce. En Rust se hace con `match`, que además es exhaustivo: el compilador te obliga a cubrir todos los casos.',
  },
  {
    id: 'scope',
    labels: ['scope', 'alcance', 'ámbito', 'ambito'],
    short:
      'La zona del código donde una variable existe y puede usarse — en Rust, delimitada por llaves `{}`. Al salir del scope, la variable “muere” y Rust libera sus recursos automáticamente (llama a `drop`).',
  },
  {
    id: 'shadowing',
    labels: ['shadowing', 'shadowear'],
    short:
      'Declarar una variable nueva con el mismo nombre que una anterior usando `let`. La nueva “tapa” a la vieja. Útil para transformar un valor en pasos sin inventar nombres (`let edad = edad.trim().parse()`).',
  },
  {
    id: 'mutabilidad',
    labels: ['mutabilidad', 'inmutable por defecto', 'mutable', 'mut'],
    short:
      'En Rust las variables son inmutables (no cambian) salvo que las declares con `mut`. Hacer la mutación explícita y visible es parte del diseño: lees `mut` y sabes que ese valor va a cambiar.',
  },
  {
    id: 'option',
    labels: ['option<t>', 'tipo option'],
    short:
      'El tipo de Rust para “puede haber un valor o no”: `Some(valor)` o `None`. Reemplaza al `null` de otros lenguajes, con una diferencia clave: el compilador te obliga a manejar el caso `None`.',
  },
  {
    id: 'result',
    labels: ['result<t, e>', 'tipo result'],
    short:
      'El tipo de Rust para operaciones que pueden fallar: `Ok(valor)` o `Err(error)`. Los errores esperables se devuelven como datos (no excepciones invisibles), y el operador `?` los propaga con elegancia.',
  },
  {
    id: 'closure',
    labels: ['closure', 'closures', 'función anónima', 'funcion anonima'],
    short:
      'Una función sin nombre que puedes guardar en una variable y que “captura” variables de su entorno. Se escribe `|args| cuerpo`. Es el combustible de los iteradores: `.filter(|n| n > 0)`.',
  },
  {
    id: 'iterador',
    labels: ['iterador', 'iteradores', 'iterator', 'iterators'],
    short:
      'Un valor que produce elementos de a uno, bajo demanda (lazy). Se encadenan transformaciones (`.map`, `.filter`) que no ejecutan nada hasta llegar a un método terminal como `.collect()` o `.sum()`.',
  },
  {
    id: 'generics',
    labels: ['generics', 'genéricos', 'genericos', 'tipo genérico', 'tipo generico'],
    short:
      'Escribir código que funciona para varios tipos a la vez usando parámetros de tipo: `Vec<T>` funciona con cualquier `T`. Rust genera versiones especializadas al compilar, así que no cuesta rendimiento.',
  },
  {
    id: 'dangling-reference',
    labels: ['dangling reference', 'referencia colgante', 'referencias colgantes'],
    short:
      'Una referencia que apunta a memoria ya liberada — uno de los bugs más peligrosos en C/C++. En Rust no compilan: el borrow checker verifica que toda referencia viva menos que su dato.',
  },
]

const ENTRY_BY_ID = new Map(GLOSSARY.map((e) => [e.id, e]))

export function findGlossaryEntry(id: string): GlossaryEntry | undefined {
  return ENTRY_BY_ID.get(id)
}

import type { Module } from '../types'

const module: Module = {
  "id": "m06",
  "slug": "m06_traits_generics",
  "order": 6,
  "version": 1,
  "icon": "🧬",
  "title": "Traits y Generics",
  "description": "El vocabulario compartido de Rust: escribe código que funciona para muchos tipos y define capacidades que cualquier tipo puede implementar.",
  "lessons": [
    {
      "id": "m06_l01",
      "moduleId": "m06",
      "moduleSlug": "m06_traits_generics",
      "order": 1,
      "title": "Generics: una función, muchos tipos",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Generics: deja de copiar y pegar la misma lógica",
          "problem": "La lógica de \"devuelve el mayor de dos valores\" es idéntica para números, caracteres o fechas. Escribir una función por cada tipo duplica código, y todo código duplicado se desincroniza tarde o temprano.",
          "mentalModel": "Una función genérica es un molde con un hueco para el tipo. Tú escribes la lógica una vez con un nombre de relleno (`T`), y el compilador estampa una versión concreta del molde por cada tipo con el que la uses.",
          "concreteExample": "Ya usas generics desde el módulo 5 sin llamarlos así: `Vec<T>` es \"una lista de lo que sea T\", `Option<T>` es \"quizás un T\". Lo nuevo es que ahora TÚ vas a escribir los moldes.",
          "remember": "Generics no cuestan rendimiento: el compilador genera código especializado por tipo, como si lo hubieras escrito a mano."
        },
        {
          "type": "challenge",
          "conceptId": "m06-generic-fn",
          "title": "Antes de leer: siente la duplicación",
          "prompt": "**Tu reto:** escribe DOS funciones que devuelvan el mayor de dos valores:\n\n- `mayor_i32(a: i32, b: i32) -> i32`\n- `mayor_char(a: char, b: char) -> char` (los caracteres se comparan alfabéticamente con `>`)\n\nSí, es exactamente la misma lógica dos veces. Escríbelas igual — esa incomodidad que vas a sentir **es el punto de esta lección**.",
          "starterCode": "fn mayor_i32(a: i32, b: i32) -> i32 {\n    // tu código aquí\n}\n\nfn mayor_char(a: char, b: char) -> char {\n    // tu código aquí (sí, es la misma lógica…)\n}",
          "tests": "fn main() {\n    assert_eq!(mayor_i32(8, 3), 8);\n    assert_eq!(mayor_i32(-2, -7), -2);\n    assert_eq!(mayor_char('z', 'a'), 'z');\n    assert_eq!(mayor_char('a', 'a'), 'a');\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn mayor_i32(a: i32, b: i32) -> i32 {\n    if a >= b { a } else { b }\n}\n\nfn mayor_char(a: char, b: char) -> char {\n    if a >= b { a } else { b }\n}",
          "hints": [
            "Es el mismo patrón que viste en m03 con `mas_largo`: un `if/else` usado como expresión.",
            "`if a >= b { a } else { b }` — y el cuerpo de la segunda función es idéntico, solo cambian los tipos de la firma."
          ],
          "reveal": "Acabas de escribir **el mismo cuerpo dos veces**. Si mañana decides que en caso de empate gane el segundo, tienes que acordarte de cambiarlo en DOS lugares. Con 10 tipos, en 10 lugares.\n\nRust resuelve esto con **generics**: escribes la lógica una sola vez, con un \"hueco\" para el tipo:\n\n```rust\nfn mayor<T: PartialOrd>(a: T, b: T) -> T {\n    if a >= b { a } else { b }\n}\n```\n\n- `<T>` declara un **parámetro de tipo**: \"esta función funciona para un tipo T que decidirá quien la llame\".\n- `T: PartialOrd` es un **trait bound**: \"…siempre que T se pueda comparar con `>=`\".\n\nLa misma función sirve para `i32`, `char`, `f64`, `&str`… y el compilador genera una versión especializada para cada uno. Eso es lo que vas a ver ahora. 👇"
        },
        {
          "type": "text",
          "body": "## El problema: una función por cada tipo\n\nSin generics, cada tipo necesita su propia copia de la misma lógica:\n\n```rust\nfn mayor_i32(a: i32, b: i32) -> i32 { /* … */ }\nfn mayor_f64(a: f64, b: f64) -> f64 { /* … */ }\nfn mayor_char(a: char, b: char) -> char { /* … */ }\n```\n\nTres funciones, un solo algoritmo. Cada copia es una oportunidad de bug: arreglas una y olvidas las otras.\n\n## La solución: parámetros de tipo\n\nIgual que una función recibe **valores** como parámetros, puede recibir **tipos** como parámetros. Se declaran entre `<>` después del nombre:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "// T es un parámetro de tipo: un nombre de relleno que se decide al llamar.\n// `T: PartialOrd` exige que el tipo se pueda comparar (>, <, >=, <=).\nfn mayor<T: PartialOrd>(a: T, b: T) -> T {\n    if a >= b { a } else { b }\n}\n\nfn main() {\n    println!(\"{}\", mayor(8, 3));          // T = i32\n    println!(\"{}\", mayor(2.7, 3.1));      // T = f64\n    println!(\"{}\", mayor('a', 'z'));      // T = char\n    println!(\"{}\", mayor(\"ana\", \"luis\")); // T = &str (orden alfabético)\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "Una sola función, cuatro tipos distintos. Fíjate que ni siquiera anotamos el tipo al llamar: Rust lo **infiere** de los argumentos, igual que infiere el tipo de `let x = 5`.\n\n## ¿Por qué el `: PartialOrd`?\n\nIntenta quitar el bound y el compilador te frena en seco:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "// Esto NO compila: T podría ser CUALQUIER tipo…\n// ¿y si alguien llama mayor(archivo_a, archivo_b)? ¿Qué significa > ahí?\nfn mayor<T>(a: T, b: T) -> T {\n    if a >= b { a } else { b }\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\n```\nerror[E0369]: binary operation `>=` cannot be applied to type `T`\n --> src/main.rs:2:10\n  |\n2 |     if a >= b { a } else { b }\n  |        - ^^ - T\n  |\nhelp: consider restricting type parameter `T`\n  |\n1 | fn mayor<T: std::cmp::PartialOrd>(a: T, b: T) -> T {\n  |           ++++++++++++++++++++++\n```\nSin el bound, `T` es una caja negra: Rust no sabe si se puede comparar. El bound `T: PartialOrd` es una **promesa verificada**: \"solo acepto tipos comparables\". Fíjate que el compilador incluso te sugiere el arreglo exacto."
        },
        {
          "type": "text",
          "body": "Esta es una diferencia clave con lenguajes dinámicos: en Python escribirías `def mayor(a, b)` y el error de \"esto no se puede comparar\" explotaría **en producción**, cuando alguien pase algo raro. En Rust, la función declara qué necesita de sus tipos, y el compilador lo verifica **antes de ejecutar nada**.\n\n## Monomorphization: por qué no cuesta nada\n\n¿Qué hace el compilador con `mayor<T>`? Por cada tipo con el que la llamas, **genera una versión especializada**, como si tú hubieras escrito `mayor_i32`, `mayor_f64` y `mayor_char` a mano. Este proceso se llama **monomorphization** (\"hacer monomorfo\": de muchas formas a una forma concreta).\n\nLa consecuencia importante: el código genérico corre **exactamente igual de rápido** que el duplicado a mano. No hay chequeos en ejecución, no hay indirección, no hay costo oculto. Es el mismo principio de ownership: el trabajo pesado lo hace el compilador, no tu programa."
        },
        {
          "type": "text",
          "body": "## Generics en structs y enums\n\nLos tipos también pueden tener huecos de tipo. De hecho, llevas dos módulos usándolos:\n\n- `Vec<T>` — una lista de T. `Vec<i32>`, `Vec<String>`, `Vec<Vec<f64>>`…\n- `Option<T>` — quizás un T: `Some(T)` o `None`.\n- `Result<T, E>` — **dos** parámetros: éxito con T o error con E.\n- `HashMap<K, V>` — claves K, valores V.\n\nDefinir el tuyo usa la misma sintaxis:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "// Un par de valores del MISMO tipo T.\nstruct Par<T> {\n    primero: T,\n    segundo: T,\n}\n\n// Un punto donde x e y pueden ser tipos DISTINTOS.\nstruct Punto<X, Y> {\n    x: X,\n    y: Y,\n}\n\nfn main() {\n    let enteros = Par { primero: 1, segundo: 2 };\n    let textos = Par { primero: \"a\", segundo: \"b\" };\n\n    let mixto = Punto { x: 5, y: 1.5 };  // X = i32, Y = f64\n\n    println!(\"{} {} | {} {} | ({}, {})\",\n        enteros.primero, enteros.segundo,\n        textos.primero, textos.segundo,\n        mixto.x, mixto.y);\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "¿Qué hace el compilador cuando llamas a `mayor<T>` con un `i32` y luego con un `char`?",
          "options": [
            {
              "text": "Genera dos versiones especializadas de la función, una por tipo (monomorphization)",
              "correct": true
            },
            {
              "text": "Usa una sola versión que decide el tipo en tiempo de ejecución",
              "correct": false
            },
            {
              "text": "Convierte ambos valores a un tipo universal",
              "correct": false
            },
            {
              "text": "Guarda los valores en el heap para tratarlos igual",
              "correct": false
            }
          ],
          "explanation": "Monomorphization: el compilador estampa una copia concreta del \"molde\" por cada tipo usado, como si las hubieras escrito a mano. Por eso los generics de Rust tienen **costo cero en ejecución** — todo se decide al compilar, nada en runtime."
        },
        {
          "type": "quiz",
          "question": "¿Para qué sirve escribir `T: PartialOrd` en `fn mayor<T: PartialOrd>(…)`?",
          "options": [
            {
              "text": "Promete al compilador que T se podrá comparar con >, <, >= — sin esa garantía, `a >= b` no compila",
              "correct": true
            },
            {
              "text": "Hace que la función sea más rápida al comparar",
              "correct": false
            },
            {
              "text": "Convierte T en un número automáticamente",
              "correct": false
            },
            {
              "text": "Es opcional: solo documenta la intención",
              "correct": false
            }
          ],
          "explanation": "Un bound es un **requisito de capacidad**: \"acepto cualquier T que sepa compararse\". Sin él, T es una caja negra y el compilador rechaza `a >= b` (error E0369), porque no todo tipo tiene un orden definido. No es documentación: es un contrato verificado."
        },
        {
          "type": "exercise",
          "title": "El mínimo de cualquier lista comparable",
          "language": "rust",
          "prompt": "Escribe `minimo<T>` que reciba un slice `&[T]` y devuelva `Option<T>` con el menor elemento (o `None` si el slice está vacío — fíjate que `Option` ya te obliga a modelar ese caso, como aprendiste en m04).\n\nNecesitarás DOS bounds:\n- `PartialOrd` para poder comparar con `<`.\n- `Copy` para poder sacar el valor del slice sin pelearte con el ownership (los elementos se copian, como los números de m03).\n\nLos bounds se combinan con `+`: `<T: PartialOrd + Copy>`.",
          "starterCode": "fn minimo<T: PartialOrd + Copy>(items: &[T]) -> Option<T> {\n    // 1. si está vacío → None\n    // 2. arranca con el primero y recorre comparando\n    todo!()\n}\n\nfn main() {\n    assert_eq!(minimo(&[3, 1, 4]), Some(1));\n    assert_eq!(minimo(&[2.5, 0.5, 9.0]), Some(0.5));\n    assert_eq!(minimo(&['x', 'a', 'm']), Some('a'));\n    assert_eq!(minimo::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
          "solution": "fn minimo<T: PartialOrd + Copy>(items: &[T]) -> Option<T> {\n    if items.is_empty() {\n        return None;\n    }\n    let mut min = items[0];\n    for &item in &items[1..] {\n        if item < min {\n            min = item;\n        }\n    }\n    Some(min)\n}\n\nfn main() {\n    assert_eq!(minimo(&[3, 1, 4]), Some(1));\n    assert_eq!(minimo(&[2.5, 0.5, 9.0]), Some(0.5));\n    assert_eq!(minimo(&['x', 'a', 'm']), Some('a'));\n    assert_eq!(minimo::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "Maneja primero el caso vacío: `if items.is_empty() { return None; }`. Después de eso, `items[0]` es seguro.",
            "Como T es `Copy`, `let mut min = items[0];` copia el valor (no lo mueve). Recorre el resto con `for &item in &items[1..]`.",
            "El patrón `&item` en el `for` des-referencia automáticamente: `item` es un `T`, no un `&T`. Compara con `if item < min` y actualiza."
          ],
          "explanation": "**Lo que practicaste:** combinar bounds con `+`. Cada bound desbloquea operaciones concretas: `PartialOrd` te dio `<`; `Copy` te dejó sacar valores del slice sin clonar ni pelear con referencias.\n\n**Dato del mundo real:** la librería estándar ya tiene esto: `items.iter().min()` (requiere `Ord`). Lo escribiste a mano para entender qué hay debajo — en código real usarías el iterador, como aprendiste en m05.\n\n**Pregunta para masticar:** ¿por qué `minimo::<i32>(&[])` necesita el `::<i32>` (el \"turbofish\")? Porque con un slice vacío Rust no tiene NINGÚN valor del que inferir T — se lo tienes que decir tú. Con `&[3, 1, 4]` nunca hizo falta."
        }
      ]
    },
    {
      "id": "m06_l02",
      "moduleId": "m06",
      "moduleSlug": "m06_traits_generics",
      "order": 2,
      "title": "Traits: definir comportamiento compartido",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Un trait responde: ¿qué sabe HACER este tipo?",
          "problem": "Los structs y enums definen qué datos TIENE un tipo. Pero muchas funciones no necesitan saber qué datos tiene algo — solo qué sabe hacer: \"¿se puede imprimir?\", \"¿se puede comparar?\", \"¿sabe calcular su área?\".",
          "mentalModel": "Un trait es un contrato de capacidades, como un carnet: \"quien tenga el carnet de conducir sabe conducir\". No importa si eres alto o bajo (tus datos); importa que aprobaste el examen (implementaste los métodos).",
          "concreteExample": "`PartialOrd`, que usaste en la lección anterior, es un trait: el contrato \"sé compararme\". Los `i32` lo firman, los `char` lo firman… y por eso `mayor<T: PartialOrd>` los acepta a todos.",
          "remember": "Struct/enum = qué datos tengo. Trait = qué sé hacer. Las funciones genéricas piden capacidades, no tipos concretos."
        },
        {
          "type": "challenge",
          "conceptId": "m06-trait-impl",
          "title": "Antes de leer: dos tipos, un mismo contrato",
          "prompt": "**Tu reto:** te damos un trait `Saluda` (el contrato) y dos structs muy distintos. Completa las dos implementaciones para que cada tipo cumpla el contrato a su manera:\n\n- `Robot` debe saludar con `\"BEEP BOOP unidad {id}\"`\n- `Humano` debe saludar con `\"Hola, soy {nombre}\"`\n\nLa sintaxis `impl Saluda for Robot` ya está puesta — tú escribe los cuerpos de los métodos. `format!` (de m05) es tu amigo.",
          "starterCode": "trait Saluda {\n    fn saludar(&self) -> String;\n}\n\nstruct Robot {\n    id: u32,\n}\n\nstruct Humano {\n    nombre: String,\n}\n\nimpl Saluda for Robot {\n    // fn saludar → \"BEEP BOOP unidad {id}\"\n    \n}\n\nimpl Saluda for Humano {\n    // fn saludar → \"Hola, soy {nombre}\"\n    \n}",
          "tests": "fn main() {\n    let r = Robot { id: 7 };\n    let h = Humano { nombre: String::from(\"Ana\") };\n    assert_eq!(r.saludar(), \"BEEP BOOP unidad 7\");\n    assert_eq!(h.saludar(), \"Hola, soy Ana\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "trait Saluda {\n    fn saludar(&self) -> String;\n}\n\nstruct Robot {\n    id: u32,\n}\n\nstruct Humano {\n    nombre: String,\n}\n\nimpl Saluda for Robot {\n    fn saludar(&self) -> String {\n        format!(\"BEEP BOOP unidad {}\", self.id)\n    }\n}\n\nimpl Saluda for Humano {\n    fn saludar(&self) -> String {\n        format!(\"Hola, soy {}\", self.nombre)\n    }\n}",
          "hints": [
            "Dentro de cada `impl`, copia la firma del trait (`fn saludar(&self) -> String`) y escribe el cuerpo. La firma debe coincidir EXACTAMENTE con la del trait.",
            "Accede a los campos con `self.id` y `self.nombre`, como en los métodos de m04.",
            "`format!(\"BEEP BOOP unidad {}\", self.id)` construye el `String`. Recuerda: sin `;` al final para devolverlo."
          ],
          "reveal": "Acabas de implementar tu primer trait. Mira lo que pasó:\n\n```rust\ntrait Saluda {\n    fn saludar(&self) -> String;  // el contrato: firma SIN cuerpo\n}\n\nimpl Saluda for Robot { /* SU manera de cumplirlo */ }\nimpl Saluda for Humano { /* OTRA manera de cumplirlo */ }\n```\n\nDos tipos con datos completamente distintos (`u32` vs `String`) ahora comparten una **capacidad común**. Cualquier función puede pedir \"algo que salude\" sin importarle si es robot o humano:\n\n```rust\nfn presentar<T: Saluda>(quien: &T) {\n    println!(\"{}\", quien.saludar());\n}\n```\n\n¿Reconoces el patrón? Es el mismo `T: PartialOrd` de la lección pasada — solo que ahora el trait lo definiste TÚ. 👇"
        },
        {
          "type": "text",
          "body": "## Anatomía de un trait\n\nUn **trait** define un conjunto de métodos que un tipo se compromete a tener. Es parecido a una *interface* de Java/TypeScript o a un *protocol* de Swift, con una diferencia importante: puedes implementar traits **para tipos que no escribiste tú** (por ejemplo, darle tu trait a `i32`).\n\n```rust\ntrait Saluda {\n    fn saludar(&self) -> String;   // solo la firma: cada tipo pone el cuerpo\n}\n```\n\nLa implementación une un trait con un tipo: `impl TRAIT for TIPO`. Dentro van los cuerpos de los métodos exigidos.\n\n## Métodos por defecto: el contrato con regalo incluido\n\nUn trait puede traer métodos **ya implementados**. Los tipos los heredan gratis, y pueden sobreescribirlos si quieren algo distinto:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "trait Notificador {\n    // Obligatorio: cada tipo dice cuál es su mensaje.\n    fn mensaje(&self) -> String;\n\n    // Por defecto: definido en términos del anterior. Gratis para todos.\n    fn notificar(&self) -> String {\n        format!(\"[AVISO] {}\", self.mensaje())\n    }\n}\n\nstruct Email {\n    asunto: String,\n}\n\nstruct Sms;\n\nimpl Notificador for Email {\n    fn mensaje(&self) -> String {\n        format!(\"Email: {}\", self.asunto)\n    }\n    // notificar() no se escribe: Email usa el default\n}\n\nimpl Notificador for Sms {\n    fn mensaje(&self) -> String {\n        String::from(\"SMS recibido\")\n    }\n\n    // Sms SÍ personaliza la notificación:\n    fn notificar(&self) -> String {\n        format!(\"[URGENTE] {}\", self.mensaje())\n    }\n}\n\nfn main() {\n    let e = Email { asunto: String::from(\"Bienvenido\") };\n    let s = Sms;\n    println!(\"{}\", e.notificar());  // usa el default\n    println!(\"{}\", s.notificar());  // usa el personalizado\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "**Patrón profesional:** define lo mínimo obligatorio y regala lo demás como defaults. El trait `Iterator` de la librería estándar exige UN solo método (`next`)… y te regala más de 70 métodos default (`map`, `filter`, `sum`…). Por eso implementar `Iterator` para tu tipo desbloquea todo el arsenal de m05 de golpe."
        },
        {
          "type": "text",
          "body": "## Usar el trait en funciones genéricas\n\nAquí se conecta todo: un trait que defines + un bound en una función genérica = código que funciona para **cualquier tipo que cumpla tu contrato**, presente o futuro:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "trait Saluda {\n    fn saludar(&self) -> String;\n}\n\nstruct Robot { id: u32 }\nstruct Humano { nombre: String }\n\nimpl Saluda for Robot {\n    fn saludar(&self) -> String {\n        format!(\"BEEP BOOP unidad {}\", self.id)\n    }\n}\n\nimpl Saluda for Humano {\n    fn saludar(&self) -> String {\n        format!(\"Hola, soy {}\", self.nombre)\n    }\n}\n\n// Esta función no sabe NADA de robots ni humanos.\n// Solo pide: \"dame algo que sepa saludar\".\nfn dar_bienvenida<T: Saluda>(quien: &T) {\n    println!(\"🎉 {}\", quien.saludar());\n}\n\nfn main() {\n    let r = Robot { id: 7 };\n    let h = Humano { nombre: String::from(\"Ana\") };\n\n    dar_bienvenida(&r);\n    dar_bienvenida(&h);\n\n    // Mañana creas `struct Alien` con `impl Saluda for Alien`\n    // y dar_bienvenida lo acepta SIN CAMBIAR una línea.\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la diferencia fundamental entre un struct y un trait?",
          "options": [
            {
              "text": "El struct define qué datos tiene un tipo; el trait define qué comportamiento puede compartir con otros tipos",
              "correct": true
            },
            {
              "text": "El trait es la versión moderna del struct",
              "correct": false
            },
            {
              "text": "Los structs son para datos grandes y los traits para datos pequeños",
              "correct": false
            },
            {
              "text": "No hay diferencia: ambos agrupan funciones",
              "correct": false
            }
          ],
          "explanation": "Son ejes distintos: el struct/enum modela los **datos** (`Robot` tiene un `id`); el trait modela una **capacidad** (`Saluda` = \"sé presentarme\"). Tipos con datos totalmente diferentes pueden compartir el mismo trait — y eso es lo que permite que una función acepte a todos."
        },
        {
          "type": "quiz",
          "question": "Si un trait tiene un método con implementación por defecto, ¿qué pasa con los tipos que lo implementan?",
          "options": [
            {
              "text": "Lo reciben gratis, y pueden sobreescribirlo si necesitan un comportamiento propio",
              "correct": true
            },
            {
              "text": "Están obligados a reescribirlo siempre",
              "correct": false
            },
            {
              "text": "No pueden modificarlo nunca",
              "correct": false
            },
            {
              "text": "Solo funciona si el tipo es un struct",
              "correct": false
            }
          ],
          "explanation": "Los defaults son el \"regalo\" del contrato: implementas lo mínimo obligatorio (`mensaje`) y heredas el resto (`notificar`). Si un tipo necesita algo especial — como el `[URGENTE]` del SMS — lo sobreescribe y listo. Así `Iterator` te regala `map` y `filter` implementando solo `next`."
        },
        {
          "type": "exercise",
          "title": "Figuras que conocen su área",
          "language": "rust",
          "prompt": "Modela un mini-sistema de figuras geométricas:\n\n1. Define las implementaciones de `area()` para `Rectangulo` (ancho × alto) y `Circulo` (π × radio²; usa `std::f64::consts::PI`).\n2. El trait ya trae `describir()` por defecto — NO lo reimplementes: compruébalo gratis.\n\nEl `main` con los asserts ya está escrito: tu trabajo son solo los dos `impl`.",
          "starterCode": "trait Figura {\n    fn area(&self) -> f64;\n\n    // Método default: lo heredan ambas figuras.\n    fn describir(&self) -> String {\n        format!(\"figura con área {:.2}\", self.area())\n    }\n}\n\nstruct Rectangulo {\n    ancho: f64,\n    alto: f64,\n}\n\nstruct Circulo {\n    radio: f64,\n}\n\n// TODO: impl Figura for Rectangulo\n\n// TODO: impl Figura for Circulo\n\nfn main() {\n    let r = Rectangulo { ancho: 3.0, alto: 4.0 };\n    let c = Circulo { radio: 2.0 };\n\n    assert_eq!(r.area(), 12.0);\n    assert!((c.area() - 12.566370614359172).abs() < 1e-9);\n    assert_eq!(r.describir(), \"figura con área 12.00\");\n    assert_eq!(c.describir(), \"figura con área 12.57\");\n    println!(\"Todo OK ✅\");\n}",
          "solution": "trait Figura {\n    fn area(&self) -> f64;\n\n    // Método default: lo heredan ambas figuras.\n    fn describir(&self) -> String {\n        format!(\"figura con área {:.2}\", self.area())\n    }\n}\n\nstruct Rectangulo {\n    ancho: f64,\n    alto: f64,\n}\n\nstruct Circulo {\n    radio: f64,\n}\n\nimpl Figura for Rectangulo {\n    fn area(&self) -> f64 {\n        self.ancho * self.alto\n    }\n}\n\nimpl Figura for Circulo {\n    fn area(&self) -> f64 {\n        std::f64::consts::PI * self.radio * self.radio\n    }\n}\n\nfn main() {\n    let r = Rectangulo { ancho: 3.0, alto: 4.0 };\n    let c = Circulo { radio: 2.0 };\n\n    assert_eq!(r.area(), 12.0);\n    assert!((c.area() - 12.566370614359172).abs() < 1e-9);\n    assert_eq!(r.describir(), \"figura con área 12.00\");\n    assert_eq!(c.describir(), \"figura con área 12.57\");\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "Cada `impl Figura for Tipo { … }` solo necesita el método `area` — `describir` viene gratis del default.",
            "Para el círculo: `std::f64::consts::PI * self.radio * self.radio`. La constante PI de la librería estándar es más precisa que escribir 3.1416.",
            "Si `describir()` te devuelve algo raro, NO lo implementaste tú por error, ¿verdad? El ejercicio pide heredarlo del trait."
          ],
          "explanation": "**Lo que practicaste:** el reparto de responsabilidades de un trait — lo obligatorio (`area`, distinto por figura) y lo heredado (`describir`, escrito UNA vez en el trait y disponible para todas).\n\n**Detalle de float:** comparamos el área del círculo con `(x - esperado).abs() < 1e-9` en vez de `==`. Los `f64` acumulan errores de redondeo minúsculos; comparar flotantes con igualdad exacta es un bug clásico en cualquier lenguaje.\n\n**Siguiente paso natural:** ¿y si quiero una LISTA con rectángulos Y círculos mezclados? Con `Vec<T>` no puedes (T es UN solo tipo). Eso se resuelve en la lección 5 con `dyn Trait` — ya casi llegas."
        }
      ]
    },
    {
      "id": "m06_l03",
      "moduleId": "m06",
      "moduleSlug": "m06_traits_generics",
      "order": 3,
      "title": "Trait bounds: exigir capacidades",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Bounds: pide capacidades, no tipos",
          "problem": "Una función que recibe `i32` es rígida: solo sirve para ese tipo. Una que recibe \"cualquier cosa\" es imposible de compilar: Rust no sabría qué operaciones permitir. Hace falta un punto medio.",
          "mentalModel": "Un bound es como el requisito de una oferta de trabajo: no pides \"que se llame Ana\" (un tipo concreto), pides \"que sepa conducir\" (una capacidad). Cualquier candidato con esa capacidad sirve, incluso los que aún no existen.",
          "concreteExample": "Llevas un módulo entero usando bounds sin saberlo: `.filter(|n| n % 2 == 0)` funciona porque `filter` exige `F: FnMut(&T) -> bool` — un bound sobre el closure que le pasas.",
          "remember": "Generics dicen \"funciono con muchos tipos\"; los bounds dicen \"…siempre que sepan hacer ESTO\"."
        },
        {
          "type": "challenge",
          "conceptId": "m06-fn-bound",
          "title": "Antes de leer: el secreto de los iteradores",
          "prompt": "**Tu reto:** escribe `transformar_todos` que reciba un slice de enteros y una función `f`, y devuelva un `Vec<i32>` con `f` aplicada a cada elemento.\n\nLa firma ya está: fíjate en `<F: Fn(i32) -> i32>` — un parámetro de tipo genérico… ¡para el closure! Dentro, usa lo que ya dominas de m05: `.iter()`, `.map()`, `.collect()`.",
          "starterCode": "fn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {\n    // pista: iter → map → collect\n    \n}",
          "tests": "fn main() {\n    assert_eq!(transformar_todos(&[1, 2, 3], |n| n * 10), vec![10, 20, 30]);\n    assert_eq!(transformar_todos(&[5], |n| n - 5), vec![0]);\n    assert_eq!(transformar_todos(&[], |n| n + 1), Vec::<i32>::new());\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {\n    items.iter().map(|&n| f(n)).collect()\n}",
          "hints": [
            "Dentro de la función, `f` se usa como cualquier función: `f(5)` devuelve un `i32`.",
            "`items.iter()` produce referencias (`&i32`). El patrón `|&n|` en el closure del map des-referencia: `n` ya es `i32`.",
            "La cadena completa: `items.iter().map(|&n| f(n)).collect()` — y `collect` sabe que debe armar un `Vec<i32>` por el tipo de retorno."
          ],
          "reveal": "Acabas de escribir una función genérica sobre… **otra función**. Esto es exactamente lo que `map` y `filter` son por dentro:\n\n```rust\nfn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {\n    items.iter().map(|&n| f(n)).collect()\n}\n```\n\n`F` es un parámetro de tipo (como la `T` de la lección 1) y `Fn(i32) -> i32` es su **bound**: \"cualquier cosa invocable que tome un i32 y devuelva un i32\". Los closures de m05 cumplen ese contrato.\n\nLa revelación importante: **los bounds no son un tema nuevo** — son el mecanismo que hacía funcionar todo lo que ya usabas. `Vec<T>` es un generic; `filter` exige un bound `FnMut`; `sort` exige `Ord`. Ahora vas a verlos de frente. 👇"
        },
        {
          "type": "text",
          "body": "## Tres formas de escribir el mismo bound\n\nRust te da tres sintaxis. Son equivalentes — elige por legibilidad:\n\n```rust\n// 1. Inline: corta y directa (lo más común)\nfn etiqueta<T: Display>(valor: T) -> String { /* … */ }\n\n// 2. `where`: cuando hay varios genéricos o bounds largos\nfn procesar<T, U>(a: T, b: U) -> String\nwhere\n    T: Display + Clone,\n    U: Display,\n{ /* … */ }\n\n// 3. `impl Trait` en parámetros: azúcar sintáctico para casos simples\nfn etiqueta(valor: impl Display) -> String { /* … */ }\n```\n\nEl `+` combina requisitos: `T: Display + Clone` exige **ambas** capacidades.\n\n## Bounds en acción"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::fmt::Display;\n\n// Display es el trait \"sé mostrarme como texto para humanos\".\n// Lo tienen los números, &str, String… (lo verás a fondo en la próxima lección)\nfn etiqueta<T: Display>(valor: T) -> String {\n    format!(\"[{}]\", valor)\n}\n\n// Dos genéricos, bounds combinados, sintaxis where:\nfn par_etiquetado<A, B>(a: A, b: B) -> String\nwhere\n    A: Display,\n    B: Display,\n{\n    format!(\"{} → {}\", a, b)\n}\n\nfn main() {\n    println!(\"{}\", etiqueta(42));\n    println!(\"{}\", etiqueta(\"rust\"));\n    println!(\"{}\", etiqueta(3.5));\n\n    println!(\"{}\", par_etiquetado(\"puerto\", 8080));\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "warning",
          "body": "**El error que más verás esta semana:**\n```\nerror[E0277]: `MiTipo` doesn't implement `std::fmt::Display`\n```\nTraducción: pasaste un tipo a una función cuyo bound exige `Display`, y tu tipo no lo implementa (todavía). La solución nunca es pelear con la función: es implementar el trait que falta en tu tipo — o usar `{:?}` con `Debug`, que sí se deriva gratis."
        },
        {
          "type": "text",
          "body": "## El mapa completo: ya estabas rodeado de bounds\n\nMira las firmas (simplificadas) de cosas que usaste en m05:\n\n```rust\n// filter: el predicado DEBE ser invocable con &T y devolver bool\nfn filter<P>(self, predicate: P) where P: FnMut(&Item) -> bool\n\n// sort: los elementos DEBEN tener orden total\nfn sort(&mut self) where T: Ord\n\n// sum: el iterador DEBE producir algo sumable\nfn sum<S>(self) -> S where S: Sum<Item>\n```\n\nCada error críptico de iteradores que hayas visto era un bound diciéndote \"este tipo no sabe hacer lo que me pides\". Ahora puedes leerlos: busca el `where` en el mensaje del compilador y pregunta \"¿qué capacidad me falta?\"."
        },
        {
          "type": "faded-exercise",
          "conceptId": "m06-bound-contains",
          "title": "Práctica guiada: búsqueda genérica",
          "intro": "Vamos a escribir funciones de búsqueda que funcionan para CUALQUIER tipo comparable con `==` — el bound se llama `PartialEq`. Observa, completa, y hazlo solo.",
          "stages": [
            {
              "kind": "worked",
              "instructions": "**Paso 1 — observa.** `posicion` busca un elemento y devuelve su índice (`Option<usize>`, como en m04: puede no estar). El bound `T: PartialEq` desbloquea el `==` de la comparación. Fíjate: compara `item == objetivo` donde ambos son referencias — Rust compara los valores apuntados.",
              "code": "fn posicion<T: PartialEq>(items: &[T], objetivo: &T) -> Option<usize> {\n    for (i, item) in items.iter().enumerate() {\n        if item == objetivo {\n            return Some(i);\n        }\n    }\n    None\n}"
            },
            {
              "kind": "faded",
              "instructions": "**Paso 2 — completa.** `contiene` es la prima simple de `posicion`: solo dice si el elemento está. Rellena los tres `___`: el **bound** que permite comparar, el **operador** de comparación, y el valor de retorno cuando el loop termina sin encontrar nada.",
              "code": "fn contiene<T: ___>(items: &[T], objetivo: &T) -> bool {\n    for item in items {\n        if item ___ objetivo {\n            return true;\n        }\n    }\n    ___\n}"
            },
            {
              "kind": "solo",
              "instructions": "**Paso 3 — tú solo.** Escribe `contiene` completa desde cero: recibe `&[T]` y `&T`, devuelve `bool`. Recuerda qué bound necesita `==`.",
              "code": "fn contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool {\n    // tu código aquí\n}"
            }
          ],
          "tests": "fn main() {\n    assert!(contiene(&[1, 2, 3], &2));\n    assert!(!contiene(&[1, 2, 3], &9));\n    assert!(contiene(&[\"a\", \"b\"], &\"b\"));\n    assert!(!contiene::<i32>(&[], &1));\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool {\n    for item in items {\n        if item == objetivo {\n            return true;\n        }\n    }\n    false\n}"
        },
        {
          "type": "quiz",
          "question": "¿Qué significa la firma `fn procesar<T: Display + Clone>(valor: T)`?",
          "options": [
            {
              "text": "T debe cumplir AMBOS traits: saber mostrarse como texto Y saber clonarse",
              "correct": true
            },
            {
              "text": "T debe cumplir al menos uno de los dos traits",
              "correct": false
            },
            {
              "text": "T se convierte primero a Display y luego a Clone",
              "correct": false
            },
            {
              "text": "La función devuelve un Display o un Clone",
              "correct": false
            }
          ],
          "explanation": "El `+` **suma requisitos**, no da alternativas: el tipo necesita las dos capacidades para entrar. Dentro de la función podrás usar `format!(\"{}\", valor)` (gracias a Display) y `valor.clone()` (gracias a Clone) — ni una operación más de las que los bounds garantizan."
        },
        {
          "type": "quiz",
          "question": "`Vec<T>` y `Option<T>`, que usas desde hace dos módulos, ¿qué son exactamente?",
          "options": [
            {
              "text": "Tipos genéricos de la librería estándar: el T se especializa al compilar, igual que en tus propias funciones genéricas",
              "correct": true
            },
            {
              "text": "Tipos especiales del compilador que no se pueden imitar",
              "correct": false
            },
            {
              "text": "Tipos dinámicos que deciden su contenido en ejecución",
              "correct": false
            },
            {
              "text": "Macros que generan código",
              "correct": false
            }
          ],
          "explanation": "No tienen nada de mágico: `Vec<T>` y `Option<T>` están definidos con la MISMA sintaxis de generics que aprendiste en la lección 1 (`struct Vec<T> {…}`, `enum Option<T> {…}`). Cuando escribes `Vec<String>`, el compilador estampa la versión especializada — monomorphization otra vez."
        },
        {
          "type": "exercise",
          "title": "Informe genérico: el mayor y el menor juntos",
          "language": "rust",
          "prompt": "Escribe `extremos<T>` que reciba un slice y devuelva `Option<(T, T)>`: la tupla `(menor, mayor)`, o `None` si el slice está vacío.\n\nPiensa primero: ¿qué bounds necesitas? Vas a **comparar** elementos y a **copiarlos** fuera del slice. Decláralos tú — el starter te deja los `___` en la firma.\n\nBonus mental: ¿por qué devolver `Option<(T, T)>` es mejor diseño que devolver `(T, T)` y entrar en pánico con slices vacíos? (m04 ya te dio la respuesta.)",
          "starterCode": "fn extremos<T: ___>(items: &[T]) -> Option<(T, T)> {\n    // tu código aquí\n    todo!()\n}\n\nfn main() {\n    assert_eq!(extremos(&[3, 1, 4, 1, 5]), Some((1, 5)));\n    assert_eq!(extremos(&[7]), Some((7, 7)));\n    assert_eq!(extremos(&['m', 'a', 'x']), Some(('a', 'x')));\n    assert_eq!(extremos::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
          "solution": "fn extremos<T: PartialOrd + Copy>(items: &[T]) -> Option<(T, T)> {\n    if items.is_empty() {\n        return None;\n    }\n    let mut menor = items[0];\n    let mut mayor = items[0];\n    for &item in &items[1..] {\n        if item < menor {\n            menor = item;\n        }\n        if item > mayor {\n            mayor = item;\n        }\n    }\n    Some((menor, mayor))\n}\n\nfn main() {\n    assert_eq!(extremos(&[3, 1, 4, 1, 5]), Some((1, 5)));\n    assert_eq!(extremos(&[7]), Some((7, 7)));\n    assert_eq!(extremos(&['m', 'a', 'x']), Some(('a', 'x')));\n    assert_eq!(extremos::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "Los bounds que faltan: `PartialOrd` (para `<` y `>`) y `Copy` (para sacar valores del slice). Se combinan con `+`.",
            "Arranca con `menor` y `mayor` apuntando ambos a `items[0]`, y recorre el resto actualizando cada uno por separado.",
            "Un slice de un solo elemento debe devolver `Some((x, x))` — tu inicialización ya lo resuelve gratis si arrancas con items[0] en ambos."
          ],
          "explanation": "**Lo que practicaste:** decidir los bounds TÚ, leyendo tu propio código. Necesitabas `<`/`>` → `PartialOrd`; necesitabas sacar copias → `Copy`. Esa lectura — \"¿qué operaciones hago sobre T?\" → \"¿qué traits las garantizan?\" — es exactamente cómo se diseñan firmas genéricas profesionales.\n\n**Sobre el Option:** devolver `Option<(T, T)>` convierte el caso \"slice vacío\" en algo que el llamador DEBE manejar. La alternativa (panic) explota en producción a las 3 AM. Este es el diseño honesto de errores de m04, aplicado a APIs genéricas."
        }
      ]
    },
    {
      "id": "m06_l04",
      "moduleId": "m06",
      "moduleSlug": "m06_traits_generics",
      "order": 4,
      "title": "Traits estándar y derive",
      "blocks": [
        {
          "type": "first-principles",
          "title": "El ecosistema habla en traits estándar",
          "problem": "Tu struct nuevo nace sin saber hacer nada: no se puede imprimir, ni comparar, ni clonar. Cada librería que uses esperará que tus tipos tengan ciertas capacidades básicas.",
          "mentalModel": "Los traits estándar son como los enchufes universales: si tu tipo implementa `Display`, CUALQUIER código que sepa imprimir cosas (println!, format!, logs) acepta tu tipo sin conocerlo.",
          "concreteExample": "`assert_eq!(a, b)` solo funciona si tu tipo implementa `PartialEq` (comparar) y `Debug` (mostrarse cuando falla el assert). Por eso los tests te pedían `#[derive(Debug, PartialEq)]` en m04.",
          "remember": "Antes de escribir un método propio, pregunta: ¿existe un trait estándar para esto? Implementarlo conecta tu tipo con todo el ecosistema."
        },
        {
          "type": "challenge",
          "conceptId": "m06-display",
          "title": "Antes de leer: enséñale a tu tipo a imprimirse",
          "prompt": "**Tu reto:** haz que `Temperatura` se pueda usar con `println!(\"{}\")`. Eso exige implementar el trait `Display` de la librería estándar.\n\nLa estructura del `impl` ya está (es algo ceremoniosa) — tú solo escribe el cuerpo de `fmt` usando la macro `write!`, que funciona como `format!` pero escribe en el formateador `f`:\n\n```rust\nwrite!(f, \"plantilla {}\", valores)\n```\n\nFormato esperado: `23.5°C` (el número, el símbolo °, la C).",
          "starterCode": "use std::fmt;\n\nstruct Temperatura {\n    celsius: f64,\n}\n\nimpl fmt::Display for Temperatura {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        // escribe \"{...}°C\" usando write!(f, ...)\n        \n    }\n}",
          "tests": "fn main() {\n    let t = Temperatura { celsius: 23.5 };\n    assert_eq!(format!(\"{}\", t), \"23.5°C\");\n    let frio = Temperatura { celsius: -5.0 };\n    assert_eq!(format!(\"{}\", frio), \"-5°C\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "use std::fmt;\n\nstruct Temperatura {\n    celsius: f64,\n}\n\nimpl fmt::Display for Temperatura {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, \"{}°C\", self.celsius)\n    }\n}",
          "hints": [
            "El cuerpo es UNA línea: `write!(f, \"{}°C\", self.celsius)` — sin punto y coma, porque `write!` devuelve el `fmt::Result` que la función debe retornar.",
            "Si te confunde la firma: `f` es el \"papel\" donde escribes, `write!` es tu \"lápiz\". Todo lo demás es ceremonia fija que siempre se copia igual."
          ],
          "reveal": "Tu tipo ahora habla el idioma del ecosistema:\n\n```rust\nimpl fmt::Display for Temperatura {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, \"{}°C\", self.celsius)\n    }\n}\n```\n\nCon ese único `impl`, `Temperatura` funciona con `println!(\"{}\")`, `format!`, `to_string()` (¡gratis!), cualquier logger, cualquier template… **Código que jamás oyó hablar de temperaturas ahora sabe mostrarlas.**\n\nEse es el poder de los traits estándar: son contratos que TODO el ecosistema conoce. En esta lección verás los seis que usarás a diario — y el atajo `#[derive]` para no escribirlos a mano. 👇"
        },
        {
          "type": "text",
          "body": "## derive: implementaciones gratis\n\nPara los traits más mecánicos, Rust genera la implementación por ti con el atributo `#[derive(...)]` encima del tipo:\n\n| Trait | Te da | Lo usas en |\n|-------|-------|------------|\n| `Debug` | imprimir con `{:?}` | debugging, `assert_eq!` fallidos |\n| `Clone` | `.clone()` explícito | duplicar valores con heap |\n| `Copy` | copia implícita (tipos chicos) | structs de solo números |\n| `PartialEq` | comparar con `==` | tests, lógica de negocio |\n| `PartialOrd` | comparar con `<`, `>` | ordenar, máximos/mínimos |\n| `Default` | `Tipo::default()` | valores iniciales |\n\n¿Por qué \"derivables\"? Porque su lógica es mecánica: comparar structs campo a campo, clonar campo a campo… no hay decisiones de diseño que tomar."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "#[derive(Debug, Clone, PartialEq)]\nstruct Usuario {\n    nombre: String,\n    edad: u32,\n}\n\nfn main() {\n    let a = Usuario { nombre: String::from(\"Ana\"), edad: 30 };\n    let b = a.clone();              // Clone: copia profunda explícita\n\n    println!(\"{:?}\", a);            // Debug: {:?} imprime la estructura\n    println!(\"¿Iguales? {}\", a == b); // PartialEq: comparación campo a campo\n\n    // Sin los derive, las TRES líneas de arriba serían errores de compilación.\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "**Regla práctica:** casi todo struct tuyo quiere nacer con `#[derive(Debug)]` como mínimo — sin él no puedes ni inspeccionarlo al depurar ni usarlo en `assert_eq!`. Agrega `Clone` y `PartialEq` cuando los necesites. Son una línea; quítalos solo si tienes una razón concreta."
        },
        {
          "type": "text",
          "body": "## ¿Por qué Display NO se puede derivar?\n\nTe habrás fijado: `Display` no está en la tabla. Es intencional. `Debug` tiene un formato mecánico obvio (`Usuario { nombre: \"Ana\", edad: 30 }`), pero ¿cuál es el formato \"para humanos\" de un Usuario? ¿`Ana`? ¿`Ana (30)`? ¿`Ana <ana@mail.com>`?\n\n**Eso es una decisión de diseño, no mecánica** — y Rust se niega a adivinarla. Si quieres `Display`, lo escribes tú, como en el challenge.\n\n## From / Into: conversiones con nombre propio\n\nEl último trait estrella de hoy: `From<T>` define \"cómo construirme a partir de un T\". Implementas `From` y recibes `Into` gratis (son espejos):"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "struct Metros(f64);      // tuple struct: un struct con un campo sin nombre\nstruct Kilometros(f64);\n\nimpl From<Kilometros> for Metros {\n    fn from(km: Kilometros) -> Self {\n        Metros(km.0 * 1000.0)   // .0 accede al primer campo del tuple struct\n    }\n}\n\nfn main() {\n    // Dos formas de usar la MISMA conversión:\n    let a = Metros::from(Kilometros(2.5));\n    let b: Metros = Kilometros(1.2).into();  // into() infiere el destino\n\n    println!(\"{} m\", a.0);\n    println!(\"{} m\", b.0);\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**¿Te suena `String::from(\"hola\")`?** Llevas usándolo desde m02: es exactamente este trait — `String` implementa `From<&str>`. Y el operador `?` de m04 usa `From` por debajo para convertir errores de un tipo a otro automáticamente. Las piezas se conectan."
        },
        {
          "type": "quiz",
          "question": "¿Por qué `Debug` se puede derivar automáticamente pero `Display` no?",
          "options": [
            {
              "text": "Debug tiene un formato mecánico para programadores; Display es el formato para humanos, y ese es una decisión de diseño que Rust no quiere adivinar",
              "correct": true
            },
            {
              "text": "Display es más antiguo y no se actualizó",
              "correct": false
            },
            {
              "text": "Debug es más simple de implementar internamente",
              "correct": false
            },
            {
              "text": "Sí se puede derivar Display, pero es mala práctica",
              "correct": false
            }
          ],
          "explanation": "La línea divisoria de los derive es: ¿la implementación es mecánica u opinable? Comparar campo a campo es mecánico (PartialEq ✓). Pero el texto \"bonito\" de tu tipo — qué mostrar, qué ocultar, en qué orden — es diseño de producto. Rust prefiere que esa decisión quede escrita por un humano."
        },
        {
          "type": "quiz",
          "question": "¿Qué desbloquea exactamente `#[derive(PartialEq)]` en tu struct?",
          "options": [
            {
              "text": "Comparar instancias con == y != (campo a campo), lo que también habilita assert_eq! en tests",
              "correct": true
            },
            {
              "text": "Ordenar instancias con .sort()",
              "correct": false
            },
            {
              "text": "Imprimir la estructura con {:?}",
              "correct": false
            },
            {
              "text": "Copiar instancias implícitamente al asignarlas",
              "correct": false
            }
          ],
          "explanation": "Cada derive desbloquea operaciones concretas: `PartialEq` → `==`/`!=`; ordenar pide `PartialOrd`/`Ord`; `{:?}` pide `Debug`; la copia implícita pide `Copy`. Aprender ese mapeo te deja leer los errores del compilador como instrucciones: \"falta X\" → \"derive X\"."
        },
        {
          "type": "exercise",
          "title": "Un Producto de primera clase",
          "language": "rust",
          "prompt": "Prepara el struct `Producto` para el mundo real:\n\n1. Derívale `Debug`, `Clone` y `PartialEq`.\n2. Impleméntale `Display` a mano con el formato `Teclado — $49.90` (nombre, espacio, raya larga `—`, espacio, `$` y el precio con **2 decimales**: `{:.2}`).\n\nEl `main` ya prueba todo: derives y Display.",
          "starterCode": "use std::fmt;\n\n// TODO 1: derive(Debug, Clone, PartialEq)\nstruct Producto {\n    nombre: String,\n    precio: f64,\n}\n\n// TODO 2: impl fmt::Display for Producto\n\nfn main() {\n    let p = Producto { nombre: String::from(\"Teclado\"), precio: 49.9 };\n    let copia = p.clone();\n\n    assert_eq!(p, copia);\n    assert_eq!(format!(\"{}\", p), \"Teclado — $49.90\");\n    println!(\"{:?}\", p);\n    println!(\"{}\", p);\n    println!(\"Todo OK ✅\");\n}",
          "solution": "use std::fmt;\n\n#[derive(Debug, Clone, PartialEq)]\nstruct Producto {\n    nombre: String,\n    precio: f64,\n}\n\nimpl fmt::Display for Producto {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, \"{} — ${:.2}\", self.nombre, self.precio)\n    }\n}\n\nfn main() {\n    let p = Producto { nombre: String::from(\"Teclado\"), precio: 49.9 };\n    let copia = p.clone();\n\n    assert_eq!(p, copia);\n    assert_eq!(format!(\"{}\", p), \"Teclado — $49.90\");\n    println!(\"{:?}\", p);\n    println!(\"{}\", p);\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "El derive va pegado encima del struct: `#[derive(Debug, Clone, PartialEq)]`.",
            "El impl de Display es idéntico al del challenge de Temperatura — cambia solo la plantilla del write!.",
            "`{:.2}` formatea el f64 con exactamente 2 decimales: `49.9` se imprime `49.90`. La raya del formato es `—` (em dash), no un guion normal."
          ],
          "explanation": "**Lo que practicaste:** el combo estándar de un tipo \"ciudadano de primera\" en Rust — derives mecánicos + Display manual. Este patrón exacto lo verás en cada codebase profesional.\n\n**Por qué importa:** un tipo con `Debug + Clone + PartialEq + Display` se puede testear (`assert_eq!`), inspeccionar (`{:?}`), duplicar y mostrar al usuario. Sin esos traits, tu tipo es un extraño en su propio ecosistema: cada librería que toque te pedirá uno de ellos.\n\n**En el mundo real** también verás `#[derive(Serialize, Deserialize)]` de la librería `serde` — el MISMO mecanismo de derive, extendido por terceros para JSON. El sistema de traits es tan central que hasta las librerías externas enseñan capacidades nuevas a tus tipos."
        }
      ]
    },
    {
      "id": "m06_l05",
      "moduleId": "m06",
      "moduleSlug": "m06_traits_generics",
      "order": 5,
      "title": "Polimorfismo: impl Trait y dyn Trait",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Dos maneras de decir \"cualquier cosa que sepa hacer X\"",
          "problem": "Los generics se especializan al compilar: en un `Vec<T>`, TODOS los elementos son del mismo tipo concreto. Pero a veces necesitas una lista mixta — círculos Y rectángulos juntos — o devolver \"algún tipo que cumpla el trait\" sin decir cuál.",
          "mentalModel": "Generics son como trajes a medida: el compilador corta uno por cliente (rápido, rígido). `dyn Trait` es la talla única ajustable: una sola pieza que sirve a cualquiera, a cambio de una pequeña indirección para ajustarla en el momento.",
          "concreteExample": "Un editor gráfico guarda las figuras del lienzo en una sola lista: `Vec<Box<dyn Figura>>`. Círculos, rectángulos, estrellas — tipos distintos, mismo contrato. Al dibujar, cada elemento ejecuta SU propio `dibujar()`.",
          "remember": "Generics (`<T: Trait>`): se resuelve al compilar, máxima velocidad, un tipo a la vez. `dyn Trait`: se resuelve al ejecutar, máxima flexibilidad, tipos mezclados."
        },
        {
          "type": "challenge",
          "conceptId": "m06-dyn-collection",
          "title": "Antes de leer: una lista de figuras distintas",
          "prompt": "**Tu reto:** te damos un trait `Figura` y dos tipos que lo implementan. La función `area_total` recibe algo nuevo: `&[Box<dyn Figura>]` — un slice de \"cajas\" que pueden contener **cualquier figura**.\n\nNo te preocupes (todavía) por qué se escribe así: trata cada elemento como \"algo que tiene `.area()`\" y suma todas las áreas. Tus herramientas de m05 (`.iter()`, `.map()`, `.sum()`) funcionan exactamente igual.",
          "starterCode": "trait Figura {\n    fn area(&self) -> f64;\n}\n\nstruct Cuadrado {\n    lado: f64,\n}\n\nstruct Triangulo {\n    base: f64,\n    altura: f64,\n}\n\nimpl Figura for Cuadrado {\n    fn area(&self) -> f64 {\n        self.lado * self.lado\n    }\n}\n\nimpl Figura for Triangulo {\n    fn area(&self) -> f64 {\n        self.base * self.altura / 2.0\n    }\n}\n\nfn area_total(figuras: &[Box<dyn Figura>]) -> f64 {\n    // suma las áreas de TODAS las figuras\n    \n}",
          "tests": "fn main() {\n    let figuras: Vec<Box<dyn Figura>> = vec![\n        Box::new(Cuadrado { lado: 2.0 }),\n        Box::new(Triangulo { base: 3.0, altura: 4.0 }),\n    ];\n    assert!((area_total(&figuras) - 10.0).abs() < 1e-9);\n    assert_eq!(area_total(&[]), 0.0);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "trait Figura {\n    fn area(&self) -> f64;\n}\n\nstruct Cuadrado {\n    lado: f64,\n}\n\nstruct Triangulo {\n    base: f64,\n    altura: f64,\n}\n\nimpl Figura for Cuadrado {\n    fn area(&self) -> f64 {\n        self.lado * self.lado\n    }\n}\n\nimpl Figura for Triangulo {\n    fn area(&self) -> f64 {\n        self.base * self.altura / 2.0\n    }\n}\n\nfn area_total(figuras: &[Box<dyn Figura>]) -> f64 {\n    figuras.iter().map(|f| f.area()).sum()\n}",
          "hints": [
            "Aunque el tipo del slice se vea intimidante, cada elemento responde a `.area()` como cualquier figura. Itera y suma.",
            "Con iteradores de m05: `.iter().map(|f| f.area()).sum()`. El `sum()` sabe que debe dar `f64` por el tipo de retorno de la función.",
            "¿Prefieres un `for`? `let mut total = 0.0; for f in figuras { total += f.area(); } total` — ambas soluciones valen."
          ],
          "reveal": "Acabas de usar **dynamic dispatch** sin despeinarte:\n\n```rust\nfn area_total(figuras: &[Box<dyn Figura>]) -> f64 {\n    figuras.iter().map(|f| f.area()).sum()\n}\n```\n\nLo nuevo está en el tipo: `Box<dyn Figura>`.\n\n- **`dyn Figura`** = \"algún tipo que implementa Figura, decidido en ejecución\". Como cada figura puede medir distinto en memoria, no puede ir \"desnuda\" en un Vec…\n- **`Box`** = una caja en el heap (¡tu conocimiento de m03 sirve aquí!). La caja siempre mide lo mismo (un puntero), así que el Vec puede almacenar cajas de figuras distintas.\n\nCuando llamas `f.area()`, Rust consulta en ejecución una pequeña tabla (la *vtable*) para saber cuál `area` ejecutar: ¿la del cuadrado o la del triángulo? Esa es la diferencia clave con los generics — y el tema de esta lección. 👇"
        },
        {
          "type": "text",
          "body": "## Static dispatch: lo que ya conocías\n\nCon generics, el compilador sabe el tipo concreto y conecta la llamada **directamente** (static dispatch). Ya lo viste: monomorphization, costo cero:\n\n```rust\nfn imprimir_area<T: Figura>(figura: &T) {\n    println!(\"{}\", figura.area());  // conexión directa, decidida al compilar\n}\n```\n\nLa limitación: `T` se fija por llamada. Un `Vec<T>` con `T = Cuadrado` solo guarda cuadrados.\n\n## Dynamic dispatch: decidir en ejecución\n\n`dyn Trait` pospone la decisión: \"aquí dentro hay ALGÚN tipo que cumple Figura, ya veremos cuál\". Para llamar a un método, el programa consulta la **vtable** — una tabla de punteros a funciones que acompaña al valor:\n\n- Costo: una indirección por llamada (nanosegundos — casi nunca es tu cuello de botella).\n- Ganancia: colecciones mixtas, plugins, configuraciones elegidas en runtime.\n\n¿Por qué `Box`? Un `Cuadrado` mide 8 bytes; un `Triangulo`, 16. Un Vec necesita elementos de tamaño uniforme — así que guardas **punteros** a cajas del heap (todas miden igual) en lugar de las figuras desnudas."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "trait Figura {\n    fn area(&self) -> f64;\n    fn nombre(&self) -> String;\n}\n\nstruct Cuadrado { lado: f64 }\nstruct Circulo { radio: f64 }\n\nimpl Figura for Cuadrado {\n    fn area(&self) -> f64 { self.lado * self.lado }\n    fn nombre(&self) -> String { String::from(\"cuadrado\") }\n}\n\nimpl Figura for Circulo {\n    fn area(&self) -> f64 { std::f64::consts::PI * self.radio * self.radio }\n    fn nombre(&self) -> String { String::from(\"círculo\") }\n}\n\nfn main() {\n    // La lista MIXTA: imposible con Vec<T>, natural con Box<dyn Trait>.\n    let lienzo: Vec<Box<dyn Figura>> = vec![\n        Box::new(Cuadrado { lado: 2.0 }),\n        Box::new(Circulo { radio: 1.0 }),\n        Box::new(Cuadrado { lado: 0.5 }),\n    ];\n\n    for figura in &lienzo {\n        // ¿Qué area() se ejecuta? Se decide AQUÍ, en ejecución, vía vtable.\n        println!(\"{}: {:.2}\", figura.nombre(), figura.area());\n    }\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## impl Trait como retorno: \"devuelvo algo que cumple el contrato\"\n\nHay un tercer jugador: `impl Trait` en la **posición de retorno**. Dice \"esta función devuelve UN tipo concreto que implementa el trait, pero no te digo cuál\":"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "trait Animal {\n    fn nombre(&self) -> String;\n}\n\nstruct Perro;\n\nimpl Animal for Perro {\n    fn nombre(&self) -> String {\n        String::from(\"Firulais\")\n    }\n}\n\n// \"Devuelvo ALGO que es Animal\". El tipo concreto (Perro) queda oculto:\n// puedo cambiarlo mañana sin romper a quien me llama.\nfn adoptar() -> impl Animal {\n    Perro\n}\n\nfn main() {\n    let mascota = adoptar();\n    println!(\"Adoptaste a {}\", mascota.nombre());\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**¿Dónde lo verás en el mundo real?** Los iteradores de m05 devuelven tipos impronunciables (`Map<Filter<Iter<…>>>`). Por eso las funciones que construyen pipelines devuelven `impl Iterator<Item = i32>`: \"un iterador de enteros, no preguntes el tipo exacto\". Sin `impl Trait`, esas firmas serían inescribibles."
        },
        {
          "type": "text",
          "body": "## ¿Cuál uso? La tabla de decisión\n\n| Situación | Herramienta |\n|-----------|-------------|\n| Función que acepta cualquier tipo capaz de X | `<T: Trait>` (generics) |\n| Colección con tipos MEZCLADOS | `Vec<Box<dyn Trait>>` |\n| Devolver un tipo complejo/oculto que cumple X | `-> impl Trait` |\n| Plugins o estrategias elegidas en runtime | `Box<dyn Trait>` |\n| Máximo rendimiento en bucles calientes | generics (static dispatch) |\n\nRegla de oro: **empieza con generics** (más rápido, más información para el compilador). Cambia a `dyn` cuando necesites mezclar tipos o decidir en ejecución. El compilador te avisará si intentas lo imposible."
        },
        {
          "type": "quiz",
          "question": "¿Por qué una lista con figuras de tipos distintos necesita `Vec<Box<dyn Figura>>` en lugar de `Vec<T>` genérico?",
          "options": [
            {
              "text": "Porque en Vec<T> el T se especializa a UN solo tipo concreto al compilar; dyn permite mezclar tipos pagando una indirección en ejecución",
              "correct": true
            },
            {
              "text": "Porque Vec<T> es más lento que Box",
              "correct": false
            },
            {
              "text": "Porque los traits no funcionan con Vec",
              "correct": false
            },
            {
              "text": "Porque las figuras son demasiado grandes para el stack",
              "correct": false
            }
          ],
          "explanation": "Monomorphization especializa: `Vec<Cuadrado>` es una lista de cuadrados y punto. `Box<dyn Figura>` borra el tipo concreto detrás de un puntero uniforme: la lista guarda \"cajas de cualquier figura\" y el método correcto se busca en ejecución vía vtable. Flexibilidad a cambio de una indirección."
        },
        {
          "type": "quiz",
          "question": "Con `figura.area()` donde `figura: &Box<dyn Figura>`, ¿cuándo se decide QUÉ implementación de `area` se ejecuta?",
          "options": [
            {
              "text": "En tiempo de ejecución, consultando la vtable del valor concreto",
              "correct": true
            },
            {
              "text": "En tiempo de compilación, como con los generics",
              "correct": false
            },
            {
              "text": "La primera vez que se llama, y luego queda cacheada para siempre",
              "correct": false
            },
            {
              "text": "Nunca: dyn Trait solo permite métodos default",
              "correct": false
            }
          ],
          "explanation": "Eso es dynamic dispatch: el valor lleva consigo un puntero a su vtable (la tabla de métodos de SU tipo), y cada llamada la consulta. Por eso `dyn` puede mezclar tipos que el compilador no conoce de antemano — y por eso cuesta una indirección que los generics no pagan."
        },
        {
          "type": "exercise",
          "title": "Mini-sistema de validación con plugins",
          "language": "rust",
          "prompt": "Vas a construir el patrón más común de `dyn Trait` en el mundo real: una **cadena de validadores** configurable (así funcionan los middlewares de un servidor web o las reglas de un formulario).\n\n1. Implementa `Validador` para `NoVacio` (falla con `\"el texto no puede estar vacío\"` si el texto, tras `.trim()`, queda vacío).\n2. Implementa `Validador` para `LargoMaximo` (falla con `\"máximo {max} caracteres\"` si `texto.len()` supera `self.max`).\n3. Implementa `validar_todos`: ejecuta TODOS los validadores y devuelve los mensajes de error de los que fallen (un `Vec<String>` vacío significa que todo pasó).\n\nPista de oro para el punto 3: `Result::err()` convierte un `Result<(), String>` en `Option<String>` — combínalo con `.filter_map()` de m05.",
          "starterCode": "trait Validador {\n    fn validar(&self, texto: &str) -> Result<(), String>;\n}\n\nstruct NoVacio;\n\nstruct LargoMaximo {\n    max: usize,\n}\n\n// TODO 1: impl Validador for NoVacio\n\n// TODO 2: impl Validador for LargoMaximo\n\nfn validar_todos(validadores: &[Box<dyn Validador>], texto: &str) -> Vec<String> {\n    // TODO 3: junta los errores de los validadores que fallen\n    todo!()\n}\n\nfn main() {\n    let reglas: Vec<Box<dyn Validador>> = vec![\n        Box::new(NoVacio),\n        Box::new(LargoMaximo { max: 10 }),\n    ];\n\n    assert_eq!(validar_todos(&reglas, \"hola\"), Vec::<String>::new());\n    assert_eq!(\n        validar_todos(&reglas, \"\"),\n        vec![String::from(\"el texto no puede estar vacío\")]\n    );\n    assert_eq!(\n        validar_todos(&reglas, \"demasiado largo para la regla\"),\n        vec![String::from(\"máximo 10 caracteres\")]\n    );\n    println!(\"Todo OK ✅\");\n}",
          "solution": "trait Validador {\n    fn validar(&self, texto: &str) -> Result<(), String>;\n}\n\nstruct NoVacio;\n\nstruct LargoMaximo {\n    max: usize,\n}\n\nimpl Validador for NoVacio {\n    fn validar(&self, texto: &str) -> Result<(), String> {\n        if texto.trim().is_empty() {\n            Err(String::from(\"el texto no puede estar vacío\"))\n        } else {\n            Ok(())\n        }\n    }\n}\n\nimpl Validador for LargoMaximo {\n    fn validar(&self, texto: &str) -> Result<(), String> {\n        if texto.len() > self.max {\n            Err(format!(\"máximo {} caracteres\", self.max))\n        } else {\n            Ok(())\n        }\n    }\n}\n\nfn validar_todos(validadores: &[Box<dyn Validador>], texto: &str) -> Vec<String> {\n    validadores\n        .iter()\n        .filter_map(|v| v.validar(texto).err())\n        .collect()\n}\n\nfn main() {\n    let reglas: Vec<Box<dyn Validador>> = vec![\n        Box::new(NoVacio),\n        Box::new(LargoMaximo { max: 10 }),\n    ];\n\n    assert_eq!(validar_todos(&reglas, \"hola\"), Vec::<String>::new());\n    assert_eq!(\n        validar_todos(&reglas, \"\"),\n        vec![String::from(\"el texto no puede estar vacío\")]\n    );\n    assert_eq!(\n        validar_todos(&reglas, \"demasiado largo para la regla\"),\n        vec![String::from(\"máximo 10 caracteres\")]\n    );\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "Cada `impl` es un if/else que devuelve `Err(mensaje)` o `Ok(())` — el `Result<(), String>` de m04: éxito sin datos, o error con mensaje.",
            "Para `LargoMaximo`, el mensaje se construye con `format!(\"máximo {} caracteres\", self.max)`.",
            "`validar_todos` en una cadena: `validadores.iter().filter_map(|v| v.validar(texto).err()).collect()`. El `.err()` descarta los Ok y extrae los mensajes de los Err."
          ],
          "explanation": "**Lo que acabas de construir es un patrón de producción real.** Cambia los nombres y es: la cadena de middlewares de un servidor web, las reglas de un motor de descuentos, los chequeos de un linter. La forma es siempre la misma:\n\n1. Un trait pequeño define el contrato (`Validador`).\n2. Cada regla es un tipo independiente — se testea sola, se agrega sin tocar las demás.\n3. `Vec<Box<dyn Trait>>` las junta y un runner las ejecuta.\n\n**Fíjate en la composición de conceptos** que usaste sin pestañear: ownership (las cajas poseen sus validadores), `Result` (m04), `filter_map` (m05), traits y dyn dispatch (este módulo). Así se siente programar en Rust de verdad: las piezas encajan.\n\n**Para masticar:** ¿por qué `validar_todos` devuelve TODOS los errores en vez de parar en el primero? Piensa en un formulario web: ¿prefieres que te marquen los 5 campos mal de una vez, o descubrirlos de a uno?"
        }
      ]
    }
  ]
}

export default module

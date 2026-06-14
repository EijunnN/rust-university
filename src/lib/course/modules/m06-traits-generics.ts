import type { Module } from "../types";

const module: Module = {
	id: "m06",
	slug: "m06_traits_generics",
	order: 6,
	version: 1,
	icon: "🧬",
	title: "Traits y Generics",
	description:
		"El vocabulario compartido de Rust: escribe código que funciona para muchos tipos y define capacidades que cualquier tipo puede implementar.",
	lessons: [
		{
			id: "m06_l01",
			moduleId: "m06",
			moduleSlug: "m06_traits_generics",
			order: 1,
			title: "Generics: una función, muchos tipos",
			blocks: [
				{
					type: "first-principles",
					title: "Generics: deja de copiar y pegar la misma lógica",
					problem:
						'La lógica de "devuelve el mayor de dos valores" es idéntica para números, caracteres o fechas. Escribir una función por cada tipo duplica código, y todo código duplicado se desincroniza tarde o temprano.',
					mentalModel:
						"Una función genérica es un molde con un hueco para el tipo. Tú escribes la lógica una vez con un nombre de relleno (`T`), y el compilador estampa una versión concreta del molde por cada tipo con el que la uses.",
					concreteExample:
						'Ya usas generics desde el módulo 5 sin llamarlos así: `Vec<T>` es "una lista de lo que sea T", `Option<T>` es "quizás un T". Lo nuevo es que ahora TÚ vas a escribir los moldes.',
					remember:
						"Generics no cuestan rendimiento: el compilador genera código especializado por tipo, como si lo hubieras escrito a mano.",
				},
				{
					type: "challenge",
					conceptId: "m06-generic-fn",
					title: "Antes de leer: siente la duplicación",
					prompt:
						"**Tu reto:** escribe DOS funciones que devuelvan el mayor de dos valores:\n\n- `mayor_i32(a: i32, b: i32) -> i32`\n- `mayor_char(a: char, b: char) -> char` (los caracteres se comparan alfabéticamente con `>`)\n\nSí, es exactamente la misma lógica dos veces. Escríbelas igual — esa incomodidad que vas a sentir **es el punto de esta lección**.",
					starterCode:
						"fn mayor_i32(a: i32, b: i32) -> i32 {\n    // tu código aquí\n}\n\nfn mayor_char(a: char, b: char) -> char {\n    // tu código aquí (sí, es la misma lógica…)\n}",
					tests:
						"fn main() {\n    assert_eq!(mayor_i32(8, 3), 8);\n    assert_eq!(mayor_i32(-2, -7), -2);\n    assert_eq!(mayor_char('z', 'a'), 'z');\n    assert_eq!(mayor_char('a', 'a'), 'a');\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
					solution:
						"fn mayor_i32(a: i32, b: i32) -> i32 {\n    if a >= b { a } else { b }\n}\n\nfn mayor_char(a: char, b: char) -> char {\n    if a >= b { a } else { b }\n}",
					hints: [
						"Es el mismo patrón que viste en m03 con `mas_largo`: un `if/else` usado como expresión.",
						"`if a >= b { a } else { b }` — y el cuerpo de la segunda función es idéntico, solo cambian los tipos de la firma.",
					],
					reveal:
						'Acabas de escribir **el mismo cuerpo dos veces**. Si mañana decides que en caso de empate gane el segundo, tienes que acordarte de cambiarlo en DOS lugares. Con 10 tipos, en 10 lugares.\n\nRust resuelve esto con **generics**: escribes la lógica una sola vez, con un "hueco" para el tipo:\n\n```rust\nfn mayor<T: PartialOrd>(a: T, b: T) -> T {\n    if a >= b { a } else { b }\n}\n```\n\n- `<T>` declara un **parámetro de tipo**: "esta función funciona para un tipo T que decidirá quien la llame".\n- `T: PartialOrd` es un **trait bound**: "…siempre que T se pueda comparar con `>=`".\n\nLa misma función sirve para `i32`, `char`, `f64`, `&str`… y el compilador genera una versión especializada para cada uno. Eso es lo que vas a ver ahora. 👇',
				},
				{
					type: "text",
					body: "## El problema: una función por cada tipo\n\nSin generics, cada tipo necesita su propia copia de la misma lógica:\n\n```rust\nfn mayor_i32(a: i32, b: i32) -> i32 { /* … */ }\nfn mayor_f64(a: f64, b: f64) -> f64 { /* … */ }\nfn mayor_char(a: char, b: char) -> char { /* … */ }\n```\n\nTres funciones, un solo algoritmo. Cada copia es una oportunidad de bug: arreglas una y olvidas las otras.\n\n## La solución: parámetros de tipo\n\nIgual que una función recibe **valores** como parámetros, puede recibir **tipos** como parámetros. Se declaran entre `<>` después del nombre:",
				},
				{
					type: "code",
					language: "rust",
					code: '// T es un parámetro de tipo: un nombre de relleno que se decide al llamar.\n// `T: PartialOrd` exige que el tipo se pueda comparar (>, <, >=, <=).\nfn mayor<T: PartialOrd>(a: T, b: T) -> T {\n    if a >= b { a } else { b }\n}\n\nfn main() {\n    println!("{}", mayor(8, 3));          // T = i32\n    println!("{}", mayor(2.7, 3.1));      // T = f64\n    println!("{}", mayor(\'a\', \'z\'));      // T = char\n    println!("{}", mayor("ana", "luis")); // T = &str (orden alfabético)\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "Una sola función, cuatro tipos distintos. Fíjate que ni siquiera anotamos el tipo al llamar: Rust lo **infiere** de los argumentos, igual que infiere el tipo de `let x = 5`.\n\n## ¿Por qué el `: PartialOrd`?\n\nIntenta quitar el bound y el compilador te frena en seco:",
				},
				{
					type: "code",
					language: "rust",
					code: "// Esto NO compila: T podría ser CUALQUIER tipo…\n// ¿y si alguien llama mayor(archivo_a, archivo_b)? ¿Qué significa > ahí?\nfn mayor<T>(a: T, b: T) -> T {\n    if a >= b { a } else { b }\n}",
					runnable: false,
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: vamos a abrirla\n\n`fn mayor<T: PartialOrd>(a: T, b: T) -> T` mete cuatro ideas en una sola línea. Si la lees de corrido parece jeroglífico; leída pieza por pieza es obvia. Vamos despacio, de izquierda a derecha:\n\n- **`fn mayor`** — el nombre de siempre. Nada nuevo: una función llamada `mayor`.\n- **`<T>`** — aquí declaras un **parámetro de tipo**. Lee el `<…>` como "esta función trabaja con un tipo que aún no sé cuál es, y lo voy a llamar `T`". Es un hueco, una variable… pero su valor no es un número, es un **tipo entero** (`i32`, `char`, `&str`…). Igual que `a` es un nombre de relleno para un valor, `T` es un nombre de relleno para un tipo.\n- **`: PartialOrd`** — pegado al `T`, esto es el **trait bound**: la condición que pones sobre `T`. Significa "…pero `T` no puede ser cualquier tipo: tiene que ser uno que sepa compararse con `<`, `>`, `>=`". Sin esta condición no podrías escribir `a >= b` dentro.\n- **`(a: T, b: T)`** — los parámetros normales. Lo clave: **los dos son `T`**, el MISMO `T`. Eso obliga a que `a` y `b` sean del mismo tipo. No puedes pasar un `i32` y un `char` a la vez — serían dos tipos distintos para un solo hueco.\n- **`-> T`** — el valor de retorno también es `T`. Si llamas con dos `i32`, te devuelve un `i32`; si llamas con dos `char`, te devuelve un `char`. El tipo de salida **sigue** al tipo de entrada.\n\nJúntalo y la línea dice, en español: *"`mayor` es una función que, para cualquier tipo `T` que se pueda comparar, toma dos valores de ese tipo y te devuelve uno de ese mismo tipo"*. Una frase, no un jeroglífico.',
				},
				{
					type: "code",
					language: "text",
					code: "QUÉ ES CADA PIEZA DE:  fn mayor<T: PartialOrd>(a: T, b: T) -> T\n\n  fn mayor            -> nombre de la función\n  <T>                 -> declara un parámetro de TIPO llamado T (un hueco)\n  T: PartialOrd       -> condición sobre T: \"T debe saber compararse (<, >, >=)\"\n  (a: T, b: T)        -> dos parámetros, AMBOS del mismo tipo T\n  -> T                -> devuelve un valor de ese mismo tipo T\n\n\nQUÉ TIPO ES CADA COSA, LLAMADA POR LLAMADA:\n\n  mayor(8, 3)            T = i32     a:i32  b:i32   ->  devuelve i32   (8)\n  mayor(2.7, 3.1)        T = f64     a:f64  b:f64   ->  devuelve f64   (3.1)\n  mayor('a', 'z')        T = char    a:char b:char  ->  devuelve char  ('z')\n  mayor(\"ana\", \"luis\")   T = &str    a:&str b:&str  ->  devuelve &str  (\"luis\")\n\n  mayor(8, 'z')          ERROR: 8 es i32 y 'z' es char -> dos tipos para UN solo T\n\n\nEL BOUND NO ES ADORNO. Mira qué pasa SIN él:\n\n  fn mayor<T>(a: T, b: T) -> T {   // <- sin \": PartialOrd\"\n      if a >= b { a } else { b }   // <- aquí usas >=\n  }                                //    pero T es una CAJA NEGRA:\n                                   //    el compilador no sabe si T sabe comparar.\n  Resultado:  error[E0369]: binary operation `>=` cannot be applied to type `T`\n\n  fn mayor<T: PartialOrd>(a: T, b: T) -> T {   // <- CON el bound\n      if a >= b { a } else { b }               //    >= permitido: T promete saber comparar\n  }                                            //    compila ✅",
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: '**Error del compilador:**\n```\nerror[E0369]: binary operation `>=` cannot be applied to type `T`\n --> src/main.rs:2:10\n  |\n2 |     if a >= b { a } else { b }\n  |        - ^^ - T\n  |\nhelp: consider restricting type parameter `T`\n  |\n1 | fn mayor<T: std::cmp::PartialOrd>(a: T, b: T) -> T {\n  |           ++++++++++++++++++++++\n```\nSin el bound, `T` es una caja negra: Rust no sabe si se puede comparar. El bound `T: PartialOrd` es una **promesa verificada**: "solo acepto tipos comparables". Fíjate que el compilador incluso te sugiere el arreglo exacto.',
				},
				{
					type: "text",
					body: 'Esta es una diferencia clave con lenguajes dinámicos: en Python escribirías `def mayor(a, b)` y el error de "esto no se puede comparar" explotaría **en producción**, cuando alguien pase algo raro. En Rust, la función declara qué necesita de sus tipos, y el compilador lo verifica **antes de ejecutar nada**.\n\n## Monomorphization: por qué no cuesta nada\n\n¿Qué hace el compilador con `mayor<T>`? Por cada tipo con el que la llamas, **genera una versión especializada**, como si tú hubieras escrito `mayor_i32`, `mayor_f64` y `mayor_char` a mano. Este proceso se llama **monomorphization** ("hacer monomorfo": de muchas formas a una forma concreta).\n\nLa consecuencia importante: el código genérico corre **exactamente igual de rápido** que el duplicado a mano. No hay chequeos en ejecución, no hay indirección, no hay costo oculto. Es el mismo principio de ownership: el trabajo pesado lo hace el compilador, no tu programa.',
				},
				{
					type: "text",
					body: "## Generics en structs y enums\n\nLos tipos también pueden tener huecos de tipo. De hecho, llevas dos módulos usándolos:\n\n- `Vec<T>` — una lista de T. `Vec<i32>`, `Vec<String>`, `Vec<Vec<f64>>`…\n- `Option<T>` — quizás un T: `Some(T)` o `None`.\n- `Result<T, E>` — **dos** parámetros: éxito con T o error con E.\n- `HashMap<K, V>` — claves K, valores V.\n\nDefinir el tuyo usa la misma sintaxis:",
				},
				{
					type: "code",
					language: "rust",
					code: '// Un par de valores del MISMO tipo T.\nstruct Par<T> {\n    primero: T,\n    segundo: T,\n}\n\n// Un punto donde x e y pueden ser tipos DISTINTOS.\nstruct Punto<X, Y> {\n    x: X,\n    y: Y,\n}\n\nfn main() {\n    let enteros = Par { primero: 1, segundo: 2 };\n    let textos = Par { primero: "a", segundo: "b" };\n\n    let mixto = Punto { x: 5, y: 1.5 };  // X = i32, Y = f64\n\n    println!("{} {} | {} {} | ({}, {})",\n        enteros.primero, enteros.segundo,\n        textos.primero, textos.segundo,\n        mixto.x, mixto.y);\n}',
					runnable: true,
				},
				{
					type: "quiz",
					question:
						"¿Qué hace el compilador cuando llamas a `mayor<T>` con un `i32` y luego con un `char`?",
					options: [
						{
							text: "Genera dos versiones especializadas de la función, una por tipo (monomorphization)",
							correct: true,
						},
						{
							text: "Usa una sola versión que decide el tipo en tiempo de ejecución",
							correct: false,
						},
						{
							text: "Convierte ambos valores a un tipo universal",
							correct: false,
						},
						{
							text: "Guarda los valores en el heap para tratarlos igual",
							correct: false,
						},
					],
					explanation:
						'Monomorphization: el compilador estampa una copia concreta del "molde" por cada tipo usado, como si las hubieras escrito a mano. Por eso los generics de Rust tienen **costo cero en ejecución** — todo se decide al compilar, nada en runtime.',
				},
				{
					type: "quiz",
					question:
						"¿Para qué sirve escribir `T: PartialOrd` en `fn mayor<T: PartialOrd>(…)`?",
					options: [
						{
							text: "Promete al compilador que T se podrá comparar con >, <, >= — sin esa garantía, `a >= b` no compila",
							correct: true,
						},
						{
							text: "Hace que la función sea más rápida al comparar",
							correct: false,
						},
						{
							text: "Convierte T en un número automáticamente",
							correct: false,
						},
						{
							text: "Es opcional: solo documenta la intención",
							correct: false,
						},
					],
					explanation:
						'Un bound es un **requisito de capacidad**: "acepto cualquier T que sepa compararse". Sin él, T es una caja negra y el compilador rechaza `a >= b` (error E0369), porque no todo tipo tiene un orden definido. No es documentación: es un contrato verificado.',
				},
				{
					type: "faded-exercise",
					conceptId: "m06-generic-primero",
					title: "🟢 Guiado: una función para i32, f64, &str… a la vez",
					intro:
						"Vas a escribir `primero`, una función que devuelve una referencia al primer elemento de un slice de CUALQUIER tipo. El truco mental: la misma función servirá para `&[i32]`, `&[f64]`, `&[&str]`, `&[char]`… porque es genérica sobre `T`.\n\nEscenario real: en un log mezclas listas de IDs (`i32`), de precios (`f64`) y de nombres (`&str`). No quieres tres funciones `primer_id`, `primer_precio`, `primer_nombre` — quieres UNA. Observa, completa, hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** Aquí NO hace falta bound: solo vamos a *devolver* una referencia al primer elemento, no a compararlo ni copiarlo, así que `T` puede ser cualquier tipo. Devolvemos `Option<&T>` porque el slice puede estar vacío (`None`) — el mismo modelo honesto de m04. `items.first()` ya hace justo esto; lo escribimos a mano para ver la firma genérica. Fíjate: `<T>` sin `: nada`, y el retorno es `&T` (una referencia prestada al elemento que vive dentro del slice).",
							code: "fn primero<T>(items: &[T]) -> Option<&T> {\n    if items.is_empty() {\n        return None;\n    }\n    Some(&items[0])\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** Misma idea, pero ahora `ultimo`. Rellena los tres `___`: el **parámetro de tipo** entre `<>`, el **tipo de retorno** (una referencia opcional a `T`), y el **índice** del último elemento (pista: `items.len() - 1`, seguro porque ya descartaste el vacío arriba).",
							code: "fn ultimo<___>(items: &[T]) -> ___ {\n    if items.is_empty() {\n        return None;\n    }\n    Some(&items[items.len() - ___])\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `primero` completa desde cero: genérica sobre `T`, recibe `&[T]`, devuelve `Option<&T>` (`None` si está vacío, si no `Some(&primer_elemento)`). Sin bounds: no comparas ni copias, solo prestas una referencia.",
							code: "fn primero<T>(items: &[T]) -> Option<&T> {\n    // tu código aquí\n}",
						},
					],
					tests:
						"fn main() {\n    assert_eq!(primero(&[10, 20, 30]), Some(&10));\n    assert_eq!(primero(&[3.5, 1.2]), Some(&3.5));\n    assert_eq!(primero(&[\"ana\", \"luis\"]), Some(&\"ana\"));\n    assert_eq!(primero::<i32>(&[]), None);\n    assert_eq!(primero(&['r', 'u', 's', 't']), Some(&'r'));\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
					solution:
						"fn primero<T>(items: &[T]) -> Option<&T> {\n    if items.is_empty() {\n        return None;\n    }\n    Some(&items[0])\n}",
				},
				{
					type: "exercise",
					title: "El mínimo de cualquier lista comparable",
					language: "rust",
					prompt:
						"Escribe `minimo<T>` que reciba un slice `&[T]` y devuelva `Option<T>` con el menor elemento (o `None` si el slice está vacío — fíjate que `Option` ya te obliga a modelar ese caso, como aprendiste en m04).\n\nNecesitarás DOS bounds:\n- `PartialOrd` para poder comparar con `<`.\n- `Copy` para poder sacar el valor del slice sin pelearte con el ownership (los elementos se copian, como los números de m03).\n\nLos bounds se combinan con `+`: `<T: PartialOrd + Copy>`.",
					starterCode:
						"fn minimo<T: PartialOrd + Copy>(items: &[T]) -> Option<T> {\n    // 1. si está vacío → None\n    // 2. arranca con el primero y recorre comparando\n    todo!()\n}\n\nfn main() {\n    assert_eq!(minimo(&[3, 1, 4]), Some(1));\n    assert_eq!(minimo(&[2.5, 0.5, 9.0]), Some(0.5));\n    assert_eq!(minimo(&['x', 'a', 'm']), Some('a'));\n    assert_eq!(minimo::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
					solution:
						"fn minimo<T: PartialOrd + Copy>(items: &[T]) -> Option<T> {\n    if items.is_empty() {\n        return None;\n    }\n    let mut min = items[0];\n    for &item in &items[1..] {\n        if item < min {\n            min = item;\n        }\n    }\n    Some(min)\n}\n\nfn main() {\n    assert_eq!(minimo(&[3, 1, 4]), Some(1));\n    assert_eq!(minimo(&[2.5, 0.5, 9.0]), Some(0.5));\n    assert_eq!(minimo(&['x', 'a', 'm']), Some('a'));\n    assert_eq!(minimo::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
					hints: [
						"Maneja primero el caso vacío: `if items.is_empty() { return None; }`. Después de eso, `items[0]` es seguro.",
						"Como T es `Copy`, `let mut min = items[0];` copia el valor (no lo mueve). Recorre el resto con `for &item in &items[1..]`.",
						"El patrón `&item` en el `for` des-referencia automáticamente: `item` es un `T`, no un `&T`. Compara con `if item < min` y actualiza.",
					],
					explanation:
						'**Lo que practicaste:** combinar bounds con `+`. Cada bound desbloquea operaciones concretas: `PartialOrd` te dio `<`; `Copy` te dejó sacar valores del slice sin clonar ni pelear con referencias.\n\n**Dato del mundo real:** la librería estándar ya tiene esto: `items.iter().min()` (requiere `Ord`). Lo escribiste a mano para entender qué hay debajo — en código real usarías el iterador, como aprendiste en m05.\n\n**Pregunta para masticar:** ¿por qué `minimo::<i32>(&[])` necesita el `::<i32>` (el "turbofish")? Porque con un slice vacío Rust no tiene NINGÚN valor del que inferir T — se lo tienes que decir tú. Con `&[3, 1, 4]` nunca hizo falta.',
				},
			],
		},
		{
			id: "m06_l02",
			moduleId: "m06",
			moduleSlug: "m06_traits_generics",
			order: 2,
			title: "Traits: definir comportamiento compartido",
			blocks: [
				{
					type: "first-principles",
					title: "Un trait responde: ¿qué sabe HACER este tipo?",
					problem:
						'Los structs y enums definen qué datos TIENE un tipo. Pero muchas funciones no necesitan saber qué datos tiene algo — solo qué sabe hacer: "¿se puede imprimir?", "¿se puede comparar?", "¿sabe calcular su área?".',
					mentalModel:
						'Un trait es un contrato de capacidades, como un carnet: "quien tenga el carnet de conducir sabe conducir". No importa si eres alto o bajo (tus datos); importa que aprobaste el examen (implementaste los métodos).',
					concreteExample:
						'`PartialOrd`, que usaste en la lección anterior, es un trait: el contrato "sé compararme". Los `i32` lo firman, los `char` lo firman… y por eso `mayor<T: PartialOrd>` los acepta a todos.',
					remember:
						"Struct/enum = qué datos tengo. Trait = qué sé hacer. Las funciones genéricas piden capacidades, no tipos concretos.",
				},
				{
					type: "challenge",
					conceptId: "m06-trait-impl",
					title: "Antes de leer: dos tipos, un mismo contrato",
					prompt:
						'**Tu reto:** te damos un trait `Saluda` (el contrato) y dos structs muy distintos. Completa las dos implementaciones para que cada tipo cumpla el contrato a su manera:\n\n- `Robot` debe saludar con `"BEEP BOOP unidad {id}"`\n- `Humano` debe saludar con `"Hola, soy {nombre}"`\n\nLa sintaxis `impl Saluda for Robot` ya está puesta — tú escribe los cuerpos de los métodos. `format!` (de m05) es tu amigo.',
					starterCode:
						'trait Saluda {\n    fn saludar(&self) -> String;\n}\n\nstruct Robot {\n    id: u32,\n}\n\nstruct Humano {\n    nombre: String,\n}\n\nimpl Saluda for Robot {\n    // fn saludar → "BEEP BOOP unidad {id}"\n    \n}\n\nimpl Saluda for Humano {\n    // fn saludar → "Hola, soy {nombre}"\n    \n}',
					tests:
						'fn main() {\n    let r = Robot { id: 7 };\n    let h = Humano { nombre: String::from("Ana") };\n    assert_eq!(r.saludar(), "BEEP BOOP unidad 7");\n    assert_eq!(h.saludar(), "Hola, soy Ana");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'trait Saluda {\n    fn saludar(&self) -> String;\n}\n\nstruct Robot {\n    id: u32,\n}\n\nstruct Humano {\n    nombre: String,\n}\n\nimpl Saluda for Robot {\n    fn saludar(&self) -> String {\n        format!("BEEP BOOP unidad {}", self.id)\n    }\n}\n\nimpl Saluda for Humano {\n    fn saludar(&self) -> String {\n        format!("Hola, soy {}", self.nombre)\n    }\n}',
					hints: [
						"Dentro de cada `impl`, copia la firma del trait (`fn saludar(&self) -> String`) y escribe el cuerpo. La firma debe coincidir EXACTAMENTE con la del trait.",
						"Accede a los campos con `self.id` y `self.nombre`, como en los métodos de m04.",
						'`format!("BEEP BOOP unidad {}", self.id)` construye el `String`. Recuerda: sin `;` al final para devolverlo.',
					],
					reveal:
						'Acabas de implementar tu primer trait. Mira lo que pasó:\n\n```rust\ntrait Saluda {\n    fn saludar(&self) -> String;  // el contrato: firma SIN cuerpo\n}\n\nimpl Saluda for Robot { /* SU manera de cumplirlo */ }\nimpl Saluda for Humano { /* OTRA manera de cumplirlo */ }\n```\n\nDos tipos con datos completamente distintos (`u32` vs `String`) ahora comparten una **capacidad común**. Cualquier función puede pedir "algo que salude" sin importarle si es robot o humano:\n\n```rust\nfn presentar<T: Saluda>(quien: &T) {\n    println!("{}", quien.saludar());\n}\n```\n\n¿Reconoces el patrón? Es el mismo `T: PartialOrd` de la lección pasada — solo que ahora el trait lo definiste TÚ. 👇',
				},
				{
					type: "text",
					body: "## Anatomía de un trait\n\nUn **trait** define un conjunto de métodos que un tipo se compromete a tener. Es parecido a una *interface* de Java/TypeScript o a un *protocol* de Swift, con una diferencia importante: puedes implementar traits **para tipos que no escribiste tú** (por ejemplo, darle tu trait a `i32`).\n\n```rust\ntrait Saluda {\n    fn saludar(&self) -> String;   // solo la firma: cada tipo pone el cuerpo\n}\n```\n\nLa implementación une un trait con un tipo: `impl TRAIT for TIPO`. Dentro van los cuerpos de los métodos exigidos.\n\n## Métodos por defecto: el contrato con regalo incluido\n\nUn trait puede traer métodos **ya implementados**. Los tipos los heredan gratis, y pueden sobreescribirlos si quieren algo distinto:",
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: `impl Saluda for Robot`\n\nVamos a abrirla despacio, porque mezcla TRES ideas en cinco palabras y casi nadie te la desarma:\n\n```rust\nimpl Saluda for Robot {\n    fn saludar(&self) -> String { /* … */ }\n}\n```\n\nLéela como una frase de tres partes:\n\n- **`impl`** — "voy a implementar / a rellenar algo". Es la misma palabra de los métodos de m04 (`impl Robot { … }`), pero ahora con un añadido.\n- **`Saluda`** — *qué contrato* estoy cumpliendo. No es el tipo: es el **trait**, la lista de métodos que prometo tener.\n- **`for Robot`** — *para qué tipo* lo cumplo. El `for` aquí NO es un bucle; se lee "para". "Implemento el contrato Saluda **para** el tipo Robot".\n\nUna comparación que ya conoces: en m04 escribías `impl Robot { … }` para colgarle métodos propios a `Robot`. Ahora `impl Saluda for Robot { … }` cuelga métodos **exigidos por un contrato externo**. La diferencia es solo el `Trait for` en medio:\n\n```text\nimpl Robot          { … }   ← "métodos sueltos de Robot"   (m04)\nimpl Saluda for Robot { … }   ← "Robot cumpliendo el contrato Saluda"  (ahora)\n```\n\nY dentro, la firma del método tiene que **calcar** la del trait. Si el trait dice `fn saludar(&self) -> String;`, tu bloque escribe EXACTAMENTE `fn saludar(&self) -> String { … }` — mismo nombre, mismo `&self`, mismo tipo de retorno. Cambiar cualquier pieza es un error de compilación: "esto no es el método que el contrato pedía".',
				},
				{
					type: "code",
					language: "text",
					code: 'Desglose pieza por pieza de:   impl Saluda for Robot { fn saludar(&self) -> String { … } }\n\n  impl                         palabra clave: "voy a rellenar una implementación"\n  └─ Saluda                    el TRAIT (el contrato). Tipo de cosa: trait, no struct\n     └─ for Robot              el TIPO concreto que firma el contrato. "for" = "para"\n        └─ fn saludar          el método EXIGIDO por el trait. El nombre debe coincidir\n           ├─ (&self)          recibe el Robot prestado (no lo consume) — como en m04\n           └─ -> String        devuelve un String — DEBE coincidir con el trait\n\nQué tipo es cada nombre, paso a paso:\n\n  trait Saluda { fn saludar(&self) -> String; }   Saluda  : un contrato (0 cuerpos)\n  struct Robot { id: u32 }                         Robot   : un tipo con datos\n  impl Saluda for Robot { … }                      el puente: Robot AHORA cumple Saluda\n\nVerificación que hace el compilador al ver el impl:\n\n  ¿El trait Saluda exige  fn saludar(&self) -> String ?   sí\n  ¿El impl provee         fn saludar(&self) -> String ?   sí  → ✔ firmas calzan\n  ¿Falta algún método del contrato?                       no  → ✔ contrato completo\n\n  Resultado: el tipo Robot queda "sellado" como Saluda.\n  A partir de aquí, cualquier  <T: Saluda>  acepta un Robot.\n\nError típico si te equivocas en la firma:\n\n  // trait dice -> String, pero el impl escribió -> u32\n  error[E0053]: method `saludar` has an incompatible type for trait\n  note: expected signature `fn(&Robot) -> String`\n           found signature `fn(&Robot) -> u32`',
					runnable: false,
				},
				{
					type: "code",
					language: "rust",
					code: 'trait Notificador {\n    // Obligatorio: cada tipo dice cuál es su mensaje.\n    fn mensaje(&self) -> String;\n\n    // Por defecto: definido en términos del anterior. Gratis para todos.\n    fn notificar(&self) -> String {\n        format!("[AVISO] {}", self.mensaje())\n    }\n}\n\nstruct Email {\n    asunto: String,\n}\n\nstruct Sms;\n\nimpl Notificador for Email {\n    fn mensaje(&self) -> String {\n        format!("Email: {}", self.asunto)\n    }\n    // notificar() no se escribe: Email usa el default\n}\n\nimpl Notificador for Sms {\n    fn mensaje(&self) -> String {\n        String::from("SMS recibido")\n    }\n\n    // Sms SÍ personaliza la notificación:\n    fn notificar(&self) -> String {\n        format!("[URGENTE] {}", self.mensaje())\n    }\n}\n\nfn main() {\n    let e = Email { asunto: String::from("Bienvenido") };\n    let s = Sms;\n    println!("{}", e.notificar());  // usa el default\n    println!("{}", s.notificar());  // usa el personalizado\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "tip",
					body: "**Patrón profesional:** define lo mínimo obligatorio y regala lo demás como defaults. El trait `Iterator` de la librería estándar exige UN solo método (`next`)… y te regala más de 70 métodos default (`map`, `filter`, `sum`…). Por eso implementar `Iterator` para tu tipo desbloquea todo el arsenal de m05 de golpe.",
				},
				{
					type: "faded-exercise",
					conceptId: "m06-trait-describible",
					title: "🟢 Guiado: tipos que saben describirse",
					intro:
						'Escenario real: en un panel de administración quieres una línea de resumen de cada entidad — un usuario, un producto — para mostrarla en una tabla o en un log. Cada tipo guarda datos distintos, pero todos deben saber **describirse** en una sola frase.\n\nEse "todos saben describirse" es justo un trait. Vamos a definir `Describible` y a implementarlo para dos tipos, en tres pasos: observa uno hecho, completa el siguiente, y escribe el último tú solo. El trait trae un método por defecto `resumen()` que NO tocarás — lo heredas gratis.',
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** Definimos el contrato `Describible` con un método obligatorio (`describir`) y uno por defecto (`resumen`, construido sobre el primero). Luego lo implementamos para `Usuario`: fíjate en `impl Describible for Usuario` y en cómo la firma de `describir` calca EXACTAMENTE la del trait (`&self -> String`). `resumen()` no se escribe: viene del default.",
							code: 'trait Describible {\n    // Obligatorio: cada tipo decide su propia frase.\n    fn describir(&self) -> String;\n\n    // Por defecto: prefija la descripción. Gratis para todos los tipos.\n    fn resumen(&self) -> String {\n        format!("· {}", self.describir())\n    }\n}\n\nstruct Usuario {\n    nombre: String,\n    edad: u32,\n}\n\nimpl Describible for Usuario {\n    fn describir(&self) -> String {\n        format!("{} ({} años)", self.nombre, self.edad)\n    }\n}',
						},
						{
							kind: "faded",
							instructions:
								'**Paso 2 — completa.** Ahora `Producto` firma el MISMO contrato a su manera. Rellena los cuatro `___`: el **trait** que se implementa, el **tipo** para el que se implementa, la **firma** del método obligatorio (calca la del trait) y el cuerpo con `format!`. Formato esperado: `"Teclado (stock: 12)"` (nombre, espacio, `(stock: `, el número, `)`).',
							code: 'struct Producto {\n    nombre: String,\n    stock: u32,\n}\n\nimpl ___ for ___ {\n    fn ___(&self) -> String {\n        format!("{} (stock: {})", ___, self.stock)\n    }\n}',
						},
						{
							kind: "solo",
							instructions:
								'**Paso 3 — tú solo.** Escribe la implementación completa de `Describible` para `Producto` desde cero: el bloque `impl … for …`, la firma exacta del método obligatorio y el cuerpo que produce `"Teclado (stock: 12)"`. No reimplementes `resumen`: déjalo heredar del default.',
							code: "// impl Describible for Producto { … }\n",
						},
					],
					tests:
						'fn main() {\n    let u = Usuario { nombre: String::from("Ana"), edad: 30 };\n    let p = Producto { nombre: String::from("Teclado"), stock: 12 };\n\n    // describir(): la frase propia de cada tipo\n    assert_eq!(u.describir(), "Ana (30 años)");\n    assert_eq!(p.describir(), "Teclado (stock: 12)");\n\n    // resumen(): método POR DEFECTO heredado del trait, igual para ambos\n    assert_eq!(u.resumen(), "· Ana (30 años)");\n    assert_eq!(p.resumen(), "· Teclado (stock: 12)");\n\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'trait Describible {\n    fn describir(&self) -> String;\n\n    fn resumen(&self) -> String {\n        format!("· {}", self.describir())\n    }\n}\n\nstruct Usuario {\n    nombre: String,\n    edad: u32,\n}\n\nstruct Producto {\n    nombre: String,\n    stock: u32,\n}\n\nimpl Describible for Usuario {\n    fn describir(&self) -> String {\n        format!("{} ({} años)", self.nombre, self.edad)\n    }\n}\n\nimpl Describible for Producto {\n    fn describir(&self) -> String {\n        format!("{} (stock: {})", self.nombre, self.stock)\n    }\n}\n\nfn main() {\n    let u = Usuario { nombre: String::from("Ana"), edad: 30 };\n    let p = Producto { nombre: String::from("Teclado"), stock: 12 };\n\n    assert_eq!(u.describir(), "Ana (30 años)");\n    assert_eq!(p.describir(), "Teclado (stock: 12)");\n    assert_eq!(u.resumen(), "· Ana (30 años)");\n    assert_eq!(p.resumen(), "· Teclado (stock: 12)");\n\n    println!("__ALL_TESTS_PASSED__");\n}',
				},
				{
					type: "text",
					body: "## Usar el trait en funciones genéricas\n\nAquí se conecta todo: un trait que defines + un bound en una función genérica = código que funciona para **cualquier tipo que cumpla tu contrato**, presente o futuro:",
				},
				{
					type: "code",
					language: "rust",
					code: 'trait Saluda {\n    fn saludar(&self) -> String;\n}\n\nstruct Robot { id: u32 }\nstruct Humano { nombre: String }\n\nimpl Saluda for Robot {\n    fn saludar(&self) -> String {\n        format!("BEEP BOOP unidad {}", self.id)\n    }\n}\n\nimpl Saluda for Humano {\n    fn saludar(&self) -> String {\n        format!("Hola, soy {}", self.nombre)\n    }\n}\n\n// Esta función no sabe NADA de robots ni humanos.\n// Solo pide: "dame algo que sepa saludar".\nfn dar_bienvenida<T: Saluda>(quien: &T) {\n    println!("🎉 {}", quien.saludar());\n}\n\nfn main() {\n    let r = Robot { id: 7 };\n    let h = Humano { nombre: String::from("Ana") };\n\n    dar_bienvenida(&r);\n    dar_bienvenida(&h);\n\n    // Mañana creas `struct Alien` con `impl Saluda for Alien`\n    // y dar_bienvenida lo acepta SIN CAMBIAR una línea.\n}',
					runnable: true,
				},
				{
					type: "quiz",
					question:
						"¿Cuál es la diferencia fundamental entre un struct y un trait?",
					options: [
						{
							text: "El struct define qué datos tiene un tipo; el trait define qué comportamiento puede compartir con otros tipos",
							correct: true,
						},
						{
							text: "El trait es la versión moderna del struct",
							correct: false,
						},
						{
							text: "Los structs son para datos grandes y los traits para datos pequeños",
							correct: false,
						},
						{
							text: "No hay diferencia: ambos agrupan funciones",
							correct: false,
						},
					],
					explanation:
						'Son ejes distintos: el struct/enum modela los **datos** (`Robot` tiene un `id`); el trait modela una **capacidad** (`Saluda` = "sé presentarme"). Tipos con datos totalmente diferentes pueden compartir el mismo trait — y eso es lo que permite que una función acepte a todos.',
				},
				{
					type: "quiz",
					question:
						"Si un trait tiene un método con implementación por defecto, ¿qué pasa con los tipos que lo implementan?",
					options: [
						{
							text: "Lo reciben gratis, y pueden sobreescribirlo si necesitan un comportamiento propio",
							correct: true,
						},
						{
							text: "Están obligados a reescribirlo siempre",
							correct: false,
						},
						{
							text: "No pueden modificarlo nunca",
							correct: false,
						},
						{
							text: "Solo funciona si el tipo es un struct",
							correct: false,
						},
					],
					explanation:
						'Los defaults son el "regalo" del contrato: implementas lo mínimo obligatorio (`mensaje`) y heredas el resto (`notificar`). Si un tipo necesita algo especial — como el `[URGENTE]` del SMS — lo sobreescribe y listo. Así `Iterator` te regala `map` y `filter` implementando solo `next`.',
				},
				{
					type: "exercise",
					title: "Figuras que conocen su área",
					language: "rust",
					prompt:
						"Modela un mini-sistema de figuras geométricas:\n\n1. Define las implementaciones de `area()` para `Rectangulo` (ancho × alto) y `Circulo` (π × radio²; usa `std::f64::consts::PI`).\n2. El trait ya trae `describir()` por defecto — NO lo reimplementes: compruébalo gratis.\n\nEl `main` con los asserts ya está escrito: tu trabajo son solo los dos `impl`.",
					starterCode:
						'trait Figura {\n    fn area(&self) -> f64;\n\n    // Método default: lo heredan ambas figuras.\n    fn describir(&self) -> String {\n        format!("figura con área {:.2}", self.area())\n    }\n}\n\nstruct Rectangulo {\n    ancho: f64,\n    alto: f64,\n}\n\nstruct Circulo {\n    radio: f64,\n}\n\n// TODO: impl Figura for Rectangulo\n\n// TODO: impl Figura for Circulo\n\nfn main() {\n    let r = Rectangulo { ancho: 3.0, alto: 4.0 };\n    let c = Circulo { radio: 2.0 };\n\n    assert_eq!(r.area(), 12.0);\n    assert!((c.area() - 12.566370614359172).abs() < 1e-9);\n    assert_eq!(r.describir(), "figura con área 12.00");\n    assert_eq!(c.describir(), "figura con área 12.57");\n    println!("Todo OK ✅");\n}',
					solution:
						'trait Figura {\n    fn area(&self) -> f64;\n\n    // Método default: lo heredan ambas figuras.\n    fn describir(&self) -> String {\n        format!("figura con área {:.2}", self.area())\n    }\n}\n\nstruct Rectangulo {\n    ancho: f64,\n    alto: f64,\n}\n\nstruct Circulo {\n    radio: f64,\n}\n\nimpl Figura for Rectangulo {\n    fn area(&self) -> f64 {\n        self.ancho * self.alto\n    }\n}\n\nimpl Figura for Circulo {\n    fn area(&self) -> f64 {\n        std::f64::consts::PI * self.radio * self.radio\n    }\n}\n\nfn main() {\n    let r = Rectangulo { ancho: 3.0, alto: 4.0 };\n    let c = Circulo { radio: 2.0 };\n\n    assert_eq!(r.area(), 12.0);\n    assert!((c.area() - 12.566370614359172).abs() < 1e-9);\n    assert_eq!(r.describir(), "figura con área 12.00");\n    assert_eq!(c.describir(), "figura con área 12.57");\n    println!("Todo OK ✅");\n}',
					hints: [
						"Cada `impl Figura for Tipo { … }` solo necesita el método `area` — `describir` viene gratis del default.",
						"Para el círculo: `std::f64::consts::PI * self.radio * self.radio`. La constante PI de la librería estándar es más precisa que escribir 3.1416.",
						"Si `describir()` te devuelve algo raro, NO lo implementaste tú por error, ¿verdad? El ejercicio pide heredarlo del trait.",
					],
					explanation:
						"**Lo que practicaste:** el reparto de responsabilidades de un trait — lo obligatorio (`area`, distinto por figura) y lo heredado (`describir`, escrito UNA vez en el trait y disponible para todas).\n\n**Detalle de float:** comparamos el área del círculo con `(x - esperado).abs() < 1e-9` en vez de `==`. Los `f64` acumulan errores de redondeo minúsculos; comparar flotantes con igualdad exacta es un bug clásico en cualquier lenguaje.\n\n**Siguiente paso natural:** ¿y si quiero una LISTA con rectángulos Y círculos mezclados? Con `Vec<T>` no puedes (T es UN solo tipo). Eso se resuelve en la lección 5 con `dyn Trait` — ya casi llegas.",
				},
			],
		},
		{
			id: "m06_l03",
			moduleId: "m06",
			moduleSlug: "m06_traits_generics",
			order: 3,
			title: "Trait bounds: exigir capacidades",
			blocks: [
				{
					type: "first-principles",
					title: "Bounds: pide capacidades, no tipos",
					problem:
						'Una función que recibe `i32` es rígida: solo sirve para ese tipo. Una que recibe "cualquier cosa" es imposible de compilar: Rust no sabría qué operaciones permitir. Hace falta un punto medio.',
					mentalModel:
						'Un bound es como el requisito de una oferta de trabajo: no pides "que se llame Ana" (un tipo concreto), pides "que sepa conducir" (una capacidad). Cualquier candidato con esa capacidad sirve, incluso los que aún no existen.',
					concreteExample:
						"Llevas un módulo entero usando bounds sin saberlo: `.filter(|n| n % 2 == 0)` funciona porque `filter` exige `F: FnMut(&T) -> bool` — un bound sobre el closure que le pasas.",
					remember:
						'Generics dicen "funciono con muchos tipos"; los bounds dicen "…siempre que sepan hacer ESTO".',
				},
				{
					type: "challenge",
					conceptId: "m06-fn-bound",
					title: "Antes de leer: el secreto de los iteradores",
					prompt:
						"**Tu reto:** escribe `transformar_todos` que reciba un slice de enteros y una función `f`, y devuelva un `Vec<i32>` con `f` aplicada a cada elemento.\n\nLa firma ya está: fíjate en `<F: Fn(i32) -> i32>` — un parámetro de tipo genérico… ¡para el closure! Dentro, usa lo que ya dominas de m05: `.iter()`, `.map()`, `.collect()`.",
					starterCode:
						"fn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {\n    // pista: iter → map → collect\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(transformar_todos(&[1, 2, 3], |n| n * 10), vec![10, 20, 30]);\n    assert_eq!(transformar_todos(&[5], |n| n - 5), vec![0]);\n    assert_eq!(transformar_todos(&[], |n| n + 1), Vec::<i32>::new());\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {\n    items.iter().map(|&n| f(n)).collect()\n}",
					hints: [
						"Dentro de la función, `f` se usa como cualquier función: `f(5)` devuelve un `i32`.",
						"`items.iter()` produce referencias (`&i32`). El patrón `|&n|` en el closure del map des-referencia: `n` ya es `i32`.",
						"La cadena completa: `items.iter().map(|&n| f(n)).collect()` — y `collect` sabe que debe armar un `Vec<i32>` por el tipo de retorno.",
					],
					reveal:
						'Acabas de escribir una función genérica sobre… **otra función**. Esto es exactamente lo que `map` y `filter` son por dentro:\n\n```rust\nfn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {\n    items.iter().map(|&n| f(n)).collect()\n}\n```\n\n`F` es un parámetro de tipo (como la `T` de la lección 1) y `Fn(i32) -> i32` es su **bound**: "cualquier cosa invocable que tome un i32 y devuelva un i32". Los closures de m05 cumplen ese contrato.\n\nLa revelación importante: **los bounds no son un tema nuevo** — son el mecanismo que hacía funcionar todo lo que ya usabas. `Vec<T>` es un generic; `filter` exige un bound `FnMut`; `sort` exige `Ord`. Ahora vas a verlos de frente. 👇',
				},
				{
					type: "text",
					body: "## Tres formas de escribir el mismo bound\n\nRust te da tres sintaxis. Son equivalentes — elige por legibilidad:\n\n```rust\n// 1. Inline: corta y directa (lo más común)\nfn etiqueta<T: Display>(valor: T) -> String { /* … */ }\n\n// 2. `where`: cuando hay varios genéricos o bounds largos\nfn procesar<T, U>(a: T, b: U) -> String\nwhere\n    T: Display + Clone,\n    U: Display,\n{ /* … */ }\n\n// 3. `impl Trait` en parámetros: azúcar sintáctico para casos simples\nfn etiqueta(valor: impl Display) -> String { /* … */ }\n```\n\nEl `+` combina requisitos: `T: Display + Clone` exige **ambas** capacidades.\n\n## Bounds en acción",
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: vamos a abrirla\n\nMira esta firma y no sigas hasta que cada símbolo tenga nombre:\n\n```rust\nfn formatear<T: Display + Clone>(valor: T) -> String\n```\n\nParece un jeroglífico porque mete CUATRO ideas en una línea. Vamos a separarlas, de izquierda a derecha, como quien desarma un sándwich para ver qué lleva dentro:\n\n- **`fn formatear`** — el nombre de la función. Hasta aquí, nada raro.\n- **`<T>`** — el `<…>` declara un **parámetro de tipo**. Estás diciendo "voy a usar un tipo, pero todavía no sé cuál; lo llamaré `T`". Es un hueco con nombre, igual que `a` es un hueco para un valor. Quien llame a la función decidirá qué tipo va ahí.\n- **`: Display + Clone`** — los dos puntos se leen como **"que cumpla"**. Esto es la lista de **requisitos** sobre `T`. No es UN requisito: el `+` une dos. Lee la línea entera como una frase: *"un tipo `T`, que cumpla `Display` Y `Clone`"*.\n- **`(valor: T)`** — el parámetro normal. Su tipo es `T`, el hueco que acabas de declarar. Cuando alguien llame `formatear("hola")`, `T` se vuelve `&str` aquí.\n- **`-> String`** — el tipo de retorno. Nada genérico aquí: siempre devuelve un `String`.\n\nEl orden de lectura mental que te sirve para SIEMPRE: primero el `<…>` te dice *qué huecos de tipo hay*; el `: ... + ...` te dice *qué se les exige a esos huecos*; y recién después miras los parámetros y el retorno.\n\n¿Por qué el compilador EXIGE esos bounds y no los adivina? Porque dentro del cuerpo vas a escribir `format!("{}", valor)` —eso necesita `Display`— y quizás `valor.clone()` —eso necesita `Clone`—. El compilador no permite ni una operación sobre `T` que los bounds no hayan prometido. Sin el bound, `T` es una caja sellada: podría ser cualquier cosa, incluso algo que no se sabe imprimir. El bound es el permiso por escrito.',
				},
				{
					type: "code",
					language: "text",
					code: 'DESARME de:  fn formatear<T: Display + Clone>(valor: T) -> String\n\n  fn formatear   < T : Display + Clone >   ( valor : T )   -> String\n  └─ nombre      │ │  └──────┬──────┘ │     └──┬──┘ │       └─ siempre String\n                 │ │        │         │        │   └─ su tipo es el hueco T\n                 │ │        │         │        └─ parámetro normal\n                 │ │        │         └─ cierra la lista de tipos genéricos\n                 │ │        └─ REQUISITOS de T  (el + = "y además")\n                 │ └─ ":" se lee "que cumpla"\n                 └─ "<" abre: aquí declaro huecos de tipo. El hueco se llama T.\n\nLEÍDA EN ESPAÑOL:\n  "una funcion formatear, sobre un tipo T que sepa Mostrarse (Display)\n   Y sepa Clonarse (Clone), que recibe un valor de tipo T y devuelve String"\n\n¿QUÉ ES T EN CADA LLAMADA?  (T no es un tipo: es un hueco que se rellena)\n\n  formatear("hola")    ->  T = &str    (¿&str es Display? si. ¿Clone? si.  OK compila)\n  formatear(42)        ->  T = i32     (¿i32 es Display?  si. ¿Clone? si.  OK compila)\n  formatear(3.5)       ->  T = f64     (¿f64 es Display?  si. ¿Clone? si.  OK compila)\n  formatear(vec![1,2]) ->  T = Vec<i32>(¿Vec es Display?  NO ----------->  ERROR E0277)\n                                        el compilador frena: Vec no sabe mostrarse con {}\n\nDENTRO DEL CUERPO, cada bound desbloquea EXACTAMENTE una capacidad:\n  Display  habilita ->  format!("{}", valor)   // sin este bound: error en {}\n  Clone    habilita ->  valor.clone()          // sin este bound: error en .clone()\n  (nada mas: no puedes sumar, comparar ni ordenar T; eso pediria OTROS bounds)',
					runnable: false,
				},
				{
					type: "text",
					body: '## El mismo bound, pero con `where`: por qué existe esa palabra\n\nCuando hay un solo genérico y un par de bounds, la forma inline (`<T: Display + Clone>`) es perfecta. Pero mira qué pasa cuando hay DOS tipos con varios requisitos cada uno:\n\n```rust\n// Inline: la firma se vuelve una pared ilegible 👇\nfn combinar<T: Display + Clone, U: Display + PartialOrd>(a: T, b: U) -> String\n```\n\nEl ojo se pierde: ¿dónde acaba `T` y empieza `U`? Por eso Rust ofrece la cláusula `where`, que **saca los requisitos fuera de los `<>`** y los pone en una lista limpia, debajo de la firma:\n\n```rust\nfn combinar<T, U>(a: T, b: U) -> String\nwhere\n    T: Display + Clone,\n    U: Display + PartialOrd,\n{\n    // cuerpo\n}\n```\n\nMisma información, partida en dos zonas que se leen por separado:\n\n- **`<T, U>`** declara los huecos de tipo, a secas. Aquí ya NO hay requisitos: solo los nombres. Hay DOS huecos independientes, `T` y `U`, que pueden acabar siendo tipos distintos (uno `i32`, otro `&str`, lo que sea).\n- **`where ...`** es la lista de requisitos, una línea por tipo. `T: Display + Clone` y `U: Display + PartialOrd` se leen como dos frases sueltas: *"`T` que se muestre y se clone"*, *"`U` que se muestre y se compare"*.\n\nLa coma entre `T: Display + Clone,` y `U: Display + PartialOrd` NO mezcla los dos tipos: separa requisitos de huecos distintos, como las filas de una tabla. El `+` une capacidades de UN mismo tipo; la coma salta al SIGUIENTE tipo. Esa es toda la gramática.\n\nRegla de bolsillo: un genérico y un bound cortito → inline. Dos o más genéricos, o bounds largos → `where`. Las dos formas compilan igual; `where` solo existe para que tus ojos no sufran.',
				},
				{
					type: "code",
					language: "text",
					code: 'INLINE  vs  WHERE  -- son la MISMA firma, escrita de dos maneras\n\n  ANTES (inline, todo apretado dentro de <>):\n    fn combinar<T: Display + Clone, U: Display + PartialOrd>(a: T, b: U) -> String\n\n  DESPUES (where, requisitos afuera):\n    fn combinar<T, U>(a: T, b: U) -> String\n    where\n        T: Display + Clone,      <- fila 1: todo lo que se le exige a T\n        U: Display + PartialOrd, <- fila 2: todo lo que se le exige a U\n    { ... }\n\n  Como leer cada signo:\n    <T, U>   -> declaro DOS huecos de tipo, sin requisitos todavia\n    +        -> "y ademas"  (une capacidades del MISMO tipo)\n    ,        -> "siguiente tipo" (salta de los bounds de T a los de U)\n    where    -> "...siempre que se cumpla lo de abajo"\n\nUNA LLAMADA CONCRETA:   combinar("orden #42", 99.9)\n\n  hueco   se rellena con   ¿cumple sus bounds?\n  -----   --------------   ----------------------------------------\n   T   =     &str          Display? si   Clone? si           -> OK\n   U   =     f64           Display? si   PartialOrd? si       -> OK\n  => compila. Dentro puedes hacer format!("{}", a), a.clone(), y b < otro_f64\n\nUNA LLAMADA QUE FALLA:  combinar("x", vec![1,2])\n   T = &str  -> OK\n   U = Vec<i32> -> Display? NO  ----> error[E0277]: Vec no implementa Display\n   el mensaje del compilador te senalara la fila del where que no se cumple\n\nIDEA CLAVE: T y U son INDEPENDIENTES. Pueden ser el mismo tipo o distintos.\n            Cada uno carga SOLO los bounds de su propia fila del where.',
					runnable: false,
				},
				{
					type: "code",
					language: "rust",
					code: 'use std::fmt::Display;\n\n// Display es el trait "sé mostrarme como texto para humanos".\n// Lo tienen los números, &str, String… (lo verás a fondo en la próxima lección)\nfn etiqueta<T: Display>(valor: T) -> String {\n    format!("[{}]", valor)\n}\n\n// Dos genéricos, bounds combinados, sintaxis where:\nfn par_etiquetado<A, B>(a: A, b: B) -> String\nwhere\n    A: Display,\n    B: Display,\n{\n    format!("{} → {}", a, b)\n}\n\nfn main() {\n    println!("{}", etiqueta(42));\n    println!("{}", etiqueta("rust"));\n    println!("{}", etiqueta(3.5));\n\n    println!("{}", par_etiquetado("puerto", 8080));\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "warning",
					body: "**El error que más verás esta semana:**\n```\nerror[E0277]: `MiTipo` doesn't implement `std::fmt::Display`\n```\nTraducción: pasaste un tipo a una función cuyo bound exige `Display`, y tu tipo no lo implementa (todavía). La solución nunca es pelear con la función: es implementar el trait que falta en tu tipo — o usar `{:?}` con `Debug`, que sí se deriva gratis.",
				},
				{
					type: "text",
					body: '## El mapa completo: ya estabas rodeado de bounds\n\nMira las firmas (simplificadas) de cosas que usaste en m05:\n\n```rust\n// filter: el predicado DEBE ser invocable con &T y devolver bool\nfn filter<P>(self, predicate: P) where P: FnMut(&Item) -> bool\n\n// sort: los elementos DEBEN tener orden total\nfn sort(&mut self) where T: Ord\n\n// sum: el iterador DEBE producir algo sumable\nfn sum<S>(self) -> S where S: Sum<Item>\n```\n\nCada error críptico de iteradores que hayas visto era un bound diciéndote "este tipo no sabe hacer lo que me pides". Ahora puedes leerlos: busca el `where` en el mensaje del compilador y pregunta "¿qué capacidad me falta?".',
				},
				{
					type: "faded-exercise",
					conceptId: "m06-bound-contains",
					title: "Práctica guiada: búsqueda genérica",
					intro:
						"Vamos a escribir funciones de búsqueda que funcionan para CUALQUIER tipo comparable con `==` — el bound se llama `PartialEq`. Observa, completa, y hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `posicion` busca un elemento y devuelve su índice (`Option<usize>`, como en m04: puede no estar). El bound `T: PartialEq` desbloquea el `==` de la comparación. Fíjate: compara `item == objetivo` donde ambos son referencias — Rust compara los valores apuntados.",
							code: "fn posicion<T: PartialEq>(items: &[T], objetivo: &T) -> Option<usize> {\n    for (i, item) in items.iter().enumerate() {\n        if item == objetivo {\n            return Some(i);\n        }\n    }\n    None\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** `contiene` es la prima simple de `posicion`: solo dice si el elemento está. Rellena los tres `___`: el **bound** que permite comparar, el **operador** de comparación, y el valor de retorno cuando el loop termina sin encontrar nada.",
							code: "fn contiene<T: ___>(items: &[T], objetivo: &T) -> bool {\n    for item in items {\n        if item ___ objetivo {\n            return true;\n        }\n    }\n    ___\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `contiene` completa desde cero: recibe `&[T]` y `&T`, devuelve `bool`. Recuerda qué bound necesita `==`.",
							code: "fn contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    assert!(contiene(&[1, 2, 3], &2));\n    assert!(!contiene(&[1, 2, 3], &9));\n    assert!(contiene(&["a", "b"], &"b"));\n    assert!(!contiene::<i32>(&[], &1));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool {\n    for item in items {\n        if item == objetivo {\n            return true;\n        }\n    }\n    false\n}",
				},
				{
					type: "quiz",
					question:
						"¿Qué significa la firma `fn procesar<T: Display + Clone>(valor: T)`?",
					options: [
						{
							text: "T debe cumplir AMBOS traits: saber mostrarse como texto Y saber clonarse",
							correct: true,
						},
						{
							text: "T debe cumplir al menos uno de los dos traits",
							correct: false,
						},
						{
							text: "T se convierte primero a Display y luego a Clone",
							correct: false,
						},
						{
							text: "La función devuelve un Display o un Clone",
							correct: false,
						},
					],
					explanation:
						'El `+` **suma requisitos**, no da alternativas: el tipo necesita las dos capacidades para entrar. Dentro de la función podrás usar `format!("{}", valor)` (gracias a Display) y `valor.clone()` (gracias a Clone) — ni una operación más de las que los bounds garantizan.',
				},
				{
					type: "quiz",
					question:
						"`Vec<T>` y `Option<T>`, que usas desde hace dos módulos, ¿qué son exactamente?",
					options: [
						{
							text: "Tipos genéricos de la librería estándar: el T se especializa al compilar, igual que en tus propias funciones genéricas",
							correct: true,
						},
						{
							text: "Tipos especiales del compilador que no se pueden imitar",
							correct: false,
						},
						{
							text: "Tipos dinámicos que deciden su contenido en ejecución",
							correct: false,
						},
						{
							text: "Macros que generan código",
							correct: false,
						},
					],
					explanation:
						"No tienen nada de mágico: `Vec<T>` y `Option<T>` están definidos con la MISMA sintaxis de generics que aprendiste en la lección 1 (`struct Vec<T> {…}`, `enum Option<T> {…}`). Cuando escribes `Vec<String>`, el compilador estampa la versión especializada — monomorphization otra vez.",
				},
				{
					type: "exercise",
					title: "Informe genérico: el mayor y el menor juntos",
					language: "rust",
					prompt:
						"Escribe `extremos<T>` que reciba un slice y devuelva `Option<(T, T)>`: la tupla `(menor, mayor)`, o `None` si el slice está vacío.\n\nPiensa primero: ¿qué bounds necesitas? Vas a **comparar** elementos y a **copiarlos** fuera del slice. Decláralos tú — el starter te deja los `___` en la firma.\n\nBonus mental: ¿por qué devolver `Option<(T, T)>` es mejor diseño que devolver `(T, T)` y entrar en pánico con slices vacíos? (m04 ya te dio la respuesta.)",
					starterCode:
						"fn extremos<T: ___>(items: &[T]) -> Option<(T, T)> {\n    // tu código aquí\n    todo!()\n}\n\nfn main() {\n    assert_eq!(extremos(&[3, 1, 4, 1, 5]), Some((1, 5)));\n    assert_eq!(extremos(&[7]), Some((7, 7)));\n    assert_eq!(extremos(&['m', 'a', 'x']), Some(('a', 'x')));\n    assert_eq!(extremos::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
					solution:
						"fn extremos<T: PartialOrd + Copy>(items: &[T]) -> Option<(T, T)> {\n    if items.is_empty() {\n        return None;\n    }\n    let mut menor = items[0];\n    let mut mayor = items[0];\n    for &item in &items[1..] {\n        if item < menor {\n            menor = item;\n        }\n        if item > mayor {\n            mayor = item;\n        }\n    }\n    Some((menor, mayor))\n}\n\nfn main() {\n    assert_eq!(extremos(&[3, 1, 4, 1, 5]), Some((1, 5)));\n    assert_eq!(extremos(&[7]), Some((7, 7)));\n    assert_eq!(extremos(&['m', 'a', 'x']), Some(('a', 'x')));\n    assert_eq!(extremos::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
					hints: [
						"Los bounds que faltan: `PartialOrd` (para `<` y `>`) y `Copy` (para sacar valores del slice). Se combinan con `+`.",
						"Arranca con `menor` y `mayor` apuntando ambos a `items[0]`, y recorre el resto actualizando cada uno por separado.",
						"Un slice de un solo elemento debe devolver `Some((x, x))` — tu inicialización ya lo resuelve gratis si arrancas con items[0] en ambos.",
					],
					explanation:
						'**Lo que practicaste:** decidir los bounds TÚ, leyendo tu propio código. Necesitabas `<`/`>` → `PartialOrd`; necesitabas sacar copias → `Copy`. Esa lectura — "¿qué operaciones hago sobre T?" → "¿qué traits las garantizan?" — es exactamente cómo se diseñan firmas genéricas profesionales.\n\n**Sobre el Option:** devolver `Option<(T, T)>` convierte el caso "slice vacío" en algo que el llamador DEBE manejar. La alternativa (panic) explota en producción a las 3 AM. Este es el diseño honesto de errores de m04, aplicado a APIs genéricas.',
				},
				{
					type: "exercise",
					title: "🟡 Aplica: una línea de log para cualquier par de valores",
					language: "rust",
					prompt:
						'Un sistema de logs necesita imprimir pares de valores en formato `"a y b"`, sin importar si son números, textos o decimales. Esa frase —"sin importar el tipo, siempre que se sepan mostrar"— es justo lo que un bound `Display` expresa.\n\nTu trabajo: completa la firma de `imprimir_par`. Decláralo genérico sobre un tipo `T` con el bound que permite usar `{}` en `format!` (ese trait se llama `Display`; su ruta completa es `std::fmt::Display`). Como `a` y `b` comparten el mismo `T`, ambos deben ser del MISMO tipo en cada llamada.\n\nFíjate en el desarme de arriba: `<T: std::fmt::Display>` declara el hueco `T` y le exige saber mostrarse. Dentro, `format!("{} y {}", a, b)` es legal SOLO porque ese bound está presente.',
					starterCode:
						'// Completa los ___ : el nombre del hueco y su bound (la ruta es std::fmt::Display)\nfn imprimir_par<___: ___>(a: T, b: T) -> String {\n    // devuelve "a y b" usando format!\n    todo!()\n}\n\nfn main() {\n    assert_eq!(imprimir_par(8080, 9090), "8080 y 9090");\n    assert_eq!(imprimir_par("lunes", "martes"), "lunes y martes");\n    assert_eq!(imprimir_par(3.5, 0.5), "3.5 y 0.5");\n    println!("Todo OK ✅");\n}',
					solution:
						'fn imprimir_par<T: std::fmt::Display>(a: T, b: T) -> String {\n    format!("{} y {}", a, b)\n}\n\nfn main() {\n    assert_eq!(imprimir_par(8080, 9090), "8080 y 9090");\n    assert_eq!(imprimir_par("lunes", "martes"), "lunes y martes");\n    assert_eq!(imprimir_par(3.5, 0.5), "3.5 y 0.5");\n    println!("Todo OK ✅");\n}',
					hints: [
						"El hueco se llama `T` (ya se usa así en los parámetros `a: T, b: T`), y el bound completo es `std::fmt::Display`. La firma queda `fn imprimir_par<T: std::fmt::Display>(a: T, b: T) -> String`.",
						'El cuerpo es UNA línea: `format!("{} y {}", a, b)` — sin `;` al final, para devolver el `String`. Cada `{}` usa el `Display` que el bound garantiza.',
						'Como la firma usa `a: T, b: T` (el MISMO `T`), no puedes mezclar `imprimir_par(1, "dos")` en una sola llamada: ambos argumentos deben ser del mismo tipo. Eso es correcto y esperado.',
					],
					explanation:
						'**Lo que practicaste:** declarar un bound `Display` TÚ, leyendo qué operación hace tu cuerpo (`{}` en `format!`) y eligiendo el trait que la habilita. Ese es el reflejo profesional: "¿qué hago con `T`?" → "¿qué bound me lo permite?".\n\n**Por qué `a: T, b: T` y no `a: T, b: U`:** al reusar `T` en ambos, exiges que los dos valores sean del mismo tipo. Si quisieras un número y un texto en el mismo par, necesitarías DOS genéricos: `imprimir_par<T: Display, U: Display>(a: T, b: U)` — el caso de dos huecos que viste con la cláusula `where`.\n\n**Dato del mundo real:** así nace `println!`/`format!` por dentro. Cada `{}` de una plantilla exige `Display` sobre el valor que le toca; cada `{:?}` exige `Debug`. Por eso pasar un tipo sin `Display` a `{}` da el error E0277 que verás esta semana — ahora sabes que es un bound incumplido, no un misterio.',
				},
				{
					type: "exercise",
					title:
						"🟡 Aplica: el máximo de un slice, para cualquier tipo comparable",
					language: "rust",
					prompt:
						"Un panel de monitoreo recibe lecturas (temperaturas `f64`, prioridades `i32`, niveles `char`) y necesita el VALOR MÁS ALTO de cada lote. Una sola función genérica debe servir para los tres.\n\nPiensa qué le exiges a `T`, leyendo lo que tu cuerpo va a hacer con él:\n- Vas a **comparar** elementos con `>` → eso pide el bound `PartialOrd`.\n- Vas a **sacar un valor del slice** (copiarlo a una variable `max`) sin pelearte con referencias → eso pide `Copy`.\n\nSe combinan con `+`, tal como desarmaste arriba: `<T: PartialOrd + Copy>`. Y como un slice puede venir vacío, devuelves `Option<T>` (m04: modela la ausencia, no entres en pánico).",
					starterCode:
						"// Completa el bound: ¿qué dos capacidades necesita T? (combínalas con +)\nfn maximo_de<T: ___>(items: &[T]) -> Option<T> {\n    // 1. si está vacío -> None\n    // 2. arranca con el primero y recorre quedándote con el mayor\n    todo!()\n}\n\nfn main() {\n    assert_eq!(maximo_de(&[10, 4, 7, 23, 1]), Some(23));\n    assert_eq!(maximo_de(&[3.5]), Some(3.5));\n    assert_eq!(maximo_de(&['p', 'a', 'z']), Some('z'));\n    assert_eq!(maximo_de::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
					solution:
						"fn maximo_de<T: PartialOrd + Copy>(items: &[T]) -> Option<T> {\n    if items.is_empty() {\n        return None;\n    }\n    let mut max = items[0];\n    for &item in &items[1..] {\n        if item > max {\n            max = item;\n        }\n    }\n    Some(max)\n}\n\nfn main() {\n    assert_eq!(maximo_de(&[10, 4, 7, 23, 1]), Some(23));\n    assert_eq!(maximo_de(&[3.5]), Some(3.5));\n    assert_eq!(maximo_de(&['p', 'a', 'z']), Some('z'));\n    assert_eq!(maximo_de::<i32>(&[]), None);\n    println!(\"Todo OK ✅\");\n}",
					hints: [
						"El bound completo es `T: PartialOrd + Copy`. `PartialOrd` te da el `>`; `Copy` te deja hacer `let mut max = items[0];` sin mover ni clonar.",
						"Maneja el caso vacío primero: `if items.is_empty() { return None; }`. Después de eso, `items[0]` es seguro de leer.",
						"Recorre el resto con `for &item in &items[1..]` — el patrón `&item` des-referencia, así que `item` es un `T` (no un `&T`) y puedes compararlo directo con `if item > max`. Al final, `Some(max)`.",
					],
					explanation:
						"**Lo que practicaste:** elegir DOS bounds combinados con `+` razonando desde tu propio código, exactamente el desarme de `<T: A + B>`. `PartialOrd` desbloqueó `>`; `Copy` desbloqueó sacar valores del slice. Ni una operación más de las que prometiste.\n\n**Sobre los `f64` y el assert:** aquí comparamos con `==` (vía `assert_eq!`) y funciona porque `Some(3.5)` proviene de COPIAR el mismo `3.5` del slice, sin ninguna aritmética que introduzca error de redondeo. Cuando un `f64` SÍ pasa por cálculos (como el área del círculo de la lección 2), ahí sí comparas con `(x - esperado).abs() < 1e-9`, nunca con `==`.\n\n**Por qué `maximo_de::<i32>(&[])` lleva el turbofish `::<i32>`:** con un slice vacío no hay NINGÚN elemento del que Rust infiera `T`, así que se lo dices tú. Con `&[10, 4, ...]` jamás hizo falta.\n\n**En el mundo real** usarías `items.iter().copied().max()` de la librería estándar (pide `Ord`). Escribirlo a mano fue para sentir qué bound habilita cada operación — el corazón de esta lección.",
				},
			],
		},
		{
			id: "m06_l04",
			moduleId: "m06",
			moduleSlug: "m06_traits_generics",
			order: 4,
			title: "Traits estándar y derive",
			blocks: [
				{
					type: "first-principles",
					title: "El ecosistema habla en traits estándar",
					problem:
						"Tu struct nuevo nace sin saber hacer nada: no se puede imprimir, ni comparar, ni clonar. Cada librería que uses esperará que tus tipos tengan ciertas capacidades básicas.",
					mentalModel:
						"Los traits estándar son como los enchufes universales: si tu tipo implementa `Display`, CUALQUIER código que sepa imprimir cosas (println!, format!, logs) acepta tu tipo sin conocerlo.",
					concreteExample:
						"`assert_eq!(a, b)` solo funciona si tu tipo implementa `PartialEq` (comparar) y `Debug` (mostrarse cuando falla el assert). Por eso los tests te pedían `#[derive(Debug, PartialEq)]` en m04.",
					remember:
						"Antes de escribir un método propio, pregunta: ¿existe un trait estándar para esto? Implementarlo conecta tu tipo con todo el ecosistema.",
				},
				{
					type: "challenge",
					conceptId: "m06-display",
					title: "Antes de leer: enséñale a tu tipo a imprimirse",
					prompt:
						'**Tu reto:** haz que `Temperatura` se pueda usar con `println!("{}")`. Eso exige implementar el trait `Display` de la librería estándar.\n\nLa estructura del `impl` ya está (es algo ceremoniosa) — tú solo escribe el cuerpo de `fmt` usando la macro `write!`, que funciona como `format!` pero escribe en el formateador `f`:\n\n```rust\nwrite!(f, "plantilla {}", valores)\n```\n\nFormato esperado: `23.5°C` (el número, el símbolo °, la C).',
					starterCode:
						'use std::fmt;\n\nstruct Temperatura {\n    celsius: f64,\n}\n\nimpl fmt::Display for Temperatura {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        // escribe "{...}°C" usando write!(f, ...)\n        \n    }\n}',
					tests:
						'fn main() {\n    let t = Temperatura { celsius: 23.5 };\n    assert_eq!(format!("{}", t), "23.5°C");\n    let frio = Temperatura { celsius: -5.0 };\n    assert_eq!(format!("{}", frio), "-5°C");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'use std::fmt;\n\nstruct Temperatura {\n    celsius: f64,\n}\n\nimpl fmt::Display for Temperatura {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "{}°C", self.celsius)\n    }\n}',
					hints: [
						'El cuerpo es UNA línea: `write!(f, "{}°C", self.celsius)` — sin punto y coma, porque `write!` devuelve el `fmt::Result` que la función debe retornar.',
						'Si te confunde la firma: `f` es el "papel" donde escribes, `write!` es tu "lápiz". Todo lo demás es ceremonia fija que siempre se copia igual.',
					],
					reveal:
						'Tu tipo ahora habla el idioma del ecosistema:\n\n```rust\nimpl fmt::Display for Temperatura {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "{}°C", self.celsius)\n    }\n}\n```\n\nCon ese único `impl`, `Temperatura` funciona con `println!("{}")`, `format!`, `to_string()` (¡gratis!), cualquier logger, cualquier template… **Código que jamás oyó hablar de temperaturas ahora sabe mostrarlas.**\n\nEse es el poder de los traits estándar: son contratos que TODO el ecosistema conoce. En esta lección verás los seis que usarás a diario — y el atajo `#[derive]` para no escribirlos a mano. 👇',
				},
				{
					type: "text",
					body: '## derive: implementaciones gratis\n\nPara los traits más mecánicos, Rust genera la implementación por ti con el atributo `#[derive(...)]` encima del tipo:\n\n| Trait | Te da | Lo usas en |\n|-------|-------|------------|\n| `Debug` | imprimir con `{:?}` | debugging, `assert_eq!` fallidos |\n| `Clone` | `.clone()` explícito | duplicar valores con heap |\n| `Copy` | copia implícita (tipos chicos) | structs de solo números |\n| `PartialEq` | comparar con `==` | tests, lógica de negocio |\n| `PartialOrd` | comparar con `<`, `>` | ordenar, máximos/mínimos |\n| `Default` | `Tipo::default()` | valores iniciales |\n\n¿Por qué "derivables"? Porque su lógica es mecánica: comparar structs campo a campo, clonar campo a campo… no hay decisiones de diseño que tomar.',
				},
				{
					type: "code",
					language: "rust",
					code: '#[derive(Debug, Clone, PartialEq)]\nstruct Usuario {\n    nombre: String,\n    edad: u32,\n}\n\nfn main() {\n    let a = Usuario { nombre: String::from("Ana"), edad: 30 };\n    let b = a.clone();              // Clone: copia profunda explícita\n\n    println!("{:?}", a);            // Debug: {:?} imprime la estructura\n    println!("¿Iguales? {}", a == b); // PartialEq: comparación campo a campo\n\n    // Sin los derive, las TRES líneas de arriba serían errores de compilación.\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## Abramos esa línea: `#[derive(Debug, Clone, PartialEq)]`\n\nEsta es la línea que todo el mundo copia sin entender del todo. Vamos a abrirla pieza por pieza, porque cada palabra dentro del paréntesis **es un trait distinto** y cada uno te regala una capacidad concreta.\n\nPrimero, la anatomía:\n\n- **`#[...]`** — un *atributo*: una instrucción para el compilador, no código que se ejecute. Va pegado ENCIMA del struct y habla sobre él.\n- **`derive`** — el atributo concreto que dice "genera tú, compilador, el código de estos traits por mí".\n- **`Debug, Clone, PartialEq`** — la lista de traits a generar. Cada uno escribe un `impl ... for Usuario` completo que tú nunca ves.\n\nLa clave mental: **`#[derive(X)]` es exactamente equivalente a escribir un `impl X for TuTipo` a mano** — solo que Rust lo redacta por ti porque la lógica es 100% mecánica. Ahora, ¿qué desbloquea cada uno?\n\n| Escribes en el derive | Rust genera por debajo | Y desbloquea en tu código |\n|-----------------------|------------------------|---------------------------|\n| `Debug` | `impl Debug for Usuario` que imprime campo a campo | `println!("{:?}", u)` y que `assert_eq!` muestre el valor al fallar |\n| `Clone` | `impl Clone for Usuario` que clona campo a campo | `let copia = u.clone();` (duplicado profundo y explícito) |\n| `PartialEq` | `impl PartialEq for Usuario` que compara campo a campo | `u == otro` y `u != otro` (y por tanto `assert_eq!`) |\n| `PartialOrd` | `impl PartialOrd for Usuario` que compara campo a campo, en orden | `u < otro`, `u > otro`, `.sort()` |\n\nFíjate en el patrón que se repite en la columna del medio: **"campo a campo"**. Esa es justo la razón de que estos traits sean *derivables*. Comparar dos `Usuario` es comparar su `nombre` Y su `edad`; clonar un `Usuario` es clonar su `nombre` Y su `edad`. No hay ninguna decisión de diseño que tomar — solo recorrer los campos. Por eso Rust se atreve a escribirlo por ti (y por eso `Display`, que SÍ pide decisiones, no aparece en la lista).',
				},
				{
					type: "code",
					language: "text",
					code: 'ANTES — lo que TÚ escribes (3 palabras):\n\n  #[derive(Debug, Clone, PartialEq)]\n  struct Usuario { nombre: String, edad: u32 }\n\n\nDESPUÉS — lo que el COMPILADOR genera y compila (lo que te ahorras):\n\n  impl Debug for Usuario {\n      // imprime: Usuario { nombre: "Ana", edad: 30 }\n      fn fmt(&self, f: &mut Formatter) -> Result {\n          f.debug_struct("Usuario")\n           .field("nombre", &self.nombre)   // <- campo a campo\n           .field("edad", &self.edad)\n           .finish()\n      }\n  }\n\n  impl Clone for Usuario {\n      fn clone(&self) -> Usuario {\n          Usuario {\n              nombre: self.nombre.clone(),   // <- campo a campo\n              edad: self.edad.clone(),\n          }\n      }\n  }\n\n  impl PartialEq for Usuario {\n      fn eq(&self, otro: &Usuario) -> bool {\n          self.nombre == otro.nombre        // <- campo a campo\n          && self.edad == otro.edad         //    (Y lógico: TODOS deben coincidir)\n      }\n  }\n\n\nTraza de UNA comparación con esos impl, paso a paso:\n\n  a = Usuario { nombre: "Ana", edad: 30 }\n  b = Usuario { nombre: "Ana", edad: 30 }\n\n  a == b\n   -> Usuario::eq(&a, &b)\n   -> ("Ana" == "Ana")  &&  (30 == 30)\n   -> ( true       )    &&  ( true   )\n   -> true   ✅\n\n  Cambiamos b.edad = 31:\n  a == b\n   -> ("Ana" == "Ana")  &&  (30 == 31)\n   -> ( true       )    &&  ( false  )\n   -> false  ❌   (basta UN campo distinto para que el && corte)',
					runnable: false,
				},
				{
					type: "callout",
					variant: "tip",
					body: "**Regla práctica:** casi todo struct tuyo quiere nacer con `#[derive(Debug)]` como mínimo — sin él no puedes ni inspeccionarlo al depurar ni usarlo en `assert_eq!`. Agrega `Clone` y `PartialEq` cuando los necesites. Son una línea; quítalos solo si tienes una razón concreta.",
				},
				{
					type: "text",
					body: '## ¿Por qué Display NO se puede derivar?\n\nTe habrás fijado: `Display` no está en la tabla. Es intencional. `Debug` tiene un formato mecánico obvio (`Usuario { nombre: "Ana", edad: 30 }`), pero ¿cuál es el formato "para humanos" de un Usuario? ¿`Ana`? ¿`Ana (30)`? ¿`Ana <ana@mail.com>`?\n\n**Eso es una decisión de diseño, no mecánica** — y Rust se niega a adivinarla. Si quieres `Display`, lo escribes tú, como en el challenge.\n\n## From / Into: conversiones con nombre propio\n\nEl último trait estrella de hoy: `From<T>` define "cómo construirme a partir de un T". Implementas `From` y recibes `Into` gratis (son espejos):',
				},
				{
					type: "code",
					language: "rust",
					code: 'struct Metros(f64);      // tuple struct: un struct con un campo sin nombre\nstruct Kilometros(f64);\n\nimpl From<Kilometros> for Metros {\n    fn from(km: Kilometros) -> Self {\n        Metros(km.0 * 1000.0)   // .0 accede al primer campo del tuple struct\n    }\n}\n\nfn main() {\n    // Dos formas de usar la MISMA conversión:\n    let a = Metros::from(Kilometros(2.5));\n    let b: Metros = Kilometros(1.2).into();  // into() infiere el destino\n\n    println!("{} m", a.0);\n    println!("{} m", b.0);\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: '**¿Te suena `String::from("hola")`?** Llevas usándolo desde m02: es exactamente este trait — `String` implementa `From<&str>`. Y el operador `?` de m04 usa `From` por debajo para convertir errores de un tipo a otro automáticamente. Las piezas se conectan.',
				},
				{
					type: "faded-exercise",
					conceptId: "m06-derive-version",
					title: "🟢 Guiado: una `Version` que se compara sola",
					intro:
						'Escenario real: tu programa maneja versiones de software (`1.4.0`, `2.0.0`, …) y necesitas preguntarte cosas como "¿la versión instalada es MENOR que la disponible?" para decidir si actualizar. Vas a definir el struct `Version` y derivarle SOLO los traits que esa pregunta exige: `Debug` (para inspeccionar e imprimir en asserts), `Clone` (para duplicar sin mover), `PartialEq` (para `==`/`!=`) y `PartialOrd` (para `<`/`>`). Observa, completa, y hazlo solo. Recuerda del desarme: `PartialOrd` compara campo a campo EN ORDEN — primero `mayor`, y solo si empata mira `menor`, luego `parche`; igual que ordenas números de versión a mano.',
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** Aquí está el struct ya derivado. Lee el `#[derive(...)]` como cuatro capacidades que le acabas de regalar al tipo. Con `PartialEq` puedes usar `==`; con `PartialOrd`, `<` y `>`. Y como `PartialOrd` compara los campos en el orden en que están declarados, poner `mayor` primero es lo que hace que `1.9.0 < 2.0.0` dé `true` (gana el `mayor`, ni mira el resto).",
							code: '#[derive(Debug, Clone, PartialEq, PartialOrd)]\nstruct Version {\n    mayor: u32,\n    menor: u32,\n    parche: u32,\n}\n\nfn main() {\n    let instalada = Version { mayor: 1, menor: 4, parche: 0 };\n    let disponible = Version { mayor: 1, menor: 4, parche: 2 };\n\n    // PartialOrd: compara mayor, luego menor, luego parche\n    println!("¿hay update? {}", instalada < disponible); // true (0 < 2 en parche)\n}',
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** Rellena los `___`. En el derive faltan dos traits: el que habilita `==`/`!=` y el que habilita `<`/`>` (mira qué operadores usa el `main`). En el cuerpo, `clonada` debe ser una copia de `instalada` usando el método que te dio `Clone`.",
							code: "#[derive(Debug, Clone, ___, ___)]\nstruct Version {\n    mayor: u32,\n    menor: u32,\n    parche: u32,\n}\n\nfn main() {\n    let instalada = Version { mayor: 1, menor: 4, parche: 0 };\n    let clonada = instalada.___;          // duplicado explícito\n    let nueva = Version { mayor: 2, menor: 0, parche: 0 };\n\n    assert_eq!(instalada, clonada);       // ==  (PartialEq)\n    assert!(nueva > instalada);           // >   (PartialOrd)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe el struct `Version` COMPLETO desde cero: los tres campos `u32` (`mayor`, `menor`, `parche`) y el `#[derive(...)]` con los CUATRO traits que el bloque de tests necesita para imprimir (`{:?}`), clonar (`.clone()`), comparar igualdad (`==`) y comparar orden (`<`, `>`). No escribas `fn main`: el verificador trae el suyo.",
							code: "// Define aquí el struct Version con su #[derive(...)]\n",
						},
					],
					tests:
						'fn main() {\n    let instalada = Version { mayor: 1, menor: 4, parche: 0 };\n    let clonada = instalada.clone();\n\n    // Clone + PartialEq + Debug: el clon es igual al original\n    assert_eq!(instalada, clonada);\n\n    // PartialEq: un parche distinto las hace diferentes\n    let parcheada = Version { mayor: 1, menor: 4, parche: 2 };\n    assert_ne!(instalada, parcheada);\n\n    // PartialOrd campo a campo: empatan mayor (1==1) y menor (4==4), decide parche (0 < 2)\n    assert!(instalada < parcheada);\n\n    // PartialOrd: el mayor manda sobre todo lo demás\n    let mayor = Version { mayor: 2, menor: 0, parche: 0 };\n    assert!(mayor > instalada);\n    assert!(mayor > parcheada);\n\n    // <= con dos versiones iguales (gracias a Clone) también vale\n    assert!(instalada <= clonada);\n\n    // Debug: {:?} imprime la estructura campo a campo\n    assert_eq!(format!("{:?}", instalada), "Version { mayor: 1, menor: 4, parche: 0 }");\n\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"#[derive(Debug, Clone, PartialEq, PartialOrd)]\nstruct Version {\n    mayor: u32,\n    menor: u32,\n    parche: u32,\n}",
				},
				{
					type: "quiz",
					question:
						"¿Por qué `Debug` se puede derivar automáticamente pero `Display` no?",
					options: [
						{
							text: "Debug tiene un formato mecánico para programadores; Display es el formato para humanos, y ese es una decisión de diseño que Rust no quiere adivinar",
							correct: true,
						},
						{
							text: "Display es más antiguo y no se actualizó",
							correct: false,
						},
						{
							text: "Debug es más simple de implementar internamente",
							correct: false,
						},
						{
							text: "Sí se puede derivar Display, pero es mala práctica",
							correct: false,
						},
					],
					explanation:
						'La línea divisoria de los derive es: ¿la implementación es mecánica u opinable? Comparar campo a campo es mecánico (PartialEq ✓). Pero el texto "bonito" de tu tipo — qué mostrar, qué ocultar, en qué orden — es diseño de producto. Rust prefiere que esa decisión quede escrita por un humano.',
				},
				{
					type: "quiz",
					question:
						"¿Qué desbloquea exactamente `#[derive(PartialEq)]` en tu struct?",
					options: [
						{
							text: "Comparar instancias con == y != (campo a campo), lo que también habilita assert_eq! en tests",
							correct: true,
						},
						{
							text: "Ordenar instancias con .sort()",
							correct: false,
						},
						{
							text: "Imprimir la estructura con {:?}",
							correct: false,
						},
						{
							text: "Copiar instancias implícitamente al asignarlas",
							correct: false,
						},
					],
					explanation:
						'Cada derive desbloquea operaciones concretas: `PartialEq` → `==`/`!=`; ordenar pide `PartialOrd`/`Ord`; `{:?}` pide `Debug`; la copia implícita pide `Copy`. Aprender ese mapeo te deja leer los errores del compilador como instrucciones: "falta X" → "derive X".',
				},
				{
					type: "exercise",
					title: "Un Producto de primera clase",
					language: "rust",
					prompt:
						"Prepara el struct `Producto` para el mundo real:\n\n1. Derívale `Debug`, `Clone` y `PartialEq`.\n2. Impleméntale `Display` a mano con el formato `Teclado — $49.90` (nombre, espacio, raya larga `—`, espacio, `$` y el precio con **2 decimales**: `{:.2}`).\n\nEl `main` ya prueba todo: derives y Display.",
					starterCode:
						'use std::fmt;\n\n// TODO 1: derive(Debug, Clone, PartialEq)\nstruct Producto {\n    nombre: String,\n    precio: f64,\n}\n\n// TODO 2: impl fmt::Display for Producto\n\nfn main() {\n    let p = Producto { nombre: String::from("Teclado"), precio: 49.9 };\n    let copia = p.clone();\n\n    assert_eq!(p, copia);\n    assert_eq!(format!("{}", p), "Teclado — $49.90");\n    println!("{:?}", p);\n    println!("{}", p);\n    println!("Todo OK ✅");\n}',
					solution:
						'use std::fmt;\n\n#[derive(Debug, Clone, PartialEq)]\nstruct Producto {\n    nombre: String,\n    precio: f64,\n}\n\nimpl fmt::Display for Producto {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "{} — ${:.2}", self.nombre, self.precio)\n    }\n}\n\nfn main() {\n    let p = Producto { nombre: String::from("Teclado"), precio: 49.9 };\n    let copia = p.clone();\n\n    assert_eq!(p, copia);\n    assert_eq!(format!("{}", p), "Teclado — $49.90");\n    println!("{:?}", p);\n    println!("{}", p);\n    println!("Todo OK ✅");\n}',
					hints: [
						"El derive va pegado encima del struct: `#[derive(Debug, Clone, PartialEq)]`.",
						"El impl de Display es idéntico al del challenge de Temperatura — cambia solo la plantilla del write!.",
						"`{:.2}` formatea el f64 con exactamente 2 decimales: `49.9` se imprime `49.90`. La raya del formato es `—` (em dash), no un guion normal.",
					],
					explanation:
						'**Lo que practicaste:** el combo estándar de un tipo "ciudadano de primera" en Rust — derives mecánicos + Display manual. Este patrón exacto lo verás en cada codebase profesional.\n\n**Por qué importa:** un tipo con `Debug + Clone + PartialEq + Display` se puede testear (`assert_eq!`), inspeccionar (`{:?}`), duplicar y mostrar al usuario. Sin esos traits, tu tipo es un extraño en su propio ecosistema: cada librería que toque te pedirá uno de ellos.\n\n**En el mundo real** también verás `#[derive(Serialize, Deserialize)]` de la librería `serde` — el MISMO mecanismo de derive, extendido por terceros para JSON. El sistema de traits es tan central que hasta las librerías externas enseñan capacidades nuevas a tus tipos.',
				},
			],
		},
		{
			id: "m06_l05",
			moduleId: "m06",
			moduleSlug: "m06_traits_generics",
			order: 5,
			title: "Polimorfismo: impl Trait y dyn Trait",
			blocks: [
				{
					type: "first-principles",
					title: 'Dos maneras de decir "cualquier cosa que sepa hacer X"',
					problem:
						'Los generics se especializan al compilar: en un `Vec<T>`, TODOS los elementos son del mismo tipo concreto. Pero a veces necesitas una lista mixta — círculos Y rectángulos juntos — o devolver "algún tipo que cumpla el trait" sin decir cuál.',
					mentalModel:
						"Generics son como trajes a medida: el compilador corta uno por cliente (rápido, rígido). `dyn Trait` es la talla única ajustable: una sola pieza que sirve a cualquiera, a cambio de una pequeña indirección para ajustarla en el momento.",
					concreteExample:
						"Un editor gráfico guarda las figuras del lienzo en una sola lista: `Vec<Box<dyn Figura>>`. Círculos, rectángulos, estrellas — tipos distintos, mismo contrato. Al dibujar, cada elemento ejecuta SU propio `dibujar()`.",
					remember:
						"Generics (`<T: Trait>`): se resuelve al compilar, máxima velocidad, un tipo a la vez. `dyn Trait`: se resuelve al ejecutar, máxima flexibilidad, tipos mezclados.",
				},
				{
					type: "challenge",
					conceptId: "m06-dyn-collection",
					title: "Antes de leer: una lista de figuras distintas",
					prompt:
						'**Tu reto:** te damos un trait `Figura` y dos tipos que lo implementan. La función `area_total` recibe algo nuevo: `&[Box<dyn Figura>]` — un slice de "cajas" que pueden contener **cualquier figura**.\n\nNo te preocupes (todavía) por qué se escribe así: trata cada elemento como "algo que tiene `.area()`" y suma todas las áreas. Tus herramientas de m05 (`.iter()`, `.map()`, `.sum()`) funcionan exactamente igual.',
					starterCode:
						"trait Figura {\n    fn area(&self) -> f64;\n}\n\nstruct Cuadrado {\n    lado: f64,\n}\n\nstruct Triangulo {\n    base: f64,\n    altura: f64,\n}\n\nimpl Figura for Cuadrado {\n    fn area(&self) -> f64 {\n        self.lado * self.lado\n    }\n}\n\nimpl Figura for Triangulo {\n    fn area(&self) -> f64 {\n        self.base * self.altura / 2.0\n    }\n}\n\nfn area_total(figuras: &[Box<dyn Figura>]) -> f64 {\n    // suma las áreas de TODAS las figuras\n    \n}",
					tests:
						'fn main() {\n    let figuras: Vec<Box<dyn Figura>> = vec![\n        Box::new(Cuadrado { lado: 2.0 }),\n        Box::new(Triangulo { base: 3.0, altura: 4.0 }),\n    ];\n    assert!((area_total(&figuras) - 10.0).abs() < 1e-9);\n    assert_eq!(area_total(&[]), 0.0);\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"trait Figura {\n    fn area(&self) -> f64;\n}\n\nstruct Cuadrado {\n    lado: f64,\n}\n\nstruct Triangulo {\n    base: f64,\n    altura: f64,\n}\n\nimpl Figura for Cuadrado {\n    fn area(&self) -> f64 {\n        self.lado * self.lado\n    }\n}\n\nimpl Figura for Triangulo {\n    fn area(&self) -> f64 {\n        self.base * self.altura / 2.0\n    }\n}\n\nfn area_total(figuras: &[Box<dyn Figura>]) -> f64 {\n    figuras.iter().map(|f| f.area()).sum()\n}",
					hints: [
						"Aunque el tipo del slice se vea intimidante, cada elemento responde a `.area()` como cualquier figura. Itera y suma.",
						"Con iteradores de m05: `.iter().map(|f| f.area()).sum()`. El `sum()` sabe que debe dar `f64` por el tipo de retorno de la función.",
						"¿Prefieres un `for`? `let mut total = 0.0; for f in figuras { total += f.area(); } total` — ambas soluciones valen.",
					],
					reveal:
						'Acabas de usar **dynamic dispatch** sin despeinarte:\n\n```rust\nfn area_total(figuras: &[Box<dyn Figura>]) -> f64 {\n    figuras.iter().map(|f| f.area()).sum()\n}\n```\n\nLo nuevo está en el tipo: `Box<dyn Figura>`.\n\n- **`dyn Figura`** = "algún tipo que implementa Figura, decidido en ejecución". Como cada figura puede medir distinto en memoria, no puede ir "desnuda" en un Vec…\n- **`Box`** = una caja en el heap (¡tu conocimiento de m03 sirve aquí!). La caja siempre mide lo mismo (un puntero), así que el Vec puede almacenar cajas de figuras distintas.\n\nCuando llamas `f.area()`, Rust consulta en ejecución una pequeña tabla (la *vtable*) para saber cuál `area` ejecutar: ¿la del cuadrado o la del triángulo? Esa es la diferencia clave con los generics — y el tema de esta lección. 👇',
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: `Vec<Box<dyn Figura>>`\n\nEsta es LA línea que hace dudar a todos la primera vez. Vamos a abrirla de afuera hacia adentro, porque son tres ideas metidas en una. Tómatela con calma — cuando la entiendas, ya no le tienes miedo a ninguna firma de Rust.\n\nLeída en voz alta: *"un vector de cajas, donde cada caja contiene algún tipo que implementa Figura"*.\n\nAhora pieza por pieza, de DENTRO hacia AFUERA:\n\n**1. `dyn Figura` — "algún tipo que implementa Figura, no sé cuál hasta que ejecute".**\nLa palabra `dyn` es la abreviatura de *dynamic* (dinámico). Le dice al compilador: *"aquí va a haber un valor que cumple el contrato `Figura`, pero el tipo CONCRETO se decidirá en ejecución"*. Es lo contrario de `T` en un genérico, donde el tipo concreto se fija al compilar. Por eso `dyn Figura` se llama un **trait object**: un objeto del que solo conoces su trait, no su tipo real.\n\n**2. El problema de tamaño — por qué `dyn Figura` no puede ir suelto.**\nUn `Cuadrado { lado: f64 }` ocupa 8 bytes. Un `Triangulo { base: f64, altura: f64 }` ocupa 16. Si intentas `Vec<dyn Figura>` directamente, el compilador protesta: *"¿cuánto mido cada casilla del vector? ¿8? ¿16?"*. No lo sabe, porque cada figura mide distinto. En jerga de Rust: `dyn Figura` **no tiene tamaño conocido en compilación** (`Sized` no se cumple).\n\n**3. `Box<...>` — la caja en el heap que SIEMPRE mide lo mismo.**\nYa conoces `Box` de m03: pone un valor en el heap y te deja un **puntero** en el stack. Y aquí está la clave: un puntero es de **tamaño fijo**, da igual qué haya al otro lado. Así que `Box<dyn Figura>` es un puntero de tamaño fijo a una figura de tamaño cualquiera. Problema de tamaño resuelto.\n\n> **Detalle fino (para el que viene de C):** un `Box<TipoConcreto>` es UN puntero normal — una palabra (8 bytes). Pero un `Box<dyn Figura>` es un **puntero gordo** (*fat pointer*) de DOS palabras: una apunta al dato en el heap, la otra a la *vtable* (la tabla de métodos del tipo real). Lo importante para el `Vec`: TODOS los `Box<dyn Figura>` miden lo mismo (16 bytes), así que se alinean igual.\n\n**4. `Vec<...>` — la lista uniforme de cajas.**\nComo todas las cajas miden lo mismo, el `Vec` ya puede alinearlas en sus casillas. Cada casilla guarda una caja; cada caja apunta a una figura distinta en el heap. Eso es lo que hace posible la lista MIXTA que un `Vec<T>` jamás podría tener.\n\nResumen en una frase: **`dyn` borra el tipo concreto, `Box` le da un tamaño fijo, y `Vec` los junta.** Las tres piezas resuelven, en cadena, un solo problema: meter tipos distintos en una sola lista.',
				},
				{
					type: "code",
					language: "text",
					code: 'DESGLOSE DE:  let lienzo: Vec<Box<dyn Figura>> = vec![ ... ];\n\nPaso 1 — qué es cada trozo del TIPO (leyendo de dentro a fuera):\n\n    Figura            ......  el trait (el contrato: "sé calcular mi area")\n    dyn Figura        ......  "algún tipo que cumple Figura", decidido en runtime\n    Box<dyn Figura>   ......  un puntero GORDO (dato + vtable) a esa figura del heap\n    Vec<Box<dyn ...>> ......  una lista de esos punteros, todos del mismo tamaño\n\n\nPaso 2 — qué hay en MEMORIA con estas tres figuras:\n\n    vec![ Box::new(Cuadrado{2.0}), Box::new(Circulo{1.0}), Box::new(Cuadrado{0.5}) ]\n\n    BUFFER del Vec  (cada casilla = FAT POINTER de 2 palabras)\n    +-------------------------------+\n    | [0] data_ptr | vtable_ptr  ---+--->  datos: Cuadrado{2.0}    vtable -> Cuadrado_vtable\n    | [1] data_ptr | vtable_ptr  ---+--->  datos: Circulo{1.0}     vtable -> Circulo_vtable\n    | [2] data_ptr | vtable_ptr  ---+--->  datos: Cuadrado{0.5}    vtable -> Cuadrado_vtable\n    +-------------------------------+\n       data_ptr   -> a los DATOS de la figura, en el HEAP\n       vtable_ptr -> a la tabla de metodos del tipo (vive en el BINARIO, no en el heap)\n       (las 3 casillas miden lo mismo: por eso el Vec puede alinearlas)\n\n\nPaso 3 — qué pasa al llamar  figura.area()  dentro del for:\n\n    iteracion 0:  -> Cuadrado(2.0)   vtable.area -> Cuadrado::area  =>  2.0 * 2.0  = 4.00\n    iteracion 1:  -> Circulo(1.0)    vtable.area -> Circulo::area   =>  PI*1.0*1.0 = 3.14\n    iteracion 2:  -> Cuadrado(0.5)   vtable.area -> Cuadrado::area  =>  0.5 * 0.5  = 0.25\n\n    Cada valor sabe su propia vtable (su tabla de metodos) por el vtable_ptr.\n    La llamada NO se decide al compilar: se mira la vtable del valor, en ejecucion.\n    Eso es DYNAMIC DISPATCH.\n\n\nContraste con GENERICS (static dispatch):\n\n    fn area<T: Figura>(f: &T)   ->  el compilador SABE que T = Cuadrado,\n                                    estampa una version y llama a Cuadrado::area DIRECTO.\n                                    Sin vtable, sin indireccion. Pero T es UN solo tipo.\n\n    Box<dyn Figura>             ->  puntero gordo + vtable. Cuesta una indireccion,\n                                    a cambio de poder MEZCLAR tipos en la misma lista.',
					runnable: false,
				},
				{
					type: "text",
					body: '## Static dispatch: lo que ya conocías\n\nCon generics, el compilador sabe el tipo concreto y conecta la llamada **directamente** (static dispatch). Ya lo viste: monomorphization, costo cero:\n\n```rust\nfn imprimir_area<T: Figura>(figura: &T) {\n    println!("{}", figura.area());  // conexión directa, decidida al compilar\n}\n```\n\nLa limitación: `T` se fija por llamada. Un `Vec<T>` con `T = Cuadrado` solo guarda cuadrados.\n\n## Dynamic dispatch: decidir en ejecución\n\n`dyn Trait` pospone la decisión: "aquí dentro hay ALGÚN tipo que cumple Figura, ya veremos cuál". Para llamar a un método, el programa consulta la **vtable** — una tabla de punteros a funciones que acompaña al valor:\n\n- Costo: una indirección por llamada (nanosegundos — casi nunca es tu cuello de botella).\n- Ganancia: colecciones mixtas, plugins, configuraciones elegidas en runtime.\n\n¿Por qué `Box`? Un `Cuadrado` mide 8 bytes; un `Triangulo`, 16. Un Vec necesita elementos de tamaño uniforme — así que guardas **punteros** a cajas del heap (todas miden igual) en lugar de las figuras desnudas.',
				},
				{
					type: "code",
					language: "rust",
					code: 'trait Figura {\n    fn area(&self) -> f64;\n    fn nombre(&self) -> String;\n}\n\nstruct Cuadrado { lado: f64 }\nstruct Circulo { radio: f64 }\n\nimpl Figura for Cuadrado {\n    fn area(&self) -> f64 { self.lado * self.lado }\n    fn nombre(&self) -> String { String::from("cuadrado") }\n}\n\nimpl Figura for Circulo {\n    fn area(&self) -> f64 { std::f64::consts::PI * self.radio * self.radio }\n    fn nombre(&self) -> String { String::from("círculo") }\n}\n\nfn main() {\n    // La lista MIXTA: imposible con Vec<T>, natural con Box<dyn Trait>.\n    let lienzo: Vec<Box<dyn Figura>> = vec![\n        Box::new(Cuadrado { lado: 2.0 }),\n        Box::new(Circulo { radio: 1.0 }),\n        Box::new(Cuadrado { lado: 0.5 }),\n    ];\n\n    for figura in &lienzo {\n        // ¿Qué area() se ejecuta? Se decide AQUÍ, en ejecución, vía vtable.\n        println!("{}: {:.2}", figura.nombre(), figura.area());\n    }\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## impl Trait como retorno: "devuelvo algo que cumple el contrato"\n\nHay un tercer jugador: `impl Trait` en la **posición de retorno**. Dice "esta función devuelve UN tipo concreto que implementa el trait, pero no te digo cuál":',
				},
				{
					type: "code",
					language: "rust",
					code: 'trait Animal {\n    fn nombre(&self) -> String;\n}\n\nstruct Perro;\n\nimpl Animal for Perro {\n    fn nombre(&self) -> String {\n        String::from("Firulais")\n    }\n}\n\n// "Devuelvo ALGO que es Animal". El tipo concreto (Perro) queda oculto:\n// puedo cambiarlo mañana sin romper a quien me llama.\nfn adoptar() -> impl Animal {\n    Perro\n}\n\nfn main() {\n    let mascota = adoptar();\n    println!("Adoptaste a {}", mascota.nombre());\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## `impl Trait` vs `dyn Trait`: la confusión de las dos palabras parecidas\n\nSe escriben casi igual y ambas dicen "algo que cumple el trait", pero significan cosas OPUESTAS. Esta es la otra línea densa que conviene abrir despacio.\n\n**`-> impl Figura`** = *"devuelvo UN tipo concreto, fijo, que cumple Figura — solo te oculto su nombre".*\nHay exactamente UN tipo detrás, decidido al COMPILAR. El compilador sí sabe cuál es (digamos `Cuadrado`); simplemente no te obliga a escribirlo. Es **static dispatch**, costo cero, igual que los genéricos. La trampa: todas las ramas de la función deben devolver el MISMO tipo. Un `if` que a veces devuelve `Cuadrado` y a veces `Circulo` con `-> impl Figura` **no compila**.\n\n**`Box<dyn Figura>`** = *"aquí va ALGUNO de varios tipos posibles, y cuál sea se sabrá en ejecución".*\nPuede haber MUCHOS tipos distintos detrás, decididos en RUNTIME, cada uno con su vtable. Es **dynamic dispatch**: cuesta una indirección, pero a cambio sí puedes mezclar `Cuadrado` y `Circulo` en la misma lista o devolver uno u otro según una condición.\n\nLa regla mnemotécnica: **`impl` = un tipo oculto (compilación). `dyn` = varios tipos posibles (ejecución).** Si te encuentras queriendo un `if` que devuelve tipos diferentes, esa es justo la señal de que necesitas `Box<dyn ...>` y no `impl`.',
				},
				{
					type: "code",
					language: "text",
					code: 'MISMA INTENCION ("devuelve algo que es Figura"), DOS MUNDOS DISTINTOS:\n\n-----------------------------------------------------------------------\n CON  -> impl Figura        (UN tipo, decidido al COMPILAR, sin vtable)\n-----------------------------------------------------------------------\n    fn crear() -> impl Figura {\n        Cuadrado { lado: 2.0 }      // siempre Cuadrado, nada mas\n    }\n\n    el compilador POR DENTRO sabe:   crear() devuelve un Cuadrado.\n    llamada a .area()            ->  directa a Cuadrado::area  (static dispatch)\n\n    ESTO NO COMPILA  (dos tipos distintos en las ramas):\n        fn crear(grande: bool) -> impl Figura {\n            if grande { Cuadrado { lado: 9.0 } }   // tipo Cuadrado\n            else      { Circulo  { radio: 1.0 } }  // tipo Circulo  <- ERROR:\n        }                                          //   "if and else have\n                                                   //    incompatible types"\n\n-----------------------------------------------------------------------\n CON  -> Box<dyn Figura>     (VARIOS tipos posibles, decididos en RUNTIME)\n-----------------------------------------------------------------------\n    fn crear(grande: bool) -> Box<dyn Figura> {\n        if grande { Box::new(Cuadrado { lado: 9.0 }) }   // caja de Cuadrado\n        else      { Box::new(Circulo  { radio: 1.0 }) }  // caja de Circulo\n    }                                                    //   COMPILA: ambas\n                                                         //   son Box<dyn Figura>\n\n    llamada a .area()  ->  mira la vtable del valor en ejecucion (dynamic dispatch)\n                           grande=true  -> Cuadrado::area\n                           grande=false -> Circulo::area\n\n-----------------------------------------------------------------------\n REGLA:  un solo tipo oculto -> impl Trait   (rapido, rigido)\n         varios tipos / decidir en runtime -> Box<dyn Trait>  (flexible)\n-----------------------------------------------------------------------',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: '**¿Dónde lo verás en el mundo real?** Los iteradores de m05 devuelven tipos impronunciables (`Map<Filter<Iter<…>>>`). Por eso las funciones que construyen pipelines devuelven `impl Iterator<Item = i32>`: "un iterador de enteros, no preguntes el tipo exacto". Sin `impl Trait`, esas firmas serían inescribibles.',
				},
				{
					type: "text",
					body: "## ¿Cuál uso? La tabla de decisión\n\n| Situación | Herramienta |\n|-----------|-------------|\n| Función que acepta cualquier tipo capaz de X | `<T: Trait>` (generics) |\n| Colección con tipos MEZCLADOS | `Vec<Box<dyn Trait>>` |\n| Devolver un tipo complejo/oculto que cumple X | `-> impl Trait` |\n| Plugins o estrategias elegidas en runtime | `Box<dyn Trait>` |\n| Máximo rendimiento en bucles calientes | generics (static dispatch) |\n\nRegla de oro: **empieza con generics** (más rápido, más información para el compilador). Cambia a `dyn` cuando necesites mezclar tipos o decidir en ejecución. El compilador te avisará si intentas lo imposible.",
				},
				{
					type: "quiz",
					question:
						"¿Por qué una lista con figuras de tipos distintos necesita `Vec<Box<dyn Figura>>` en lugar de `Vec<T>` genérico?",
					options: [
						{
							text: "Porque en Vec<T> el T se especializa a UN solo tipo concreto al compilar; dyn permite mezclar tipos pagando una indirección en ejecución",
							correct: true,
						},
						{
							text: "Porque Vec<T> es más lento que Box",
							correct: false,
						},
						{
							text: "Porque los traits no funcionan con Vec",
							correct: false,
						},
						{
							text: "Porque las figuras son demasiado grandes para el stack",
							correct: false,
						},
					],
					explanation:
						'Monomorphization especializa: `Vec<Cuadrado>` es una lista de cuadrados y punto. `Box<dyn Figura>` borra el tipo concreto detrás de un puntero uniforme: la lista guarda "cajas de cualquier figura" y el método correcto se busca en ejecución vía vtable. Flexibilidad a cambio de una indirección.',
				},
				{
					type: "quiz",
					question:
						"Con `figura.area()` donde `figura: &Box<dyn Figura>`, ¿cuándo se decide QUÉ implementación de `area` se ejecuta?",
					options: [
						{
							text: "En tiempo de ejecución, consultando la vtable del valor concreto",
							correct: true,
						},
						{
							text: "En tiempo de compilación, como con los generics",
							correct: false,
						},
						{
							text: "La primera vez que se llama, y luego queda cacheada para siempre",
							correct: false,
						},
						{
							text: "Nunca: dyn Trait solo permite métodos default",
							correct: false,
						},
					],
					explanation:
						"Eso es dynamic dispatch: el valor lleva consigo un puntero a su vtable (la tabla de métodos de SU tipo), y cada llamada la consulta. Por eso `dyn` puede mezclar tipos que el compilador no conoce de antemano — y por eso cuesta una indirección que los generics no pagan.",
				},
				{
					type: "faded-exercise",
					conceptId: "m06-dyn-area-formas",
					title: "🟢 Guiado: sumar el área de una lista mixta de formas",
					intro:
						"Un programa de dibujo guarda en el lienzo formas de tipos distintos —círculos y rectángulos— en UNA sola lista. Vas a escribir la función que recorre esa lista heterogénea y suma todas las áreas. La pieza nueva es el tipo del parámetro: `&[Box<dyn Forma>]`, justo la línea que acabas de desarmar. Observa, completa, hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** El trait `Forma` pide un solo método: `area`. `Circulo` y `Rectangulo` lo implementan cada uno a su manera. Fíjate en `area_total`: recibe `&[Box<dyn Forma>]` (un slice de cajas, cada una con alguna forma) y, sobre cada elemento, llama a `.area()` exactamente como si fuera una forma normal. El `dyn` y el `Box` no cambian CÓMO se usan los iteradores de m05 — solo permiten que la lista mezcle tipos.",
							code: "trait Forma {\n    fn area(&self) -> f64;\n}\n\nstruct Circulo {\n    radio: f64,\n}\n\nstruct Rectangulo {\n    ancho: f64,\n    alto: f64,\n}\n\nimpl Forma for Circulo {\n    fn area(&self) -> f64 {\n        std::f64::consts::PI * self.radio * self.radio\n    }\n}\n\nimpl Forma for Rectangulo {\n    fn area(&self) -> f64 {\n        self.ancho * self.alto\n    }\n}\n\nfn area_total(formas: &[Box<dyn Forma>]) -> f64 {\n    formas.iter().map(|f| f.area()).sum()\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** Rellena los tres `___`: el **tipo del slice** que permite mezclar formas (la línea densa: vector-de-cajas-de-dyn), el **método** del trait que cada forma sabe ejecutar, y el **valor inicial** correcto para acumular áreas (`f64`, no entero). Cuidado con ese último: si arrancas el acumulador con `0` en vez de `0.0`, los tipos no cuadran.",
							code: "fn area_total(formas: &[Box<dyn ___>]) -> f64 {\n    let mut total = ___;\n    for forma in formas {\n        total += forma.___();\n    }\n    total\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `area_total` completa desde cero. Recibe `&[Box<dyn Forma>]` y devuelve `f64` con la suma de todas las áreas. Usa el estilo que prefieras: el `for` con acumulador `0.0`, o la cadena `.iter().map(|f| f.area()).sum()` de m05. Una lista vacía debe dar `0.0`.",
							code: "fn area_total(formas: &[Box<dyn Forma>]) -> f64 {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    let lienzo: Vec<Box<dyn Forma>> = vec![\n        Box::new(Circulo { radio: 1.0 }),\n        Box::new(Rectangulo { ancho: 3.0, alto: 4.0 }),\n    ];\n    // Circulo r=1 => PI ; Rectangulo 3x4 => 12 ; total = 12 + PI\n    assert!((area_total(&lienzo) - 15.141592653589793).abs() < 1e-9);\n\n    let solo_rect: Vec<Box<dyn Forma>> = vec![\n        Box::new(Rectangulo { ancho: 2.0, alto: 5.0 }),\n    ];\n    assert!((area_total(&solo_rect) - 10.0).abs() < 1e-9);\n\n    assert_eq!(area_total(&[]), 0.0);\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'trait Forma {\n    fn area(&self) -> f64;\n}\n\nstruct Circulo {\n    radio: f64,\n}\n\nstruct Rectangulo {\n    ancho: f64,\n    alto: f64,\n}\n\nimpl Forma for Circulo {\n    fn area(&self) -> f64 {\n        std::f64::consts::PI * self.radio * self.radio\n    }\n}\n\nimpl Forma for Rectangulo {\n    fn area(&self) -> f64 {\n        self.ancho * self.alto\n    }\n}\n\nfn area_total(formas: &[Box<dyn Forma>]) -> f64 {\n    let mut total = 0.0;\n    for forma in formas {\n        total += forma.area();\n    }\n    total\n}\n\nfn main() {\n    let lienzo: Vec<Box<dyn Forma>> = vec![\n        Box::new(Circulo { radio: 1.0 }),\n        Box::new(Rectangulo { ancho: 3.0, alto: 4.0 }),\n    ];\n    assert!((area_total(&lienzo) - 15.141592653589793).abs() < 1e-9);\n\n    let solo_rect: Vec<Box<dyn Forma>> = vec![\n        Box::new(Rectangulo { ancho: 2.0, alto: 5.0 }),\n    ];\n    assert!((area_total(&solo_rect) - 10.0).abs() < 1e-9);\n\n    assert_eq!(area_total(&[]), 0.0);\n    println!("__ALL_TESTS_PASSED__");\n}',
				},
				{
					type: "exercise",
					title: "Mini-sistema de validación con plugins",
					language: "rust",
					prompt:
						'Vas a construir el patrón más común de `dyn Trait` en el mundo real: una **cadena de validadores** configurable (así funcionan los middlewares de un servidor web o las reglas de un formulario).\n\n1. Implementa `Validador` para `NoVacio` (falla con `"el texto no puede estar vacío"` si el texto, tras `.trim()`, queda vacío).\n2. Implementa `Validador` para `LargoMaximo` (falla con `"máximo {max} caracteres"` si `texto.len()` supera `self.max`).\n3. Implementa `validar_todos`: ejecuta TODOS los validadores y devuelve los mensajes de error de los que fallen (un `Vec<String>` vacío significa que todo pasó).\n\nPista de oro para el punto 3: `Result::err()` convierte un `Result<(), String>` en `Option<String>` — combínalo con `.filter_map()` de m05.',
					starterCode:
						'trait Validador {\n    fn validar(&self, texto: &str) -> Result<(), String>;\n}\n\nstruct NoVacio;\n\nstruct LargoMaximo {\n    max: usize,\n}\n\n// TODO 1: impl Validador for NoVacio\n\n// TODO 2: impl Validador for LargoMaximo\n\nfn validar_todos(validadores: &[Box<dyn Validador>], texto: &str) -> Vec<String> {\n    // TODO 3: junta los errores de los validadores que fallen\n    todo!()\n}\n\nfn main() {\n    let reglas: Vec<Box<dyn Validador>> = vec![\n        Box::new(NoVacio),\n        Box::new(LargoMaximo { max: 10 }),\n    ];\n\n    assert_eq!(validar_todos(&reglas, "hola"), Vec::<String>::new());\n    assert_eq!(\n        validar_todos(&reglas, ""),\n        vec![String::from("el texto no puede estar vacío")]\n    );\n    assert_eq!(\n        validar_todos(&reglas, "demasiado largo para la regla"),\n        vec![String::from("máximo 10 caracteres")]\n    );\n    println!("Todo OK ✅");\n}',
					solution:
						'trait Validador {\n    fn validar(&self, texto: &str) -> Result<(), String>;\n}\n\nstruct NoVacio;\n\nstruct LargoMaximo {\n    max: usize,\n}\n\nimpl Validador for NoVacio {\n    fn validar(&self, texto: &str) -> Result<(), String> {\n        if texto.trim().is_empty() {\n            Err(String::from("el texto no puede estar vacío"))\n        } else {\n            Ok(())\n        }\n    }\n}\n\nimpl Validador for LargoMaximo {\n    fn validar(&self, texto: &str) -> Result<(), String> {\n        if texto.len() > self.max {\n            Err(format!("máximo {} caracteres", self.max))\n        } else {\n            Ok(())\n        }\n    }\n}\n\nfn validar_todos(validadores: &[Box<dyn Validador>], texto: &str) -> Vec<String> {\n    validadores\n        .iter()\n        .filter_map(|v| v.validar(texto).err())\n        .collect()\n}\n\nfn main() {\n    let reglas: Vec<Box<dyn Validador>> = vec![\n        Box::new(NoVacio),\n        Box::new(LargoMaximo { max: 10 }),\n    ];\n\n    assert_eq!(validar_todos(&reglas, "hola"), Vec::<String>::new());\n    assert_eq!(\n        validar_todos(&reglas, ""),\n        vec![String::from("el texto no puede estar vacío")]\n    );\n    assert_eq!(\n        validar_todos(&reglas, "demasiado largo para la regla"),\n        vec![String::from("máximo 10 caracteres")]\n    );\n    println!("Todo OK ✅");\n}',
					hints: [
						"Cada `impl` es un if/else que devuelve `Err(mensaje)` o `Ok(())` — el `Result<(), String>` de m04: éxito sin datos, o error con mensaje.",
						'Para `LargoMaximo`, el mensaje se construye con `format!("máximo {} caracteres", self.max)`.',
						"`validar_todos` en una cadena: `validadores.iter().filter_map(|v| v.validar(texto).err()).collect()`. El `.err()` descarta los Ok y extrae los mensajes de los Err.",
					],
					explanation:
						"**Lo que acabas de construir es un patrón de producción real.** Cambia los nombres y es: la cadena de middlewares de un servidor web, las reglas de un motor de descuentos, los chequeos de un linter. La forma es siempre la misma:\n\n1. Un trait pequeño define el contrato (`Validador`).\n2. Cada regla es un tipo independiente — se testea sola, se agrega sin tocar las demás.\n3. `Vec<Box<dyn Trait>>` las junta y un runner las ejecuta.\n\n**Fíjate en la composición de conceptos** que usaste sin pestañear: ownership (las cajas poseen sus validadores), `Result` (m04), `filter_map` (m05), traits y dyn dispatch (este módulo). Así se siente programar en Rust de verdad: las piezas encajan.\n\n**Para masticar:** ¿por qué `validar_todos` devuelve TODOS los errores en vez de parar en el primero? Piensa en un formulario web: ¿prefieres que te marquen los 5 campos mal de una vez, o descubrirlos de a uno?",
				},
				{
					type: "challenge",
					conceptId: "m06-dyn-log-eventos",
					title: "🔴 Reto real: un log con eventos heterogéneos vía dyn Trait",
					prompt:
						'**El escenario.** Casi cualquier sistema real produce un *log* de eventos de tipos muy distintos: alguien inicia sesión, una compra se procesa, salta un error. Cada evento guarda datos diferentes (un nombre, un monto, un código), pero todos comparten una capacidad: **saber describirse como una línea de texto**. Esto es el caso clásico de `dyn Trait` — una lista heterogénea procesada por un mismo runner.\n\n**Por qué dyn y no genéricos.** Un `Vec<T>` solo guardaría UN tipo de evento. Pero el log mezcla `Login`, `Compra` y `ErrorEvento` en orden de llegada: necesitas `Vec<Box<dyn Evento>>` para que convivan. Es exactamente cómo un framework web guarda handlers distintos en una tabla, o cómo un editor guarda acciones para deshacer.\n\n**Tu reto:**\n1. Implementa `Evento` (método `describir(&self) -> String`) para los tres structs:\n   - `Login { usuario }` → `"[LOGIN] usuario=ana"`\n   - `Compra { monto }` → `"[COMPRA] monto=150"`\n   - `ErrorEvento { codigo }` → `"[ERROR] codigo=404"`\n2. Implementa `formatear_log`: recibe `&[Box<dyn Evento>]` y devuelve un `Vec<String>` con la descripción de cada evento, en orden.\n\nUsa `format!` (m05) para los mensajes y los iteradores (`.iter().map(...).collect()`) para el runner.',
					starterCode:
						'trait Evento {\n    fn describir(&self) -> String;\n}\n\nstruct Login {\n    usuario: String,\n}\n\nstruct Compra {\n    monto: u32,\n}\n\nstruct ErrorEvento {\n    codigo: u32,\n}\n\n// TODO 1: impl Evento for Login        -> "[LOGIN] usuario={usuario}"\n\n// TODO 1: impl Evento for Compra       -> "[COMPRA] monto={monto}"\n\n// TODO 1: impl Evento for ErrorEvento  -> "[ERROR] codigo={codigo}"\n\nfn formatear_log(eventos: &[Box<dyn Evento>]) -> Vec<String> {\n    // TODO 2: describe cada evento, en orden, en un Vec<String>\n    todo!()\n}',
					tests:
						'fn main() {\n    let log: Vec<Box<dyn Evento>> = vec![\n        Box::new(Login { usuario: String::from("ana") }),\n        Box::new(Compra { monto: 150 }),\n        Box::new(ErrorEvento { codigo: 404 }),\n    ];\n\n    let lineas = formatear_log(&log);\n    assert_eq!(lineas.len(), 3);\n    assert_eq!(lineas[0], "[LOGIN] usuario=ana");\n    assert_eq!(lineas[1], "[COMPRA] monto=150");\n    assert_eq!(lineas[2], "[ERROR] codigo=404");\n\n    let vacio: Vec<Box<dyn Evento>> = vec![];\n    assert_eq!(formatear_log(&vacio), Vec::<String>::new());\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'trait Evento {\n    fn describir(&self) -> String;\n}\n\nstruct Login {\n    usuario: String,\n}\n\nstruct Compra {\n    monto: u32,\n}\n\nstruct ErrorEvento {\n    codigo: u32,\n}\n\nimpl Evento for Login {\n    fn describir(&self) -> String {\n        format!("[LOGIN] usuario={}", self.usuario)\n    }\n}\n\nimpl Evento for Compra {\n    fn describir(&self) -> String {\n        format!("[COMPRA] monto={}", self.monto)\n    }\n}\n\nimpl Evento for ErrorEvento {\n    fn describir(&self) -> String {\n        format!("[ERROR] codigo={}", self.codigo)\n    }\n}\n\nfn formatear_log(eventos: &[Box<dyn Evento>]) -> Vec<String> {\n    eventos.iter().map(|e| e.describir()).collect()\n}\n\nfn main() {\n    let log: Vec<Box<dyn Evento>> = vec![\n        Box::new(Login { usuario: String::from("ana") }),\n        Box::new(Compra { monto: 150 }),\n        Box::new(ErrorEvento { codigo: 404 }),\n    ];\n\n    let lineas = formatear_log(&log);\n    assert_eq!(lineas.len(), 3);\n    assert_eq!(lineas[0], "[LOGIN] usuario=ana");\n    assert_eq!(lineas[1], "[COMPRA] monto=150");\n    assert_eq!(lineas[2], "[ERROR] codigo=404");\n\n    let vacio: Vec<Box<dyn Evento>> = vec![];\n    assert_eq!(formatear_log(&vacio), Vec::<String>::new());\n    println!("__ALL_TESTS_PASSED__");\n}',
					reveal:
						"Acabas de escribir el **núcleo de cualquier sistema de logging, telemetría o event sourcing real**. La forma es idéntica en producción:\n\n```rust\nlet log: Vec<Box<dyn Evento>> = vec![ /* eventos de tipos distintos */ ];\nlet lineas = formatear_log(&log);  // un runner los procesa a todos por igual\n```\n\n**Por qué `dyn` es la herramienta correcta aquí, y no los genéricos:**\n\n- Los eventos llegan **mezclados y en orden de tiempo**: un `Login`, luego una `Compra`, luego un `ErrorEvento`. Un `Vec<T>` genérico exige UN solo tipo — no podría guardar esa secuencia heterogénea.\n- El conjunto de tipos de evento **crece con el tiempo**: mañana agregas `Logout` o `PagoFallido` con su `impl Evento`, y `formatear_log` los acepta **sin cambiar una línea**. Esa apertura a tipos futuros es la esencia del despacho dinámico.\n- En código real lo verás como: handlers de un router web (`Box<dyn Handler>`), comandos de un patrón Command (`Box<dyn Comando>`), nodos de una UI (`Box<dyn Widget>`), plugins cargados en runtime. Siempre el mismo molde: **trait pequeño + `Vec<Box<dyn Trait>>` + un runner que itera**.\n\nLa decisión, una vez más: ¿una lista de tipos MEZCLADOS, o tipos decididos en ejecución? → `dyn`. ¿Un solo tipo conocido al compilar, máxima velocidad? → genéricos. Acabas de elegir bien.",
					hints: [
						'Cada `impl Evento for ...` es una línea: `format!("[LOGIN] usuario={}", self.usuario)` (sin `;` para devolverlo). Cambia la etiqueta y el campo en cada tipo.',
						"`formatear_log` es el runner: `eventos.iter().map(|e| e.describir()).collect()`. Dentro del `map`, `e` es un `&Box<dyn Evento>` y `e.describir()` despacha por la vtable al método del tipo real.",
						"El `collect()` arma un `Vec<String>` porque ese es el tipo de retorno declarado de la función. Una lista vacía produce un `Vec` vacío sin código extra.",
					],
				},
			],
		},
	],
};

export default module;

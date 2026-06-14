import type { Module } from "../types";

const module: Module = {
	id: "m03",
	slug: "m03_ownership",
	order: 3,
	version: 1,
	icon: "🔑",
	title: "Ownership y Borrowing",
	description:
		"El corazon de Rust: comprende el sistema de ownership, referencias, borrowing y slices que hacen a Rust único.",
	lessons: [
		{
			id: "m03_l01",
			moduleId: "m03",
			moduleSlug: "m03_ownership",
			order: 1,
			title: "Ownership: que es y por que importa",
			blocks: [
				{
					type: "first-principles",
					title:
						"Ownership nace de una pregunta simple: ¿quién limpia la memoria?",
					problem:
						"Cada dato ocupa memoria. Si el dato vive para siempre, desperdicias RAM. Si lo borras mientras alguien lo usa, rompes el programa. El problema central es decidir quién es responsable de limpiar.",
					mentalModel:
						"Ownership es como una llave única de una habitación. Quien tiene la llave puede usar y finalmente cerrar la habitación. Si todos tienen llaves, nadie sabe quién debe cerrar; si nadie la tiene, la habitación queda abandonada.",
					concreteExample:
						"Un `String` puede crecer, así que vive en el heap. Rust asigna un owner. Cuando ese owner sale del scope, Rust llama a `drop` y libera la memoria. No hay recolector buscando después ni un humano llamando `free` manualmente.",
					remember:
						"Ownership no es una regla rara de Rust: es una respuesta concreta al problema de limpiar memoria sin pausas ni errores peligrosos.",
				},
				{
					type: "challenge",
					conceptId: "m03-own-take",
					title: "Antes de leer: una función que se queda con el dato",
					prompt:
						'**Tu reto:** escribe `longitud_propia(s: String) -> usize` que reciba un `String` **por valor** (no por referencia) y devuelva su longitud en bytes.\n\nFíjate que el parámetro es `String`, no `&String`. Inténtalo y dale a Verificar — luego hablaremos de qué significa que la función "se quede" con el dato.',
					starterCode:
						"fn longitud_propia(s: String) -> usize {\n    // tu código aquí\n}",
					tests:
						'fn main() {\n    assert_eq!(longitud_propia(String::from("hola")), 4);\n    assert_eq!(longitud_propia(String::from("")), 0);\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"`s.len()` devuelve la longitud en bytes de un `String`. No necesitas nada más que llamarlo.",
						"Recuerda (m02): la última expresión **sin punto y coma** es el valor de retorno. El cuerpo completo es una sola línea: `s.len()`.",
					],
					solution: "fn longitud_propia(s: String) -> usize {\n    s.len()\n}",
					reveal:
						'Cuando una función recibe un `String` **por valor**, se vuelve su **dueña** (owner). El dato "se mueve" hacia adentro de la función.\n\n```rust\nfn longitud_propia(s: String) -> usize {\n    s.len()\n}  // aquí s sale de scope y Rust libera su memoria, automáticamente\n```\n\nLa consecuencia importante: quien llamó a la función **ya no puede usar su `String`** después, porque dejó de ser el dueño. Cada dato tiene exactamente un dueño en cada momento — esa es la regla central de *ownership* que vas a ver ahora. 👇',
				},
				{
					type: "text",
					body: "## El Problema: ¿quién libera la memoria?\r\n\r\nCuando tu programa crea datos (un texto, una lista, una imagen), esos datos ocupan **memoria** del computador. La pregunta clave es: **¿quién es responsable de liberar esa memoria cuando ya no se necesita?**\r\n\r\nEn lenguajes como Python o JavaScript, un programa interno llamado **garbage collector** (recolector de basura) se encarga automáticamente. Funciona, pero tiene un costo: tu programa hace pausas impredecibles mientras el garbage collector busca memoria sin usar, y usa más memoria de la necesaria.\r\n\r\nEn C y C++, el programador libera la memoria manualmente. Esto es rápido, pero extremadamente peligroso:",
				},
				{
					type: "code",
					language: "c",
					code: '// C - manual memory management (simplified)\r\nchar* name = malloc(100);   // Reserve 100 bytes of memory\r\nstrcpy(name, "Ferris");\r\nfree(name);                 // Free the memory\r\nprintf("%s", name);         // BUG! Using memory after freeing it\r\nfree(name);                 // BUG! Freeing the same memory twice - crash!',
					runnable: false,
				},
				{
					type: "text",
					body: "Olvidar liberar memoria causa **memory leaks** (fugas de memoria: tu programa consume cada vez más RAM). Liberar memoria dos veces causa **crashes**. Usar memoria ya liberada causa **vulnerabilidades de seguridad críticas**.\r\n\r\n## La solución de Rust: Ownership\r\n\r\nRust resuelve este problema de una forma única: el **sistema de ownership** (propiedad). No necesita garbage collector ni gestión manual. El compilador sabe *exactamente* cuándo liberar la memoria, y lo hace automáticamente. Sin pausas, sin errores, sin costo extra en tiempo de ejecución.",
				},
				{
					type: "callout",
					variant: "info",
					body: "**Las tres reglas del ownership:**\r\n1. Cada valor en Rust tiene una variable que es su **owner** (propietario). Piensa en ello como: cada objeto tiene exactamente un dueño.\r\n2. Solo puede haber **un owner** a la vez. No pueden existir dos dueños del mismo valor.\r\n3. Cuando el owner sale del **scope** (alcance), el valor se **libera automáticamente**.",
				},
				{
					type: "text",
					body: "## ¿Qué es el Scope?\r\n\r\nEl **scope** (alcance) es la zona del código donde una variable es válida y puede usarse. En Rust, el scope está definido por las llaves `{}`. Una variable nace cuando se crea y muere cuando termina el bloque donde fue declarada.\r\n\r\nCuando una variable sale del scope, Rust automáticamente llama a una función interna llamada `drop` que libera los recursos que esa variable usaba. Tú no tienes que hacer nada: es completamente automático.",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    // Ejemplo 1: scope basico\r\n    {\r\n        let mensaje = String::from("hola");  // mensaje nace aqui\r\n        println!("Dentro del bloque: {}", mensaje);\r\n    }  // <- mensaje sale del scope aqui. Rust llama drop() y libera la memoria.\r\n\r\n    // println!("{}", mensaje);  // ERROR! mensaje ya no existe\r\n\r\n    // Ejemplo 2: scopes anidados\r\n    let exterior = String::from("vivo fuera");\r\n    {\r\n        let interior = String::from("vivo dentro");\r\n        println!("{} y {}", exterior, interior);\r\n        // interior es valido aqui, exterior tambien\r\n    }  // interior se libera aqui\r\n\r\n    println!("Solo queda: {}", exterior);\r\n    // interior ya no existe, pero exterior sigue vivo\r\n}  // exterior se libera aqui',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Analogía:** Piensa en el scope como una habitación. Cuando creas una variable, entra a la habitación. Cuando el bloque `{}` termina, la habitación se cierra y todo lo que estaba dentro se limpia automáticamente. Las variables de la habitación exterior siguen vivas porque su habitación no ha cerrado aun.",
				},
				{
					type: "text",
					body: "## Ownership en acción: un ejemplo paso a paso\r\n\r\nVeamos como Rust maneja la memoria automáticamente comparado con lo que tendrías que hacer manualmente en C:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    // Paso 1: Rust reserva memoria para "Hola Rust"\r\n    let saludo = String::from("Hola Rust");\r\n    // En C, esto seria: char* saludo = malloc(...);\r\n\r\n    println!("{}", saludo);\r\n\r\n    // Paso 2: Creamos otro valor\r\n    let despedida = String::from("Adios");\r\n    // En C: char* despedida = malloc(...);\r\n\r\n    println!("{}", despedida);\r\n\r\n    // Paso 3: Llegamos al final del scope (el cierre de main)\r\n    // Rust automaticamente hace:\r\n    //   drop(despedida)  -> libera "Adios"\r\n    //   drop(saludo)     -> libera "Hola Rust"\r\n    // En C, OLVIDAR free() aqui causaria un memory leak.\r\n    // En Rust, es IMPOSIBLE olvidarse. El compilador se encarga.\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## ¿Por qué es revolucionario?\r\n\r\nCompara las tres estrategias:\r\n\r\n| Estrategia | Ventaja | Desventaja |\r\n|-----------|---------|------------|\r\n| **Manual** (C/C++) | Máximo control y rendimiento | Fácil cometer errores fatales |\r\n| **Garbage Collector** (Python/Java/JS) | Cómodo, sin errores de memoria | Pausas impredecibles, más lento |\r\n| **Ownership** (Rust) | Sin errores Y sin costo extra | Curva de aprendizaje al principio |\r\n\r\nRust te da lo mejor de ambos mundos: la seguridad del garbage collector con el rendimiento del manejo manual. El "precio" es que debes aprender las reglas de ownership, pero una vez que las entiendes, el compilador hace todo el trabajo pesado por ti.',
				},
				{
					type: "quiz",
					question:
						"¿Cuándo se libera automáticamente la memoria de una variable en Rust?",
					options: [
						{
							text: "Cuando el garbage collector decide liberarla",
							correct: false,
						},
						{
							text: "Cuando el programador llama a free() o drop()",
							correct: false,
						},
						{
							text: "Cuando su owner sale del scope (el bloque {} donde fue creada)",
							correct: true,
						},
						{
							text: "Al final del programa",
							correct: false,
						},
					],
					explanation:
						"Rust inserta la liberación (`drop`) en el punto exacto donde el owner sale de su scope — y lo decide al **compilar**. No hay garbage collector vigilando en runtime ni `free()` manual: por eso no hay pausas ni fugas.",
				},
				{
					type: "quiz",
					question:
						"¿Cuántos owners puede tener un valor en Rust al mismo tiempo?",
					options: [
						{
							text: "Tantos como se necesiten",
							correct: false,
						},
						{
							text: "Exactamente uno",
							correct: true,
						},
						{
							text: "Dos como máximo",
							correct: false,
						},
						{
							text: "Depende del tipo de dato",
							correct: false,
						},
					],
					explanation:
						"Regla 2 del ownership: **exactamente un** owner a la vez, para cualquier tipo. Si dos variables fueran dueñas del mismo dato del heap, ambas intentarían liberarlo al salir de scope — un *double free*. El move existe justamente para impedirlo.",
				},
				{
					type: "callout",
					variant: "tip",
					body: '**Cómo leer cualquier método en Rust: mira el receptor primero**\n\nRust tiene cientos de métodos. La buena noticia: **no necesitas memorizarlos**. Casi todos empiezan por el mismo sitio — el **receptor**, el primer "parámetro" oculto que dice qué le hace el método al valor sobre el que lo llamas. Solo hay tres receptores posibles, y cada uno ya te anticipa qué esperar de vuelta.\n\nEn `texto.to_lowercase()`, ese `texto` de la izquierda es el receptor. Aprende a leer estos tres y habrás entendido el 90% de los métodos de Rust de un vistazo:\n\n| Receptor | Qué le hace al valor | Qué esperar de vuelta | Ejemplos |\n|---|---|---|---|\n| `&self` | Lo **presta para leerlo** (no lo toca, no se vuelve dueño) | Un **valor NUEVO** que tú decides guardar; el original sigue intacto | `.to_lowercase()`, `.len()`, `.iter()` |\n| `&mut self` | Lo **muta en sitio** (lo cambia ahí mismo, sin moverlo) | Casi siempre **`()`** (nada): el cambio ya quedó en la variable | `.push(...)`, `.push_str(...)`, `.sort_by(...)` |\n| `self` | Lo **consume** (se vuelve dueño y el valor se mueve adentro) | Un **valor nuevo**; la variable original **ya no se puede usar** | `.unwrap()`, `.map(...)`, `.collect()` |\n\nAntes de usar cualquier método, hazte estas tres preguntas — y fíjate que **el receptor ya las responde**:\n\n1. **¿Tengo que guardar el resultado?** → Con `&self` y `self`, **sí** (devuelven algo nuevo: `let x = texto.to_lowercase();`). Con `&mut self`, **no** suele haber nada que guardar: el cambio ya está en la variable.\n2. **¿Puedo seguir usando la variable después?** → Con `&self` y `&mut self`, **sí** (solo se prestó). Con `self`, **no** (se consumió: se movió adentro del método).\n3. **¿Necesito declarar la variable como `mut`?** → Solo `&mut self` lo exige (va a cambiar el valor). `&self` y `self` no.\n\n> **Regla de bolsillo:** `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio (y no te devuelve nada) · `self` = se lo come (y la variable original muere).',
				},
				{
					type: "faded-exercise",
					conceptId: "m03-own-return-len",
					title: "🟢 Guiado: devolver el ownership para no perder el dato",
					intro:
						"Un usuario sube un archivo a tu servidor. Quieres dos cosas a la vez: saber **cuántos bytes mide** su nombre y **conservar el nombre** para guardarlo después. El problema: si pasas el `String` por valor, la función se vuelve dueña y lo pierdes. La solución de esta lección (todavía sin referencias): **toma el ownership y devuélvelo junto al dato calculado**. Observa, completa y hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `devolver_nombre` recibe un `String` **por valor** (se vuelve su dueña) y, en vez de quedárselo, lo **devuelve** con `s` en la última línea sin `;`. Así el ownership vuelve a quien la llamó. El receptor del parámetro es `self`-style: se lo come... pero lo escupe de vuelta.",
							code: "fn devolver_nombre(s: String) -> String {\n    s\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** `procesar_nombre` debe calcular la longitud en bytes con `.len()` **antes** de devolver el `String`, y entregar ambas cosas en una tupla `(usize, String)`. Rellena los `___`: primero guarda la longitud, luego devuelve la tupla con la longitud y el `String` intacto.",
							code: "fn procesar_nombre(s: String) -> (usize, String) {\n    let longitud = s.___();\n    (___, s)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `procesar_nombre` desde la firma: recibe un `String` por valor, calcula su `.len()`, y devuelve `(usize, String)` para no perder el nombre. Recuerda calcular la longitud ANTES de devolver `s` (después de moverlo ya no podrías leerlo).",
							code: "fn procesar_nombre(s: String) -> (usize, String) {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    let (n, nombre) = procesar_nombre(String::from("informe_final.pdf"));\n    assert_eq!(n, 17, "\'informe_final.pdf\' mide 17 bytes");\n    assert_eq!(nombre, "informe_final.pdf", "el nombre debe devolverse intacto");\n\n    let (n2, nombre2) = procesar_nombre(String::from("a.txt"));\n    assert_eq!(n2, 5, "\'a.txt\' mide 5 bytes");\n    assert_eq!(nombre2, "a.txt");\n\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn procesar_nombre(s: String) -> (usize, String) {\n    let longitud = s.len();\n    (longitud, s)\n}",
				},
				{
					type: "exercise",
					title:
						"🟡 Aplica: registrar una subida sin perder el nombre del archivo",
					language: "rust",
					prompt:
						'Estás escribiendo el backend de una galería de fotos. Cuando un usuario sube un archivo, necesitas **registrar cuántos bytes mide su nombre** (para una métrica interna) pero también **conservar el nombre** para mostrarlo en la respuesta. Si pasas el `String` a una función por valor, la función se vuelve su dueña y `main` lo pierde.\n\nTu tarea: completa `registrar_subida` para que **tome el ownership del nombre, calcule su longitud en bytes y devuelva ambos** en una tupla `(String, usize)` — el `String` primero (para recuperarlo), la longitud después. En `main`, recibe el ownership de vuelta con `let (archivo, bytes) = ...` y úsalo.\n\nRestricciones de esta lección: **sin `&` y sin `.clone()`** (los verás más adelante). Aquí practicas el patrón "tomo posesión y la devuelvo". Solo necesitas `.len()` y devolver una tupla.',
					starterCode:
						'fn registrar_subida(nombre: String) -> (String, usize) {\n    // 1. calcula la longitud en bytes ANTES de devolver el String\n    // 2. devuelve (nombre, longitud)\n    \n}\n\nfn main() {\n    let archivo = String::from("vacaciones.png");\n\n    // recupera el ownership con let (archivo, bytes) = ...\n    let (archivo, bytes) = registrar_subida(archivo);\n\n    println!("Subido \'{}\' ({} bytes en el nombre)", archivo, bytes);\n}',
					solution:
						'fn registrar_subida(nombre: String) -> (String, usize) {\n    let bytes = nombre.len();\n    (nombre, bytes)\n}\n\nfn main() {\n    let archivo = String::from("vacaciones.png");\n\n    let (archivo, bytes) = registrar_subida(archivo);\n\n    println!("Subido \'{}\' ({} bytes en el nombre)", archivo, bytes);\n}',
					hints: [
						"El receptor de `.len()` es `&self`: solo **lee** el `String` y te devuelve un `usize` nuevo. No consume el `nombre`, así que puedes calcular `nombre.len()` y todavía devolver `nombre` después.",
						"Cuidado con el orden: calcula la longitud **antes** de poner `nombre` dentro de la tupla. Si devolvieras `nombre` primero y luego intentaras leerlo, ya lo habrías movido.",
						"El cuerpo son dos pasos: `let bytes = nombre.len();` (con `;`) y luego la tupla `(nombre, bytes)` como última expresión **sin** `;`. Esa última línea mueve el ownership de vuelta a `main`.",
					],
					explanation:
						'**Lo que practicaste:** el patrón "tomar ownership y devolverlo". La función se vuelve dueña del `String`, hace su trabajo, y al devolverlo transfiere el ownership de vuelta a `main` — por eso `let (archivo, bytes) = registrar_subida(archivo)` te deja seguir usando `archivo`.\n\n**Por qué funcionó el orden:** `.len()` tiene receptor `&self` (solo presta el dato para leerlo), así que pudimos medir el nombre y **después** moverlo de vuelta en la tupla. Si hubiéramos movido `nombre` primero, leerlo luego sería un *use-after-move*.\n\n**En código real** este patrón aparece cuando una función necesita *consumir* de verdad un valor (guardarlo en una estructura, enviarlo a otro hilo) pero también devolverte un resultado calculado. Aun así, devolver el dato en cada llamada es incómodo: en la próxima lección verás **referencias (`&`)**, que te dejan prestar el nombre para leerlo sin moverlo ni devolverlo — lo que harás el 90% del tiempo.',
				},
			],
		},
		{
			id: "m03_l02",
			moduleId: "m03",
			moduleSlug: "m03_ownership",
			order: 2,
			title: "Move: como se transfiere el ownership",
			blocks: [
				{
					type: "first-principles",
					title: "Move: ¿qué pasa cuando entregas la llave?",
					problem:
						"Si dos variables creen ser dueñas del mismo dato en el heap, ambas podrían intentar liberarlo. Eso causa errores graves. Rust evita que haya dos dueños activos del mismo valor.",
					mentalModel:
						"Mover un valor es entregar la llave, no hacer una fotocopia de la casa. La variable anterior deja de poder usar ese valor porque ya no es responsable de él.",
					concreteExample:
						"Si `nombre` contiene un `String` y haces `let otro = nombre`, Rust mueve el ownership a `otro`. Usar `nombre` después sería como intentar entrar con una llave que ya entregaste.",
					remember:
						"Move protege contra dobles liberaciones y contra confusión sobre quién debe limpiar.",
				},
				{
					type: "challenge",
					conceptId: "m03-move-return",
					title: "Antes de leer: recibe, modifica y devuelve",
					prompt:
						"**Tu reto:** escribe `agregar(s: String) -> String` que reciba un `String`, le añada un `!` al final, y lo devuelva.\n\nPista: para poder modificarlo el parámetro debe ser `mut s: String`, y `s.push('!')` agrega un carácter. Inténtalo y dale a Verificar.",
					starterCode:
						"fn agregar(mut s: String) -> String {\n    // modifica s y devuélvelo\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(agregar(String::from("hola")), "hola!");\n    assert_eq!(agregar(String::from("")), "!");\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Son dos pasos separados: primero muta `s` con `s.push('!')` (línea con `;`), después devuélvela.",
						"Para devolver `s`, escríbela sola en la última línea, **sin** punto y coma. Eso mueve el ownership de vuelta a quien llamó.",
					],
					solution:
						"fn agregar(mut s: String) -> String {\n    s.push('!');\n    s\n}",
					reveal:
						"Aquí el `String` **se mueve** hacia la función (que se vuelve su dueña), se modifica, y luego se mueve **de vuelta** al devolverlo:\n\n```rust\nfn agregar(mut s: String) -> String {\n    s.push('!');\n    s   // devolvemos el ownership a quien llamó\n}\n```\n\nEste patrón de \"toma posesión y devuélvela\" era la única forma de compartir datos antes de aprender *referencias*. Es seguro pero incómodo — por eso en la próxima lección verás cómo *prestar* un dato sin moverlo. 👇",
				},
				{
					type: "text",
					body: '## Antes de empezar: Stack y Heap\r\n\r\nPara entender por que algunos valores se "mueven" y otros se "copian", necesitas entender donde viven los datos en memoria. Tu computador tiene dos zonas de memoria que los programas usan:\r\n\r\n### El Stack (pila)\r\nImagina una **pila de platos**. Solo puedes poner un plato encima (apilar) o quitar el de arriba (desapilar). Es muy rápido porque siempre sabes donde esta el último plato. El stack funciona igual:\r\n- Es **super rápido** (apilar y desapilar son operaciones triviales)\r\n- Los datos deben tener un **tamaño fijo conocido** al compilar\r\n- Se limpia automáticamente cuando la función termina\r\n- Aquí viven: números (`i32`, `f64`), booleanos (`bool`), caracteres (`char`), y datos de tamaño fijo\r\n\r\n### El Heap (monton)\r\nImagina un **estacionamiento grande**. Cuando llega un carro, el encargado busca un espacio libre y te da un ticket con la ubicación. El heap funciona igual:\r\n- Es **más lento** (hay que buscar espacio libre y recordar donde esta)\r\n- Los datos pueden tener **tamaño variable** (pueden crecer o encogerse)\r\n- Hay que liberar el espacio explícitamente (o que el sistema lo haga por ti)\r\n- Aquí viven: `String`, `Vec`, `HashMap`, y cualquier dato de tamaño variable',
				},
				{
					type: "callout",
					variant: "info",
					body: "**Resumen simple:**\r\n- **Stack** = rápido, tamaño fijo, se limpia solo. Como una pila de platos.\r\n- **Heap** = más lento, tamaño variable, alguien debe liberar el espacio. Como un estacionamiento.\r\n- Un `i32` (4 bytes fijos) vive en el stack. Un `String` (puede tener 5 o 5000 caracteres) vive en el heap.",
				},
				{
					type: "text",
					body: '## String vs &str: un ejemplo concreto\r\n\r\nAhora que sabes que es el stack y el heap, veamos los dos tipos de texto en Rust:\r\n\r\n- **`&str`** (string slice): texto de tamaño fijo. Generalmente vive en el binario del programa (se "hornea" cuando compilas). Es una referencia a texto que ya existe en algún lugar. No puedes modificarlo.\r\n- **`String`**: texto de tamaño variable que vive en el heap. Puedes agregarle texto, quitarle, cambiarlo. Es el tipo que tiene ownership.\r\n\r\nPiensa en `&str` como un **cartel pegado en la pared** (fijo, no lo puedes cambiar), y `String` como una **pizarra** (puedes escribir, borrar, y escribir más):',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    // &str - texto fijo, en el binario del programa\r\n    let saludo: &str = "hola mundo";\r\n    // No puedo hacer: saludo.push_str("!"); // ERROR!\r\n\r\n    // String - en el heap, puede crecer y cambiar\r\n    let mut mensaje = String::from("hola");\r\n    mensaje.push_str(" mundo");        // Agregar texto\r\n    mensaje.push(\'!\');                 // Agregar un caracter\r\n\r\n    println!("&str: {}", saludo);\r\n    println!("String: {}", mensaje);\r\n    println!("Longitud: {} bytes", mensaje.len());\r\n    println!("Capacidad reservada: {} bytes", mensaje.capacity());\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "tip",
					body: "## La trampa nº1 viniendo de Python/JS: `.push()` vs `.to_lowercase()`\n\nMira las dos fichas **juntas**. Una **muta en sitio** y devuelve nada; la otra **no toca el original** y te devuelve un valor nuevo. Confundirlas es el error más común al venir de Python/JS.\n\n### `.push(c)` — agrega un carácter al final\n\n| | |\n|---|---|\n| **Qué hace** | Agrega un `char` al final del `String`, alargándolo. |\n| **Receptor** | `&mut self` → **muta** (lo cambia en sitio). |\n| **Devuelve** | `()` (nada). El cambio ya quedó en el original. |\n| **Trampa Py/JS** | En JS `arr.push(x)` muta el array Y devuelve la nueva longitud; aquí `.push()` devuelve `()`, así que `let n = s.push('!')` te da `()`, no un número. Y como muta, el `String` **debe** ser `let mut`. |\n\n### `.to_lowercase()` — versión en minúsculas\n\n| | |\n|---|---|\n| **Qué hace** | Calcula una versión en minúsculas del texto. |\n| **Receptor** | `&self` → **presta** (solo lo mira, no lo cambia). |\n| **Devuelve** | un `String` **NUEVO**. El original queda **igual**. |\n| **Trampa Py/JS** | En Python `s.lower()` también devuelve uno nuevo… pero ahí da igual porque reasignas o lo usas al vuelo. En Rust, si escribes `s.to_lowercase();` y no guardas el resultado, **lo tiras a la basura**: el original sigue en MAYÚSCULAS. Tienes que hacer `let s = s.to_lowercase();`. |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.\n\n**Regla de bolsillo:** ¿el método pide `&mut self`? → muta, necesitas `let mut` y el efecto ya quedó. ¿Pide `&self` y devuelve algo? → el cambio está en lo que **devuelve**, no en el original; si no lo guardas, lo pierdes.",
				},
				{
					type: "faded-exercise",
					conceptId: "m03-mutar-vs-devolver",
					title: "🟢 Guiado: mutar en sitio vs devolver nuevo",
					intro:
						"Estás registrando usuarios. Al guardar un nombre de usuario quieres pasarlo a minúsculas (para que `Jean_Pierre`, `JEAN_PIERRE` y `jean_pierre` sean la misma cuenta). Vas a ver el contraste entre un método que **muta en sitio** y otro que **devuelve un valor nuevo** — y por qué el segundo te obliga a reasignar.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa cómo MUTA en sitio.** `.push_str` recibe `&mut self`: cambia el `String` directamente y devuelve `()`. Por eso `saludo` **tiene que ser `let mut`** y NO reasignamos: el efecto ya quedó dentro de `saludo`. Mira que después de llamarlo, `saludo` ya trae el sufijo.",
							code: 'fn main() {\n    let mut saludo = String::from("hola");\n    saludo.push_str(", usuario");   // &mut self: muta en sitio, devuelve ()\n    // NO hacemos: let saludo = saludo.push_str(...)  -> eso daria ()\n    println!("{}", saludo);          // hola, usuario\n}',
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa la que DEVUELVE un valor nuevo.** `.to_lowercase()` recibe `&self`: NO toca el original, te entrega un `String` nuevo. Si no lo guardas, lo pierdes. Rellena los `___` para **reasignar** el resultado y devolver el nombre ya en minúsculas. (Pista: reasignar con `let nombre = ...` reusa el nombre; aquí no necesitas `mut` porque no estás mutando, estás reemplazando.)",
							code: "fn a_minusculas(nombre: String) -> String {\n    let nombre = nombre.___();   // &self: devuelve un String NUEVO en minusculas\n    ___                          // devuelve el nombre normalizado (sin punto y coma)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo, desde la firma.** Escribe `a_minusculas`: recibe un `String` (toma ownership), lo pasa a minúsculas con `.to_lowercase()` y **devuelve** ese nuevo `String`. Recuerda: `.to_lowercase()` no muta, así que el cambio vive en lo que devuelve.",
							code: "fn a_minusculas(nombre: String) -> String {\n    // tu codigo aqui\n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(a_minusculas(String::from("Jean_Pierre")), "jean_pierre");\n    assert_eq!(a_minusculas(String::from("ANA")), "ana");\n    assert_eq!(a_minusculas(String::from("user_007")), "user_007");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn a_minusculas(nombre: String) -> String {\n    let nombre = nombre.to_lowercase();\n    nombre\n}",
				},
				{
					type: "text",
					body: "## Move: transferencia de ownership\r\n\r\nAhora viene la parte que hace a Rust único. Cuando asignas un valor del heap (como `String`) a otra variable, **el ownership se transfiere**. Esto se llama **move** (mover). La variable original deja de ser válida:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    let s1 = String::from("hola");\r\n    let s2 = s1;  // Ownership se MUEVE de s1 a s2\r\n\r\n    // s1 ya NO es valida. s2 es el nuevo dueno.\r\n    println!("{}", s1);  // ERROR! s1 ya no existe\r\n}',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: '**Error del compilador:**\r\n```\r\nerror[E0382]: borrow of moved value: `s1`\r\n --> src/main.rs:5:20\r\n  |\r\n2 |     let s1 = String::from("hola");\r\n  |         -- move occurs because `s1` has type `String`\r\n3 |     let s2 = s1;\r\n  |              -- value moved here\r\n5 |     println!("{}", s1);\r\n  |                    ^^ value borrowed here after move\r\n```\r\nEl compilador te dice exactamente que paso: el valor se movio en la línea 3, y en la línea 5 intentas usarlo después del move.',
				},
				{
					type: "text",
					body: '## ¿Por qué Move y no simplemente copiar?\r\n\r\nPodrías preguntar: ¿por qué Rust no simplemente copia el `String`? El problema es que `String` tiene datos en el heap. Si Rust copiara, ambas variables apuntarían a la **misma memoria** en el heap:\r\n\r\n1. `s1` apunta a "hola" en el heap\r\n2. Si `s2` fuera una copia, también apuntaría a "hola" en el heap\r\n3. Cuando `s1` sale del scope, Rust libera "hola" del heap\r\n4. Cuando `s2` sale del scope, Rust intentaría liberar "hola" **otra vez**\r\n5. Esto es un **double free** — un bug grave que puede causar crashes o corrupción de datos\r\n\r\nEl move resuelve esto elegantemente: al mover el ownership, solo hay **un dueño**, y la memoria se libera **exactamente una vez**.',
				},
				{
					type: "text",
					body: "## Mirémoslo por debajo: un `String` son dos piezas\r\n\r\nPara que el *move* tenga sentido de verdad, hay que ver qué es un `String` en memoria. **No es una sola cosa: son dos piezas en dos lugares distintos.**\r\n\r\nLa variable que está en el **stack** no contiene el texto. Contiene tres números de tamaño fijo (24 bytes en total): un **puntero** (`ptr`) a dónde vive el texto en el heap, la **longitud** (`len`, cuántos bytes mide ahora) y la **capacidad** (`cap`, cuánto reservó). El texto en sí vive en el **heap**:",
				},
				{
					type: "code",
					language: "text",
					code: "   s : ┌──────┬───────┬───────┐\n       │ ptr  │ len=4 │ cap=4 │   <- vive en el STACK (24 bytes, tamano FIJO)\n       └──┬───┴───────┴───────┘\n          │\n          ▼\n       ┌───┬───┬───┬───┐\n       │ h │ o │ l │ a │           <- vive en el HEAP (tamano VARIABLE)\n       └───┴───┴───┴───┘",
					runnable: false,
				},
				{
					type: "text",
					body: '## Qué copia *realmente* un move\r\n\r\nAhora la palabra "mover" deja de sonar dramática. Cuando haces `let s2 = s1`, Rust **solo copia los 24 bytes del header** (ptr/len/cap) de un slot del stack a otro. **El heap no se toca, no se mueve, no se copia.** Es baratísimo.\r\n\r\nEl problema es lo que queda después: los dos headers tendrían el **mismo `ptr`**, apuntando al mismo `"hola"`. Si Rust dejara vivas a las dos, al salir de scope cada una liberaría ese heap → *double free*. Por eso **invalida `s1`**: solo `s2` queda como dueña.',
				},
				{
					type: "code",
					language: "text",
					code: '   let s2 = s1;   copia SOLO el header. El heap NO se mueve ni se copia.\n\n       s1 (header)                    s2 (header)\n   ┌──────┬───────┬───────┐       ┌──────┬───────┬───────┐\n   │ ptr  │ len=4 │ cap=4 │       │ ptr  │ len=4 │ cap=4 │\n   └──┬───┴───────┴───────┘       └──┬───┴───────┴───────┘\n      │   x s1 INVALIDADA            │\n      │     (Rust la tacha)          │\n      └───────────────┬─────────────┘\n                      ▼\n               ┌───┬───┬───┬───┐\n               │ h │ o │ l │ a │   <- un UNICO "hola" en el heap\n               └───┴───┴───┴───┘',
					runnable: false,
				},
				{
					type: "callout",
					variant: "tip",
					body: '**La frase para recordar:** el move no copia el texto, solo cambia **quién tiene las llaves**. Por eso es trivial (24 bytes) y por eso `s1` *tiene* que quedar inválida — para que el heap se libere exactamente una vez.\r\n\r\nY por eso `.clone()` SÍ es caro: clonar va al heap, **reserva memoria nueva** y copia `"hola"` byte por byte, para que cada `String` tenga su propio `ptr` a su propio texto independiente.',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    // Move en accion - esto SI funciona\r\n    let s1 = String::from("hola");\r\n    let s2 = s1;  // s1 se mueve a s2\r\n\r\n    // Solo s2 es valido ahora\r\n    println!("s2 = {}", s2);  // OK!\r\n    // println!("s1 = {}", s1);  // Esto daria error\r\n\r\n    // Otro ejemplo: reasignar tambien funciona\r\n    let a = String::from("primero");\r\n    let b = String::from("segundo");\r\n    let c = a;  // a se mueve a c\r\n    // a ya no es valida, pero b y c si\r\n    println!("b = {}, c = {}", b, c);\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: '**Piensa en el move como pasar un paquete:** Si le pasas un paquete a alguien, tu ya no lo tienes. No desaparece, simplemente cambio de manos. En Rust, `let s2 = s1;` pasa el "paquete" (los datos de String) de `s1` a `s2`. Después del move, `s1` tiene las manos vacias.',
				},
				{
					type: "quiz",
					question:
						"Qué pasa cuando haces `let s2 = s1;` donde s1 es un String?",
					options: [
						{
							text: "s1 se copia a s2, ambas variables son válidas",
							correct: false,
						},
						{
							text: "El ownership se mueve de s1 a s2, s1 ya no es válida",
							correct: true,
						},
						{
							text: "s1 y s2 comparten la misma memoria",
							correct: false,
						},
						{
							text: "Error de compilación",
							correct: false,
						},
					],
					explanation:
						"Como `String` posee memoria en el heap y no es `Copy`, la asignación **transfiere** el ownership: `s2` es el nuevo dueño y `s1` queda inválida. Ojo: la línea compila perfectamente — el error solo aparece si intentas *usar* `s1` después.",
				},
				{
					type: "quiz",
					question:
						"¿Por qué Rust usa 'move' en lugar de copiar un String automáticamente?",
					options: [
						{
							text: "Porque copiar es muy lento",
							correct: false,
						},
						{
							text: "Para evitar que dos variables apunten a la misma memoria del heap, lo que causaria un double free",
							correct: true,
						},
						{
							text: "Porque Rust no sabe como copiar Strings",
							correct: false,
						},
						{
							text: "Es solo una preferencia de diseño sin razón técnica",
							correct: false,
						},
					],
					explanation:
						"Si ambas variables apuntaran al mismo bloque del heap, al salir de scope **cada una** intentaría liberarlo: double free, crashes, corrupción de memoria. El move garantiza un único responsable de la liberación. (Copiar de verdad también sería posible — pero costoso, y por eso Rust lo exige explícito con `.clone()`.)",
				},
				{
					type: "exercise",
					title: "Identificar y resolver use-after-move",
					language: "rust",
					prompt:
						"Este código simula procesar el nombre de un archivo subido a un servidor. **No compila** porque mueve `filename` a una función y luego intenta usarlo de nuevo.\n\nTu tarea: identifica dónde está el move y arregla el código **devolviendo el ownership**. Por ahora no uses `&` ni `.clone()` — esos los veremos en las siguientes lecciones. Aquí queremos que entiendas que una función puede recibir ownership y devolverlo.\n\nLa función `normalizar` debe:\n- Recibir un `String` (toma ownership)\n- Convertirlo a minúsculas (mutándolo internamente)\n- Devolver el `String` modificado (transfiere ownership de vuelta)",
					starterCode:
						'fn normalizar(s: String) {\n    let _lowered = s.to_lowercase();\n    // ¿qué pasa con s aquí?\n}\n\nfn main() {\n    let filename = String::from("MiArchivo.PDF");\n    normalizar(filename);\n\n    // ERROR: use of moved value `filename`\n    println!("Archivo procesado: {}", filename);\n}',
					solution:
						'fn normalizar(s: String) -> String {\n    s.to_lowercase()\n}\n\nfn main() {\n    let filename = String::from("MiArchivo.PDF");\n    let filename = normalizar(filename);\n\n    println!("Archivo procesado: {}", filename);\n}',
					hints: [
						"El move pasa cuando llamas `normalizar(filename)` — el ownership de la `String` se transfiere a la función. Después de eso `filename` ya no es válida en `main`.",
						"Para 'devolver' el ownership, la función debe tener tipo de retorno `-> String` y devolver la `String` al final.",
						"Como `filename` ya no es válida después del move, puedes shadowear con `let filename = normalizar(filename);` — creas una nueva variable con el mismo nombre que recibe el ownership de vuelta.",
					],
					explanation:
						'**Lo que aprendiste:** una función puede \'pedir prestado\' el ownership y devolverlo. Es un patrón válido pero **incómodo** — cada función que necesita usar un valor tiene que devolverlo después.\n\n**En la siguiente lección verás referencias (`&String`)**, que permiten pasar un valor SIN transferir ownership. Eso es lo que harás el 90% del tiempo en código real:\n```rust\nfn normalizar(s: &str) -> String { s.to_lowercase() }\nfn main() {\n    let filename = String::from("MiArchivo.PDF");\n    let lower = normalizar(&filename);\n    println!("{} → {}", filename, lower);  // ¡ambos válidos!\n}\n```\n\n**Cuándo SÍ es correcto tomar ownership:** cuando la función *consume* el valor (lo guarda en una estructura, lo envía a otro thread, lo cierra/libera). Ejemplo: `tokio::spawn(future)` toma ownership porque el future se ejecuta en otro contexto.',
				},
			],
		},
		{
			id: "m03_l03",
			moduleId: "m03",
			moduleSlug: "m03_ownership",
			order: 3,
			title: "Copy, Clone y ownership en funciones",
			blocks: [
				{
					type: "first-principles",
					title: "Copy y Clone: copiar no siempre cuesta lo mismo",
					problem:
						"A veces copiar un dato es barato, como copiar un número. Otras veces implica duplicar memoria en el heap, como copiar un texto largo. Rust no quiere esconder ese costo.",
					mentalModel:
						"`Copy` es como copiar un número en una nota adhesiva. `Clone` es como pedir una copia completa de un documento grande: se puede hacer, pero debe ser intencional.",
					concreteExample:
						"Un `i32` se copia automáticamente porque son pocos bytes. Un `String` no se copia automáticamente porque duplicar su contenido puede reservar memoria nueva. Por eso Rust exige `clone()` si quieres una copia real.",
					remember:
						"Cuando Rust te pide `clone()`, te está diciendo: “esto puede costar memoria y tiempo; confirma que lo quieres”.",
				},
				{
					type: "challenge",
					conceptId: "m03-clone-two",
					title: "Antes de leer: necesito dos copias",
					prompt:
						"**Tu reto:** escribe `dos_copias(s: &str) -> (String, String)` que devuelva **dos copias independientes** del texto recibido.\n\nPista: `s.to_string()` crea un `String` nuevo a partir de un `&str`. Inténtalo y dale a Verificar.",
					starterCode:
						"fn dos_copias(s: &str) -> (String, String) {\n    // crea dos String independientes\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(dos_copias("hi"), (String::from("hi"), String::from("hi")));\n    assert_eq!(dos_copias("rust"), (String::from("rust"), String::from("rust")));\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Una tupla se construye con paréntesis: `(a, b)`. Necesitas que ambos elementos sean `String` nuevos e independientes.",
						"`s.to_string()` crea un `String` nuevo a partir del `&str`. Llamarlo dos veces crea dos copias independientes — exactamente lo que piden.",
					],
					solution:
						"fn dos_copias(s: &str) -> (String, String) {\n    (s.to_string(), s.to_string())\n}",
					reveal:
						"Para tener **dos datos independientes** (cada uno con su propio dueño y su propia memoria) necesitas **copiarlos** explícitamente. `to_string()` (o `.clone()`) hace exactamente eso:\n\n```rust\nfn dos_copias(s: &str) -> (String, String) {\n    (s.to_string(), s.to_string())\n}\n```\n\nRust te obliga a ser explícito al copiar porque copiar puede costar memoria y tiempo. Tipos pequeños como `i32` se copian solos (son `Copy`); tipos con memoria propia como `String` requieren un `.clone()` deliberado. Eso es lo que verás ahora. 👇",
				},
				{
					type: "text",
					body: "## Los números SI se copian!\r\n\r\nEn la leccion anterior vimos que `String` se **mueve** al asignar. Pero si intentas lo mismo con números, funciona sin problemas:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    let x = 42;\r\n    let y = x;  // x se COPIA, no se mueve!\r\n\r\n    // Ambos son validos!\r\n    println!("x = {}, y = {}", x, y);\r\n\r\n    let a = true;\r\n    let b = a;  // Tambien se copia\r\n    println!("a = {}, b = {}", a, b);\r\n\r\n    let c = 3.14;\r\n    let d = c;  // Tambien se copia\r\n    println!("c = {}, d = {}", c, d);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## ¿Por qué los números se copian pero String no?\r\n\r\nLa respuesta tiene que ver con donde viven los datos:\r\n\r\n**Tipos que viven en el stack** (tamaño fijo y pequeño):\r\n- `i32`, `i64`, `u8`, `f64`, etc. (números)\r\n- `bool` (true/false)\r\n- `char` (un carácter Unicode)\r\n- Tuplas que solo contienen tipos Copy, como `(i32, bool)`\r\n\r\nEstos tipos implementan el **trait Copy** (no te preocupes por la palabra "trait" ahora, lo veremos después; solo piensa que es una "habilidad" que tiene el tipo). Copiar un número de 4 bytes es tan rápido que no tiene sentido moverlo: simplemente se duplica.\r\n\r\n**Tipos que viven en el heap** (tamaño variable):\r\n- `String` (texto que puede crecer)\r\n- `Vec<T>` (lista que puede crecer)\r\n- `HashMap<K, V>` (diccionario)\r\n\r\nEstos tipos **NO** implementan Copy. Copiar un String de 1 millon de caracteres sería costoso, así que Rust te obliga a ser explícito si quieres una copia.',
				},
				{
					type: "callout",
					variant: "info",
					body: "**Copy vs Clone - la diferencia clave:**\r\n- **Copy**: copia automática e implícita. Cuando haces `let y = x;`, si `x` es Copy, se copia sin que tu hagas nada. Es barato (solo tipos del stack).\r\n- **Clone**: copia explícita que TU decides hacer. Debes llamar `.clone()` manualmente. Puede ser costoso (crea una copia completa en el heap).\r\n\r\nRegla simple: si no haces nada especial, los tipos del stack se copian y los del heap se mueven.",
				},
				{
					type: "callout",
					variant: "tip",
					body: '**Ficha de anatomía — `.clone()`**\n\nLa usaste de pasada en el reto inicial. Vamos a abrirla del todo, porque es el botón que aprietas cuando Rust te dice "esto se movió" y tú quieres seguir usando el original.\n\n| | |\n|---|---|\n| **Qué hace** | Crea una **copia completa e independiente** de un valor del heap (un `String`, un `Vec`...): reserva memoria nueva y copia todo el contenido byte por byte. |\n| **Receptor** | `&self` → solo **mira** el original (lo presta, no lo consume). Por eso el original sigue válido después de clonar. |\n| **Devuelve** | Un valor NUEVO del mismo tipo (un `String` nuevo con su propia memoria en el heap). NO muta nada en sitio: el original queda intacto y ahora tienes **dos** datos. |\n| **Trampa Py/JS** | En Python/JS copiar un objeto suele ser implícito y "gratis en apariencia" (o te da una referencia compartida sin avisar). En Rust `.clone()` es **explícito y potencialmente caro**: cada `.clone()` de un `String` grande reserva heap y copia todo. Si aparece en tu código, Rust te está diciendo "confirma que de verdad quieres pagar esta copia". |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    // Copy: automatico para tipos del stack\r\n    let x = 5;\r\n    let y = x;  // Copy automatico\r\n    println!("x = {}, y = {}", x, y);  // Ambos validos\r\n\r\n    // Move: por defecto para tipos del heap\r\n    let s1 = String::from("hola");\r\n    // let s2 = s1;  // Esto MOVERIA s1, dejandolo invalido\r\n\r\n    // Clone: copia EXPLICITA para tipos del heap\r\n    let s2 = s1.clone();  // Crea una copia completa e independiente\r\n    println!("s1 = {}, s2 = {}", s1, s2);  // Ambos validos!\r\n\r\n    // s1 y s2 son ahora dos Strings completamente independientes\r\n    // Cada uno tiene su propia memoria en el heap\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Ownership y funciones\r\n\r\nPasar un valor a una función es exactamente como asignarlo a otra variable: si el tipo es Copy, se copia; si no, se mueve. Esto es fundamental:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn tomar_ownership(s: String) {\r\n    println!("Ahora soy dueno de: {}", s);\r\n}  // s sale del scope y se libera\r\n\r\nfn main() {\r\n    let mi_string = String::from("hola");\r\n    tomar_ownership(mi_string);  // Ownership se MUEVE a la funcion\r\n\r\n    println!("{}", mi_string);  // ERROR! mi_string ya no es valida\r\n}',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Error del compilador:**\r\n```\r\nerror[E0382]: borrow of moved value: `mi_string`\r\n```\r\nAl pasar `mi_string` a la función, el ownership se movio. La función ahora es la duena y cuando termina, el String se libera. `mi_string` queda invalido en `main`.",
				},
				{
					type: "text",
					body: "Pero los tipos Copy se pueden pasar sin problemas, porque se copian automáticamente:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn duplicar(x: i32) -> i32 {\r\n    x * 2\r\n}  // x (una copia del original) se libera, pero al original no le afecta\r\n\r\nfn main() {\r\n    let numero = 5;\r\n    let doble = duplicar(numero);  // numero se COPIA al parametro x\r\n\r\n    // numero sigue valido porque i32 es Copy\r\n    println!("numero = {}, doble = {}", numero, doble);\r\n}',
					runnable: true,
				},
				{
					type: "faded-exercise",
					conceptId: "m03-move-or-copy",
					title: "🟢 Guiado: ¿se mueve o se copia?",
					intro:
						"El mismo gesto —pasar un valor a una función— tiene dos finales distintos según el tipo. Un `i32` es `Copy`: se duplica solo y lo sigues usando. Un `String` vive en el heap: se **mueve**, y si quieres conservarlo tras pasarlo necesitas `.clone()`. Vamos a verlo, completarlo y hacerlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa (caso `Copy`).** Pasamos `edad` (un `i32`) a `imprimir_edad`. Como `i32` es `Copy`, la función recibe una **copia** y `edad` sigue válida después: la usamos otra vez en el `println!`. No hace falta clonar nada — copiar 4 bytes del stack es trivial.",
							code: 'fn imprimir_edad(e: i32) {\n    println!("Edad: {}", e);\n}\n\nfn main() {\n    let edad = 30;\n    imprimir_edad(edad);          // edad se COPIA al parámetro\n    println!("Sigo teniendo: {}", edad); // válido: i32 es Copy\n}',
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa (caso `String`, que se mueve).** Ahora `nombre` es un `String`: vive en el heap y **se mueve** al pasarlo. Pero queremos seguir usándolo en el `println!` de abajo. Rellena el `___` con el método de la ficha que crea una **copia independiente** (`.clone()`) para entregar a la función sin ceder el original.\n\n> Pista: lee la ficha de `.clone()`. `&self`, devuelve un `String` NUEVO, reserva heap.",
							code: 'fn registrar(n: String) {\n    println!("Registrando a: {}", n);\n}\n\nfn main() {\n    let nombre = String::from("Ana");\n    registrar(nombre.___());          // entrega una copia, no el original\n    println!("Aún tengo: {}", nombre); // debe seguir siendo válido\n}',
						},
						{
							kind: "solo",
							instructions:
								'**Paso 3 — tú solo.** Desde esta firma, escribe `duplicar_saludo`: recibe un `&str` **prestado** (no toma ownership) y devuelve una **tupla de dos `String` independientes** con el mismo texto. Como recibes un `&str` (solo lo miras), para *materializar* `String`s nuevos necesitas copiar el texto: `s.to_string()` crea un `String` nuevo a partir del `&str`.\n\n> Conecta receptor y coste: `&str` = "te lo presto para mirar"; cada `String` del resultado = su propia memoria en el heap. Dos `String` = dos copias reales.',
							code: "fn duplicar_saludo(s: &str) -> (String, String) {\n    // devuelve dos String independientes con el texto de s\n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(\n        duplicar_saludo("Hola"),\n        (String::from("Hola"), String::from("Hola"))\n    );\n    assert_eq!(\n        duplicar_saludo("Rust"),\n        (String::from("Rust"), String::from("Rust"))\n    );\n    assert_eq!(\n        duplicar_saludo(""),\n        (String::from(""), String::from(""))\n    );\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn duplicar_saludo(s: &str) -> (String, String) {\n    (s.to_string(), s.to_string())\n}",
				},
				{
					type: "text",
					body: "## ¿Cómo usar un String después de pasarlo a una función?\r\n\r\nSi cada función se lleva el ownership, como puedes seguir usando el valor? Hay tres estrategias:\r\n\r\n### Estrategia 1: Devolver el valor (incomodo pero funciona)",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn procesar_y_devolver(s: String) -> String {\r\n    println!("Procesando: {}", s);\r\n    s  // Devolvemos el ownership de vuelta\r\n}\r\n\r\nfn main() {\r\n    let saludo = String::from("hola");\r\n    let saludo = procesar_y_devolver(saludo);  // Recuperamos ownership\r\n    println!("Aun tengo: {}", saludo);  // Funciona!\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "### Estrategia 2: Clonar antes de pasar (costoso si el dato es grande)",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn consumir(s: String) {\r\n    println!("Consumido: {}", s);\r\n}\r\n\r\nfn main() {\r\n    let original = String::from("datos importantes");\r\n    consumir(original.clone());  // Pasamos una copia, no el original\r\n\r\n    println!("Original intacto: {}", original);  // Funciona!\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '### Estrategia 3: Usar referencias (la mejor solución!)\r\n\r\nEn la siguiente leccion aprenderemos sobre **referencias** (`&`), que permiten "prestar" un valor a una función sin transferir el ownership. Es la solución más elegante y eficiente, y la que usaras el 90% del tiempo en Rust.',
				},
				{
					type: "callout",
					variant: "info",
					body: "**Resumen de esta leccion:**\r\n- Los tipos del stack (`i32`, `bool`, `char`, `f64`) implementan **Copy** y se copian automáticamente.\r\n- Los tipos del heap (`String`, `Vec`) se **mueven** por defecto (el ownership se transfiere).\r\n- Si necesitas una copia de un tipo del heap, usa `.clone()` — pero es una copia completa y puede ser costoso.\r\n- Pasar un valor a una función sigue las mismas reglas: Copy copia, no-Copy mueve.\r\n- La solución elegante (referencias) viene en la siguiente leccion!",
				},
				{
					type: "quiz",
					question: "¿Cuál es la diferencia entre Copy y Clone?",
					options: [
						{
							text: "Copy es para tipos del stack (automático y barato), Clone es para tipos del heap (explícito, puede ser costoso)",
							correct: true,
						},
						{
							text: "Son lo mismo, solo que Clone es la versión moderna",
							correct: false,
						},
						{
							text: "Copy crea una referencia, Clone crea una copia",
							correct: false,
						},
						{
							text: "Clone es más rápido que Copy",
							correct: false,
						},
					],
					explanation:
						"`Copy` es implícito y barato: pocos bytes del stack que se duplican solos. `Clone` es explícito porque puede costar: reserva memoria nueva en el heap y copia todo el contenido. Rust te hace escribir `.clone()` para que ese costo quede visible en el código.",
				},
				{
					type: "quiz",
					question:
						"Qué pasa cuando pasas un String a una función sin usar & ni .clone()?",
					options: [
						{
							text: "El String se copia automáticamente",
							correct: false,
						},
						{
							text: "El ownership se mueve a la función, y la variable original queda invalida",
							correct: true,
						},
						{
							text: "Error de compilación siempre",
							correct: false,
						},
						{
							text: "La función recibe una referencia automáticamente",
							correct: false,
						},
					],
					explanation:
						'Pasar un argumento sigue exactamente las mismas reglas que `let`: los tipos no-Copy se **mueven**. La función se vuelve dueña y, al terminar, libera el valor. Nada ocurre "automáticamente": para prestar sin mover necesitas escribir `&` — eso viene en la próxima lección.',
				},
				{
					type: "exercise",
					title: "Clone consciente: evitar clonar lo que no hace falta",
					language: "rust",
					prompt:
						"Tu compañero escribió código que clona `String`s por todas partes para evitar errores de ownership. Esto **funciona** pero es ineficiente: cada `.clone()` copia toda la memoria del heap.\n\nTu tarea: simplifica el código eliminando los `.clone()` que NO son necesarios. Pista: en este ejemplo, **ninguno** lo es. Lo que necesitas es entender qué tipos son `Copy` y cómo eso afecta lo que necesitas clonar.\n\nReglas:\n- `i32`, `bool`, `char` y tipos similares son `Copy` → se copian solos.\n- `String`, `Vec`, `HashMap` NO son `Copy` → moves por defecto.\n- Solo necesitas `.clone()` si después de moverlo quieres seguir usando el original.\n\nReescribe `main` para evitar los `.clone()` innecesarios. Si una función toma ownership del último uso, **no necesitas clonar**.",
					starterCode:
						'fn imprimir_usuario(nombre: String, edad: u32) {\n    println!("{} ({} años)", nombre, edad);\n}\n\nfn longitud(texto: String) -> usize {\n    texto.len()\n}\n\nfn main() {\n    let nombre = String::from("Ana");\n    let edad = 25;\n\n    // Demasiados clones! El compilador acepta pero es ineficiente\n    imprimir_usuario(nombre.clone(), edad.clone());\n    let len = longitud(nombre.clone());\n    println!("Longitud: {}", len);\n}',
					solution:
						'fn imprimir_usuario(nombre: String, edad: u32) {\n    println!("{} ({} años)", nombre, edad);\n}\n\nfn longitud(texto: String) -> usize {\n    texto.len()\n}\n\nfn main() {\n    let nombre = String::from("Ana");\n    let edad = 25;\n\n    // edad es u32 (Copy): no necesita clone.\n    // nombre se mueve en imprimir_usuario; pero queremos usarlo después,\n    // así que ese clone SÍ es necesario.\n    imprimir_usuario(nombre.clone(), edad);\n\n    // En la última llamada, ya no usamos nombre después → mover está bien.\n    let len = longitud(nombre);\n    println!("Longitud: {}", len);\n}',
					hints: [
						"`edad` es `u32` (un entero). Los enteros son `Copy`: pasarlos a una función NO los mueve, simplemente se copian. `.clone()` sobre un `u32` es redundante.",
						"Para `nombre` mira **cuándo se usa por última vez**. Si después de una llamada no vuelves a usarlo, puedes simplemente moverlo (sin clonar) — el ownership pasa a la función y se libera ahí.",
						"Regla pragmática: la primera llamada necesita `.clone()` porque después vuelves a usar `nombre`. La última llamada no lo necesita porque es el último uso.",
					],
					explanation:
						"**Lo que ganaste:** una `.clone()` menos por iteración. Parece poco aquí, pero en código que procesa miles de strings por segundo (parsers, servidores, ETL) la diferencia es enorme.\n\n**Patrón a recordar:**\n\n1. **Tipos `Copy`** (números, booleanos, char, tuplas pequeñas con tipos Copy): nunca clones, no hace nada útil.\n2. **El último uso** de un valor no-Copy puede simplemente moverse — el ownership cede sin costo.\n3. **`.clone()` real** es para cuando *de verdad* necesitas el mismo dato vivo en dos lugares.\n\n**En la siguiente lección** verás que la solución *aún mejor* es usar referencias (`&String`/`&str`): así nunca mueves NI clonas, simplemente prestas el dato.",
				},
			],
		},
		{
			id: "m03_l04",
			moduleId: "m03",
			moduleSlug: "m03_ownership",
			order: 4,
			title: "Referencias y Borrowing",
			blocks: [
				{
					type: "first-principles",
					title: "Referencias: mirar o usar algo sin convertirte en dueño",
					problem:
						"Muchas funciones sólo necesitan leer un dato. Si cada lectura tuviera que tomar ownership, el código sería incómodo y movería valores innecesariamente.",
					mentalModel:
						"Una referencia es pedir prestado. Puedes leer el libro de alguien sin quedártelo. Si quieres escribir en él, necesitas un préstamo mutable y exclusivo.",
					concreteExample:
						"Una función que imprime un nombre no necesita quedarse con el `String`. Puede recibir `&String` o `&str`, leerlo y devolverlo al owner. Así evitas mover el dato sólo para mostrarlo en pantalla.",
					remember:
						"Borrowing permite compartir acceso sin perder ownership, pero Rust controla que no haya escritura peligrosa mientras otros leen.",
				},
				{
					type: "text",
					body: "## El Problema: tener que devolver el ownership es incomodo\r\n\r\nEn la leccion anterior vimos que pasar un `String` a una función mueve el ownership. Tener que devolver el valor cada vez es tedioso y poco práctico:",
				},
				{
					type: "faded-exercise",
					conceptId: "m03-borrow-len",
					title: "Práctica guiada: leer sin quedarte el dato",
					intro:
						"Vamos a escribir una función que lee un `String` prestado (`&String`) y devuelve su longitud, sin tomar posesión. Observa, completa y hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `contar_letras` recibe `&String` (un préstamo). Lee con `.len()` y NO se vuelve dueña: por eso quien la llama puede seguir usando su `String` después.",
							code: "fn contar_letras(texto: &String) -> usize {\n    texto.len()\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** Rellena los `___` para que `longitud` tome el `String` **prestado** y devuelva su tamaño.",
							code: "fn longitud(s: ___String) -> usize {\n    s.___()\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `longitud` desde cero: recibe `&String` y devuelve su `len()`.",
							code: "fn longitud(s: &String) -> usize {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    let s = String::from("hola");\n    assert_eq!(longitud(&s), 4, "longitud de \'hola\' deberia ser 4");\n    assert_eq!(s, "hola");\n    assert_eq!(longitud(&String::from("")), 0, "longitud de \'\' deberia ser 0");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution: "fn longitud(s: &String) -> usize {\n    s.len()\n}",
				},
				{
					type: "code",
					language: "rust",
					code: '// Esto es TERRIBLE - no hagas esto\r\nfn calcular_longitud(s: String) -> (String, usize) {\r\n    let len = s.len();\r\n    (s, len)  // Tenemos que devolver s para no perderlo\r\n}\r\n\r\nfn main() {\r\n    let s1 = String::from("hola");\r\n    let (s1, len) = calcular_longitud(s1);  // Incomodo!\r\n    println!("La longitud de \'{}\' es {}", s1, len);\r\n}',
					runnable: false,
				},
				{
					type: "text",
					body: "## La solución: Referencias (&)\r\n\r\nEn lugar de transferir el ownership, puedes **prestar** el valor usando una **referencia** (`&`). Es como prestarle un libro a un amigo: el amigo puede leerlo, pero tu sigues siendo el dueño.\r\n\r\nUna referencia te permite acceder a un valor **sin tomar ownership**. Esto se llama **borrowing** (prestamo):",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn calcular_longitud(s: &String) -> usize {  // &String = referencia a String\r\n    s.len()\r\n}  // s sale del scope, pero como NO tiene ownership, no se libera nada\r\n\r\nfn main() {\r\n    let s1 = String::from("hola mundo");\r\n    let len = calcular_longitud(&s1);  // &s1 = prestamos s1, no movemos\r\n\r\n    // s1 sigue siendo valida porque nunca cedimos ownership!\r\n    println!("La longitud de \'{}\' es {}", s1, len);\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Analogía del Borrowing:**\r\n- **Ownership** = ser dueño de un libro. Solo tu puedes decidir que pasa con el.\r\n- **Referencia inmutable** (`&`) = prestar el libro para que alguien lo lea. Pueden leerlo pero no escribir en el.\r\n- **Referencia mutable** (`&mut`) = prestar el libro con permiso para que escriban notas. Solo una persona puede tenerlo a la vez.\r\n- **Move** = regalar el libro. Ya no es tuyo.",
				},
				{
					type: "text",
					body: "## Referencias inmutables: multiples lectores\r\n\r\nPuedes tener **multiples referencias inmutables** al mismo tiempo. Esto es seguro porque nadie esta modificando el dato:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    let s = String::from("hola");\r\n\r\n    // Multiples referencias inmutables: OK!\r\n    let r1 = &s;\r\n    let r2 = &s;\r\n    let r3 = &s;\r\n\r\n    println!("r1: {}, r2: {}, r3: {}", r1, r2, r3);\r\n    // Todas leen el mismo dato. Es seguro porque nadie modifica.\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Referencias mutables: un solo escritor\r\n\r\nPara modificar un valor prestado, necesitas una **referencia mutable** (`&mut`). Pero Rust tiene una regla estricta: solo puedes tener **una referencia mutable** a la vez, y **no puedes mezclar** referencias mutables con inmutables:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn agregar_exclamacion(s: &mut String) {\r\n    s.push_str("!!!");\r\n}\r\n\r\nfn main() {\r\n    let mut s = String::from("hola");  // La variable debe ser mut\r\n    println!("Antes: {}", s);\r\n\r\n    agregar_exclamacion(&mut s);  // Prestamos de forma mutable\r\n    println!("Despues: {}", s);\r\n\r\n    // Podemos prestar &mut multiples veces, pero no simultaneamente\r\n    agregar_exclamacion(&mut s);\r\n    println!("Otra vez: {}", s);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## La regla fundamental del borrowing\r\n\r\nEsta regla es lo que hace a Rust especial:\r\n\r\n> En cualquier momento dado, puedes tener **O BIEN** una referencia mutable, **O BIEN** cualquier número de referencias inmutables. **Nunca ambas.**\r\n\r\nEsto previene **data races** (condiciones de carrera: cuando una parte del programa lee un dato mientras otra parte lo esta modificando al mismo tiempo, causando resultados impredecibles) en tiempo de compilación:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    let mut s = String::from("hola");\r\n\r\n    let r1 = &s;      // OK: primera referencia inmutable\r\n    let r2 = &s;      // OK: segunda referencia inmutable\r\n    let r3 = &mut s;  // ERROR! No puedes tener &mut mientras existan &\r\n\r\n    println!("{}, {}, {}", r1, r2, r3);\r\n}',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: '**Error del compilador:**\r\n```\r\nerror[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable\r\n --> src/main.rs:5:14\r\n  |\r\n3 |     let r1 = &s;\r\n  |              -- immutable borrow occurs here\r\n4 |     let r2 = &s;\r\n  |              -- immutable borrow occurs here\r\n5 |     let r3 = &mut s;\r\n  |              ^^^^^^ mutable borrow occurs here\r\n6 |     println!("{}, {}, {}", r1, r2, r3);\r\n  |                            -- immutable borrow later used here\r\n```\r\nImagina que mientras alguien lee un documento (referencia inmutable), otra persona lo esta editando (referencia mutable). El lector podría ver datos a medio cambiar. Rust previene esto.',
				},
				{
					type: "text",
					body: "## Non-Lexical Lifetimes (NLL): Rust es inteligente\r\n\r\nRust no solo mira donde se declara una referencia, sino donde se **usa por última vez**. Una referencia termina cuando ya no se necesita, no al final del scope:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\r\n    let mut s = String::from("hola");\r\n\r\n    let r1 = &s;\r\n    let r2 = &s;\r\n    println!("Inmutables: {} y {}", r1, r2);\r\n    // r1 y r2 ya no se usan despues de este punto\r\n\r\n    // Ahora SI podemos crear una referencia mutable\r\n    let r3 = &mut s;\r\n    r3.push_str(" mundo");\r\n    println!("Mutable: {}", r3);\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Ejemplo práctico: funciones que leen vs funciones que modifican",
				},
				{
					type: "code",
					language: "rust",
					code: '// Esta funcion solo LEE: recibe referencia inmutable\r\nfn primera_palabra(s: &String) -> &str {\r\n    let bytes = s.as_bytes();\r\n    for (i, &byte) in bytes.iter().enumerate() {\r\n        if byte == b\' \' {\r\n            return &s[0..i];\r\n        }\r\n    }\r\n    &s[..]\r\n}\r\n\r\n// Esta funcion MODIFICA: recibe referencia mutable\r\nfn a_mayusculas(s: &mut String) {\r\n    *s = s.to_uppercase();\r\n}\r\n\r\n// Esta funcion TOMA OWNERSHIP: recibe el String directo\r\nfn consumir(s: String) {\r\n    println!("Consumido: {}", s);\r\n    // s se libera aqui\r\n}\r\n\r\nfn main() {\r\n    let mut texto = String::from("hola mundo cruel");\r\n\r\n    // Leer (borrowing inmutable)\r\n    let palabra = primera_palabra(&texto);\r\n    println!("Primera palabra: {}", palabra);\r\n\r\n    // Modificar (borrowing mutable)\r\n    a_mayusculas(&mut texto);\r\n    println!("Mayusculas: {}", texto);\r\n\r\n    // Consumir (ownership transfer)\r\n    consumir(texto);\r\n    // println!("{}", texto);  // ERROR! texto fue movido\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Regla general para parámetros de función:**\r\n- Usa `&T` cuando la función solo necesita **leer** el dato.\r\n- Usa `&mut T` cuando la función necesita **modificar** el dato.\r\n- Usa `T` (sin referencia) solo cuando la función necesita **tomar ownership** (raro).\r\n- La mayoria de funciones usan `&T` o `&mut T`.",
				},
				{
					type: "quiz",
					question:
						"¿Cuántas referencias inmutables puedes tener a la vez de un mismo dato?",
					options: [
						{
							text: "Solo una",
							correct: false,
						},
						{
							text: "Máximo dos",
							correct: false,
						},
						{
							text: "Tantas como quieras, siempre que no haya una referencia mutable activa",
							correct: true,
						},
						{
							text: "Depende del tamaño del dato",
							correct: false,
						},
					],
					explanation:
						"Leer en paralelo es seguro porque nadie modifica. Lo prohibido es mezclar lectores con un escritor (`&mut`), porque un lector podría ver el dato a medio cambiar. De ahí la regla: muchos `&` **o** un solo `&mut`, nunca ambos.",
				},
				{
					type: "quiz",
					question:
						"¿Por qué Rust no permite tener una referencia mutable y una inmutable al mismo tiempo?",
					options: [
						{
							text: "Para ahorrar memoria",
							correct: false,
						},
						{
							text: "Porque previene data races: un lector podría ver datos a medio modificar",
							correct: true,
						},
						{
							text: "Es una limitacion del compilador que se arreglara en el futuro",
							correct: false,
						},
						{
							text: "Porque las referencias mutables son más lentas",
							correct: false,
						},
					],
					explanation:
						'Es la prevención de **data races** en compilación: si alguien escribe mientras otro lee, el lector puede observar un estado intermedio inválido. Rust no "detecta" ese bug en ejecución — directamente no permite que la combinación exista.',
				},
				{
					type: "exercise",
					title: "Procesar logs sin tomar ownership",
					language: "rust",
					prompt:
						'Estás procesando líneas de un archivo de log. Tu función actual **toma ownership** del `Vec<String>`, lo que significa que después de llamarla no puedes usar `logs` para nada más — un desperdicio enorme si necesitas hacer múltiples pasadas (contar, filtrar, indexar).\n\nTu tarea: convierte la función para que tome el log **prestado** sin transferir el ownership. Después debes poder seguir usando `logs` después de llamarla.\n\n1. Cambia la firma de `count_errors` para que reciba una **referencia inmutable** al vector en vez del vector completo.\n2. Asegúrate de que `main` siga compilando — y que la segunda línea (`println!("Total: {}", logs.len())`) **funcione** sin error de ownership.',
					starterCode:
						'fn count_errors(logs: Vec<String>) -> usize {\n    logs.iter().filter(|line| line.contains("ERROR")).count()\n}\n\nfn main() {\n    let logs = vec![\n        String::from("INFO  server started"),\n        String::from("ERROR  db connection failed"),\n        String::from("INFO  retry attempt 1"),\n        String::from("ERROR  db connection failed"),\n        String::from("INFO  retry attempt 2"),\n    ];\n\n    let errors = count_errors(logs);\n    println!("Errores: {}", errors);\n\n    // Esto NO compila ahora — pero debería:\n    println!("Total de líneas: {}", logs.len());\n}',
					solution:
						'fn count_errors(logs: &Vec<String>) -> usize {\n    logs.iter().filter(|line| line.contains("ERROR")).count()\n}\n\nfn main() {\n    let logs = vec![\n        String::from("INFO  server started"),\n        String::from("ERROR  db connection failed"),\n        String::from("INFO  retry attempt 1"),\n        String::from("ERROR  db connection failed"),\n        String::from("INFO  retry attempt 2"),\n    ];\n\n    let errors = count_errors(&logs);\n    println!("Errores: {}", errors);\n\n    // Ahora SÍ funciona: la función nunca tomó ownership.\n    println!("Total de líneas: {}", logs.len());\n}',
					hints: [
						"El tipo `Vec<String>` toma ownership. El tipo `&Vec<String>` (con ampersand) es solo una referencia: 'estoy mirando esto pero no soy su dueño'.",
						"Recuerda que cambiar la firma de la función te obliga a actualizar la llamada en `main` también: el argumento debe ser `&logs`, no `logs`.",
						"Idiomáticamente, en Rust se prefiere `&[String]` sobre `&Vec<String>` (más general). Para este ejercicio cualquiera de los dos vale, pero piensa en por qué `&[T]` es más flexible.",
					],
					explanation:
						'**Lo que ganaste:** la función ahora solo *toma prestado* el vector. El ownership se queda en `main`, así que puedes seguir leyendo `logs` después.\n\n**Patrón clave:** en Rust idiomático, el 90% del tiempo pasas referencias (`&T` o `&mut T`), no valores. Tomar ownership es una decisión consciente — generalmente cuando la función *consume* el dato (lo guarda, lo transforma irreversiblemente).\n\n**Versión aún más idiomática** que verás en código profesional:\n```rust\nfn count_errors(logs: &[String]) -> usize {\n    logs.iter().filter(|line| line.contains("ERROR")).count()\n}\n```\n`&[String]` (un slice) acepta `&Vec<String>`, `&[String; N]`, y subcadenas — más reutilizable. `&Vec<String>` solo acepta vectores completos.',
				},
			],
		},
		{
			id: "m03_l05",
			moduleId: "m03",
			moduleSlug: "m03_ownership",
			order: 5,
			title: "Slices",
			blocks: [
				{
					type: "first-principles",
					title: "Slices: ver una parte sin copiar todo",
					problem:
						"A menudo necesitas trabajar con una porción de datos: la primera palabra de un texto, una parte de una lista, un rango de bytes. Copiar todo sería lento y gastaría memoria.",
					mentalModel:
						"Un slice es una ventana sobre datos existentes. No posee la casa; sólo marca desde dónde hasta dónde estás mirando.",
					concreteExample:
						'Si tienes `"hola mundo"` y quieres `"hola"`, un slice puede apuntar a esa parte del texto original. No crea otro texto completo; sólo guarda referencia y longitud.',
					remember:
						"Un slice depende de que el dato original siga vivo. Por eso está conectado con lifetimes y borrowing.",
				},
				{
					type: "callout",
					variant: "tip",
					body: "### Ficha de anatomía: `s.find(' ')`\n\n| | |\n|---|---|\n| **Qué hace** | Busca la primera aparición de un carácter (o subtexto) y te dice en qué posición está. |\n| **Receptor** | `&self` → presta el texto, no lo consume ni lo muta; solo lo mira. |\n| **Devuelve** | `Option<usize>`: `Some(i)` con el índice del primer match, o `None` si no aparece. Valor NUEVO; el texto original queda intacto. |\n| **Trampa Py/JS** | En Python `\"abc\".find('x')` devuelve `-1` cuando no encuentra; en JS `indexOf` también. En Rust **no hay `-1`**: si no está, recibes `None`, y el compilador te obliga a manejar ese caso (con `match`). Imposible olvidarlo. |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.",
				},
				{
					type: "callout",
					variant: "tip",
					body: "### Ficha de anatomía: cortar un texto con `&s[..i]`\n\n| | |\n|---|---|\n| **Qué hace** | Crea una **ventana** (`&str`) sobre una porción del texto original, desde el inicio hasta el byte `i` **sin incluirlo**. |\n| **Receptor** | No es un método: es indexación con rango (`..i`) precedida de `&`. El `&` deja claro que es un **préstamo** del texto original, no una copia. |\n| **Devuelve** | Un `&str` (un slice). NO es un valor nuevo en el heap: apunta a los mismos bytes que `s`. Cero copia, cero allocation. |\n| **Trampa Py/JS** | En Python/JS `texto[:i]` te devuelve un **string nuevo e independiente**. En Rust `&s[..i]` es una vista *atada* a `s`: mientras la uses, Rust congela `s` y no te deja mutarlo. El fin (`i`) es **exclusivo**, igual que en Python. |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.",
				},
				{
					type: "callout",
					variant: "tip",
					body: "### Ficha de anatomía: `s.as_bytes()`\n\n| | |\n|---|---|\n| **Qué hace** | Te da el texto visto como su lista cruda de bytes (`&[u8]`), para recorrerlo byte a byte cuando quieres bajar al nivel más bajo. |\n| **Receptor** | `&self` → presta el texto; no lo consume ni lo muta. La vista de bytes apunta a los mismos datos. |\n| **Devuelve** | `&[u8]`: un slice de bytes. NO copia nada — es una vista prestada sobre la memoria del texto. |\n| **Trampa Py/JS** | En Python necesitas `s.encode()` y obtienes un `bytes` **nuevo**; aquí `as_bytes()` no crea nada, solo reinterpreta. Y un byte literal se escribe `b' '` (con la `b` delante): es un `u8`, no un carácter. Solo lo necesitas para el control byte a byte; casi siempre `.find()` es más simple. |\n\n> Lee el receptor: `self` = se lo come · `&self` = lo mira y te da algo nuevo · `&mut self` = lo cambia en sitio.",
				},
				{
					type: "challenge",
					conceptId: "m03-slice-first-word",
					title: "🔴 Reto real: devuelve la primera palabra",
					prompt:
						'Estás normalizando nombres de usuario: de `"ana garcía"` solo te interesa el **nombre de pila** (`"ana"`), o sea todo lo que hay antes del primer espacio. Si no hay espacios, el texto entero ya es la primera palabra.\n\nEscribe `primera_palabra(s: &str) -> &str`. Acabas de ver las tres fichas (`find`, `&s[..i]`, `as_bytes`): te dan justo lo que necesitas. Devuelve una **ventana** al texto original — no construyas un texto nuevo.\n\nAparece en código real cada vez que parseas la primera columna de un CSV, el primer token de un comando, o el nombre de pila de un formulario: cortar barato sin copiar.',
					starterCode:
						"fn primera_palabra(s: &str) -> &str {\n    // Idea: ¿en qué posición está el primer espacio?\n    // Si lo encuentras, devuelve la ventana hasta ahí. Si no, devuelve s entero.\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(primera_palabra("hola mundo"), "hola");\n    assert_eq!(primera_palabra("rust"), "rust");\n    assert_eq!(primera_palabra("uno dos tres"), "uno");\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Necesitas la **posición** del primer espacio. `s.find(' ')` te la da, envuelta en `Option<usize>`: `Some(i)` si hay espacio, `None` si no (en Rust no existe el `-1` de Python/JS).",
						"Usa `match` sobre ese `Option`, con dos brazos: el caso con espacio y el caso sin espacio.",
						"Con la posición `i`, la ventana hasta el espacio es `&s[..i]` (fin exclusivo, no incluye el espacio). Si no hubo espacio, el texto entero ya es la respuesta: devuelve `s`.",
						"Esqueleto:\n```rust\nmatch s.find(' ') {\n    Some(i) => &s[..i],\n    None => s,\n}\n```",
					],
					solution:
						"fn primera_palabra(s: &str) -> &str {\n    match s.find(' ') {\n        Some(i) => &s[..i],\n        None => s,\n    }\n}",
					reveal:
						"La clave es **no copiar nada**: en vez de construir un texto nuevo, devuelves un *slice* — una ventana al texto original (su tipo es `&str`).\n\n## La vía idiomática: `find` + `match`\n\nLo más directo es preguntarle al propio texto dónde está el primer espacio. `s.find(' ')` devuelve `Option<usize>`, y `match` te obliga a cubrir los dos casos:\n\n```rust\nfn primera_palabra(s: &str) -> &str {\n    match s.find(' ') {\n        Some(i) => &s[..i],  // hay espacio: ventana del inicio hasta él\n        None => s,           // sin espacio: el texto entero\n    }\n}\n```\n\n- `Some(i)` → hubo espacio en la posición `i`; `&s[..i]` es la ventana del inicio hasta justo antes del espacio.\n- `None` → no había espacio; la primera palabra es el texto completo, así que devuelves `s`.\n\nComo el slice apunta al texto original, Rust se asegura (vía borrowing) de que ese texto siga vivo mientras uses el slice. Eso es justo lo que verás a continuación. 👇\n\n## Versión \"por debajo\": byte a byte\n\n`find` ya hace este trabajo por ti, pero por dentro recorre los bytes buscando el espacio. Así se vería hecho a mano con `as_bytes()` — útil para entender qué ocurre, no porque debas escribirlo así:\n\n```rust\nfn primera_palabra(s: &str) -> &str {\n    let bytes = s.as_bytes();              // vista &[u8], sin copiar\n    for (i, &b) in bytes.iter().enumerate() {\n        if b == b' ' {                     // b' ' = el byte del espacio\n            return &s[..i];\n        }\n    }\n    s\n}\n```\n\nMisma idea, más piezas: `as_bytes()` para mirar los bytes, `enumerate()` para llevar el índice, y `b' '` para comparar con el byte del espacio. En el día a día, prefiere `find`: dice **qué** quieres, no **cómo** recorrerlo.",
				},
				{
					type: "text",
					body: "## El Problema: referencias que se desincronizan\r\n\r\nImagina que tienes un String y quieres trabajar con una parte de el. Si guardas la posición (índice) de la parte que te interesa, esa posición puede volverse invalida si el String cambia:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn primera_palabra_indice(s: &String) -> usize {\r\n    let bytes = s.as_bytes();\r\n    for (i, &byte) in bytes.iter().enumerate() {\r\n        if byte == b\' \' {\r\n            return i;\r\n        }\r\n    }\r\n    s.len()\r\n}\r\n\r\nfn main() {\r\n    let mut s = String::from("hola mundo");\r\n    let indice = primera_palabra_indice(&s);  // indice = 4\r\n\r\n    s.clear();  // Vaciamos el string!\r\n\r\n    // indice sigue siendo 4, pero el string esta vacio\r\n    // El indice ya no tiene sentido - BUG silencioso!\r\n    println!("Primera palabra termina en: {}", indice);\r\n}',
					runnable: false,
				},
				{
					type: "text",
					body: "## La solución: String Slices (&str)\r\n\r\nUn **slice** es una referencia a una porcion contigua de una coleccion. Para Strings, el tipo de un slice es `&str`. A diferencia de un índice, un slice esta vinculado al dato original, así que el compilador puede verificar que siga siendo válido:",
				},
				{
					type: "code",
					language: "rust",
					code: "fn main() {\r\n    let s = String::from(\"hola mundo\");\r\n\r\n    // Slices: referencia a una porcion del String\r\n    let hola = &s[0..4];    // \"hola\" (desde 0 hasta 4, sin incluir 4)\r\n    let mundo = &s[5..10];  // \"mundo\"\r\n\r\n    println!(\"'{}' y '{}'\", hola, mundo);\r\n\r\n    // Atajos de sintaxis\r\n    let primero = &s[..4];   // Desde el inicio: igual que &s[0..4]\r\n    let ultimo = &s[5..];    // Hasta el final: igual que &s[5..s.len()]\r\n    let todo = &s[..];       // Todo el string: igual que &s[0..s.len()]\r\n\r\n    println!(\"Primero: '{}', Ultimo: '{}', Todo: '{}'\", primero, ultimo, todo);\r\n}",
					runnable: true,
				},
				{
					type: "faded-exercise",
					conceptId: "m03-slice-extension",
					title: "🟢 Guiado: extraer la extensión de un archivo",
					intro:
						"Estás organizando archivos subidos por usuarios y necesitas la **extensión** (lo que va después del primer punto) para decidir cómo tratarlos. Vas a devolver un *slice* (`&str`) que apunta dentro del nombre original — sin copiar. Observa, completa y hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `find('.')` te da la posición del punto como `Option<usize>`. Con `match`: si hay punto en `i`, la extensión es la ventana **desde `i + 1` hasta el final** (`&nombre[i + 1..]`, sin incluir el punto). Si no hay punto, no hay extensión: devolvemos `\"\"`.",
							code: "fn extension(nombre: &str) -> &str {\n    match nombre.find('.') {\n        Some(i) => &nombre[i + 1..],\n        None => \"\",\n    }\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** Rellena los `___`: pide la posición del punto, y construye el slice desde justo **después** del punto hasta el final.",
							code: "fn extension(nombre: &str) -> &str {\n    match nombre.___('.') {\n        Some(i) => &nombre[___..],\n        None => \"\",\n    }\n}",
						},
						{
							kind: "solo",
							instructions:
								'**Paso 3 — tú solo.** Escribe `extension` desde cero: recibe `&str`, busca el primer punto y devuelve la ventana posterior (o `""` si no hay punto).',
							code: "fn extension(nombre: &str) -> &str {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(extension("foto.png"), "png");\n    assert_eq!(extension("informe.pdf"), "pdf");\n    assert_eq!(extension("README"), "");\n    assert_eq!(extension("archivo.tar.gz"), "tar.gz");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn extension(nombre: &str) -> &str {\n    match nombre.find('.') {\n        Some(i) => &nombre[i + 1..],\n        None => \"\",\n    }\n}",
				},
				{
					type: "text",
					body: "## Slices previenen bugs\r\n\r\nAhora, si intentamos modificar el String mientras existe un slice, el compilador nos detiene:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn primera_palabra(s: &String) -> &str {\r\n    let bytes = s.as_bytes();\r\n    for (i, &byte) in bytes.iter().enumerate() {\r\n        if byte == b\' \' {\r\n            return &s[0..i];\r\n        }\r\n    }\r\n    &s[..]\r\n}\r\n\r\nfn main() {\r\n    let mut s = String::from("hola mundo");\r\n    let palabra = primera_palabra(&s);  // Borrows s immutably\r\n\r\n    s.clear();  // ERROR! No puedes mutar s mientras palabra la referencia\r\n\r\n    println!("Primera palabra: {}", palabra);\r\n}',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: '**Error del compilador:**\r\n```\r\nerror[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable\r\n --> src/main.rs:13:5\r\n  |\r\n12|     let palabra = primera_palabra(&s);\r\n  |                                   -- immutable borrow occurs here\r\n13|     s.clear();\r\n  |     ^^^^^^^^^ mutable borrow occurs here\r\n14|     println!("Primera palabra: {}", palabra);\r\n  |                                     ------- immutable borrow later used here\r\n```\r\nEl slice (`palabra`) es una referencia inmutable a `s`. No puedes mutar `s` mientras ese slice existe. Rust previene el bug!',
				},
				{
					type: "text",
					body: "## Desarmando el bucle byte a byte\n\nLa línea `for (i, &byte) in bytes.iter().enumerate()` es de las que más confunden en todo Rust. Vamos a abrirla pieza por pieza, porque mezcla cinco ideas a la vez:\n\n- **`s.as_bytes()`** → ve el texto como su lista cruda de bytes (`&[u8]`). Para `\"hola mundo\"`: `[104, 111, 108, 97, 32, ...]` (el `32` es el espacio).\n- **`.iter()`** → recorre esos bytes uno por uno.\n- **`.enumerate()`** → empareja cada byte con su **posición**: `(0, &104)`, `(1, &111)`...\n- **`(i, &byte)`** → desarma cada par. El **`&` delante de `byte` es lo raro**: el iterador entrega *referencias* (`&u8`), y ese `&` en el patrón las \"pela\" para dejarte el número limpio. Sin el `&`, `byte` sería `&u8` y no podrías compararlo a secas con un número. Es desempaquetar al revés.\n- **`b' '`** → un *byte literal*: la `b` delante convierte el carácter en su número. `b' '` es `32` (el espacio).\n- **`return &s[0..i]`** → si encontramos el espacio en la posición `i`, devolvemos la ventana del inicio hasta ahí (sin incluir el espacio).",
				},
				{
					type: "code",
					language: "text",
					code: "   Texto: \"hola mundo\"\n\n   i=0   byte = 'h' (104)   ¿es espacio (32)?   no\n   i=1   byte = 'o' (111)   ¿es espacio?        no\n   i=2   byte = 'l' (108)   ¿es espacio?        no\n   i=3   byte = 'a' (97)    ¿es espacio?        no\n   i=4   byte = ' ' (32)    ¿es espacio?        SÍ  ->  return &s[0..4] = \"hola\"",
					runnable: false,
				},
				{
					type: "callout",
					variant: "tip",
					body: 'Si el bucle termina **sin** encontrar ningún espacio (una sola palabra como `"rust"`), nunca entra al `if` y la ejecución llega a la última línea `&s[..]` (o `s`): el texto entero. Por eso `primera_palabra("rust")` devuelve `"rust"`.\n\nY recuerda: este bucle es "el detrás de cámaras". En el día a día escribirías `s.find(\' \')`, que hace exactamente este recorrido por ti — pero ahora ya sabes qué ocurre por debajo.',
				},
				{
					type: "text",
					body: "## Prefiere &str sobre &String\r\n\r\nEn la práctica, es mejor que las funciones reciban `&str` en lugar de `&String`. Un `&str` es más flexible porque puede aceptar tanto slices de `String` como string literals:",
				},
				{
					type: "code",
					language: "rust",
					code: '// Buena practica: recibir &str en lugar de &String\r\nfn contar_palabras(texto: &str) -> usize {\r\n    texto.split_whitespace().count()\r\n}\r\n\r\nfn main() {\r\n    // Funciona con String\r\n    let frase = String::from("Rust es genial y seguro");\r\n    println!("Palabras en String: {}", contar_palabras(&frase));\r\n\r\n    // Funciona con &str directamente\r\n    println!("Palabras en &str: {}", contar_palabras("hola mundo"));\r\n\r\n    // Funciona con slices\r\n    println!("Palabras en slice: {}", contar_palabras(&frase[0..14]));\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Slices de arrays\r\n\r\nLos slices no son exclusivos de Strings. También puedes crear slices de arrays y vectores:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn suma(numeros: &[i32]) -> i32 {\r\n    let mut total = 0;\r\n    for n in numeros {\r\n        total += n;\r\n    }\r\n    total\r\n}\r\n\r\nfn promedio(numeros: &[i32]) -> f64 {\r\n    if numeros.is_empty() {\r\n        return 0.0;\r\n    }\r\n    suma(numeros) as f64 / numeros.len() as f64\r\n}\r\n\r\nfn main() {\r\n    let notas = [85, 92, 78, 95, 88];\r\n\r\n    // Slice de todo el array\r\n    println!("Suma total: {}", suma(&notas));\r\n    println!("Promedio: {:.1}", promedio(&notas));\r\n\r\n    // Slice de una parte\r\n    let primeras_tres = &notas[0..3];\r\n    println!("Primeras 3 notas: {:?}", primeras_tres);\r\n    println!("Promedio primeras 3: {:.1}", promedio(primeras_tres));\r\n\r\n    // Slice de las ultimas dos\r\n    let ultimas = &notas[3..];\r\n    println!("Ultimas notas: {:?}", ultimas);\r\n    println!("Promedio ultimas: {:.1}", promedio(ultimas));\r\n}',
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Resumen de tipos de slice:**\r\n- `&str` = slice de un String o string literal\r\n- `&[i32]` = slice de un array o vector de i32\r\n- `&[T]` = slice de cualquier coleccion de tipo T\r\n- Los slices siempre son referencias (contienen un puntero y una longitud)",
				},
				{
					type: "quiz",
					question:
						"¿Cuál es la ventaja de usar un slice (`&str`) en lugar de un índice (`usize`) para representar una parte de un String?",
					options: [
						{
							text: "El slice es más rápido",
							correct: false,
						},
						{
							text: "El slice esta vinculado al String original, así que el compilador puede verificar que siga siendo válido",
							correct: true,
						},
						{
							text: "Los índices no funcionan en Rust",
							correct: false,
						},
						{
							text: "El slice usa menos memoria",
							correct: false,
						},
					],
					explanation:
						'Un `usize` suelto se desincroniza: si el `String` cambia (`s.clear()`), el número queda apuntando a una posición sin sentido y **nadie te avisa**. El slice es una referencia: el borrow checker "congela" el `String` mientras el slice viva, y el bug se vuelve imposible.',
				},
				{
					type: "quiz",
					question:
						"¿Por qué es mejor que una función reciba `&str` en lugar de `&String`?",
					options: [
						{
							text: "Porque &str es más rápido",
							correct: false,
						},
						{
							text: "Porque &str acepta tanto String (via &), string literals, como slices — es más flexible",
							correct: true,
						},
						{
							text: "Porque &String no existe en Rust",
							correct: false,
						},
						{
							text: "No hay diferencia real",
							correct: false,
						},
					],
					explanation:
						"`&str` es la vista más general: un `&String` se convierte gratis en `&str` (deref coercion), y además aceptas string literals y sub-slices. `&String` solo acepta referencias a `String` completos. Por eso las APIs idiomáticas de Rust reciben `&str`.",
				},
				{
					type: "exercise",
					title: "Extraer el dominio de un email usando slices",
					language: "rust",
					prompt:
						'Recibes un email como string y necesitas extraer la parte del dominio (lo que viene después del `@`).\n\nTu tarea: implementa `extraer_dominio` que reciba `&str` y devuelva `&str` apuntando al dominio. **No uses `to_string()` ni `String::from()`** — necesitas usar slices, que son referencias a la string original.\n\nPara emails sin `@` (o malformados), devuelve un slice vacío `""`.\n\nFirma esperada:\n```rust\nfn extraer_dominio(email: &str) -> &str\n```',
					starterCode:
						'fn extraer_dominio(email: &str) -> &str {\n    // TODO: encuentra el índice del \'@\' y devuelve un slice\n    // Pista: usa email.find(\'@\') que devuelve Option<usize>\n    todo!()\n}\n\nfn main() {\n    let emails = [\n        "ana@gmail.com",\n        "luis@empresa.co",\n        "invalido-sin-arroba",\n    ];\n\n    for e in emails {\n        println!("{} → dominio: \'{}\'", e, extraer_dominio(e));\n    }\n}',
					solution:
						'fn extraer_dominio(email: &str) -> &str {\n    match email.find(\'@\') {\n        Some(pos) => &email[pos + 1..],\n        None => "",\n    }\n}\n\nfn main() {\n    let emails = [\n        "ana@gmail.com",\n        "luis@empresa.co",\n        "invalido-sin-arroba",\n    ];\n\n    for e in emails {\n        println!("{} → dominio: \'{}\'", e, extraer_dominio(e));\n    }\n}',
					hints: [
						"`str::find(char)` devuelve `Option<usize>` con la posición del primer match (o `None` si no encuentra nada).",
						"Para crear un slice desde la posición `pos+1` hasta el final usa `&email[pos+1..]`. El `..` sin número a la derecha significa 'hasta el final'.",
						"Usa `match` para manejar las dos ramas de `Option`: `Some(pos) =>` y `None =>`.",
					],
					explanation:
						'**Lo que hace este código eficiente:**\n\n- `extraer_dominio("ana@gmail.com")` devuelve un slice de **9 bytes** apuntando al `"gmail.com"` dentro del string original. **Cero allocations**, cero copia.\n- Si hubieras devuelto `String`, copiarías esos 9 bytes a una zona nueva del heap.\n\n**Por qué `&str` en vez de `String` como retorno:**\n- El llamador ya tiene el email vivo (porque sino no podría llamarte). El dominio es solo una *vista* dentro de ese email.\n- Los lifetimes son inferidos: Rust sabe que el `&str` devuelto vive lo que vive `email`.\n\n**Aplicación real:** parsers eficientes en Rust (como `serde_json` o `nom`) devuelven slices del input original sin copiar nada. Por eso son rápidos.',
				},
			],
		},
		{
			id: "m03_l06",
			moduleId: "m03",
			moduleSlug: "m03_ownership",
			order: 6,
			title: "Introducción a Lifetimes",
			blocks: [
				{
					type: "first-principles",
					title:
						"Lifetimes: demostrar que una referencia no vivirá más que su dato",
					problem:
						"Una referencia es peligrosa si apunta a algo que ya fue destruido. El problema no es usar referencias; el problema es usarlas después de que el dato original dejó de existir.",
					mentalModel:
						"Un lifetime es una fecha de validez. Rust revisa que tu pase de entrada no dure más que el evento al que quieres entrar.",
					concreteExample:
						"Si una función devuelve una referencia a una variable creada dentro de la función, esa variable muere al terminar la función. La referencia quedaría apuntando a nada. Rust lo prohíbe antes de ejecutar.",
					remember:
						"Los lifetimes no hacen vivir más a los datos; sólo describen y verifican cuánto viven.",
				},
				{
					type: "challenge",
					conceptId: "m03-lifetime-longest",
					title: "Antes de leer: devolver una de dos referencias",
					prompt:
						"**Tu reto:** escribe una función que reciba dos textos prestados (`&str`) y devuelva una referencia al **más largo** (por número de bytes). Si empatan, devuelve el primero.\n\nLa firma ya trae unas anotaciones raras (`'a`). Inténtalo y dale a Verificar — luego entenderás por qué Rust las pide.",
					starterCode:
						"fn mas_largo<'a>(a: &'a str, b: &'a str) -> &'a str {\n    // devuelve el más largo\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(mas_largo("hola", "hi"), "hola");\n    assert_eq!(mas_largo("a", "bbb"), "bbb");\n    assert_eq!(mas_largo("igual", "xxxxx"), "igual");\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Compara longitudes con `a.len() >= b.len()`. El `>=` hace que en empate gane el primero, como pide el enunciado.",
						"En Rust, `if/else` es una **expresión**: `if cond { a } else { b }` devuelve directamente `a` o `b`. Sin `return`, sin `;`.",
					],
					solution:
						"fn mas_largo<'a>(a: &'a str, b: &'a str) -> &'a str {\n    if a.len() >= b.len() {\n        a\n    } else {\n        b\n    }\n}",
					reveal:
						"Esas anotaciones `'a` son **lifetimes** (tiempos de vida). Cuando una función devuelve una referencia que pudo venir de cualquiera de dos entradas, Rust necesita saber: *¿cuánto tiempo será válido el resultado?*\n\n```rust\nfn mas_largo<'a>(a: &'a str, b: &'a str) -> &'a str {\n    if a.len() >= b.len() { a } else { b }\n}\n```\n\n`'a` le promete a Rust: *\"el resultado vivirá tanto como la más corta de las dos entradas\"*. No cambia el comportamiento en ejecución — es solo una etiqueta que el compilador usa para garantizar que nunca devuelvas una referencia a un dato ya liberado. Eso es lo que verás ahora. 👇",
				},
				{
					type: "faded-exercise",
					conceptId: "m03-lifetime-anotacion",
					title: "🟢 Guiado: la anotación `<'a>` pieza por pieza",
					intro:
						'En el reto anterior la firma ya traía `\'a` puestos y solo los usaste. Ahora vas a **escribirlos tú**, uno a uno, hasta que la sintaxis deje de parecer magia.\n\nEscenario real: en una herramienta de logs quieres mostrar la **etiqueta más corta** de dos rutas (por ejemplo, elegir `"db.log"` sobre `"rutas/app.log"` para una vista compacta). La función recibe dos `&str` y devuelve una referencia a uno de ellos. Como devuelve una referencia que puede venir de **cualquiera** de las dos entradas, Rust exige que anotes el lifetime: necesita saber cuánto vivirá el resultado.\n\n> Recordatorio del receptor en `&str`: `&` = **lo miro prestado, no me lo quedo**. El resultado es una *vista* dentro del dato del llamador, no una copia nueva.',
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa la firma completa.** Lee `etiqueta_mas_corta<'a>(a: &'a str, b: &'a str) -> &'a str` de izquierda a derecha:\n\n1. `<'a>` — **declaras** un lifetime genérico llamado `'a` (como declaras un tipo genérico `<T>`).\n2. `a: &'a str` y `b: &'a str` — ambas entradas son referencias que viven **al menos** durante `'a`.\n3. `-> &'a str` — el resultado también vive durante `'a`.\n\nEn la práctica `'a` será el lifetime **más corto** de `a` y `b`: así Rust garantiza que el resultado nunca sobreviva al dato del que salió. Fíjate además en el `<=`: en empate gana `a` (la primera).",
							code: "fn etiqueta_mas_corta<'a>(a: &'a str, b: &'a str) -> &'a str {\n    if a.len() <= b.len() {\n        a\n    } else {\n        b\n    }\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa las anotaciones.** El cuerpo ya está correcto; solo faltan los lifetimes. Rellena los `___`:\n\n- En `<___>` declara el lifetime `'a`.\n- En cada `&___ str` (los dos parámetros **y** el retorno) pon el mismo `'a`.\n\nPista: lo que escribes en `<...>` debe coincidir, letra por letra, con lo que escribes en cada `&...`.",
							code: "fn etiqueta_mas_corta<___>(a: &___ str, b: &___ str) -> &___ str {\n    if a.len() <= b.len() {\n        a\n    } else {\n        b\n    }\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo, desde la firma sin anotar.** Esta firma NO compila tal cual: Rust dirá `missing lifetime specifier`. Añade `<'a>` tras el nombre y pon `&'a str` en `a`, en `b` y en el retorno. El cuerpo ya está completo.",
							code: "fn etiqueta_mas_corta(a: &str, b: &str) -> &str {\n    if a.len() <= b.len() {\n        a\n    } else {\n        b\n    }\n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(etiqueta_mas_corta("rutas/app.log", "db.log"), "db.log");\n    assert_eq!(etiqueta_mas_corta("ERROR", "WARN"), "WARN");\n    assert_eq!(etiqueta_mas_corta("auth", "auth"), "auth");\n    assert_eq!(etiqueta_mas_corta("kb", "memoria"), "kb");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn etiqueta_mas_corta<'a>(a: &'a str, b: &'a str) -> &'a str {\n    if a.len() <= b.len() {\n        a\n    } else {\n        b\n    }\n}",
				},
				{
					type: "text",
					body: "## El Problema: referencias colgantes\r\n\r\nUna **referencia colgante** (dangling reference) ocurre cuando una referencia apunta a memoria que ya fue liberada. Este es uno de los bugs más peligrosos en C/C++. Rust lo previene completamente:",
				},
				{
					type: "code",
					language: "rust",
					code: 'fn crear_dangling() -> &String {  // ERROR!\r\n    let s = String::from("hola");\r\n    &s  // Intentamos devolver una referencia a s\r\n}  // s se libera aqui. La referencia apuntaria a memoria liberada!\r\n\r\nfn main() {\r\n    let referencia = crear_dangling();\r\n}',
					runnable: false,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Error del compilador:**\r\n```\r\nerror[E0106]: missing lifetime specifier\r\n --> src/main.rs:1:26\r\n  |\r\n1 | fn crear_dangling() -> &String {\r\n  |                        ^ expected named lifetime parameter\r\n  |\r\n  = help: this function's return type contains a borrowed value,\r\n          but there is nothing for it to be borrowed from\r\n```\r\nRust detecta que la referencia viviria más que el dato al que apunta. Esto es un error de **lifetime** (tiempo de vida).",
				},
				{
					type: "text",
					body: "## Qué son los lifetimes?\r\n\r\nUn **lifetime** es el periodo durante el cual una referencia es válida. La mayoria del tiempo, Rust infiere los lifetimes automáticamente (igual que infiere tipos). Pero a veces necesitas ayudar al compilador anotandolos explícitamente.\r\n\r\nLos lifetimes se escriben con un apostrofe seguido de un nombre (por convención, letras minusculas): `'a`, `'b`, `'input`, etc.\r\n\r\nNo cambian cuanto vive una referencia. Solo le dicen al compilador **la relacion** entre los lifetimes de diferentes referencias para que pueda verificar la seguridad.",
				},
				{
					type: "text",
					body: "## ¿Cuándo necesitas anotar lifetimes?\r\n\r\nLa regla es simple: necesitas anotaciones cuando una función recibe **multiples referencias** y devuelve **una referencia**. El compilador necesita saber: la referencia devuelta, de cual parámetro viene?",
				},
				{
					type: "code",
					language: "rust",
					code: '// El compilador no sabe si el resultado viene de x o de y\r\n// Necesitamos decirle: "el resultado vive tanto como x Y y"\r\nfn mas_largo<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {\r\n    if x.len() >= y.len() {\r\n        x\r\n    } else {\r\n        y\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let string1 = String::from("cadena larga");\r\n\r\n    {\r\n        let string2 = String::from("xyz");\r\n        let resultado = mas_largo(&string1, &string2);\r\n        println!("El mas largo es: {}", resultado);\r\n    }\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## Leyendo la anotación `<'a>`\r\n\r\nLeamos `fn mas_largo<'a>(x: &'a str, y: &'a str) -> &'a str` paso a paso:\r\n\r\n1. `<'a>` — declaramos un lifetime genérico llamado `'a`\r\n2. `x: &'a str` — `x` es una referencia que vive al menos durante `'a`\r\n3. `y: &'a str` — `y` es una referencia que vive al menos durante `'a`\r\n4. `-> &'a str` — el resultado es una referencia que vive durante `'a`\r\n\r\nEn la práctica, `'a` sera el lifetime **más corto** entre `x` y `y`. Esto le dice a Rust: \"el resultado no vivira más que el parámetro que viva menos\".",
				},
				{
					type: "text",
					body: "## Lifetime elision: cuando Rust infiere por ti\r\n\r\nLa buena noticia: en la mayoria de casos, no necesitas escribir lifetimes. Rust tiene **reglas de elision** que los infieren automáticamente:\r\n\r\n1. Cada parámetro de referencia recibe su propio lifetime.\r\n2. Si solo hay un parámetro de referencia, su lifetime se asigna a todas las referencias de salida.\r\n3. Si hay un `&self` o `&mut self`, el lifetime de self se asigna a las salidas.\r\n\r\nEstas reglas cubren la gran mayoria de funciones:",
				},
				{
					type: "code",
					language: "rust",
					code: '// No necesita anotacion: un solo parametro de referencia (regla 2)\r\nfn primera_palabra(s: &str) -> &str {\r\n    let bytes = s.as_bytes();\r\n    for (i, &byte) in bytes.iter().enumerate() {\r\n        if byte == b\' \' {\r\n            return &s[0..i];\r\n        }\r\n    }\r\n    s\r\n}\r\n\r\n// No necesita anotacion: no devuelve referencia\r\nfn contar_vocales(s: &str) -> usize {\r\n    s.chars().filter(|c| "aeiouAEIOU".contains(*c)).count()\r\n}\r\n\r\n// NECESITA anotacion: dos parametros de referencia Y devuelve referencia\r\nfn mas_largo<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {\r\n    if x.len() >= y.len() { x } else { y }\r\n}\r\n\r\nfn main() {\r\n    let texto = String::from("hola mundo");\r\n    let palabra = primera_palabra(&texto);\r\n    println!("Primera palabra: {}", palabra);\r\n\r\n    println!("Vocales: {}", contar_vocales("murcielago"));\r\n\r\n    let a = "Rust";\r\n    let b = "es genial";\r\n    println!("Mas largo: {}", mas_largo(a, b));\r\n}',
					runnable: true,
				},
				{
					type: "text",
					body: "## El lifetime estático: 'static\r\n\r\nExiste un lifetime especial llamado `'static` que significa \"esta referencia vive durante toda la ejecución del programa\". Los string literals tienen lifetime `'static` porque están incrustados en el binario del programa:",
				},
				{
					type: "code",
					language: "rust",
					code: "fn main() {\r\n    // Los string literals tienen lifetime 'static\r\n    let s: &'static str = \"vivo para siempre\";\r\n    println!(\"{}\", s);\r\n\r\n    // Esto es porque el texto esta en el binario del programa,\r\n    // que existe durante toda la ejecucion.\r\n\r\n    // Nota: 'static es el lifetime mas largo posible.\r\n    // No abuses de el. La mayoria de veces, un lifetime generico\r\n    // como 'a es la solucion correcta.\r\n}",
					runnable: true,
				},
				{
					type: "callout",
					variant: "info",
					body: '**Resumen de lifetimes:**\r\n- Los lifetimes garantizan que las referencias nunca apunten a datos liberados.\r\n- La mayoria del tiempo, Rust los infiere automáticamente (lifetime elision).\r\n- Solo necesitas anotarlos cuando la función tiene multiples referencias de entrada y devuelve una referencia.\r\n- `\'static` significa "vive todo el programa" — los string literals lo tienen por defecto.\r\n- Los lifetimes NO cambian cuanto vive un dato. Solo ayudan al compilador a verificar seguridad.',
				},
				{
					type: "quiz",
					question: "Qué es una referencia colgante (dangling reference)?",
					options: [
						{
							text: "Una referencia que apunta a memoria que ya fue liberada",
							correct: true,
						},
						{
							text: "Una referencia que no ha sido inicializada",
							correct: false,
						},
						{
							text: "Una referencia mutable",
							correct: false,
						},
						{
							text: "Una referencia que apunta a un valor en el stack",
							correct: false,
						},
					],
					explanation:
						'"Colgante" significa que el dato al que apuntaba **ya fue liberado**. Usarla en C/C++ es comportamiento indefinido: crashes y vulnerabilidades. En Rust ni siquiera compila — el borrow checker exige que toda referencia viva menos que su dato.',
				},
				{
					type: "quiz",
					question:
						"¿Cuándo necesitas anotar lifetimes explícitamente en una función?",
					options: [
						{
							text: "Siempre que uses referencias",
							correct: false,
						},
						{
							text: "Cuando la función tiene multiples referencias de entrada y devuelve una referencia",
							correct: true,
						},
						{
							text: "Solo en funciones públicas",
							correct: false,
						},
						{
							text: "Nunca, Rust siempre los infiere",
							correct: false,
						},
					],
					explanation:
						"Con **varias** referencias de entrada y una de salida, el compilador no puede adivinar de cuál depende el resultado: las reglas de elision no aplican y anotas tú. Con un solo parámetro de referencia (o con `&self`), la elision lo resuelve sola — por eso la mayoría de funciones no llevan `'a`.",
				},
				{
					type: "exercise",
					title: "Función que devuelve la línea más larga de un log",
					language: "rust",
					prompt:
						"Estás escribiendo una utilidad de análisis de logs. Tu función `linea_mas_larga` recibe dos slices de log y devuelve el más largo. **Sin lifetime explícito, no compila** — Rust no sabe si el resultado depende de `a` o de `b`.\n\nTu tarea: añade la anotación de lifetime correcta a la firma de la función. Después verifica que el `main` funcione: la idea es que pases dos líneas y obtengas la más larga.",
					starterCode:
						'// Esta función no compila. ¿Por qué?\n// El compilador dirá: "missing lifetime specifier"\nfn linea_mas_larga(a: &str, b: &str) -> &str {\n    if a.len() >= b.len() { a } else { b }\n}\n\nfn main() {\n    let log1 = String::from("[INFO] server started");\n    let log2 = String::from("[ERROR] critical database connection failure detected");\n\n    let mayor = linea_mas_larga(&log1, &log2);\n    println!("Línea más relevante: {}", mayor);\n}',
					solution:
						'// Decimos: a y b comparten el mismo lifetime \'a, y el retorno también.\n// El retorno no vivirá más que el menor de a o b.\nfn linea_mas_larga<\'a>(a: &\'a str, b: &\'a str) -> &\'a str {\n    if a.len() >= b.len() { a } else { b }\n}\n\nfn main() {\n    let log1 = String::from("[INFO] server started");\n    let log2 = String::from("[ERROR] critical database connection failure detected");\n\n    let mayor = linea_mas_larga(&log1, &log2);\n    println!("Línea más relevante: {}", mayor);\n}',
					hints: [
						"El lifetime se declara entre `<>` después del nombre de la función: `fn nombre<'a>(...)`.",
						"Cada referencia que comparte el mismo destino de vida usa el mismo lifetime: `a: &'a str`, `b: &'a str`, retorno `-> &'a str`.",
						"Lee la firma como un contrato: 'el resultado vive al menos tanto como ambos parámetros'. Rust usará el lifetime más corto para no permitir un dangling reference.",
					],
					explanation:
						"**Qué le dice `'a` al compilador:**\n\n- 'a y b son referencias que comparten un mismo lifetime nombrado `'a`'.\n- 'El retorno también vive durante `'a`'.\n- Como `'a` es el lifetime más corto entre los argumentos, el retorno **nunca puede sobrevivir más** que el más corto de ellos. Eso evita dangling references.\n\n**Las reglas de elision de Rust** ahorran esta anotación en muchos casos:\n- 1 parámetro de referencia + retorno de referencia → el retorno usa ese lifetime (no escribes nada).\n- Métodos con `&self` → el retorno usa el lifetime de `self`.\n- **2+ parámetros de referencia + retorno de referencia** → necesitas anotar manualmente. Este ejercicio cae aquí.\n\n**No pongas `'static` para 'arreglar' errores de lifetime.** `'static` significa 'vive todo el programa', y casi nunca es lo que quieres — es engañar al compilador. Usa lifetimes nombrados como `'a`.",
				},
			],
		},
	],
};

export default module;

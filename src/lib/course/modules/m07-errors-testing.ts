import type { Module } from "../types";

const module: Module = {
	id: "m07",
	slug: "m07_errors_testing",
	order: 7,
	version: 1,
	icon: "🛡️",
	title: "Errores profesionales y Testing",
	description:
		"Diseña errores que se manejan solos y escribe tests que te dejan dormir tranquilo: panic vs Result, tipos de error propios, el operador ? a fondo, y cargo test.",
	lessons: [
		{
			id: "m07_l01",
			moduleId: "m07",
			moduleSlug: "m07_errors_testing",
			order: 1,
			title: "panic! o Result: la decisión que define tu API",
			blocks: [
				{
					type: "first-principles",
					title: "Hay dos clases de error, y se tratan distinto",
					problem:
						'No todos los fallos son iguales: que el usuario escriba "abc" donde va un número es NORMAL (pasará mil veces al día); que tu programa lea el elemento -1 de una lista es un BUG. Tratarlos igual produce programas que explotan por cosas normales, o que esconden bugs reales.',
					mentalModel:
						"Result es el carril para lo esperable: el error es un dato que viaja y alguien decide qué hacer. panic! es el freno de emergencia: el programa prefiere morir a continuar en un estado sin sentido.",
					concreteExample:
						"Un servidor que recibe JSON malformado responde 400 y sigue viviendo (Result). El mismo servidor con un índice fuera de rango en su propia lógica panickea: mejor reiniciar que corromper datos de usuarios.",
					remember:
						"¿Puede pasar en operación normal? → Result. ¿Solo puede pasar si el programador se equivocó? → panic.",
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: "¿panic o Result?"\n\nAntes de escribir una sola función, hay una decisión que define tu API: **cuando algo sale mal, ¿abortas (`panic!`) o devuelves el problema (`Result`)?** Mucha gente la toma al azar — y por eso hay programas que explotan por tonterías y otros que esconden bugs graves. Vamos a abrirla pieza por pieza.\n\nLa pregunta NO es "¿qué tan grave es el fallo?". Un puerto mal escrito y un saldo negativo pueden ser igual de molestos. La pregunta real es **¿de quién es la culpa?**:\n\n- **Culpa del mundo** (el usuario tecleó letras, el archivo no existe, la red se cayó): eso va a pasar en operación normal, mil veces. No es un error tuyo, es la realidad. → **`Result`**: lo devuelves como dato y quien llama decide.\n- **Culpa del programador** (índice -1, un invariante que tú mismo prometiste y rompiste, un estado que tu código jamás debería alcanzar): eso solo pasa si HAY UN BUG. Continuar sería operar sobre datos sin sentido. → **`panic!`**: frena en seco, mejor morir que corromper.\n\nUna segunda prueba, por si la primera no es clara: **¿puede el llamador hacer algo útil con este fallo?** Si sí (reintentar, pedir otro dato, usar un default, mostrar un mensaje) → `Result`, dale la oportunidad. Si no hay NADA sensato que hacer salvo arreglar el código → `panic!`.',
				},
				{
					type: "code",
					language: "text",
					code: 'DESARME — la misma situación, las dos decisiones, paso a paso\n\nEscenario A: un formulario web recibe la edad como texto: "treinta"\n──────────────────────────────────────────────────────────────\n  ¿De quién es la culpa?  → del mundo (el usuario escribió mal).\n  ¿Pasará en operación normal? → SÍ, todo el día.\n  ¿Puede el llamador hacer algo útil? → SÍ: volver a pedir el dato.\n  DECISIÓN ────────────────────────────────────► Result\n\n  fn parse_edad(t: &str) -> Result<u8, ErrorEdad>\n      llega "treinta"  ─►  devuelve Err(ErrorEdad::NoEsNumero)\n                              │\n                              ▼\n      el llamador hace match, muestra "revisa tu edad", PROGRAMA SIGUE VIVO\n\n\nEscenario B: dentro de TU código pides el elemento -1 de un vector\n──────────────────────────────────────────────────────────────\n  ¿De quién es la culpa?  → del programador (ese índice no existe nunca).\n  ¿Pasará en operación normal? → NO: si pasa, hay un bug.\n  ¿Puede el llamador hacer algo útil? → NO: el estado ya no tiene sentido.\n  DECISIÓN ────────────────────────────────────► panic!\n\n  let x = lista[indice];\n      indice = 99, len = 3  ─►  panic! "index out of bounds: len is 3"\n                                  │\n                                  ▼\n      EL HILO MUERE — y está BIEN: te avisa del bug antes de corromper datos\n\n\nRegla de bolsillo:\n  culpa del mundo      + el llamador puede reaccionar  →  Result\n  culpa del programador + nada sensato que hacer        →  panic!',
					runnable: false,
				},
				{
					type: "challenge",
					conceptId: "m07-result-divide",
					title: "Antes de leer: un error que es un dato",
					prompt:
						'**Tu reto** (calentamiento con lo que ya sabes de m04): escribe `dividir(a: f64, b: f64) -> Result<f64, String>`.\n\n- Si `b` es `0.0`, devuelve `Err` con el mensaje exacto `"no se puede dividir entre cero"`.\n- Si no, devuelve `Ok` con la división.\n\nFíjate en lo que NO hace esta función: no imprime, no panickea, no decide qué hacer con el error. Solo lo **devuelve como dato**. Quién la llame decidirá.',
					starterCode:
						"fn dividir(a: f64, b: f64) -> Result<f64, String> {\n    // tu código aquí\n}",
					tests:
						'fn main() {\n    assert_eq!(dividir(10.0, 2.0), Ok(5.0));\n    assert_eq!(dividir(7.0, 0.0), Err(String::from("no se puede dividir entre cero")));\n    assert_eq!(dividir(0.0, 5.0), Ok(0.0));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'fn dividir(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(String::from("no se puede dividir entre cero"))\n    } else {\n        Ok(a / b)\n    }\n}',
					hints: [
						"Es un `if/else` como expresión: una rama devuelve `Err(...)`, la otra `Ok(...)`.",
						'El mensaje debe ser EXACTO (los tests comparan el String): `Err(String::from("no se puede dividir entre cero"))`.',
					],
					reveal:
						'Esto que acabas de escribir es la mitad de la filosofía de errores de Rust:\n\n```rust\nfn dividir(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(String::from("no se puede dividir entre cero"))\n    } else {\n        Ok(a / b)\n    }\n}\n```\n\nEl error **es un valor que se devuelve**, no una excepción invisible que vuela por los aires. La firma `-> Result<f64, String>` es un contrato público: *"esto puede fallar, y el compilador no te dejará ignorarlo"*.\n\nLa otra mitad de la filosofía es `panic!` — el freno de emergencia para los errores que NO deberían poder pasar. Saber cuál usar en cada caso es lo que separa una API profesional de una que explota en producción. Eso es esta lección. 👇',
				},
				{
					type: "text",
					body: '## Los dos carriles\n\nRust separa los fallos en dos categorías con herramientas distintas:\n\n| | `Result<T, E>` | `panic!` |\n|---|---|---|\n| Para | errores **esperables** (input del usuario, red, archivos) | **bugs** (estados imposibles, contratos rotos) |\n| Qué hace | devuelve el error como dato | aborta el hilo con un mensaje |\n| Quién lo maneja | el llamador, obligado por el compilador | nadie: es un grito de "esto no debería pasar" |\n| En producción | el programa sigue vivo | el programa (o el hilo) muere |\n\n## panic! de cerca\n\nYa lo has visto sin invocarlo tú: indexar fuera de rango, dividir enteros entre cero, `.unwrap()` sobre un `None`… todos llaman a `panic!` por debajo:',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\n    let lista = vec![1, 2, 3];\n\n    // Descomenta cualquiera de estas y el programa muere con un panic:\n    // let x = lista[99];                    // index out of bounds\n    // let n: i32 = "abc".parse().unwrap();  // unwrap sobre un Err\n\n    // panic! también se invoca a mano, para invariantes imposibles:\n    let edad = 30;\n    if edad > 150 {\n        panic!("edad imposible: {} — hay un bug upstream", edad);\n    }\n\n    println!("Todo en orden, lista de {} elementos", lista.len());\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## unwrap y expect: úsalos con intención, no por pereza\n\n`.unwrap()` significa: *"si esto es un error, panickea"*. Convierte un error esperable en un crash. ¿Cuándo es legítimo?\n\n- **Prototipos y ejemplos**: estás explorando, un crash te da igual.\n- **Tests**: que el test explote ES el comportamiento deseado si algo falla.\n- **Imposibilidad demostrable**: acabas de verificar la condición una línea arriba.\n\nPara producción, la versión profesional de unwrap es **`.expect("mensaje")`** — el mensaje debe decir **por qué creías que no podía fallar**, para que el tú del futuro depure en segundos:',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn main() {\n    // ❌ unwrap pelado: si falla, el mensaje no te dice nada útil.\n    // let config: i32 = "8080".parse().unwrap();\n\n    // ✅ expect documenta TU suposición:\n    let config: i32 = "8080"\n        .parse()\n        .expect("el puerto por defecto \'8080\' debería ser un número válido");\n\n    println!("Puerto: {}", config);\n\n    // ✅ Y para errores ESPERABLES (input externo), ni unwrap ni expect:\n    let entrada_del_usuario = "no soy un número";\n    match entrada_del_usuario.parse::<i32>() {\n        Ok(n) => println!("Número: {}", n),\n        Err(_) => println!("\'{}\' no es un número — intenta de nuevo", entrada_del_usuario),\n    }\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## Ficha: `.unwrap()` y `.expect("…")`\n\n| | `.unwrap()` / `.expect("…")` |\n|---|---|\n| **Qué hace** | si es `Ok(v)`/`Some(v)` te da `v`; si es `Err`/`None`, llama a `panic!` y mata el hilo |\n| **Receptor** | un `Result<T, E>` o un `Option<T>` (lo **consume**: se lo come por valor, ese Result ya no existe después) |\n| **Devuelve** | el valor de adentro `T` — **nunca un Result/Option** (o te lo da pelado, o no hay vuelta: panic) |\n| **Trampa Py-JS** | parece `try/except` o `?.` de JS, **pero no atrapa nada**: es lo contrario. `unwrap` CONVIERTE un error manejable en un crash. En Python `int("abc")` lanza una excepción que puedes capturar; `"abc".parse().unwrap()` tumba el programa entero ahí mismo |\n\nLa diferencia entre los dos es solo el mensaje del panic: `unwrap` da uno genérico, `expect("…")` imprime TU texto (por qué creías que no podía fallar). Misma mecánica, mejor pista al depurar.',
				},
				{
					type: "text",
					body: '## Esto es lo que confunde: `.unwrap()` NO es manejar el error — es renunciar a manejarlo\n\nMira las dos líneas lado a lado. Parecen primas, pero hacen lo OPUESTO con el fallo:\n\n```rust\nlet n: i32 = texto.parse().unwrap();   // ⬅️ "si falla, MUERE aquí"\n```\n```rust\nlet n: i32 = texto.parse()?;           // ⬅️ "si falla, DEVUELVE el error al llamador"\n```\n\nVamos a abrir la de `unwrap` pieza por pieza, porque cada parte importa:\n\n- **`texto.parse()`** no devuelve un `i32`. Devuelve un `Result<i32, ParseIntError>` — una caja que dice "adentro hay un número, O hay un error".\n- **`.unwrap()`** abre esa caja por la fuerza. La **consume** (se la come; el Result deja de existir). Si adentro había `Ok(número)`, te entrega el número. Si había `Err(...)`, no negocia: invoca `panic!` y el hilo muere en esa línea.\n\nPor eso `unwrap` es una decisión de diseño, no un detalle: estás declarando *"si esto falla, prefiero un crash a seguir"*. Eso es legítimo en un test o cuando acabas de demostrar que no puede fallar. Es una bomba de tiempo cuando el dato viene del mundo (un usuario, un archivo, la red), porque entonces **el mundo puede tumbar tu programa cuando quiera**.\n\nLa alternativa profesional no es "un mejor unwrap": es **no usar unwrap**. Devolver `Result` (con `?`, `match`, o `.map_err`) mantiene el fallo como un dato vivo que sube hasta quien sí sabe qué hacer con él.',
				},
				{
					type: "code",
					language: "text",
					code: 'TRAZA — la MISMA entrada mala, los dos caminos\n\nEntrada: texto = "abc"   (no es un número)\n\n\nCAMINO 1 — .unwrap()  ───────────────────────────────────────────\n\n  let n: i32 = texto.parse().unwrap();\n                     │            │\n                     │            └─ recibe Err(ParseIntError), lo consume\n                     │                y dispara panic!\n                     ▼\n          "abc".parse::<i32>()  ==  Err(ParseIntError { .. })\n                     │\n                     ▼\n   ╳ thread \'main\' panicked: \'called `Result::unwrap()` on an `Err`...\'\n   ╳ EL PROGRAMA MUERE.  La línea siguiente NUNCA se ejecuta.\n        quien llamó a esta función: no se entera, no decide nada, ya no hay programa.\n\n\nCAMINO 2 — devolver Result (con ?)  ─────────────────────────────\n\n  fn leer(texto: &str) -> Result<i32, ParseIntError> {\n      let n: i32 = texto.parse()?;   // ? ve el Err...\n                              │\n                              ▼\n            "abc".parse::<i32>()  ==  Err(ParseIntError { .. })\n                              │\n                              ▼\n      ? hace: return Err(ParseIntError)  ── sale de leer() con el error INTACTO\n                              │\n                              ▼\n  el llamador recibe Err(...) y DECIDE:\n        match leer("abc") {\n            Ok(n)  => usar(n),\n            Err(_) => pedir_otra_vez(),   // ◄── PROGRAMA SIGUE VIVO\n        }\n\n\nResumen: unwrap entrega el valor O mata el proceso.\n         Result entrega el valor O entrega el error — y la vida continúa.',
					runnable: false,
				},
				{
					type: "callout",
					variant: "warning",
					body: '**La regla del code review profesional:** cada `.unwrap()` en producción es una pregunta del revisor: *"¿qué pasa cuando esto falle a las 3 AM?"*. Si la respuesta es "no puede fallar", se escribe `.expect("porqué no puede fallar")`. Si la respuesta es "sí puede fallar"… entonces va un `match`, un `?`, o un valor por defecto con `.unwrap_or()`.',
				},
				{
					type: "text",
					body: '## El menú completo para manejar un Result\n\nNo todo es `match`. Según cuánto te importe el error, tienes opciones (varias las viste con `Option` en m04 — la simetría es intencional):\n\n```rust\nlet r: Result<i32, String> = "42".parse().map_err(|e| e.to_string());\n\nr.unwrap_or(0);              // valor por defecto si falló\nr.unwrap_or_else(|e| { 0 }); // default calculado (recibe el error)\nr.ok();                      // Result → Option (descarta el error)\nr.is_ok(); r.is_err();       // solo preguntar\nr.map(|n| n * 2);            // transformar el éxito, dejar pasar el error\nr.map_err(|e| format!("contexto: {}", e)); // transformar el ERROR\n```\n\n`map_err` es la estrella nueva: deja pasar los `Ok` y **enriquece los errores** — la usarás constantemente para agregar contexto o convertir tipos de error.',
				},
				{
					type: "quiz",
					question:
						'Un usuario escribe su edad en un formulario y llega "treinta" en vez de un número. ¿Cómo debe modelarse ese fallo?',
					options: [
						{
							text: "Con Result: es un error esperable de operación normal, el programa debe manejarlo y seguir vivo",
							correct: true,
						},
						{
							text: "Con panic!: el dato es inválido y el programa no puede continuar",
							correct: false,
						},
						{
							text: "Con unwrap(): es la forma estándar de extraer valores",
							correct: false,
						},
						{
							text: "Ignorándolo: el parse devolverá 0 automáticamente",
							correct: false,
						},
					],
					explanation:
						"Input externo malo es lo MÁS normal del mundo: pasará miles de veces al día. `Result` lo convierte en un dato que tu código maneja (reintenta, avisa, usa default) sin morir. `panic!` aquí significaría que cualquier usuario puede tumbar tu programa escribiendo letras — un mini ataque de denegación de servicio gratis.",
				},
				{
					type: "quiz",
					question:
						'¿Cuál es la diferencia real entre `.unwrap()` y `.expect("mensaje")`?',
					options: [
						{
							text: "Ambos panickean si hay error, pero expect deja escrito POR QUÉ creías que no podía fallar — oro puro al depurar",
							correct: true,
						},
						{
							text: "expect maneja el error sin panickear",
							correct: false,
						},
						{
							text: "unwrap es más rápido en ejecución",
							correct: false,
						},
						{
							text: "expect reintenta la operación antes de fallar",
							correct: false,
						},
					],
					explanation:
						"Funcionalmente son gemelos: ambos extraen el `Ok` o abortan. La diferencia es el rastro: un panic de `unwrap()` te dice dónde murió; uno de `expect(\"el config.toml validado arriba debería tener 'port'\")` te dice dónde, qué suposición se rompió y por dónde empezar a buscar. Mismo costo, debugging infinitamente mejor.",
				},
				{
					type: "exercise",
					title: "Rescatar un parser lleno de unwraps",
					language: "rust",
					prompt:
						"Heredaste este código de un prototipo: lee el puerto de un servidor desde un texto de configuración. Funciona… hasta que la config viene mal, y entonces **muere con un panic críptico**.\n\nTu tarea: conviértelo en código de producción.\n\n1. Cambia la firma de `cargar_puerto` a `-> Result<u16, String>`.\n2. Nada de `unwrap`: usa `.map_err(...)` para convertir el error técnico del parse en un mensaje útil con el formato `\"'{texto}' no es un puerto válido\"` (usa el texto ya con `.trim()`).\n3. `main` ya está escrito para manejar ambos casos — haz que compile.",
					starterCode:
						'// Código heredado del prototipo. ¡Panickea con configs malas!\nfn cargar_puerto(config: &str) -> u16 {\n    config.trim().parse().unwrap()\n}\n\nfn main() {\n    assert_eq!(cargar_puerto("8080"), Ok(8080));\n    assert_eq!(cargar_puerto(" 3000 "), Ok(3000));\n    assert_eq!(\n        cargar_puerto("ochenta"),\n        Err(String::from("\'ochenta\' no es un puerto válido"))\n    );\n    // 99999 no cabe en un u16 (máx 65535): también debe ser Err, no panic.\n    assert!(cargar_puerto("99999").is_err());\n    println!("Todo OK ✅");\n}',
					solution:
						'fn cargar_puerto(config: &str) -> Result<u16, String> {\n    let texto = config.trim();\n    texto\n        .parse()\n        .map_err(|_| format!("\'{}\' no es un puerto válido", texto))\n}\n\nfn main() {\n    assert_eq!(cargar_puerto("8080"), Ok(8080));\n    assert_eq!(cargar_puerto(" 3000 "), Ok(3000));\n    assert_eq!(\n        cargar_puerto("ochenta"),\n        Err(String::from("\'ochenta\' no es un puerto válido"))\n    );\n    // 99999 no cabe en un u16 (máx 65535): también debe ser Err, no panic.\n    assert!(cargar_puerto("99999").is_err());\n    println!("Todo OK ✅");\n}',
					hints: [
						"Guarda el texto limpio primero (`let texto = config.trim();`) — lo necesitas dos veces: para parsear y para el mensaje de error.",
						"`.parse()` devuelve `Result<u16, ParseIntError>` (el u16 se infiere del retorno). `.map_err(|_| ...)` reemplaza ese error técnico por tu String.",
						"El cierre completo: `texto.parse().map_err(|_| format!(\"'{}' no es un puerto válido\", texto))` — sin `;`, es el valor de retorno.",
					],
					explanation:
						'**Lo que cambió de verdad:** la firma. `-> u16` mentía ("esto siempre funciona"); `-> Result<u16, String>` dice la verdad ("esto puede fallar, decide qué hacer"). En Rust, la honestidad va en el tipo.\n\n**Bonus que salió gratis:** el caso `"99999"` — ¿lo habías pensado? No cabe en `u16`, así que `parse` también lo rechaza y tu `map_err` lo captura sin código extra. Elegir `u16` para un puerto (máx 65535) hace que el TIPO valide el rango por ti. Eso es diseñar con tipos.\n\n**El patrón `map_err` que acabas de usar** — convertir errores técnicos en mensajes con contexto — es el pan de cada día en codebases reales, y la antesala perfecta para la próxima lección: ¿y si en vez de Strings sueltos, los errores fueran TIPOS?',
				},
				{
					type: "exercise",
					title: "🟡 Aplica — Raíz cuadrada que se niega a explotar",
					language: "rust",
					prompt:
						'Estás escribiendo el motor de cálculo de una calculadora científica. El botón √ llama a tu función. El problema: la raíz cuadrada de un número negativo no existe en los reales — y si dejas que el cálculo siga, `f64::sqrt` te devuelve `NaN` ("not a number"), un valor venenoso que contamina todo lo que toca después sin avisar.\n\nDecisión de diseño (lo que practicamos esta lección): ¿un negativo es culpa del programador o algo que pasará en operación normal? Un usuario tecleando -9 y pulsando √ es de lo MÁS normal. Por tanto: **no panickees, no devuelvas NaN — devuelve un `Result` que el llamador maneje.**\n\nImplementa `raiz_cuadrada(x: f64) -> Result<f64, String>`:\n- Si `x` es negativo → `Err` con el mensaje EXACTO `"no existe raíz real de un número negativo"`.\n- Si no → `Ok(x.sqrt())`. (`f64` tiene el método `.sqrt()`: `9.0_f64.sqrt()` es `3.0`.)\n\nFíjate en lo que NO hace tu función: no imprime, no aborta, no devuelve un número roto. Convierte un caso imposible en un dato que viaja.',
					starterCode:
						'fn raiz_cuadrada(x: f64) -> Result<f64, String> {\n    // 1. si x < 0.0 → Err con el mensaje exacto\n    // 2. si no → Ok(x.sqrt())\n}\n\nfn main() {\n    assert_eq!(raiz_cuadrada(9.0), Ok(3.0));\n    assert_eq!(raiz_cuadrada(0.0), Ok(0.0));\n    assert_eq!(raiz_cuadrada(2.0), Ok(2.0_f64.sqrt()));\n    assert_eq!(\n        raiz_cuadrada(-9.0),\n        Err(String::from("no existe raíz real de un número negativo"))\n    );\n    // Un negativo NO debe colarse como NaN: debe ser Err.\n    assert!(raiz_cuadrada(-0.001).is_err());\n    println!("Todo OK ✅");\n}',
					solution:
						'fn raiz_cuadrada(x: f64) -> Result<f64, String> {\n    if x < 0.0 {\n        Err(String::from("no existe raíz real de un número negativo"))\n    } else {\n        Ok(x.sqrt())\n    }\n}\n\nfn main() {\n    assert_eq!(raiz_cuadrada(9.0), Ok(3.0));\n    assert_eq!(raiz_cuadrada(0.0), Ok(0.0));\n    assert_eq!(raiz_cuadrada(2.0), Ok(2.0_f64.sqrt()));\n    assert_eq!(\n        raiz_cuadrada(-9.0),\n        Err(String::from("no existe raíz real de un número negativo"))\n    );\n    assert!(raiz_cuadrada(-0.001).is_err());\n    println!("Todo OK ✅");\n}',
					hints: [
						'Es un `if/else` como expresión, igual que el `dividir` del calentamiento: una rama `Err(String::from("..."))`, la otra `Ok(x.sqrt())`. Sin `;` en las ramas: son el valor de retorno.',
						'El mensaje debe ser EXACTO porque el test compara el String entero: `Err(String::from("no existe raíz real de un número negativo"))`.',
						"`x.sqrt()` ya devuelve un `f64`; solo tienes que envolverlo: `Ok(x.sqrt())`. El `0.0` cae en la rama `else` (no es `< 0.0`), así que `raiz_cuadrada(0.0)` da `Ok(0.0)` correctamente.",
					],
					explanation:
						"**Por qué este patrón aparece en código real:** `f64::sqrt` de un negativo no lanza ni avisa — devuelve `NaN`, y `NaN` es contagioso (cualquier operación con él da otro `NaN`, hasta que un resultado absurdo aparece en pantalla diez pasos después y nadie sabe de dónde salió). Tu función pone una **guarda en la frontera**: rechaza el caso inválido en el momento exacto en que entra, con un error nombrado, antes de que envenene nada.\n\n**La decisión de diseño, hecha explícita:** elegiste `Result` sobre `panic!` porque un usuario metiendo un negativo es operación normal, no un bug — y sobre devolver `NaN` porque un error honesto y visible siempre gana a un valor roto y silencioso. Esa es la regla de esta lección aplicada a un cálculo: *culpa del mundo + el llamador puede reaccionar → Result*.\n\n**Lo que viene:** ese `Err(String)` funciona, pero un String solo sirve para imprimir. En la próxima lección lo cambiamos por un **tipo de error** propio — para que el llamador pueda hacer `match` y decidir según el caso, no solo mostrar texto.",
				},
			],
		},
		{
			id: "m07_l02",
			moduleId: "m07",
			moduleSlug: "m07_errors_testing",
			order: 2,
			title: "Tus propios tipos de error",
			blocks: [
				{
					type: "first-principles",
					title: "Un String no es un error: es una excusa",
					problem:
						"Con `Err(String)`, quien recibe el error solo puede imprimirlo. ¿Reintentar si fue de red pero abortar si fue de permisos? Imposible: tendría que adivinar parseando el texto del mensaje — frágil y horrible.",
					mentalModel:
						"Un enum de errores es el menú de todo lo que puede salir mal, escrito en el sistema de tipos. Quien llama hace `match` y el compilador lo OBLIGA a considerar cada modo de fallo — igual que con los enums de m04, porque ES un enum de m04.",
					concreteExample:
						'`ErrorPago::FondosInsuficientes { faltan: 12.50 }` lleva datos accionables: la UI puede mostrar "te faltan $12.50". Con `Err("fondos insuficientes")` solo puedes rezar que el usuario lea.',
					remember:
						"String para humanos, enum para programas. El Display del enum (m06) produce el texto; las variantes producen las decisiones.",
				},
				{
					type: "challenge",
					conceptId: "m07-error-enum",
					title: "Antes de leer: errores con nombre y apellido",
					prompt:
						'**Tu reto:** valida nombres de usuario con errores tipados. El enum ya está definido — implementa `validar_nombre`:\n\n- menos de 3 caracteres → `Err(ErrorValidacion::MuyCorto)`\n- más de 20 caracteres → `Err(ErrorValidacion::MuyLargo)`\n- si pasa ambas → `Ok(())`\n\nUsa `nombre.len()` (bytes; para este reto está bien). Fíjate en el tipo de éxito: `Ok(())` — "todo bien, no hay nada que devolver". El `()` es la tupla vacía: el tipo de "nada".',
					starterCode:
						"#[derive(Debug, PartialEq)]\nenum ErrorValidacion {\n    MuyCorto,\n    MuyLargo,\n}\n\nfn validar_nombre(nombre: &str) -> Result<(), ErrorValidacion> {\n    // tu código aquí\n}",
					tests:
						'fn main() {\n    assert_eq!(validar_nombre("ana"), Ok(()));\n    assert_eq!(validar_nombre("yo"), Err(ErrorValidacion::MuyCorto));\n    assert_eq!(validar_nombre(""), Err(ErrorValidacion::MuyCorto));\n    assert_eq!(\n        validar_nombre("nombredeusuarioabsurdamentelargo"),\n        Err(ErrorValidacion::MuyLargo)\n    );\n    assert_eq!(validar_nombre("exactamente_20_chars"), Ok(()));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"#[derive(Debug, PartialEq)]\nenum ErrorValidacion {\n    MuyCorto,\n    MuyLargo,\n}\n\nfn validar_nombre(nombre: &str) -> Result<(), ErrorValidacion> {\n    if nombre.len() < 3 {\n        Err(ErrorValidacion::MuyCorto)\n    } else if nombre.len() > 20 {\n        Err(ErrorValidacion::MuyLargo)\n    } else {\n        Ok(())\n    }\n}",
					hints: [
						"Tres ramas: `if` corto, `else if` largo, `else` Ok. Todas son expresiones (sin `;`).",
						"Las variantes se nombran completas: `ErrorValidacion::MuyCorto`, como los enums de m04.",
						"El éxito sin datos se escribe `Ok(())` — paréntesis dobles: `Ok` envolviendo a la tupla vacía `()`.",
					],
					reveal:
						"Compara los dos mundos:\n\n```rust\n// Mundo String: quien llama solo puede imprimir y rezar.\nfn validar(n: &str) -> Result<(), String>\n\n// Mundo enum: quien llama DECIDE según el caso, y el compilador\n// le exige cubrir todos los modos de fallo.\nmatch validar_nombre(input) {\n    Ok(()) => crear_cuenta(input),\n    Err(ErrorValidacion::MuyCorto) => sugerir_alargarlo(),\n    Err(ErrorValidacion::MuyLargo) => ofrecer_truncado(),\n}\n```\n\nY cuando mañana agregues la variante `CaracteresInvalidos`, **cada `match` del codebase dejará de compilar** hasta que alguien decida qué hacer con ella. El compilador como lista de tareas pendientes — esa es la magia del pattern matching exhaustivo de m04 aplicada a errores. 👇",
				},
				{
					type: "text",
					body: "## Errores con datos adentro\n\nLas variantes de un enum pueden llevar carga útil (m04) — y en errores, esa carga es **información accionable**:",
				},
				{
					type: "code",
					language: "rust",
					code: 'use std::fmt;\n\n#[derive(Debug)]\nenum ErrorPago {\n    FondosInsuficientes { faltan: f64 },\n    TarjetaVencida,\n    MontoInvalido,\n}\n\n// Display (m06): la cara humana del error. El enum decide, Display narra.\nimpl fmt::Display for ErrorPago {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            ErrorPago::FondosInsuficientes { faltan } => {\n                write!(f, "fondos insuficientes: faltan ${:.2}", faltan)\n            }\n            ErrorPago::TarjetaVencida => write!(f, "la tarjeta está vencida"),\n            ErrorPago::MontoInvalido => write!(f, "el monto debe ser mayor a cero"),\n        }\n    }\n}\n\nfn pagar(saldo: f64, monto: f64) -> Result<f64, ErrorPago> {\n    if monto <= 0.0 {\n        return Err(ErrorPago::MontoInvalido);\n    }\n    if monto > saldo {\n        return Err(ErrorPago::FondosInsuficientes { faltan: monto - saldo });\n    }\n    Ok(saldo - monto)\n}\n\nfn main() {\n    // El mismo error, dos audiencias:\n    match pagar(100.0, 150.0) {\n        Ok(nuevo_saldo) => println!("✅ Pago hecho. Saldo: ${:.2}", nuevo_saldo),\n        Err(e) => {\n            println!("Para el usuario  → ❌ {}", e);    // Display: humano\n            println!("Para el log      → {:?}", e);     // Debug: programador\n        }\n    }\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: vamos a abrirla\n\nMiraste el bloque de arriba y seguro tu vista resbaló sobre ESTA línea sin entenderla del todo:\n\n```rust\nfn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n```\n\nEs jerga apretada, pero no hay magia. La abrimos pieza por pieza, de izquierda a derecha:\n\n- **`fn fmt`** — el nombre EXACTO que el trait `Display` (m06) te obliga a implementar. No lo eliges tú; es el método que `Display` pide. Cuando alguien escribe `{}` en un `println!`, por debajo se llama a este `fmt`.\n- **`&self`** — recibe TU error prestado (sin moverlo): para leer qué variante es y sacar sus datos.\n- **`f: &mut fmt::Formatter`** — `f` es la **hoja donde se escribe el texto**. La recibes prestada-mutable (`&mut`) porque vas a escribir EN ella. No la creas tú; te la pasan ya lista.\n- **`-> fmt::Result`** — devuelves "¿se pudo escribir?". `fmt::Result` es solo un `Result<(), Error>` con nombre corto: `Ok(())` = escribí bien, `Err` = falló la escritura (rarísimo, pero el tipo lo contempla).\n\nY dentro, **`write!(f, "...")`** es el `println!` de los formatters: en vez de imprimir en pantalla, escribe en esa hoja `f`. Devuelve justo el `fmt::Result` que tu función necesita retornar — por eso el `write!` es la última expresión, sin `;`.\n\nResumido en una frase: *"cuando alguien me imprima con `{}`, mira qué variante soy y escribe ESTE texto en la hoja que me pasaron"*.',
				},
				{
					type: "code",
					language: "text",
					code: 'TRAZA — qué ocurre al ejecutar:  println!("{}", ErrorPago::FondosInsuficientes { faltan: 50.0 });\n\n1. println! ve el {}  ->  "necesito el DISPLAY de este valor"\n2. Rust llama por debajo:  Display::fmt(&el_error, &mut hoja)\n                                      |              |\n                                      |              +-- f: la hoja vacía donde se escribirá\n                                      +----------------- &self: tu ErrorPago, prestado\n\n3. Dentro de fmt, el  match self  elige la rama de la variante:\n\n      ErrorPago::FondosInsuficientes { faltan }  ->  faltan = 50.0\n      write!(f, "fondos insuficientes: faltan ${:.2}", faltan)\n                                          \\______/        \\____/\n                                       formatea 2 dec.   = 50.0\n\n4. En la hoja f queda escrito:   fondos insuficientes: faltan $50.00\n   write! devuelve  Ok(())   ->  fmt devuelve  Ok(())  ->  todo bien\n\n5. println! toma el texto de la hoja y lo manda a pantalla:\n\n      fondos insuficientes: faltan $50.00\n\n--------------------------------------------------------------------\nMISMO error, OTRO trait:   println!("{:?}", el_error)   usa Debug\n   ->  FondosInsuficientes { faltan: 50.0 }      (estructura cruda, gratis con #[derive(Debug)])\n\nUn error, dos caras:  {}  -> humano (lo escribes tú)   |   {:?} -> programador (derivado)',
					runnable: false,
				},
				{
					type: "callout",
					variant: "tip",
					body: "**Convención profesional:** un tipo de error implementa `Debug` (derivado, para logs) **y** `Display` (a mano, para humanos). Con ambos, tu error puede además implementar el trait `std::error::Error` — el contrato estándar que todo el ecosistema entiende, y la puerta al `Box<dyn Error>` de la próxima lección. Las librerías `thiserror` y `anyhow` que verás en cualquier trabajo automatizan exactamente este boilerplate.",
				},
				{
					type: "text",
					body: '## El sello oficial: `impl std::error::Error`\n\nEl callout mencionó `std::error::Error`. ¿Qué es y por qué importa? Es un **trait estándar** (m06) que vive en la librería de Rust, y funciona como un sello: *"esto NO es un dato cualquiera, es un error de verdad"*. Todo el ecosistema (librerías de logs, de web, de bases de datos) habla ese idioma.\n\nLo sorprendente es cuánto cuesta ponérselo a tu enum:\n\n```rust\nimpl std::error::Error for ErrorPago {}\n```\n\nUna línea. Llaves vacías. **Cero métodos.** ¿Por qué vacía? Porque el trait `Error` tiene un único requisito de fondo: que ya implementes `Debug` y `Display` — y eso ya lo hiciste arriba. Cumplidos esos dos, declarar `impl Error` es solo **pegar el sello**: no añade comportamiento nuevo, anuncia uno que ya tenías.\n\n¿Qué te compra ese sello, en concreto?\n\n1. **Pasa por cualquier API que pida "un error".** Funciones de librerías que aceptan `impl std::error::Error` ahora aceptan el tuyo.\n2. **Entra gratis en la caja universal `Box<dyn Error>`** (lo abrimos justo abajo) — el tipo que usan los `main` y los handlers para tragar errores de cualquier procedencia.\n\nRegla práctica: si tu enum de error va a salir de tu módulo y mezclarse con errores ajenos, ponle el sello. Si es puramente interno, Display + Debug suele bastar.',
				},
				{
					type: "text",
					body: '## `Box<dyn Error>`: la caja que traga cualquier error\n\nEste tipo aparece en CASI todo `main` de Rust real, y a primera vista es puro ruido. Lo desarmamos palabra por palabra:\n\n```rust\nBox<dyn Error>\n```\n\n- **`dyn Error`** se lee *"algún tipo, no sé cuál, que cumple el trait `Error`"*. Es el trait object de m06: en vez de decir "esto es un `ErrorPago`", dices "esto es CUALQUIER cosa que sepa comportarse como un error". Tu `ErrorPago`, un `ParseIntError`, un error de red... todos caben.\n- **`Box<...>`** es necesario por un detalle físico: "cualquier error" no tiene un tamaño fijo conocido (un `ErrorPago` pesa distinto que un error de red). `Box` mueve el error al heap (m03) y deja en su lugar un puntero de tamaño fijo. La caja, no el contenido.\n\nJúntalo: **`Box<dyn Error>` = "una caja en el heap que contiene algún error — me da igual de qué tipo exacto, mientras lleve el sello `Error`"**.\n\n¿Para qué sirve? Para firmas que pueden fallar de **muchas formas distintas** sin querer enumerarlas todas:\n\n```rust\nfn doblar_entrada(texto: &str) -> Result<i32, Box<dyn Error>> {\n    let n = parsear_entero(texto)?; // tu ErrorParseo entra a la caja\n    Ok(n * 2)\n}\n```\n\nFíjate: la función NO dice `ErrorParseo`. Dice "puede fallar con cualquier error". Tu `ErrorParseo` cabe **porque le pusiste el sello `impl std::error::Error`** del bloque anterior — sin sello, no entra a la caja.\n\n(El `?` que ves ahí mete tu error en la caja por su cuenta. CÓMO lo hace exactamente — la conversión automática — es el corazón de la próxima lección; aquí quédate con la idea de la caja.)',
				},
				{
					type: "code",
					language: "text",
					code: 'TRAZA — un ErrorParseo concreto entrando a Box<dyn Error>\n\nLlamada:   doblar_entrada("hola")     // "hola" no es número\n\n  parsear_entero("hola")  devuelve  Err(ErrorParseo::NoEsNumero)\n        |\n        v\n  el  ?  ve un Err  ->  lo mete en la caja y sale de la función:\n\n      ErrorParseo::NoEsNumero            (un valor de TU tipo, tamaño conocido)\n             |  se mueve al heap dentro de un Box\n             v\n      Box<dyn Error>                     (en la pila queda solo un puntero -> heap)\n         [ ptr ] ----------------------> [ ErrorParseo::NoEsNumero ]  (en el heap)\n         [ vtable ] -> tabla que sabe llamar Display/Debug del tipo real\n\n  La función retorna:   Err( la_caja )\n\n--------------------------------------------------------------------\n¿Por qué el Box? comparación de tamaños:\n\n  ErrorParseo            -> tamaño FIJO y conocido en compilación  ✔\n  "cualquier error"      -> tamaño DESCONOCIDO (cada error pesa distinto)  ✗\n  Box<dyn Error>         -> un puntero: tamaño FIJO siempre  ✔  (por eso se exige Box)\n\nAl imprimir la caja con {}:  el puntero \'vtable\' encuentra el Display\ndel tipo REAL guardado ->  imprime:  la entrada no es un número entero',
					runnable: false,
				},
				{
					type: "faded-exercise",
					conceptId: "m07-error-tipo-propio",
					title: "🟢 Guiado: tu primer tipo de error, de cero",
					intro:
						"Vas a construir un tipo de error completo para un caso cotidiano: leer un entero de un campo de texto (un formulario, un archivo de config). El enum nombra los modos de fallo, `Display` les da voz, y la función los devuelve como datos. Observa, completa, hazlo solo. (Recuerda: el botón Verificar ejecuta un `fn main` con asserts; en código real estos serían funciones `#[test]`, pero el mecanismo de comprobación es el mismo.)",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa el tipo de error completo.** Dos modos de fallo: `Vacio` (no escribieron nada) y `NoEsNumero` (escribieron basura). El `#[derive(Debug, PartialEq)]` es OBLIGATORIO aquí: `Debug` para los logs y para que `assert_eq!` pueda imprimir el error, `PartialEq` para que los tests puedan COMPARAR `Err(ErrorParseo::Vacio)` con `==`. El `impl Display` le pone el mensaje humano a cada variante (la línea `fn fmt(&self, f: &mut fmt::Formatter)` que ya desarmamos arriba).",
							code: 'use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum ErrorParseo {\n    Vacio,\n    NoEsNumero,\n}\n\nimpl fmt::Display for ErrorParseo {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            ErrorParseo::Vacio => write!(f, "la entrada está vacía"),\n            ErrorParseo::NoEsNumero => write!(f, "la entrada no es un número entero"),\n        }\n    }\n}',
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa la función.** `parsear_entero` recibe el texto crudo y devuelve `Result<i32, ErrorParseo>`. Rellena los `___`: el tipo de error en la firma, la variante para el caso vacío, y la variante que reemplaza al error técnico del `parse` vía `map_err`. (El enum + Display del Paso 1 se asumen ya escritos arriba.)",
							code: "fn parsear_entero(texto: &str) -> Result<i32, ___> {\n    let limpio = texto.trim();\n    if limpio.is_empty() {\n        return Err(ErrorParseo::___);\n    }\n    limpio.parse().map_err(|_| ErrorParseo::___)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `parsear_entero` entero (el enum y su Display ya están definidos arriba): recorta con `.trim()`; si queda vacío devuelve `Err(ErrorParseo::Vacio)`; si no, parsea a `i32` y convierte cualquier fallo del parse en `ErrorParseo::NoEsNumero` con `.map_err(...)`. La última línea ES el retorno (sin `return`, sin `;`).",
							code: "fn parsear_entero(texto: &str) -> Result<i32, ErrorParseo> {\n    // 1. let limpio = texto.trim();\n    // 2. si limpio está vacío -> Err(ErrorParseo::Vacio)\n    // 3. limpio.parse() y convierte el error con map_err a NoEsNumero\n}",
						},
					],
					tests:
						'use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum ErrorParseo {\n    Vacio,\n    NoEsNumero,\n}\n\nimpl fmt::Display for ErrorParseo {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            ErrorParseo::Vacio => write!(f, "la entrada está vacía"),\n            ErrorParseo::NoEsNumero => write!(f, "la entrada no es un número entero"),\n        }\n    }\n}\n\nfn parsear_entero(texto: &str) -> Result<i32, ErrorParseo> {\n    let limpio = texto.trim();\n    if limpio.is_empty() {\n        return Err(ErrorParseo::Vacio);\n    }\n    limpio.parse().map_err(|_| ErrorParseo::NoEsNumero)\n}\n\nfn main() {\n    assert_eq!(parsear_entero("42"), Ok(42));\n    assert_eq!(parsear_entero("  -7 "), Ok(-7));\n    assert_eq!(parsear_entero(""), Err(ErrorParseo::Vacio));\n    assert_eq!(parsear_entero("   "), Err(ErrorParseo::Vacio));\n    assert_eq!(parsear_entero("abc"), Err(ErrorParseo::NoEsNumero));\n    assert_eq!(parsear_entero("3.5"), Err(ErrorParseo::NoEsNumero));\n    assert_eq!(format!("{}", ErrorParseo::Vacio), "la entrada está vacía");\n    assert_eq!(format!("{}", ErrorParseo::NoEsNumero), "la entrada no es un número entero");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum ErrorParseo {\n    Vacio,\n    NoEsNumero,\n}\n\nimpl fmt::Display for ErrorParseo {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            ErrorParseo::Vacio => write!(f, "la entrada está vacía"),\n            ErrorParseo::NoEsNumero => write!(f, "la entrada no es un número entero"),\n        }\n    }\n}\n\nfn parsear_entero(texto: &str) -> Result<i32, ErrorParseo> {\n    let limpio = texto.trim();\n    if limpio.is_empty() {\n        return Err(ErrorParseo::Vacio);\n    }\n    limpio.parse().map_err(|_| ErrorParseo::NoEsNumero)\n}\n\nfn main() {\n    assert_eq!(parsear_entero("42"), Ok(42));\n    assert_eq!(parsear_entero("  -7 "), Ok(-7));\n    assert_eq!(parsear_entero(""), Err(ErrorParseo::Vacio));\n    assert_eq!(parsear_entero("   "), Err(ErrorParseo::Vacio));\n    assert_eq!(parsear_entero("abc"), Err(ErrorParseo::NoEsNumero));\n    assert_eq!(parsear_entero("3.5"), Err(ErrorParseo::NoEsNumero));\n    assert_eq!(format!("{}", ErrorParseo::Vacio), "la entrada está vacía");\n    assert_eq!(format!("{}", ErrorParseo::NoEsNumero), "la entrada no es un número entero");\n    println!("__ALL_TESTS_PASSED__");\n}',
				},
				{
					type: "text",
					body: '## El patrón en producción\n\nAsí se ve el flujo completo en código real:\n\n1. **Capa baja** (parsear, red, DB): devuelve errores específicos y tipados — `ErrorPago`, `ParseIntError`.\n2. **Capa media**: hace `match` sobre las variantes que puede resolver (reintentar timeouts, usar defaults) y **propaga** el resto hacia arriba con `?`.\n3. **Capa alta** (main, handler HTTP): convierte el error en algo para el mundo exterior — un mensaje con `Display`, un status 400, una entrada de log con `Debug`.\n\nLa pieza que falta para que esto fluya — cómo "propagar el resto hacia arriba" sin escribir un match por línea — es el operador `?`, y es la próxima lección entera.',
				},
				{
					type: "quiz",
					question:
						"¿Cuál es la ventaja REAL de `Result<(), ErrorValidacion>` sobre `Result<(), String>`?",
					options: [
						{
							text: "Quien llama puede decidir con match según el modo de fallo, y el compilador le exige cubrir todas las variantes",
							correct: true,
						},
						{
							text: "Los enums ocupan menos memoria que los Strings",
							correct: false,
						},
						{
							text: "Los enums se imprimen más bonito",
							correct: false,
						},
						{
							text: "No hay ventaja real, es cuestión de estilo",
							correct: false,
						},
					],
					explanation:
						"Con String, distinguir errores = parsear texto (frágil: un typo en el mensaje rompe la lógica). Con enum, cada modo de fallo es una variante: el `match` decide, lleva datos accionables (`faltan: $12.50`), y agregar una variante nueva hace que el compilador señale TODOS los lugares que deben manejarla. (Lo de la memoria suele ser cierto, pero es un bonus, no la razón.)",
				},
				{
					type: "quiz",
					question:
						"¿Por qué un tipo de error quiere `Debug` Y `Display` a la vez?",
					options: [
						{
							text: "Son dos audiencias: Debug ({:?}) es la versión técnica para logs y desarrollo; Display ({}) es el mensaje legible para el usuario",
							correct: true,
						},
						{
							text: "Display es obligatorio para que compile el enum",
							correct: false,
						},
						{
							text: "Debug es la versión antigua de Display",
							correct: false,
						},
						{
							text: "Solo se necesita uno de los dos, da igual cuál",
							correct: false,
						},
					],
					explanation:
						'El MISMO error viaja a dos lugares: al log del servidor (quieres `FondosInsuficientes { faltan: 12.5 }` — estructura completa, derivada gratis con `#[derive(Debug)]`) y a la pantalla del usuario (quieres "fondos insuficientes: faltan $12.50" — redactado a mano con Display, como aprendiste en m06). Dos traits, dos audiencias, un error.',
				},
				{
					type: "exercise",
					title: "Parser de edad con errores que explican",
					language: "rust",
					prompt:
						'Construye `parse_edad`, el validador de un formulario real. Recibe el texto crudo y devuelve `Result<u8, ErrorEdad>` donde:\n\n- Si el texto (tras `.trim()`) no es un número entero → `Err(ErrorEdad::NoEsNumero)`\n- Si es un número pero no está entre 0 y 130 → `Err(ErrorEdad::FueraDeRango)`\n- Si todo bien → `Ok(edad)`\n\nEstrategia sugerida: parsea primero a `i32` (que acepta negativos — ¡"-5" es un número válido pero una edad inválida!), valida el rango, y convierte a `u8` con `as` al final.\n\nPista clave: `.map_err(|_| ErrorEdad::NoEsNumero)` convierte el error del parse, y el `?` al final de esa línea extrae el número o propaga el error — lo verás a fondo en la próxima lección, considéralo un adelanto.',
					starterCode:
						'#[derive(Debug, PartialEq)]\nenum ErrorEdad {\n    NoEsNumero,\n    FueraDeRango,\n}\n\nfn parse_edad(texto: &str) -> Result<u8, ErrorEdad> {\n    // 1. parsear a i32 (map_err + ?)\n    // 2. validar rango 0..=130\n    // 3. Ok(n as u8)\n    todo!()\n}\n\nfn main() {\n    assert_eq!(parse_edad("30"), Ok(30));\n    assert_eq!(parse_edad(" 25 "), Ok(25));\n    assert_eq!(parse_edad("0"), Ok(0));\n    assert_eq!(parse_edad("130"), Ok(130));\n    assert_eq!(parse_edad("abc"), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad(""), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad("200"), Err(ErrorEdad::FueraDeRango));\n    assert_eq!(parse_edad("-5"), Err(ErrorEdad::FueraDeRango));\n    println!("Todo OK ✅");\n}',
					solution:
						'#[derive(Debug, PartialEq)]\nenum ErrorEdad {\n    NoEsNumero,\n    FueraDeRango,\n}\n\nfn parse_edad(texto: &str) -> Result<u8, ErrorEdad> {\n    let n: i32 = texto.trim().parse().map_err(|_| ErrorEdad::NoEsNumero)?;\n    if n < 0 || n > 130 {\n        return Err(ErrorEdad::FueraDeRango);\n    }\n    Ok(n as u8)\n}\n\nfn main() {\n    assert_eq!(parse_edad("30"), Ok(30));\n    assert_eq!(parse_edad(" 25 "), Ok(25));\n    assert_eq!(parse_edad("0"), Ok(0));\n    assert_eq!(parse_edad("130"), Ok(130));\n    assert_eq!(parse_edad("abc"), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad(""), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad("200"), Err(ErrorEdad::FueraDeRango));\n    assert_eq!(parse_edad("-5"), Err(ErrorEdad::FueraDeRango));\n    println!("Todo OK ✅");\n}',
					hints: [
						"Línea 1: `let n: i32 = texto.trim().parse().map_err(|_| ErrorEdad::NoEsNumero)?;` — el `?` extrae el i32 si todo fue bien, o devuelve el Err inmediatamente.",
						'¿Por qué i32 y no u8 directo? Porque `"-5".parse::<u8>()` fallaría con NoEsNumero… pero -5 SÍ es un número: es una edad fuera de rango. La distinción importa para dar el error correcto.',
						"El rango: `if n < 0 || n > 130 { return Err(ErrorEdad::FueraDeRango); }` y al final `Ok(n as u8)` — el cast es seguro porque ya validaste 0..=130.",
					],
					explanation:
						'**El detalle fino de este ejercicio** está en la elección de parsear a `i32` primero: `"-5"` debe dar `FueraDeRango` (es un número, solo que inválido como edad), no `NoEsNumero`. Si hubieras parseado directo a `u8`, ambos casos se confundirían. Diseñar errores es decidir QUÉ quieres poder distinguir — y este tipo de sutileza es exactamente lo que un buen test suite captura (lección 4).\n\n**Encadenado que usaste:** `parse` → `map_err` (error técnico → tu enum) → `?` (extraer o propagar). Esa tubería de tres pasos es posiblemente la línea más común en todo el Rust de producción.',
				},
				{
					type: "challenge",
					conceptId: "m07-error-calculadora",
					title: "🔴 Reto real: el motor de una calculadora robusta",
					prompt:
						'Esto aparece en CÓDIGO REAL constantemente: un "intérprete" diminuto (una calculadora, un parser de comandos, un evaluador de reglas) que debe distinguir entre VARIOS modos de fallo para reaccionar distinto a cada uno. Strings sueltos no sirven aquí — necesitas un TIPO.\n\nConstruye el motor de una calculadora que evalúa una operación `a op b`. Tres cosas pueden salir mal, y cada una es una variante con sus datos:\n\n- **`NumeroInvalido { texto }`** — `a` o `b` no son números. Guarda el texto culpable.\n- **`OperadorDesconocido { simbolo }`** — `op` no es `+ - * /`. Guarda el símbolo.\n- **`DivisionEntreCero`** — dividir entre 0.0 (sin datos extra).\n\n**Tu trabajo:**\n1. Completa el `impl Display` (mensajes humanos para las 3 variantes — los asserts comparan el texto exacto, mira el código).\n2. Pega el sello: `impl std::error::Error for ErrorCalc {}` (línea vacía — ya tienes Debug + Display).\n3. Implementa `calcular(a, op, b) -> Result<f64, ErrorCalc>`: parsea `a` y `b` a `f64` (convirtiendo el fallo a `NumeroInvalido { texto }` con `.map_err(...)?`), y haz `match op` para operar, devolviendo la variante correcta en cada fallo.\n\nEl `#[derive(Debug, PartialEq)]` ya está puesto: por eso los tests pueden comparar errores con `==`.',
					starterCode:
						"use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum ErrorCalc {\n    NumeroInvalido { texto: String },\n    OperadorDesconocido { simbolo: char },\n    DivisionEntreCero,\n}\n\nimpl fmt::Display for ErrorCalc {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            // mensajes EXACTOS (los asserts los comparan):\n            //   NumeroInvalido { texto } -> \"'{texto}' no es un número válido\"\n            //   OperadorDesconocido { simbolo } -> \"operador desconocido: '{simbolo}'\"\n            //   DivisionEntreCero -> \"no se puede dividir entre cero\"\n            _ => write!(f, \"TODO\"),\n        }\n    }\n}\n\n// TODO: pega el sello del ecosistema (una línea, llaves vacías)\n\nfn calcular(a: &str, op: char, b: &str) -> Result<f64, ErrorCalc> {\n    // 1. parsea a -> f64 con .map_err(|_| ErrorCalc::NumeroInvalido { texto: ... })?\n    // 2. parsea b igual\n    // 3. match op: '+','-','*' devuelven Ok(...); '/' valida cero; otro -> OperadorDesconocido\n    todo!()\n}",
					tests:
						'fn main() {\n    assert_eq!(calcular("6", \'+\', "4"), Ok(10.0));\n    assert_eq!(calcular(" 10 ", \'/\', "4"), Ok(2.5));\n    assert_eq!(calcular("8", \'*\', "0"), Ok(0.0));\n    assert_eq!(calcular("9", \'-\', "3"), Ok(6.0));\n    assert_eq!(\n        calcular("dos", \'+\', "3"),\n        Err(ErrorCalc::NumeroInvalido { texto: String::from("dos") })\n    );\n    assert_eq!(calcular("5", \'/\', "0"), Err(ErrorCalc::DivisionEntreCero));\n    assert_eq!(\n        calcular("5", \'%\', "2"),\n        Err(ErrorCalc::OperadorDesconocido { simbolo: \'%\' })\n    );\n    assert_eq!(format!("{}", ErrorCalc::DivisionEntreCero), "no se puede dividir entre cero");\n    assert_eq!(\n        format!("{}", calcular("x", \'+\', "1").unwrap_err()),\n        "\'x\' no es un número válido"\n    );\n    assert_eq!(\n        format!("{}", ErrorCalc::OperadorDesconocido { simbolo: \'^\' }),\n        "operador desconocido: \'^\'"\n    );\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum ErrorCalc {\n    NumeroInvalido { texto: String },\n    OperadorDesconocido { simbolo: char },\n    DivisionEntreCero,\n}\n\nimpl fmt::Display for ErrorCalc {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            ErrorCalc::NumeroInvalido { texto } => {\n                write!(f, "\'{}\' no es un número válido", texto)\n            }\n            ErrorCalc::OperadorDesconocido { simbolo } => {\n                write!(f, "operador desconocido: \'{}\'", simbolo)\n            }\n            ErrorCalc::DivisionEntreCero => write!(f, "no se puede dividir entre cero"),\n        }\n    }\n}\n\nimpl std::error::Error for ErrorCalc {}\n\nfn calcular(a: &str, op: char, b: &str) -> Result<f64, ErrorCalc> {\n    let x: f64 = a\n        .trim()\n        .parse()\n        .map_err(|_| ErrorCalc::NumeroInvalido { texto: a.trim().to_string() })?;\n    let y: f64 = b\n        .trim()\n        .parse()\n        .map_err(|_| ErrorCalc::NumeroInvalido { texto: b.trim().to_string() })?;\n    match op {\n        \'+\' => Ok(x + y),\n        \'-\' => Ok(x - y),\n        \'*\' => Ok(x * y),\n        \'/\' => {\n            if y == 0.0 {\n                Err(ErrorCalc::DivisionEntreCero)\n            } else {\n                Ok(x / y)\n            }\n        }\n        otro => Err(ErrorCalc::OperadorDesconocido { simbolo: otro }),\n    }\n}\n\nfn main() {\n    assert_eq!(calcular("6", \'+\', "4"), Ok(10.0));\n    assert_eq!(calcular(" 10 ", \'/\', "4"), Ok(2.5));\n    assert_eq!(calcular("8", \'*\', "0"), Ok(0.0));\n    assert_eq!(calcular("9", \'-\', "3"), Ok(6.0));\n    assert_eq!(\n        calcular("dos", \'+\', "3"),\n        Err(ErrorCalc::NumeroInvalido { texto: String::from("dos") })\n    );\n    assert_eq!(calcular("5", \'/\', "0"), Err(ErrorCalc::DivisionEntreCero));\n    assert_eq!(\n        calcular("5", \'%\', "2"),\n        Err(ErrorCalc::OperadorDesconocido { simbolo: \'%\' })\n    );\n    assert_eq!(format!("{}", ErrorCalc::DivisionEntreCero), "no se puede dividir entre cero");\n    assert_eq!(\n        format!("{}", calcular("x", \'+\', "1").unwrap_err()),\n        "\'x\' no es un número válido"\n    );\n    assert_eq!(\n        format!("{}", ErrorCalc::OperadorDesconocido { simbolo: \'^\' }),\n        "operador desconocido: \'^\'"\n    );\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Display: cada rama del match saca los datos de la variante y los escribe. Ej.: `ErrorCalc::NumeroInvalido { texto } => write!(f, \"'{}' no es un número válido\", texto)`. Cuida las comillas simples literales del mensaje.",
						"El sello es literal: `impl std::error::Error for ErrorCalc {}` — llaves vacías, fuera del impl de Display. Compila porque ya tienes Debug (derivado) y Display (a mano).",
						"Parsear con contexto: `let x: f64 = a.trim().parse().map_err(|_| ErrorCalc::NumeroInvalido { texto: a.trim().to_string() })?;`. El `?` saca el f64 o propaga el Err ya convertido a TU tipo.",
						"El `match op` cubre `'+','-','*'` con `Ok(...)`; `'/'` chequea `if y == 0.0`; y el comodín `otro => Err(ErrorCalc::OperadorDesconocido { simbolo: otro })` captura cualquier otro carácter.",
					],
					reveal:
						'**Por qué este patrón aparece en código real:** cualquier programa que INTERPRETE entrada — una calculadora, un parser de comandos de chat, un motor de reglas, un mini-lenguaje de config — tiene exactamente esta forma: varias maneras de fallar que el llamador necesita distinguir.\n\n```rust\nmatch calcular(a, op, b) {\n    Ok(r) => mostrar(r),\n    Err(ErrorCalc::NumeroInvalido { texto }) => resaltar_campo(texto), // marca el input rojo\n    Err(ErrorCalc::DivisionEntreCero) => avisar("∞ no es un número"),  // mensaje especial\n    Err(ErrorCalc::OperadorDesconocido { simbolo }) => sugerir_operadores(simbolo),\n}\n```\n\nCon `Err(String)` esto sería imposible: las tres ramas se colapsarían en "imprime el texto y reza". El enum convirtió cada modo de fallo en una **decisión** que el compilador te obliga a tomar.\n\nFíjate además en cómo los tests verificaron DOS caras del error: las variantes con `assert_eq!(..., Err(ErrorCalc::...))` (gracias a `PartialEq`) y los mensajes con `format!("{}", ...)` (gracias a `Display`). Dos audiencias, un tipo.\n\nLo último que falta: ese `.map_err(...)?` lo escribiste DOS veces, casi idéntico. ¿Y si el `?` pudiera convertir el error él solo, sin el `map_err`? Puede — con el trait `From` de m06. Esa es, palabra por palabra, la próxima lección. 👇',
				},
			],
		},
		{
			id: "m07_l03",
			moduleId: "m07",
			moduleSlug: "m07_errors_testing",
			order: 3,
			title: "El operador ? a fondo",
			blocks: [
				{
					type: "first-principles",
					title: 'Propagar: "este error no es mío — súbelo"',
					problem:
						"La mayoría de las funciones no saben qué hacer con un error: una función que parsea no sabe si la app quiere reintentar, avisar o abortar. Manejarlo ahí sería decidir por otros. Pero escribir un match de 4 líneas por cada operación falible entierra la lógica en burocracia.",
					mentalModel:
						"El `?` es la escalera de incendios del error: si la operación salió bien, te quedas con el valor y sigues; si salió mal, el error sube UN piso (al llamador) inmediatamente. Cada piso decide: lo manejo aquí, o sigue subiendo.",
					concreteExample:
						"`let n: i32 = texto.parse()?;` — dos caracteres reemplazan cuatro líneas de match, y la función se lee como el camino feliz: parsea, calcula, devuelve. Los errores fluyen solos por la firma.",
					remember:
						"? no maneja errores: los DELEGA. Y solo funciona dentro de funciones que devuelven Result (u Option) — el error necesita un tipo por donde salir.",
				},
				{
					type: "challenge",
					conceptId: "m07-propagate",
					title: "Antes de leer: mata la burocracia",
					prompt:
						"**Tu reto:** suma dos números que llegan como texto. La versión burocrática sería:\n\n```rust\nlet x = match a.trim().parse::<i32>() {\n    Ok(n) => n,\n    Err(e) => return Err(e),\n};\n// …y lo mismo para b. Ocho líneas de nada.\n```\n\nEscríbela con el operador `?`: el cuerpo completo son **3 líneas**. Fíjate en la firma: el tipo de error es `std::num::ParseIntError` — el mismo que produce `.parse()`, así que el `?` propaga sin conversión alguna.",
					starterCode:
						"fn sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    // parsea a, parsea b (con ?), devuelve Ok(suma)\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(sumar_strs("2", "3"), Ok(5));\n    assert_eq!(sumar_strs(" 10 ", "-4"), Ok(6));\n    assert!(sumar_strs("dos", "3").is_err());\n    assert!(sumar_strs("2", "").is_err());\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    let x: i32 = a.trim().parse()?;\n    let y: i32 = b.trim().parse()?;\n    Ok(x + y)\n}",
					hints: [
						"Cada parse lleva su `?` al final: `let x: i32 = a.trim().parse()?;` — si falla, la función retorna ese Err ahí mismo.",
						"Al final, el resultado exitoso se envuelve: `Ok(x + y)`. El `?` desenvuelve; al devolver, tú vuelves a envolver.",
					],
					reveal:
						"Mira lo que hace el `?` por debajo — es exactamente el match que NO escribiste:\n\n```rust\n// esto:\nlet x: i32 = a.trim().parse()?;\n\n// se expande a esto:\nlet x: i32 = match a.trim().parse() {\n    Ok(valor) => valor,                  // extrae y sigue\n    Err(e) => return Err(From::from(e)), // sal de la función YA\n};\n```\n\nDos detalles de oro:\n\n1. **El `return` está adentro**: por eso `?` solo compila en funciones que devuelven `Result` — el error necesita una salida del tipo correcto.\n2. **Ese `From::from(e)`** convierte el error al tipo de error de TU función automáticamente… usando el trait `From` que aprendiste en m06. Esa conversión silenciosa es la clave de esta lección. 👇",
				},
				{
					type: "text",
					body: "## La conversión automática: ? + From\n\nEl detalle del `From::from(e)` en la expansión cambia todo: si tu tipo de error implementa `From<ErrorAjeno>`, el `?` convierte **solo**. Conecta esto con m06:\n\n```rust\nenum MiError {\n    Parseo,\n    Vacio,\n}\n\nimpl From<std::num::ParseIntError> for MiError {\n    fn from(_: std::num::ParseIntError) -> Self {\n        MiError::Parseo\n    }\n}\n\nfn procesar(s: &str) -> Result<i32, MiError> {\n    let n: i32 = s.parse()?;  // ParseIntError → MiError, AUTOMÁTICO\n    Ok(n * 2)\n}\n```\n\nSin el `impl From`, habrías escrito `.map_err(|_| MiError::Parseo)?` en cada llamada. Con él, escribes la conversión UNA vez y todos los `?` del archivo la usan. Así escala el manejo de errores en codebases grandes.",
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: vamos a abrirla\n\nMira otra vez esta línea, porque parece inocente y NO lo es:\n\n```rust\nfn procesar(s: &str) -> Result<i32, MiError> {\n    let n: i32 = s.parse()?;   // ← aquí pasan TRES cosas, no una\n    Ok(n * 2)\n}\n```\n\nEl problema mental es este: `s.parse()` produce un `Result<i32, ParseIntError>` — su error es `ParseIntError`. Pero tu función promete devolver `Result<i32, MiError>` — su error es `MiError`. **Son tipos distintos.** ¿Cómo puede un `?` que saca un `ParseIntError` salir por una puerta que solo deja pasar `MiError`?\n\nLa respuesta es que el `?` hace una conversión a escondidas. Desarmemos las tres cosas que ocurren en ese único caracter:\n\n1. **Mira qué hay dentro del Result.** ¿Es `Ok(valor)` o `Err(e)`?\n2. **Si es `Ok(valor)`:** saca el valor desnudo (`i32`) y la línea continúa — `n` vale ese número.\n3. **Si es `Err(e)`:** NO retorna el error tal cual. Primero llama `From::from(e)` para convertir el `ParseIntError` en un `MiError` (usando tu `impl From<ParseIntError> for MiError`), y SOLO ENTONCES hace `return Err(ese_MiError)`.\n\nEse paso 3 es la magia que m04 no te contó. En m04 el `?` parecía propagar "el mismo error". Aquí ves la verdad: el `?` **traduce el error al idioma de tu función** antes de dejarlo subir. El puente de traducción es el trait `From` de m06. Sin `impl From`, los tipos no cuadran y el compilador se planta: *"no encuentro cómo convertir `ParseIntError` en `MiError`"*.',
				},
				{
					type: "code",
					language: "text",
					code: 'TRAZA: qué hace `let n: i32 = s.parse()?;` cuando s = "x"\nfn procesar(s: &str) -> Result<i32, MiError>   // la firma promete error = MiError\n\nPaso 0  s.parse::<i32>()  produce →  Err(ParseIntError)   ("x" no es número)\n        El error AQUÍ es de tipo ParseIntError. NO es MiError todavía.\n\n        El `?` expande a este match (lo que NO escribiste):\n        match s.parse() {\n            Ok(valor)  => valor,\n            Err(e)     => return Err(From::from(e)),\n        }\n\nPaso 1  ¿Ok o Err?  → es Err(e), con e = ParseIntError\nPaso 2  From::from(e)\n          busca:  impl From<ParseIntError> for MiError\n          ejecuta: fn from(_) -> Self { MiError::Parseo }\n          resultado:  MiError::Parseo        ← ¡traducido! ya es MiError\nPaso 3  return Err(MiError::Parseo)\n          el tipo del Err coincide con la firma (MiError). COMPILA y RETORNA.\n          La línea `Ok(n * 2)` NUNCA se ejecuta.\n\n--------------------------------------------------------------------\nTRAZA: el mismo `?` cuando s = "21"  (camino feliz)\nPaso 0  s.parse::<i32>()  produce →  Ok(21)\nPaso 1  ¿Ok o Err?  → es Ok(21)\nPaso 2  saca el valor desnudo:  n = 21   (NO hay conversión, NO hay return)\nPaso 3  la función SIGUE en la línea de abajo → Ok(21 * 2) = Ok(42)\n\nRegla de oro:\n  Ok(v)  -> saca v y sigue.\n  Err(e) -> From::from(e) -> return Err(...).   <- el ÚNICO sitio que convierte.\n\nSi NO existe `impl From<ParseIntError> for MiError`, el Paso 2 no tiene\nfunción que llamar -> error de compilación:\n  `?` couldn\'t convert the error to `MiError`\n  the trait `From<ParseIntError>` is not implemented for `MiError`',
					runnable: false,
				},
				{
					type: "text",
					body: "## ¿Y en main? Box<dyn Error>\n\n¿Qué tipo de error pones cuando una función puede fallar de formas de DISTINTOS tipos (un ParseIntError aquí, un error de UTF-8 allá)? La respuesta usa tu otro conocimiento de m06 — trait objects:",
				},
				{
					type: "code",
					language: "rust",
					code: 'use std::error::Error;\n\n// Box<dyn Error> = "una caja con CUALQUIER error del ecosistema".\n// Todo error decente implementa el trait std::error::Error,\n// y Box<dyn Error> implementa From<E> para todos ellos →\n// el ? convierte cualquier error a la caja, gratis.\nfn procesar() -> Result<(), Box<dyn Error>> {\n    let n: i32 = "42".trim().parse()?;          // ParseIntError → Box<dyn Error>\n    println!("n = {}", n);\n\n    let bytes = vec![240, 40];                    // UTF-8 inválido a propósito\n    let texto = String::from_utf8(bytes)?;        // FromUtf8Error → Box<dyn Error>\n    println!("texto = {}", texto);                // (no llegamos aquí)\n    Ok(())\n}\n\nfn main() {\n    match procesar() {\n        Ok(()) => println!("todo bien"),\n        Err(e) => println!("falló: {}", e),  // Display del error original\n    }\n}',
					runnable: true,
				},
				{
					type: "text",
					body: '## Por qué `Box<dyn Error>` traga CUALQUIER error\n\nVuelve a la traza de arriba: el `?` solo compila si existe un `From<ErrorChico>` hacia el tipo de error de tu función. Entonces, ¿cómo es que en esa función con `Box<dyn Error>` el `?` aceptó **dos errores de tipos distintos** (`ParseIntError` Y `FromUtf8Error`) sin que escribieras ni un `impl From`?\n\nDesarmemos `Box<dyn Error>` palabra por palabra, porque cada pieza carga significado:\n\n- **`dyn Error`** = "algún tipo, no sé cuál en tiempo de compilación, que implementa el trait `std::error::Error`". Es un *trait object* de m06: borra el tipo concreto y deja solo la promesa "sé comportarme como un Error" (tiene `Display`, tiene `source()`...). `ParseIntError` lo implementa. `FromUtf8Error` lo implementa. Casi todo error serio de Rust lo implementa.\n- **`Box<...>`** = lo metes en el heap porque un `dyn Error` no tiene tamaño conocido (podría ser cualquier error, grande o pequeño). `Box` le da un tamaño fijo: el de un puntero.\n\nY aquí está el regalo: la librería estándar trae de fábrica `impl From<E> for Box<dyn Error>` **para todo `E` que implemente `Error`**. O sea, el `From` que el `?` necesita YA está escrito, una vez, para todos. Por eso el Paso 2 de la traza siempre encuentra su conversión: cualquier error entra a la caja gratis.\n\nLa contrapartida (y por eso NO es la respuesta para todo): al meter el error en la caja, **borras su tipo concreto**. Quien reciba el `Box<dyn Error>` puede imprimirlo (`Display`), pero ya no puede hacer `match` para distinguir "¿fue un fallo de formato o de puerto?". Por eso la regla del callout de abajo: caja para aplicaciones (solo loguear), enum propio para librerías (el llamador decide por variante).',
				},
				{
					type: "code",
					language: "text",
					code: 'DOS RUTAS DEL MISMO `?`, según el tipo de error de la firma\n\n┌─ Firma A:  fn f() -> Result<i32, MiError>\n│  Dentro:   let n = s.parse()?;        // parse da Err(ParseIntError)\n│\n│  Paso 2 del ?:  From::from(ParseIntError)\n│    ¿quién provee el From?  -> TÚ:  impl From<ParseIntError> for MiError\n│    si no lo escribiste -> NO COMPILA\n│  Resultado del Err:  MiError::Parseo   (un tipo CONCRETO)\n│  El llamador PUEDE:  match e { MiError::Parseo => ..., MiError::Vacio => ... }\n└─ Uso típico:  LIBRERÍAS (otros hacen match sobre tus modos de fallo)\n\n┌─ Firma B:  fn f() -> Result<i32, Box<dyn Error>>\n│  Dentro:   let n = s.parse()?;        // parse da Err(ParseIntError)\n│           let t = String::from_utf8(bytes)?;  // da Err(FromUtf8Error)\n│\n│  Paso 2 del ? (1ª línea):  From::from(ParseIntError)\n│    ¿quién provee el From?  -> LA STD:  impl<E: Error> From<E> for Box<dyn Error>\n│    NO escribes nada. Ya existe para TODO error.\n│  Paso 2 del ? (2ª línea):  From::from(FromUtf8Error)\n│    mismo impl de la std -> también entra a la caja. Gratis.\n│  Resultado del Err:  Box<dyn Error>   (tipo BORRADO)\n│  El llamador SOLO PUEDE:  println!("{}", e)   (Display)  -> no hay match\n└─ Uso típico:  APLICACIONES (main, handlers: solo logueas el error)\n\nMisma sintaxis `s.parse()?`. La firma decide quién hace la conversión\ny cuánta información del error sobrevive.',
					runnable: false,
				},
				{
					type: "callout",
					variant: "tip",
					body: "**¿Enum propio o Box<dyn Error>?** Regla de mundo real: en **librerías** (código que otros llaman), enum propio — tus usuarios quieren hacer match sobre tus modos de fallo. En **aplicaciones** (main, scripts, handlers), `Box<dyn Error>` — solo vas a loguear el error, no a decidir por variante. Las crates `thiserror` (enums sin boilerplate) y `anyhow` (Box mejorado con contexto) automatizan cada lado; cuando las veas en un trabajo, ya sabes qué hacen por dentro.",
				},
				{
					type: "text",
					body: "## Bonus: ? también funciona con Option\n\nLa misma escalera de incendios sirve para la ausencia: dentro de una función que devuelve `Option`, el `?` extrae el `Some` o retorna `None`:\n\n```rust\nfn primera_inicial(nombre_completo: &str) -> Option<char> {\n    let primera_palabra = nombre_completo.split_whitespace().next()?;\n    primera_palabra.chars().next()\n}\n```\n\nDos posibles ausencias (sin palabras / palabra vacía), cero matches anidados. La simetría Option/Result que viste en m04 llega hasta aquí.",
				},
				{
					type: "faded-exercise",
					conceptId: "m07-question-mark",
					title: "🟢 Guiado: tuberías con ?",
					intro:
						"Vamos a construir funciones falibles donde el camino feliz se lee de corrido y los errores fluyen solos. Observa, completa, hazlo solo.",
					stages: [
						{
							kind: "worked",
							instructions:
								'**Paso 1 — observa.** `leer_par` parsea una línea `"x,y"` a una tupla. Dos operaciones falibles, dos `?`. Si CUALQUIER parse falla, la función retorna ese error de inmediato — el `Ok((a, b))` final solo se alcanza con ambos éxitos.',
							code: 'fn leer_par(linea: &str) -> Result<(i32, i32), std::num::ParseIntError> {\n    let mut partes = linea.split(\',\');\n    let a: i32 = partes.next().unwrap_or("").trim().parse()?;\n    let b: i32 = partes.next().unwrap_or("").trim().parse()?;\n    Ok((a, b))\n}',
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** `duplicar_parseado` parsea un texto y devuelve el doble. Rellena los `___`: el método que parsea, el operador que propaga, y el envoltorio del resultado final.",
							code: "fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let n: i32 = s.trim().___()___;\n    ___(n * 2)\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `duplicar_parseado` desde cero: parsea (propagando con `?`) y devuelve el doble envuelto en Ok.",
							code: "fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(duplicar_parseado("21"), Ok(42));\n    assert_eq!(duplicar_parseado(" 5 "), Ok(10));\n    assert_eq!(duplicar_parseado("-3"), Ok(-6));\n    assert!(duplicar_parseado("x").is_err());\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let n: i32 = s.trim().parse()?;\n    Ok(n * 2)\n}",
				},
				{
					type: "faded-exercise",
					conceptId: "m07-box-dyn-error",
					title:
						"🟢 Guiado: una caja para dos fallos distintos (Box<dyn Error>)",
					intro:
						'Lees una línea de log con formato `"codigo|reintentos"` (ej. `"500|3"`). Dos cosas pueden fallar y son de TIPOS de error distintos: el formato (sin `|`) y los números (no parseables). En vez de inventar un enum, usas `Box<dyn Error>`: una sola firma que acepta ambos vía el `From` que la std regala. Observa cómo UN mismo `?` traga errores de orígenes diferentes.',
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** `partir_log` separa la línea en dos trozos. El error de `split_once` es un `&str` nuestro (vía `.ok_or(...)`), pero como la firma devuelve `Box<dyn Error>`, el `?` mete ese `&str` en la caja (la std tiene `From<&str> for Box<dyn Error>`). Una operación falible, un `?`, error encajonado.",
							code: "use std::error::Error;\n\nfn partir_log(linea: &str) -> Result<(&str, &str), Box<dyn Error>> {\n    let par = linea.split_once('|').ok_or(\"falta el separador '|'\")?;\n    Ok(par)\n}",
						},
						{
							kind: "faded",
							instructions:
								"**Paso 2 — completa.** `leer_log` parsea los DOS trozos a número. `codigo` es `u16`, `reintentos` es `u8`. Cada `.parse()` produce un `ParseIntError`, de tipo distinto al `&str` de arriba — pero la MISMA caja los acepta a ambos. Rellena los `___`: el operador que propaga-y-encajona, y el envoltorio final.",
							code: "use std::error::Error;\n\nfn leer_log(linea: &str) -> Result<(u16, u8), Box<dyn Error>> {\n    let (cod_str, rei_str) = linea.split_once('|').ok_or(\"falta el separador '|'\")?;\n    let codigo: u16 = cod_str.trim().parse()___;\n    let reintentos: u8 = rei_str.trim().parse()___;\n    ___((codigo, reintentos))\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `leer_log` desde cero: parte por `|` (propagando un error de texto si falta), parsea `codigo: u16` y `reintentos: u8` con `?`, y devuelve la tupla en `Ok`. La firma `Box<dyn Error>` hace que los tres errores distintos quepan sin un solo `impl From`.",
							code: "use std::error::Error;\n\nfn leer_log(linea: &str) -> Result<(u16, u8), Box<dyn Error>> {\n    // parte por '|' (ok_or + ?), parsea ambos números (?), devuelve Ok((..))\n}",
						},
					],
					tests:
						'use std::error::Error;\n\nfn leer_log(linea: &str) -> Result<(u16, u8), Box<dyn Error>> {\n    let (cod_str, rei_str) = linea.split_once(\'|\').ok_or("falta el separador \'|\'")?;\n    let codigo: u16 = cod_str.trim().parse()?;\n    let reintentos: u8 = rei_str.trim().parse()?;\n    Ok((codigo, reintentos))\n}\n\nfn main() {\n    assert_eq!(leer_log("500|3").unwrap(), (500u16, 3u8));\n    assert_eq!(leer_log(" 404 | 0 ").unwrap(), (404u16, 0u8));\n    assert!(leer_log("500-3").is_err());\n    assert!(leer_log("abc|3").is_err());\n    assert!(leer_log("500|x").is_err());\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'use std::error::Error;\n\nfn leer_log(linea: &str) -> Result<(u16, u8), Box<dyn Error>> {\n    let (cod_str, rei_str) = linea.split_once(\'|\').ok_or("falta el separador \'|\'")?;\n    let codigo: u16 = cod_str.trim().parse()?;\n    let reintentos: u8 = rei_str.trim().parse()?;\n    Ok((codigo, reintentos))\n}\n\nfn main() {\n    assert_eq!(leer_log("500|3").unwrap(), (500u16, 3u8));\n    assert_eq!(leer_log(" 404 | 0 ").unwrap(), (404u16, 0u8));\n    assert!(leer_log("500-3").is_err());\n    assert!(leer_log("abc|3").is_err());\n    assert!(leer_log("500|x").is_err());\n    println!("__ALL_TESTS_PASSED__");\n}',
				},
				{
					type: "quiz",
					question:
						"¿Por qué `?` solo se puede usar dentro de funciones que devuelven Result (u Option)?",
					options: [
						{
							text: "Porque ? contiene un return Err(...) escondido: necesita que la firma de la función tenga un tipo por donde ese error pueda salir",
							correct: true,
						},
						{
							text: "Es una limitación arbitraria que van a quitar",
							correct: false,
						},
						{
							text: "Porque ? consume mucha memoria",
							correct: false,
						},
						{
							text: "Sí se puede usar en cualquier función desde Rust 2021",
							correct: false,
						},
					],
					explanation:
						"Recuerda la expansión: `?` es un `match` cuyo brazo Err hace `return Err(From::from(e))`. Ese `return` devuelve DESDE TU FUNCIÓN — si tu función devuelve `i32` a secas, no hay forma de retornar un error por ahí. Por eso en `fn main` se usa la firma `fn main() -> Result<(), Box<dyn Error>>` cuando quieres `?` directo en main.",
				},
				{
					type: "quiz",
					question:
						"Tu función devuelve `Result<T, MiError>` y adentro llamas algo que falla con `ParseIntError`. ¿Qué necesita el `?` para compilar ahí?",
					options: [
						{
							text: "Que exista impl From<ParseIntError> for MiError — el ? la usa para convertir el error automáticamente",
							correct: true,
						},
						{
							text: "Nada: el ? convierte cualquier error a cualquier otro",
							correct: false,
						},
						{
							text: "Que MiError sea un String",
							correct: false,
						},
						{
							text: "Usar dos ?? seguidos para la doble conversión",
							correct: false,
						},
					],
					explanation:
						"La expansión del `?` llama `From::from(e)` sobre el error antes de retornarlo — el trait From de m06 trabajando de incógnito. Si la conversión existe, los tipos cuadran y todo fluye; si no, el compilador te pide el `impl From` o un `.map_err()` manual en esa llamada. Escribir la conversión una vez libera a todos los `?` del módulo.",
				},
				{
					type: "exercise",
					title: "🟡 Aplica: pipeline de configuración con errores unificados",
					language: "rust",
					prompt:
						'Estás cargando la configuración `"host:puerto"` de un servidor (como `"localhost:8080"`). Pueden fallar DOS cosas distintas: el formato (sin `:`) y el puerto (no numérico). Únelas en un solo flujo:\n\n1. Implementa `From<std::num::ParseIntError> for ErrorConfig` devolviendo `ErrorConfig::PuertoInvalido`.\n2. Implementa `parsear_config`:\n   - Sin `:` en el texto → `Err(ErrorConfig::FormatoInvalido)`. Pista: `texto.split_once(\':\')` devuelve `Option<(&str, &str)>`; conviértelo con `.ok_or(ErrorConfig::FormatoInvalido)?`.\n   - Parsea el puerto con `.parse()?` — y aquí tu `impl From` hace la magia: el ParseIntError se convierte SOLO.\n   - Devuelve `Ok(Config { host, puerto })`.',
					starterCode:
						'#[derive(Debug, PartialEq)]\nenum ErrorConfig {\n    FormatoInvalido,\n    PuertoInvalido,\n}\n\n#[derive(Debug, PartialEq)]\nstruct Config {\n    host: String,\n    puerto: u16,\n}\n\n// TODO 1: impl From<std::num::ParseIntError> for ErrorConfig\n\nfn parsear_config(texto: &str) -> Result<Config, ErrorConfig> {\n    // TODO 2: split_once + ok_or + parse con ?\n    todo!()\n}\n\nfn main() {\n    assert_eq!(\n        parsear_config("localhost:8080"),\n        Ok(Config { host: String::from("localhost"), puerto: 8080 })\n    );\n    assert_eq!(parsear_config("sin-dos-puntos"), Err(ErrorConfig::FormatoInvalido));\n    assert_eq!(parsear_config("host:abc"), Err(ErrorConfig::PuertoInvalido));\n    assert_eq!(parsear_config("host:99999"), Err(ErrorConfig::PuertoInvalido));\n    println!("Todo OK ✅");\n}',
					solution:
						'#[derive(Debug, PartialEq)]\nenum ErrorConfig {\n    FormatoInvalido,\n    PuertoInvalido,\n}\n\n#[derive(Debug, PartialEq)]\nstruct Config {\n    host: String,\n    puerto: u16,\n}\n\nimpl From<std::num::ParseIntError> for ErrorConfig {\n    fn from(_: std::num::ParseIntError) -> Self {\n        ErrorConfig::PuertoInvalido\n    }\n}\n\nfn parsear_config(texto: &str) -> Result<Config, ErrorConfig> {\n    let (host, puerto_str) = texto.split_once(\':\').ok_or(ErrorConfig::FormatoInvalido)?;\n    let puerto: u16 = puerto_str.trim().parse()?;\n    Ok(Config {\n        host: String::from(host),\n        puerto,\n    })\n}\n\nfn main() {\n    assert_eq!(\n        parsear_config("localhost:8080"),\n        Ok(Config { host: String::from("localhost"), puerto: 8080 })\n    );\n    assert_eq!(parsear_config("sin-dos-puntos"), Err(ErrorConfig::FormatoInvalido));\n    assert_eq!(parsear_config("host:abc"), Err(ErrorConfig::PuertoInvalido));\n    assert_eq!(parsear_config("host:99999"), Err(ErrorConfig::PuertoInvalido));\n    println!("Todo OK ✅");\n}',
					hints: [
						"El From es mecánico: `impl From<std::num::ParseIntError> for ErrorConfig { fn from(_: std::num::ParseIntError) -> Self { ErrorConfig::PuertoInvalido } }`.",
						"`.ok_or(valor_de_error)` convierte `Option<T>` en `Result<T, E>`: `Some(x)` → `Ok(x)`, `None` → `Err(valor)`. Encadenado con `?`, extrae la tupla o propaga FormatoInvalido.",
						"Gracias a tu From, la línea del puerto es simplemente `let puerto: u16 = puerto_str.trim().parse()?;` — sin map_err. Eso es lo que el impl te compró.",
					],
					explanation:
						"**Mira tu `parsear_config` terminada: tres líneas que se leen como el camino feliz**, con DOS modos de fallo distintos fluyendo por debajo. Esa es la estética del Rust profesional: la lógica visible, los errores en la fontanería.\n\n**Las dos piezas que lo hicieron posible:**\n- `.ok_or(...)` — el puente Option→Result (la familia completa: `ok_or`, `ok_or_else`, y su inverso `.ok()`).\n- `impl From<ParseIntError>` — la conversión central que TODOS los `?` del módulo reutilizan. Agregar un campo `timeout` mañana no necesita map_err: su parse usa el mismo From.\n\n**Y el caso `99999`** repite la lección de l01: u16 valida el rango del puerto gratis. Tipos correctos = validaciones gratis.",
				},
				{
					type: "challenge",
					conceptId: "m07-pipeline-ticket",
					title:
						"🔴 Reto real: pipeline de un ticket de venta con ? encadenado",
					prompt:
						'**Por qué esto aparece en código real:** un punto de venta recibe cada línea de ticket como texto plano `"cantidad,precio_unitario"` (ej. `"3,12.50"`) y necesita el total `cantidad * precio`. Hay un pipeline de etapas, cada una falible y de un TIPO de error distinto:\n\n1. partir por `,` (puede faltar) → error de **formato**\n2. parsear la cantidad como entero (`u32`) → produce `ParseIntError`\n3. parsear el precio como flotante (`f64`) → produce `ParseFloatError`\n\nTres orígenes de fallo, tres tipos distintos. La técnica profesional: **un enum propio que los unifica**, y el `?` traduciendo cada error ajeno vía `From`. Así el cuerpo de `total_linea` se lee como el camino feliz (parte, parsea, parsea, multiplica) y los fallos fluyen por la fontanería.\n\n**Tu trabajo:**\n1. `impl From<std::num::ParseIntError> for ErrorTicket` → `ErrorTicket::CantidadInvalida`.\n2. `impl From<std::num::ParseFloatError> for ErrorTicket` → `ErrorTicket::PrecioInvalido`.\n3. `total_linea`: parte con `split_once(\',\')` + `.ok_or(ErrorTicket::Formato)?`; parsea `cantidad: u32` y `precio: f64` con `?` (tus `From` los convierten solos); devuelve `Ok(cantidad as f64 * precio)`.',
					starterCode:
						"#[derive(Debug, PartialEq)]\nenum ErrorTicket {\n    Formato,\n    CantidadInvalida,\n    PrecioInvalido,\n}\n\n// TODO 1: impl From<std::num::ParseIntError> for ErrorTicket -> CantidadInvalida\n\n// TODO 2: impl From<std::num::ParseFloatError> for ErrorTicket -> PrecioInvalido\n\nfn total_linea(linea: &str) -> Result<f64, ErrorTicket> {\n    // TODO 3: split_once(',') + ok_or(Formato)? ; parse u32 ? ; parse f64 ? ; Ok(cant as f64 * precio)\n    todo!()\n}",
					tests:
						'fn main() {\n    assert_eq!(total_linea("3,12.50"), Ok(37.5));\n    assert_eq!(total_linea(" 2 , 10 "), Ok(20.0));\n    assert_eq!(total_linea("sin-coma"), Err(ErrorTicket::Formato));\n    assert_eq!(total_linea("x,12.50"), Err(ErrorTicket::CantidadInvalida));\n    assert_eq!(total_linea("3,doce"), Err(ErrorTicket::PrecioInvalido));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'#[derive(Debug, PartialEq)]\nenum ErrorTicket {\n    Formato,\n    CantidadInvalida,\n    PrecioInvalido,\n}\n\nimpl From<std::num::ParseIntError> for ErrorTicket {\n    fn from(_: std::num::ParseIntError) -> Self {\n        ErrorTicket::CantidadInvalida\n    }\n}\n\nimpl From<std::num::ParseFloatError> for ErrorTicket {\n    fn from(_: std::num::ParseFloatError) -> Self {\n        ErrorTicket::PrecioInvalido\n    }\n}\n\nfn total_linea(linea: &str) -> Result<f64, ErrorTicket> {\n    let (cant_str, precio_str) = linea.split_once(\',\').ok_or(ErrorTicket::Formato)?;\n    let cantidad: u32 = cant_str.trim().parse()?;\n    let precio: f64 = precio_str.trim().parse()?;\n    Ok(cantidad as f64 * precio)\n}\n\nfn main() {\n    assert_eq!(total_linea("3,12.50"), Ok(37.5));\n    assert_eq!(total_linea(" 2 , 10 "), Ok(20.0));\n    assert_eq!(total_linea("sin-coma"), Err(ErrorTicket::Formato));\n    assert_eq!(total_linea("x,12.50"), Err(ErrorTicket::CantidadInvalida));\n    assert_eq!(total_linea("3,doce"), Err(ErrorTicket::PrecioInvalido));\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Los dos `From` son mecánicos y casi idénticos: cada uno mapea un error ajeno a UNA variante. `impl From<std::num::ParseIntError> for ErrorTicket { fn from(_: std::num::ParseIntError) -> Self { ErrorTicket::CantidadInvalida } }` — y el de `ParseFloatError` igual, con `PrecioInvalido`.",
						"`.ok_or(ErrorTicket::Formato)?` convierte el `Option` de `split_once` en `Result` y propaga `Formato` si no hay coma. Devuelve la tupla `(cant_str, precio_str)`.",
						"Con los dos `From` en su sitio, las líneas de parseo NO llevan `.map_err`: `let cantidad: u32 = cant_str.trim().parse()?;` y `let precio: f64 = precio_str.trim().parse()?;`. El `?` traduce cada error a su variante solo. Cierre: `Ok(cantidad as f64 * precio)` (convierte `u32` a `f64` antes de multiplicar).",
					],
					reveal:
						"El cuerpo terminado son **cuatro líneas** que se leen como el camino feliz, con TRES modos de fallo de tipos distintos fluyendo por debajo:\n\n```rust\nfn total_linea(linea: &str) -> Result<f64, ErrorTicket> {\n    let (cant_str, precio_str) = linea.split_once(',').ok_or(ErrorTicket::Formato)?;\n    let cantidad: u32 = cant_str.trim().parse()?;   // ParseIntError → CantidadInvalida\n    let precio: f64 = precio_str.trim().parse()?;   // ParseFloatError → PrecioInvalido\n    Ok(cantidad as f64 * precio)\n}\n```\n\n**La clave que hizo posible el pipeline:** cada `?` aplicó `From::from(error_ajeno)` y aterrizó en la variante correcta de TU enum. Dos errores de crates distintas (`ParseIntError`, `ParseFloatError`) entraron por el mismo embudo porque escribiste dos `impl From` — una vez. Añadir mañana una etapa que lea una fecha solo pide UN `impl From` más; ni una línea del cuerpo cambia.\n\n**Por qué un enum y no `Box<dyn Error>` aquí:** este `total_linea` es de librería — quien lo llame querrá distinguir \"¿el ticket tenía mal el formato, la cantidad o el precio?\" para mostrar el mensaje correcto al cajero. El enum con `#[derive(Debug, PartialEq)]` deja al llamador hacer `match` sobre la variante; la caja habría borrado esa distinción. Ese es exactamente el criterio del callout de esta lección, ahora en un pipeline real.",
				},
			],
		},
		{
			id: "m07_l04",
			moduleId: "m07",
			moduleSlug: "m07_errors_testing",
			order: 4,
			title: "Tests: tu red de seguridad",
			blocks: [
				{
					type: "first-principles",
					title: "Un test es una afirmación que se verifica sola, para siempre",
					problem:
						"Ya probaste tu función a mano y funciona. Pero el costo de un bug crece con la distancia a su creación: el refactor de la semana que viene, el cambio de un compañero en 6 meses… ¿quién va a re-probar todo, cada vez?",
					mentalModel:
						"Cada test es un guardia de seguridad contratado una vez que vigila para siempre. `cargo test` despierta a todos los guardias en segundos; cualquier cambio que rompa una promesa hace sonar la alarma ANTES de llegar a producción.",
					concreteExample:
						"En este curso ya viviste esto como alumno: cada challenge que verificaste corría asserts contra tu código. Ahora cambias de rol — de examinado a autor del examen.",
					remember:
						"Los tests no demuestran que el código es correcto; demuestran que las promesas que decidiste verificar siguen cumpliéndose. Elegir buenas promesas es el arte.",
				},
				{
					type: "challenge",
					conceptId: "m07-tdd-palindromo",
					title: "Antes de leer: los tests ya existen — hazlos pasar",
					prompt:
						'**Tu reto, al estilo TDD invertido:** los tests de `es_palindromo` ya están escritos (son exactamente lo que corre el botón Verificar). Tu trabajo es implementar la función que los hace pasar:\n\n- `es_palindromo("oso")` → `true` (se lee igual al revés)\n- `es_palindromo("rust")` → `false`\n- `es_palindromo("")` → `true` (el vacío es palíndromo por convención)\n- `es_palindromo("a")` → `true`\n\nPista de arranque: en m05 invertiste un String con `.chars().rev()`…',
					starterCode:
						"fn es_palindromo(texto: &str) -> bool {\n    // ¿cómo comparas un texto con su reverso?\n    \n}",
					tests:
						'fn main() {\n    assert!(es_palindromo("oso"));\n    assert!(es_palindromo("reconocer"));\n    assert!(!es_palindromo("rust"));\n    assert!(es_palindromo(""));\n    assert!(es_palindromo("a"));\n    assert!(!es_palindromo("ab"));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						"fn es_palindromo(texto: &str) -> bool {\n    let invertido: String = texto.chars().rev().collect();\n    invertido == texto\n}",
					hints: [
						"Construye el reverso como en m05: `let invertido: String = texto.chars().rev().collect();`",
						"Comparar `String` con `&str` funciona directo: `invertido == texto`. Esa expresión bool ES tu retorno (sin `;`).",
					],
					reveal:
						'La solución reutiliza m05 entero:\n\n```rust\nfn es_palindromo(texto: &str) -> bool {\n    let invertido: String = texto.chars().rev().collect();\n    invertido == texto\n}\n```\n\nPero lo importante de este reto fue el **proceso**: tenías afirmaciones ejecutables ANTES de tener código. Cada caso (`""`, `"a"`, `"ab"`) era una decisión de diseño congelada en un assert.\n\nEso es **Test-Driven Development**: los tests primero, como contrato; el código después, hasta que el contrato se cumple. En esta lección aprendes a escribir esos contratos tú — con el `#[test]` de verdad, el mismo que corre `cargo test` en cualquier empresa. 👇',
				},
				{
					type: "text",
					body: '## Anatomía de un test en Rust\n\nUn test es una función normal con el atributo `#[test]` encima. `cargo test` encuentra todas, las corre en paralelo, y reporta. El test pasa si la función termina sin panickear; falla si algo adentro panickea — y para eso están los asserts:\n\n- `assert!(cond)` — falla si la condición es falsa.\n- `assert_eq!(a, b)` — falla si difieren, **mostrando ambos valores** (por eso los tipos de tus tests quieren `#[derive(Debug, PartialEq)]`).\n- `assert_ne!(a, b)` — falla si son iguales.\n- Todos aceptan un mensaje extra: `assert!(x > 0, "x debería ser positivo, era {}", x)`.\n\n**Pruébalo de verdad** — este bloque corre con `cargo test` real (mira el botón):',
				},
				{
					type: "code",
					language: "rust",
					code: "fn suma(a: i32, b: i32) -> i32 {\n    a + b\n}\n\n#[test]\nfn suma_positivos() {\n    assert_eq!(suma(2, 3), 5);\n}\n\n#[test]\nfn suma_con_negativos() {\n    assert_eq!(suma(-2, -3), -5);\n    assert_eq!(suma(5, -5), 0);\n}\n\n#[test]\nfn suma_con_cero() {\n    assert_eq!(suma(7, 0), 7);\n}\n\n// Cambia el 5 de suma_positivos por un 6 y ejecuta de nuevo:\n// así se ve un test ROJO, con los dos valores en pantalla.",
					runnable: true,
					testMode: true,
				},
				{
					type: "callout",
					variant: "info",
					body: "**Lee la salida:** `running 3 tests` … `test result: ok. 3 passed; 0 failed`. Cada función `#[test]` corre aislada y en paralelo. Cuando una falla, `cargo test` imprime el assert que explotó con los valores `left` y `right` — exactamente los mensajes que llevas viendo todo el curso al verificar challenges. Ahora sabes quién los escribía.",
				},
				{
					type: "text",
					body: '## Abramos la línea que confunde a todo el mundo\n\nEn un proyecto real no vas a ver `#[test]` suelto: lo vas a ver envuelto en este caparazón que parece jeroglífico la primera vez. Es **la línea que confunde a todo el mundo**, así que vamos a abrirla pieza por pieza — no hay nada nuevo, solo tres ideas apiladas:\n\n```rust\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn suma_positivos() {\n        assert_eq!(suma(2, 3), 5);\n    }\n}\n```\n\nDe afuera hacia adentro, capa por capa:\n\n- **`#[cfg(test)]`** — un atributo de *compilación condicional*. `cfg` = "configuración". Lee: *"compila lo que sigue SOLO cuando la configuración es `test`"*, es decir, solo al correr `cargo test`. En el binario que despliegas a producción, este módulo entero **no existe**: no pesa, no se compila, no se envía. Es gratis tener mil tests.\n- **`mod tests { ... }`** — un módulo normal (los de m06) que agrupa los tests. El nombre `tests` es pura convención; podría llamarse distinto. Sirve para que vivan juntos, ordenados, sin chocar con el código de arriba.\n- **`use super::*;`** — `super` es "el módulo de arriba" (el archivo que contiene a `suma`). El `*` importa **todo** lo de ahí. Sin esta línea, dentro del módulo `tests` la función `suma` no existiría: está "un piso más arriba". Es la escalera que conecta los tests con lo que prueban.\n- **`#[test]`** — marca UNA función como test. `cargo test` recorre el crate buscando este atributo y corre cada función marcada, aislada y en paralelo. Sin `#[test]`, sería una función normal que nadie llama.\n- **`assert_eq!(suma(2, 3), 5)`** — la afirmación. Si los dos lados difieren, panickea con `left`/`right`; si coinciden, no hace nada y la función termina limpia → test verde.\n\nNinguna pieza es nueva: atributo + módulo + import + macro. Lo único que despista es verlas **juntas**.',
				},
				{
					type: "code",
					language: "text",
					code: 'QUÉ HACE CADA PIEZA, Y QUÉ VE EL COMPILADOR EN CADA MODO\n=======================================================\n\n  #[cfg(test)]          ← "compila lo de abajo SOLO si modo = test"\n  mod tests {           ← caja que agrupa los tests\n      use super::*;      ← trae `suma` desde el módulo de arriba\n      #[test]            ← "esta función es un test, córrela"\n      fn suma_positivos() {\n          assert_eq!(suma(2, 3), 5);   ← afirma 2+3 == 5\n      }\n  }\n\nMODO 1 ── cargo build / cargo run  (producción)\n-----------------------------------------------\n  cfg(test) es FALSO  →  el módulo `tests` se BORRA antes de compilar.\n  Binario final: solo `suma`. Cero tests, cero peso. Como si no existieran.\n\nMODO 2 ── cargo test\n--------------------\n  cfg(test) es VERDADERO  →  el módulo `tests` SÍ se compila.\n  cargo escanea el crate y junta toda función con #[test]:\n      [ suma_positivos ]   ← (y todas las demás que encuentre)\n  Las corre aisladas, en paralelo, y observa el resultado de cada una:\n\n  PASO A PASO de suma_positivos:\n    1. entra a la función\n    2. evalúa suma(2, 3)            → 5\n    3. assert_eq!(5, 5)            → iguales → NO panickea, no hace nada\n    4. la función llega al final SIN panickear   → TEST VERDE ✔\n\n  Si fuera assert_eq!(suma(2,3), 6):\n    3. assert_eq!(5, 6)            → distintos → PANIC\n         left: 5\n        right: 6\n    4. la función murió a mitad por panic           → TEST ROJO ✗\n\nLA REGLA, EN UNA FRASE:\n  test que termina = pasa     ·     test que panickea = falla\n  (los asserts son solo panics con mensaje bonito)',
					runnable: false,
				},
				{
					type: "text",
					body: '## Testear que algo FALLA bien\n\nLa mitad del diseño de errores (lecciones 1-3) fue decidir cuándo fallar. Los tests también verifican eso:\n\n**Errores esperables (Result):** assertea sobre el `Err` como cualquier valor — `assert_eq!(parse_edad("abc"), Err(ErrorEdad::NoEsNumero))`.\n\n**Panics (bugs y contratos):** `#[should_panic]` — el test pasa SOLO si el código panickea. Con `expected`, además verifica el mensaje:',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn dividir(a: i32, b: i32) -> i32 {\n    if b == 0 {\n        panic!("división entre cero");\n    }\n    a / b\n}\n\n#[test]\nfn divide_normal() {\n    assert_eq!(dividir(10, 2), 5);\n}\n\n#[test]\n#[should_panic(expected = "división entre cero")]\nfn dividir_entre_cero_panickea() {\n    dividir(1, 0); // si NO panickea, el test FALLA\n}',
					runnable: true,
					testMode: true,
				},
				{
					type: "quiz",
					question: "¿Cuándo se considera que una función #[test] pasó?",
					options: [
						{
							text: "Si termina sin panickear — los asserts fallidos panickean, y eso es lo que cargo test detecta",
							correct: true,
						},
						{
							text: "Si devuelve true",
							correct: false,
						},
						{
							text: 'Si imprime "ok" en pantalla',
							correct: false,
						},
						{
							text: "Si termina en menos de un segundo",
							correct: false,
						},
					],
					explanation:
						"El mecanismo es elegante: `assert_eq!(a, b)` no es magia de testing — es un macro que panickea si a ≠ b. El runner solo observa: ¿la función terminó? pasó. ¿panickeó? falló. Por eso `panic!` de la lección 1 y los tests son el mismo sistema — y por eso `#[should_panic]` puede invertir la regla.",
				},
				{
					type: "quiz",
					question: '¿Para qué sirve #[should_panic(expected = "mensaje")]?',
					options: [
						{
							text: "El test pasa solo si el código panickea Y el mensaje del panic contiene ese texto — verifica tus contratos de fallo",
							correct: true,
						},
						{
							text: "Hace que el test nunca falle",
							correct: false,
						},
						{
							text: "Imprime el mensaje cuando el test pasa",
							correct: false,
						},
						{
							text: "Marca el test como pendiente de implementar",
							correct: false,
						},
					],
					explanation:
						'Si en la lección 1 decidiste "esta función DEBE panickear ante un estado imposible", eso es una promesa — y las promesas se testean. El `expected` evita falsos positivos: sin él, un panic por CUALQUIER motivo (¡incluso un bug!) haría pasar el test. Con él, solo pasa el panic correcto.',
				},
				{
					type: "faded-exercise",
					conceptId: "m07-anatomia-test",
					title: "🟢 Guiado: escribe tus primeras aserciones",
					intro:
						"Tienes una función `validar_password` ya escrita y correcta (devuelve `true` si la contraseña tiene al menos 8 caracteres). Tu trabajo NO es tocarla: es **blindarla con aserciones**. Observa cómo se escribe un assert, completa el siguiente, y al final escribe el suite tú solo.\n\nNota práctica del editor: en estas lecciones el botón Verificar ejecuta un `fn main` con asserts (el mismo centinela `__ALL_TESTS_PASSED__` que llevas viendo). Es exactamente el mismo `assert_eq!`/`assert!` que pondrías dentro de un `#[test]` real — solo que aquí viven en `main` para poder ejecutarse al instante. El caparazón `#[cfg(test)] mod tests` lo viste arriba; la afirmación de adentro es idéntica.",
					stages: [
						{
							kind: "worked",
							instructions:
								'**Paso 1 — observa.** Una contraseña de 8+ caracteres es válida. Lo afirmamos con `assert!`, que pasa si la condición es `true`. Si `validar_password("segura123")` devolviera `false`, este assert panickearía y el test sería rojo. Como devuelve `true`, pasa en silencio.',
							code: 'fn validar_password(p: &str) -> bool {\n    p.chars().count() >= 8\n}\n\nfn main() {\n    // una contraseña larga es VÁLIDA → afirmamos que es true\n    assert!(validar_password("segura123"));\n\n    println!("__ALL_TESTS_PASSED__");\n}',
						},
						{
							kind: "faded",
							instructions:
								'**Paso 2 — completa.** Ahora el caso opuesto: una contraseña corta NO es válida. Para afirmar que algo es `false`, niégalo con `!`. Rellena los `___`: la negación y la cadena corta que debe fallar la validación (usa `"corta"`, que tiene 5 caracteres).',
							code: 'fn validar_password(p: &str) -> bool {\n    p.chars().count() >= 8\n}\n\nfn main() {\n    assert!(validar_password("segura123"));\n\n    // una contraseña corta es INVÁLIDA → afirmamos que es false\n    assert!(___validar_password("___"));\n\n    println!("__ALL_TESTS_PASSED__");\n}',
						},
						{
							kind: "solo",
							instructions:
								'**Paso 3 — tú solo.** Escribe el suite completo (3 aserciones mínimo) cubriendo: una contraseña larga válida, una corta inválida, y **el borde exacto**: ¿qué pasa con una de 8 caracteres clavados? El contrato dice `>= 8`, así que `"12345678"` (8 chars) debe ser válida. Termina con el centinela.',
							code: 'fn validar_password(p: &str) -> bool {\n    p.chars().count() >= 8\n}\n\nfn main() {\n    // tus aserciones aquí: válida, inválida, y el borde de 8 exactos\n\n    println!("__ALL_TESTS_PASSED__");\n}',
						},
					],
					tests:
						'fn validar_password(p: &str) -> bool {\n    p.chars().count() >= 8\n}\n\nfn main() {\n    assert!(validar_password("segura123"));\n    assert!(!validar_password("corta"));\n    assert!(validar_password("12345678"));\n    assert!(!validar_password("1234567"));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'fn validar_password(p: &str) -> bool {\n    p.chars().count() >= 8\n}\n\nfn main() {\n    // contraseña larga → válida\n    assert!(validar_password("segura123"));\n    // contraseña corta → inválida (negamos con !)\n    assert!(!validar_password("corta"));\n    // el borde exacto: 8 caracteres clavados son válidos (>= 8)\n    assert!(validar_password("12345678"));\n    // y 7 caracteres ya NO alcanzan\n    assert!(!validar_password("1234567"));\n    println!("__ALL_TESTS_PASSED__");\n}',
				},
				{
					type: "exercise",
					title: "Rojo → verde: caza el bug con tests",
					language: "rust",
					testMode: true,
					prompt:
						"Esta función de descuentos **tiene un bug real** (de los que llegan a producción). Vas a cazarlo con el ciclo TDD:\n\n1. **Ejecuta los tests** tal cual están: el primero ya falla (ROJO). Lee la salida: `left` vs `right` te dice qué devolvió y qué se esperaba.\n2. **Encuentra el bug** en `aplicar_descuento`. Pista: ¿qué da `50 / 100` cuando ambos son enteros?\n3. **Corrígelo** y agrega los dos tests que faltan (los TODO). Ejecuta de nuevo: 3 tests VERDES.\n\nEste editor corre `cargo test` de verdad — eres tú escribiendo `#[test]` por primera vez.",
					starterCode:
						'fn aplicar_descuento(precio: f64, porcentaje: u8) -> f64 {\n    // ¿Ves el bug? Los tests te lo van a gritar.\n    precio - precio * (porcentaje / 100) as f64\n}\n\n#[test]\nfn descuento_de_50_por_ciento() {\n    assert_eq!(aplicar_descuento(100.0, 50), 50.0);\n}\n\n// TODO: test "descuento_de_25_por_ciento": 80.0 con 25% → 60.0\n\n// TODO: test "descuento_cero_no_cambia_el_precio": 100.0 con 0% → 100.0',
					solution:
						"fn aplicar_descuento(precio: f64, porcentaje: u8) -> f64 {\n    // El bug era (porcentaje / 100): división ENTERA → siempre 0 para <100.\n    // La conversión a f64 debe pasar ANTES de dividir:\n    precio - precio * (porcentaje as f64 / 100.0)\n}\n\n#[test]\nfn descuento_de_50_por_ciento() {\n    assert_eq!(aplicar_descuento(100.0, 50), 50.0);\n}\n\n#[test]\nfn descuento_de_25_por_ciento() {\n    assert_eq!(aplicar_descuento(80.0, 25), 60.0);\n}\n\n#[test]\nfn descuento_cero_no_cambia_el_precio() {\n    assert_eq!(aplicar_descuento(100.0, 0), 100.0);\n}",
					hints: [
						"Ejecuta primero. La salida dirá algo como `left: 100.0, right: 50.0` — la función devolvió el precio SIN descuento. ¿Por qué el descuento dio 0?",
						"`porcentaje / 100` con `u8` es división entera: 50/100 = 0 (¡no 0.5!). El `as f64` llega tarde: convierte el 0 ya calculado.",
						"Arreglo: convierte ANTES de dividir — `porcentaje as f64 / 100.0`. Los tests nuevos son copias del primero con otros números y nombres descriptivos.",
					],
					explanation:
						"**Acabas de vivir el ciclo completo:** test rojo → diagnóstico guiado por la salida → fix → verde. Fíjate cuánto trabajo hizo el `assert_eq!`: te dio el valor real y el esperado sin un solo println.\n\n**El bug que cazaste es un clásico universal** (división entera antes de convertir a flotante — existe en C, Java, Go…). Lo importante: el test de 50% lo expuso al instante. Sin tests, este bug llega a producción y alguien cobra precios sin descuento hasta que un cliente se queja.\n\n**Sobre los nombres:** `descuento_cero_no_cambia_el_precio` es una especificación legible, no `test3`. Cuando falle dentro de 6 meses, el nombre solo te dirá qué promesa se rompió. Los tests son la documentación que nunca miente — no puede: se ejecuta.",
				},
			],
		},
		{
			id: "m07_l05",
			moduleId: "m07",
			moduleSlug: "m07_errors_testing",
			order: 5,
			title: "Organización de tests y el ciclo TDD",
			blocks: [
				{
					type: "first-principles",
					title: "Un test suite es un contrato versionado con tu yo del futuro",
					problem:
						"Diez tests sueltos se vuelven doscientos. Sin estructura ni criterio de qué testear, el suite se convierte en ruido: lento, frágil, y nadie confía en él — peor que no tener tests.",
					mentalModel:
						"Cada test tiene tres actos (Arrange-Act-Assert): prepara el escenario, ejecuta UNA cosa, afirma el resultado. Y el suite completo cubre tres frentes: el camino feliz, los bordes, y los errores.",
					concreteExample:
						'Para `parse_edad`: feliz (`"30"` → 30), bordes (`"0"`, `"130"`, espacios), errores (`"abc"`, `"-5"`, `"200"`). Tres frentes, siete asserts, y la función queda blindada contra regresiones.',
					remember:
						"Testea el contrato, no la implementación: si mañana reescribes el cuerpo de la función y el contrato se mantiene, los tests deben seguir verdes sin tocarlos.",
				},
				{
					type: "challenge",
					conceptId: "m07-slug",
					title: "Antes de leer: TDD de verdad — el contrato primero",
					prompt:
						'**Tu reto:** implementa `slug`, la función que convierte títulos en URLs (la usa este mismo sitio: "Hola Mundo" → `hola-mundo`).\n\nEl contrato, escrito como tests (míralo en Verificar):\n\n- minúsculas: `"Hola Mundo"` → `"hola-mundo"`\n- espacios múltiples y bordes colapsan: `"  Rust  es   genial  "` → `"rust-es-genial"`\n- texto vacío → texto vacío\n\nHerramientas de m05 que encajan perfecto: `.to_lowercase()`, `.split_whitespace()` (colapsa espacios múltiples él solo), y `.join("-")` sobre el Vec recolectado.',
					starterCode:
						"fn slug(titulo: &str) -> String {\n    // minúsculas → palabras → unir con guiones\n    \n}",
					tests:
						'fn main() {\n    assert_eq!(slug("Hola Mundo"), "hola-mundo");\n    assert_eq!(slug("  Rust  es   genial  "), "rust-es-genial");\n    assert_eq!(slug("YA-minusculas"), "ya-minusculas");\n    assert_eq!(slug(""), "");\n    assert_eq!(slug("   "), "");\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'fn slug(titulo: &str) -> String {\n    titulo\n        .to_lowercase()\n        .split_whitespace()\n        .collect::<Vec<_>>()\n        .join("-")\n}',
					hints: [
						"Empieza por el caso simple: `titulo.to_lowercase()` te da un String en minúsculas. Sobre él, `.split_whitespace()` itera las palabras.",
						'`.split_whitespace()` ya ignora espacios al inicio, al final y los múltiples del medio — los casos "difíciles" del contrato salen gratis con la herramienta correcta.',
						'Cierre: `.collect::<Vec<_>>().join("-")` — junta las palabras con guiones. El turbofish `::<Vec<_>>` le dice a collect QUÉ construir.',
					],
					reveal:
						'```rust\nfn slug(titulo: &str) -> String {\n    titulo\n        .to_lowercase()\n        .split_whitespace()\n        .collect::<Vec<_>>()\n        .join("-")\n}\n```\n\nFíjate qué pasó con los casos "difíciles" del contrato: los espacios múltiples, los bordes, el texto vacío… **los resolvió la elección de herramienta** (`split_whitespace`), no código extra. Esto es lo que el TDD provoca: como los casos límite estaban escritos ANTES, elegiste la herramienta que los cubre, en vez de parchear después.\n\nÚltima lección del módulo: dónde VIVEN estos tests en un proyecto real, y cómo el ciclo rojo-verde-refactor se vuelve tu forma de trabajar. 👇',
				},
				{
					type: "text",
					body: '## Dónde viven los tests: el módulo `tests`\n\nEn un proyecto real, los tests unitarios conviven con el código en el mismo archivo, dentro de un módulo anotado con `#[cfg(test)]` — "compila esto SOLO al correr tests" (cero costo en el binario de producción):',
				},
				{
					type: "code",
					language: "rust",
					code: 'fn celsius_a_fahrenheit(c: f64) -> f64 {\n    c * 9.0 / 5.0 + 32.0\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*; // importa lo de "arriba" (el código a testear)\n\n    #[test]\n    fn cero_celsius_es_treinta_y_dos() {\n        assert_eq!(celsius_a_fahrenheit(0.0), 32.0);\n    }\n\n    #[test]\n    fn cien_celsius_es_doscientos_doce() {\n        assert_eq!(celsius_a_fahrenheit(100.0), 212.0);\n    }\n\n    #[test]\n    fn menos_cuarenta_coinciden() {\n        // El punto donde ambas escalas se cruzan 🌡️\n        assert_eq!(celsius_a_fahrenheit(-40.0), -40.0);\n    }\n}',
					runnable: true,
					testMode: true,
				},
				{
					type: "text",
					body: '## La línea que confunde a todo el mundo: `#[cfg(test)] mod tests`\n\nEse bloque de arriba lo copia y pega todo el mundo sin saber qué hace cada pieza. Vamos a abrirlo, porque son CUATRO cosas apiladas en tres líneas, y cada una tiene un trabajo concreto:\n\n```rust\n#[cfg(test)]      // (1) atributo de compilación condicional\nmod tests {       // (2) un módulo normal, llamado tests por convención\n    use super::*; // (3) trae aquí dentro lo que vive "arriba"\n\n    #[test]       // (4) marca esta función como test\n    fn algo() { ... }\n}\n```\n\n- **(1) `#[cfg(test)]`** — `cfg` es *configuración de compilación*. Significa literalmente: *"compila el bloque que sigue SOLO cuando la configuración activa incluye `test`"*. Al hacer `cargo build` o publicar tu binario, esta condición es falsa y el módulo entero **desaparece** — no pesa ni un byte en producción. Al hacer `cargo test`, la condición es verdadera y el módulo se compila.\n- **(2) `mod tests`** — un módulo normal y corriente (los verás a fondo en el próximo módulo). Agrupa los tests en su propio espacio de nombres. El nombre `tests` es pura convención; podría llamarse distinto.\n- **(3) `use super::*`** — `super` es "el módulo de arriba" (el archivo que contiene a `mod tests`). El `*` es "todo". Junto: *"importa aquí dentro todo lo del archivo padre"* — por eso los tests pueden llamar a `celsius_a_fahrenheit` sin prefijo. Sin esta línea, dentro del módulo `tests` esa función no existiría.\n- **(4) `#[test]`** — marca la función de debajo como test. `cargo test` busca todas las funciones con este atributo, las ejecuta cada una aislada y en paralelo, y reporta cuáles terminaron sin panickear (verde) y cuáles panickearon (rojo).',
				},
				{
					type: "code",
					language: "text",
					code: 'El MISMO archivo, dos compilaciones distintas según el comando:\n\n  src/lib.rs\n  ┌─────────────────────────────────────────────┐\n  │  fn celsius_a_fahrenheit(c: f64) -> f64 {…}  │  ← código real\n  │                                              │\n  │  #[cfg(test)]                                 │\n  │  mod tests {                                  │  ← módulo de tests\n  │      use super::*;                            │\n  │      #[test] fn cero_celsius… {…}             │\n  │  }                                            │\n  └─────────────────────────────────────────────┘\n\n  $ cargo build   (config SIN "test")\n  ─────────────────────────────────\n  cfg(test) = FALSO  →  el bloque mod tests NO se compila\n  Binario final:  [ celsius_a_fahrenheit ]      ← solo esto, 0 bytes de test\n\n  $ cargo test    (config CON "test")\n  ─────────────────────────────────\n  cfg(test) = VERDADERO  →  mod tests SÍ se compila\n  use super::*  →  dentro de tests existen: celsius_a_fahrenheit\n  El runner busca todo lo marcado #[test] y lo corre aislado:\n\n     running 3 tests\n     test tests::cero_celsius_es_treinta_y_dos ... ok\n     test tests::cien_celsius_es_doscientos_doce ... ok\n     test tests::menos_cuarenta_coinciden ... ok\n     test result: ok. 3 passed; 0 failed\n\nResumen: #[cfg(test)] = "existe solo en modo test".\n         use super::* = "dame acceso al código de arriba".\n         #[test]      = "córreme cuando testees".',
					runnable: false,
				},
				{
					type: "text",
					body: "## El mapa completo de testing en un proyecto Cargo\n\nCuando salgas del playground a un proyecto real (próximo módulo), el layout estándar es:\n\n```text\nmi_proyecto/\n├── src/\n│   └── lib.rs        ← código + mod tests (tests UNITARIOS)\n└── tests/\n    └── integracion.rs ← tests de INTEGRACIÓN: usan tu crate\n                          como lo haría un usuario externo\n```\n\n- **Unitarios** (`mod tests`): acceden hasta a las funciones privadas; rápidos y quirúrgicos.\n- **Integración** (`tests/`): solo ven la API pública; verifican que las piezas encajan.\n- `cargo test` corre TODO; `cargo test nombre` filtra por nombre.\n\n## El ciclo TDD: rojo → verde → refactor\n\n1. **Rojo**: escribe un test del comportamiento que aún no existe. Córrelo. Falla (si no falla, el test no testea nada).\n2. **Verde**: escribe el código MÁS SIMPLE que lo hace pasar. Sin elegancia, sin generalizar.\n3. **Refactor**: ahora sí, mejora el código — con la red de seguridad verde vigilando cada paso.\n\nNo es dogma: para exploración, código primero está bien. Pero para **bugs** es oro puro: el test que reproduce el bug (rojo) es tu prueba de que de verdad lo arreglaste (verde) — y ese bug nunca vuelve sin que suene la alarma.\n\n## Qué testear (y qué no)\n\n✅ El contrato público: entradas → salidas, incluyendo errores.\n✅ Los tres frentes: feliz, bordes (vacío, cero, máximos), fallos.\n✅ Cada bug que encuentres: primero el test que lo reproduce, luego el fix.\n\n❌ Detalles internos de implementación (esos tests se rompen con cada refactor sano).\n❌ La librería estándar (`Vec::push` ya está testeado por el equipo de Rust).",
				},
				{
					type: "text",
					body: '## El ciclo TDD a cámara lenta: una vuelta completa\n\nLa lista "rojo → verde → refactor" suena a eslogan. Vamos a vivir UNA vuelta entera con una función concreta para que deje de ser abstracto. Encargo real: `precio_con_iva(base)` debe sumar el 21% de IVA a un precio.\n\n**Acto 1 — ROJO (escribe la promesa, mírala fallar).** Aún no existe la función. Escribes primero el test:\n\n```rust\n#[test]\nfn suma_el_21_por_ciento() {\n    assert_eq!(precio_con_iva(100.0), 121.0);\n}\n```\n\nNi siquiera compila — `precio_con_iva` no existe. Ese es tu primer rojo legítimo: el test te está pidiendo el código. Creas un esqueleto que compile pero esté MAL a propósito (`fn precio_con_iva(base: f64) -> f64 { base }`) y corres: rojo, `left: 100.0, right: 121.0`. Perfecto: el test VE la diferencia, luego de verdad vigila algo.\n\n**Acto 2 — VERDE (el código más simple que pasa, sin elegancia).** Escribes lo mínimo:\n\n```rust\nfn precio_con_iva(base: f64) -> f64 {\n    base * 1.21\n}\n```\n\nCorres: verde. No generalizas ("¿y si el IVA fuera variable?"), no adornas. El test pide 21%, das 21%.\n\n**Acto 3 — REFACTOR (mejora con la red puesta).** Ahora que está verde, puedes limpiar: renombrar, extraer la constante `const IVA: f64 = 0.21;`, lo que sea. Tras CADA cambio corres los tests. Si siguen verdes, tu refactor no rompió el contrato. Si uno se pone rojo, lo rompiste — y lo sabes al instante, no en producción.\n\nEsa es la vuelta. La gracia no es la ceremonia: es que **el test escrito antes** te obliga a definir QUÉ significa "correcto" antes de teclear el cómo.',
				},
				{
					type: "code",
					language: "text",
					code: "Una vuelta de TDD, fotograma a fotograma. La función: precio_con_iva.\n\n  ┌── ROJO ──────────────────────────────────────────────┐\n  │ TEST:  assert_eq!(precio_con_iva(100.0), 121.0);      │\n  │ CÓDIGO: fn precio_con_iva(b: f64)->f64 { b }  (mal a propósito)│\n  │ cargo test →                                          │\n  │     test suma_el_21_por_ciento ... FAILED            │\n  │       left:  100.0   ← lo que devolvió                │\n  │       right: 121.0   ← lo que el test exige           │\n  │ ✔ El rojo prueba que el test DISTINGUE bien y mal.    │\n  └──────────────────────────────────────────────────────┘\n                         │  cambias el código\n                         ▼\n  ┌── VERDE ─────────────────────────────────────────────┐\n  │ CÓDIGO: fn precio_con_iva(b: f64)->f64 { b * 1.21 }   │\n  │ cargo test →                                          │\n  │     test suma_el_21_por_ciento ... ok                 │\n  │     test result: ok. 1 passed; 0 failed               │\n  │ ✔ Mínimo esfuerzo, contrato cumplido.                 │\n  └──────────────────────────────────────────────────────┘\n                         │  ahora puedes limpiar\n                         ▼\n  ┌── REFACTOR ──────────────────────────────────────────┐\n  │ const IVA: f64 = 0.21;                                │\n  │ fn precio_con_iva(b: f64)->f64 { b * (1.0 + IVA) }    │\n  │ cargo test →  ok. 1 passed   ← SIGUE verde            │\n  │ ✔ Mejoraste la forma sin romper el contrato.          │\n  └──────────────────────────────────────────────────────┘\n\nLa regla de oro: NUNCA refactorizas en rojo. Primero verde, luego limpias.\nEl verde es tu permiso para tocar el código sin miedo.",
					runnable: false,
				},
				{
					type: "quiz",
					question:
						"¿Qué hace exactamente #[cfg(test)] sobre el módulo de tests?",
					options: [
						{
							text: "Compila ese módulo SOLO cuando corres cargo test — en el binario de producción los tests no existen ni pesan",
							correct: true,
						},
						{
							text: "Hace que los tests corran más rápido",
							correct: false,
						},
						{
							text: "Es decorativo: marca visualmente dónde están los tests",
							correct: false,
						},
						{
							text: "Impide que los tests accedan al código privado",
							correct: false,
						},
					],
					explanation:
						"`cfg` = compilación condicional. Tus tests pueden importar herramientas pesadas y construir escenarios elaborados sin engordar un byte el ejecutable que despliegas. El `use super::*` del módulo, además, le da acceso a TODO el archivo — incluidas funciones privadas, algo que los tests de integración (carpeta `tests/`) no pueden.",
				},
				{
					type: "quiz",
					question:
						"En el ciclo TDD, ¿por qué es importante VER el test fallar antes de escribir el código?",
					options: [
						{
							text: "Un test que nunca viste rojo podría estar pasando por accidente — verlo fallar prueba que de verdad vigila algo",
							correct: true,
						},
						{
							text: "Por disciplina: es la regla del TDD y hay que seguirla",
							correct: false,
						},
						{
							text: "Para que cargo test registre el fallo en su historial",
							correct: false,
						},
						{
							text: "No es importante: se puede saltar siempre",
							correct: false,
						},
					],
					explanation:
						"Es el test del test. Un assert mal escrito (comparar una variable consigo misma, testear la función equivocada, un `should_panic` que pasa por un bug distinto) puede estar verde para siempre sin vigilar NADA. El momento rojo es tu única prueba de que la alarma funciona — después de eso, el verde significa algo.",
				},
				{
					type: "faded-exercise",
					conceptId: "m07-tdd-password",
					title: "🟢 Guiado: implementa guiándote por los tests (estilo TDD)",
					intro:
						"Le damos la vuelta al rol habitual: aquí el CONTRATO ya está escrito como asserts, y tú escribes el código que lo cumple — exactamente el flujo TDD (test primero, código después). El contrato de `validar_password`: al menos 8 caracteres (si no, `ErrorPassword::MuyCorta`) y al menos un dígito (si no, `ErrorPassword::SinNumero`); si cumple ambos, `Ok(())`. Observa, completa, hazlo solo. (El verificador corre un `fn main` con los asserts; en un proyecto real estos vivirían en `#[cfg(test)] mod tests`.)",
					stages: [
						{
							kind: "worked",
							instructions:
								"**Paso 1 — observa.** El contrato, leído como tests, dicta el ORDEN de los chequeos: primero longitud, luego dígito, y solo si ambos pasan, `Ok(())`. Cada guarda usa `return Err(...)` para salir temprano; el `Ok(())` final solo se alcanza si ninguna guarda disparó. Fíjate en `Ok(())`: éxito sin dato que devolver, como en l02.",
							code: "#[derive(Debug, PartialEq)]\nenum ErrorPassword {\n    MuyCorta,\n    SinNumero,\n}\n\nfn validar_password(p: &str) -> Result<(), ErrorPassword> {\n    if p.len() < 8 {\n        return Err(ErrorPassword::MuyCorta);\n    }\n    if !p.chars().any(|c| c.is_ascii_digit()) {\n        return Err(ErrorPassword::SinNumero);\n    }\n    Ok(())\n}",
						},
						{
							kind: "faded",
							instructions:
								'**Paso 2 — completa.** Rellena los `___`: la longitud mínima que pide el contrato, la variante de error de cada guarda, el método que pregunta "¿algún carácter cumple?", y el valor de éxito. El test de `"sinnumeros"` (10 letras, cero dígitos) debe dar `SinNumero`, así que la segunda guarda NO puede faltar.',
							code: "#[derive(Debug, PartialEq)]\nenum ErrorPassword {\n    MuyCorta,\n    SinNumero,\n}\n\nfn validar_password(p: &str) -> Result<(), ErrorPassword> {\n    if p.len() < ___ {\n        return Err(ErrorPassword::___);\n    }\n    if !p.chars().___(|c| c.is_ascii_digit()) {\n        return Err(ErrorPassword::SinNumero);\n    }\n    ___\n}",
						},
						{
							kind: "solo",
							instructions:
								"**Paso 3 — tú solo.** Escribe `validar_password` entera desde el contrato: guarda de longitud (`< 8` → `MuyCorta`), guarda de dígito (`!...any(...is_ascii_digit)` → `SinNumero`), y `Ok(())` al final. El enum ya está declarado; no lo repitas.",
							code: "#[derive(Debug, PartialEq)]\nenum ErrorPassword {\n    MuyCorta,\n    SinNumero,\n}\n\nfn validar_password(p: &str) -> Result<(), ErrorPassword> {\n    // tu código aquí\n}",
						},
					],
					tests:
						'fn main() {\n    assert_eq!(validar_password("clave1234"), Ok(()));\n    assert_eq!(validar_password("12345678"), Ok(()));\n    assert_eq!(validar_password("corta1"), Err(ErrorPassword::MuyCorta));\n    assert_eq!(validar_password("sinnumeros"), Err(ErrorPassword::SinNumero));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'#[derive(Debug, PartialEq)]\nenum ErrorPassword {\n    MuyCorta,\n    SinNumero,\n}\n\nfn validar_password(p: &str) -> Result<(), ErrorPassword> {\n    if p.len() < 8 {\n        return Err(ErrorPassword::MuyCorta);\n    }\n    if !p.chars().any(|c| c.is_ascii_digit()) {\n        return Err(ErrorPassword::SinNumero);\n    }\n    Ok(())\n}\n\nfn main() {\n    assert_eq!(validar_password("clave1234"), Ok(()));\n    assert_eq!(validar_password("12345678"), Ok(()));\n    assert_eq!(validar_password("corta1"), Err(ErrorPassword::MuyCorta));\n    assert_eq!(validar_password("sinnumeros"), Err(ErrorPassword::SinNumero));\n    println!("__ALL_TESTS_PASSED__");\n}',
				},
				{
					type: "callout",
					variant: "info",
					body: '**La línea que falla a todo el mundo la primera vez:** `assert_eq!(validar_password("corta1"), Err(ErrorPassword::MuyCorta))`. Para que esa comparación compile, tu enum de error necesita DOS derives, y cada uno tiene un trabajo distinto:\n\n| Derive | Para qué lo pide el `assert_eq!` |\n|---|---|\n| `PartialEq` | poder preguntar `==` — comparar `Err(MuyCorta)` contra lo que devolvió la función. Sin él: *"`ErrorPassword` doesn\'t implement `PartialEq`"*. |\n| `Debug` | poder IMPRIMIR ambos lados cuando fallan (`left` / `right`). `assert_eq!` los muestra con `{:?}`. Sin él: *"doesn\'t implement `Debug`"*. |\n\nRegla práctica: **todo enum de error que vayas a comparar en un test lleva `#[derive(Debug, PartialEq)]`**. Es el mismo par que viste en l02 y l03 — ahora sabes por qué siempre aparecen juntos: uno permite el `==`, el otro permite ver QUÉ no cuadró.',
				},
				{
					type: "exercise",
					title: "Escribe el test suite completo",
					language: "rust",
					testMode: true,
					prompt:
						'Cambio de rol final: la función ya está escrita y es correcta — **tu trabajo es blindarla**. Escribe el módulo de tests de `buscar_mayor` cubriendo los tres frentes:\n\n1. **Feliz**: una lista normal devuelve `Some(mayor)`.\n2. **Bordes**: lista vacía → `None`; lista de UN elemento → ese elemento.\n3. **Casos con trampa**: todos negativos (¿devuelve el "menos negativo"?); el mayor repetido varias veces.\n\nMínimo 4 tests con nombres que describan la promesa (en español, largos, da igual: nadie los llama a mano). Recuerda el `use super::*;` dentro del módulo.',
					starterCode:
						"fn buscar_mayor(numeros: &[i32]) -> Option<i32> {\n    numeros.iter().copied().max()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    // TODO: tus 4+ tests aquí\n}",
					solution:
						"fn buscar_mayor(numeros: &[i32]) -> Option<i32> {\n    numeros.iter().copied().max()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn lista_normal_devuelve_el_mayor() {\n        assert_eq!(buscar_mayor(&[3, 9, 2, 7]), Some(9));\n    }\n\n    #[test]\n    fn lista_vacia_devuelve_none() {\n        assert_eq!(buscar_mayor(&[]), None);\n    }\n\n    #[test]\n    fn un_solo_elemento_es_el_mayor() {\n        assert_eq!(buscar_mayor(&[42]), Some(42));\n    }\n\n    #[test]\n    fn con_negativos_devuelve_el_menos_negativo() {\n        assert_eq!(buscar_mayor(&[-5, -1, -20]), Some(-1));\n    }\n\n    #[test]\n    fn mayor_repetido_no_confunde() {\n        assert_eq!(buscar_mayor(&[7, 7, 7]), Some(7));\n    }\n}",
					hints: [
						"Plantilla de cada test: `#[test] fn nombre_descriptivo() { assert_eq!(buscar_mayor(&[...]), Some(...)); }`",
						"El caso vacío compara contra `None`: `assert_eq!(buscar_mayor(&[]), None);` — la firma con `Option` (m04) hace que ni siquiera necesites should_panic.",
						'El caso "todos negativos" caza un bug clásico: implementaciones que arrancan con `mayor = 0` devolverían 0 para `[-5, -1]`. Tu test lo haría imposible.',
					],
					explanation:
						'**Lo que practicaste — elegir QUÉ testear** — es la habilidad de verdad. Los tres frentes (feliz/bordes/trampas) salen de preguntarle al CONTRATO: "¿qué prometes con listas vacías? ¿con negativos? ¿con empates?".\n\n**El caso de los negativos merece mención:** parece paranoico testear eso para una función de una línea… hasta que alguien la "optimiza" mañana con un bucle manual que arranca en `0`. Tu test convierte ese bug futuro en un rojo instantáneo. Eso es blindar: no proteges la implementación de hoy, proteges el contrato de mañana.\n\n**Con esto cierras el módulo:** sabes decidir panic vs Result, diseñar errores como tipos, propagarlos con `?`, y verificar todo el sistema con tests. La próxima parada natural es el proyecto integrador — un programa real donde estas piezas trabajan juntas.',
				},
				{
					type: "exercise",
					title:
						"🔴 Reto real: normalizador de teléfonos, dirigido por su contrato",
					language: "rust",
					prompt:
						'Escenario de producción: un formulario recibe números de teléfono que la gente escribe de mil formas — `"612 345 678"`, `"612-345-678"`. Antes de guardarlos en la base de datos los **normalizas** (solo dígitos) y los validas. Esto aparece en CUALQUIER backend que toque datos de usuarios.\n\nEl contrato ya está escrito como tests (mira Verificar) — implementa `normalizar_telefono` para cumplirlo:\n\n1. **Limpia** la entrada: quita espacios y guiones (deja el resto).\n2. Si tras limpiar queda **vacío** → `Err(ErrorTelefono::Vacio)`.\n3. Si algún carácter restante **no es un dígito** → `Err(ErrorTelefono::CaracterInvalido(c))` con el carácter culpable adentro (¡error con dato accionable, como en l02!).\n4. Si quedan **más de 15 dígitos** → `Err(ErrorTelefono::DemasiadoLargo)`.\n5. Si todo bien → `Ok(numero_limpio)`.\n\nEl ORDEN importa: vacío antes que carácter inválido, carácter inválido antes que longitud — los tests fijan ese orden. Esto ES diseñar guiándote por el contrato.',
					starterCode:
						'#[derive(Debug, PartialEq)]\nenum ErrorTelefono {\n    Vacio,\n    CaracterInvalido(char),\n    DemasiadoLargo,\n}\n\nfn normalizar_telefono(entrada: &str) -> Result<String, ErrorTelefono> {\n    // 1. limpiar: quitar espacios y \'-\'  (chars().filter(...).collect())\n    // 2. si vacío -> Err(Vacio)\n    // 3. si algún char no es dígito -> Err(CaracterInvalido(c))\n    // 4. si len > 15 -> Err(DemasiadoLargo)\n    // 5. Ok(limpio)\n    todo!()\n}\n\nfn main() {\n    assert_eq!(normalizar_telefono("612 345 678"), Ok(String::from("612345678")));\n    assert_eq!(normalizar_telefono("612-345-678"), Ok(String::from("612345678")));\n    assert_eq!(normalizar_telefono("  "), Err(ErrorTelefono::Vacio));\n    assert_eq!(normalizar_telefono(""), Err(ErrorTelefono::Vacio));\n    assert_eq!(normalizar_telefono("612 34a 678"), Err(ErrorTelefono::CaracterInvalido(\'a\')));\n    assert_eq!(normalizar_telefono("1234567890123456"), Err(ErrorTelefono::DemasiadoLargo));\n    println!("__ALL_TESTS_PASSED__");\n}',
					solution:
						'#[derive(Debug, PartialEq)]\nenum ErrorTelefono {\n    Vacio,\n    CaracterInvalido(char),\n    DemasiadoLargo,\n}\n\nfn normalizar_telefono(entrada: &str) -> Result<String, ErrorTelefono> {\n    let limpio: String = entrada\n        .chars()\n        .filter(|c| !c.is_whitespace() && *c != \'-\')\n        .collect();\n\n    if limpio.is_empty() {\n        return Err(ErrorTelefono::Vacio);\n    }\n    for c in limpio.chars() {\n        if !c.is_ascii_digit() {\n            return Err(ErrorTelefono::CaracterInvalido(c));\n        }\n    }\n    if limpio.len() > 15 {\n        return Err(ErrorTelefono::DemasiadoLargo);\n    }\n    Ok(limpio)\n}\n\nfn main() {\n    assert_eq!(normalizar_telefono("612 345 678"), Ok(String::from("612345678")));\n    assert_eq!(normalizar_telefono("612-345-678"), Ok(String::from("612345678")));\n    assert_eq!(normalizar_telefono("  "), Err(ErrorTelefono::Vacio));\n    assert_eq!(normalizar_telefono(""), Err(ErrorTelefono::Vacio));\n    assert_eq!(normalizar_telefono("612 34a 678"), Err(ErrorTelefono::CaracterInvalido(\'a\')));\n    assert_eq!(normalizar_telefono("1234567890123456"), Err(ErrorTelefono::DemasiadoLargo));\n    println!("__ALL_TESTS_PASSED__");\n}',
					hints: [
						"Limpiar: `let limpio: String = entrada.chars().filter(|c| !c.is_whitespace() && *c != '-').collect();` — `filter` deja pasar solo lo que NO es espacio ni guion; `collect` rearma el String.",
						"Vacío primero: `if limpio.is_empty() { return Err(ErrorTelefono::Vacio); }`. Si lo pusieras después del chequeo de dígitos, el bucle sobre un String vacío no haría nada y el orden del contrato se rompería.",
						"El carácter culpable viaja DENTRO de la variante: `return Err(ErrorTelefono::CaracterInvalido(c));`. Recorre con `for c in limpio.chars()` y dispara en el primer no-dígito (`!c.is_ascii_digit()`).",
						"Longitud al final, ya con solo dígitos: `if limpio.len() > 15 { return Err(ErrorTelefono::DemasiadoLargo); }`. Para teléfonos (ASCII) `len()` en bytes coincide con el número de dígitos.",
					],
					explanation:
						"**Por qué este reto aparece tal cual en código real:** todo backend que reciba datos de usuarios los normaliza y valida ANTES de guardarlos — y devuelve errores tipados para que la capa de arriba (la API, la UI) decida qué mensaje mostrar. `CaracterInvalido(c)` es exactamente lo de l02: un error que lleva el dato accionable (\"el carácter 'a' sobra\"), no un String que solo se puede imprimir.\n\n**El orden de las guardas ES parte del contrato.** Los tests lo fijaron: vacío → inválido → largo. Programar guiándote por tests significa precisamente esto: los asserts deciden el comportamiento, y tú escribes el código hasta que todos pasan. No adivinaste el orden — te lo dijo el suite.\n\n**Y el cierre de las tres `assert_eq!` de error** funciona porque el enum deriva `Debug` (para imprimir `left`/`right`) y `PartialEq` (para el `==`). Sin esos dos derives, ninguna de esas comparaciones compilaría — justa la lección del callout anterior, ahora en tus manos.",
				},
				{
					type: "callout",
					variant: "tip",
					body: "**Cierre del módulo — las cuatro piezas, ahora una sola maquinaria.** Mira cómo encaja todo lo de m07 en un único flujo de producción:\n\n1. **panic vs Result (l01):** decidiste el carril. Input del usuario, red, archivos → `Result`. Bug imposible → `panic!`. La firma `-> Result<T, E>` es tu contrato honesto.\n2. **Errores propios (l02):** modelaste cada modo de fallo como una variante de enum con datos accionables (`CaracterInvalido('a')`), con `Debug` para logs y `Display` para humanos.\n3. **El operador `?` (l03):** propagaste esos errores hacia arriba sin burocracia; `From` los convierte solos para que `?` compile. Cada capa decide: lo manejo aquí o sube un piso.\n4. **Tests (l04–l05):** congelaste el contrato en asserts que vigilan para siempre — camino feliz, bordes y errores — dentro de `#[cfg(test)] mod tests`, con el ciclo rojo→verde→refactor como forma de trabajo.\n\nUn validador de formulario real las usa TODAS a la vez: tipos de error propios que se propagan con `?` hasta el handler, y un test suite que prueba cada modo de fallo. Eso es Rust de producción, y ya sabes construirlo entero.\n\n**La próxima parada** es el proyecto integrador: salir del playground a un proyecto Cargo de verdad (`src/`, `tests/`, `cargo test`) donde estas cuatro piezas dejan de ser ejercicios y se vuelven tu manera de programar. 🦀",
				},
			],
		},
	],
};

export default module;

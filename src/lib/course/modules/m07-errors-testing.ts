import type { Module } from '../types'

const module: Module = {
  "id": "m07",
  "slug": "m07_errors_testing",
  "order": 7,
  "version": 1,
  "icon": "🛡️",
  "title": "Errores profesionales y Testing",
  "description": "Diseña errores que se manejan solos y escribe tests que te dejan dormir tranquilo: panic vs Result, tipos de error propios, el operador ? a fondo, y cargo test.",
  "lessons": [
    {
      "id": "m07_l01",
      "moduleId": "m07",
      "moduleSlug": "m07_errors_testing",
      "order": 1,
      "title": "panic! o Result: la decisión que define tu API",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Hay dos clases de error, y se tratan distinto",
          "problem": "No todos los fallos son iguales: que el usuario escriba \"abc\" donde va un número es NORMAL (pasará mil veces al día); que tu programa lea el elemento -1 de una lista es un BUG. Tratarlos igual produce programas que explotan por cosas normales, o que esconden bugs reales.",
          "mentalModel": "Result es el carril para lo esperable: el error es un dato que viaja y alguien decide qué hacer. panic! es el freno de emergencia: el programa prefiere morir a continuar en un estado sin sentido.",
          "concreteExample": "Un servidor que recibe JSON malformado responde 400 y sigue viviendo (Result). El mismo servidor con un índice fuera de rango en su propia lógica panickea: mejor reiniciar que corromper datos de usuarios.",
          "remember": "¿Puede pasar en operación normal? → Result. ¿Solo puede pasar si el programador se equivocó? → panic."
        },
        {
          "type": "challenge",
          "conceptId": "m07-result-divide",
          "title": "Antes de leer: un error que es un dato",
          "prompt": "**Tu reto** (calentamiento con lo que ya sabes de m04): escribe `dividir(a: f64, b: f64) -> Result<f64, String>`.\n\n- Si `b` es `0.0`, devuelve `Err` con el mensaje exacto `\"no se puede dividir entre cero\"`.\n- Si no, devuelve `Ok` con la división.\n\nFíjate en lo que NO hace esta función: no imprime, no panickea, no decide qué hacer con el error. Solo lo **devuelve como dato**. Quién la llame decidirá.",
          "starterCode": "fn dividir(a: f64, b: f64) -> Result<f64, String> {\n    // tu código aquí\n}",
          "tests": "fn main() {\n    assert_eq!(dividir(10.0, 2.0), Ok(5.0));\n    assert_eq!(dividir(7.0, 0.0), Err(String::from(\"no se puede dividir entre cero\")));\n    assert_eq!(dividir(0.0, 5.0), Ok(0.0));\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn dividir(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(String::from(\"no se puede dividir entre cero\"))\n    } else {\n        Ok(a / b)\n    }\n}",
          "hints": [
            "Es un `if/else` como expresión: una rama devuelve `Err(...)`, la otra `Ok(...)`.",
            "El mensaje debe ser EXACTO (los tests comparan el String): `Err(String::from(\"no se puede dividir entre cero\"))`."
          ],
          "reveal": "Esto que acabas de escribir es la mitad de la filosofía de errores de Rust:\n\n```rust\nfn dividir(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(String::from(\"no se puede dividir entre cero\"))\n    } else {\n        Ok(a / b)\n    }\n}\n```\n\nEl error **es un valor que se devuelve**, no una excepción invisible que vuela por los aires. La firma `-> Result<f64, String>` es un contrato público: *\"esto puede fallar, y el compilador no te dejará ignorarlo\"*.\n\nLa otra mitad de la filosofía es `panic!` — el freno de emergencia para los errores que NO deberían poder pasar. Saber cuál usar en cada caso es lo que separa una API profesional de una que explota en producción. Eso es esta lección. 👇"
        },
        {
          "type": "text",
          "body": "## Los dos carriles\n\nRust separa los fallos en dos categorías con herramientas distintas:\n\n| | `Result<T, E>` | `panic!` |\n|---|---|---|\n| Para | errores **esperables** (input del usuario, red, archivos) | **bugs** (estados imposibles, contratos rotos) |\n| Qué hace | devuelve el error como dato | aborta el hilo con un mensaje |\n| Quién lo maneja | el llamador, obligado por el compilador | nadie: es un grito de \"esto no debería pasar\" |\n| En producción | el programa sigue vivo | el programa (o el hilo) muere |\n\n## panic! de cerca\n\nYa lo has visto sin invocarlo tú: indexar fuera de rango, dividir enteros entre cero, `.unwrap()` sobre un `None`… todos llaman a `panic!` por debajo:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\n    let lista = vec![1, 2, 3];\n\n    // Descomenta cualquiera de estas y el programa muere con un panic:\n    // let x = lista[99];                    // index out of bounds\n    // let n: i32 = \"abc\".parse().unwrap();  // unwrap sobre un Err\n\n    // panic! también se invoca a mano, para invariantes imposibles:\n    let edad = 30;\n    if edad > 150 {\n        panic!(\"edad imposible: {} — hay un bug upstream\", edad);\n    }\n\n    println!(\"Todo en orden, lista de {} elementos\", lista.len());\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## unwrap y expect: úsalos con intención, no por pereza\n\n`.unwrap()` significa: *\"si esto es un error, panickea\"*. Convierte un error esperable en un crash. ¿Cuándo es legítimo?\n\n- **Prototipos y ejemplos**: estás explorando, un crash te da igual.\n- **Tests**: que el test explote ES el comportamiento deseado si algo falla.\n- **Imposibilidad demostrable**: acabas de verificar la condición una línea arriba.\n\nPara producción, la versión profesional de unwrap es **`.expect(\"mensaje\")`** — el mensaje debe decir **por qué creías que no podía fallar**, para que el tú del futuro depure en segundos:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\n    // ❌ unwrap pelado: si falla, el mensaje no te dice nada útil.\n    // let config: i32 = \"8080\".parse().unwrap();\n\n    // ✅ expect documenta TU suposición:\n    let config: i32 = \"8080\"\n        .parse()\n        .expect(\"el puerto por defecto '8080' debería ser un número válido\");\n\n    println!(\"Puerto: {}\", config);\n\n    // ✅ Y para errores ESPERABLES (input externo), ni unwrap ni expect:\n    let entrada_del_usuario = \"no soy un número\";\n    match entrada_del_usuario.parse::<i32>() {\n        Ok(n) => println!(\"Número: {}\", n),\n        Err(_) => println!(\"'{}' no es un número — intenta de nuevo\", entrada_del_usuario),\n    }\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "warning",
          "body": "**La regla del code review profesional:** cada `.unwrap()` en producción es una pregunta del revisor: *\"¿qué pasa cuando esto falle a las 3 AM?\"*. Si la respuesta es \"no puede fallar\", se escribe `.expect(\"porqué no puede fallar\")`. Si la respuesta es \"sí puede fallar\"… entonces va un `match`, un `?`, o un valor por defecto con `.unwrap_or()`."
        },
        {
          "type": "text",
          "body": "## El menú completo para manejar un Result\n\nNo todo es `match`. Según cuánto te importe el error, tienes opciones (varias las viste con `Option` en m04 — la simetría es intencional):\n\n```rust\nlet r: Result<i32, String> = \"42\".parse().map_err(|e| e.to_string());\n\nr.unwrap_or(0);              // valor por defecto si falló\nr.unwrap_or_else(|e| { 0 }); // default calculado (recibe el error)\nr.ok();                      // Result → Option (descarta el error)\nr.is_ok(); r.is_err();       // solo preguntar\nr.map(|n| n * 2);            // transformar el éxito, dejar pasar el error\nr.map_err(|e| format!(\"contexto: {}\", e)); // transformar el ERROR\n```\n\n`map_err` es la estrella nueva: deja pasar los `Ok` y **enriquece los errores** — la usarás constantemente para agregar contexto o convertir tipos de error."
        },
        {
          "type": "quiz",
          "question": "Un usuario escribe su edad en un formulario y llega \"treinta\" en vez de un número. ¿Cómo debe modelarse ese fallo?",
          "options": [
            {
              "text": "Con Result: es un error esperable de operación normal, el programa debe manejarlo y seguir vivo",
              "correct": true
            },
            {
              "text": "Con panic!: el dato es inválido y el programa no puede continuar",
              "correct": false
            },
            {
              "text": "Con unwrap(): es la forma estándar de extraer valores",
              "correct": false
            },
            {
              "text": "Ignorándolo: el parse devolverá 0 automáticamente",
              "correct": false
            }
          ],
          "explanation": "Input externo malo es lo MÁS normal del mundo: pasará miles de veces al día. `Result` lo convierte en un dato que tu código maneja (reintenta, avisa, usa default) sin morir. `panic!` aquí significaría que cualquier usuario puede tumbar tu programa escribiendo letras — un mini ataque de denegación de servicio gratis."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la diferencia real entre `.unwrap()` y `.expect(\"mensaje\")`?",
          "options": [
            {
              "text": "Ambos panickean si hay error, pero expect deja escrito POR QUÉ creías que no podía fallar — oro puro al depurar",
              "correct": true
            },
            {
              "text": "expect maneja el error sin panickear",
              "correct": false
            },
            {
              "text": "unwrap es más rápido en ejecución",
              "correct": false
            },
            {
              "text": "expect reintenta la operación antes de fallar",
              "correct": false
            }
          ],
          "explanation": "Funcionalmente son gemelos: ambos extraen el `Ok` o abortan. La diferencia es el rastro: un panic de `unwrap()` te dice dónde murió; uno de `expect(\"el config.toml validado arriba debería tener 'port'\")` te dice dónde, qué suposición se rompió y por dónde empezar a buscar. Mismo costo, debugging infinitamente mejor."
        },
        {
          "type": "exercise",
          "title": "Rescatar un parser lleno de unwraps",
          "language": "rust",
          "prompt": "Heredaste este código de un prototipo: lee el puerto de un servidor desde un texto de configuración. Funciona… hasta que la config viene mal, y entonces **muere con un panic críptico**.\n\nTu tarea: conviértelo en código de producción.\n\n1. Cambia la firma de `cargar_puerto` a `-> Result<u16, String>`.\n2. Nada de `unwrap`: usa `.map_err(...)` para convertir el error técnico del parse en un mensaje útil con el formato `\"'{texto}' no es un puerto válido\"` (usa el texto ya con `.trim()`).\n3. `main` ya está escrito para manejar ambos casos — haz que compile.",
          "starterCode": "// Código heredado del prototipo. ¡Panickea con configs malas!\nfn cargar_puerto(config: &str) -> u16 {\n    config.trim().parse().unwrap()\n}\n\nfn main() {\n    assert_eq!(cargar_puerto(\"8080\"), Ok(8080));\n    assert_eq!(cargar_puerto(\" 3000 \"), Ok(3000));\n    assert_eq!(\n        cargar_puerto(\"ochenta\"),\n        Err(String::from(\"'ochenta' no es un puerto válido\"))\n    );\n    // 99999 no cabe en un u16 (máx 65535): también debe ser Err, no panic.\n    assert!(cargar_puerto(\"99999\").is_err());\n    println!(\"Todo OK ✅\");\n}",
          "solution": "fn cargar_puerto(config: &str) -> Result<u16, String> {\n    let texto = config.trim();\n    texto\n        .parse()\n        .map_err(|_| format!(\"'{}' no es un puerto válido\", texto))\n}\n\nfn main() {\n    assert_eq!(cargar_puerto(\"8080\"), Ok(8080));\n    assert_eq!(cargar_puerto(\" 3000 \"), Ok(3000));\n    assert_eq!(\n        cargar_puerto(\"ochenta\"),\n        Err(String::from(\"'ochenta' no es un puerto válido\"))\n    );\n    // 99999 no cabe en un u16 (máx 65535): también debe ser Err, no panic.\n    assert!(cargar_puerto(\"99999\").is_err());\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "Guarda el texto limpio primero (`let texto = config.trim();`) — lo necesitas dos veces: para parsear y para el mensaje de error.",
            "`.parse()` devuelve `Result<u16, ParseIntError>` (el u16 se infiere del retorno). `.map_err(|_| ...)` reemplaza ese error técnico por tu String.",
            "El cierre completo: `texto.parse().map_err(|_| format!(\"'{}' no es un puerto válido\", texto))` — sin `;`, es el valor de retorno."
          ],
          "explanation": "**Lo que cambió de verdad:** la firma. `-> u16` mentía (\"esto siempre funciona\"); `-> Result<u16, String>` dice la verdad (\"esto puede fallar, decide qué hacer\"). En Rust, la honestidad va en el tipo.\n\n**Bonus que salió gratis:** el caso `\"99999\"` — ¿lo habías pensado? No cabe en `u16`, así que `parse` también lo rechaza y tu `map_err` lo captura sin código extra. Elegir `u16` para un puerto (máx 65535) hace que el TIPO valide el rango por ti. Eso es diseñar con tipos.\n\n**El patrón `map_err` que acabas de usar** — convertir errores técnicos en mensajes con contexto — es el pan de cada día en codebases reales, y la antesala perfecta para la próxima lección: ¿y si en vez de Strings sueltos, los errores fueran TIPOS?"
        }
      ]
    },
    {
      "id": "m07_l02",
      "moduleId": "m07",
      "moduleSlug": "m07_errors_testing",
      "order": 2,
      "title": "Tus propios tipos de error",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Un String no es un error: es una excusa",
          "problem": "Con `Err(String)`, quien recibe el error solo puede imprimirlo. ¿Reintentar si fue de red pero abortar si fue de permisos? Imposible: tendría que adivinar parseando el texto del mensaje — frágil y horrible.",
          "mentalModel": "Un enum de errores es el menú de todo lo que puede salir mal, escrito en el sistema de tipos. Quien llama hace `match` y el compilador lo OBLIGA a considerar cada modo de fallo — igual que con los enums de m04, porque ES un enum de m04.",
          "concreteExample": "`ErrorPago::FondosInsuficientes { faltan: 12.50 }` lleva datos accionables: la UI puede mostrar \"te faltan $12.50\". Con `Err(\"fondos insuficientes\")` solo puedes rezar que el usuario lea.",
          "remember": "String para humanos, enum para programas. El Display del enum (m06) produce el texto; las variantes producen las decisiones."
        },
        {
          "type": "challenge",
          "conceptId": "m07-error-enum",
          "title": "Antes de leer: errores con nombre y apellido",
          "prompt": "**Tu reto:** valida nombres de usuario con errores tipados. El enum ya está definido — implementa `validar_nombre`:\n\n- menos de 3 caracteres → `Err(ErrorValidacion::MuyCorto)`\n- más de 20 caracteres → `Err(ErrorValidacion::MuyLargo)`\n- si pasa ambas → `Ok(())`\n\nUsa `nombre.len()` (bytes; para este reto está bien). Fíjate en el tipo de éxito: `Ok(())` — \"todo bien, no hay nada que devolver\". El `()` es la tupla vacía: el tipo de \"nada\".",
          "starterCode": "#[derive(Debug, PartialEq)]\nenum ErrorValidacion {\n    MuyCorto,\n    MuyLargo,\n}\n\nfn validar_nombre(nombre: &str) -> Result<(), ErrorValidacion> {\n    // tu código aquí\n}",
          "tests": "fn main() {\n    assert_eq!(validar_nombre(\"ana\"), Ok(()));\n    assert_eq!(validar_nombre(\"yo\"), Err(ErrorValidacion::MuyCorto));\n    assert_eq!(validar_nombre(\"\"), Err(ErrorValidacion::MuyCorto));\n    assert_eq!(\n        validar_nombre(\"nombredeusuarioabsurdamentelargo\"),\n        Err(ErrorValidacion::MuyLargo)\n    );\n    assert_eq!(validar_nombre(\"exactamente_20_chars\"), Ok(()));\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "#[derive(Debug, PartialEq)]\nenum ErrorValidacion {\n    MuyCorto,\n    MuyLargo,\n}\n\nfn validar_nombre(nombre: &str) -> Result<(), ErrorValidacion> {\n    if nombre.len() < 3 {\n        Err(ErrorValidacion::MuyCorto)\n    } else if nombre.len() > 20 {\n        Err(ErrorValidacion::MuyLargo)\n    } else {\n        Ok(())\n    }\n}",
          "hints": [
            "Tres ramas: `if` corto, `else if` largo, `else` Ok. Todas son expresiones (sin `;`).",
            "Las variantes se nombran completas: `ErrorValidacion::MuyCorto`, como los enums de m04.",
            "El éxito sin datos se escribe `Ok(())` — paréntesis dobles: `Ok` envolviendo a la tupla vacía `()`."
          ],
          "reveal": "Compara los dos mundos:\n\n```rust\n// Mundo String: quien llama solo puede imprimir y rezar.\nfn validar(n: &str) -> Result<(), String>\n\n// Mundo enum: quien llama DECIDE según el caso, y el compilador\n// le exige cubrir todos los modos de fallo.\nmatch validar_nombre(input) {\n    Ok(()) => crear_cuenta(input),\n    Err(ErrorValidacion::MuyCorto) => sugerir_alargarlo(),\n    Err(ErrorValidacion::MuyLargo) => ofrecer_truncado(),\n}\n```\n\nY cuando mañana agregues la variante `CaracteresInvalidos`, **cada `match` del codebase dejará de compilar** hasta que alguien decida qué hacer con ella. El compilador como lista de tareas pendientes — esa es la magia del pattern matching exhaustivo de m04 aplicada a errores. 👇"
        },
        {
          "type": "text",
          "body": "## Errores con datos adentro\n\nLas variantes de un enum pueden llevar carga útil (m04) — y en errores, esa carga es **información accionable**:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::fmt;\n\n#[derive(Debug)]\nenum ErrorPago {\n    FondosInsuficientes { faltan: f64 },\n    TarjetaVencida,\n    MontoInvalido,\n}\n\n// Display (m06): la cara humana del error. El enum decide, Display narra.\nimpl fmt::Display for ErrorPago {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        match self {\n            ErrorPago::FondosInsuficientes { faltan } => {\n                write!(f, \"fondos insuficientes: faltan ${:.2}\", faltan)\n            }\n            ErrorPago::TarjetaVencida => write!(f, \"la tarjeta está vencida\"),\n            ErrorPago::MontoInvalido => write!(f, \"el monto debe ser mayor a cero\"),\n        }\n    }\n}\n\nfn pagar(saldo: f64, monto: f64) -> Result<f64, ErrorPago> {\n    if monto <= 0.0 {\n        return Err(ErrorPago::MontoInvalido);\n    }\n    if monto > saldo {\n        return Err(ErrorPago::FondosInsuficientes { faltan: monto - saldo });\n    }\n    Ok(saldo - monto)\n}\n\nfn main() {\n    // El mismo error, dos audiencias:\n    match pagar(100.0, 150.0) {\n        Ok(nuevo_saldo) => println!(\"✅ Pago hecho. Saldo: ${:.2}\", nuevo_saldo),\n        Err(e) => {\n            println!(\"Para el usuario  → ❌ {}\", e);    // Display: humano\n            println!(\"Para el log      → {:?}\", e);     // Debug: programador\n        }\n    }\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "**Convención profesional:** un tipo de error implementa `Debug` (derivado, para logs) **y** `Display` (a mano, para humanos). Con ambos, tu error puede además implementar el trait `std::error::Error` — el contrato estándar que todo el ecosistema entiende, y la puerta al `Box<dyn Error>` de la próxima lección. Las librerías `thiserror` y `anyhow` que verás en cualquier trabajo automatizan exactamente este boilerplate."
        },
        {
          "type": "text",
          "body": "## El patrón en producción\n\nAsí se ve el flujo completo en código real:\n\n1. **Capa baja** (parsear, red, DB): devuelve errores específicos y tipados — `ErrorPago`, `ParseIntError`.\n2. **Capa media**: hace `match` sobre las variantes que puede resolver (reintentar timeouts, usar defaults) y **propaga** el resto hacia arriba con `?`.\n3. **Capa alta** (main, handler HTTP): convierte el error en algo para el mundo exterior — un mensaje con `Display`, un status 400, una entrada de log con `Debug`.\n\nLa pieza que falta para que esto fluya — cómo \"propagar el resto hacia arriba\" sin escribir un match por línea — es el operador `?`, y es la próxima lección entera."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la ventaja REAL de `Result<(), ErrorValidacion>` sobre `Result<(), String>`?",
          "options": [
            {
              "text": "Quien llama puede decidir con match según el modo de fallo, y el compilador le exige cubrir todas las variantes",
              "correct": true
            },
            {
              "text": "Los enums ocupan menos memoria que los Strings",
              "correct": false
            },
            {
              "text": "Los enums se imprimen más bonito",
              "correct": false
            },
            {
              "text": "No hay ventaja real, es cuestión de estilo",
              "correct": false
            }
          ],
          "explanation": "Con String, distinguir errores = parsear texto (frágil: un typo en el mensaje rompe la lógica). Con enum, cada modo de fallo es una variante: el `match` decide, lleva datos accionables (`faltan: $12.50`), y agregar una variante nueva hace que el compilador señale TODOS los lugares que deben manejarla. (Lo de la memoria suele ser cierto, pero es un bonus, no la razón.)"
        },
        {
          "type": "quiz",
          "question": "¿Por qué un tipo de error quiere `Debug` Y `Display` a la vez?",
          "options": [
            {
              "text": "Son dos audiencias: Debug ({:?}) es la versión técnica para logs y desarrollo; Display ({}) es el mensaje legible para el usuario",
              "correct": true
            },
            {
              "text": "Display es obligatorio para que compile el enum",
              "correct": false
            },
            {
              "text": "Debug es la versión antigua de Display",
              "correct": false
            },
            {
              "text": "Solo se necesita uno de los dos, da igual cuál",
              "correct": false
            }
          ],
          "explanation": "El MISMO error viaja a dos lugares: al log del servidor (quieres `FondosInsuficientes { faltan: 12.5 }` — estructura completa, derivada gratis con `#[derive(Debug)]`) y a la pantalla del usuario (quieres \"fondos insuficientes: faltan $12.50\" — redactado a mano con Display, como aprendiste en m06). Dos traits, dos audiencias, un error."
        },
        {
          "type": "exercise",
          "title": "Parser de edad con errores que explican",
          "language": "rust",
          "prompt": "Construye `parse_edad`, el validador de un formulario real. Recibe el texto crudo y devuelve `Result<u8, ErrorEdad>` donde:\n\n- Si el texto (tras `.trim()`) no es un número entero → `Err(ErrorEdad::NoEsNumero)`\n- Si es un número pero no está entre 0 y 130 → `Err(ErrorEdad::FueraDeRango)`\n- Si todo bien → `Ok(edad)`\n\nEstrategia sugerida: parsea primero a `i32` (que acepta negativos — ¡\"-5\" es un número válido pero una edad inválida!), valida el rango, y convierte a `u8` con `as` al final.\n\nPista clave: `.map_err(|_| ErrorEdad::NoEsNumero)` convierte el error del parse, y el `?` al final de esa línea extrae el número o propaga el error — lo verás a fondo en la próxima lección, considéralo un adelanto.",
          "starterCode": "#[derive(Debug, PartialEq)]\nenum ErrorEdad {\n    NoEsNumero,\n    FueraDeRango,\n}\n\nfn parse_edad(texto: &str) -> Result<u8, ErrorEdad> {\n    // 1. parsear a i32 (map_err + ?)\n    // 2. validar rango 0..=130\n    // 3. Ok(n as u8)\n    todo!()\n}\n\nfn main() {\n    assert_eq!(parse_edad(\"30\"), Ok(30));\n    assert_eq!(parse_edad(\" 25 \"), Ok(25));\n    assert_eq!(parse_edad(\"0\"), Ok(0));\n    assert_eq!(parse_edad(\"130\"), Ok(130));\n    assert_eq!(parse_edad(\"abc\"), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad(\"\"), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad(\"200\"), Err(ErrorEdad::FueraDeRango));\n    assert_eq!(parse_edad(\"-5\"), Err(ErrorEdad::FueraDeRango));\n    println!(\"Todo OK ✅\");\n}",
          "solution": "#[derive(Debug, PartialEq)]\nenum ErrorEdad {\n    NoEsNumero,\n    FueraDeRango,\n}\n\nfn parse_edad(texto: &str) -> Result<u8, ErrorEdad> {\n    let n: i32 = texto.trim().parse().map_err(|_| ErrorEdad::NoEsNumero)?;\n    if n < 0 || n > 130 {\n        return Err(ErrorEdad::FueraDeRango);\n    }\n    Ok(n as u8)\n}\n\nfn main() {\n    assert_eq!(parse_edad(\"30\"), Ok(30));\n    assert_eq!(parse_edad(\" 25 \"), Ok(25));\n    assert_eq!(parse_edad(\"0\"), Ok(0));\n    assert_eq!(parse_edad(\"130\"), Ok(130));\n    assert_eq!(parse_edad(\"abc\"), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad(\"\"), Err(ErrorEdad::NoEsNumero));\n    assert_eq!(parse_edad(\"200\"), Err(ErrorEdad::FueraDeRango));\n    assert_eq!(parse_edad(\"-5\"), Err(ErrorEdad::FueraDeRango));\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "Línea 1: `let n: i32 = texto.trim().parse().map_err(|_| ErrorEdad::NoEsNumero)?;` — el `?` extrae el i32 si todo fue bien, o devuelve el Err inmediatamente.",
            "¿Por qué i32 y no u8 directo? Porque `\"-5\".parse::<u8>()` fallaría con NoEsNumero… pero -5 SÍ es un número: es una edad fuera de rango. La distinción importa para dar el error correcto.",
            "El rango: `if n < 0 || n > 130 { return Err(ErrorEdad::FueraDeRango); }` y al final `Ok(n as u8)` — el cast es seguro porque ya validaste 0..=130."
          ],
          "explanation": "**El detalle fino de este ejercicio** está en la elección de parsear a `i32` primero: `\"-5\"` debe dar `FueraDeRango` (es un número, solo que inválido como edad), no `NoEsNumero`. Si hubieras parseado directo a `u8`, ambos casos se confundirían. Diseñar errores es decidir QUÉ quieres poder distinguir — y este tipo de sutileza es exactamente lo que un buen test suite captura (lección 4).\n\n**Encadenado que usaste:** `parse` → `map_err` (error técnico → tu enum) → `?` (extraer o propagar). Esa tubería de tres pasos es posiblemente la línea más común en todo el Rust de producción."
        }
      ]
    },
    {
      "id": "m07_l03",
      "moduleId": "m07",
      "moduleSlug": "m07_errors_testing",
      "order": 3,
      "title": "El operador ? a fondo",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Propagar: \"este error no es mío — súbelo\"",
          "problem": "La mayoría de las funciones no saben qué hacer con un error: una función que parsea no sabe si la app quiere reintentar, avisar o abortar. Manejarlo ahí sería decidir por otros. Pero escribir un match de 4 líneas por cada operación falible entierra la lógica en burocracia.",
          "mentalModel": "El `?` es la escalera de incendios del error: si la operación salió bien, te quedas con el valor y sigues; si salió mal, el error sube UN piso (al llamador) inmediatamente. Cada piso decide: lo manejo aquí, o sigue subiendo.",
          "concreteExample": "`let n: i32 = texto.parse()?;` — dos caracteres reemplazan cuatro líneas de match, y la función se lee como el camino feliz: parsea, calcula, devuelve. Los errores fluyen solos por la firma.",
          "remember": "? no maneja errores: los DELEGA. Y solo funciona dentro de funciones que devuelven Result (u Option) — el error necesita un tipo por donde salir."
        },
        {
          "type": "challenge",
          "conceptId": "m07-propagate",
          "title": "Antes de leer: mata la burocracia",
          "prompt": "**Tu reto:** suma dos números que llegan como texto. La versión burocrática sería:\n\n```rust\nlet x = match a.trim().parse::<i32>() {\n    Ok(n) => n,\n    Err(e) => return Err(e),\n};\n// …y lo mismo para b. Ocho líneas de nada.\n```\n\nEscríbela con el operador `?`: el cuerpo completo son **3 líneas**. Fíjate en la firma: el tipo de error es `std::num::ParseIntError` — el mismo que produce `.parse()`, así que el `?` propaga sin conversión alguna.",
          "starterCode": "fn sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    // parsea a, parsea b (con ?), devuelve Ok(suma)\n    \n}",
          "tests": "fn main() {\n    assert_eq!(sumar_strs(\"2\", \"3\"), Ok(5));\n    assert_eq!(sumar_strs(\" 10 \", \"-4\"), Ok(6));\n    assert!(sumar_strs(\"dos\", \"3\").is_err());\n    assert!(sumar_strs(\"2\", \"\").is_err());\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    let x: i32 = a.trim().parse()?;\n    let y: i32 = b.trim().parse()?;\n    Ok(x + y)\n}",
          "hints": [
            "Cada parse lleva su `?` al final: `let x: i32 = a.trim().parse()?;` — si falla, la función retorna ese Err ahí mismo.",
            "Al final, el resultado exitoso se envuelve: `Ok(x + y)`. El `?` desenvuelve; al devolver, tú vuelves a envolver."
          ],
          "reveal": "Mira lo que hace el `?` por debajo — es exactamente el match que NO escribiste:\n\n```rust\n// esto:\nlet x: i32 = a.trim().parse()?;\n\n// se expande a esto:\nlet x: i32 = match a.trim().parse() {\n    Ok(valor) => valor,                  // extrae y sigue\n    Err(e) => return Err(From::from(e)), // sal de la función YA\n};\n```\n\nDos detalles de oro:\n\n1. **El `return` está adentro**: por eso `?` solo compila en funciones que devuelven `Result` — el error necesita una salida del tipo correcto.\n2. **Ese `From::from(e)`** convierte el error al tipo de error de TU función automáticamente… usando el trait `From` que aprendiste en m06. Esa conversión silenciosa es la clave de esta lección. 👇"
        },
        {
          "type": "text",
          "body": "## La conversión automática: ? + From\n\nEl detalle del `From::from(e)` en la expansión cambia todo: si tu tipo de error implementa `From<ErrorAjeno>`, el `?` convierte **solo**. Conecta esto con m06:\n\n```rust\nenum MiError {\n    Parseo,\n    Vacio,\n}\n\nimpl From<std::num::ParseIntError> for MiError {\n    fn from(_: std::num::ParseIntError) -> Self {\n        MiError::Parseo\n    }\n}\n\nfn procesar(s: &str) -> Result<i32, MiError> {\n    let n: i32 = s.parse()?;  // ParseIntError → MiError, AUTOMÁTICO\n    Ok(n * 2)\n}\n```\n\nSin el `impl From`, habrías escrito `.map_err(|_| MiError::Parseo)?` en cada llamada. Con él, escribes la conversión UNA vez y todos los `?` del archivo la usan. Así escala el manejo de errores en codebases grandes.\n\n## ¿Y en main? Box<dyn Error>\n\n¿Qué tipo de error pones cuando una función puede fallar de formas de DISTINTOS tipos (un ParseIntError aquí, un error de UTF-8 allá)? La respuesta usa tu otro conocimiento de m06 — trait objects:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::error::Error;\n\n// Box<dyn Error> = \"una caja con CUALQUIER error del ecosistema\".\n// Todo error decente implementa el trait std::error::Error,\n// y Box<dyn Error> implementa From<E> para todos ellos →\n// el ? convierte cualquier error a la caja, gratis.\nfn procesar() -> Result<(), Box<dyn Error>> {\n    let n: i32 = \"42\".trim().parse()?;          // ParseIntError → Box<dyn Error>\n    println!(\"n = {}\", n);\n\n    let bytes = vec![240, 40];                    // UTF-8 inválido a propósito\n    let texto = String::from_utf8(bytes)?;        // FromUtf8Error → Box<dyn Error>\n    println!(\"texto = {}\", texto);                // (no llegamos aquí)\n    Ok(())\n}\n\nfn main() {\n    match procesar() {\n        Ok(()) => println!(\"todo bien\"),\n        Err(e) => println!(\"falló: {}\", e),  // Display del error original\n    }\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "**¿Enum propio o Box<dyn Error>?** Regla de mundo real: en **librerías** (código que otros llaman), enum propio — tus usuarios quieren hacer match sobre tus modos de fallo. En **aplicaciones** (main, scripts, handlers), `Box<dyn Error>` — solo vas a loguear el error, no a decidir por variante. Las crates `thiserror` (enums sin boilerplate) y `anyhow` (Box mejorado con contexto) automatizan cada lado; cuando las veas en un trabajo, ya sabes qué hacen por dentro."
        },
        {
          "type": "text",
          "body": "## Bonus: ? también funciona con Option\n\nLa misma escalera de incendios sirve para la ausencia: dentro de una función que devuelve `Option`, el `?` extrae el `Some` o retorna `None`:\n\n```rust\nfn primera_inicial(nombre_completo: &str) -> Option<char> {\n    let primera_palabra = nombre_completo.split_whitespace().next()?;\n    primera_palabra.chars().next()\n}\n```\n\nDos posibles ausencias (sin palabras / palabra vacía), cero matches anidados. La simetría Option/Result que viste en m04 llega hasta aquí."
        },
        {
          "type": "faded-exercise",
          "conceptId": "m07-question-mark",
          "title": "Práctica guiada: tuberías con ?",
          "intro": "Vamos a construir funciones falibles donde el camino feliz se lee de corrido y los errores fluyen solos. Observa, completa, hazlo solo.",
          "stages": [
            {
              "kind": "worked",
              "instructions": "**Paso 1 — observa.** `leer_par` parsea una línea `\"x,y\"` a una tupla. Dos operaciones falibles, dos `?`. Si CUALQUIER parse falla, la función retorna ese error de inmediato — el `Ok((a, b))` final solo se alcanza con ambos éxitos.",
              "code": "fn leer_par(linea: &str) -> Result<(i32, i32), std::num::ParseIntError> {\n    let mut partes = linea.split(',');\n    let a: i32 = partes.next().unwrap_or(\"\").trim().parse()?;\n    let b: i32 = partes.next().unwrap_or(\"\").trim().parse()?;\n    Ok((a, b))\n}"
            },
            {
              "kind": "faded",
              "instructions": "**Paso 2 — completa.** `duplicar_parseado` parsea un texto y devuelve el doble. Rellena los `___`: el método que parsea, el operador que propaga, y el envoltorio del resultado final.",
              "code": "fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let n: i32 = s.trim().___()___;\n    ___(n * 2)\n}"
            },
            {
              "kind": "solo",
              "instructions": "**Paso 3 — tú solo.** Escribe `duplicar_parseado` desde cero: parsea (propagando con `?`) y devuelve el doble envuelto en Ok.",
              "code": "fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {\n    // tu código aquí\n}"
            }
          ],
          "tests": "fn main() {\n    assert_eq!(duplicar_parseado(\"21\"), Ok(42));\n    assert_eq!(duplicar_parseado(\" 5 \"), Ok(10));\n    assert_eq!(duplicar_parseado(\"-3\"), Ok(-6));\n    assert!(duplicar_parseado(\"x\").is_err());\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {\n    let n: i32 = s.trim().parse()?;\n    Ok(n * 2)\n}"
        },
        {
          "type": "quiz",
          "question": "¿Por qué `?` solo se puede usar dentro de funciones que devuelven Result (u Option)?",
          "options": [
            {
              "text": "Porque ? contiene un return Err(...) escondido: necesita que la firma de la función tenga un tipo por donde ese error pueda salir",
              "correct": true
            },
            {
              "text": "Es una limitación arbitraria que van a quitar",
              "correct": false
            },
            {
              "text": "Porque ? consume mucha memoria",
              "correct": false
            },
            {
              "text": "Sí se puede usar en cualquier función desde Rust 2021",
              "correct": false
            }
          ],
          "explanation": "Recuerda la expansión: `?` es un `match` cuyo brazo Err hace `return Err(From::from(e))`. Ese `return` devuelve DESDE TU FUNCIÓN — si tu función devuelve `i32` a secas, no hay forma de retornar un error por ahí. Por eso en `fn main` se usa la firma `fn main() -> Result<(), Box<dyn Error>>` cuando quieres `?` directo en main."
        },
        {
          "type": "quiz",
          "question": "Tu función devuelve `Result<T, MiError>` y adentro llamas algo que falla con `ParseIntError`. ¿Qué necesita el `?` para compilar ahí?",
          "options": [
            {
              "text": "Que exista impl From<ParseIntError> for MiError — el ? la usa para convertir el error automáticamente",
              "correct": true
            },
            {
              "text": "Nada: el ? convierte cualquier error a cualquier otro",
              "correct": false
            },
            {
              "text": "Que MiError sea un String",
              "correct": false
            },
            {
              "text": "Usar dos ?? seguidos para la doble conversión",
              "correct": false
            }
          ],
          "explanation": "La expansión del `?` llama `From::from(e)` sobre el error antes de retornarlo — el trait From de m06 trabajando de incógnito. Si la conversión existe, los tipos cuadran y todo fluye; si no, el compilador te pide el `impl From` o un `.map_err()` manual en esa llamada. Escribir la conversión una vez libera a todos los `?` del módulo."
        },
        {
          "type": "exercise",
          "title": "Pipeline de configuración con errores unificados",
          "language": "rust",
          "prompt": "Estás cargando la configuración `\"host:puerto\"` de un servidor (como `\"localhost:8080\"`). Pueden fallar DOS cosas distintas: el formato (sin `:`) y el puerto (no numérico). Únelas en un solo flujo:\n\n1. Implementa `From<std::num::ParseIntError> for ErrorConfig` devolviendo `ErrorConfig::PuertoInvalido`.\n2. Implementa `parsear_config`:\n   - Sin `:` en el texto → `Err(ErrorConfig::FormatoInvalido)`. Pista: `texto.split_once(':')` devuelve `Option<(&str, &str)>`; conviértelo con `.ok_or(ErrorConfig::FormatoInvalido)?`.\n   - Parsea el puerto con `.parse()?` — y aquí tu `impl From` hace la magia: el ParseIntError se convierte SOLO.\n   - Devuelve `Ok(Config { host, puerto })`.",
          "starterCode": "#[derive(Debug, PartialEq)]\nenum ErrorConfig {\n    FormatoInvalido,\n    PuertoInvalido,\n}\n\n#[derive(Debug, PartialEq)]\nstruct Config {\n    host: String,\n    puerto: u16,\n}\n\n// TODO 1: impl From<std::num::ParseIntError> for ErrorConfig\n\nfn parsear_config(texto: &str) -> Result<Config, ErrorConfig> {\n    // TODO 2: split_once + ok_or + parse con ?\n    todo!()\n}\n\nfn main() {\n    assert_eq!(\n        parsear_config(\"localhost:8080\"),\n        Ok(Config { host: String::from(\"localhost\"), puerto: 8080 })\n    );\n    assert_eq!(parsear_config(\"sin-dos-puntos\"), Err(ErrorConfig::FormatoInvalido));\n    assert_eq!(parsear_config(\"host:abc\"), Err(ErrorConfig::PuertoInvalido));\n    assert_eq!(parsear_config(\"host:99999\"), Err(ErrorConfig::PuertoInvalido));\n    println!(\"Todo OK ✅\");\n}",
          "solution": "#[derive(Debug, PartialEq)]\nenum ErrorConfig {\n    FormatoInvalido,\n    PuertoInvalido,\n}\n\n#[derive(Debug, PartialEq)]\nstruct Config {\n    host: String,\n    puerto: u16,\n}\n\nimpl From<std::num::ParseIntError> for ErrorConfig {\n    fn from(_: std::num::ParseIntError) -> Self {\n        ErrorConfig::PuertoInvalido\n    }\n}\n\nfn parsear_config(texto: &str) -> Result<Config, ErrorConfig> {\n    let (host, puerto_str) = texto.split_once(':').ok_or(ErrorConfig::FormatoInvalido)?;\n    let puerto: u16 = puerto_str.trim().parse()?;\n    Ok(Config {\n        host: String::from(host),\n        puerto,\n    })\n}\n\nfn main() {\n    assert_eq!(\n        parsear_config(\"localhost:8080\"),\n        Ok(Config { host: String::from(\"localhost\"), puerto: 8080 })\n    );\n    assert_eq!(parsear_config(\"sin-dos-puntos\"), Err(ErrorConfig::FormatoInvalido));\n    assert_eq!(parsear_config(\"host:abc\"), Err(ErrorConfig::PuertoInvalido));\n    assert_eq!(parsear_config(\"host:99999\"), Err(ErrorConfig::PuertoInvalido));\n    println!(\"Todo OK ✅\");\n}",
          "hints": [
            "El From es mecánico: `impl From<std::num::ParseIntError> for ErrorConfig { fn from(_: std::num::ParseIntError) -> Self { ErrorConfig::PuertoInvalido } }`.",
            "`.ok_or(valor_de_error)` convierte `Option<T>` en `Result<T, E>`: `Some(x)` → `Ok(x)`, `None` → `Err(valor)`. Encadenado con `?`, extrae la tupla o propaga FormatoInvalido.",
            "Gracias a tu From, la línea del puerto es simplemente `let puerto: u16 = puerto_str.trim().parse()?;` — sin map_err. Eso es lo que el impl te compró."
          ],
          "explanation": "**Mira tu `parsear_config` terminada: tres líneas que se leen como el camino feliz**, con DOS modos de fallo distintos fluyendo por debajo. Esa es la estética del Rust profesional: la lógica visible, los errores en la fontanería.\n\n**Las dos piezas que lo hicieron posible:**\n- `.ok_or(...)` — el puente Option→Result (la familia completa: `ok_or`, `ok_or_else`, y su inverso `.ok()`).\n- `impl From<ParseIntError>` — la conversión central que TODOS los `?` del módulo reutilizan. Agregar un campo `timeout` mañana no necesita map_err: su parse usa el mismo From.\n\n**Y el caso `99999`** repite la lección de l01: u16 valida el rango del puerto gratis. Tipos correctos = validaciones gratis."
        }
      ]
    },
    {
      "id": "m07_l04",
      "moduleId": "m07",
      "moduleSlug": "m07_errors_testing",
      "order": 4,
      "title": "Tests: tu red de seguridad",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Un test es una afirmación que se verifica sola, para siempre",
          "problem": "Ya probaste tu función a mano y funciona. Pero el costo de un bug crece con la distancia a su creación: el refactor de la semana que viene, el cambio de un compañero en 6 meses… ¿quién va a re-probar todo, cada vez?",
          "mentalModel": "Cada test es un guardia de seguridad contratado una vez que vigila para siempre. `cargo test` despierta a todos los guardias en segundos; cualquier cambio que rompa una promesa hace sonar la alarma ANTES de llegar a producción.",
          "concreteExample": "En este curso ya viviste esto como alumno: cada challenge que verificaste corría asserts contra tu código. Ahora cambias de rol — de examinado a autor del examen.",
          "remember": "Los tests no demuestran que el código es correcto; demuestran que las promesas que decidiste verificar siguen cumpliéndose. Elegir buenas promesas es el arte."
        },
        {
          "type": "challenge",
          "conceptId": "m07-tdd-palindromo",
          "title": "Antes de leer: los tests ya existen — hazlos pasar",
          "prompt": "**Tu reto, al estilo TDD invertido:** los tests de `es_palindromo` ya están escritos (son exactamente lo que corre el botón Verificar). Tu trabajo es implementar la función que los hace pasar:\n\n- `es_palindromo(\"oso\")` → `true` (se lee igual al revés)\n- `es_palindromo(\"rust\")` → `false`\n- `es_palindromo(\"\")` → `true` (el vacío es palíndromo por convención)\n- `es_palindromo(\"a\")` → `true`\n\nPista de arranque: en m05 invertiste un String con `.chars().rev()`…",
          "starterCode": "fn es_palindromo(texto: &str) -> bool {\n    // ¿cómo comparas un texto con su reverso?\n    \n}",
          "tests": "fn main() {\n    assert!(es_palindromo(\"oso\"));\n    assert!(es_palindromo(\"reconocer\"));\n    assert!(!es_palindromo(\"rust\"));\n    assert!(es_palindromo(\"\"));\n    assert!(es_palindromo(\"a\"));\n    assert!(!es_palindromo(\"ab\"));\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn es_palindromo(texto: &str) -> bool {\n    let invertido: String = texto.chars().rev().collect();\n    invertido == texto\n}",
          "hints": [
            "Construye el reverso como en m05: `let invertido: String = texto.chars().rev().collect();`",
            "Comparar `String` con `&str` funciona directo: `invertido == texto`. Esa expresión bool ES tu retorno (sin `;`)."
          ],
          "reveal": "La solución reutiliza m05 entero:\n\n```rust\nfn es_palindromo(texto: &str) -> bool {\n    let invertido: String = texto.chars().rev().collect();\n    invertido == texto\n}\n```\n\nPero lo importante de este reto fue el **proceso**: tenías afirmaciones ejecutables ANTES de tener código. Cada caso (`\"\"`, `\"a\"`, `\"ab\"`) era una decisión de diseño congelada en un assert.\n\nEso es **Test-Driven Development**: los tests primero, como contrato; el código después, hasta que el contrato se cumple. En esta lección aprendes a escribir esos contratos tú — con el `#[test]` de verdad, el mismo que corre `cargo test` en cualquier empresa. 👇"
        },
        {
          "type": "text",
          "body": "## Anatomía de un test en Rust\n\nUn test es una función normal con el atributo `#[test]` encima. `cargo test` encuentra todas, las corre en paralelo, y reporta. El test pasa si la función termina sin panickear; falla si algo adentro panickea — y para eso están los asserts:\n\n- `assert!(cond)` — falla si la condición es falsa.\n- `assert_eq!(a, b)` — falla si difieren, **mostrando ambos valores** (por eso los tipos de tus tests quieren `#[derive(Debug, PartialEq)]`).\n- `assert_ne!(a, b)` — falla si son iguales.\n- Todos aceptan un mensaje extra: `assert!(x > 0, \"x debería ser positivo, era {}\", x)`.\n\n**Pruébalo de verdad** — este bloque corre con `cargo test` real (mira el botón):"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn suma(a: i32, b: i32) -> i32 {\n    a + b\n}\n\n#[test]\nfn suma_positivos() {\n    assert_eq!(suma(2, 3), 5);\n}\n\n#[test]\nfn suma_con_negativos() {\n    assert_eq!(suma(-2, -3), -5);\n    assert_eq!(suma(5, -5), 0);\n}\n\n#[test]\nfn suma_con_cero() {\n    assert_eq!(suma(7, 0), 7);\n}\n\n// Cambia el 5 de suma_positivos por un 6 y ejecuta de nuevo:\n// así se ve un test ROJO, con los dos valores en pantalla.",
          "runnable": true,
          "testMode": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Lee la salida:** `running 3 tests` … `test result: ok. 3 passed; 0 failed`. Cada función `#[test]` corre aislada y en paralelo. Cuando una falla, `cargo test` imprime el assert que explotó con los valores `left` y `right` — exactamente los mensajes que llevas viendo todo el curso al verificar challenges. Ahora sabes quién los escribía."
        },
        {
          "type": "text",
          "body": "## Testear que algo FALLA bien\n\nLa mitad del diseño de errores (lecciones 1-3) fue decidir cuándo fallar. Los tests también verifican eso:\n\n**Errores esperables (Result):** assertea sobre el `Err` como cualquier valor — `assert_eq!(parse_edad(\"abc\"), Err(ErrorEdad::NoEsNumero))`.\n\n**Panics (bugs y contratos):** `#[should_panic]` — el test pasa SOLO si el código panickea. Con `expected`, además verifica el mensaje:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn dividir(a: i32, b: i32) -> i32 {\n    if b == 0 {\n        panic!(\"división entre cero\");\n    }\n    a / b\n}\n\n#[test]\nfn divide_normal() {\n    assert_eq!(dividir(10, 2), 5);\n}\n\n#[test]\n#[should_panic(expected = \"división entre cero\")]\nfn dividir_entre_cero_panickea() {\n    dividir(1, 0); // si NO panickea, el test FALLA\n}",
          "runnable": true,
          "testMode": true
        },
        {
          "type": "quiz",
          "question": "¿Cuándo se considera que una función #[test] pasó?",
          "options": [
            {
              "text": "Si termina sin panickear — los asserts fallidos panickean, y eso es lo que cargo test detecta",
              "correct": true
            },
            {
              "text": "Si devuelve true",
              "correct": false
            },
            {
              "text": "Si imprime \"ok\" en pantalla",
              "correct": false
            },
            {
              "text": "Si termina en menos de un segundo",
              "correct": false
            }
          ],
          "explanation": "El mecanismo es elegante: `assert_eq!(a, b)` no es magia de testing — es un macro que panickea si a ≠ b. El runner solo observa: ¿la función terminó? pasó. ¿panickeó? falló. Por eso `panic!` de la lección 1 y los tests son el mismo sistema — y por eso `#[should_panic]` puede invertir la regla."
        },
        {
          "type": "quiz",
          "question": "¿Para qué sirve #[should_panic(expected = \"mensaje\")]?",
          "options": [
            {
              "text": "El test pasa solo si el código panickea Y el mensaje del panic contiene ese texto — verifica tus contratos de fallo",
              "correct": true
            },
            {
              "text": "Hace que el test nunca falle",
              "correct": false
            },
            {
              "text": "Imprime el mensaje cuando el test pasa",
              "correct": false
            },
            {
              "text": "Marca el test como pendiente de implementar",
              "correct": false
            }
          ],
          "explanation": "Si en la lección 1 decidiste \"esta función DEBE panickear ante un estado imposible\", eso es una promesa — y las promesas se testean. El `expected` evita falsos positivos: sin él, un panic por CUALQUIER motivo (¡incluso un bug!) haría pasar el test. Con él, solo pasa el panic correcto."
        },
        {
          "type": "exercise",
          "title": "Rojo → verde: caza el bug con tests",
          "language": "rust",
          "testMode": true,
          "prompt": "Esta función de descuentos **tiene un bug real** (de los que llegan a producción). Vas a cazarlo con el ciclo TDD:\n\n1. **Ejecuta los tests** tal cual están: el primero ya falla (ROJO). Lee la salida: `left` vs `right` te dice qué devolvió y qué se esperaba.\n2. **Encuentra el bug** en `aplicar_descuento`. Pista: ¿qué da `50 / 100` cuando ambos son enteros?\n3. **Corrígelo** y agrega los dos tests que faltan (los TODO). Ejecuta de nuevo: 3 tests VERDES.\n\nEste editor corre `cargo test` de verdad — eres tú escribiendo `#[test]` por primera vez.",
          "starterCode": "fn aplicar_descuento(precio: f64, porcentaje: u8) -> f64 {\n    // ¿Ves el bug? Los tests te lo van a gritar.\n    precio - precio * (porcentaje / 100) as f64\n}\n\n#[test]\nfn descuento_de_50_por_ciento() {\n    assert_eq!(aplicar_descuento(100.0, 50), 50.0);\n}\n\n// TODO: test \"descuento_de_25_por_ciento\": 80.0 con 25% → 60.0\n\n// TODO: test \"descuento_cero_no_cambia_el_precio\": 100.0 con 0% → 100.0",
          "solution": "fn aplicar_descuento(precio: f64, porcentaje: u8) -> f64 {\n    // El bug era (porcentaje / 100): división ENTERA → siempre 0 para <100.\n    // La conversión a f64 debe pasar ANTES de dividir:\n    precio - precio * (porcentaje as f64 / 100.0)\n}\n\n#[test]\nfn descuento_de_50_por_ciento() {\n    assert_eq!(aplicar_descuento(100.0, 50), 50.0);\n}\n\n#[test]\nfn descuento_de_25_por_ciento() {\n    assert_eq!(aplicar_descuento(80.0, 25), 60.0);\n}\n\n#[test]\nfn descuento_cero_no_cambia_el_precio() {\n    assert_eq!(aplicar_descuento(100.0, 0), 100.0);\n}",
          "hints": [
            "Ejecuta primero. La salida dirá algo como `left: 100.0, right: 50.0` — la función devolvió el precio SIN descuento. ¿Por qué el descuento dio 0?",
            "`porcentaje / 100` con `u8` es división entera: 50/100 = 0 (¡no 0.5!). El `as f64` llega tarde: convierte el 0 ya calculado.",
            "Arreglo: convierte ANTES de dividir — `porcentaje as f64 / 100.0`. Los tests nuevos son copias del primero con otros números y nombres descriptivos."
          ],
          "explanation": "**Acabas de vivir el ciclo completo:** test rojo → diagnóstico guiado por la salida → fix → verde. Fíjate cuánto trabajo hizo el `assert_eq!`: te dio el valor real y el esperado sin un solo println.\n\n**El bug que cazaste es un clásico universal** (división entera antes de convertir a flotante — existe en C, Java, Go…). Lo importante: el test de 50% lo expuso al instante. Sin tests, este bug llega a producción y alguien cobra precios sin descuento hasta que un cliente se queja.\n\n**Sobre los nombres:** `descuento_cero_no_cambia_el_precio` es una especificación legible, no `test3`. Cuando falle dentro de 6 meses, el nombre solo te dirá qué promesa se rompió. Los tests son la documentación que nunca miente — no puede: se ejecuta."
        }
      ]
    },
    {
      "id": "m07_l05",
      "moduleId": "m07",
      "moduleSlug": "m07_errors_testing",
      "order": 5,
      "title": "Organización de tests y el ciclo TDD",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Un test suite es un contrato versionado con tu yo del futuro",
          "problem": "Diez tests sueltos se vuelven doscientos. Sin estructura ni criterio de qué testear, el suite se convierte en ruido: lento, frágil, y nadie confía en él — peor que no tener tests.",
          "mentalModel": "Cada test tiene tres actos (Arrange-Act-Assert): prepara el escenario, ejecuta UNA cosa, afirma el resultado. Y el suite completo cubre tres frentes: el camino feliz, los bordes, y los errores.",
          "concreteExample": "Para `parse_edad`: feliz (`\"30\"` → 30), bordes (`\"0\"`, `\"130\"`, espacios), errores (`\"abc\"`, `\"-5\"`, `\"200\"`). Tres frentes, siete asserts, y la función queda blindada contra regresiones.",
          "remember": "Testea el contrato, no la implementación: si mañana reescribes el cuerpo de la función y el contrato se mantiene, los tests deben seguir verdes sin tocarlos."
        },
        {
          "type": "challenge",
          "conceptId": "m07-slug",
          "title": "Antes de leer: TDD de verdad — el contrato primero",
          "prompt": "**Tu reto:** implementa `slug`, la función que convierte títulos en URLs (la usa este mismo sitio: \"Hola Mundo\" → `hola-mundo`).\n\nEl contrato, escrito como tests (míralo en Verificar):\n\n- minúsculas: `\"Hola Mundo\"` → `\"hola-mundo\"`\n- espacios múltiples y bordes colapsan: `\"  Rust  es   genial  \"` → `\"rust-es-genial\"`\n- texto vacío → texto vacío\n\nHerramientas de m05 que encajan perfecto: `.to_lowercase()`, `.split_whitespace()` (colapsa espacios múltiples él solo), y `.join(\"-\")` sobre el Vec recolectado.",
          "starterCode": "fn slug(titulo: &str) -> String {\n    // minúsculas → palabras → unir con guiones\n    \n}",
          "tests": "fn main() {\n    assert_eq!(slug(\"Hola Mundo\"), \"hola-mundo\");\n    assert_eq!(slug(\"  Rust  es   genial  \"), \"rust-es-genial\");\n    assert_eq!(slug(\"YA-minusculas\"), \"ya-minusculas\");\n    assert_eq!(slug(\"\"), \"\");\n    assert_eq!(slug(\"   \"), \"\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn slug(titulo: &str) -> String {\n    titulo\n        .to_lowercase()\n        .split_whitespace()\n        .collect::<Vec<_>>()\n        .join(\"-\")\n}",
          "hints": [
            "Empieza por el caso simple: `titulo.to_lowercase()` te da un String en minúsculas. Sobre él, `.split_whitespace()` itera las palabras.",
            "`.split_whitespace()` ya ignora espacios al inicio, al final y los múltiples del medio — los casos \"difíciles\" del contrato salen gratis con la herramienta correcta.",
            "Cierre: `.collect::<Vec<_>>().join(\"-\")` — junta las palabras con guiones. El turbofish `::<Vec<_>>` le dice a collect QUÉ construir."
          ],
          "reveal": "```rust\nfn slug(titulo: &str) -> String {\n    titulo\n        .to_lowercase()\n        .split_whitespace()\n        .collect::<Vec<_>>()\n        .join(\"-\")\n}\n```\n\nFíjate qué pasó con los casos \"difíciles\" del contrato: los espacios múltiples, los bordes, el texto vacío… **los resolvió la elección de herramienta** (`split_whitespace`), no código extra. Esto es lo que el TDD provoca: como los casos límite estaban escritos ANTES, elegiste la herramienta que los cubre, en vez de parchear después.\n\nÚltima lección del módulo: dónde VIVEN estos tests en un proyecto real, y cómo el ciclo rojo-verde-refactor se vuelve tu forma de trabajar. 👇"
        },
        {
          "type": "text",
          "body": "## Dónde viven los tests: el módulo `tests`\n\nEn un proyecto real, los tests unitarios conviven con el código en el mismo archivo, dentro de un módulo anotado con `#[cfg(test)]` — \"compila esto SOLO al correr tests\" (cero costo en el binario de producción):"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn celsius_a_fahrenheit(c: f64) -> f64 {\n    c * 9.0 / 5.0 + 32.0\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*; // importa lo de \"arriba\" (el código a testear)\n\n    #[test]\n    fn cero_celsius_es_treinta_y_dos() {\n        assert_eq!(celsius_a_fahrenheit(0.0), 32.0);\n    }\n\n    #[test]\n    fn cien_celsius_es_doscientos_doce() {\n        assert_eq!(celsius_a_fahrenheit(100.0), 212.0);\n    }\n\n    #[test]\n    fn menos_cuarenta_coinciden() {\n        // El punto donde ambas escalas se cruzan 🌡️\n        assert_eq!(celsius_a_fahrenheit(-40.0), -40.0);\n    }\n}",
          "runnable": true,
          "testMode": true
        },
        {
          "type": "text",
          "body": "## El mapa completo de testing en un proyecto Cargo\n\nCuando salgas del playground a un proyecto real (próximo módulo), el layout estándar es:\n\n```text\nmi_proyecto/\n├── src/\n│   └── lib.rs        ← código + mod tests (tests UNITARIOS)\n└── tests/\n    └── integracion.rs ← tests de INTEGRACIÓN: usan tu crate\n                          como lo haría un usuario externo\n```\n\n- **Unitarios** (`mod tests`): acceden hasta a las funciones privadas; rápidos y quirúrgicos.\n- **Integración** (`tests/`): solo ven la API pública; verifican que las piezas encajan.\n- `cargo test` corre TODO; `cargo test nombre` filtra por nombre.\n\n## El ciclo TDD: rojo → verde → refactor\n\n1. **Rojo**: escribe un test del comportamiento que aún no existe. Córrelo. Falla (si no falla, el test no testea nada).\n2. **Verde**: escribe el código MÁS SIMPLE que lo hace pasar. Sin elegancia, sin generalizar.\n3. **Refactor**: ahora sí, mejora el código — con la red de seguridad verde vigilando cada paso.\n\nNo es dogma: para exploración, código primero está bien. Pero para **bugs** es oro puro: el test que reproduce el bug (rojo) es tu prueba de que de verdad lo arreglaste (verde) — y ese bug nunca vuelve sin que suene la alarma.\n\n## Qué testear (y qué no)\n\n✅ El contrato público: entradas → salidas, incluyendo errores.\n✅ Los tres frentes: feliz, bordes (vacío, cero, máximos), fallos.\n✅ Cada bug que encuentres: primero el test que lo reproduce, luego el fix.\n\n❌ Detalles internos de implementación (esos tests se rompen con cada refactor sano).\n❌ La librería estándar (`Vec::push` ya está testeado por el equipo de Rust)."
        },
        {
          "type": "quiz",
          "question": "¿Qué hace exactamente #[cfg(test)] sobre el módulo de tests?",
          "options": [
            {
              "text": "Compila ese módulo SOLO cuando corres cargo test — en el binario de producción los tests no existen ni pesan",
              "correct": true
            },
            {
              "text": "Hace que los tests corran más rápido",
              "correct": false
            },
            {
              "text": "Es decorativo: marca visualmente dónde están los tests",
              "correct": false
            },
            {
              "text": "Impide que los tests accedan al código privado",
              "correct": false
            }
          ],
          "explanation": "`cfg` = compilación condicional. Tus tests pueden importar herramientas pesadas y construir escenarios elaborados sin engordar un byte el ejecutable que despliegas. El `use super::*` del módulo, además, le da acceso a TODO el archivo — incluidas funciones privadas, algo que los tests de integración (carpeta `tests/`) no pueden."
        },
        {
          "type": "quiz",
          "question": "En el ciclo TDD, ¿por qué es importante VER el test fallar antes de escribir el código?",
          "options": [
            {
              "text": "Un test que nunca viste rojo podría estar pasando por accidente — verlo fallar prueba que de verdad vigila algo",
              "correct": true
            },
            {
              "text": "Por disciplina: es la regla del TDD y hay que seguirla",
              "correct": false
            },
            {
              "text": "Para que cargo test registre el fallo en su historial",
              "correct": false
            },
            {
              "text": "No es importante: se puede saltar siempre",
              "correct": false
            }
          ],
          "explanation": "Es el test del test. Un assert mal escrito (comparar una variable consigo misma, testear la función equivocada, un `should_panic` que pasa por un bug distinto) puede estar verde para siempre sin vigilar NADA. El momento rojo es tu única prueba de que la alarma funciona — después de eso, el verde significa algo."
        },
        {
          "type": "exercise",
          "title": "Escribe el test suite completo",
          "language": "rust",
          "testMode": true,
          "prompt": "Cambio de rol final: la función ya está escrita y es correcta — **tu trabajo es blindarla**. Escribe el módulo de tests de `buscar_mayor` cubriendo los tres frentes:\n\n1. **Feliz**: una lista normal devuelve `Some(mayor)`.\n2. **Bordes**: lista vacía → `None`; lista de UN elemento → ese elemento.\n3. **Casos con trampa**: todos negativos (¿devuelve el \"menos negativo\"?); el mayor repetido varias veces.\n\nMínimo 4 tests con nombres que describan la promesa (en español, largos, da igual: nadie los llama a mano). Recuerda el `use super::*;` dentro del módulo.",
          "starterCode": "fn buscar_mayor(numeros: &[i32]) -> Option<i32> {\n    numeros.iter().copied().max()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    // TODO: tus 4+ tests aquí\n}",
          "solution": "fn buscar_mayor(numeros: &[i32]) -> Option<i32> {\n    numeros.iter().copied().max()\n}\n\n#[cfg(test)]\nmod tests {\n    use super::*;\n\n    #[test]\n    fn lista_normal_devuelve_el_mayor() {\n        assert_eq!(buscar_mayor(&[3, 9, 2, 7]), Some(9));\n    }\n\n    #[test]\n    fn lista_vacia_devuelve_none() {\n        assert_eq!(buscar_mayor(&[]), None);\n    }\n\n    #[test]\n    fn un_solo_elemento_es_el_mayor() {\n        assert_eq!(buscar_mayor(&[42]), Some(42));\n    }\n\n    #[test]\n    fn con_negativos_devuelve_el_menos_negativo() {\n        assert_eq!(buscar_mayor(&[-5, -1, -20]), Some(-1));\n    }\n\n    #[test]\n    fn mayor_repetido_no_confunde() {\n        assert_eq!(buscar_mayor(&[7, 7, 7]), Some(7));\n    }\n}",
          "hints": [
            "Plantilla de cada test: `#[test] fn nombre_descriptivo() { assert_eq!(buscar_mayor(&[...]), Some(...)); }`",
            "El caso vacío compara contra `None`: `assert_eq!(buscar_mayor(&[]), None);` — la firma con `Option` (m04) hace que ni siquiera necesites should_panic.",
            "El caso \"todos negativos\" caza un bug clásico: implementaciones que arrancan con `mayor = 0` devolverían 0 para `[-5, -1]`. Tu test lo haría imposible."
          ],
          "explanation": "**Lo que practicaste — elegir QUÉ testear** — es la habilidad de verdad. Los tres frentes (feliz/bordes/trampas) salen de preguntarle al CONTRATO: \"¿qué prometes con listas vacías? ¿con negativos? ¿con empates?\".\n\n**El caso de los negativos merece mención:** parece paranoico testear eso para una función de una línea… hasta que alguien la \"optimiza\" mañana con un bucle manual que arranca en `0`. Tu test convierte ese bug futuro en un rojo instantáneo. Eso es blindar: no proteges la implementación de hoy, proteges el contrato de mañana.\n\n**Con esto cierras el módulo:** sabes decidir panic vs Result, diseñar errores como tipos, propagarlos con `?`, y verificar todo el sistema con tests. La próxima parada natural es el proyecto integrador — un programa real donde estas piezas trabajan juntas."
        }
      ]
    }
  ]
}

export default module

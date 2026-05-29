import type { Module } from '../types'

const module: Module = {
  "id": "m02",
  "slug": "m02_fundamentals",
  "order": 2,
  "version": 1,
  "icon": "📦",
  "title": "Fundamentos de Rust",
  "description": "Aprende las bases: variables, tipos de datos, funciones y flujo de control.",
  "lessons": [
    {
      "id": "m02_l01",
      "moduleId": "m02",
      "moduleSlug": "m02_fundamentals",
      "order": 1,
      "title": "Variables y Mutabilidad",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Variables: ¿por qué ponerle nombre a un dato?",
          "problem": "Un programa necesita recordar valores mientras trabaja. Si no puedes nombrar un dato, no puedes volver a usarlo, compararlo ni pasarlo a otra parte del programa.",
          "mentalModel": "Una variable es una etiqueta pegada a un valor. En Rust, esa etiqueta normalmente no se puede despegar y pegar a otro valor distinto a menos que declares que será mutable.",
          "concreteExample": "Si calculas el precio total de una compra, necesitas guardar el precio, la cantidad y el resultado. Rust prefiere que esos valores sean fijos por defecto para que no cambien accidentalmente en medio del cálculo.",
          "remember": "Inmutabilidad por defecto significa: “si algo cambia, quiero verlo explícito en el código”."
        },
        {
          "type": "challenge",
          "conceptId": "m02-mut-sum",
          "title": "Antes de leer: una variable que cambia",
          "prompt": "**Tu reto:** escribe `suma_hasta(n: u32) -> u32` que sume todos los números del 1 al `n`. Por ejemplo `suma_hasta(5)` = 1+2+3+4+5 = 15.\n\nVas a necesitar una variable que vaya cambiando dentro de un bucle. Inténtalo y dale a Verificar — después la idea de *mutabilidad* va a quedar clarísima.",
          "starterCode": "fn suma_hasta(n: u32) -> u32 {\n    // necesitas una variable que vaya acumulando...\n    \n}",
          "tests": "fn main() {\n    assert_eq!(suma_hasta(5), 15);\n    assert_eq!(suma_hasta(1), 1);\n    assert_eq!(suma_hasta(0), 0);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn suma_hasta(n: u32) -> u32 {\n    let mut total = 0;\n    for i in 1..=n {\n        total += i;\n    }\n    total\n}",
          "reveal": "En Rust las variables son **inmutables por defecto**: una vez les das un valor, no cambia. Si necesitas que cambie (como el acumulador aquí), debes pedirlo explícitamente con `mut`:\n\n```rust\nlet mut total = 0;   // total PUEDE cambiar\nfor i in 1..=n {\n    total += i;       // por eso esto es válido\n}\n```\n\nSi escribieras `let total = 0;` (sin `mut`) y luego `total += i;`, Rust **no compilaría**. Esto hace que cualquier cambio de estado sea visible y deliberado — justo lo que verás a continuación. 👇"
        },
        {
          "type": "text",
          "body": "## El Problema: Mutacion accidental\r\n\r\nEn la mayoria de lenguajes, las variables son mutables por defecto. Esto parece conveniente hasta que tu programa crece y alguien (o tu mismo, tres meses después) cambia una variable sin querer:"
        },
        {
          "type": "code",
          "language": "python",
          "code": "# Python - esto es perfectamente valido pero peligroso\r\n# Python - this is perfectly valid but dangerous\r\ntotal_price = 100.0\r\n# ... 200 lines of code later ...\r\ntotal_price = \"free\"  # Oops! Changed type AND value\r\nprint(total_price + 50)  # RuntimeError! Crashes at runtime",
          "runnable": false
        },
        {
          "type": "text",
          "body": "En Rust, esto **no compila**. Las variables son **inmutables por defecto**. Si intentas reasignar una variable sin declararla como mutable, el compilador te detiene *antes* de que el programa se ejecute:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let x = 5;\r\n    println!(\"El valor de x es: {}\", x);\r\n    x = 6;  // ERROR!\r\n    println!(\"El valor de x es: {}\", x);\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0384]: cannot assign twice to immutable variable `x`\r\n --> src/main.rs:4:5\r\n  |\r\n2 |     let x = 5;\r\n  |         - first assignment to `x`\r\n3 |     println!(\"El valor de x es: {}\", x);\r\n4 |     x = 6;\r\n  |     ^^^^^ cannot assign twice to immutable variable\r\n```"
        },
        {
          "type": "text",
          "body": "## ¿Por qué Rust hace esto?\r\n\r\nRust te obliga a ser **explícito** sobre la mutabilidad. Si una variable puede cambiar, debes declararlo con `let mut`. Esto tiene ventajas enormes:\r\n\r\n1. **Legibilidad**: Al leer el código, sabes inmediatamente que variables pueden cambiar y cuales no.\r\n2. **Seguridad**: Evitas bugs causados por mutaciones accidentales.\r\n3. **Concurrencia**: El compilador puede razonar sobre que datos son compartidos de forma segura entre hilos.\r\n\r\nLa inmutabilidad por defecto es una de las decisiones de diseño más inteligentes de Rust. Te hace pensar *antes* de mutar."
        },
        {
          "type": "text",
          "body": "## La solución: `let mut`\r\n\r\nCuando realmente necesitas una variable mutable, Rust te pide que lo declares explícitamente:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let mut x = 5;\r\n    println!(\"El valor de x es: {}\", x);\r\n    x = 6;  // Ahora si funciona!\r\n    println!(\"El valor de x es: {}\", x);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Shadowing: otra forma de \"cambiar\" una variable\r\n\r\nRust tiene un concepto llamado **shadowing** (sombreado): puedes declarar una nueva variable con el mismo nombre usando `let` otra vez. Esto *no* es lo mismo que mutar; estas creando una variable completamente nueva que **oculta** la anterior:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let x = 5;\r\n    println!(\"x original: {}\", x);\r\n\r\n    // Shadowing: creamos una NUEVA variable x\r\n    let x = x + 1;\r\n    println!(\"x despues del shadowing: {}\", x);\r\n\r\n    // Shadowing incluso puede cambiar el tipo!\r\n    let x = \"ahora soy un string\";\r\n    println!(\"x como string: {}\", x);\r\n\r\n    // Esto NO es posible con mut:\r\n    // let mut y = 5;\r\n    // y = \"string\";  // ERROR: no puedes cambiar el tipo con mut\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Shadowing vs mut - La diferencia clave:**\r\n- `let mut` te permite cambiar el **valor** pero NO el **tipo**.\r\n- Shadowing (`let x = ...` de nuevo) crea una **nueva variable** que puede tener un tipo diferente.\r\n- Con shadowing, la variable anterior deja de existir en ese scope."
        },
        {
          "type": "text",
          "body": "## Constantes: valores que NUNCA cambian\r\n\r\nPara valores que son verdaderamente constantes (como PI, la velocidad de la luz, o configuraciones fijas), Rust tiene `const`. Las constantes son diferentes de variables inmutables:\r\n\r\n- Se declaran con `const` en lugar de `let`.\r\n- **Siempre** debes especificar el tipo.\r\n- Se evalúan en tiempo de compilación.\r\n- Por convención, se escriben en `SCREAMING_SNAKE_CASE`."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "const MAX_PLAYERS: u32 = 100;\r\nconst PI: f64 = 3.14159265358979;\r\nconst APP_NAME: &str = \"Mi Aplicacion\";\r\n\r\nfn main() {\r\n    println!(\"Juego: {}\", APP_NAME);\r\n    println!(\"Maximo de jugadores: {}\", MAX_PLAYERS);\r\n    println!(\"Pi es aproximadamente: {:.4}\", PI);\r\n\r\n    // Ejemplo practico: convertir temperatura\r\n    let celsius = 100.0;\r\n    let fahrenheit = celsius * 9.0 / 5.0 + 32.0;\r\n    println!(\"{}C = {}F\", celsius, fahrenheit);\r\n\r\n    // Usando shadowing para la conversion inversa\r\n    let fahrenheit = 72.0;\r\n    let celsius = (fahrenheit - 32.0) * 5.0 / 9.0;\r\n    println!(\"{}F = {:.1}C\", fahrenheit, celsius);\r\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "Qué sucede cuando intentas asignar un nuevo valor a una variable inmutable en Rust?",
          "options": [
            {
              "text": "El programa se ejecuta pero con un warning",
              "correct": false
            },
            {
              "text": "Error de compilación: no puedes asignar dos veces a una variable inmutable",
              "correct": true
            },
            {
              "text": "El programa compila pero falla en tiempo de ejecución",
              "correct": false
            },
            {
              "text": "Rust automáticamente hace la variable mutable",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la diferencia entre `let mut x = 5; x = 6;` y `let x = 5; let x = 6;`?",
          "options": [
            {
              "text": "No hay diferencia, hacen exactamente lo mismo",
              "correct": false
            },
            {
              "text": "mut cambia el valor; shadowing crea una nueva variable (puede cambiar el tipo)",
              "correct": true
            },
            {
              "text": "Shadowing es más rápido que mut",
              "correct": false
            },
            {
              "text": "Solo se puede usar mut dentro de funciones",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Configuración de servidor: detectar mutaciones accidentales",
          "language": "rust",
          "prompt": "Este código simula la inicialización de un servidor HTTP. El puerto debería **nunca** cambiar después de ser configurado — pero alguien lo está sobrescribiendo dos pasos después.\n\nTu tarea: arregla el código aplicando inmutabilidad por defecto.\n\n1. Haz que `port` sea inmutable (es una decisión que no debería cambiar en runtime).\n2. La línea que reasigna `port` debe **dejar de compilar** — eso es exactamente la protección que queremos.\n3. Para el `request_count` (que sí cambia legítimamente con cada request), usa `mut`.\n4. Para `MAX_CONNECTIONS` (valor fijo del programa), usa `const` en lugar de `let`.",
          "starterCode": "fn main() {\n    let mut port = 8080;\n    let mut max_connections = 1000;\n    let mut request_count = 0;\n\n    println!(\"Servidor escuchando en :{}\", port);\n    println!(\"Máximo de conexiones: {}\", max_connections);\n\n    // Simulamos requests entrando\n    request_count += 1;\n    request_count += 1;\n\n    // BUG: alguien sobrescribió el puerto a mitad del programa\n    port = 9090;\n\n    println!(\"Requests procesados: {}\", request_count);\n    println!(\"Servidor ahora en :{}\", port);\n}",
          "solution": "const MAX_CONNECTIONS: u32 = 1000;\n\nfn main() {\n    let port = 8080;\n    let mut request_count = 0;\n\n    println!(\"Servidor escuchando en :{}\", port);\n    println!(\"Máximo de conexiones: {}\", MAX_CONNECTIONS);\n\n    // Simulamos requests entrando\n    request_count += 1;\n    request_count += 1;\n\n    // Esto ahora NO compila — exactamente lo que queremos:\n    // port = 9090;  // error[E0384]: cannot assign twice to immutable variable\n\n    println!(\"Requests procesados: {}\", request_count);\n    println!(\"Servidor en :{}\", port);\n}",
          "hints": [
            "Repasa: ¿qué declarador usas para una variable que NUNCA debe cambiar dentro de `main`? ¿Y qué usas para un valor que es constante en todo el programa, conocido en tiempo de compilación?",
            "`const` necesita siempre el tipo explícito (`const NOMBRE: u32 = 1000;`) y va FUERA de `main` por convención. `let` (sin `mut`) hace una variable local inmutable."
          ],
          "explanation": "**Lo que ganaste:** la línea `port = 9090` ahora es un error de compilación. Esa categoría completa de bug (reasignación accidental de configuración) desapareció. En un servidor real esto evita bugs como \"el puerto se cambió por una variable de entorno mal leída a mitad de ejecución\".\n\n**Patrón a recordar:**\n- `const` → valores conocidos en compilación, válidos en todo el programa.\n- `let` → variables locales que no cambian (la mayoría de tus variables deberían ser así).\n- `let mut` → solo cuando el cambio es parte de la lógica (contadores, acumuladores, buffers)."
        }
      ]
    },
    {
      "id": "m02_l02",
      "moduleId": "m02",
      "moduleSlug": "m02_fundamentals",
      "order": 2,
      "title": "Tipos de Datos",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Tipos de datos: ¿por qué Rust quiere saber qué clase de cosa tienes?",
          "problem": "La computadora sólo ve bits. Los mismos bits pueden representar un número, una letra, una dirección de memoria o una instrucción. El tipo le da significado a esos bits.",
          "mentalModel": "Un tipo es una etiqueta de seguridad. Dice qué operaciones tienen sentido. Puedes sumar números, pero no tiene sentido sumar una contraseña con una lista de usuarios.",
          "concreteExample": "El valor `65` puede ser el número sesenta y cinco o la letra `A` en cierto código de caracteres. Sin tipos, el programa tendría que adivinar. Rust prefiere que esa intención esté clara.",
          "remember": "Los tipos no son burocracia: son el mapa que evita que confundas cosas que en memoria podrían parecer parecidas."
        },
        {
          "type": "challenge",
          "conceptId": "m02-tuple-minmax",
          "title": "Antes de leer: devolver dos valores a la vez",
          "prompt": "**Tu reto:** escribe `min_max(a: i32, b: i32) -> (i32, i32)` que devuelva una tupla con el **menor primero** y el **mayor después**. Por ejemplo `min_max(9, 2)` devuelve `(2, 9)`.\n\n¿Cómo devuelves *dos* valores de una función? Inténtalo y dale a Verificar.",
          "starterCode": "fn min_max(a: i32, b: i32) -> (i32, i32) {\n    // ¿cómo agrupas dos números en un solo valor de retorno?\n    \n}",
          "tests": "fn main() {\n    assert_eq!(min_max(3, 8), (3, 8));\n    assert_eq!(min_max(9, 2), (2, 9));\n    assert_eq!(min_max(5, 5), (5, 5));\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn min_max(a: i32, b: i32) -> (i32, i32) {\n    if a <= b {\n        (a, b)\n    } else {\n        (b, a)\n    }\n}",
          "reveal": "La respuesta es una **tupla**: un tipo de dato que agrupa varios valores en uno. Se escribe entre paréntesis: `(2, 9)`. Su tipo es `(i32, i32)`.\n\n```rust\nfn min_max(a: i32, b: i32) -> (i32, i32) {\n    if a <= b { (a, b) } else { (b, a) }\n}\n```\n\nLas tuplas pueden mezclar tipos distintos — `(i32, &str, bool)` es válido — y se acceden por posición (`t.0`, `t.1`). Son la forma más simple de devolver varias cosas sin crear un struct. 👇"
        },
        {
          "type": "text",
          "body": "## El Problema: Cuando los tipos mienten\r\n\r\nEn lenguajes con tipado dinámico, los tipos pueden cambiar sin aviso. Esto crea bugs que solo aparecen en producción:"
        },
        {
          "type": "code",
          "language": "python",
          "code": "# Python - tipos que cambian silenciosamente\r\n# Python - types that change silently\r\nx = 3\r\ny = \"3\"\r\nprint(x + y)    # TypeError at RUNTIME! Not caught until executed.\r\n\r\n# JavaScript es aun peor:\r\n# console.log(3 + \"3\")   // \"33\" (string concatenation!)\r\n# console.log(3 - \"3\")   // 0 (numeric subtraction!)\r\n# Welcome to type coercion chaos.",
          "runnable": false
        },
        {
          "type": "text",
          "body": "En Rust, mezclar tipos **no compila**. El compilador te obliga a ser explícito sobre las conversiones de tipos. Esto significa que *toda* una categoría de bugs simplemente no puede existir:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let x: i32 = 3;\r\n    let y: f64 = 3.0;\r\n    let sum = x + y;  // ERROR! Can't add i32 and f64\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0277]: cannot add `f64` to `i32`\r\n --> src/main.rs:4:19\r\n  |\r\n4 |     let sum = x + y;\r\n  |                   ^ no implementation for `i32 + f64`\r\n```\r\nRust te obliga a convertir explícitamente: `let sum = x as f64 + y;` o `let sum = x + y as i32;`"
        },
        {
          "type": "text",
          "body": "## ¿Por qué Rust hace esto?\r\n\r\nLa conversión implícita de tipos es una fuente enorme de bugs. Cuando escribes `x as f64`, le dices al compilador y a futuros lectores: \"**Sí, sé que estoy convirtiendo tipos, y lo hago a propósito.**\" Esto hace el código más predecible y más fácil de depurar."
        },
        {
          "type": "text",
          "body": "## Tipos escalares\r\n\r\nRust tiene cuatro tipos escalares principales. Cada uno tiene un tamaño fijo en memoria:\r\n\r\n### Enteros (Integer types)\r\n| Tamaño | Con signo | Sin signo |\r\n|--------|-----------|-----------|\r\n| 8 bits  | `i8`  (-128 a 127) | `u8` (0 a 255) |\r\n| 16 bits | `i16` | `u16` |\r\n| 32 bits | `i32` (por defecto) | `u32` |\r\n| 64 bits | `i64` | `u64` |\r\n| 128 bits | `i128` | `u128` |\r\n| arch | `isize` | `usize` |\r\n\r\n`isize` y `usize` dependen de la arquitectura: 64 bits en una máquina de 64 bits, 32 bits en una de 32."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Inferencia de tipos: Rust elige i32 por defecto para enteros\r\n    let entero = 42;         // i32\r\n    let decimal = 3.14;      // f64\r\n\r\n    // Tipos explicitos\r\n    let edad: u8 = 25;       // Solo 0-255, perfecto para edades\r\n    let temperatura: i16 = -10;\r\n    let poblacion: u64 = 8_000_000_000;  // Guiones bajos para legibilidad!\r\n    let pi: f32 = 3.14159;   // Menos precision pero menos memoria\r\n\r\n    println!(\"Entero: {} (i32 por defecto)\", entero);\r\n    println!(\"Decimal: {} (f64 por defecto)\", decimal);\r\n    println!(\"Edad: {} (u8: 0-255)\", edad);\r\n    println!(\"Temperatura: {} (i16: numeros negativos)\", temperatura);\r\n    println!(\"Poblacion: {} (u64: numeros grandes)\", poblacion);\r\n    println!(\"Pi: {} (f32: menos precision)\", pi);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### Booleanos y caracteres\r\n\r\n- `bool`: solo puede ser `true` o `false`. Ocupa 1 byte en memoria.\r\n- `char`: representa un carácter Unicode. Ocupa 4 bytes (puede almacenar emojis y caracteres de cualquier idioma)."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let activo: bool = true;\r\n    let letra: char = 'A';\r\n    let emoji: char = '\\u{1F980}';  // Cangrejo! El simbolo de Rust\r\n    let kanji: char = '\\u{5B89}';   // Caracter japones\r\n\r\n    println!(\"Activo: {}\", activo);\r\n    println!(\"Letra: {}\", letra);\r\n    println!(\"Emoji: {}\", emoji);\r\n    println!(\"Kanji: {}\", kanji);\r\n\r\n    // Los char usan comillas simples, los strings comillas dobles\r\n    // char = 'a'    string = \"a\"\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Tipos compuestos\r\n\r\nRust tiene dos tipos compuestos primitivos: **tuplas** y **arrays**.\r\n\r\n### Tuplas\r\nLas tuplas agrupan valores de **diferentes tipos** con una longitud fija:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Tupla con tipos mixtos\r\n    let persona: (&str, i32, f64) = (\"Ana\", 28, 1.65);\r\n\r\n    // Acceso por indice (empieza en 0)\r\n    println!(\"Nombre: {}\", persona.0);\r\n    println!(\"Edad: {}\", persona.1);\r\n    println!(\"Altura: {}\", persona.2);\r\n\r\n    // Destructuracion: extraer valores en variables\r\n    let (nombre, edad, altura) = persona;\r\n    println!(\"{} tiene {} anos y mide {}m\", nombre, edad, altura);\r\n\r\n    // Tupla unitaria (unit type) - representa \"sin valor\"\r\n    let vacio: () = ();\r\n    println!(\"Tipo unitario: {:?}\", vacio);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### Arrays\r\nLos arrays contienen valores del **mismo tipo** con una longitud fija (conocida en tiempo de compilación):"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Array de 5 enteros\r\n    let numeros: [i32; 5] = [1, 2, 3, 4, 5];\r\n    println!(\"Primer numero: {}\", numeros[0]);\r\n    println!(\"Ultimo numero: {}\", numeros[4]);\r\n\r\n    // Array inicializado con el mismo valor\r\n    let ceros = [0; 10];  // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]\r\n    println!(\"Array de ceros: {:?}\", ceros);\r\n\r\n    // Los arrays tienen longitud fija\r\n    let dias = [\"Lun\", \"Mar\", \"Mie\", \"Jue\", \"Vie\", \"Sab\", \"Dom\"];\r\n    println!(\"Dias laborales: {:?}\", &dias[0..5]);\r\n    println!(\"Fin de semana: {:?}\", &dias[5..7]);\r\n    println!(\"Total de dias: {}\", dias.len());\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Arrays vs Vectores**: Los arrays en Rust tienen tamaño fijo. Si necesitas una coleccion que pueda crecer o encogerse, usa `Vec<T>` (vector). Lo veremos en un modulo posterior. Por ahora, piensa en los arrays como listas de tamaño conocido en tiempo de compilación."
        },
        {
          "type": "text",
          "body": "## Inferencia de tipos vs anotación explícita\r\n\r\nRust es inteligente: puede **inferir** el tipo de la mayoria de las variables por el contexto. Pero a veces necesitas ser explícito:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Rust infiere estos tipos automaticamente\r\n    let x = 5;           // i32 (entero por defecto)\r\n    let y = 3.14;        // f64 (decimal por defecto)\r\n    let activo = true;   // bool\r\n    let letra = 'A';     // char\r\n\r\n    // A veces DEBES especificar el tipo\r\n    let resultado: u32 = \"42\".parse().expect(\"No es un numero\");\r\n    println!(\"Resultado parseado: {}\", resultado);\r\n\r\n    // Sin la anotacion, Rust no sabe a que tipo parsear:\r\n    // let resultado = \"42\".parse().expect(\"error\");\r\n    // ERROR: type annotations needed\r\n\r\n    // Conversion explicita entre tipos numericos\r\n    let entero: i32 = 10;\r\n    let decimal: f64 = entero as f64;\r\n    let pequeno: u8 = entero as u8;\r\n    println!(\"{} -> {} (f64) -> {} (u8)\", entero, decimal, pequeno);\r\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "Qué tipo infiere Rust para `let x = 5;`?",
          "options": [
            {
              "text": "u32",
              "correct": false
            },
            {
              "text": "i32",
              "correct": true
            },
            {
              "text": "i64",
              "correct": false
            },
            {
              "text": "El tipo depende del valor",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Por qué Rust no permite sumar un `i32` con un `f64` directamente?",
          "options": [
            {
              "text": "Es un bug del compilador",
              "correct": false
            },
            {
              "text": "Para evitar conversiones implicitas que pueden causar bugs",
              "correct": true
            },
            {
              "text": "Porque los números decimales no existen en Rust",
              "correct": false
            },
            {
              "text": "Por razones de rendimiento",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Elegir tipos correctos para configuración de un servicio",
          "language": "rust",
          "prompt": "Estás cargando configuración de un microservicio. Hay 4 valores y todos están declarados con tipos genéricos o equivocados — esto causa bugs sutiles (overflow, precisión, conversiones inesperadas).\n\nTu tarea: elige el tipo más apropiado para cada valor según su semántica.\n\n- `port`: puerto TCP, **siempre entre 0 y 65535**. Usa el tipo que comunique exactamente ese rango.\n- `user_id`: identificador de usuario en producción. Puede crecer mucho (millones de usuarios). Nunca negativo.\n- `request_timeout_ms`: timeout en milisegundos. Nunca negativo, valores típicos: 1000-30000.\n- `cpu_load_percent`: carga de CPU como porcentaje con decimales (ej: 73.5).",
          "starterCode": "fn main() {\n    let port: i32 = 8080;\n    let user_id: i32 = 1_000_000;\n    let request_timeout_ms: i64 = 5_000;\n    let cpu_load_percent: i32 = 73; // perdemos los decimales!\n\n    println!(\"Servicio configurado:\");\n    println!(\"  Puerto: {}\", port);\n    println!(\"  Usuario actual: {}\", user_id);\n    println!(\"  Timeout: {} ms\", request_timeout_ms);\n    println!(\"  Carga CPU: {}%\", cpu_load_percent);\n}",
          "solution": "fn main() {\n    let port: u16 = 8080;                    // 0..65535 exacto\n    let user_id: u64 = 1_000_000;            // sin signo, capacidad grande\n    let request_timeout_ms: u32 = 5_000;     // sin signo, hasta ~4 mil millones\n    let cpu_load_percent: f32 = 73.5;        // decimales con precisión suficiente\n\n    println!(\"Servicio configurado:\");\n    println!(\"  Puerto: {}\", port);\n    println!(\"  Usuario actual: {}\", user_id);\n    println!(\"  Timeout: {} ms\", request_timeout_ms);\n    println!(\"  Carga CPU: {}%\", cpu_load_percent);\n}",
          "hints": [
            "Las dos preguntas que debes hacerte para cada número: (1) ¿puede ser negativo? Si no → tipo `u*` (sin signo). (2) ¿cuál es el valor máximo realista? Eso decide el ancho (u8/u16/u32/u64).",
            "Para puerto TCP el rango es exactamente 0..65535. ¿Qué tipo entero sin signo cubre ese rango exactamente? Pista: 2^16 = 65536.",
            "Para decimales: `f32` (32 bits) suele alcanzar para porcentajes. `f64` es para precisión científica o financiera. No mezcles tipos en operaciones."
          ],
          "explanation": "**Por qué importa elegir bien el tipo:**\n\n- `u16` para `port` documenta el invariante en el sistema de tipos: si alguien intenta asignarle `70000`, el compilador rechaza. Con `i32` el bug se cuela hasta runtime.\n- `u32` para timeouts es el tipo idiomático en APIs como `tokio::time::Duration::from_millis(u64)` — pero `u32` te ahorra memoria si nunca llegará a millones.\n- `u64` para IDs es el estándar en bases de datos modernas (Postgres `bigserial`, Snowflake IDs).\n- `f32` vs `f64`: usa `f64` por defecto. Solo baja a `f32` cuando el costo de memoria importa (millones de valores) y la precisión no es crítica.\n\n**Anti-patrón:** declarar todo como `i32` o `i64` por costumbre. Pierdes información semántica que el compilador podría aprovechar."
        }
      ]
    },
    {
      "id": "m02_l03",
      "moduleId": "m02",
      "moduleSlug": "m02_fundamentals",
      "order": 3,
      "title": "Funciones",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Funciones: partir un problema grande en máquinas pequeñas",
          "problem": "Si todo el programa vive en un solo bloque, no puedes razonar bien sobre él. Necesitas separar trabajo, darle nombre y definir qué entra y qué sale.",
          "mentalModel": "Una función es una máquina pequeña: recibe ingredientes, hace una transformación y devuelve un resultado. Su firma es el contrato.",
          "concreteExample": "Una función `calcular_total(precio, cantidad)` no necesita saber quién compró ni cómo se verá la pantalla. Sólo resuelve una tarea. Eso reduce la carga mental y hace más fácil encontrar errores.",
          "remember": "Una buena función responde: qué necesita, qué promete devolver y qué parte del problema deja resuelta."
        },
        {
          "type": "challenge",
          "conceptId": "m02-fn-return",
          "title": "Antes de leer: crea tu primera función",
          "prompt": "Necesitamos calcular **el doble** de varios números. En vez de repetir `n * 2` por todos lados, vamos a encapsularlo en una función.\n\n**Tu reto:** escribe una función `doble(n: i32) -> i32` que devuelva el doble de `n`.\n\nNo importa si aún no conoces la sintaxis exacta — **inténtalo y dale a Verificar**. Aunque falles, la explicación de abajo te va a cuajar mucho mejor después de haber forcejeado un poco.",
          "starterCode": "// Completa esta función para que devuelva el doble de n\nfn doble(n: i32) -> i32 {\n    \n}",
          "tests": "fn main() {\n    assert_eq!(doble(2), 4, \"doble(2) deberia ser 4\");\n    assert_eq!(doble(10), 20, \"doble(10) deberia ser 20\");\n    assert_eq!(doble(0), 0, \"doble(0) deberia ser 0\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn doble(n: i32) -> i32 {\n    n * 2\n}",
          "reveal": "Una **función** en Rust se escribe así:\n\n```rust\nfn nombre(parametro: Tipo) -> TipoDeRetorno {\n    // cuerpo\n}\n```\n\nLa clave que quizá te trabó: **la última expresión sin punto y coma es el valor que devuelve la función.** Por eso la solución es simplemente:\n\n```rust\nfn doble(n: i32) -> i32 {\n    n * 2\n}\n```\n\nFíjate que `n * 2` **no** lleva `;` al final. Si escribieras `n * 2;`, ese punto y coma lo convertiría en una sentencia (una acción que no produce valor) y la función no devolvería nada — Rust ni siquiera compilaría. Justo eso es lo que vas a leer ahora. 👇"
        },
        {
          "type": "text",
          "body": "## El Problema: Funciones que mienten sobre sus tipos\r\n\r\nEn muchos lenguajes, las funciones no declaran que tipo de datos reciben ni que devuelven. Esto crea una bomba de tiempo:"
        },
        {
          "type": "code",
          "language": "python",
          "code": "# Python - la funcion no dice que tipos espera\r\n# Python - the function doesn't say what types it expects\r\ndef calculate_area(width, height):\r\n    return width * height\r\n\r\n# Esto funciona... pero no deberia\r\narea = calculate_area(\"hello\", 3)  # \"hellohellohello\"\r\n# No hay error hasta que intentas usar el resultado como numero",
          "runnable": false
        },
        {
          "type": "text",
          "body": "En Rust, **toda función debe declarar los tipos de sus parámetros y su valor de retorno**. Si los tipos no coinciden, el código no compila. Esto significa que es *imposible* llamar a una función con argumentos del tipo equivocado:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn calculate_area(width: f64, height: f64) -> f64 {\r\n    width * height\r\n}\r\n\r\nfn main() {\r\n    // Esto no compila: \"hello\" no es f64\r\n    let area = calculate_area(\"hello\", 3);\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0308]: mismatched types\r\n --> src/main.rs:7:33\r\n  |\r\n7 |     let area = calculate_area(\"hello\", 3);\r\n  |                               ^^^^^^^ expected `f64`, found `&str`\r\n```\r\nRust detecta el error **antes** de ejecutar el programa. En Python, este bug podría esconderse durante meses."
        },
        {
          "type": "text",
          "body": "## Anatomía de una función en Rust\r\n\r\nUna función en Rust se compone de:\r\n- `fn`: palabra clave para declarar la función\r\n- **Nombre**: en `snake_case` por convención\r\n- **Parámetros**: con tipos explícitos\r\n- **Tipo de retorno**: después de `->`\r\n- **Cuerpo**: entre llaves `{}`"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "// Funcion sin parametros ni retorno\r\nfn saludar() {\r\n    println!(\"Hola desde una funcion!\");\r\n}\r\n\r\n// Funcion con parametros\r\nfn saludar_a(nombre: &str) {\r\n    println!(\"Hola, {}!\", nombre);\r\n}\r\n\r\n// Funcion con retorno\r\nfn sumar(a: i32, b: i32) -> i32 {\r\n    a + b  // Sin punto y coma = valor de retorno\r\n}\r\n\r\n// Funcion con multiples parametros y retorno\r\nfn calcular_imc(peso_kg: f64, altura_m: f64) -> f64 {\r\n    peso_kg / (altura_m * altura_m)\r\n}\r\n\r\nfn main() {\r\n    saludar();\r\n    saludar_a(\"Ferris\");\r\n\r\n    let resultado = sumar(3, 7);\r\n    println!(\"3 + 7 = {}\", resultado);\r\n\r\n    let imc = calcular_imc(70.0, 1.75);\r\n    println!(\"IMC: {:.1}\", imc);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## El concepto clave: Expresiones vs Sentencias\r\n\r\nEsta es una de las ideas más importantes (y confusas al principio) de Rust:\r\n\r\n- **Sentencia** (statement): ejecuta una acción pero **no devuelve un valor**. Termina con `;`.\r\n- **Expresión** (expression): se evalúa y **produce un valor**. NO termina con `;`.\r\n\r\nEn Rust, **la última expresión de una función es su valor de retorno** (sin `return`, sin `;`):"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn cinco() -> i32 {\r\n    5  // Expresion: devuelve 5 (sin punto y coma!)\r\n}\r\n\r\nfn seis() -> i32 {\r\n    let x = 5;  // Sentencia (con ;)\r\n    x + 1        // Expresion: devuelve x + 1 (sin ;)\r\n}\r\n\r\n// Tambien puedes usar `return` explicitamente (util para retornos tempranos)\r\nfn valor_absoluto(x: i32) -> i32 {\r\n    if x < 0 {\r\n        return -x;  // Retorno temprano con return\r\n    }\r\n    x  // Ultima expresion = valor de retorno\r\n}\r\n\r\nfn main() {\r\n    println!(\"cinco() = {}\", cinco());\r\n    println!(\"seis() = {}\", seis());\r\n    println!(\"|(-3)| = {}\", valor_absoluto(-3));\r\n    println!(\"|(7)| = {}\", valor_absoluto(7));\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## El error clasico: el punto y coma asesino\r\n\r\nEste es probablemente el error más común para principiantes en Rust. Agregar un `;` al final de la última línea la convierte de expresión a sentencia, y la función ya no devuelve nada:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn sumar(a: i32, b: i32) -> i32 {\r\n    a + b;  // ERROR! El ; convierte esto en una sentencia\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0308]: mismatched types\r\n --> src/main.rs:2:5\r\n  |\r\n1 | fn sumar(a: i32, b: i32) -> i32 {\r\n  |                              --- expected `i32` because of return type\r\n2 |     a + b;\r\n  |          - help: remove this semicolon to return this value\r\n  |     expected `i32`, found `()`\r\n```\r\nEl compilador incluso te dice la solución: **\"remove this semicolon to return this value\"**. Rust tiene mensajes de error excepcionales."
        },
        {
          "type": "text",
          "body": "## Bloques como expresiones\r\n\r\nEn Rust, los bloques `{}` también son expresiones. Esto es muy útil para cálculos temporales:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Un bloque como expresion\r\n    let y = {\r\n        let x = 3;\r\n        x + 1  // Este valor se asigna a y\r\n    };\r\n    println!(\"y = {}\", y);  // y = 4\r\n\r\n    // Ejemplo practico: calculadora de IMC con clasificacion\r\n    let peso = 70.0_f64;\r\n    let altura = 1.75_f64;\r\n\r\n    let clasificacion = {\r\n        let imc = peso / (altura * altura);\r\n        if imc < 18.5 {\r\n            \"bajo peso\"\r\n        } else if imc < 25.0 {\r\n            \"peso normal\"\r\n        } else if imc < 30.0 {\r\n            \"sobrepeso\"\r\n        } else {\r\n            \"obesidad\"\r\n        }\r\n    };\r\n\r\n    println!(\"Con peso {}kg y altura {}m: {}\", peso, altura, clasificacion);\r\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "Qué tiene de malo esta función? `fn sumar(a: i32, b: i32) -> i32 { a + b; }`",
          "options": [
            {
              "text": "Falta la palabra clave `return`",
              "correct": false
            },
            {
              "text": "El punto y coma convierte la expresión en sentencia, así que no devuelve ningún valor",
              "correct": true
            },
            {
              "text": "Los nombres de los parámetros están mal",
              "correct": false
            },
            {
              "text": "No se puede devolver i32",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Por qué Rust exige ¿qué declares los tipos de los parámetros de una función?",
          "options": [
            {
              "text": "Para que el código sea más largo y difícil de escribir",
              "correct": false
            },
            {
              "text": "Para que el compilador pueda verificar que las llamadas usan los tipos correctos",
              "correct": true
            },
            {
              "text": "Es solo una preferencia estetica del lenguaje",
              "correct": false
            },
            {
              "text": "Porque Rust no tiene inferencia de tipos",
              "correct": false
            }
          ]
        },
        {
          "type": "faded-exercise",
          "conceptId": "m02-fn-conditional",
          "title": "Práctica guiada: elegir entre dos valores",
          "intro": "Construyamos juntos una función que decide cuál de dos números devolver. Primero observas, luego completas, luego lo haces solo — el apoyo se retira en cada paso.",
          "stages": [
            {
              "kind": "worked",
              "instructions": "**Paso 1 — observa.** Mira cómo `minimo` usa `if/else` *como expresión* para devolver un valor. No hay `return` ni `;`: el `if/else` entero ES el valor que devuelve la función.",
              "code": "fn minimo(a: i32, b: i32) -> i32 {\n    if a < b {\n        a\n    } else {\n        b\n    }\n}"
            },
            {
              "kind": "faded",
              "instructions": "**Paso 2 — completa.** Ahora te toca `maximo`. Reemplaza los `___` para que devuelva el **mayor** de los dos, y dale a Verificar.",
              "code": "fn maximo(a: i32, b: i32) -> i32 {\n    if a ___ b {\n        a\n    } else {\n        ___\n    }\n}"
            },
            {
              "kind": "solo",
              "instructions": "**Paso 3 — tú solo.** Solo te damos la firma. Escribe `maximo` completa desde cero y verifica.",
              "code": "fn maximo(a: i32, b: i32) -> i32 {\n    // tu código aquí\n}"
            }
          ],
          "tests": "fn main() {\n    assert_eq!(maximo(2, 5), 5, \"maximo(2, 5) deberia ser 5\");\n    assert_eq!(maximo(9, 4), 9, \"maximo(9, 4) deberia ser 9\");\n    assert_eq!(maximo(-3, -7), -3, \"maximo(-3, -7) deberia ser -3\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn maximo(a: i32, b: i32) -> i32 {\n    if a > b {\n        a\n    } else {\n        b\n    }\n}"
        },
        {
          "type": "exercise",
          "title": "Extraer función: calcular precio con descuento",
          "language": "rust",
          "prompt": "Tienes un script que calcula precios con descuento por volumen, pero todo vive dentro de `main` repetido tres veces. Esto es un anti-patrón: cuando cambies la fórmula del descuento tendrás que cambiarla en 3 lugares (y olvidarte de uno).\n\nTu tarea: extrae una función `precio_con_descuento` que reciba `precio: f64` y `cantidad: u32`, y devuelva el total con descuento aplicado.\n\nRegla de descuento:\n- < 10 unidades: sin descuento\n- 10-49 unidades: 10% de descuento\n- 50+ unidades: 20% de descuento\n\nDespués usa la función en los 3 casos. Recuerda: no uses `return` ni `;` en la última expresión del cuerpo.",
          "starterCode": "fn main() {\n    // Cliente 1: 5 productos a $20 cada uno\n    let total_1 = if 5 >= 50 {\n        20.0 * 5.0 * 0.8\n    } else if 5 >= 10 {\n        20.0 * 5.0 * 0.9\n    } else {\n        20.0 * 5.0\n    };\n    println!(\"Cliente 1: ${}\", total_1);\n\n    // Cliente 2: 25 productos a $20\n    let total_2 = if 25 >= 50 {\n        20.0 * 25.0 * 0.8\n    } else if 25 >= 10 {\n        20.0 * 25.0 * 0.9\n    } else {\n        20.0 * 25.0\n    };\n    println!(\"Cliente 2: ${}\", total_2);\n\n    // Cliente 3: 100 productos a $20\n    let total_3 = if 100 >= 50 {\n        20.0 * 100.0 * 0.8\n    } else if 100 >= 10 {\n        20.0 * 100.0 * 0.9\n    } else {\n        20.0 * 100.0\n    };\n    println!(\"Cliente 3: ${}\", total_3);\n}",
          "solution": "fn precio_con_descuento(precio: f64, cantidad: u32) -> f64 {\n    let subtotal = precio * cantidad as f64;\n    if cantidad >= 50 {\n        subtotal * 0.8\n    } else if cantidad >= 10 {\n        subtotal * 0.9\n    } else {\n        subtotal\n    }\n}\n\nfn main() {\n    println!(\"Cliente 1: ${}\", precio_con_descuento(20.0, 5));\n    println!(\"Cliente 2: ${}\", precio_con_descuento(20.0, 25));\n    println!(\"Cliente 3: ${}\", precio_con_descuento(20.0, 100));\n}",
          "hints": [
            "La firma de la función debe documentar exactamente qué entra y qué sale. `precio` es decimal (f64). `cantidad` es entero sin signo (u32). El retorno también es decimal: `-> f64`.",
            "Como `cantidad` es `u32` y `precio` es `f64`, no puedes multiplicarlos directamente. Necesitas convertir: `cantidad as f64`.",
            "El cuerpo de la función termina con un `if/else` expresión — sin `;` al final del bloque. Ese valor es lo que se devuelve."
          ],
          "explanation": "**Lo que ganaste:**\n\n1. **Una sola fuente de verdad para la regla de descuento.** Si mañana añades un escalón \"100+ → 25%\", lo cambias en un solo lugar.\n2. **Tipos explícitos en la firma** documentan el contrato. Cualquiera que lea `fn precio_con_descuento(precio: f64, cantidad: u32) -> f64` sabe qué pasarle y qué esperar.\n3. **Tests posibles.** Ahora puedes escribir `#[test] fn descuento_50_aplica() { assert_eq!(precio_con_descuento(10.0, 50), 80.0); }`.\n\n**Patrón a recordar:** cuando ves un bloque de lógica repetido (aunque sea con valores distintos), extrae a función. La regla de Rust idiomático: una función debe responder a una sola pregunta."
        }
      ]
    },
    {
      "id": "m02_l04",
      "moduleId": "m02",
      "moduleSlug": "m02_fundamentals",
      "order": 4,
      "title": "Flujo de Control",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Flujo de control: enseñar al programa a elegir",
          "problem": "La vida real tiene condiciones: si hay saldo, compra; si no, muestra error. Si no podemos expresar decisiones y repeticiones, sólo podemos escribir programas lineales y rígidos.",
          "mentalModel": "`if`, `match` y los bucles son desvíos en una ruta. El programa camina por un mapa y cada condición decide qué camino tomar.",
          "concreteExample": "En una app de bus, si el asiento está libre lo reservas; si está ocupado buscas otro; si no hay ninguno muestras “agotado”. Eso es flujo de control: convertir reglas del mundo en caminos de ejecución.",
          "remember": "Controlar el flujo es controlar cuándo ocurre cada trabajo y bajo qué condición."
        },
        {
          "type": "challenge",
          "conceptId": "m02-control-factorial",
          "title": "Antes de leer: repetir hasta terminar",
          "prompt": "**Tu reto:** escribe `factorial(n: u64) -> u64`. El factorial de `n` es el producto `1 × 2 × … × n`. Por ejemplo `factorial(5)` = 120. Y por definición, `factorial(0)` = 1.\n\nNecesitarás repetir una multiplicación varias veces. Inténtalo y dale a Verificar.",
          "starterCode": "fn factorial(n: u64) -> u64 {\n    // ¿cómo repites una multiplicación n veces?\n    \n}",
          "tests": "fn main() {\n    assert_eq!(factorial(0), 1);\n    assert_eq!(factorial(3), 6);\n    assert_eq!(factorial(5), 120);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn factorial(n: u64) -> u64 {\n    let mut resultado = 1;\n    for i in 1..=n {\n        resultado *= i;\n    }\n    resultado\n}",
          "reveal": "La herramienta es un **bucle**. `for i in 1..=n` recorre los números de 1 a `n`, y en cada vuelta multiplicamos:\n\n```rust\nfn factorial(n: u64) -> u64 {\n    let mut resultado = 1;\n    for i in 1..=n {\n        resultado *= i;\n    }\n    resultado\n}\n```\n\nFíjate que `factorial(0)` da 1 \"gratis\": el rango `1..=0` está vacío, así que el bucle no se ejecuta y `resultado` queda en 1. El flujo de control (`for`, `if`, `while`, `loop`) es lo que verás ahora en detalle. 👇"
        },
        {
          "type": "text",
          "body": "## El Problema: condicionales que devuelven tipos inconsistentes\r\n\r\nEn muchos lenguajes, un `if/else` puede devolver cualquier cosa sin consistencia. Esto crea bugs silenciosos:"
        },
        {
          "type": "code",
          "language": "javascript",
          "code": "// JavaScript - tipos inconsistentes, bugs silenciosos\r\n// JavaScript - inconsistent types, silent bugs\r\nfunction get_status(score) {\r\n    if (score >= 90) return \"Excellent\";\r\n    if (score >= 70) return \"Good\";\r\n    if (score >= 50) return true;   // Oops! Returned a boolean\r\n    // Forgot the else! Returns undefined\r\n}\r\n\r\nlet status = get_status(30);\r\nconsole.log(status.toUpperCase()); // TypeError: Cannot read property of undefined",
          "runnable": false
        },
        {
          "type": "text",
          "body": "En Rust, `if/else` es una **expresión**, y el compilador exige que todas las ramas devuelvan el **mismo tipo**. Además, te obliga a manejar todos los casos posibles:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let score = 85;\r\n    let status = if score >= 90 {\r\n        \"Excelente\"\r\n    } else if score >= 70 {\r\n        \"Bien\"\r\n    } else if score >= 50 {\r\n        true  // ERROR! No puedes mezclar &str y bool\r\n    } else {\r\n        \"Insuficiente\"\r\n    };\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0308]: `if` and `else` have incompatible types\r\n --> src/main.rs:7:9\r\n  |\r\n3 |     let status = if score >= 90 {\r\n  |                  -------------- `if` and `else` have incompatible types\r\n...\r\n7 |         true\r\n  |         ^^^^ expected `&str`, found `bool`\r\n```\r\nRust garantiza que no importa que rama se ejecute, siempre obtendras el mismo tipo de dato."
        },
        {
          "type": "text",
          "body": "## ¿Por qué Rust hace esto?\r\n\r\nPorque `if/else` es una **expresión** que produce un valor. Si las ramas devolvieran tipos diferentes, el compilador no sabria que tipo tiene la variable `status`. Esto elimina toda una clase de errores de tipo en tiempo de ejecución."
        },
        {
          "type": "text",
          "body": "## if/else como expresión\r\n\r\nA diferencia de la mayoria de lenguajes, `if/else` en Rust **devuelve un valor**. Esto hace el código más conciso y elegante:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let temperatura = 22;\r\n\r\n    // if/else como expresion: asigna directamente a una variable\r\n    let estado = if temperatura > 30 {\r\n        \"hace calor\"\r\n    } else if temperatura > 15 {\r\n        \"esta agradable\"\r\n    } else {\r\n        \"hace frio\"\r\n    };  // Nota el punto y coma: termina el let\r\n\r\n    println!(\"Con {}C grados, {}\", temperatura, estado);\r\n\r\n    // Comparacion con otros lenguajes:\r\n    // En C/Java/JS necesitarias un operador ternario o un switch\r\n    // En Rust, if/else ES el operador ternario\r\n\r\n    let edad = 20;\r\n    let categoria = if edad < 13 {\r\n        \"nino\"\r\n    } else if edad < 18 {\r\n        \"adolescente\"\r\n    } else {\r\n        \"adulto\"\r\n    };\r\n    println!(\"Con {} anos eres {}\", edad, categoria);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Bucles: loop, while, for\r\n\r\nRust tiene tres formas de crear bucles:\r\n\r\n### `loop`: bucle infinito (hasta que uses `break`)"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // loop tambien es una expresion!\r\n    let mut contador = 0;\r\n    let resultado = loop {\r\n        contador += 1;\r\n        if contador == 10 {\r\n            break contador * 2;  // break puede devolver un valor!\r\n        }\r\n    };\r\n    println!(\"Resultado del loop: {}\", resultado);  // 20\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### `while`: bucle con condición"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let mut numero = 3;\r\n    while numero != 0 {\r\n        println!(\"{}!\", numero);\r\n        numero -= 1;\r\n    }\r\n    println!(\"Despegue!\");\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### `for`: iteración (la forma preferida en Rust)\r\n\r\nEl bucle `for` es la forma más idiomática y segura de iterar en Rust. Evita errores de índice fuera de rango:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Iterar sobre un array\r\n    let frutas = [\"manzana\", \"banana\", \"naranja\"];\r\n    for fruta in frutas {\r\n        println!(\"Me gusta la {}\", fruta);\r\n    }\r\n\r\n    // Iterar sobre un rango\r\n    for i in 1..=5 {\r\n        println!(\"Numero: {}\", i);\r\n    }\r\n\r\n    // Rango exclusivo (no incluye el final)\r\n    print!(\"Exclusivo (1..5): \");\r\n    for i in 1..5 {\r\n        print!(\"{} \", i);\r\n    }\r\n    println!();\r\n\r\n    // Rango inclusivo (incluye el final)\r\n    print!(\"Inclusivo (1..=5): \");\r\n    for i in 1..=5 {\r\n        print!(\"{} \", i);\r\n    }\r\n    println!();\r\n\r\n    // Iterar con indice usando enumerate\r\n    let colores = [\"rojo\", \"verde\", \"azul\"];\r\n    for (indice, color) in colores.iter().enumerate() {\r\n        println!(\"Color {}: {}\", indice, color);\r\n    }\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## match: el arma secreta de Rust\r\n\r\n`match` es como un `switch` de otros lenguajes, pero mucho más poderoso. La diferencia clave es que `match` **debe ser exhaustivo**: debes manejar *todos* los casos posibles. Si olvidas uno, el compilador te lo dice:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let nota = 8;\r\n    let resultado = match nota {\r\n        9 | 10 => \"Sobresaliente\",\r\n        7 | 8 => \"Notable\",\r\n        5 | 6 => \"Aprobado\",\r\n        // ERROR! No hemos cubierto todos los valores posibles de i32\r\n    };\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0004]: non-exhaustive patterns: `i32::MIN..=4_i32` and `11_i32..=i32::MAX` not covered\r\n --> src/main.rs:3:27\r\n  |\r\n3 |     let resultado = match nota {\r\n  |                           ^^^^ patterns not covered\r\n  = help: ensure that all possible cases are being handled\r\n```\r\nRust te obliga a cubrir todos los casos. Usa `_` como comodin para \"todo lo demas\"."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let nota = 8;\r\n    let resultado = match nota {\r\n        9 | 10 => \"Sobresaliente\",\r\n        7 | 8 => \"Notable\",\r\n        5 | 6 => \"Aprobado\",\r\n        0..=4 => \"Suspenso\",\r\n        _ => \"Nota invalida\",  // _ captura todo lo demas\r\n    };\r\n    println!(\"Nota {}: {}\", nota, resultado);\r\n\r\n    // match con rangos y guardas\r\n    let temperatura: i32 = 25;\r\n    let descripcion = match temperatura {\r\n        t if t < 0 => \"helando\",\r\n        0..=10 => \"muy frio\",\r\n        11..=20 => \"fresco\",\r\n        21..=30 => \"agradable\",\r\n        31..=40 => \"calor\",\r\n        _ => \"extremo\",\r\n    };\r\n    println!(\"{}C: {}\", temperatura, descripcion);\r\n\r\n    // match con tuplas\r\n    let punto = (0, -2);\r\n    let ubicacion = match punto {\r\n        (0, 0) => \"en el origen\",\r\n        (x, 0) if x > 0 => \"en el eje X positivo\",\r\n        (0, y) if y > 0 => \"en el eje Y positivo\",\r\n        (x, 0) if x < 0 => \"en el eje X negativo\",\r\n        (0, y) if y < 0 => \"en el eje Y negativo\",\r\n        _ => \"en algun otro lugar\",\r\n    };\r\n    println!(\"El punto {:?} esta {}\", punto, ubicacion);\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**¿Por qué match debe ser exhaustivo?** Porque `match` es una expresión que produce un valor. Si no cubres todos los casos, habria situaciones donde la variable no tendría valor asignado. Rust elimina ese riesgo obligandote a pensar en cada posibilidad. Esto es especialmente poderoso con enums (que veremos más adelante)."
        },
        {
          "type": "text",
          "body": "## Ejemplo completo: sistema de calificaciones"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn calificar(puntaje: u32) -> &'static str {\r\n    match puntaje {\r\n        90..=100 => \"A - Excelente\",\r\n        80..=89 => \"B - Muy bien\",\r\n        70..=79 => \"C - Bien\",\r\n        60..=69 => \"D - Suficiente\",\r\n        0..=59 => \"F - Reprobado\",\r\n        _ => \"Puntaje invalido\",\r\n    }\r\n}\r\n\r\nfn main() {\r\n    let estudiantes = [\r\n        (\"Ana\", 95),\r\n        (\"Carlos\", 82),\r\n        (\"Lucia\", 73),\r\n        (\"Pedro\", 61),\r\n        (\"Maria\", 45),\r\n    ];\r\n\r\n    println!(\"{:<10} | {:>8} | {}\", \"Nombre\", \"Puntaje\", \"Calificacion\");\r\n    println!(\"{}\", \"-\".repeat(45));\r\n\r\n    for (nombre, puntaje) in estudiantes {\r\n        let calificacion = calificar(puntaje);\r\n        println!(\"{:<10} | {:>8} | {}\", nombre, puntaje, calificacion);\r\n    }\r\n\r\n    // Contar aprobados vs reprobados\r\n    let mut aprobados = 0;\r\n    let mut reprobados = 0;\r\n    for (_, puntaje) in estudiantes {\r\n        if puntaje >= 60 {\r\n            aprobados += 1;\r\n        } else {\r\n            reprobados += 1;\r\n        }\r\n    }\r\n    println!(\"\\nAprobados: {} | Reprobados: {}\", aprobados, reprobados);\r\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "¿Por qué Rust exige ¿qué todas las ramas de un `match` devuelvan el mismo tipo?",
          "options": [
            {
              "text": "Es solo una regla arbitraria del lenguaje",
              "correct": false
            },
            {
              "text": "Porque match es una expresión que produce un valor, y ese valor debe tener un único tipo definido",
              "correct": true
            },
            {
              "text": "Para hacer el código más difícil de escribir",
              "correct": false
            },
            {
              "text": "Porque Rust no soporta tipos genéricos",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Qué pasa si olvidas cubrir un caso en un `match`?",
          "options": [
            {
              "text": "El programa compila pero falla en tiempo de ejecución",
              "correct": false
            },
            {
              "text": "Rust usa un valor por defecto automáticamente",
              "correct": false
            },
            {
              "text": "Error de compilación: non-exhaustive patterns",
              "correct": true
            },
            {
              "text": "El compilador emite un warning pero deja compilar",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "HTTP status code: clasificar respuestas con match",
          "language": "rust",
          "prompt": "Estás construyendo un cliente HTTP. Recibes códigos de estado y necesitas clasificarlos según su categoría (1xx informativo, 2xx éxito, 3xx redirección, 4xx error de cliente, 5xx error de servidor).\n\nEl código actual usa una cadena de `if/else if` que es difícil de leer y propensa a errores.\n\nTu tarea: refactoriza `clasificar_status` para usar `match` con rangos. Aprovecha que `match` es exhaustivo y que `u16` tiene un rango finito. Cuando el código no es válido HTTP (>599), devuelve `\"código desconocido\"`.",
          "starterCode": "fn clasificar_status(code: u16) -> &'static str {\n    if code >= 100 && code < 200 {\n        \"informativo\"\n    } else if code >= 200 && code < 300 {\n        \"éxito\"\n    } else if code >= 300 && code < 400 {\n        \"redirección\"\n    } else if code >= 400 && code < 500 {\n        \"error de cliente\"\n    } else if code >= 500 && code < 600 {\n        \"error de servidor\"\n    } else {\n        \"código desconocido\"\n    }\n}\n\nfn main() {\n    for code in [200, 301, 404, 500, 700] {\n        println!(\"{}: {}\", code, clasificar_status(code));\n    }\n}",
          "solution": "fn clasificar_status(code: u16) -> &'static str {\n    match code {\n        100..=199 => \"informativo\",\n        200..=299 => \"éxito\",\n        300..=399 => \"redirección\",\n        400..=499 => \"error de cliente\",\n        500..=599 => \"error de servidor\",\n        _ => \"código desconocido\",\n    }\n}\n\nfn main() {\n    for code in [200, 301, 404, 500, 700] {\n        println!(\"{}: {}\", code, clasificar_status(code));\n    }\n}",
          "hints": [
            "Rust soporta rangos inclusivos en patrones de match: `100..=199` significa 'del 100 al 199, incluido el 199'.",
            "El comodín `_ =>` captura todo lo que no coincide con los patrones anteriores. Es obligatorio si no cubres todos los valores posibles del tipo.",
            "Ordenar los brazos del match de menor a mayor mejora legibilidad — aunque match no es 'caída' como switch en C, el orden importa para humanos."
          ],
          "explanation": "**Comparación directa:**\n\n| if/else encadenado | match con rangos |\n|---|---|\n| Repites la variable `code` cada vez | Una sola aparición arriba |\n| Necesitas escribir ambos límites (`>=` y `<`) | Sintaxis declarativa: `100..=199` |\n| Fácil cometer off-by-one (¿`<200` o `<=199`?) | El rango es literalmente lo que dice |\n| El compilador no te avisa si olvidas un caso (necesitas `else` final) | El compilador exige exhaustividad (debes terminar con `_`) |\n\n**Patrón a recordar:** cuando veas `if/else if` con la misma variable y rangos, casi siempre `match` es más limpio. Es la herramienta más usada en Rust idiomático junto con `if let` y `?`."
        }
      ]
    }
  ]
}

export default module

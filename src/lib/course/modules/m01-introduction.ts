import type { Module } from '../types'

const module: Module = {
  "id": "m01",
  "slug": "m01_introduction",
  "order": 1,
  "version": 1,
  "icon": "🚀",
  "title": "Introducción a Rust",
  "description": "Descubre qué es Rust, por qué es especial y prepara tu entorno de desarrollo.",
  "lessons": [
    {
      "id": "m01_l01",
      "moduleId": "m01",
      "moduleSlug": "m01_introduction",
      "order": 1,
      "title": "¿Qué es Rust?",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Antes de hablar de Rust: ¿qué problema intenta resolver?",
          "problem": "Un programa no es magia: recibe datos, los guarda en memoria, toma decisiones y produce una salida. El problema aparece cuando queremos que haga eso muy rápido, sin romper datos, sin usar memoria de más y sin caerse cuando muchas cosas ocurren al mismo tiempo.",
          "mentalModel": "Piensa en Rust como un profesor estricto antes de subir a un avión: revisa tu equipaje antes de despegar. Otros lenguajes dejan que el programa salga y descubra errores durante el vuelo. Rust intenta detectar muchos errores antes de ejecutar.",
          "concreteExample": "Si una app guarda el nombre de miles de usuarios, cada nombre vive en memoria. Alguien debe decidir cuándo esa memoria deja de usarse. Si nadie la libera, la app consume cada vez más RAM. Si se libera demasiado pronto, el programa intenta leer basura. Rust existe para hacer esa administración predecible.",
          "remember": "Rust no es sólo “otro lenguaje”. Es una forma de obligarte a entender quién posee cada dato y cuánto tiempo puede vivir."
        },
        {
          "type": "faded-exercise",
          "conceptId": "m01-greet",
          "title": "Tu primer código en Rust",
          "intro": "Sí, ya puedes correr Rust aquí mismo, sin instalar nada. Empecemos suave: una función que devuelve un texto. Observa, completa y hazlo solo.",
          "stages": [
            {
              "kind": "worked",
              "instructions": "**Paso 1 — observa.** Esta función devuelve un texto (`String`). `String::from(\"...\")` convierte un texto fijo en un `String` que la función entrega.",
              "code": "fn bienvenida() -> String {\n    String::from(\"¡Bienvenido!\")\n}"
            },
            {
              "kind": "faded",
              "instructions": "**Paso 2 — completa.** A `saludo` le falta una parte. Reemplaza `___` para crear el `String`.",
              "code": "fn saludo() -> String {\n    String::___(\"Hola, Rust!\")\n}"
            },
            {
              "kind": "solo",
              "instructions": "**Paso 3 — tú solo.** Escribe `saludo` para que devuelva exactamente `Hola, Rust!`.",
              "code": "fn saludo() -> String {\n    // tu código aquí\n}"
            }
          ],
          "tests": "fn main() {\n    assert_eq!(saludo(), \"Hola, Rust!\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn saludo() -> String {\n    String::from(\"Hola, Rust!\")\n}"
        },
        {
          "type": "text",
          "body": "Rust es un lenguaje de programación de sistemas creado por Mozilla Research. Su primera versión estable (1.0) fue lanzada en mayo de 2015. Rust se ha convertido en uno de los lenguajes más queridos por los desarrolladores, ocupando el primer lugar en la encuesta de Stack Overflow como \"lenguaje más amado\" durante varios años consecutivos.\r\n\r\nRust combina el rendimiento de lenguajes como C y C++ con garantías de seguridad de memoria sin necesitar un recolector de basura (garbage collector). Esto lo hace ideal para sistemas operativos, motores de juegos, navegadores web y cualquier software donde el rendimiento y la seguridad son críticos."
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "💡 ¿Sabías ¿qué? Firefox, el navegador de Mozilla, tiene componentes escritos en Rust. También Discord, Dropbox, Cloudflare y Amazon usan Rust en producción."
        },
        {
          "type": "text",
          "body": "## Las tres promesas de Rust\r\n\r\n1. **Seguridad de memoria**: El compilador de Rust previene errores como null pointers, buffer overflows y data races en tiempo de compilación.\r\n\r\n2. **Rendimiento**: Rust no tiene garbage collector ni runtime pesado. Se compila directamente a código máquina, igual que C/C++.\r\n\r\n3. **Concurrencia sin miedo**: El sistema de tipos de Rust previene condiciones de carrera (data races) en tiempo de compilación, haciendo la programación concurrente más segura."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    println!(\"¡Bienvenido a Rust! 🦀\");\r\n    println!(\"Welcome to Rust! 🦀\");\r\n\r\n    // Rust es fuertemente tipado\r\n    let nombre = \"Rustacean\";\r\n    let año = 2015;\r\n\r\n    println!(\"{} existe desde {}\", nombre, año);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "En el ejemplo anterior puedes ver la sintaxis básica de Rust. La función `main()` es el punto de entrada del programa. `println!` es una macro (nota el `!`) que imprime texto en la consola. Las variables se declaran con `let` y Rust infiere el tipo automáticamente."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la principal ventaja de Rust sobre otros lenguajes de sistemas?",
          "options": [
            {
              "text": "Seguridad de memoria sin garbage collector",
              "correct": true
            },
            {
              "text": "Es el lenguaje más rápido del mundo",
              "correct": false
            },
            {
              "text": "Tiene la sintaxis más simple",
              "correct": false
            },
            {
              "text": "No necesita compilación",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m01_l02",
      "moduleId": "m01",
      "moduleSlug": "m01_introduction",
      "order": 2,
      "title": "Instalación y configuración",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Instalar Rust: ¿por qué hace falta una herramienta y no sólo un archivo?",
          "problem": "Un computador no entiende Rust directamente. Entiende instrucciones de máquina. Para llegar desde tu texto hasta un programa real necesitas varias piezas: compilador, gestor de paquetes, documentación y herramientas de formato.",
          "mentalModel": "Instalar Rust es como montar una cocina antes de cocinar: necesitas cuchillo, tabla, horno y recetas. `rustc` compila, `cargo` organiza el proyecto, descarga dependencias y ejecuta tareas repetidas.",
          "concreteExample": "Cuando escribes `cargo run`, Cargo mira tu proyecto, revisa dependencias, llama al compilador y luego ejecuta el binario. No está “interpretando” Rust línea por línea; está construyendo un programa real para tu máquina.",
          "remember": "No memorices comandos sueltos. Entiende el flujo: código fuente -> compilación -> binario -> ejecución."
        },
        {
          "type": "text",
          "body": "## Instalando Rust con rustup\r\n\r\nLa forma recomendada de instalar Rust es a través de **rustup**, el instalador oficial y gestor de versiones de Rust. rustup se encarga de instalar el compilador (`rustc`), el gestor de paquetes (`cargo`) y la documentación estándar.\r\n\r\n### En Linux y macOS\r\n\r\nAbre una terminal y ejecuta:\r\n\r\n```bash\r\ncurl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh\r\n```\r\n\r\n### En Windows\r\n\r\nDescarga y ejecuta el instalador desde [rustup.rs](https://rustup.rs). También necesitarás instalar las herramientas de compilación de C++ de Visual Studio (Visual Studio Build Tools)."
        },
        {
          "type": "callout",
          "variant": "warning",
          "body": "⚠️ En Windows, asegúrate de instalar Visual Studio Build Tools con el componente 'Desarrollo de escritorio con C++'. Sin esto, Rust no podrá compilar programas."
        },
        {
          "type": "text",
          "body": "## Verificando la instalación\r\n\r\nUna vez completada la instalación, abre una nueva terminal y ejecuta estos comandos para verificar que todo funciona correctamente:\r\n\r\n```bash\r\nrustc --versión\r\ncargo --versión\r\nrustup --versión\r\n```\r\n\r\nDeberías ver las versiones instaladas de cada herramienta. Si ves algo como `rustc 1.XX.X`, la instalación fue exitosa."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Si puedes ejecutar esto, tu entorno está listo\r\n    // If you can run this, your environment is ready\r\n    println!(\"✅ Rust está instalado correctamente\");\r\n    println!(\"✅ Rust is installed correctly\");\r\n\r\n    // Veamos información sobre la versión\r\n    println!(\"Compilado con Rust edition 2021\");\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Configurando tu editor: VS Code + rust-analyzer\r\n\r\nEl editor más popular para desarrollar en Rust es **Visual Studio Code** (VS Code) con la extensión **rust-analyzer**. Esta combinación te ofrece:\r\n\r\n- **Autocompletado** inteligente de código\r\n- **Diagnósticos en tiempo real** (errores y advertencias sin compilar)\r\n- **Información de tipos** al pasar el cursor\r\n- **Formateo automático** del código\r\n- **Refactoring** y navegación de código\r\n\r\n### Pasos para configurar VS Code:\r\n\r\n1. Descarga e instala [VS Code](https://code.visualstudio.com)\r\n2. Abre VS Code y ve a la pestaña de extensiones (Ctrl+Shift+X)\r\n3. Busca **rust-analyzer** e instálala\r\n4. Opcional: instala la extensión **Even Better TOML** para editar archivos de configuración\r\n5. Opcional: instala la extensión **CodeLLDB** para depuración (debugging)"
        },
        {
          "type": "text",
          "body": "## Creando tu primer proyecto con Cargo\r\n\r\n**Cargo** es el gestor de paquetes y sistema de compilación de Rust. Es como npm para JavaScript o pip para Python, pero también compila tu código. Para crear un nuevo proyecto:\r\n\r\n```bash\r\ncargo new mi_proyecto\r\ncd mi_proyecto\r\n```\r\n\r\nEsto crea la siguiente estructura:\r\n\r\n```\r\nmi_proyecto/\r\n├── Cargo.toml\r\n└── src/\r\n    └── main.rs\r\n```\r\n\r\nEl archivo `Cargo.toml` es el manifiesto del proyecto. Contiene metadatos y dependencias:\r\n\r\n```toml\r\n[package]\r\nname = \"mi_proyecto\"\r\nversión = \"0.1.0\"\r\nedition = \"2021\"\r\n\r\n[dependencies]\r\n```\r\n\r\n- **name**: el nombre de tu proyecto\r\n- **versión**: la versión actual siguiendo semántica de versiones (semver)\r\n- **edition**: la edición de Rust que usas (2015, 2018, 2021, o 2024)\r\n- **[dependencies]**: aquí se listan las bibliotecas (crates) que usa tu proyecto"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "// Este es el archivo main.rs que Cargo genera automáticamente\r\n// This is the main.rs file that Cargo generates automatically\r\nfn main() {\r\n    println!(\"Hello, world!\");\r\n\r\n    // Comandos útiles de Cargo:\r\n    // cargo build    -> Compila el proyecto\r\n    // cargo run      -> Compila y ejecuta\r\n    // cargo check    -> Verifica errores sin compilar (más rápido)\r\n    // cargo test     -> Ejecuta las pruebas\r\n    // cargo doc      -> Genera documentación\r\n\r\n    println!(\"Usa 'cargo run' para ejecutar tu proyecto\");\r\n    println!(\"Use 'cargo run' to execute your project\");\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "🚀 Consejo: Usa `cargo check` en lugar de `cargo build` durante el desarrollo. Es mucho más rápido porque solo verifica errores sin generar el ejecutable final."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la herramienta oficial para instalar y gestionar versiones de Rust?",
          "options": [
            {
              "text": "rustup",
              "correct": true
            },
            {
              "text": "cargo",
              "correct": false
            },
            {
              "text": "rustc",
              "correct": false
            },
            {
              "text": "npm",
              "correct": false
            }
          ]
        }
      ]
    },
    {
      "id": "m01_l03",
      "moduleId": "m01",
      "moduleSlug": "m01_introduction",
      "order": 3,
      "title": "¡Hola, Mundo!",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Hola Mundo: el programa más pequeño que enseña casi todo",
          "problem": "Todo programa necesita un punto de entrada: un lugar donde la computadora empiece a ejecutar instrucciones. Sin ese punto, el sistema no sabe por dónde arrancar.",
          "mentalModel": "`main` es la puerta principal de una casa. Puedes tener muchas habitaciones, pero cuando alguien llega necesita una entrada clara. `println!` es una macro que genera código para escribir texto en la salida.",
          "concreteExample": "Cuando `println!(\"Hola\")` se ejecuta, Rust prepara el texto, llama a funciones del sistema operativo y ese texto termina en la terminal. Incluso algo simple atraviesa varias capas: tu código, la biblioteca estándar, el sistema operativo y la pantalla.",
          "remember": "El primer objetivo no es escribir mucho código, sino entender que cada línea se convierte en trabajo real para la máquina."
        },
        {
          "type": "faded-exercise",
          "conceptId": "m01-format",
          "title": "Práctica guiada: saludar con un nombre",
          "intro": "`println!` y `format!` pueden insertar valores dentro de un texto usando `{}`. Practiquémoslo construyendo un saludo personalizado.",
          "stages": [
            {
              "kind": "worked",
              "instructions": "**Paso 1 — observa.** `format!` arma un `String` reemplazando cada `{}` por el valor que le pasas, en orden. Aquí el `{}` se vuelve el nombre.",
              "code": "fn despedida(nombre: &str) -> String {\n    format!(\"Adiós, {}!\", nombre)\n}"
            },
            {
              "kind": "faded",
              "instructions": "**Paso 2 — completa.** A `saludar` le falta el hueco donde va el nombre. Reemplaza `___` por `{}`.",
              "code": "fn saludar(nombre: &str) -> String {\n    format!(\"Hola, ___!\", nombre)\n}"
            },
            {
              "kind": "solo",
              "instructions": "**Paso 3 — tú solo.** Escribe `saludar` para que `saludar(\"Ana\")` devuelva `Hola, Ana!`.",
              "code": "fn saludar(nombre: &str) -> String {\n    // tu código aquí\n}"
            }
          ],
          "tests": "fn main() {\n    assert_eq!(saludar(\"Ana\"), \"Hola, Ana!\");\n    assert_eq!(saludar(\"Ferris\"), \"Hola, Ferris!\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn saludar(nombre: &str) -> String {\n    format!(\"Hola, {}!\", nombre)\n}"
        },
        {
          "type": "text",
          "body": "## Tu primer programa en Rust\r\n\r\nEl programa \"Hello, World!\" es una tradición en programación: es el primer programa que escribes al aprender un nuevo lenguaje. En Rust, es muy sencillo:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    println!(\"Hello, World!\");\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Desglose del código\r\n\r\nAnalicemos cada parte de este pequeño programa:\r\n\r\n### `fn main()`\r\n- `fn` es la palabra clave para declarar una **función** (function).\r\n- `main` es el nombre de una función especial: es el **punto de entrada** de todo programa Rust. Cuando ejecutas un programa, Rust busca la función `main` y empieza a ejecutar desde ahí.\r\n- `()` indica que la función no recibe **parámetros** (argumentos).\r\n- `{` y `}` delimitan el **cuerpo** de la función, es decir, el código que se ejecuta.\r\n\r\n### `println!(\"Hello, World!\");`\r\n- `println!` es una **macro** de Rust (no una función). El signo `!` al final indica que es una macro.\r\n- `\"Hello, World!\"` es un **string literal** (cadena de texto) que se pasa como argumento.\r\n- El `;` al final indica el **fin de la sentencia**. En Rust, casi todas las líneas terminan con punto y coma."
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "💡 **Macros vs Funciones**: En Rust, las macros se distinguen de las funciones por el `!` al final del nombre. Las macros son más poderosas que las funciones porque pueden recibir un número variable de argumentos y generan código en tiempo de compilación. `println!` es una macro porque necesita analizar el string de formato en tiempo de compilación para verificar que los tipos coinciden."
        },
        {
          "type": "text",
          "body": "## Formateo de strings con `println!`\r\n\r\nUna de las características más útiles de `println!` es su capacidad de **formateo**. Puedes insertar valores dentro del texto usando llaves `{}` como marcadores de posición:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Formato básico con {}\r\n    let nombre = \"Ana\";\r\n    let edad = 25;\r\n    println!(\"Me llamo {} y tengo {} años\", nombre, edad);\r\n\r\n    // Formato con posición\r\n    println!(\"{0} tiene {1} años. {0} programa en Rust.\", nombre, edad);\r\n\r\n    // Formato con nombres\r\n    println!(\"{nombre} es programadora\", nombre = \"María\");\r\n\r\n    // Formato de depuración con {:?}\r\n    let numeros = [1, 2, 3, 4, 5];\r\n    println!(\"Array: {:?}\", numeros);\r\n\r\n    // Formato con padding y alineación\r\n    println!(\"{:<10} | {:>10}\", \"Izquierda\", \"Derecha\");\r\n    println!(\"{:*^20}\", \"Centro\");\r\n\r\n    // Formato numérico\r\n    let pi = 3.14159;\r\n    println!(\"Pi con 2 decimales: {:.2}\", pi);\r\n    println!(\"En hexadecimal: {:x}\", 255);\r\n    println!(\"En binario: {:b}\", 10);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Las macros de impresión\r\n\r\nRust ofrece varias macros para imprimir texto. Cada una tiene un uso específico:\r\n\r\n| Macro | Descripción | Salida |\r\n|-------|-------------|--------|\r\n| `print!` | Imprime sin salto de línea | stdout |\r\n| `println!` | Imprime con salto de línea | stdout |\r\n| `eprint!` | Imprime error sin salto de línea | stderr |\r\n| `eprintln!` | Imprime error con salto de línea | stderr |\r\n\r\nLa diferencia entre `stdout` y `stderr` es importante: `stdout` es la salida estándar para datos normales, mientras que `stderr` es la salida de error para mensajes de diagnóstico. Esto permite redirigir cada flujo de forma independiente en la terminal."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // print! no añade salto de línea\r\n    print!(\"Hola \");\r\n    print!(\"Mundo \");\r\n    println!(\"(ahora sí hay salto de línea)\");\r\n\r\n    // println! añade un salto de línea al final\r\n    println!(\"Primera línea\");\r\n    println!(\"Segunda línea\");\r\n\r\n    // eprintln! escribe en stderr (salida de error)\r\n    eprintln!(\"⚠️ Esto es un mensaje de error\");\r\n\r\n    // Ejemplo práctico: mostrar un recibo\r\n    println!(\"╔══════════════════════════╗\");\r\n    println!(\"║     RECIBO DE COMPRA     ║\");\r\n    println!(\"╠══════════════════════════╣\");\r\n    println!(\"║ Manzanas x3    $  {:>5.2} ║\", 2.50);\r\n    println!(\"║ Pan             $  {:>5.2} ║\", 1.75);\r\n    println!(\"║ Leche           $  {:>5.2} ║\", 3.20);\r\n    println!(\"╠══════════════════════════╣\");\r\n    println!(\"║ TOTAL           $  {:>5.2} ║\", 2.50 + 1.75 + 3.20);\r\n    println!(\"╚══════════════════════════╝\");\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "🔑 Recuerda: cuando veas `!` después del nombre, es una **macro**, no una función. Las funciones normales en Rust nunca llevan `!`. Esto es una pregunta común en entrevistas y exámenes sobre Rust."
        },
        {
          "type": "quiz",
          "question": "¿Por qué `println!` tiene un signo de exclamación `!` al final?",
          "options": [
            {
              "text": "Porque es una macro, no una función",
              "correct": true
            },
            {
              "text": "Porque indica que puede fallar",
              "correct": false
            },
            {
              "text": "Es solo una convención de estilo",
              "correct": false
            },
            {
              "text": "Porque imprime con énfasis",
              "correct": false
            }
          ]
        }
      ]
    }
  ]
}

export default module

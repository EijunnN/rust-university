import type { Module } from '../types'

const module: Module = {
  "id": "m05",
  "slug": "m05_collections_errors",
  "order": 5,
  "version": 1,
  "icon": "📚",
  "title": "Colecciones y Strings",
  "description": "Domina Vec, String y HashMap: las colecciones fundamentales de Rust. Aprende closures e iteradores.",
  "lessons": [
    {
      "id": "m05_l01",
      "moduleId": "m05",
      "moduleSlug": "m05_collections_errors",
      "order": 1,
      "title": "Vectores (Vec)",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Vec: cuando necesitas muchos valores del mismo tipo",
          "problem": "No siempre sabes cuántos datos tendrás. Una app puede recibir 3 mensajes o 30.000. Necesitas una colección que pueda crecer.",
          "mentalModel": "Un `Vec` es una fila ordenada en memoria. Puede crecer, pero crecer a veces implica reservar una zona más grande y mover los elementos.",
          "concreteExample": "Una lista de tareas es un `Vec<Tarea>` natural: importa el orden, puedes agregar tareas y recorrerlas una por una.",
          "remember": "Un `Vec` es simple por fuera, pero por dentro administra memoria dinámica. Ownership sigue importando."
        },
        {
          "type": "challenge",
          "conceptId": "m05-vec-sum",
          "title": "Antes de leer: suma una lista entera",
          "prompt": "**Tu reto:** escribe `suma(v: &[i32]) -> i32` que devuelva la suma de todos los elementos de la lista. Una lista vacía suma 0.\n\nRecibes la lista como `&[i32]` (una vista prestada). Inténtalo y dale a Verificar.",
          "starterCode": "fn suma(v: &[i32]) -> i32 {\n    // recorre la lista y acumula\n    \n}",
          "tests": "fn main() {\n    assert_eq!(suma(&[1, 2, 3]), 6);\n    assert_eq!(suma(&[10, -5, 5]), 10);\n    assert_eq!(suma(&[]), 0);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn suma(v: &[i32]) -> i32 {\n    v.iter().sum()\n}",
          "reveal": "Un `Vec` (o un slice `&[i32]`) se recorre con `.iter()`, y muchas operaciones comunes ya vienen listas. Sumar es una de ellas:\n\n```rust\nfn suma(v: &[i32]) -> i32 {\n    v.iter().sum()\n}\n```\n\nTambién podrías hacerlo con un bucle `for` y un acumulador `mut` — funciona igual. Pero `.iter().sum()` comunica la intención de un vistazo. En esta lección verás cómo crear, llenar y recorrer `Vec`, y por qué el ownership sigue importando dentro de ellos. 👇"
        },
        {
          "type": "text",
          "body": "## El Problema: arrays de tamaño fijo\r\n\r\nLos arrays en Rust tienen un tamaño fijo conocido en compilación. Pero en la vida real, a menudo no sabes cuantos elementos tendras: una lista de usuarios, resultados de busqueda, líneas de un archivo..."
        },
        {
          "type": "text",
          "body": "## La solución: Vec<T>\r\n\r\n`Vec<T>` (vector) es una coleccion que puede **crecer y encogerse** en tiempo de ejecución. Es la estructura de datos más usada en Rust. Almacena sus elementos en el heap, contiguos en memoria:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Crear vectores\r\n    let mut numeros: Vec<i32> = Vec::new();  // Vacio, tipo explicito\r\n    let colores = vec![\"rojo\", \"verde\", \"azul\"];  // Macro vec! con valores\r\n\r\n    // Agregar elementos\r\n    numeros.push(10);\r\n    numeros.push(20);\r\n    numeros.push(30);\r\n    println!(\"Numeros: {:?}\", numeros);\r\n    println!(\"Colores: {:?}\", colores);\r\n\r\n    // Acceso por indice (puede provocar panic si el indice no existe)\r\n    println!(\"Primer numero: {}\", numeros[0]);\r\n    println!(\"Ultimo color: {}\", colores[2]);\r\n\r\n    // Acceso seguro con .get() -> retorna Option<&T>\r\n    match numeros.get(5) {\r\n        Some(valor) => println!(\"Indice 5: {}\", valor),\r\n        None => println!(\"Indice 5 no existe\"),\r\n    }\r\n\r\n    // Longitud y capacidad\r\n    println!(\"Longitud: {}, Capacidad: {}\", numeros.len(), numeros.capacity());\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Modificar vectores"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let mut frutas = vec![\r\n        String::from(\"manzana\"),\r\n        String::from(\"banana\"),\r\n        String::from(\"cereza\"),\r\n    ];\r\n    println!(\"Original: {:?}\", frutas);\r\n\r\n    // Agregar al final\r\n    frutas.push(String::from(\"durazno\"));\r\n\r\n    // Eliminar el ultimo\r\n    let ultima = frutas.pop();  // Devuelve Option<T>\r\n    println!(\"Eliminada: {:?}\", ultima);\r\n\r\n    // Insertar en posicion\r\n    frutas.insert(1, String::from(\"arandano\"));\r\n    println!(\"Con arandano: {:?}\", frutas);\r\n\r\n    // Eliminar en posicion\r\n    frutas.remove(0);\r\n    println!(\"Sin primera: {:?}\", frutas);\r\n\r\n    // Verificar si contiene\r\n    println!(\"Tiene banana? {}\", frutas.contains(&String::from(\"banana\")));\r\n\r\n    // Longitud\r\n    println!(\"Total: {} frutas\", frutas.len());\r\n    println!(\"Esta vacio? {}\", frutas.is_empty());\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Iterar sobre vectores\r\n\r\nHay varias formas de iterar, y la eleccion afecta el ownership:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5];\r\n\r\n    // Referencia inmutable: el vector sigue siendo accesible despues\r\n    print!(\"Lectura: \");\r\n    for n in &numeros {\r\n        print!(\"{} \", n);\r\n    }\r\n    println!();\r\n    println!(\"Vector intacto: {:?}\", numeros);\r\n\r\n    // Referencia mutable: puedes modificar los elementos\r\n    let mut datos = vec![1, 2, 3, 4, 5];\r\n    for n in &mut datos {\r\n        *n *= 10;  // Multiplica cada elemento por 10\r\n    }\r\n    println!(\"Multiplicados: {:?}\", datos);\r\n\r\n    // Consumir: el vector se mueve y ya no es accesible\r\n    let nombres = vec![\"Ana\", \"Luis\", \"Maria\"];\r\n    for nombre in nombres {\r\n        // nombres ya no es accesible despues de este loop\r\n        print!(\"{} \", nombre);\r\n    }\r\n    println!();\r\n    // println!(\"{:?}\", nombres);  // ERROR: nombres fue movido\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Regla para iterar vectores:**\r\n- `for x in &vec` — solo leer. El vector sigue disponible.\r\n- `for x in &mut vec` — leer y modificar. Necesitas `*x` para acceder al valor.\r\n- `for x in vec` — consumir. El vector se mueve al loop y ya no existe después."
        },
        {
          "type": "text",
          "body": "## Ejemplo práctico: estadísticas\r\n\r\nEl siguiente ejemplo combina varias operaciones útiles: `.iter().sum()` para sumar todo, `.to_vec()` para copiar el slice, `.sort_by()` para ordenar, y `.iter().filter(...).collect()` para filtrar. Es deliberadamente denso para que veas cómo encajan — lo importante por ahora es entender **qué hace cada línea**, no memorizar la firma de cada método."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn estadisticas(datos: &[f64]) -> (f64, f64, f64) {\r\n    let n = datos.len() as f64;\r\n    let suma: f64 = datos.iter().sum();\r\n    let promedio = suma / n;\r\n\r\n    let mut ordenados = datos.to_vec();\r\n    ordenados.sort_by(|a, b| a.partial_cmp(b).unwrap());\r\n\r\n    let min = ordenados[0];\r\n    let max = ordenados[ordenados.len() - 1];\r\n\r\n    (promedio, min, max)\r\n}\r\n\r\nfn main() {\r\n    let temperaturas = vec![22.5, 18.0, 25.3, 19.8, 28.1, 15.5, 23.7];\r\n\r\n    println!(\"Temperaturas: {:?}\", temperaturas);\r\n\r\n    let (prom, min, max) = estadisticas(&temperaturas);\r\n    println!(\"Promedio: {:.1}C\", prom);\r\n    println!(\"Minima:  {:.1}C\", min);\r\n    println!(\"Maxima:  {:.1}C\", max);\r\n\r\n    // Filtrar: solo las mayores a 20\r\n    let calidas: Vec<&f64> = temperaturas.iter().filter(|&&t| t > 20.0).collect();\r\n    println!(\"Dias calidos (>20C): {:?}\", calidas);\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**¿Qué es el `|&&t|` doblemente referenciado?**\r\n`.iter()` produce `&f64` (referencia a cada elemento). `.filter()` te pasa una **referencia a esa referencia**, o sea `&&f64`. Para usar el valor directamente como `f64`, hacemos *destructuring*:\r\n- `|x|` te da `&&f64` (raro de usar: `if **x > 20.0`)\r\n- `|&t|` te da `&f64` (un nivel desenvuelto)\r\n- `|&&t|` te da `f64` ya copiado, listo para comparar con `> 20.0` ✓\r\n\r\nEste patrón aparece mucho con iteradores sobre `Vec<T>` cuando `T: Copy`. Lo verás más en la lección de iteradores."
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la diferencia principal entre un array `[i32; 5]` y un `Vec<i32>`?",
          "options": [
            {
              "text": "El array es más rápido",
              "correct": false
            },
            {
              "text": "El array tiene tamaño fijo (stack); el Vec puede crecer y encogerse (heap)",
              "correct": true
            },
            {
              "text": "El Vec no puede almacenar tipos primitivos",
              "correct": false
            },
            {
              "text": "No hay diferencia real",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Qué devuelve `vec.get(10)` si el vector tiene solo 3 elementos?",
          "options": [
            {
              "text": "0",
              "correct": false
            },
            {
              "text": "None (es seguro, devuelve Option)",
              "correct": true
            },
            {
              "text": "El programa se detiene con panic",
              "correct": false
            },
            {
              "text": "Un error de compilación",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Procesar respuestas de una API: filtrar y agrupar",
          "language": "rust",
          "prompt": "Recibes una lista de códigos HTTP de respuesta de tu monitor de servicios. Necesitas calcular dos cosas:\n\n1. **Cuántos requests fallaron** (códigos >= 400).\n2. **Una lista solo con los exitosos** (códigos 200-299) **multiplicados por 1** (para devolver `Vec<u16>` propio, no slice).\n\nTu tarea: implementa las dos funciones. Usa métodos de `Vec` y `iter()` — sin `for` manual.\n\nFirmas:\n```rust\nfn count_failures(codes: &[u16]) -> usize\nfn only_success(codes: &[u16]) -> Vec<u16>\n```",
          "starterCode": "fn count_failures(codes: &[u16]) -> usize {\n    // TODO: cuenta cuántos elementos son >= 400\n    todo!()\n}\n\nfn only_success(codes: &[u16]) -> Vec<u16> {\n    // TODO: devuelve un Vec con los códigos 200..=299\n    todo!()\n}\n\nfn main() {\n    let responses = vec![200, 404, 201, 500, 200, 301, 503, 200];\n\n    println!(\"Total:        {}\", responses.len());\n    println!(\"Fallas:       {}\", count_failures(&responses));\n    println!(\"Exitos:       {:?}\", only_success(&responses));\n}",
          "solution": "fn count_failures(codes: &[u16]) -> usize {\n    codes.iter().filter(|&&c| c >= 400).count()\n}\n\nfn only_success(codes: &[u16]) -> Vec<u16> {\n    codes\n        .iter()\n        .filter(|&&c| (200..=299).contains(&c))\n        .copied()\n        .collect()\n}\n\nfn main() {\n    let responses = vec![200, 404, 201, 500, 200, 301, 503, 200];\n\n    println!(\"Total:        {}\", responses.len());\n    println!(\"Fallas:       {}\", count_failures(&responses));\n    println!(\"Exitos:       {:?}\", only_success(&responses));\n}",
          "hints": [
            "`Vec` (y los slices `&[T]`) tienen `.iter()` que produce un iterator de referencias. Los closures reciben `&&u16` por eso aparecen los dos `&&` en `|&&c|` (un truco de pattern matching para 'desreferenciar' los dos niveles).",
            "Para contar: `.filter(...).count()`. Devuelve `usize` que es lo que pide la firma.",
            "Para coleccionar nuevos valores: `.filter(...).copied().collect()`. `.copied()` convierte `&u16` en `u16` (válido porque `u16` es `Copy`). `.collect()` materializa el iterator en `Vec`."
          ],
          "explanation": "**Comparación con otros lenguajes:**\n\n| JS | Python | Rust |\n|---|---|---|\n| `arr.filter(c => c >= 400).length` | `len([c for c in arr if c >= 400])` | `iter.filter(...).count()` |\n| `arr.filter(c => c >= 200 && c < 300)` | `[c for c in arr if 200 <= c < 300]` | `iter.filter(...).copied().collect()` |\n\n**Por qué `.iter()` y no acceso por índice (`vec[i]`):**\n- Los iteradores son **perezosos**: no crean colecciones intermedias. `filter().map().filter()` no genera 3 vectores, solo uno final.\n- El compilador optimiza estas cadenas a algo equivalente a un `for` loop manual (zero-cost abstraction).\n- Imposible salirte del rango con índices fuera (UB en C, panic en Rust).\n\n**Patrón a recordar:** en código Rust idiomático, casi nunca verás `for i in 0..vec.len()`. Verás `iter().filter().map().sum()` — más claro y más rápido."
        }
      ]
    },
    {
      "id": "m05_l02",
      "moduleId": "m05",
      "moduleSlug": "m05_collections_errors",
      "order": 2,
      "title": "Strings a fondo",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Strings: texto no es sólo una lista de letras",
          "problem": "El texto moderno tiene acentos, emojis e idiomas distintos. Una “letra visible” no siempre ocupa un byte ni una posición simple en memoria.",
          "mentalModel": "`String` es texto UTF-8 que puede crecer. `&str` es una vista prestada sobre texto existente.",
          "concreteExample": "La palabra `año` y un emoji no se comportan como ASCII antiguo. Por eso Rust evita que indexes un `String` como si cada carácter ocupara exactamente un byte.",
          "remember": "Rust trata el texto con cuidado porque el texto real del mundo es más complejo que el inglés básico."
        },
        {
          "type": "challenge",
          "conceptId": "m05-string-reverse",
          "title": "Antes de leer: dale la vuelta a un texto",
          "prompt": "**Tu reto:** escribe `invertir(s: &str) -> String` que devuelva el texto al revés. Por ejemplo, `invertir(\"hola\")` devuelve `\"aloh\"`.\n\nPista: un texto se puede recorrer carácter por carácter con `.chars()`. Inténtalo y dale a Verificar.",
          "starterCode": "fn invertir(s: &str) -> String {\n    // recorre los caracteres al revés y reúnelos\n    \n}",
          "tests": "fn main() {\n    assert_eq!(invertir(\"hola\"), \"aloh\");\n    assert_eq!(invertir(\"rust\"), \"tsur\");\n    assert_eq!(invertir(\"\"), \"\");\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn invertir(s: &str) -> String {\n    s.chars().rev().collect()\n}",
          "reveal": "La forma idiomática encadena tres pasos: recorrer caracteres, invertirlos y reunirlos en un `String`:\n\n```rust\nfn invertir(s: &str) -> String {\n    s.chars().rev().collect()\n}\n```\n\n¿Por qué `.chars()` y no recorrer bytes? Porque en Rust un texto es **UTF-8**: una `á` o un `🦀` ocupan varios bytes, pero son **un** carácter. `.chars()` respeta eso; invertir los bytes a mano rompería esos caracteres. Por eso Rust trata el texto con tanto cuidado — algo que verás en esta lección. 👇"
        },
        {
          "type": "text",
          "body": "## ¿Por qué Strings es \"complicado\" en Rust?\r\n\r\nSi vienes de Python, JavaScript o Java, los strings en Rust pueden parecer complicados al principio. La razón es que Rust expone la complejidad real de los strings que otros lenguajes esconden:\r\n\r\n- Los strings son **UTF-8**: un carácter puede ocupar 1, 2, 3, o 4 bytes.\r\n- No puedes acceder por índice (`s[0]`) porque no es O(1) en UTF-8.\r\n- Hay dos tipos: `String` (heap, mutable) y `&str` (slice, inmutable).\r\n\r\nEsta complejidad existe para garantizar que tu programa **nunca** produzca strings corruptos o invalidos."
        },
        {
          "type": "text",
          "body": "## Crear y manipular Strings"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Crear Strings\r\n    let s1 = String::from(\"hola\");\r\n    let s2 = \"mundo\".to_string();  // Otra forma\r\n    let s3 = String::new();        // String vacio\r\n\r\n    // Concatenar\r\n    let mut saludo = String::from(\"Hola\");\r\n    saludo.push_str(\", mundo\");   // Agregar &str\r\n    saludo.push('!');              // Agregar char\r\n    println!(\"{}\", saludo);\r\n\r\n    // format! - la forma mas comoda de concatenar\r\n    let nombre = \"Ferris\";\r\n    let edad = 5;\r\n    let mensaje = format!(\"{} tiene {} anos\", nombre, edad);\r\n    println!(\"{}\", mensaje);\r\n\r\n    // Concatenar con +  (consume el primer String)\r\n    let a = String::from(\"Rust\");\r\n    let b = String::from(\" es genial\");\r\n    let c = a + &b;  // a se mueve, b se presta\r\n    // println!(\"{}\", a);  // ERROR: a fue movido\r\n    println!(\"{}\", c);\r\n    println!(\"{}\", b);  // b sigue valido (fue prestado)\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Consejo: prefiere `format!` para concatenar.**\r\nEl operador `+` mueve el primer String, lo que puede ser confuso. `format!` siempre toma referencias y es más legible:\r\n```rust\r\nlet resultado = format!(\"{} {} {}\", a, b, c);  // Claro y simple\r\n```"
        },
        {
          "type": "text",
          "body": "## UTF-8 y por que no puedes indexar Strings\r\n\r\nUn String en Rust es una secuencia de bytes UTF-8. Caracteres diferentes ocupan diferente cantidad de bytes:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let hola = String::from(\"Hola\");\r\n    let nihao = String::from(\"你好\");       // Chino\r\n    let emoji = String::from(\"🦀🔥\");       // Emojis\r\n\r\n    println!(\"'{}': {} bytes, {} chars\", hola, hola.len(), hola.chars().count());\r\n    println!(\"'{}': {} bytes, {} chars\", nihao, nihao.len(), nihao.chars().count());\r\n    println!(\"'{}': {} bytes, {} chars\", emoji, emoji.len(), emoji.chars().count());\r\n\r\n    // Por eso s[0] no funciona: que deberia devolver?\r\n    // El primer BYTE? El primer CARACTER? El primer GRAFEMA?\r\n    // Rust te obliga a ser explicito:\r\n\r\n    // Iterar por caracteres\r\n    print!(\"Chars de '{}': \", nihao);\r\n    for c in nihao.chars() {\r\n        print!(\"{} \", c);\r\n    }\r\n    println!();\r\n\r\n    // Iterar por bytes\r\n    print!(\"Bytes de 'Hola': \");\r\n    for b in hola.bytes() {\r\n        print!(\"{} \", b);\r\n    }\r\n    println!();\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Métodos útiles de String"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let texto = String::from(\"  Hola, Mundo Rust!  \");\r\n\r\n    // Recortar espacios\r\n    println!(\"trim: '{}'\", texto.trim());\r\n\r\n    // Mayusculas/minusculas\r\n    println!(\"UPPER: {}\", texto.trim().to_uppercase());\r\n    println!(\"lower: {}\", texto.trim().to_lowercase());\r\n\r\n    // Buscar\r\n    println!(\"Contiene 'Rust'? {}\", texto.contains(\"Rust\"));\r\n    println!(\"Empieza con '  H'? {}\", texto.starts_with(\"  H\"));\r\n\r\n    // Reemplazar\r\n    let nuevo = texto.trim().replace(\"Mundo\", \"Planet\");\r\n    println!(\"Reemplazado: {}\", nuevo);\r\n\r\n    // Dividir\r\n    let csv = \"manzana,banana,cereza,durazno\";\r\n    let frutas: Vec<&str> = csv.split(',').collect();\r\n    println!(\"Frutas: {:?}\", frutas);\r\n\r\n    // Repetir\r\n    let linea = \"-\".repeat(30);\r\n    println!(\"{}\", linea);\r\n\r\n    // Verificar si es vacio\r\n    let vacio = String::new();\r\n    println!(\"Esta vacio? {}\", vacio.is_empty());\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Slicing de Strings (con cuidado!)\r\n\r\nPuedes crear slices de un String, pero debes asegurarte de cortar en límites de caracteres válidos:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let saludo = String::from(\"Hola mundo\");\r\n\r\n    // Slicing seguro (caracteres ASCII = 1 byte cada uno)\r\n    let primera = &saludo[0..4];  // \"Hola\"\r\n    let segunda = &saludo[5..];   // \"mundo\"\r\n    println!(\"'{}' y '{}'\", primera, segunda);\r\n\r\n    // Para texto con caracteres multi-byte, usa .chars()\r\n    let japones = \"こんにちは\";\r\n    let primeros_dos: String = japones.chars().take(2).collect();\r\n    println!(\"Primeros 2 chars de '{}': '{}'\", japones, primeros_dos);\r\n\r\n    // Extraer palabras\r\n    let frase = \"Rust es rapido y seguro\";\r\n    let palabras: Vec<&str> = frase.split_whitespace().collect();\r\n    println!(\"Palabras: {:?}\", palabras);\r\n    println!(\"Total: {} palabras\", palabras.len());\r\n}",
          "runnable": true
        },
        {
          "type": "quiz",
          "question": "Por que `\"Hola\"[0]` no funciona en Rust?",
          "options": [
            {
              "text": "Porque Rust no tiene strings",
              "correct": false
            },
            {
              "text": "Porque UTF-8 tiene caracteres de tamaño variable y el índice de bytes no corresponde al índice de caracteres",
              "correct": true
            },
            {
              "text": "Porque los strings son inmutables",
              "correct": false
            },
            {
              "text": "Es un bug que se arreglara",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Cuál es la diferencia entre `String` y `&str`?",
          "options": [
            {
              "text": "String es para texto largo, &str para texto corto",
              "correct": false
            },
            {
              "text": "String es owned (heap, puede crecer); &str es una referencia/slice (puede ser de String o literal)",
              "correct": true
            },
            {
              "text": "No hay diferencia, son sinonimos",
              "correct": false
            },
            {
              "text": "&str es más rápido que String",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Validador básico de email",
          "language": "rust",
          "prompt": "Estás construyendo un validador simple de email. No necesitas regex completo: con los métodos de `&str` cubres la mayoría de casos prácticos.\n\nTu tarea: implementa `is_valid_email` que devuelva `true` solo si **todas** estas reglas se cumplen:\n\n1. Contiene **exactamente un** `@` (`str::matches('@').count() == 1`).\n2. Tiene al menos un carácter antes del `@`.\n3. Tiene al menos un `.` después del `@`.\n4. No empieza ni termina con espacio (`str::trim` cambia el string; aquí queremos detectarlo).\n5. Es todo lowercase (normalizamos al validar — la entrada debe venir ya en minúsculas).",
          "starterCode": "fn is_valid_email(input: &str) -> bool {\n    // TODO\n    todo!()\n}\n\nfn main() {\n    let cases = [\n        \"ana@gmail.com\",          // ok\n        \"juan@empresa.co\",        // ok\n        \"sin-arroba\",             // no @\n        \"ana@@dos.com\",           // dos @\n        \"@sin-local.com\",         // nada antes\n        \"ana@dominio\",            // sin .\n        \" ana@gmail.com\",         // espacio inicial\n        \"Ana@gmail.com\",          // mayúscula\n    ];\n\n    for c in cases {\n        println!(\"{:30} → {}\", format!(\"'{}'\", c), is_valid_email(c));\n    }\n}",
          "solution": "fn is_valid_email(input: &str) -> bool {\n    // No espacios al inicio o final\n    if input.trim() != input {\n        return false;\n    }\n    // Todo lowercase\n    if input.chars().any(|c| c.is_uppercase()) {\n        return false;\n    }\n    // Exactamente un @\n    if input.matches('@').count() != 1 {\n        return false;\n    }\n    // Split por @\n    let (local, dominio) = match input.split_once('@') {\n        Some(p) => p,\n        None => return false,\n    };\n    // Parte local no vacía y dominio contiene punto\n    !local.is_empty() && dominio.contains('.')\n}\n\nfn main() {\n    let cases = [\n        \"ana@gmail.com\",\n        \"juan@empresa.co\",\n        \"sin-arroba\",\n        \"ana@@dos.com\",\n        \"@sin-local.com\",\n        \"ana@dominio\",\n        \" ana@gmail.com\",\n        \"Ana@gmail.com\",\n    ];\n\n    for c in cases {\n        println!(\"{:30} → {}\", format!(\"'{}'\", c), is_valid_email(c));\n    }\n}",
          "hints": [
            "Métodos útiles de `&str`: `.trim()`, `.matches(char).count()`, `.split_once(char)`, `.is_empty()`, `.contains(char)`, `.chars()`.",
            "Para iterar sobre los caracteres y comprobar mayúsculas: `input.chars().any(|c| c.is_uppercase())`. `.any()` devuelve `true` si **al menos un** elemento cumple la condición.",
            "Tip de estilo: 'return early' con `if cond { return false; }` es más legible que un único return al final con muchas condiciones encadenadas con `&&`."
          ],
          "explanation": "**Por qué validamos así y no con regex:**\n\n- En Rust, regex requiere el crate `regex` (no está en std). Para casos simples como este, los métodos de `&str` son suficientes y más rápidos.\n- Los métodos como `.matches(char).count()` son **idiomáticos**: el iterator devuelve referencias a las coincidencias, `.count()` materializa el conteo.\n- `.split_once(char)` es perfecto cuando esperas exactamente una división: devuelve `Option<(&str, &str)>` y `None` si no se encontró el separador.\n\n**Para casos reales** (validar emails de verdad), usa el crate `email_address` o equivalente. Esto fue un ejercicio para practicar `&str` — la validación real de emails es famosa por ser sorprendentemente compleja (RFC 5321/5322 acepta cosas raras como `\"a b\"@example.com`)."
        }
      ]
    },
    {
      "id": "m05_l03",
      "moduleId": "m05",
      "moduleSlug": "m05_collections_errors",
      "order": 3,
      "title": "HashMaps",
      "blocks": [
        {
          "type": "first-principles",
          "title": "HashMap: encontrar por clave en vez de buscar uno por uno",
          "problem": "Si tienes miles de elementos y buscas recorriendo desde el inicio cada vez, el trabajo crece rápido. Necesitas una forma de ir casi directo al dato.",
          "mentalModel": "Un `HashMap` es como un casillero: das una clave, una función hash decide el casillero y allí vive el valor.",
          "concreteExample": "Para contar palabras en un texto, la palabra es la clave y el contador es el valor. Cada vez que ves la palabra, vas a su casillero y sumas uno.",
          "remember": "HashMap cambia el problema de “buscar en una lista” a “calcular dónde debería estar”."
        },
        {
          "type": "challenge",
          "conceptId": "m05-distinct-words",
          "title": "Antes de leer: ¿cuántas palabras distintas?",
          "prompt": "**Tu reto:** escribe `palabras_distintas(texto: &str) -> usize` que cuente cuántas palabras **distintas** hay (separadas por espacios). Por ejemplo, `\"a b a c\"` tiene 3 distintas.\n\nPista: `texto.split_whitespace()` te da las palabras una por una. ¿Cómo evitas contar repetidas? Inténtalo y dale a Verificar.",
          "starterCode": "use std::collections::HashSet;\n\nfn palabras_distintas(texto: &str) -> usize {\n    // cuenta solo las distintas\n    \n}",
          "tests": "fn main() {\n    assert_eq!(palabras_distintas(\"a b a c\"), 3);\n    assert_eq!(palabras_distintas(\"hola hola hola\"), 1);\n    assert_eq!(palabras_distintas(\"\"), 0);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "use std::collections::HashSet;\n\nfn palabras_distintas(texto: &str) -> usize {\n    texto.split_whitespace().collect::<HashSet<_>>().len()\n}",
          "reveal": "La clave es una **colección que no permite duplicados**: una `HashSet`. Al meter todas las palabras en ella, las repetidas se descartan solas, y `.len()` te da cuántas únicas quedaron:\n\n```rust\nuse std::collections::HashSet;\n\nfn palabras_distintas(texto: &str) -> usize {\n    texto.split_whitespace().collect::<HashSet<_>>().len()\n}\n```\n\n`HashSet` y `HashMap` son hermanos: el `Set` guarda solo claves únicas; el `Map` guarda claves únicas con un valor asociado (ideal para *contar* cuántas veces aparece cada palabra). Ambos encuentran las cosas \"calculando dónde deberían estar\" en vez de recorrer toda la lista. Eso es lo que verás ahora. 👇"
        },
        {
          "type": "text",
          "body": "## El Problema: buscar datos por clave\r\n\r\nCon vectores, buscar un elemento requiere recorrer toda la lista (O(n)). Si tienes miles de elementos, esto es lento. Necesitas una estructura que permita buscar por clave en tiempo constante:"
        },
        {
          "type": "text",
          "body": "## La solución: HashMap<K, V>\r\n\r\nUn `HashMap` almacena pares **clave-valor**. Dado una clave, puedes encontrar su valor en tiempo O(1). Es equivalente a `dict` en Python, `Map` en JavaScript, o `HashMap` en Java:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::collections::HashMap;\r\n\r\nfn main() {\r\n    // Crear un HashMap\r\n    let mut edades: HashMap<String, u32> = HashMap::new();\r\n\r\n    // Insertar pares clave-valor\r\n    edades.insert(String::from(\"Ana\"), 28);\r\n    edades.insert(String::from(\"Carlos\"), 35);\r\n    edades.insert(String::from(\"Lucia\"), 22);\r\n\r\n    println!(\"Edades: {:?}\", edades);\r\n\r\n    // Acceso seguro con .get() -> Option<&V>\r\n    match edades.get(\"Ana\") {\r\n        Some(edad) => println!(\"Ana tiene {} anos\", edad),\r\n        None => println!(\"Ana no encontrada\"),\r\n    }\r\n\r\n    // Verificar si existe una clave\r\n    println!(\"Existe Carlos? {}\", edades.contains_key(\"Carlos\"));\r\n    println!(\"Existe Pedro? {}\", edades.contains_key(\"Pedro\"));\r\n\r\n    // Longitud\r\n    println!(\"Total: {} personas\", edades.len());\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Actualizar valores"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::collections::HashMap;\r\n\r\nfn main() {\r\n    let mut puntos: HashMap<String, i32> = HashMap::new();\r\n\r\n    // Insertar: si la clave existe, se sobreescribe\r\n    puntos.insert(String::from(\"Ana\"), 100);\r\n    puntos.insert(String::from(\"Ana\"), 200);  // Sobreescribe!\r\n    println!(\"Ana: {}\", puntos[\"Ana\"]);  // 200\r\n\r\n    // entry + or_insert: solo inserta si la clave NO existe\r\n    puntos.entry(String::from(\"Ana\")).or_insert(999);      // No cambia (ya existe)\r\n    puntos.entry(String::from(\"Carlos\")).or_insert(150);   // Inserta (no existia)\r\n    println!(\"Ana: {}, Carlos: {}\", puntos[\"Ana\"], puntos[\"Carlos\"]);\r\n\r\n    // entry + or_insert para contar ocurrencias (patron comun!)\r\n    let texto = \"hola mundo hola rust hola\";\r\n    let mut conteo: HashMap<&str, i32> = HashMap::new();\r\n\r\n    for palabra in texto.split_whitespace() {\r\n        let cuenta = conteo.entry(palabra).or_insert(0);\r\n        *cuenta += 1;  // Incrementar el valor\r\n    }\r\n    println!(\"Conteo de palabras: {:?}\", conteo);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Iterar sobre HashMaps"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::collections::HashMap;\r\n\r\nfn main() {\r\n    let mut inventario: HashMap<&str, u32> = HashMap::new();\r\n    inventario.insert(\"manzanas\", 50);\r\n    inventario.insert(\"bananas\", 30);\r\n    inventario.insert(\"naranjas\", 45);\r\n    inventario.insert(\"uvas\", 0);\r\n\r\n    // Iterar sobre pares clave-valor\r\n    println!(\"=== Inventario ===\");\r\n    for (fruta, cantidad) in &inventario {\r\n        println!(\"{}: {} unidades\", fruta, cantidad);\r\n    }\r\n\r\n    // Filtrar: solo los que tienen stock\r\n    println!(\"\\n=== Con stock ===\");\r\n    for (fruta, cantidad) in &inventario {\r\n        if *cantidad > 0 {\r\n            println!(\"{}: {}\", fruta, cantidad);\r\n        }\r\n    }\r\n\r\n    // Sumar total\r\n    let total: u32 = inventario.values().sum();\r\n    println!(\"\\nTotal de frutas: {}\", total);\r\n\r\n    // Eliminar una clave\r\n    inventario.remove(\"uvas\");\r\n    println!(\"Despues de eliminar uvas: {} tipos\", inventario.len());\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Ejemplo práctico: sistema de calificaciones"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "use std::collections::HashMap;\r\n\r\nfn main() {\r\n    let notas = vec![\r\n        (\"Ana\", vec![85, 92, 78]),\r\n        (\"Carlos\", vec![90, 88, 95]),\r\n        (\"Lucia\", vec![70, 65, 80]),\r\n    ];\r\n\r\n    let mut promedios: HashMap<&str, f64> = HashMap::new();\r\n\r\n    for (nombre, calificaciones) in &notas {\r\n        let suma: i32 = calificaciones.iter().sum();\r\n        let prom = suma as f64 / calificaciones.len() as f64;\r\n        promedios.insert(nombre, prom);\r\n    }\r\n\r\n    println!(\"{:<10} | {:>10}\", \"Estudiante\", \"Promedio\");\r\n    println!(\"{}\", \"-\".repeat(25));\r\n    for (nombre, prom) in &promedios {\r\n        let estado = if *prom >= 80.0 { \"Aprobado\" } else { \"Repaso\" };\r\n        println!(\"{:<10} | {:>7.1} ({})\", nombre, prom, estado);\r\n    }\r\n\r\n    // Mejor promedio\r\n    if let Some((mejor, nota)) = promedios.iter()\r\n        .max_by(|a, b| a.1.partial_cmp(b.1).unwrap()) {\r\n        println!(\"\\nMejor estudiante: {} con {:.1}\", mejor, nota);\r\n    }\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**HashMap no mantiene orden!**\r\nA diferencia de un Vec, los elementos de un HashMap no tienen orden garantizado. Si necesitas orden de insercion, usa `BTreeMap` en su lugar (de `std::collections::BTreeMap`)."
        },
        {
          "type": "quiz",
          "question": "Qué patron usas para contar cuantas veces aparece cada palabra en un texto?",
          "options": [
            {
              "text": "Un Vec con la palabra y el conteo",
              "correct": false
            },
            {
              "text": "`entry().or_insert(0)` seguido de `*cuenta += 1`",
              "correct": true
            },
            {
              "text": "Usar `.contains()` y luego `.insert()`",
              "correct": false
            },
            {
              "text": "Crear un nuevo HashMap para cada palabra",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Que devuelve `map.get(\"clave\")` si la clave no existe?",
          "options": [
            {
              "text": "Un valor por defecto (0, \"\", etc.)",
              "correct": false
            },
            {
              "text": "None (devuelve Option<&V>)",
              "correct": true
            },
            {
              "text": "Panic / error en tiempo de ejecución",
              "correct": false
            },
            {
              "text": "Error de compilación",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Contador de palabras: la entrada de HashMap idiomática",
          "language": "rust",
          "prompt": "Quieres contar cuántas veces aparece cada palabra en un texto. Esto es el clásico 'word count'. La solución ingenua usa `if contains() else insert()` — el patrón **NO idiomático** que produce 2 lookups innecesarios.\n\nLa forma idiomática usa **`HashMap::entry`**, una API diseñada exactamente para 'inserta si no existe, modifica si existe' en un solo lookup.\n\nTu tarea: implementa `word_count` que reciba `&str`, separe por espacios y devuelva `HashMap<String, u32>` con las frecuencias. **Usa `entry()` y `or_insert(0)`** — no resuelvas con `if .contains_key()`.",
          "starterCode": "use std::collections::HashMap;\n\nfn word_count(text: &str) -> HashMap<String, u32> {\n    // TODO: usa entry() para incrementar el contador\n    todo!()\n}\n\nfn main() {\n    let text = \"el perro corre el gato corre rapido el perro\";\n    let counts = word_count(text);\n\n    let mut entries: Vec<(&String, &u32)> = counts.iter().collect();\n    entries.sort_by(|a, b| b.1.cmp(a.1));\n\n    for (word, count) in entries {\n        println!(\"{:10} {}\", word, count);\n    }\n}",
          "solution": "use std::collections::HashMap;\n\nfn word_count(text: &str) -> HashMap<String, u32> {\n    let mut counts = HashMap::new();\n    for word in text.split_whitespace() {\n        *counts.entry(word.to_string()).or_insert(0) += 1;\n    }\n    counts\n}\n\nfn main() {\n    let text = \"el perro corre el gato corre rapido el perro\";\n    let counts = word_count(text);\n\n    let mut entries: Vec<(&String, &u32)> = counts.iter().collect();\n    entries.sort_by(|a, b| b.1.cmp(a.1));\n\n    for (word, count) in entries {\n        println!(\"{:10} {}\", word, count);\n    }\n}",
          "hints": [
            "`text.split_whitespace()` separa por espacios (uno o varios). Mejor que `split(' ')` que crearía strings vacíos si hubiera espacios dobles.",
            "`map.entry(key)` devuelve un `Entry` que representa esa posición del map. `.or_insert(0)` significa: 'si no existe, ponle 0; en cualquier caso devuelve referencia mutable al valor'.",
            "El operador `*` antes de `counts.entry(...).or_insert(0)` desreferencia la `&mut u32` para poder hacer `+= 1`. Sin el `*`, intentarías sumar a la referencia, no al valor."
          ],
          "explanation": "**Lo que aprendiste:**\n\n```rust\n*map.entry(key).or_insert(0) += 1;\n```\n\nEsta única línea reemplaza:\n```rust\nif map.contains_key(&key) {  // lookup 1\n    let v = map.get_mut(&key).unwrap();  // lookup 2\n    *v += 1;\n} else {\n    map.insert(key, 1);  // lookup 3\n}\n```\n\nUn solo lookup, sin `.unwrap()`, sin código duplicado.\n\n**Otras variantes útiles de `entry`:**\n- `.or_insert_with(|| expensive())` — el default solo se calcula si la clave no existe.\n- `.and_modify(|v| *v += 1).or_insert(1)` — bifurcar entre 'existe' (modificar) y 'no existe' (insertar valor inicial diferente).\n\n**Aplicación real:** esta técnica aparece constantemente en código Rust: contar votos, agrupar items por categoría, construir índices, deduplicar con conteos. Memorízala."
        }
      ]
    },
    {
      "id": "m05_l04",
      "moduleId": "m05",
      "moduleSlug": "m05_collections_errors",
      "order": 4,
      "title": "Closures: funciones anónimas",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Closures: guardar una pequeña regla para usarla después",
          "problem": "A veces no quieres definir una función grande con nombre. Sólo necesitas pasar una regla breve: cómo filtrar, cómo transformar o qué hacer con cada elemento.",
          "mentalModel": "Una closure es una función de bolsillo. Puede usar valores cercanos, como una nota que recuerda el contexto donde fue escrita.",
          "concreteExample": "Si tienes precios y quieres quedarte con los mayores a cierto límite, puedes pasar `|precio| precio > limite`. La closure sabe usar `limite` del entorno.",
          "remember": "Las closures son comportamiento como dato: puedes pasarlas, guardarlas y combinarlas."
        },
        {
          "type": "challenge",
          "conceptId": "m05-closure-twice",
          "title": "Antes de leer: una función que recibe otra función",
          "prompt": "**Tu reto:** escribe `aplicar_dos_veces` que reciba una función `f` y un número `x`, y devuelva el resultado de aplicar `f` **dos veces** a `x`. Por ejemplo, con `f = |n| n + 1` y `x = 5`, el resultado es `7` (5 → 6 → 7).\n\nLa firma con `<F: Fn(i32) -> i32>` ya está puesta. Inténtalo y dale a Verificar.",
          "starterCode": "fn aplicar_dos_veces<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {\n    // aplica f a x, y luego f al resultado\n    \n}",
          "tests": "fn main() {\n    assert_eq!(aplicar_dos_veces(|n| n + 1, 5), 7);\n    assert_eq!(aplicar_dos_veces(|n| n * 2, 3), 12);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn aplicar_dos_veces<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {\n    f(f(x))\n}",
          "reveal": "Una **closure** es una función que puedes guardar en una variable o **pasar como argumento**, igual que cualquier otro dato. `|n| n + 1` es una closure que suma 1.\n\n```rust\nfn aplicar_dos_veces<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {\n    f(f(x))   // aplica f, y al resultado le aplica f otra vez\n}\n```\n\nEl `<F: Fn(i32) -> i32>` dice: *\"F es cualquier cosa que se pueda llamar con un `i32` y devuelva un `i32`\"*. Esto es lo que hace posible `.map(...)`, `.filter(...)` y toda la maquinaria de iteradores: les pasas comportamiento como si fuera un valor. Eso es lo que verás ahora. 👇"
        },
        {
          "type": "text",
          "body": "## ¿Qué es un Closure?\r\n\r\nUn **closure** (clausura) es una función sin nombre que puedes guardar en una variable, pasar como argumento a otra función, o crear en el momento que la necesites. Si vienes de Python, son como las funciones `lambda`. Si vienes de JavaScript, son como las arrow functions `() => {}`.\r\n\r\nLa diferencia clave con las funciones normales es que un closure puede **capturar** (acceder a) variables del código que lo rodea.\r\n\r\nLa sintaxis usa barras verticales `|parámetros|` en lugar de paréntesis:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    // Funcion normal vs Closure - hacen lo mismo\r\n    fn sumar_fn(a: i32, b: i32) -> i32 { a + b }\r\n\r\n    let sumar_closure = |a: i32, b: i32| -> i32 { a + b };\r\n\r\n    println!(\"Funcion: {}\", sumar_fn(3, 4));\r\n    println!(\"Closure: {}\", sumar_closure(3, 4));\r\n\r\n    // El closure puede inferir los tipos (lo mas comun)\r\n    let duplicar = |x| x * 2;\r\n    println!(\"Duplicar 5: {}\", duplicar(5));\r\n\r\n    // Si el cuerpo es una sola expresion, no necesita llaves\r\n    let es_par = |n: i32| n % 2 == 0;\r\n    println!(\"4 es par? {}\", es_par(4));\r\n    println!(\"7 es par? {}\", es_par(7));\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Sintaxis de closures:**\r\n```\r\n|parámetros| expresión                    // Una línea, sin llaves\r\n|parámetros| { varias; líneas; }         // Multiples líneas, con llaves\r\n|parámetros| -> TipoRetorno { cuerpo }   // Con tipo de retorno explícito\r\n|| println!(\"sin parámetros\")             // Sin parámetros\r\n```\r\nRust infiere los tipos de los parámetros y del retorno en la mayoría de los casos, así que usualmente no necesitas escribirlos."
        },
        {
          "type": "text",
          "body": "## Captura de variables: la magia de los closures\r\n\r\nLo que hace especiales a los closures es que pueden **capturar** variables del scope donde fueron creados. Una función normal no puede hacer esto:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let nombre = \"Ferris\";\r\n    let umbral = 10;\r\n\r\n    // Este closure captura 'nombre' del scope exterior\r\n    let saludar = || println!(\"Hola, {}!\", nombre);\r\n    saludar();  // Imprime: Hola, Ferris!\r\n\r\n    // Este closure captura 'umbral' y lo usa para comparar\r\n    let es_grande = |n: i32| n > umbral;\r\n    println!(\"15 es grande? {}\", es_grande(15));  // true\r\n    println!(\"5 es grande? {}\", es_grande(5));     // false\r\n\r\n    // Las variables capturadas siguen disponibles\r\n    println!(\"Umbral era: {}\", umbral);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Closures mutables\r\n\r\nSi un closure necesita modificar una variable capturada, tanto el closure como la variable deben ser `mut`:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let mut contador = 0;\r\n\r\n    // El closure es mut porque modifica 'contador'\r\n    let mut incrementar = || {\r\n        contador += 1;\r\n        println!(\"Contador: {}\", contador);\r\n    };\r\n\r\n    incrementar();  // Contador: 1\r\n    incrementar();  // Contador: 2\r\n    incrementar();  // Contador: 3\r\n\r\n    // Nota: no podemos usar 'contador' mientras el closure lo tiene prestado\r\n    // Solo podemos usarlo despues de que el closure ya no se use\r\n    // (Rust aplica las mismas reglas de borrowing que ya conocemos)\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Closures como parámetros de función\r\n\r\nLa verdadera utilidad de los closures es pasarlos como argumentos. Esto permite crear funciones que son **personalizables** por quien las llama:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "// Esta funcion recibe un closure que decide como transformar un numero\r\nfn aplicar_operacion(valor: i32, operacion: impl Fn(i32) -> i32) -> i32 {\r\n    operacion(valor)\r\n}\r\n\r\n// Esta funcion aplica un closure a cada elemento y muestra el resultado\r\nfn mostrar_transformados(numeros: &[i32], transformar: impl Fn(i32) -> String) {\r\n    for n in numeros {\r\n        println!(\"{}\", transformar(*n));\r\n    }\r\n}\r\n\r\nfn main() {\r\n    // Pasamos diferentes closures a la misma funcion\r\n    println!(\"Doble de 5: {}\", aplicar_operacion(5, |x| x * 2));\r\n    println!(\"Cuadrado de 5: {}\", aplicar_operacion(5, |x| x * x));\r\n    println!(\"Mas uno de 5: {}\", aplicar_operacion(5, |x| x + 1));\r\n\r\n    let notas = [85, 92, 78, 95];\r\n\r\n    println!(\"\\n--- Formato con estrellas ---\");\r\n    mostrar_transformados(&notas, |n| {\r\n        let estrellas = if n >= 90 { \"***\" } else if n >= 80 { \"**\" } else { \"*\" };\r\n        format!(\"Nota {}: {}\", n, estrellas)\r\n    });\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Las tres formas de capturar: `Fn`, `FnMut`, `FnOnce`\r\n\r\nUn closure captura una variable de una de tres formas, dependiendo de **qué hace** con ella. Rust elige la forma menos restrictiva automáticamente:\r\n\r\n| Trait | El closure... | Puede llamarse | Analogía |\r\n|---|---|---|---|\r\n| `Fn` | **lee** la variable (`&T`) | muchas veces | Mirar una foto |\r\n| `FnMut` | **modifica** la variable (`&mut T`) | muchas veces (con `mut`) | Escribir en una libreta |\r\n| `FnOnce` | **consume** la variable (la mueve) | **solo una vez** | Comerse una galleta — ya no existe |\r\n\r\nEsto importa porque define **qué firmas de función aceptan tu closure** como argumento. La mayoría de funciones que reciben un closure piden `Fn` (lo más general), pero `for_each` por ejemplo pide `FnMut`."
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let saludo = String::from(\"Hola\");\r\n\r\n    // Fn: SOLO LEE la variable capturada\r\n    //   Puede llamarse cualquier número de veces\r\n    let imprimir = || println!(\"{}, mundo!\", saludo);\r\n    imprimir();\r\n    imprimir();  // OK, se puede llamar de nuevo\r\n    println!(\"'saludo' sigue disponible: {}\", saludo);\r\n\r\n    // FnMut: MODIFICA la variable capturada\r\n    //   El closure debe ser declarado `mut` para llamarse\r\n    let mut contador = 0;\r\n    let mut incrementar = || {\r\n        contador += 1;\r\n        println!(\"contador = {}\", contador);\r\n    };\r\n    incrementar();\r\n    incrementar();  // OK, se puede llamar de nuevo\r\n\r\n    // FnOnce: CONSUME la variable capturada (la mueve hacia dentro)\r\n    //   Solo se puede llamar UNA VEZ\r\n    let mensaje = String::from(\"adiós\");\r\n    let consumir = move || {\r\n        // `move` fuerza el traspaso de ownership al closure\r\n        let final_msg = mensaje;  // mensaje se mueve aquí dentro\r\n        println!(\"Mensaje final: {}\", final_msg);\r\n        // Al terminar el closure, final_msg se libera con drop\r\n    };\r\n    consumir();\r\n    // consumir();  // ERROR si descomentas: el closure ya fue consumido\r\n    // println!(\"{}\", mensaje);  // ERROR si descomentas: mensaje fue movido\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "**Regla mental simple:**\r\n- ¿El closure solo **lee** datos externos? → es `Fn`\r\n- ¿El closure **escribe** sobre datos externos? → es `FnMut`\r\n- ¿El closure se **queda** con datos externos (los mueve dentro)? → es `FnOnce`\r\n\r\nCuando aceptas un closure como parámetro, `impl Fn(T) -> U` acepta los tres tipos siempre que el closure no necesite mutar/consumir nada. Es la opción por defecto más flexible."
        },
        {
          "type": "text",
          "body": "## El error clásico: capturar y usar después\r\n\r\nCuando un closure **mueve** una variable hacia dentro (con `move` o porque consume), no puedes seguir usando esa variable fuera. Este es uno de los errores más comunes al empezar:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let datos = vec![1, 2, 3];\r\n\r\n    // `move` fuerza que el closure se quede con `datos`\r\n    let imprimir = move || println!(\"{:?}\", datos);\r\n\r\n    imprimir();\r\n    println!(\"{:?}\", datos);  // ERROR! datos ya fue movido al closure\r\n}",
          "runnable": false
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Error del compilador:**\r\n```\r\nerror[E0382]: borrow of moved value: `datos`\r\n --> src/main.rs:7:22\r\n  |\r\n2 |     let datos = vec![1, 2, 3];\r\n  |         ----- move occurs because `datos` has type `Vec<i32>`\r\n4 |     let imprimir = move || println!(\"{:?}\", datos);\r\n  |                    ------- variable moved due to use in closure\r\n7 |     println!(\"{:?}\", datos);\r\n  |                      ^^^^^ value borrowed here after move\r\n```\r\n**Solución:** quita `move` si solo necesitas leer (queda como `Fn`), o clona si necesitas dos copias: `let imprimir = { let datos = datos.clone(); move || println!(\"{:?}\", datos) };`."
        },
        {
          "type": "text",
          "body": "## Ejemplo práctico: filtro personalizable"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn filtrar_numeros(numeros: &[i32], criterio: impl Fn(i32) -> bool) -> Vec<i32> {\r\n    let mut resultado = Vec::new();\r\n    for &n in numeros {\r\n        if criterio(n) {\r\n            resultado.push(n);\r\n        }\r\n    }\r\n    resultado\r\n}\r\n\r\nfn main() {\r\n    let datos = vec![1, 15, 3, 22, 7, 42, 8, 11, 30];\r\n\r\n    let pares = filtrar_numeros(&datos, |n| n % 2 == 0);\r\n    println!(\"Pares: {:?}\", pares);\r\n\r\n    let mayores_de_10 = filtrar_numeros(&datos, |n| n > 10);\r\n    println!(\"Mayores de 10: {:?}\", mayores_de_10);\r\n\r\n    let rango = filtrar_numeros(&datos, |n| n >= 5 && n <= 20);\r\n    println!(\"Entre 5 y 20: {:?}\", rango);\r\n\r\n    // Closure que captura una variable externa\r\n    let limite = 25;\r\n    let menores_del_limite = filtrar_numeros(&datos, |n| n < limite);\r\n    println!(\"Menores de {}: {:?}\", limite, menores_del_limite);\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Resumen de esta lección:**\r\n- Un **closure** es una función anónima: `|params| expresión`\r\n- Puede **capturar** variables del scope donde fue creado\r\n- Tres modos de captura: `Fn` (lee), `FnMut` (modifica), `FnOnce` (consume)\r\n- Rust elige el modo menos restrictivo automáticamente\r\n- `move ||` fuerza que las variables capturadas se transfieran al closure\r\n- Se usan mucho como argumentos de funciones (veremos esto con iteradores en la siguiente lección)"
        },
        {
          "type": "quiz",
          "question": "¿Qué hace especial a un closure comparado con una función normal?",
          "options": [
            {
              "text": "Es más rápido que una función",
              "correct": false
            },
            {
              "text": "Puede capturar variables del scope donde fue creado",
              "correct": true
            },
            {
              "text": "Siempre devuelve un valor",
              "correct": false
            },
            {
              "text": "Solo funciona con números",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Un closure que modifica una variable capturada (`contador += 1;`) ¿qué trait implementa?",
          "options": [
            {
              "text": "`Fn` — porque modificar es leer",
              "correct": false
            },
            {
              "text": "`FnMut` — porque modifica la variable capturada",
              "correct": true
            },
            {
              "text": "`FnOnce` — solo se puede llamar una vez",
              "correct": false
            },
            {
              "text": "Ninguno, el código no compila",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Cómo se escribe un closure que recibe un i32 y devuelve el doble?",
          "options": [
            {
              "text": "|x| x * 2",
              "correct": true
            },
            {
              "text": "fn(x) => x * 2",
              "correct": false
            },
            {
              "text": "lambda x: x * 2",
              "correct": false
            },
            {
              "text": "{x -> x * 2}",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Retry con callback: closure como parámetro de función",
          "language": "rust",
          "prompt": "Estás escribiendo una utilidad de reintentos para llamadas HTTP. Quieres que el llamador defina **qué hacer** en cada intento, y tú te encargas de la lógica de retry.\n\nTu tarea: implementa `retry` que:\n\n- Reciba `max_attempts: u32` y una closure `action: F` donde `F: FnMut() -> Result<T, String>`.\n- Llame a `action()` hasta que devuelva `Ok(T)` o se acaben los intentos.\n- Devuelva `Result<T, String>`: `Ok` con el valor, o `Err` con el mensaje del último intento fallido.\n\nFirma esperada:\n```rust\nfn retry<F, T>(max_attempts: u32, mut action: F) -> Result<T, String>\nwhere F: FnMut() -> Result<T, String>\n```",
          "starterCode": "fn retry<F, T>(max_attempts: u32, mut action: F) -> Result<T, String>\nwhere\n    F: FnMut() -> Result<T, String>,\n{\n    // TODO: llama action() hasta max_attempts veces\n    todo!()\n}\n\nfn main() {\n    let mut intentos = 0;\n    let resultado = retry(3, || {\n        intentos += 1;\n        println!(\"Intento #{}...\", intentos);\n        if intentos < 3 {\n            Err(format!(\"timeout en intento {}\", intentos))\n        } else {\n            Ok(\"datos recibidos\")\n        }\n    });\n\n    match resultado {\n        Ok(v) => println!(\"✓ {}\", v),\n        Err(e) => println!(\"✗ Falló tras {} intentos: {}\", intentos, e),\n    }\n}",
          "solution": "fn retry<F, T>(max_attempts: u32, mut action: F) -> Result<T, String>\nwhere\n    F: FnMut() -> Result<T, String>,\n{\n    let mut last_error = String::from(\"no se intentó\");\n    for _ in 0..max_attempts {\n        match action() {\n            Ok(value) => return Ok(value),\n            Err(e) => last_error = e,\n        }\n    }\n    Err(last_error)\n}\n\nfn main() {\n    let mut intentos = 0;\n    let resultado = retry(3, || {\n        intentos += 1;\n        println!(\"Intento #{}...\", intentos);\n        if intentos < 3 {\n            Err(format!(\"timeout en intento {}\", intentos))\n        } else {\n            Ok(\"datos recibidos\")\n        }\n    });\n\n    match resultado {\n        Ok(v) => println!(\"✓ {}\", v),\n        Err(e) => println!(\"✗ Falló tras {} intentos: {}\", intentos, e),\n    }\n}",
          "hints": [
            "Necesitas un bucle `for _ in 0..max_attempts`. En cada iteración llama `action()` y revisa el resultado.",
            "Si `action()` devuelve `Ok(v)`, sales inmediatamente con `return Ok(v)`. Si devuelve `Err(e)`, guarda el error y sigue intentando.",
            "Al final del bucle, devuelve `Err(last_error)` — el último error encontrado. Inicializa la variable con un mensaje neutro antes del bucle."
          ],
          "explanation": "**Por qué `FnMut` y no `Fn`:**\n\n- `Fn` → la closure solo *lee* su entorno. No puede mutar capturas.\n- `FnMut` → la closure puede *mutar* sus capturas. Necesario aquí porque el ejemplo en `main` hace `intentos += 1` dentro de la closure.\n- `FnOnce` → la closure puede *consumir* sus capturas. Solo se puede llamar **una vez**.\n\nSi declaras `F: Fn` en la firma, el `main` del ejemplo no compilaría porque la closure muta `intentos`.\n\n**Patrón a recordar:** las funciones que reciben closures genéricas usan `where F: Fn...`. Es exactamente el patrón de `Vec::iter().map(...)`, `tokio::spawn(...)`, `thread::spawn(...)`, etc. Hacer tu propia versión es lo que separa 'sé Rust' de 'puedo extender Rust'.\n\n**En producción**, usa `tokio-retry` o similar — añaden backoff exponencial, jitter, etc. Pero el core es exactamente este ejercicio."
        }
      ]
    },
    {
      "id": "m05_l05",
      "moduleId": "m05",
      "moduleSlug": "m05_collections_errors",
      "order": 5,
      "title": "Iteradores: la forma elegante de procesar datos",
      "blocks": [
        {
          "type": "first-principles",
          "title": "Iteradores: describir un recorrido sin hacerlo todo a mano",
          "problem": "Recorrer colecciones con índices manuales produce errores: saltarte elementos, salirte del rango o mezclar transformación con control de bucle.",
          "mentalModel": "Un iterador es una cinta transportadora. Cada paso entrega el siguiente elemento, y puedes conectar máquinas: filtrar, transformar, contar, sumar.",
          "concreteExample": "En vez de escribir un bucle para recorrer números, preguntar si son pares y sumarlos, puedes expresar la idea: `iter().filter(...).sum()`. El código se parece más al pensamiento.",
          "remember": "Un iterador separa el “qué quiero hacer con los datos” del “cómo avanzo elemento por elemento”."
        },
        {
          "type": "faded-exercise",
          "conceptId": "m05-iter-squares",
          "title": "Práctica guiada: encadenar iteradores",
          "intro": "Vamos a procesar una lista con una cadena de iteradores: filtrar, transformar y sumar — sin escribir un solo bucle a mano. Observa, completa y hazlo solo.",
          "stages": [
            {
              "kind": "worked",
              "instructions": "**Paso 1 — observa.** `suma_pares` recorre la lista, se queda solo con los pares (`filter`) y los suma (`sum`). Cada `.metodo()` conecta una pieza a la cinta transportadora.",
              "code": "fn suma_pares(nums: &[i32]) -> i32 {\n    nums.iter()\n        .filter(|&&n| n % 2 == 0)\n        .sum()\n}"
            },
            {
              "kind": "faded",
              "instructions": "**Paso 2 — completa.** Ahora además de filtrar pares, hay que elevarlos al cuadrado con `map` antes de sumar. Rellena los `___`.",
              "code": "fn suma_pares_al_cuadrado(nums: &[i32]) -> i32 {\n    nums.iter()\n        .filter(|&&n| n % 2 == 0)\n        .map(|&n| n ___ n)\n        .___()\n}"
            },
            {
              "kind": "solo",
              "instructions": "**Paso 3 — tú solo.** Escribe `suma_pares_al_cuadrado` con la cadena completa: `.iter().filter(...).map(...).sum()`.",
              "code": "fn suma_pares_al_cuadrado(nums: &[i32]) -> i32 {\n    // tu cadena de iteradores aquí\n}"
            }
          ],
          "tests": "fn main() {\n    assert_eq!(suma_pares_al_cuadrado(&[1, 2, 3, 4]), 20);\n    assert_eq!(suma_pares_al_cuadrado(&[1, 3, 5]), 0);\n    assert_eq!(suma_pares_al_cuadrado(&[2, 4]), 20);\n    println!(\"__ALL_TESTS_PASSED__\");\n}",
          "solution": "fn suma_pares_al_cuadrado(nums: &[i32]) -> i32 {\n    nums.iter()\n        .filter(|&&n| n % 2 == 0)\n        .map(|&n| n * n)\n        .sum()\n}"
        },
        {
          "type": "text",
          "body": "## El Problema: bucles repetitivos y verbosos\r\n\r\nImagina que tienes una lista de números y quieres: filtrar los pares, multiplicar cada uno por 3, y sumar todo. Con bucles `for` tradicionales, necesitarias escribir mucho código repetitivo:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\r\n\r\n    // Forma VERBOSA con bucles for\r\n    let mut pares = Vec::new();\r\n    for n in &numeros {\r\n        if n % 2 == 0 {\r\n            pares.push(*n);\r\n        }\r\n    }\r\n\r\n    let mut triplicados = Vec::new();\r\n    for n in &pares {\r\n        triplicados.push(n * 3);\r\n    }\r\n\r\n    let mut suma = 0;\r\n    for n in &triplicados {\r\n        suma += n;\r\n    }\r\n    println!(\"Resultado (bucles): {}\", suma);\r\n\r\n    // Forma ELEGANTE con iteradores (una sola linea!)\r\n    let resultado: i32 = numeros.iter()\r\n        .filter(|&&n| n % 2 == 0)\r\n        .map(|&n| n * 3)\r\n        .sum();\r\n    println!(\"Resultado (iteradores): {}\", resultado);\r\n\r\n    // Ambos dan 90: (2+4+6+8+10) * 3 = 90\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Qué es un iterador?\r\n\r\nUn **iterador** es un objeto que produce una secuencia de valores, uno a la vez. Piensa en ello como una **cinta transportadora** en una fabrica: los elementos pasan uno por uno, y en cada estacion puedes transformarlos, filtrarlos, o contarlos.\r\n\r\nPara crear un iterador a partir de una coleccion, usas `.iter()`:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let frutas = vec![\"manzana\", \"banana\", \"cereza\", \"durazno\"];\r\n\r\n    // .iter() crea un iterador que produce referencias (&) a cada elemento\r\n    // Los metodos del iterador usan closures (leccion anterior) para procesar\r\n    for fruta in frutas.iter() {\r\n        println!(\"Fruta: {}\", fruta);\r\n    }\r\n\r\n    // De hecho, el for loop usa iteradores internamente!\r\n    // Esto es exactamente lo mismo:\r\n    for fruta in &frutas {\r\n        println!(\"Tambien: {}\", fruta);\r\n    }\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Los métodos más importantes\r\n\r\nLos iteradores tienen métodos que reciben **closures** (lo que aprendimos en la leccion anterior) para definir que hacer con cada elemento. Estos son los que usaras el 90% del tiempo:\r\n\r\n### filter: quedarse solo con algunos elementos"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\r\n\r\n    // filter: solo pasa los elementos donde el closure devuelve true\r\n    let pares: Vec<&i32> = numeros.iter()\r\n        .filter(|&&n| n % 2 == 0)\r\n        .collect();  // collect() convierte el iterador en un Vec\r\n    println!(\"Pares: {:?}\", pares);  // [2, 4, 6, 8, 10]\r\n\r\n    let palabras = vec![\"Rust\", \"es\", \"un\", \"lenguaje\", \"potente\"];\r\n    let largas: Vec<&&str> = palabras.iter()\r\n        .filter(|p| p.len() > 2)\r\n        .collect();\r\n    println!(\"Palabras largas: {:?}\", largas);  // [\"Rust\", \"lenguaje\", \"potente\"]\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### map: transformar cada elemento"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5];\r\n\r\n    // map: aplica una transformacion a cada elemento\r\n    let cuadrados: Vec<i32> = numeros.iter()\r\n        .map(|&n| n * n)\r\n        .collect();\r\n    println!(\"Cuadrados: {:?}\", cuadrados);  // [1, 4, 9, 16, 25]\r\n\r\n    let nombres = vec![\"ana\", \"bob\", \"carlos\"];\r\n    let mayusculas: Vec<String> = nombres.iter()\r\n        .map(|n| n.to_uppercase())\r\n        .collect();\r\n    println!(\"Mayusculas: {:?}\", mayusculas);  // [\"ANA\", \"BOB\", \"CARLOS\"]\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### Encadenar filter + map (lo más común)"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\r\n\r\n    // Encadenar: filtrar pares, luego multiplicar por 10\r\n    let pares_x10: Vec<i32> = numeros.iter()\r\n        .filter(|&&n| n % 2 == 0)   // Solo pares: 2, 4, 6, 8, 10\r\n        .map(|&n| n * 10)            // Multiplicar: 20, 40, 60, 80, 100\r\n        .collect();\r\n    println!(\"Pares x10: {:?}\", pares_x10);\r\n\r\n    // Puedes encadenar tantos como necesites\r\n    let resultado: Vec<String> = numeros.iter()\r\n        .filter(|&&n| n > 3)            // Solo > 3: 4, 5, 6, 7, 8, 9, 10\r\n        .filter(|&&n| n < 8)            // Solo < 8: 4, 5, 6, 7\r\n        .map(|&n| format!(\"[{}]\", n))   // Formatear: \"[4]\", \"[5]\", \"[6]\", \"[7]\"\r\n        .collect();\r\n    println!(\"Resultado: {:?}\", resultado);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### fold y sum: reducir a un solo valor\r\n\r\n`fold` toma todos los elementos y los combina en un solo resultado usando un **acumulador**. Piensa en ello como: empiezas con un valor inicial, y para cada elemento, lo combinas con el acumulador:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5];\r\n\r\n    // sum: sumar todos los elementos (el caso mas comun)\r\n    let suma: i32 = numeros.iter().sum();\r\n    println!(\"Suma: {}\", suma);  // 15\r\n\r\n    // fold: version general de sum (tu defines la operacion)\r\n    // fold(valor_inicial, |acumulador, elemento| nueva_valor_acumulador)\r\n    let suma_fold = numeros.iter().fold(0, |acc, &x| acc + x);\r\n    println!(\"Suma con fold: {}\", suma_fold);  // 15\r\n\r\n    // Producto de todos los numeros\r\n    let producto = numeros.iter().fold(1, |acc, &x| acc * x);\r\n    println!(\"Producto: {}\", producto);  // 1*2*3*4*5 = 120\r\n\r\n    // Construir un string con fold\r\n    let palabras = vec![\"Rust\", \"es\", \"increible\"];\r\n    let frase = palabras.iter()\r\n        .fold(String::new(), |acc, &palabra| {\r\n            if acc.is_empty() { String::from(palabra) }\r\n            else { format!(\"{} {}\", acc, palabra) }\r\n        });\r\n    println!(\"Frase: {}\", frase);\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "### Otros métodos útiles"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let numeros = vec![1, 2, 3, 4, 5, 6];\r\n\r\n    // find: buscar el primero que cumpla la condicion\r\n    let primer_par = numeros.iter().find(|&&n| n % 2 == 0);\r\n    println!(\"Primer par: {:?}\", primer_par);  // Some(2)\r\n\r\n    // any: hay al menos uno que cumple?\r\n    let hay_mayor_5 = numeros.iter().any(|&n| n > 5);\r\n    println!(\"Hay mayor a 5? {}\", hay_mayor_5);  // true\r\n\r\n    // all: todos cumplen?\r\n    let todos_positivos = numeros.iter().all(|&n| n > 0);\r\n    println!(\"Todos positivos? {}\", todos_positivos);  // true\r\n\r\n    // count: contar elementos (despues de filtrar es muy util)\r\n    let cuantos_pares = numeros.iter().filter(|&&n| n % 2 == 0).count();\r\n    println!(\"Cuantos pares: {}\", cuantos_pares);  // 3\r\n\r\n    // enumerate: agregar indice a cada elemento\r\n    let frutas = vec![\"manzana\", \"banana\", \"cereza\"];\r\n    for (i, fruta) in frutas.iter().enumerate() {\r\n        println!(\"  {}: {}\", i, fruta);\r\n    }\r\n\r\n    // max y min\r\n    println!(\"Maximo: {:?}\", numeros.iter().max());  // Some(6)\r\n    println!(\"Minimo: {:?}\", numeros.iter().min());  // Some(1)\r\n}",
          "runnable": true
        },
        {
          "type": "text",
          "body": "## Los iteradores son perezosos (lazy)\r\n\r\nUn detalle importante: los iteradores **no hacen nada** hasta que los \"consumes\" con un método como `.collect()`, `.sum()`, `.count()`, `.for_each()`, etc. Simplemente crear una cadena de `.filter().map()` no procesa ningún elemento.\r\n\r\nEsto es una ventaja: significa que `.filter().map().filter()` **no crea colecciones intermedias**. Cada elemento pasa por toda la cadena uno a la vez, como en una cinta transportadora. Es muy eficiente."
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Adaptadores vs Consumidores:**\r\n- **Adaptadores** (perezosos, crean nuevo iterador): `filter()`, `map()`, `enumerate()`, `take()`, `skip()`, `zip()`\r\n- **Consumidores** (procesan y devuelven un resultado): `collect()`, `sum()`, `count()`, `for_each()`, `find()`, `any()`, `all()`, `fold()`, `max()`, `min()`\r\n\r\nSiempre necesitas terminar con un consumidor para que la cadena se ejecute."
        },
        {
          "type": "text",
          "body": "## Demostración: el adaptador no ejecuta nada\r\n\r\nEl siguiente ejemplo lo prueba poniendo un `println!` dentro de `map()`. Verás que el mensaje **NO se imprime** hasta que llega un consumidor:"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let datos = vec![1, 2, 3];\r\n\r\n    println!(\"=== Solo adaptador (perezoso): ===\");\r\n    let _no_ejecutado = datos.iter()\r\n        .map(|x| {\r\n            println!(\"  procesando {}\", x);  // No se ejecuta!\r\n            x * 10\r\n        });\r\n    println!(\"(no se imprimió nada — la cadena nunca se ejecutó)\");\r\n\r\n    println!(\"\\n=== Con consumidor `.collect()`: ===\");\r\n    let resultado: Vec<i32> = datos.iter()\r\n        .map(|x| {\r\n            println!(\"  procesando {}\", x);  // SÍ se ejecuta\r\n            x * 10\r\n        })\r\n        .collect();\r\n    println!(\"resultado = {:?}\", resultado);\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "tip",
          "body": "**Regla práctica para detectar el bug del olvidado consumidor:** si tu cadena `.iter().map().filter()...` parece \"no hacer nada\", revisa si terminaste con `.collect()`, `.sum()`, `.for_each()` o similar. El compilador te avisa con un `#[must_use]` warning."
        },
        {
          "type": "text",
          "body": "## Ejemplo completo: procesamiento de ventas"
        },
        {
          "type": "code",
          "language": "rust",
          "code": "fn main() {\r\n    let ventas = vec![\r\n        (\"Laptop\", 999.99, 3),\r\n        (\"Mouse\", 29.99, 15),\r\n        (\"Teclado\", 79.99, 8),\r\n        (\"Monitor\", 449.99, 5),\r\n        (\"Cable USB\", 9.99, 50),\r\n    ];\r\n\r\n    // Total de ingresos\r\n    let total: f64 = ventas.iter()\r\n        .map(|(_, precio, cantidad)| precio * *cantidad as f64)\r\n        .sum();\r\n    println!(\"Ingresos totales: ${:.2}\", total);\r\n\r\n    // Producto mas vendido (por cantidad)\r\n    let mas_vendido = ventas.iter()\r\n        .max_by_key(|(_, _, cant)| *cant);\r\n    if let Some((nombre, _, cant)) = mas_vendido {\r\n        println!(\"Mas vendido: {} ({} unidades)\", nombre, cant);\r\n    }\r\n\r\n    // Productos con ingreso > $500\r\n    let grandes: Vec<_> = ventas.iter()\r\n        .filter(|(_, precio, cant)| precio * *cant as f64 > 500.0)\r\n        .map(|(nombre, precio, cant)| {\r\n            format!(\"{}: ${:.2}\", nombre, precio * *cant as f64)\r\n        })\r\n        .collect();\r\n    println!(\"Ventas > $500: {:?}\", grandes);\r\n\r\n    // Unidades totales\r\n    let unidades: i32 = ventas.iter().map(|(_, _, c)| *c).sum();\r\n    println!(\"Total unidades: {}\", unidades);\r\n}",
          "runnable": true
        },
        {
          "type": "callout",
          "variant": "info",
          "body": "**Resumen de esta leccion:**\r\n- Los iteradores procesan colecciones de forma **declarativa** (dices QUE quieres, no COMO hacerlo)\r\n- `.filter()` selecciona, `.map()` transforma, `.fold()`/`.sum()` acumula\r\n- Se pueden encadenar multiples operaciones en una sola expresión\r\n- Son **perezosos**: no procesan nada hasta que llamas a un consumidor\r\n- Son tan rápidos (o más) que los bucles `for` manuales, porque no crean colecciones intermedias"
        },
        {
          "type": "quiz",
          "question": "Qué hace `.filter(|x| condición)` en un iterador?",
          "options": [
            {
              "text": "Elimina los elementos del vector original",
              "correct": false
            },
            {
              "text": "Crea un nuevo iterador que solo produce los elementos que cumplen la condición",
              "correct": true
            },
            {
              "text": "Ordena los elementos",
              "correct": false
            },
            {
              "text": "Cuenta los elementos",
              "correct": false
            }
          ]
        },
        {
          "type": "quiz",
          "question": "¿Por qué los iteradores de Rust son eficientes a pesar de encadenar multiples operaciones?",
          "options": [
            {
              "text": "Porque Rust es un lenguaje compilado",
              "correct": false
            },
            {
              "text": "Porque son perezosos: procesan elemento por elemento sin crear colecciones intermedias",
              "correct": true
            },
            {
              "text": "Porque usan multiples hilos internamente",
              "correct": false
            },
            {
              "text": "No son eficientes, los bucles for son más rápidos",
              "correct": false
            }
          ]
        },
        {
          "type": "exercise",
          "title": "Pipeline de iteradores: estadísticas de logs",
          "language": "rust",
          "prompt": "Tienes un slice de strings, cada uno representa una línea de log con formato `\"LEVEL message...\"`. Quieres calcular las **estadísticas de errores**:\n\n1. **Total de líneas ERROR**: cuenta cuántas empiezan con `\"ERROR \"`.\n2. **Promedio de longitud** de las líneas ERROR (cantidad de bytes).\n3. **El mensaje de error más largo**.\n\nTu tarea: implementa los 3 cálculos **sin usar `for` loops** — todo con iteradores encadenados. Usa `.filter()`, `.map()`, `.count()`, `.sum::<usize>()`, `.max_by_key()`.\n\nFirmas:\n```rust\nfn error_count(logs: &[&str]) -> usize\nfn error_avg_length(logs: &[&str]) -> f64\nfn longest_error(logs: &[&str]) -> Option<&str>\n```",
          "starterCode": "fn error_count(logs: &[&str]) -> usize {\n    todo!()\n}\n\nfn error_avg_length(logs: &[&str]) -> f64 {\n    todo!()\n}\n\nfn longest_error(logs: &[&str]) -> Option<&str> {\n    todo!()\n}\n\nfn main() {\n    let logs = [\n        \"INFO server started on :8080\",\n        \"ERROR connection refused to db.host:5432\",\n        \"INFO health check ok\",\n        \"ERROR timeout reading from upstream after 30s waiting response\",\n        \"WARN slow query detected, 2.3s\",\n        \"ERROR 401 unauthorized\",\n    ];\n\n    println!(\"Errores: {}\", error_count(&logs));\n    println!(\"Promedio long. error: {:.1}\", error_avg_length(&logs));\n    println!(\"Más largo: {:?}\", longest_error(&logs));\n}",
          "solution": "fn error_count(logs: &[&str]) -> usize {\n    logs.iter().filter(|l| l.starts_with(\"ERROR \")).count()\n}\n\nfn error_avg_length(logs: &[&str]) -> f64 {\n    let errors: Vec<&&str> = logs.iter().filter(|l| l.starts_with(\"ERROR \")).collect();\n    if errors.is_empty() {\n        return 0.0;\n    }\n    let total: usize = errors.iter().map(|l| l.len()).sum();\n    total as f64 / errors.len() as f64\n}\n\nfn longest_error(logs: &[&str]) -> Option<&str> {\n    logs.iter()\n        .filter(|l| l.starts_with(\"ERROR \"))\n        .max_by_key(|l| l.len())\n        .copied()\n}\n\nfn main() {\n    let logs = [\n        \"INFO server started on :8080\",\n        \"ERROR connection refused to db.host:5432\",\n        \"INFO health check ok\",\n        \"ERROR timeout reading from upstream after 30s waiting response\",\n        \"WARN slow query detected, 2.3s\",\n        \"ERROR 401 unauthorized\",\n    ];\n\n    println!(\"Errores: {}\", error_count(&logs));\n    println!(\"Promedio long. error: {:.1}\", error_avg_length(&logs));\n    println!(\"Más largo: {:?}\", longest_error(&logs));\n}",
          "hints": [
            "`.starts_with(\"ERROR \")` devuelve `bool` — perfecto para `.filter()`. Recuerda el espacio después: sin él contarías 'ERROR_PARSE' o similares.",
            "Para el promedio: necesitas `total / count`. Como `count` es `usize`, debes convertir ambos a `f64` antes de dividir. Maneja el caso de 0 errores para no dividir por cero.",
            "`.max_by_key(|x| key(x))` devuelve el elemento con mayor clave. Si no hay elementos, devuelve `None`. Para slices, te devuelve `Option<&&str>` que conviertes a `Option<&str>` con `.copied()`."
          ],
          "explanation": "**Por qué este patrón es Rust idiomático:**\n\n```rust\nlogs.iter()\n    .filter(|l| l.starts_with(\"ERROR \"))\n    .max_by_key(|l| l.len())\n    .copied()\n```\n\nMisma lógica que escrita imperativa:\n```rust\nlet mut max_log: Option<&str> = None;\nlet mut max_len = 0;\nfor log in logs {\n    if log.starts_with(\"ERROR \") {\n        if log.len() > max_len {\n            max_len = log.len();\n            max_log = Some(*log);\n        }\n    }\n}\n```\n\n10 líneas vs 4. Y la versión idiomática no tiene bug potencial de 'olvidé inicializar `max_len`'.\n\n**Métodos terminales que cierran un pipeline:**\n- `.count()` → `usize`\n- `.sum::<T>()` → suma todos (requiere tipo).\n- `.collect::<Vec<_>>()` → materializa.\n- `.max() / .min() / .max_by_key(...)` → opcional, puede no haber elementos.\n- `.fold(init, |acc, x| ...)` → reduce a un valor (la versión más general).\n- `.any(|x| ...) / .all(|x| ...)` → bool.\n- `.find(|x| ...)` → primer match (Option).\n\n**Esto es el día a día de Rust:** scripts, parsers, transformaciones de datos. Si dominas iteradores, escribes 60% del código real."
        }
      ]
    }
  ]
}

export default module

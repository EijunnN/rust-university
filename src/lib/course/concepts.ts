// Concept registry — the atomic units of mastery.
//
// A lesson teaches one or more *concepts*. Mastery is tracked per concept
// (not per lesson), and concepts resurface for spaced review. Each concept
// carries a self-contained `review` exercise so the "Repaso de hoy" session
// can quiz it without needing the original lesson loaded.
//
// Verification convention (see verifyRust): the learner implements FUNCTIONS
// only — no `fn main`. `tests` provides the harness with assertions and must
// print __ALL_TESTS_PASSED__ on success.

export type ConceptReview = {
  prompt: string // markdown — what to implement, in plain language
  starterCode: string // function signature(s) for the learner to fill
  tests: string // appended harness with asserts + success sentinel
  solution: string // canonical solution
}

export type Concept = {
  id: string
  moduleId: string
  name: string // short label, shown in review queue and mastery map
  summary: string // one line — what you should be able to do
  review: ConceptReview
}

const PASS = 'println!("__ALL_TESTS_PASSED__");'

export const CONCEPTS: Concept[] = [
  {
    id: 'm02-fn-return',
    moduleId: 'm02',
    name: 'Devolver valores',
    summary: 'Una función devuelve el valor de su última expresión (sin `;`).',
    review: {
      prompt:
        'Escribe una función `cuadrado(n: i32) -> i32` que devuelva `n` multiplicado por sí mismo.\n\nRecuerda: en Rust la **última expresión sin punto y coma** es el valor que devuelve la función.',
      starterCode: `fn cuadrado(n: i32) -> i32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(cuadrado(3), 9, "cuadrado(3) deberia ser 9");
    assert_eq!(cuadrado(0), 0, "cuadrado(0) deberia ser 0");
    assert_eq!(cuadrado(-4), 16, "cuadrado(-4) deberia ser 16");
    ${PASS}
}`,
      solution: `fn cuadrado(n: i32) -> i32 {
    n * n
}`,
    },
  },
  {
    id: 'm02-fn-params',
    moduleId: 'm02',
    name: 'Parámetros',
    summary: 'Una función recibe datos a través de parámetros tipados.',
    review: {
      prompt:
        'Escribe una función `suma(a: i32, b: i32) -> i32` que devuelva la suma de sus dos parámetros.',
      starterCode: `fn suma(a: i32, b: i32) -> i32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(suma(2, 3), 5, "suma(2, 3) deberia ser 5");
    assert_eq!(suma(-1, 1), 0, "suma(-1, 1) deberia ser 0");
    assert_eq!(suma(100, 250), 350, "suma(100, 250) deberia ser 350");
    ${PASS}
}`,
      solution: `fn suma(a: i32, b: i32) -> i32 {
    a + b
}`,
    },
  },
  {
    id: 'm02-fn-conditional',
    moduleId: 'm02',
    name: 'Devolver según una condición',
    summary: 'Usar `if/else` como expresión para decidir qué valor devolver.',
    review: {
      prompt:
        'Escribe `maximo(a: i32, b: i32) -> i32` que devuelva el mayor de los dos números.\n\nPista: en Rust `if/else` es una expresión — puede ser el valor que devuelves.',
      starterCode: `fn maximo(a: i32, b: i32) -> i32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(maximo(2, 5), 5, "maximo(2, 5) deberia ser 5");
    assert_eq!(maximo(9, 4), 9, "maximo(9, 4) deberia ser 9");
    assert_eq!(maximo(-3, -7), -3, "maximo(-3, -7) deberia ser -3");
    ${PASS}
}`,
      solution: `fn maximo(a: i32, b: i32) -> i32 {
    if a > b {
        a
    } else {
        b
    }
}`,
    },
  },
  {
    id: 'm03-borrow-len',
    moduleId: 'm03',
    name: 'Tomar prestado (borrow)',
    summary:
      'Pasar una referencia `&` para leer un dato sin volverte su dueño.',
    review: {
      prompt:
        'Escribe `longitud(s: &String) -> usize` que devuelva cuántos bytes tiene el texto, **sin tomar posesión** de él.\n\nLa función recibe una referencia `&String` (un préstamo): puede leer el dato pero no es su dueña, así que quien la llamó sigue pudiendo usar su `String`.',
      starterCode: `fn longitud(s: &String) -> usize {
    // Tu código aquí
}`,
      tests: `fn main() {
    let s = String::from("hola");
    assert_eq!(longitud(&s), 4, "longitud de 'hola' deberia ser 4");
    // Como solo lo prestamos, s sigue disponible aqui:
    assert_eq!(s, "hola");
    assert_eq!(longitud(&String::from("")), 0, "longitud de '' deberia ser 0");
    ${PASS}
}`,
      solution: `fn longitud(s: &String) -> usize {
    s.len()
}`,
    },
  },
  {
    id: 'm03-slice-first-word',
    moduleId: 'm03',
    name: 'Slices de string',
    summary: 'Devolver una porción (`&str`) de un texto sin copiarlo.',
    review: {
      prompt:
        'Escribe `primera_palabra(s: &str) -> &str` que devuelva la primera palabra del texto (hasta el primer espacio). Si no hay espacios, devuelve todo el texto.\n\nDevuelves un **slice**: una vista a una parte del texto original, sin copiar nada.',
      starterCode: `fn primera_palabra(s: &str) -> &str {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(primera_palabra("hola mundo"), "hola");
    assert_eq!(primera_palabra("rust"), "rust");
    assert_eq!(primera_palabra("uno dos tres"), "uno");
    ${PASS}
}`,
      solution: `fn primera_palabra(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    s
}`,
    },
  },
  {
    id: 'm04-struct-method',
    moduleId: 'm04',
    name: 'Struct con método',
    summary: 'Definir un tipo propio y darle comportamiento con `impl`.',
    review: {
      prompt:
        'Define un struct `Rectangulo` con campos `ancho: u32` y `alto: u32`, y un método `area(&self) -> u32` que devuelva su área.',
      starterCode: `struct Rectangulo {
    // campos aquí
}

impl Rectangulo {
    // método area aquí
}`,
      tests: `fn main() {
    let r = Rectangulo { ancho: 3, alto: 4 };
    assert_eq!(r.area(), 12, "area de 3x4 deberia ser 12");
    let c = Rectangulo { ancho: 5, alto: 5 };
    assert_eq!(c.area(), 25, "area de 5x5 deberia ser 25");
    ${PASS}
}`,
      solution: `struct Rectangulo {
    ancho: u32,
    alto: u32,
}

impl Rectangulo {
    fn area(&self) -> u32 {
        self.ancho * self.alto
    }
}`,
    },
  },
  {
    id: 'm04-enum-match',
    moduleId: 'm04',
    name: 'Enum + match',
    summary: 'Decidir un valor según la variante de un enum con `match`.',
    review: {
      prompt:
        'El enum `Luz` ya está definido. Escribe `segundos(luz: &Luz) -> u32` que devuelva la duración de cada luz con `match`: `Roja` → 30, `Amarilla` → 5, `Verde` → 25.',
      starterCode: `enum Luz {
    Roja,
    Amarilla,
    Verde,
}

fn segundos(luz: &Luz) -> u32 {
    // usa match
}`,
      tests: `fn main() {
    assert_eq!(segundos(&Luz::Roja), 30);
    assert_eq!(segundos(&Luz::Amarilla), 5);
    assert_eq!(segundos(&Luz::Verde), 25);
    ${PASS}
}`,
      solution: `enum Luz {
    Roja,
    Amarilla,
    Verde,
}

fn segundos(luz: &Luz) -> u32 {
    match luz {
        Luz::Roja => 30,
        Luz::Amarilla => 5,
        Luz::Verde => 25,
    }
}`,
    },
  },
  {
    id: 'm04-option',
    moduleId: 'm04',
    name: 'Devolver Option',
    summary: 'Representar "puede no haber valor" con `Some`/`None`.',
    review: {
      prompt:
        'Escribe `dividir(a: f64, b: f64) -> Option<f64>` que devuelva `Some(a / b)`, o `None` cuando `b` sea 0 (para no dividir entre cero).',
      starterCode: `fn dividir(a: f64, b: f64) -> Option<f64> {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(dividir(10.0, 2.0), Some(5.0));
    assert_eq!(dividir(1.0, 0.0), None);
    assert_eq!(dividir(9.0, 3.0), Some(3.0));
    ${PASS}
}`,
      solution: `fn dividir(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None
    } else {
        Some(a / b)
    }
}`,
    },
  },
  {
    id: 'm05-iter-squares',
    moduleId: 'm05',
    name: 'Cadena de iteradores',
    summary: 'Transformar datos con `.iter().filter().map().sum()`.',
    review: {
      prompt:
        'Escribe `suma_pares_al_cuadrado(nums: &[i32]) -> i32` que sume los **cuadrados de los números pares**.\n\nHazlo con una cadena de iteradores: `.iter().filter(...).map(...).sum()`.',
      starterCode: `fn suma_pares_al_cuadrado(nums: &[i32]) -> i32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(suma_pares_al_cuadrado(&[1, 2, 3, 4]), 20); // 2^2 + 4^2
    assert_eq!(suma_pares_al_cuadrado(&[1, 3, 5]), 0);
    assert_eq!(suma_pares_al_cuadrado(&[2, 4]), 20);
    ${PASS}
}`,
      solution: `fn suma_pares_al_cuadrado(nums: &[i32]) -> i32 {
    nums.iter().filter(|&&n| n % 2 == 0).map(|&n| n * n).sum()
}`,
    },
  },
  {
    id: 'm01-greet',
    moduleId: 'm01',
    name: 'Devolver un texto',
    summary: 'Una función puede construir y devolver un `String`.',
    review: {
      prompt:
        'Escribe `saludo() -> String` que devuelva el texto `Hola, Rust!`.\n\nPista: `String::from("...")` crea un `String` a partir de un texto.',
      starterCode: `fn saludo() -> String {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(saludo(), "Hola, Rust!");
    ${PASS}
}`,
      solution: `fn saludo() -> String {
    String::from("Hola, Rust!")
}`,
    },
  },
  {
    id: 'm01-format',
    moduleId: 'm01',
    name: 'Formatear texto',
    summary: 'Insertar valores dentro de un texto con `format!`.',
    review: {
      prompt:
        'Escribe `saludar(nombre: &str) -> String` que devuelva `Hola, ` seguido del nombre y un `!`. Por ejemplo, `saludar("Ana")` devuelve `Hola, Ana!`.\n\nUsa `format!("Hola, {}!", nombre)`.',
      starterCode: `fn saludar(nombre: &str) -> String {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(saludar("Ana"), "Hola, Ana!");
    assert_eq!(saludar("Ferris"), "Hola, Ferris!");
    ${PASS}
}`,
      solution: `fn saludar(nombre: &str) -> String {
    format!("Hola, {}!", nombre)
}`,
    },
  },
  {
    id: 'm02-mut-sum',
    moduleId: 'm02',
    name: 'Variable mutable',
    summary: 'Acumular un resultado con `let mut` dentro de un bucle.',
    review: {
      prompt:
        'Escribe `suma_hasta(n: u32) -> u32` que sume todos los números de 1 hasta `n` (incluido).\n\nNecesitarás una variable acumuladora **mutable** (`let mut`).',
      starterCode: `fn suma_hasta(n: u32) -> u32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(suma_hasta(5), 15);
    assert_eq!(suma_hasta(1), 1);
    assert_eq!(suma_hasta(0), 0);
    ${PASS}
}`,
      solution: `fn suma_hasta(n: u32) -> u32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}`,
    },
  },
  {
    id: 'm02-tuple-minmax',
    moduleId: 'm02',
    name: 'Tuplas',
    summary: 'Devolver varios valores juntos en una tupla.',
    review: {
      prompt:
        'Escribe `min_max(a: i32, b: i32) -> (i32, i32)` que devuelva una tupla con el **menor primero** y el **mayor después**.',
      starterCode: `fn min_max(a: i32, b: i32) -> (i32, i32) {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(min_max(3, 8), (3, 8));
    assert_eq!(min_max(9, 2), (2, 9));
    assert_eq!(min_max(5, 5), (5, 5));
    ${PASS}
}`,
      solution: `fn min_max(a: i32, b: i32) -> (i32, i32) {
    if a <= b {
        (a, b)
    } else {
        (b, a)
    }
}`,
    },
  },
  {
    id: 'm02-control-factorial',
    moduleId: 'm02',
    name: 'Bucles y control',
    summary: 'Repetir una operación con un bucle para calcular un resultado.',
    review: {
      prompt:
        'Escribe `factorial(n: u64) -> u64` que devuelva el factorial de `n` (el producto de 1 × 2 × … × n). Por definición, `factorial(0)` es 1.',
      starterCode: `fn factorial(n: u64) -> u64 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(factorial(0), 1);
    assert_eq!(factorial(3), 6);
    assert_eq!(factorial(5), 120);
    ${PASS}
}`,
      solution: `fn factorial(n: u64) -> u64 {
    let mut resultado = 1;
    for i in 1..=n {
        resultado *= i;
    }
    resultado
}`,
    },
  },
  {
    id: 'm03-own-take',
    moduleId: 'm03',
    name: 'Tomar posesión',
    summary: 'Una función que recibe un valor por valor se vuelve su dueña.',
    review: {
      prompt:
        'Escribe `longitud_propia(s: String) -> usize` que reciba un `String` **por valor** (tomando posesión) y devuelva su longitud en bytes.',
      starterCode: `fn longitud_propia(s: String) -> usize {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(longitud_propia(String::from("hola")), 4);
    assert_eq!(longitud_propia(String::from("")), 0);
    ${PASS}
}`,
      solution: `fn longitud_propia(s: String) -> usize {
    s.len()
}`,
    },
  },
  {
    id: 'm03-move-return',
    moduleId: 'm03',
    name: 'Mover y devolver',
    summary: 'Recibir posesión, modificar el dato y devolverlo.',
    review: {
      prompt:
        'Escribe `agregar(s: String) -> String` que reciba un `String`, le añada un signo `!` al final, y lo devuelva.\n\nPista: para poder modificarlo, el parámetro debe ser `mut s: String`, y `s.push(\'!\')` agrega un carácter.',
      starterCode: `fn agregar(mut s: String) -> String {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(agregar(String::from("hola")), "hola!");
    assert_eq!(agregar(String::from("")), "!");
    ${PASS}
}`,
      solution: `fn agregar(mut s: String) -> String {
    s.push('!');
    s
}`,
    },
  },
  {
    id: 'm03-clone-two',
    moduleId: 'm03',
    name: 'Clonar datos',
    summary: 'Crear copias independientes con `.to_string()` / `.clone()`.',
    review: {
      prompt:
        'Escribe `dos_copias(s: &str) -> (String, String)` que devuelva **dos copias independientes** del texto recibido.\n\nPista: `s.to_string()` crea un `String` nuevo a partir del `&str`.',
      starterCode: `fn dos_copias(s: &str) -> (String, String) {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(dos_copias("hi"), (String::from("hi"), String::from("hi")));
    assert_eq!(dos_copias("rust"), (String::from("rust"), String::from("rust")));
    ${PASS}
}`,
      solution: `fn dos_copias(s: &str) -> (String, String) {
    (s.to_string(), s.to_string())
}`,
    },
  },
  {
    id: 'm03-lifetime-longest',
    moduleId: 'm03',
    name: 'Lifetimes',
    summary:
      'Devolver una de dos referencias requiere anotar que viven lo mismo.',
    review: {
      prompt:
        'Escribe `mas_largo<\'a>(a: &\'a str, b: &\'a str) -> &\'a str` que devuelva la referencia al texto **más largo** (por número de bytes). Si empatan, devuelve `a`.\n\nLa anotación `\'a` le promete a Rust que el resultado vive tanto como las entradas.',
      starterCode: `fn mas_largo<'a>(a: &'a str, b: &'a str) -> &'a str {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(mas_largo("hola", "hi"), "hola");
    assert_eq!(mas_largo("a", "bbb"), "bbb");
    assert_eq!(mas_largo("igual", "xxxxx"), "igual");
    ${PASS}
}`,
      solution: `fn mas_largo<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() {
        a
    } else {
        b
    }
}`,
    },
  },
  {
    id: 'm04-struct-build',
    moduleId: 'm04',
    name: 'Construir un struct',
    summary: 'Definir un tipo con campos y crear instancias de él.',
    review: {
      prompt:
        'Define un struct `Usuario` con campos `nombre: String` y `edad: u32`. Luego escribe `crear(nombre: String, edad: u32) -> Usuario` que construya y devuelva un `Usuario` con esos datos.',
      starterCode: `struct Usuario {
    // campos aquí
}

fn crear(nombre: String, edad: u32) -> Usuario {
    // Tu código aquí
}`,
      tests: `fn main() {
    let u = crear(String::from("Ana"), 30);
    assert_eq!(u.nombre, "Ana");
    assert_eq!(u.edad, 30);
    ${PASS}
}`,
      solution: `struct Usuario {
    nombre: String,
    edad: u32,
}

fn crear(nombre: String, edad: u32) -> Usuario {
    Usuario { nombre, edad }
}`,
    },
  },
  {
    id: 'm05-vec-sum',
    moduleId: 'm05',
    name: 'Recorrer un Vec',
    summary: 'Sumar todos los elementos de una lista.',
    review: {
      prompt:
        'Escribe `suma(v: &[i32]) -> i32` que devuelva la suma de todos los elementos de la lista. Una lista vacía suma 0.',
      starterCode: `fn suma(v: &[i32]) -> i32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(suma(&[1, 2, 3]), 6);
    assert_eq!(suma(&[10, -5, 5]), 10);
    assert_eq!(suma(&[]), 0);
    ${PASS}
}`,
      solution: `fn suma(v: &[i32]) -> i32 {
    v.iter().sum()
}`,
    },
  },
  {
    id: 'm05-string-reverse',
    moduleId: 'm05',
    name: 'Invertir un texto',
    summary: 'Recorrer los caracteres de un `&str` y recomponerlos.',
    review: {
      prompt:
        'Escribe `invertir(s: &str) -> String` que devuelva el texto al revés. Por ejemplo, `invertir("hola")` devuelve `"aloh"`.\n\nPista: `s.chars().rev().collect()` recorre los caracteres en orden inverso.',
      starterCode: `fn invertir(s: &str) -> String {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(invertir("hola"), "aloh");
    assert_eq!(invertir("rust"), "tsur");
    assert_eq!(invertir(""), "");
    ${PASS}
}`,
      solution: `fn invertir(s: &str) -> String {
    s.chars().rev().collect()
}`,
    },
  },
  {
    id: 'm05-distinct-words',
    moduleId: 'm05',
    name: 'Contar con un mapa',
    summary: 'Usar una colección para contar elementos únicos.',
    review: {
      prompt:
        'Escribe `palabras_distintas(texto: &str) -> usize` que devuelva cuántas palabras **distintas** hay en el texto (separadas por espacios).\n\nPista: una `HashSet` guarda solo valores únicos. `texto.split_whitespace()` te da las palabras.',
      starterCode: `use std::collections::HashSet;

fn palabras_distintas(texto: &str) -> usize {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(palabras_distintas("a b a c"), 3);
    assert_eq!(palabras_distintas("hola hola hola"), 1);
    assert_eq!(palabras_distintas(""), 0);
    ${PASS}
}`,
      solution: `use std::collections::HashSet;

fn palabras_distintas(texto: &str) -> usize {
    texto.split_whitespace().collect::<HashSet<_>>().len()
}`,
    },
  },
  {
    id: 'm05-closure-twice',
    moduleId: 'm05',
    name: 'Closures',
    summary: 'Recibir una función como argumento y aplicarla.',
    review: {
      prompt:
        'Escribe `aplicar_dos_veces<F: Fn(i32) -> i32>(f: F, x: i32) -> i32` que aplique la función `f` **dos veces** a `x`. Por ejemplo, con `f = |n| n + 1` y `x = 5`, el resultado es `7`.',
      starterCode: `fn aplicar_dos_veces<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(aplicar_dos_veces(|n| n + 1, 5), 7);
    assert_eq!(aplicar_dos_veces(|n| n * 2, 3), 12);
    ${PASS}
}`,
      solution: `fn aplicar_dos_veces<F: Fn(i32) -> i32>(f: F, x: i32) -> i32 {
    f(f(x))
}`,
    },
  },
  {
    id: 'm06-generic-fn',
    moduleId: 'm06',
    name: 'Funciones genéricas',
    summary: 'Escribir una función con parámetro de tipo y bound.',
    review: {
      prompt:
        'Escribe `mayor<T: PartialOrd>(a: T, b: T) -> T` que devuelva el mayor de los dos valores (en empate, el primero). Una sola función genérica — nada de copias por tipo.',
      starterCode: `fn mayor<T: PartialOrd>(a: T, b: T) -> T {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(mayor(8, 3), 8);
    assert_eq!(mayor('a', 'z'), 'z');
    assert_eq!(mayor(2.5, 2.5), 2.5);
    ${PASS}
}`,
      solution: `fn mayor<T: PartialOrd>(a: T, b: T) -> T {
    if a >= b { a } else { b }
}`,
    },
  },
  {
    id: 'm06-trait-impl',
    moduleId: 'm06',
    name: 'Implementar un trait',
    summary: 'Cumplir el contrato de un trait para un tipo propio.',
    review: {
      prompt:
        'Te damos el trait `Describible` y el struct `Libro`. Implementa el trait para que `describir()` devuelva `"{titulo} ({paginas} págs.)"` — por ejemplo `"Rust (300 págs.)"`.',
      starterCode: `trait Describible {
    fn describir(&self) -> String;
}

struct Libro {
    titulo: String,
    paginas: u32,
}

impl Describible for Libro {
    // Tu código aquí
}`,
      tests: `fn main() {
    let l = Libro { titulo: String::from("Rust"), paginas: 300 };
    assert_eq!(l.describir(), "Rust (300 págs.)");
    ${PASS}
}`,
      solution: `trait Describible {
    fn describir(&self) -> String;
}

struct Libro {
    titulo: String,
    paginas: u32,
}

impl Describible for Libro {
    fn describir(&self) -> String {
        format!("{} ({} págs.)", self.titulo, self.paginas)
    }
}`,
    },
  },
  {
    id: 'm06-fn-bound',
    moduleId: 'm06',
    name: 'Genéricos sobre funciones',
    summary: 'Recibir un closure vía parámetro genérico con bound Fn.',
    review: {
      prompt:
        'Escribe `transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32>` que devuelva un Vec con `f` aplicada a cada elemento. Iteradores de m05: `iter`, `map`, `collect`.',
      starterCode: `fn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(transformar_todos(&[1, 2, 3], |n| n * 10), vec![10, 20, 30]);
    assert_eq!(transformar_todos(&[], |n| n + 1), Vec::<i32>::new());
    ${PASS}
}`,
      solution: `fn transformar_todos<F: Fn(i32) -> i32>(items: &[i32], f: F) -> Vec<i32> {
    items.iter().map(|&n| f(n)).collect()
}`,
    },
  },
  {
    id: 'm06-bound-contains',
    moduleId: 'm06',
    name: 'Bounds: PartialEq',
    summary: 'Elegir el bound correcto para poder comparar con ==.',
    review: {
      prompt:
        'Escribe `contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool` que diga si `objetivo` está en el slice. Recuerda qué capacidad desbloquea el bound `PartialEq`.',
      starterCode: `fn contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert!(contiene(&[1, 2, 3], &2));
    assert!(!contiene(&[1, 2, 3], &9));
    assert!(contiene(&["a", "b"], &"b"));
    ${PASS}
}`,
      solution: `fn contiene<T: PartialEq>(items: &[T], objetivo: &T) -> bool {
    for item in items {
        if item == objetivo {
            return true;
        }
    }
    false
}`,
    },
  },
  {
    id: 'm06-display',
    moduleId: 'm06',
    name: 'Implementar Display',
    summary: 'Darle a un tipo propio el formato "para humanos" del ecosistema.',
    review: {
      prompt:
        'Implementa `Display` para `Temperatura` con el formato `23.5°C`. Recuerda: el cuerpo de `fmt` es un `write!(f, …)` sin punto y coma.',
      starterCode: `use std::fmt;

struct Temperatura {
    celsius: f64,
}

impl fmt::Display for Temperatura {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // Tu código aquí
    }
}`,
      tests: `fn main() {
    assert_eq!(format!("{}", Temperatura { celsius: 23.5 }), "23.5°C");
    assert_eq!(format!("{}", Temperatura { celsius: -5.0 }), "-5°C");
    ${PASS}
}`,
      solution: `use std::fmt;

struct Temperatura {
    celsius: f64,
}

impl fmt::Display for Temperatura {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}°C", self.celsius)
    }
}`,
    },
  },
  {
    id: 'm06-dyn-collection',
    moduleId: 'm06',
    name: 'dyn Trait: colecciones mixtas',
    summary: 'Operar sobre una lista de tipos distintos detrás de Box<dyn Trait>.',
    review: {
      prompt:
        'Te damos el trait `Figura` y dos implementaciones. Escribe `area_total(figuras: &[Box<dyn Figura>]) -> f64` que sume las áreas de todas las figuras de la lista mixta.',
      starterCode: `trait Figura {
    fn area(&self) -> f64;
}

struct Cuadrado { lado: f64 }
struct Triangulo { base: f64, altura: f64 }

impl Figura for Cuadrado {
    fn area(&self) -> f64 { self.lado * self.lado }
}

impl Figura for Triangulo {
    fn area(&self) -> f64 { self.base * self.altura / 2.0 }
}

fn area_total(figuras: &[Box<dyn Figura>]) -> f64 {
    // Tu código aquí
}`,
      tests: `fn main() {
    let figuras: Vec<Box<dyn Figura>> = vec![
        Box::new(Cuadrado { lado: 2.0 }),
        Box::new(Triangulo { base: 3.0, altura: 4.0 }),
    ];
    assert!((area_total(&figuras) - 10.0).abs() < 1e-9);
    assert_eq!(area_total(&[]), 0.0);
    ${PASS}
}`,
      solution: `trait Figura {
    fn area(&self) -> f64;
}

struct Cuadrado { lado: f64 }
struct Triangulo { base: f64, altura: f64 }

impl Figura for Cuadrado {
    fn area(&self) -> f64 { self.lado * self.lado }
}

impl Figura for Triangulo {
    fn area(&self) -> f64 { self.base * self.altura / 2.0 }
}

fn area_total(figuras: &[Box<dyn Figura>]) -> f64 {
    figuras.iter().map(|f| f.area()).sum()
}`,
    },
  },
  {
    id: 'm07-result-divide',
    moduleId: 'm07',
    name: 'Errores como datos',
    summary: 'Devolver Result en vez de panickear ante errores esperables.',
    review: {
      prompt:
        'Escribe `dividir(a: f64, b: f64) -> Result<f64, String>`: si `b` es `0.0` devuelve `Err` con el mensaje exacto `"no se puede dividir entre cero"`; si no, `Ok(a / b)`.',
      starterCode: `fn dividir(a: f64, b: f64) -> Result<f64, String> {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(dividir(10.0, 2.0), Ok(5.0));
    assert_eq!(dividir(7.0, 0.0), Err(String::from("no se puede dividir entre cero")));
    ${PASS}
}`,
      solution: `fn dividir(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("no se puede dividir entre cero"))
    } else {
        Ok(a / b)
    }
}`,
    },
  },
  {
    id: 'm07-error-enum',
    moduleId: 'm07',
    name: 'Enums de error',
    summary: 'Modelar los modos de fallo como variantes tipadas.',
    review: {
      prompt:
        'Implementa `validar_nombre(nombre: &str) -> Result<(), ErrorValidacion>`: menos de 3 caracteres → `Err(MuyCorto)`; más de 20 → `Err(MuyLargo)`; si no → `Ok(())`.',
      starterCode: `#[derive(Debug, PartialEq)]
enum ErrorValidacion {
    MuyCorto,
    MuyLargo,
}

fn validar_nombre(nombre: &str) -> Result<(), ErrorValidacion> {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(validar_nombre("ana"), Ok(()));
    assert_eq!(validar_nombre("yo"), Err(ErrorValidacion::MuyCorto));
    assert_eq!(validar_nombre("nombredeusuarioabsurdamentelargo"), Err(ErrorValidacion::MuyLargo));
    ${PASS}
}`,
      solution: `#[derive(Debug, PartialEq)]
enum ErrorValidacion {
    MuyCorto,
    MuyLargo,
}

fn validar_nombre(nombre: &str) -> Result<(), ErrorValidacion> {
    if nombre.len() < 3 {
        Err(ErrorValidacion::MuyCorto)
    } else if nombre.len() > 20 {
        Err(ErrorValidacion::MuyLargo)
    } else {
        Ok(())
    }
}`,
    },
  },
  {
    id: 'm07-propagate',
    moduleId: 'm07',
    name: 'Propagar con ?',
    summary: 'Delegar errores al llamador con el operador ?.',
    review: {
      prompt:
        'Escribe `sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError>` que parsee ambos textos (con `.trim()`) usando el operador `?` y devuelva la suma. Tres líneas.',
      starterCode: `fn sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(sumar_strs("2", "3"), Ok(5));
    assert_eq!(sumar_strs(" 10 ", "-4"), Ok(6));
    assert!(sumar_strs("dos", "3").is_err());
    ${PASS}
}`,
      solution: `fn sumar_strs(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x: i32 = a.trim().parse()?;
    let y: i32 = b.trim().parse()?;
    Ok(x + y)
}`,
    },
  },
  {
    id: 'm07-question-mark',
    moduleId: 'm07',
    name: 'Tuberías falibles',
    summary: 'Encadenar parse + ? y envolver el resultado en Ok.',
    review: {
      prompt:
        'Escribe `duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError>`: parsea el texto (tras `.trim()`) propagando el error con `?`, y devuelve el doble en `Ok`.',
      starterCode: `fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(duplicar_parseado("21"), Ok(42));
    assert_eq!(duplicar_parseado(" 5 "), Ok(10));
    assert!(duplicar_parseado("x").is_err());
    ${PASS}
}`,
      solution: `fn duplicar_parseado(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n: i32 = s.trim().parse()?;
    Ok(n * 2)
}`,
    },
  },
  {
    id: 'm07-tdd-palindromo',
    moduleId: 'm07',
    name: 'Hacer pasar los tests',
    summary: 'Implementar una función contra un contrato de tests dado.',
    review: {
      prompt:
        'Los tests son el contrato: implementa `es_palindromo(texto: &str) -> bool` que diga si el texto se lee igual al revés (el texto vacío cuenta como palíndromo). Pista: `.chars().rev().collect::<String>()`.',
      starterCode: `fn es_palindromo(texto: &str) -> bool {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert!(es_palindromo("oso"));
    assert!(!es_palindromo("rust"));
    assert!(es_palindromo(""));
    ${PASS}
}`,
      solution: `fn es_palindromo(texto: &str) -> bool {
    let invertido: String = texto.chars().rev().collect();
    invertido == texto
}`,
    },
  },
  {
    id: 'm07-slug',
    moduleId: 'm07',
    name: 'TDD: slug de URLs',
    summary: 'Diseñar contra casos límite escritos de antemano.',
    review: {
      prompt:
        'Implementa `slug(titulo: &str) -> String`: minúsculas, palabras unidas con `-`, espacios múltiples y de borde colapsados. `"Hola  Mundo "` → `"hola-mundo"`. Pista: `to_lowercase` + `split_whitespace` + `join`.',
      starterCode: `fn slug(titulo: &str) -> String {
    // Tu código aquí
}`,
      tests: `fn main() {
    assert_eq!(slug("Hola Mundo"), "hola-mundo");
    assert_eq!(slug("  Rust  es   genial  "), "rust-es-genial");
    assert_eq!(slug(""), "");
    ${PASS}
}`,
      solution: `fn slug(titulo: &str) -> String {
    titulo
        .to_lowercase()
        .split_whitespace()
        .collect::<Vec<_>>()
        .join("-")
}`,
    },
  },
]

const BY_ID = new Map(CONCEPTS.map((c) => [c.id, c]))

export function getConcept(id: string): Concept | undefined {
  return BY_ID.get(id)
}

export function getConcepts(ids: readonly string[]): Concept[] {
  return ids.map((id) => BY_ID.get(id)).filter((c): c is Concept => !!c)
}
